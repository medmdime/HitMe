"""Étape 7 · le rendu, accéléré.

    ke.py <dossier> rendre brouillon     renders/<nom>-brouillon.mp4 (-q draft, ~2 min)
    ke.py <dossier> rendre final         renders/<nom>.mp4          (-q high)
    ke.py <dossier> rendre test 1.1      renders/<nom>-test-x1.1.mp4 (une autre vitesse, pour comparer)

La vidéo livrée est accélérée de [rendu] vitesse (1,08 : « 1,08, je pense, l'idéal », Mohamed le 26
septembre, comme dans CapCut où 1,15 était trop rapide). La composition, elle, reste à vitesse 1 :
tous les temps de la fiche sont ceux de la parole réelle.

L'astuce, pour ne sauter aucune image : on rend à 30 ÷ vitesse images par seconde (250/9 = 27,78 pour
1,08 ; 300/11 pour 1,1), puis ffmpeg comprime le temps (setpts=PTS/vitesse) : chaque image rendue
devient une image à 30 i/s, sans doublon ni saut. Le son suit avec atempo (même hauteur de voix).
Sur l'assiette : 972 images rendues, 972 images livrées, 35 s → 32,4 s. La première tentative avait
rendu à 32,4 i/s (30 × 1,08, le mauvais sens) : ffmpeg jetait des images.
"""
import os, sys
from fractions import Fraction
from commun import Video, hf, lancer
import verifier


def rendre(v, qualite, vitesse, sortie):
    fps = Fraction(30) / Fraction(str(vitesse))                  # 30 / 1,08 = 250/9
    os.makedirs(v.chemin("renders"), exist_ok=True)
    base = v.chemin("renders", f"base-{os.path.basename(sortie)}")
    print(f"rendu HyperFrames -q {qualite} à {fps} i/s…", flush=True)
    lancer(hf() + ["render", "-o", base, "-q", qualite, "--fps", f"{fps.numerator}/{fps.denominator}"], cwd=v.dossier)
    fin = round(v.duree / vitesse, 2)
    crf, preset, abit = ("16", "slow", "256k") if qualite == "high" else ("18", "medium", "192k")
    lancer(["ffmpeg", "-v", "error", "-y", "-i", base, "-filter_complex",
            f"[0:v]setpts=PTS/{vitesse}[v];[0:a]atempo={vitesse},atrim=end={fin}[a]",
            "-map", "[v]", "-map", "[a]", "-r", "30", "-c:v", "libx264", "-preset", preset, "-crf", crf,
            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", abit, "-movflags", "+faststart", sortie])
    os.remove(base)
    print("livré :", sortie)
    verifier.son(sortie)


def main(v, args):
    quoi = args[0] if args else "brouillon"
    r = v.cfg["rendu"]
    nom = r["nom"]
    if quoi == "brouillon":
        rendre(v, "draft", r["vitesse"], v.chemin("renders", f"{nom}-brouillon.mp4"))
    elif quoi == "final":
        rendre(v, "high", r["vitesse"], v.chemin("renders", f"{nom}.mp4"))
    elif quoi == "test":
        vit = float(args[1])
        rendre(v, "draft", vit, v.chemin("renders", f"{nom}-test-x{vit}.mp4"))
    else:
        raise SystemExit("rendre brouillon | final | test VITESSE")


if __name__ == "__main__":
    main(Video(sys.argv[1]), sys.argv[2:])
