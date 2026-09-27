"""Étape 3 · la piste maître : chaque prise coupée à chaque souffle, recalée sur les lèvres, bout à bout.

Fabrique, dans assets/rushes/ (ignoré par git : c'est la voix et le visage de Mohamed) :
  - voix-montage.mp4 : le cadre A, 1080 × 1920, 30 i/s, la voix normalisée à −16 LUFS ;
  - visage-b.mp4     : la bande du cadre B, 1080 × 800, cadrée plus large (épaules, mains), sans son ;
et montage/carte.json : chaque morceau gardé et chaque mot, en temps de la piste montée.

Ce que Mohamed a demandé (25 septembre) : « coupe chaque moment de respiration… parole, parole,
parole ». Le lendemain : « la coupure est très bien ». Les réglages de [coupe] sont ceux-là.

Comment on coupe :
  1. ffmpeg silencedetect repère les silences (sous [coupe] bruit dB, pendant au moins duree_min s) ;
  2. un silence enfermé dans un mot ne se coupe pas (sur l'assiette, « enre-gistre » en avait un) ;
  3. on garde [coupe] avant s avant chaque mot, apres s après, et fin s après le dernier mot ;
  4. chaque borne se cale sur la grille des images (1/30 s). SANS ÇA, le concat d'ffmpeg rallonge
     chaque morceau audio jusqu'à la fin de sa dernière image, en y glissant un bout de silence :
     sur 27 morceaux, la voix avait pris 0,3 s de retard sur la carte à la fin de l'assiette, et les
     animations tombaient de plus en plus tôt. Avec la grille, image et son font la même longueur ;
  5. l'IMAGE de chaque morceau est prise [[prises]] decalage s plus tard que le son : c'est le
     recalage des lèvres mesuré à l'étape levres ;
  6. un fondu de 8 ms à chaque bord de morceau audio (pas de clic), puis loudnorm sur le tout.

Recadrages, depuis la source 4K 16:9 :
  - A : une bande verticale 9:16 de toute la hauteur (1215 × 2160 pour du 4K), centrée sur
    [[prises]] bouche, réduite en 1080 × 1920. Une bande par prise : Mohamed bouge d'une prise à
    l'autre (sur l'assiette, sa bouche allait de x = 2072 à x = 2310), il reste centré.
  - B : [cadre_b] echelle (0,44) donne une tête d'environ 400 px ; la bouche tombe à bouche_y px du
    haut de la bande. Si la prise est trop basse pour ce cadrage, la bande remonte au bord de
    l'image (la tête descend alors un peu : 18 px sur une prise de l'assiette).

Vérifié sur l'assiette : aucune parole coupée (tout ce qui est enlevé reste sous −46 dB, aucune
borne ne tombe dans du son) et la voix retombe au millième près sur la carte. `ke.py <dossier>
verifier coupes` refait ces deux contrôles.
"""
import os, re, subprocess, sys
from commun import Video, duree_media, lancer, taille_video


def silences(chemin, bruit, dmin):
    err = subprocess.run(["ffmpeg", "-i", chemin, "-af", f"silencedetect=noise={bruit}dB:d={dmin}", "-f", "null", "-"],
                         capture_output=True, text=True, encoding="utf-8", errors="replace").stderr
    s = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", err)]
    e = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", err)]
    return list(zip(s, e))


def decouper(v):
    """Les morceaux gardés : [(alias, début, fin)] en temps de la source, sur la grille des images."""
    c = v.cfg["coupe"]
    mots = v.lire(f"mots-{v.cfg['transcription']['coupes']}.json")
    grille = c.get("grille", 30)
    plan = []
    for alias in v.ordre:
        src = v.source(alias)
        d = duree_media(src)
        ws = mots[alias]
        sil = [(a, b) for (a, b) in silences(src, c["bruit"], c["duree_min"])
               # un silence enfermé dans un mot (à 0,05 s de ses bords) ne se coupe pas
               if not any(w["s"] + 0.05 <= a and b <= w["e"] - 0.05 for w in ws)]
        debut = max(0.0, ws[0]["s"] - c["avant"])
        fin = min(d, ws[-1]["e"] + c["fin"])
        garde, cur = [], debut
        for (a, b) in sil:
            if b <= debut or a >= fin:
                continue
            cut_a, cut_b = a + c["apres"], b - c["avant"]
            if cut_b - cut_a < 0.04:        # un blanc trop court pour valoir une coupe
                continue
            if cut_a > cur:
                garde.append((cur, cut_a))
            cur = max(cur, cut_b)
        if fin > cur:
            garde.append((cur, fin))
        for (a, b) in garde:
            a, b = round(a * grille) / grille, round(b * grille) / grille
            if b - a > 0.06:
                plan.append((alias, round(a, 4), round(b, 4)))
    return plan


def carte(v, plan):
    """Chaque morceau et chaque mot en temps de la piste montée ; un mot tombé dans un blanc coupé
    est ramené au bord du morceau le plus proche."""
    mots = v.lire(f"mots-{v.cfg['transcription']['coupes']}.json")
    t, morceaux = 0.0, []
    for (f, a, b) in plan:
        morceaux.append({"f": f, "a": a, "b": b, "t": round(t, 3)})
        t += b - a
    liste = []
    for f in v.ordre:
        ms = [m for m in morceaux if m["f"] == f]
        for i, w in enumerate(mots[f]):
            mid = (w["s"] + w["e"]) / 2
            m = next((m for m in ms if m["a"] <= mid <= m["b"]), None)
            if m is None:
                m = min(ms, key=lambda m: min(abs(m["a"] - mid), abs(m["b"] - mid)))
            tm = lambda x: round(m["t"] + min(max(x, m["a"]), m["b"]) - m["a"], 3)
            liste.append({"f": f, "i": i, "w": w["w"], "s": tm(w["s"]), "e": tm(w["e"])})
    return {"morceaux": morceaux, "mots": liste, "duree": round(t, 3)}


def rendre(v, plan):
    cb = v.cfg["cadre_b"]
    entrees, index = [], {}
    for alias in v.ordre:
        index[alias] = len(index)
        entrees += ["-i", v.source(alias)]
    lsrc, hsrc = taille_video(v.source(v.ordre[0]))
    la = round(hsrc * 9 / 16)                     # 1215 pour du 4K
    s = cb["echelle"]
    wb, hb = round(cb["bande_largeur"] / s), round(cb["bande_hauteur"] / s)   # 2455 × 1818 à 0,44
    graphe = []
    for n, (f, a, b) in enumerate(plan):
        k, o, dur = index[f], v.prises[f]["decalage"], b - a
        bx, by = v.prises[f]["bouche"]
        xa = min(max(0, bx - la // 2), lsrc - la)
        xb = min(max(0, bx - wb // 2), lsrc - wb)
        yb = min(max(0, by - round(cb["bouche_y"] / s)), hsrc - hb)
        nb = round(dur * 30)          # le nombre exact d'images du morceau
        fin_img = f"tpad=stop_mode=clone:stop_duration=0.1,trim=end_frame={nb},setpts=PTS-STARTPTS"
        graphe.append(f"[{k}:v]trim=start={a + o:.3f}:end={b + o:.3f},setpts=PTS-STARTPTS,split=2[s{n}][t{n}]")
        graphe.append(f"[s{n}]crop={la}:{hsrc}:{xa}:0,scale=1080:1920,fps=30,setsar=1,{fin_img}[v{n}]")
        graphe.append(f"[t{n}]crop={wb}:{hb}:{xb}:{yb},scale={cb['bande_largeur']}:{cb['bande_hauteur']},fps=30,setsar=1,{fin_img}[w{n}]")
        # aresample d'abord : end_sample compte en échantillons à 48 kHz (sans effet sur une prise déjà à 48 kHz)
        graphe.append(f"[{k}:a]aresample=48000,atrim=start={a}:end={b},asetpts=PTS-STARTPTS,apad,atrim=end_sample={round(dur * 48000)},"
                      f"afade=t=in:d=0.008,afade=t=out:st={max(0, dur - 0.008):.3f}:d=0.008[a{n}]")
    n = len(plan)
    graphe.append("".join(f"[v{i}][w{i}][a{i}]" for i in range(n)) + f"concat=n={n}:v=2:a=1[vc][wc][ac]")
    graphe.append(f"[ac]loudnorm={v.cfg['voix']['loudnorm']},aresample=48000[an]")
    rushes = v.chemin("assets", "rushes")
    os.makedirs(rushes, exist_ok=True)
    a_out, b_out = os.path.join(rushes, "voix-montage.mp4"), os.path.join(rushes, "visage-b.mp4")
    lancer(["ffmpeg", "-v", "error", "-y"] + entrees + ["-filter_complex", ";".join(graphe),
           "-map", "[vc]", "-map", "[an]", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", a_out,
           "-map", "[wc]", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p",
           "-movflags", "+faststart", b_out])
    print("écrit", a_out, "et", b_out)


def main(v, args):
    plan = decouper(v)
    c = carte(v, plan)
    v.ecrire("carte.json", c)
    print(f"{len(plan)} morceaux, {c['duree']:.2f} s de parole (montage/carte.json)")
    if "--carte" in args:          # seulement la carte, sans réencoder (rapide)
        return
    rendre(v, plan)
    print("Ensuite : `ke.py <dossier> levres verifier` sur deux ou trois mots, puis `ke.py <dossier> detourer`.")


if __name__ == "__main__":
    main(Video(sys.argv[1]), sys.argv[2:])
