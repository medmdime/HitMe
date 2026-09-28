"""Étape 9 · la couverture : le titre sur une image de lui, et cette image en toute première image de la vidéo.

    ke.py <dossier> couverture

Demandé par Mohamed le 28 septembre 2026, pour l'assiette : « la police ZY Elegant, le titre, découpe
une partie blanche et une autre jaune, et ajoute une frame simple avant la vidéo ». Ce qui a été fait,
et ce que cette étape refait :
  - le fond : une image de la piste maître (assets/rushes/voix-montage.mp4, donc SANS sous-titres ni
    mots incrustés), choisie à la main : bouche fermée, regard dans l'objectif ([couverture] temps) ;
  - un dégradé sombre en haut (le mur est clair : le blanc ne se lirait pas) ;
  - le titre en ZY Elegant (police de CapCut, tout en capitales, SANS accents : pas de « é » dans la
    police, choisir un titre sans accent ou l'écrire sans), la première partie en blanc, la seconde en
    jaune YouBud (#ffc800) et plus grosse ; une ombre douce ; le haut du texte vers y = 250, dans la
    zone qu'Instagram garde quand il recadre la couverture en 3:4 dans la grille (y 240 → 1680) ;
  - renders/couverture-<nom>.png, et renders/<nom>-couverture.mp4 : la vidéo livrée précédée d'UNE
    image (1/30 s, silence), la couverture, à choisir comme couverture dans l'appli.
Pour choisir le temps : `ke.py <dossier> verifier planche assets/rushes/voix-montage.mp4`.
"""
import os, sys
from commun import Video, lancer

POLICES = [   # la police est dans le cache de CapCut (Windows)
    os.path.expanduser("~/AppData/Local/CapCut/User Data/Cache/effect/176684093/0388ab3be93949e07eae6ad348817d05/ZY Elegant.ttf"),
]


def police(v):
    p = v.cfg["couverture"].get("police")
    for c in ([p] if p else []) + POLICES:
        if c and os.path.exists(c):
            return c
    raise SystemExit("ZY Elegant introuvable : ouvrir un texte en ZY Elegant dans CapCut pour qu'il la télécharge, "
                     "ou donner son chemin dans [couverture] police")


def composer(v, fond, sortie):
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
    c = v.cfg["couverture"]
    F = police(v)
    img = Image.open(fond).convert("RGBA")
    W, H = img.size
    grad = Image.new("L", (1, H))
    for y in range(H):
        grad.putpixel((0, y), int(150 * max(0, 1 - y / 950) ** 1.4))
    noir = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    noir.putalpha(grad.resize((W, H)))
    img = Image.alpha_composite(img, noir)

    def ajuste(lignes, maxw, t):
        # la plus grande taille où la ligne la plus longue tient dans maxw
        while True:
            f = ImageFont.truetype(F, t)
            if max(f.getbbox(l)[2] - f.getbbox(l)[0] for l in lignes) <= maxw:
                return f
            t -= 2

    blanc, jaune = c["blanc"], c["jaune"]              # listes de lignes
    fb, fj = ajuste(blanc, 900, 140), ajuste(jaune, 960, 180)
    calque = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ombre = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d, do = ImageDraw.Draw(calque), ImageDraw.Draw(ombre)
    y = c.get("haut", 250)
    for k, (txt, f, coul) in enumerate([(l, fb, "white") for l in blanc] + [(l, fj, "#ffc800") for l in jaune]):
        l, tp, r, b = f.getbbox(txt)
        x = (W - (r - l)) // 2 - l
        do.text((x + 6, y + 10), txt, font=f, fill=(0, 0, 0, 200))
        d.text((x, y), txt, font=f, fill=coul)
        y += (b - tp) + (22 if f is fb else 26)
        if k == len(blanc) - 1:
            y += 18                                     # un souffle entre le blanc et le jaune
    ombre = ombre.filter(ImageFilter.GaussianBlur(9))
    Image.alpha_composite(Image.alpha_composite(img, ombre), calque).convert("RGB").save(sortie)
    print("couverture :", sortie, f"(blanc {fb.size} px, jaune {fj.size} px, bas du texte à y = {y})")


def main(v, args):
    c = v.cfg["couverture"]
    nom = v.cfg["rendu"]["nom"]
    r = v.chemin("renders")
    fond = os.path.join(v.cache, "couverture-fond.png")
    lancer(["ffmpeg", "-v", "error", "-y", "-ss", str(c["temps"]), "-i", v.chemin("assets", "rushes", "voix-montage.mp4"),
            "-frames:v", "1", fond])
    png = os.path.join(r, f"couverture-{nom}.png")
    composer(v, fond, png)
    video = os.path.join(r, f"{nom}.mp4")
    if not os.path.exists(video):
        print(f"(pas encore de {nom}.mp4 : lancer `rendre final`, puis refaire `couverture` pour l'ajouter devant la vidéo)")
        return
    out = os.path.join(r, f"{nom}-couverture.mp4")
    lancer(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", "30", "-t", "0.0334", "-i", png,
            "-f", "lavfi", "-t", "0.0334", "-i", "anullsrc=r=48000:cl=stereo", "-i", video, "-filter_complex",
            "[0:v]scale=1080:1920,format=yuv420p,setsar=1,trim=end_frame=1[c];[2:v]setsar=1[v2];[c][1:a][v2][2:a]concat=n=2:v=1:a=1[v][a]",
            "-map", "[v]", "-map", "[a]", "-r", "30", "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", out])
    print("vidéo avec sa couverture en première image :", out)


if __name__ == "__main__":
    main(Video(sys.argv[1]), sys.argv[2:])
