"""Étape 0 · préparer le dossier d'une nouvelle vidéo pour le Kallaway edit.

    ke.py video/<nouvelle-video> preparer [--depuis video/assiette-pas-le-dessert]

Copie depuis une vidéo déjà montée (l'assiette par défaut) tout ce qui ne change pas d'une vidéo à
l'autre, sans rien écraser de ce qui existe :
  - compositions/components/kit.css et youbud.css (la DA YouBud, copiée telle quelle, jamais réécrite) ;
  - assets/fonts (Archivo), assets/vendor (Lucide), assets/sfx (clics, woosh, risers, impacts) ;
  - assets/img/toile.jpg et toile-bas.jpg (le fond texturé clair du cadre B ; toile.py le redessine) ;
  - assets/musique (Careless Wandering, Particle Emission : bibliothèque tierce, jamais versionnée) ;
  - la fiche kallaway.toml de l'exemple, à réécrire pour la nouvelle vidéo ;
  - un package.json avec `npm run check`.
Ajoute aussi video/<nom>/renders/ au .gitignore (les prises montées, les musiques et les caches sont
déjà ignorés pour toutes les vidéos).

Ce qui reste à faire à la main, dans l'ordre du skill kallaway-edit : les animations du cadre B
(skill inserts-youbud, une composition 1080 × 960 par plan B), puis la fiche.
"""
import io, os, shutil, sys
from commun import ICI, RACINE

MUSIQUE_SECOURS = "D:/editingvideo/creatine-gummies/musique"


def copier(src, dst):
    if os.path.exists(dst):
        print("   existe déjà :", os.path.relpath(dst, RACINE))
        return
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    (shutil.copytree if os.path.isdir(src) else shutil.copy2)(src, dst)
    print("   copié :", os.path.relpath(dst, RACINE))


def main(dossier, args):
    depuis = os.path.join(RACINE, "video", "assiette-pas-le-dessert")
    if "--depuis" in args:
        depuis = os.path.abspath(args[args.index("--depuis") + 1])
    dossier = os.path.abspath(dossier)
    nom = os.path.basename(dossier)
    os.makedirs(os.path.join(dossier, "montage"), exist_ok=True)
    print(f"préparer {nom} depuis {os.path.basename(depuis)} :")
    for rel in ["compositions/components/kit.css", "compositions/components/youbud.css", "assets/fonts",
                "assets/vendor", "assets/sfx", "assets/img/toile.jpg", "assets/img/toile-bas.jpg", "assets/img/toile.py"]:
        copier(os.path.join(depuis, rel), os.path.join(dossier, rel))
    mus = os.path.join(depuis, "assets", "musique")
    if os.path.isdir(mus):
        copier(mus, os.path.join(dossier, "assets", "musique"))
    else:
        for f, n in [("Careless Wandering.mp3", "careless-wandering.mp3"), ("Particle Emission.mp3", "particle-emission.mp3")]:
            copier(os.path.join(MUSIQUE_SECOURS, f), os.path.join(dossier, "assets", "musique", n))
    copier(os.path.join(ICI, "gabarit.toml"), os.path.join(dossier, "kallaway.toml"))
    pk = os.path.join(dossier, "package.json")
    if not os.path.exists(pk):
        io.open(pk, "w", encoding="utf-8", newline="\n").write(
            '{\n  "name": "%s",\n  "private": true,\n  "type": "module",\n  "scripts": {\n'
            '    "check": "npx --yes hyperframes@0.8.21 check"\n  }\n}\n' % nom)
        print("   écrit : package.json")
    gi = os.path.join(RACINE, ".gitignore")
    ligne = f"video/{nom}/renders/"
    contenu = io.open(gi, encoding="utf-8").read()
    if ligne not in contenu.split("\n"):
        io.open(gi, "a", encoding="utf-8", newline="\n").write(f"{ligne}\n")
        print("   .gitignore :", ligne)
    print("\nEnsuite : réécrire kallaway.toml (prises, plans, incrustes, sons), puis `ke.py", nom, "transcrire`.")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2:])
