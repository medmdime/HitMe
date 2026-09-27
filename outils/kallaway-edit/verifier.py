"""Les contrôles, à passer avant de montrer quoi que ce soit à Mohamed.

    ke.py <dossier> verifier coupes          aucune parole enlevée, aucune coupe dans du son
    ke.py <dossier> verifier synchro <mp4>   l'image du rendu colle-t-elle à la piste maître ?
    ke.py <dossier> verifier son <mp4>       sonie (−16 LUFS visé) et crêtes (rien au-dessus de −0,5 dBFS)
    ke.py <dossier> verifier planche <mp4>   une image toutes les 1,5 s, à regarder en vrai
    ke.py <dossier> verifier pic <fichier>   où culmine un son (pour caler son pic sur un événement)

Ce qu'ils ont trouvé sur l'assiette :
  - coupes : Mohamed croyait qu'un mot avait été coupé (« repas », puis « une phrase ») ; tout ce qui
    était enlevé restait sous −46 dB. C'était la phrase tournée qui manquait d'un lien. Répondre
    avec ces chiffres, pas avec une impression ;
  - synchro : le rendu HyperFrames reprend la piste image par image (décalage 0 sur tous les plans A) :
    un défaut de lèvres vient de la prise, pas du rendu ;
  - son : −16,4 LUFS, crête −0,6 dBFS. Les crêtes viennent de la voix (sur « Mais le pire », la
    musique coupée), pas des bruitages.
"""
import os, subprocess, sys
import numpy as np
from commun import Video, lancer


def coupes(v):
    carte = v.carte()
    mots = v.lire(f"mots-{v.cfg['transcription']['sous_titres']}.json")
    alerte = 0
    for f in v.ordre:
        b = subprocess.run(["ffmpeg", "-v", "error", "-i", v.wav(f), "-f", "s16le", "-"], capture_output=True).stdout
        a = np.frombuffer(b, np.int16).astype(np.float32)
        hop = 160   # 10 ms à 16 kHz
        n = len(a) // hop
        db = 20 * np.log10(np.sqrt((a[: n * hop].reshape(n, hop) ** 2).mean(axis=1)) / 32768 + 1e-9)
        ps = sorted((m["a"], m["b"]) for m in carte["morceaux"] if m["f"] == f)
        for (x, y) in [(ps[i][1], ps[i + 1][0]) for i in range(len(ps) - 1)]:
            seg = db[int(x * 100): int(y * 100)]
            fort = int((seg > -40).sum()) * 10
            etat = "ok" if fort == 0 else "⚠ PAROLE ?"
            alerte += fort > 0
            print(f"  {f:<4} trou {x:5.2f}-{y:5.2f} ({y - x:.2f} s) : max {seg.max():4.0f} dB, {fort:3d} ms au-dessus de -40  {etat}")
        for (x, y) in ps:
            for t, nom in ((x, "début"), (y, "fin")):
                val = db[max(0, int(t * 100) - 1): int(t * 100) + 2].max()
                if val > -38:
                    alerte += 1
                    print(f"  ⚠ {f} : la coupe de {nom} à {t:.2f} s tombe dans du son ({val:.0f} dB)")
        # les mots de la deuxième écoute qui ne tiennent dans aucun morceau. Whisper en pose parfois
        # dans un silence (sur l'assiette : « le » de durée nulle, « 'est » de « c'est » décollé) :
        # seul compte un mot dehors ET sonore à cet endroit, c'est-à-dire du son vraiment enlevé.
        for w in mots[f]:
            mid = (w["s"] + w["e"]) / 2      # (Whisper donne parfois des mots de durée nulle)
            dedans = sum(max(0, min(b_, w["e"]) - max(a_, w["s"])) for a_, b_ in ps)
            if dedans < 0.02 and not any(a_ <= mid <= b_ for a_, b_ in ps):
                seg = db[int(w["s"] * 100): max(int(w["s"] * 100) + 1, int(w["e"] * 100))]
                if seg.size and seg.max() > -40:
                    alerte += 1
                    print(f"  ⚠ {f} : « {w['w']} » ({w['s']:.2f}-{w['e']:.2f}) est hors des morceaux, et il y a du son")
                else:
                    print(f"  (Whisper a posé « {w['w']} » dans un silence de {f} à {w['s']:.2f} s : rien d'enlevé)")
    print("aucune alerte" if not alerte else f"{alerte} alerte(s) : écouter la prise à ces endroits")


def synchro(v, mp4):
    """Pour chaque plan A, le décalage (en images) qui colle le mieux les sauts du rendu à ceux de la
    piste maître. 0 partout = le rendu est fidèle."""
    W, H = 72, 128

    def diff(f):
        b = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-vf", f"fps=30,scale={W}:{H},format=gray", "-f", "rawvideo", "-"],
                           capture_output=True).stdout
        fr = np.frombuffer(b, np.uint8).reshape(-1, H, W).astype(np.float32)
        return np.r_[0, np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))]

    m, r = diff(v.chemin("assets", "rushes", "voix-montage.mp4")), diff(mp4)
    for p in v.plans():
        if p["cadre"] != "A":
            continue
        a, b = int((p["debut"] + 0.25) * 30), int((p["fin"] - 0.25) * 30)
        if b - a < 10:
            continue
        best = max((np.corrcoef(m[a:b], r[a + lag:b + lag])[0, 1], lag) for lag in range(-12, 13)
                   if len(r[a + lag:b + lag]) == b - a)
        print(f"  plan {p['id']:<14} décalage {best[1]:+d} image(s) (r = {best[0]:.2f})")
    print("Un plan sans assez de mouvement donne un r faible : c'est du bruit, pas un décalage.")


def son(mp4):
    r = subprocess.run(["ffmpeg", "-v", "info", "-i", mp4, "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True, encoding="utf-8", errors="replace").stderr
    lignes = [l.strip() for l in r.splitlines() if l.strip().startswith(("I:", "Peak:"))]
    print("  " + " · ".join(lignes[-2:]))
    print(lancer(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate,nb_frames,duration",
                  "-of", "compact", mp4]).stdout)


def planche(v, mp4):
    out = os.path.join(v.cache, "planche-" + os.path.splitext(os.path.basename(mp4))[0] + ".jpg")
    lancer(["ffmpeg", "-v", "error", "-y", "-i", mp4, "-vf", "fps=1/1.5,scale=270:-1,tile=8x3", "-frames:v", "1", out])
    print("planche :", out)


def pic(fichier):
    b = subprocess.run(["ffmpeg", "-v", "error", "-i", fichier, "-ac", "1", "-ar", "8000", "-f", "s16le", "-"], capture_output=True).stdout
    a = np.frombuffer(b, np.int16).astype(np.float32)
    hop = 400   # 50 ms
    n = len(a) // hop
    db = 20 * np.log10(np.sqrt((a[: n * hop].reshape(n, hop) ** 2).mean(axis=1)) / 32768 + 1e-9)
    k = int(db.argmax())
    print(f"{os.path.basename(fichier)} : {len(a) / 8000:.2f} s, pic à {k * 0.05:.2f} s ({db[k]:.0f} dB)")
    print("  " + " ".join(f"{i * 0.05:.2f}:{x:.0f}" for i, x in enumerate(db[:80])))
    print("Ajouter ce pic à PICS dans montage.py pour caler le son sur son pic.")


def main(v, args):
    quoi = args[0] if args else "coupes"
    if quoi == "coupes":
        coupes(v)
    elif quoi == "synchro":
        synchro(v, args[1])
    elif quoi == "son":
        son(args[1])
    elif quoi == "planche":
        planche(v, args[1])
    elif quoi == "pic":
        pic(args[1])
    else:
        raise SystemExit("verifier coupes | synchro MP4 | son MP4 | planche MP4 | pic FICHIER")


if __name__ == "__main__":
    main(Video(sys.argv[1]), sys.argv[2:])
