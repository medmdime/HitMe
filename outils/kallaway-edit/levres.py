"""Étape 2 · mesurer le décalage entre le son et les lèvres, prise par prise.

Le constat de l'assiette (26 septembre 2026) : sur le téléphone de Mohamed, avec le micro-cravate,
le son de chaque prise arrive AVANT la bouche, et pas du même écart d'une prise à l'autre :

    hook-1 0,21 s · hook-2 0,20 · le plus calorique 0,19 · il ne cale pas 0,18
    tu en manges plus que tu crois 0,33 · geste 0,12

Il l'a vu tout de suite (« vers la 20e seconde, ma bouche et le son ne sont pas alignés ») : c'était
la prise à 0,33 s. Au-delà de ~0,1 s, un face caméra se voit décalé. On mesure donc CHAQUE prise,
avant de monter, et on reporte la valeur dans [[prises]] decalage de kallaway.toml.

LA méthode qui marche : un mot qui commence par p, b ou m.
  - Dans le son, un p ou un b, c'est un silence (les lèvres fermées) puis une explosion nette ;
    un m après un blanc, c'est le début de la voyelle qui suit.
  - Dans l'image, c'est l'instant où les lèvres, fermées, se séparent.
  - décalage = (temps de l'ouverture des lèvres dans l'image) − (temps de l'explosion dans le son).
  Exemple réel, hook-1, « sucre, pas de dessert » : l'enveloppe du son tombe à 22-29 dB de 2,13 à
  2,18 s puis saute à 58 dB à 2,19 s (l'explosion du p) ; sur la planche, les lèvres sont closes de
  2,317 à 2,383 s et s'ouvrent à 2,400 s. Décalage 2,40 − 2,19 = 0,21 s.
  Prendre deux ou trois mots par prise, loin l'un de l'autre, et garder la valeur commune.

    ke.py <dossier> levres candidats                  les mots en p/b/m de chaque prise, avec leur temps
    ke.py <dossier> levres planche H1 2.20            la planche des lèvres autour de 2,20 s (0,7 s, 60 i/s)
                                                      et l'enveloppe du son, toutes les 10 ms
    ke.py <dossier> levres verifier "H1:pas" "TM:Pour"   APRÈS l'étape maitre : les lèvres dans la piste
                                                      montée ; l'image marquée +0.000 (en rouge) doit
                                                      être celle où elles s'ouvrent

Ce qui ne marche PAS : corréler automatiquement le mouvement de la bouche et l'énergie du son. Sur
l'assiette, cette corrélation a donné +17 ms pour « le plus calorique » alors que la planche montre
0,19 s. `levres auto` la garde comme premier indice, jamais comme mesure.

La position de la bouche dans la source 4K ([[prises]] bouche = [x, y]) se relève sur une image de
la prise : `levres cadre H1 1.0` écrit une image quadrillée (un carreau = 90 px de la source).
"""
import os, subprocess, sys
import numpy as np
from commun import Video, lancer, norm


def planche(v, alias, t0, nom=None, largeur=320, hauteur=200, source=None, centre=None, fps=60):
    """La bouche autour de t0, image par image, et l'enveloppe du son toutes les 5 ms."""
    from PIL import Image, ImageDraw
    src = source or v.source(alias)
    bx, by = centre or v.prises[alias]["bouche"]
    a0 = max(0.0, t0 - 0.35)
    b = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{a0:.3f}", "-t", "0.7", "-i", src, "-ac", "1", "-ar", "16000",
                        "-f", "s16le", "-"], capture_output=True).stdout
    a = np.frombuffer(b, np.int16).astype(np.float32)
    hop = 80   # 5 ms
    env = 20 * np.log10(np.sqrt((a[: len(a) // hop * hop].reshape(-1, hop) ** 2).mean(axis=1)) + 1)
    print("son (temps:dB, toutes les 10 ms) :")
    print("  " + " ".join(f"{a0 + i * 0.005:.2f}:{x:.0f}" for i, x in enumerate(env) if i % 2 == 0))
    crop = f"crop={largeur}:{hauteur}:{bx - largeur // 2}:{by - hauteur // 2}"
    b = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{a0:.3f}", "-t", "0.7", "-i", src, "-vf",
                        f"fps={fps},{crop},scale=160:100", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                       capture_output=True).stdout
    fr = np.frombuffer(b, np.uint8).reshape(-1, 100, 160, 3)
    cols = 7
    im = Image.new("RGB", (cols * 160, ((len(fr) + cols - 1) // cols) * 116), "white")
    d = ImageDraw.Draw(im)
    for i, x in enumerate(fr):
        X, Y = (i % cols) * 160, (i // cols) * 116
        im.paste(Image.fromarray(x), (X, Y))
        d.text((X + 4, Y + 101), f"{a0 + i / fps:.3f}", fill="black")
    out = os.path.join(v.cache, "levres")
    os.makedirs(out, exist_ok=True)
    chemin = os.path.join(out, f"{nom or alias + '-' + str(t0)}.png")
    im.save(chemin)
    print("planche :", chemin)
    return chemin


def candidats(v):
    """Les mots en p, b ou m de chaque prise : les endroits où mesurer."""
    mots = v.lire(f"mots-{v.cfg['transcription']['sous_titres']}.json")
    for alias in v.ordre:
        ws = [w for w in mots[alias] if norm(w["w"])[:1] in ("p", "b", "m")]
        print(f"{alias} :", "  ".join(f"{w['w']} {w['s']:.2f}" for w in ws))
    print("\nLes temps de Whisper sont approximatifs (±0,1 s) : lire l'explosion exacte dans l'enveloppe de la planche.")


def verifier(v, refs):
    """Dans la piste montée (après maitre) : les lèvres doivent s'ouvrir sur l'image marquée +0.000."""
    from PIL import Image, ImageDraw
    maitre = v.chemin("assets", "rushes", "voix-montage.mp4")
    for ref in refs:
        w = v.mot_carte(ref)
        alias = w["f"]
        # la bouche dans le maître : recadrage A centré sur elle (voir maitre.py)
        bx, by = v.prises[alias]["bouche"]
        _, h = v.cfg["sources"].get("taille", [3840, 2160])
        k = 1080 / round(h * 9 / 16)
        y = int(by * k)
        t = w["s"]
        a0 = t - 0.3
        b = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{a0:.3f}", "-t", "0.6", "-i", maitre, "-vf",
                            f"crop=240:140:420:{y - 70},scale=160:94", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                           capture_output=True).stdout
        fr = np.frombuffer(b, np.uint8).reshape(-1, 94, 160, 3)
        im = Image.new("RGB", (6 * 160, 3 * 110), "white")
        d = ImageDraw.Draw(im)
        for i, x in enumerate(fr[:18]):
            X, Y = (i % 6) * 160, (i // 6) * 110
            im.paste(Image.fromarray(x), (X, Y))
            dt = a0 + i / 30 - t
            d.text((X + 4, Y + 95), f"{dt:+.3f}", fill="red" if abs(dt) < 0.017 else "black")
        out = os.path.join(v.cache, "levres", f"maitre-{ref.replace(':', '-').replace('#', '-')}.png")
        im.save(out)
        print(f"{ref} : le mot commence à {t:.3f} s dans la piste montée · planche {out}")
    print("Le début du mot vient de Whisper (±0,05 s) : l'ouverture doit tomber à une image près de +0.000.")


def auto(v):
    """Premier indice seulement : corrélation mouvement de bouche / variation du son (bruitée)."""
    fps = 60
    for alias in v.ordre:
        f = v.source(alias)
        bx, by = v.prises[alias]["bouche"]
        b = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                           capture_output=True).stdout
        a = np.frombuffer(b, np.int16).astype(np.float32)
        hop = 16000 // fps
        n = len(a) // hop
        e = np.log1p(np.sqrt((a[: n * hop].reshape(n, hop) ** 2).mean(axis=1)))
        b = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-vf", f"crop=380:260:{bx - 190}:{by - 110},fps={fps},scale=64:40,format=gray",
                            "-f", "rawvideo", "-"], capture_output=True).stdout
        fr = np.frombuffer(b, np.uint8).reshape(-1, 40, 64).astype(np.float32)
        m = np.r_[0, np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))]
        n = min(len(e), len(m))
        de = np.abs(np.r_[0, np.diff(e[:n])])
        m = m[:n]
        res = []
        for lag in range(-24, 25):
            x = m[max(0, -lag): n - max(0, lag)]
            y = de[max(0, lag): n - max(0, -lag)]
            res.append((np.corrcoef(x, y)[0, 1], lag))
        res.sort(reverse=True)
        c, lag = res[0]
        print(f"{alias} : le son arriverait {-lag * 1000 / fps:+.0f} ms avant la bouche (r = {c:.2f}) — à confirmer sur une planche")


def cadre(v, alias, t):
    """Une image quadrillée de la prise, pour relever la position de la bouche (un carreau = 90 px)."""
    out = os.path.join(v.cache, "levres", f"cadre-{alias}.png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    lancer(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", v.source(alias), "-frames:v", "1", "-vf",
            "scale=1280:720,drawgrid=w=30:h=30:c=white@0.4", out])
    print("image :", out, "(1280 × 720 : multiplier x et y par 3 pour la source 4K)")


def main(v, args):
    quoi = args[0] if args else "candidats"
    if quoi == "candidats":
        candidats(v)
    elif quoi == "planche":
        planche(v, args[1], float(args[2]), nom=f"{args[1]}-{args[2]}")
    elif quoi == "verifier":
        verifier(v, args[1:])
    elif quoi == "auto":
        auto(v)
    elif quoi == "cadre":
        cadre(v, args[1], float(args[2]))
    else:
        raise SystemExit("levres candidats | planche PRISE TEMPS | verifier REF… | auto | cadre PRISE TEMPS")


if __name__ == "__main__":
    main(Video(sys.argv[1]), sys.argv[2:])
