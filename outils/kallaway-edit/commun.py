"""Ce que toutes les étapes du Kallaway edit partagent : la fiche de la vidéo (kallaway.toml), les
chemins, la recherche d'un mot dans la prise, les appels à ffmpeg et à HyperFrames.

Une vidéo = un dossier video/<nom>/ qui contient kallaway.toml. Ce que les étapes calculent va dans
video/<nom>/montage/ (petits JSON, versionnés : on doit pouvoir relire une décision) ; ce qui est
lourd ou se refait en une commande (wav, planches de lèvres) va dans video/<nom>/montage/cache/,
ignoré par git.

Les mots se désignent par une « référence » lisible, jamais par un temps en dur :
    "H2:sucre"      le premier « sucre » de la prise H2
    "TM:gras#1"     le deuxième « gras » de la prise TM (on compte à partir de 0)
    "GE@6"          le 7e mot de la prise GE, si le mot est ambigu ou mal transcrit
    "plan:turn"     le début du plan dont l'id est « turn »
    "fin"           la fin de la vidéo
Pourquoi : quand une prise est recoupée ou recalée, les temps bougent ; les mots, non. Sur l'assiette,
recaler les coupes sur la grille des images a déplacé tous les repères de 10 à 90 ms, et rien de ce
qui était désigné par un mot n'a eu à être retouché.
"""
import io, json, os, re, shutil, subprocess, sys, tomllib

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.abspath(os.path.join(ICI, "..", ".."))       # le dépôt HitMe
# La version épinglée : le 25 septembre 2026, la mise à jour vers la 0.8.77 a planté sur un fichier
# corrompu du cache de npx ; la 0.8.21 passe check sans avertissement. Ne pas changer à l'aveugle.
HF_VERSION = "hyperframes@0.8.21"

# Sous Windows, la console en cp1252 fait planter print() sur « → », « œ » ou « ≈ ».
for flux in (sys.stdout, sys.stderr):
    if hasattr(flux, "reconfigure"):
        flux.reconfigure(encoding="utf-8")


def norm(mot):
    """Un mot tel qu'on le compare : minuscules, sans la ponctuation que Whisper colle aux mots
    (« dessert. », « sucre, »). Les apostrophes restent : Whisper coupe « c'est » en « c » + « 'est »."""
    return mot.lower().strip(" .,;:!?«»\"…")


def hf():
    """La commande HyperFrames. npx est un .cmd sous Windows : on passe par son chemin complet."""
    npx = shutil.which("npx") or "npx"
    return [npx, "--yes", HF_VERSION]


def lancer(cmd, **kw):
    """Lance une commande et s'arrête net si elle échoue, avec la fin de sa sortie d'erreur."""
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", **kw)
    if r.returncode != 0:
        raise SystemExit(f"échec : {' '.join(map(str, cmd[:6]))}…\n{(r.stderr or r.stdout)[-2000:]}")
    return r


def duree_media(chemin):
    r = lancer(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", chemin])
    return float(r.stdout)


def taille_video(chemin):
    r = lancer(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                "-of", "csv=p=0", chemin])
    l, h = r.stdout.strip().split(",")
    return int(l), int(h)


class Video:
    """Une vidéo à monter : sa fiche, ses chemins, ses données de travail."""

    def __init__(self, dossier):
        self.dossier = os.path.abspath(dossier)
        fiche = os.path.join(self.dossier, "kallaway.toml")
        if not os.path.exists(fiche):
            raise SystemExit(f"pas de kallaway.toml dans {self.dossier} : lancer d'abord `ke.py {dossier} preparer`")
        with open(fiche, "rb") as f:
            self.cfg = tomllib.load(f)
        self.travail = os.path.join(self.dossier, "montage")
        self.cache = os.path.join(self.travail, "cache")
        os.makedirs(self.cache, exist_ok=True)
        self.prises = {p["alias"]: p for p in self.cfg["prises"]}
        self.ordre = [p["alias"] for p in self.cfg["prises"]]   # l'ordre des prises = l'ordre du texte
        self._carte = None
        self._plans = None

    # --- chemins ---
    def chemin(self, *morceaux):
        return os.path.join(self.dossier, *morceaux)

    def source(self, alias):
        return os.path.join(self.cfg["sources"]["dossier"], self.prises[alias]["fichier"])

    def wav(self, alias):
        """La prise en wav 16 kHz mono, pour Whisper et les mesures d'énergie (refait si absent)."""
        d = os.path.join(self.cache, "wav")
        os.makedirs(d, exist_ok=True)
        w = os.path.join(d, f"{alias}.wav")
        if not os.path.exists(w):
            lancer(["ffmpeg", "-v", "error", "-y", "-i", self.source(alias), "-ac", "1", "-ar", "16000", w])
        return w

    # --- données de travail (montage/*.json) ---
    def lire(self, nom):
        p = os.path.join(self.travail, nom)
        if not os.path.exists(p):
            raise SystemExit(f"{nom} manque dans montage/ : l'étape qui le fabrique n'a pas tourné")
        with open(p, encoding="utf-8") as f:
            return json.load(f)

    def ecrire(self, nom, donnees):
        with io.open(os.path.join(self.travail, nom), "w", encoding="utf-8", newline="\n") as f:
            json.dump(donnees, f, ensure_ascii=False, indent=1)

    def carte(self):
        if self._carte is None:
            self._carte = self.lire("carte.json")
        return self._carte

    def plans(self):
        if self._plans is None:
            self._plans = self.lire("plans.json")
        return self._plans

    @property
    def duree(self):
        """La durée de la composition : la piste montée plus un tampon (0,05 s sur l'assiette)."""
        return round(self.carte()["duree"] + self.cfg["video"].get("tampon", 0.05), 2)

    # --- les mots ---
    def mot(self, ref):
        """(alias, index) d'une référence « PRISE:mot#n » ou « PRISE@i », dans la carte des coupes."""
        m = re.fullmatch(r"([^:@]+)@(\d+)", ref)
        if m:
            return m.group(1), int(m.group(2))
        m = re.fullmatch(r"([^:@]+):(.+?)(?:#(\d+))?", ref)
        if not m:
            raise SystemExit(f"référence illisible : {ref!r} (attendu « PRISE:mot », « PRISE:mot#1 » ou « PRISE@6 »)")
        alias, cible, n = m.group(1), norm(m.group(2)), int(m.group(3) or 0)
        if alias not in self.prises:
            raise SystemExit(f"prise inconnue dans {ref!r} : {alias} (connues : {', '.join(self.ordre)})")
        ws = [w for w in self.carte()["mots"] if w["f"] == alias]
        trouves = [w for w in ws if norm(w["w"]) == cible]
        if len(trouves) <= n:
            dit = " ".join(f"{w['w']}@{w['i']}" for w in ws)
            raise SystemExit(f"mot introuvable : {ref!r}. La prise {alias} dit (mot@index) : {dit}")
        return alias, trouves[n]["i"]

    def mot_carte(self, ref):
        alias, i = self.mot(ref)
        return next(w for w in self.carte()["mots"] if w["f"] == alias and w["i"] == i)

    def t(self, ref):
        """Le temps, dans la piste montée, d'une référence : mot, « plan:<id> » ou « fin »."""
        if ref == "fin":
            return self.duree
        if ref.startswith("plan:"):
            pid = ref[5:]
            for p in self.plans():
                if p["id"] == pid:
                    return p["debut"]
            raise SystemExit(f"plan inconnu : {pid} (plans : {', '.join(p['id'] for p in self.plans())})")
        return self.mot_carte(ref)["s"]

    def plan_a(self, t):
        """Le plan à l'écran à l'instant t."""
        return next(p for p in reversed(self.plans()) if t >= p["debut"] - 0.001)
