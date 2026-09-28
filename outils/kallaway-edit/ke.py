"""Le Kallaway edit, de la prise brute à la vidéo livrée. Une commande par étape :

    python outils/kallaway-edit/ke.py <dossier-video> <étape> [options]

    preparer                  copier le kit (DA, sons, fond, musiques, fiche d'exemple) dans un nouveau dossier
    transcrire [coupes|sous-titres]   Whisper medium (coupes) et large-v3 (sous-titres), mot à mot
    levres candidats|planche|verifier|auto|cadre   mesurer le décalage son/lèvres de chaque prise
    maitre [--carte]          la piste maître (coupes à chaque souffle, lèvres recalées) et la bande B
    plans                     les coupes A/B, et les repères à écrire dans chaque animation
    detourer                  lui détouré sur la bande B (hyperframes remove-background, ~3 min sur le CPU)
    montage                   index.html, les sous-titres (incrustés et .srt)
    check                     npx hyperframes check
    rendre brouillon|final|test V     le rendu, accéléré de [rendu] vitesse sans sauter d'image
    verifier coupes|synchro|son|planche|pic   les contrôles
    couverture                le titre (ZY Elegant, blanc puis jaune) sur une image de lui, et en première image de la vidéo

L'ordre, les règles et les pièges sont dans le skill .claude/skills/kallaway-edit/SKILL.md.
Exemple complet et réel : video/assiette-pas-le-dessert/kallaway.toml (= gabarit.toml ici).
"""
import os, sys, time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from commun import Video, hf, lancer


def detourer(v):
    src = v.chemin("assets", "rushes", "visage-b.mp4")
    out = v.chemin("assets", "rushes", "visage-b-detoure.webm")
    print("détourage (modèle u2net_human_seg, en cache ; ~0,14 s par image sur le processeur)…", flush=True)
    t = time.time()
    lancer(hf() + ["remove-background", src, "-o", out, "--quality", "best"], cwd=v.dossier)
    print(f"écrit {out} en {time.time() - t:.0f} s (VP9 avec transparence)")


def check(v):
    r = lancer(hf() + ["check"], cwd=v.dossier)
    print("\n".join(l for l in r.stdout.splitlines() if l.strip())[-3000:])


def main():
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    dossier, etape, args = sys.argv[1], sys.argv[2], sys.argv[3:]
    if etape == "preparer":
        import preparer
        return preparer.main(dossier, args)
    v = Video(dossier)
    if etape == "transcrire":
        import transcrire
        transcrire.main(v, args)
    elif etape == "levres":
        import levres
        levres.main(v, args)
    elif etape == "maitre":
        import maitre
        maitre.main(v, args)
    elif etape == "plans":
        import plans
        plans.main(v, args)
    elif etape == "detourer":
        detourer(v)
    elif etape == "montage":
        import montage
        montage.main(v, args)
    elif etape == "check":
        check(v)
    elif etape == "rendre":
        import rendre
        rendre.main(v, args)
    elif etape == "verifier":
        import verifier
        verifier.main(v, args)
    elif etape == "couverture":
        import couverture
        couverture.main(v, args)
    else:
        raise SystemExit(f"étape inconnue : {etape}\n\n{__doc__}")


if __name__ == "__main__":
    main()
