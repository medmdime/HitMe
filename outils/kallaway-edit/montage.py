"""Étape 6 · la composition HyperFrames du montage : index.html, compositions/sous-titres.html et
sous-titres.srt, écrits à partir de kallaway.toml, montage/carte.json et montage/plans.json.

Le montage, tel que Mohamed l'a validé sur l'assiette (26 septembre 2026) :

  CADRE A · lui en grand, plein cadre (assets/rushes/voix-montage.mp4). Un zoom par plan : lent vers
  l'avant (1 → 1,06), ou punch-in franc (1,15) sur une phrase qui pique, ou les deux (lent, puis
  punch-in sur un mot). Des mots incrustés au-dessus de sa tête (y = 250) : une pilule par mot fort,
  qui arrive en pop sur le mot, avec un clic.

  CADRE B · en haut (1080 × 960), l'animation du plan ; en bas, la carte façon Kallaway : une carte
  arrondie (aucune bordure, un rebord plein en ombre) qui montre le FOND de la bande large
  (visage-b.mp4), et par-dessus, lui détouré (visage-b-detoure.webm) posé exactement sur la bande :
  sa tête sort de la carte par le haut, ses mains par les côtés. La carte descend à 60 px du bas,
  la même marge que sur les côtés (« réduis le bottom margin », 26 septembre).

  LES COUPES · vers une animation, glissé vers la gauche (A part à gauche, B arrive de la droite) ;
  retour vers lui, glissé vers la droite ; 0,28 s, power2.inOut. Entre deux plans B, seule
  l'animation du haut glisse vers la gauche. L'animation démarre 0,15 s avant la coupe : elle est
  déjà là pendant le glissé.

  LE SON · la voix (−16 LUFS) ; un WOOSH seulement quand on quitte son plan pour une animation, son
  PIC au milieu du glissé (« la fin du woosh doit arriver au même moment que la transition ») ; la
  première transition prend un riser qui monte sous le hook et le « hoop » (le boum d'impacts) sur
  la coupe ; risers + hoop sur les moments forts ([[sons]]) ; la musique ([[musique]]) : rien sous
  le riser du hook, morceau 1 jusqu'au turn, coupé net, le vent sous le turn, morceau 2 plus fort
  avec un hoop sur la reprise.

Les sons se calent sur leur PIC, jamais sur leur départ. Pics mesurés (`ke.py <dossier> verifier pic
<fichier>` pour un son nouveau) : air-woosh 0,70 s ; rizer-windy 2,75 s ; rizer-mettalic 1,75 s ;
impacts 0,55 s. Sur l'assiette, un woosh lancé sur la coupe culminait 0,5 s trop tard, et les hits
des animations, lus depuis 0,2 s pendant 0,3 s, s'arrêtaient avant leur boum.

Tout ce fichier se régénère : ne jamais retoucher index.html à la main, changer kallaway.toml.
"""
import io, os, re, sys
from commun import Video
import sous_titres

PICS = {"air-woosh.wav": 0.70, "rizer-windy.mp3": 2.75, "rizer-mettalic.mp3": 1.75, "impacts.mp3": 0.55}
STYLES = {   # fond et rebord des pilules incrustées (DA YouBud : aucune bordure, un rebord plein)
    "blanc": ("#ffffff", "#d9d8d0"),
    "jaune": ("var(--yb-yellow)", "var(--yb-yellow-edge)"),
    "vert": ("var(--yb-green)", "var(--yb-green-edge)"),
    "rouge": ("var(--yb-red-2)", "var(--yb-red)"),
    "bleu": ("var(--yb-blue-2)", "#b9e1f6"),       # l'eau (la teinte claire : l'encre reste lisible)
    "rose": ("#ff8cc6", "#e0639f"),                # l'icône d'enregistrement (28 septembre : « le save en rose »)
}


def r3(x):
    return round(x, 3)


def woosh(t, vol):
    """Le pic du woosh (0,70 s du fichier) sur t ; on saute ses 0,25 premières secondes, presque muettes."""
    p = PICS["air-woosh.wav"]
    return ("air-woosh.wav", r3(t - (p - 0.25)), 1.0, vol, 0.25)


def hit(t, vol):
    """Le boum d'impacts (0,55 s du fichier) sur t : lu depuis 0,2 s, pendant 1,2 s (le boum et sa queue)."""
    p = PICS["impacts.mp3"]
    return ("impacts.mp3", r3(t - (p - 0.2)), 1.2, vol, 0.2)


def riser(t, longueur, vol, fichier="rizer-windy.mp3", pic=None):
    """Un riser qui monte pendant `longueur` s et culmine sur t (on ne lit que sa fin)."""
    pic = PICS[fichier] if pic is None else pic
    return (fichier, r3(t - longueur), r3(longueur + 0.1), vol, r3(pic - longueur))


def lire_anim(v, fichier):
    """L'id et la durée de la composition d'une animation, lus dans son fichier."""
    txt = io.open(v.chemin(fichier), encoding="utf-8").read()
    m = re.search(r'data-composition-id="([^"]+)"[^>]*?data-duration="([0-9.]+)"', txt)
    if not m:
        raise SystemExit(f"{fichier} : pas de racine data-composition-id … data-duration")
    return m.group(1), float(m.group(2))


def main(v, args):
    cfg = v.cfg
    plans = v.plans()
    pcfg = {p["id"]: p for p in cfg["plans"]}
    DUREE = v.duree
    tr = cfg["transition"]
    TR, AV = tr["duree"], tr["avance_anim"]
    cb, ca = cfg["cadre_b"], cfg["cadre_a"]

    # --- les hôtes des animations (cadre B) ---
    hotes, host_id = [], {}
    for p in plans:
        if p["cadre"] != "B":
            continue
        fichier = p["anim"]
        cid, dur = lire_anim(v, fichier)
        hid = "host-" + os.path.splitext(os.path.basename(fichier))[0].lower()
        if hid in host_id.values():
            raise SystemExit(f"{fichier} sert deux fois : une animation par plan B")
        host_id[p["id"]] = hid
        # decalage_anim : pour une animation calée sur une version précédente de la piste (voir la fiche)
        debut = r3(p["debut"] - AV + pcfg[p["id"]].get("decalage_anim", 0))
        if debut + dur < p["fin"] + TR / 2 - 0.02:
            raise SystemExit(f"{fichier} ({dur} s) s'arrête à {debut + dur:.2f} s, avant la fin du glissé de sortie "
                             f"({p['fin'] + TR / 2:.2f} s) : allonger son data-duration (la dernière image tient)")
        hotes.append(f'        <div id="{hid}" data-composition-id="{cid}" class="clip hote" data-start="{debut}" '
                     f'data-duration="{dur}" data-track-index="{3 + len(hotes)}" data-composition-src="{fichier}"></div>')

    # --- les coupes : glissés et woosh ---
    js, sons = [], []
    premiere = True
    for k in range(1, len(plans)):
        avant, apres = plans[k - 1], plans[k]
        c = apres["debut"]
        t0 = r3(c - TR / 2)
        glisse = lambda sel, x0, x1: js.append(
            f'        tl.fromTo("{sel}", {{ x: {x0} }}, {{ x: {x1}, duration: {TR}, ease: "power2.inOut", immediateRender: false }}, {t0});')
        if avant["cadre"] == "A" and apres["cadre"] == "B":        # vers l'animation : vers la gauche
            glisse("#calque-a", 0, -1080)
            glisse("#calque-b", 1080, 0)
        elif avant["cadre"] == "B" and apres["cadre"] == "A":      # retour vers lui : vers la droite
            glisse("#calque-b", 0, 1080)
            glisse("#calque-a", -1080, 0)
        elif avant["cadre"] == "B":                                # B -> B : seule l'animation glisse
            glisse("#" + host_id[avant["id"]], 0, -1080)
            glisse("#" + host_id[apres["id"]], 1080, 0)
        else:
            raise SystemExit(f"deux plans A de suite ({avant['id']}, {apres['id']}) : les fusionner")
        # le son des coupes : seulement quand on quitte son plan pour une animation
        if avant["cadre"] == "A" and apres["cadre"] == "B":
            if premiere:
                pr = tr["premiere"]
                sons.append(riser(c, pr["longueur"], pr["vol_riser"], pr.get("riser", "rizer-windy.mp3"), pr.get("pic")))
                sons.append(hit(c, pr["vol_hit"]))
                premiere = False
            elif pcfg[apres["id"]].get("woosh", True):
                # woosh = false sur un plan B : son arrivée n'a pas de woosh, parce qu'un hoop
                # ([[sons]] riser_hoop) tombe sur cette coupe (ex. « soixante cuillères », la balance)
                sons.append(woosh(c, tr["woosh_volume"]))

    # --- les zooms du cadre A : un par plan ---
    zoom = []
    for p in plans:
        if p["cadre"] != "A":
            continue
        z = pcfg[p["id"]].get("zoom", {"type": "aucun"})
        d, e = p["debut"], p["fin"]
        pose = r3(max(0, d - TR / 2 - 0.02))          # posé pendant le glissé d'arrivée
        if z["type"] == "lent":                      # lent vers l'avant, sur tout le plan
            zoom.append(f'        tl.fromTo("#zoom-a", {{ scale: 1 }}, {{ scale: {z["fin"]}, duration: {r3(e - pose)}, ease: "none", immediateRender: false }}, {pose});')
        elif z["type"] == "punch":                   # punch-in franc dès l'arrivée
            zoom.append(f'        tl.set("#zoom-a", {{ scale: {z["echelle"]} }}, {pose});')
        elif z["type"] == "lent_puis_punch":         # lent jusqu'au mot, puis punch-in dessus
            tm = v.t(z["mot"])
            zoom.append(f'        tl.fromTo("#zoom-a", {{ scale: 1 }}, {{ scale: {z["fin"]}, duration: {r3(tm - d)}, ease: "none", immediateRender: false }}, {pose});')
            zoom.append(f'        tl.set("#zoom-a", {{ scale: {z["echelle"]} }}, {tm});')
        elif z["type"] == "punch_sur_mot":           # plan à 100 %, punch-in sur le mot
            zoom.append(f'        tl.set("#zoom-a", {{ scale: 1 }}, {pose});')
            zoom.append(f'        tl.set("#zoom-a", {{ scale: {z["echelle"]} }}, {v.t(z["mot"])});')
        elif z["type"] == "aucun":
            zoom.append(f'        tl.set("#zoom-a", {{ scale: 1 }}, {pose});')
        else:
            raise SystemExit(f"zoom inconnu : {z}")

    # --- les mots incrustés sur le cadre A ---
    inc_html, inc_css, inc_js = [], [], []
    top = ca.get("incruste_top", 250)
    for i in cfg.get("incrustes", []):
        fond, rebord = STYLES[i.get("style", "blanc")]
        sel = "#" + i["id"]
        attrs = " data-layout-allow-overlap" if i.get("chevauchement") else ""
        if i.get("icone"):     # une icône Lucide dans un rond (rond = son diamètre, 110 par défaut)
            inc_html.append(f'        <div class="incruste-rond" id="{i["id"]}"{attrs}><div class="ico"><i data-lucide="{i["icone"]}"></i></div></div>')
            inc_css.append(f'      {sel} {{ left: {i["left"]}px; background: {fond}; box-shadow: 0 9px 0 {rebord}; }}')
            if i.get("rond"):  # plus gros : « l'icône d'enregistrement n'est pas super visible » (28 septembre)
                d = i["rond"]
                inc_css.append(f'      {sel} {{ top: {top - (d - 110) // 2}px; width: {d}px; height: {d}px; border-radius: {d // 2}px; }}')
                inc_css.append(f'      {sel} .ico {{ left: {d // 4}px; top: {d // 4}px; width: {d // 2}px; height: {d // 2}px; }}')
        else:
            barre = '<div class="barre"></div>' if i.get("barre") else ""
            inc_html.append(f'        <div class="mot" id="{i["id"]}"{attrs}>{i["texte"]}{barre}</div>')
            extra = (f" font-size: {i['taille']}px;" if i.get("taille") else "") + (" font-variant-numeric: tabular-nums;" if i.get("chiffres") else "")
            inc_css.append(f'      {sel} {{ left: {i["left"]}px; width: {i["largeur"]}px; background: {fond}; box-shadow: 0 9px 0 {rebord};{extra} }}')
            if i.get("barre"):
                inc_css.append(f'      {sel} .barre {{ position: absolute; left: 50px; top: 50px; width: {i["largeur"] - 100}px; height: 12px; border-radius: 6px; background: var(--yb-red); }}')
        ta = v.t(i["apparait"])
        inc_js.append(f'        tl.fromTo("{sel}", {{ opacity: 0, scale: 0.3 }}, {{ opacity: 1, scale: 1, duration: 0.25, ease: "back.out(1.6)" }}, {ta});')
        sons.append(("soft_click.wav", r3(ta), 0.22, 1, None))
        if i.get("barre"):
            tb = v.t(i["barre"])
            inc_js.append(f'        tl.fromTo("{sel} .barre", {{ scaleX: 0, transformOrigin: "0% 50%" }}, {{ scaleX: 1, duration: 0.2, ease: "power2.out", immediateRender: false }}, {tb});')
            sons.append(("soft_click.wav", r3(tb), 0.22, 1, None))
        dis = i.get("disparait")
        if dis == "fin_plan":      # le plan est sorti : on l'efface hors champ
            inc_js.append(f'        tl.set("{sel}", {{ opacity: 0 }}, {r3(v.plan_a(ta)["fin"] + 0.2)});')
        elif dis:                  # un fondu de 0,12 s, `avance` s avant le mot (pour laisser la place au suivant)
            inc_js.append(f'        tl.to("{sel}", {{ opacity: 0, duration: 0.12, ease: "power2.in" }}, {r3(v.t(dis) - i.get("avance", 0))});')

    # --- les bandeaux : un fond sombre semi-transparent et flouté derrière des incrustes (l'appel),
    # pour qu'ils ressortent sur le mur clair et les cheveux (« met un background transparent car ce
    # n'est pas super visible », 28 septembre). Posés derrière les incrustes, ils restent jusqu'à la fin.
    band_html = []
    for b in cfg.get("bandeaux", []):
        sel = "#" + b["id"]
        band_html.append(f'        <div class="bandeau" id="{b["id"]}"></div>')
        inc_css.append(f'      {sel} {{ left: {b["left"]}px; width: {b["largeur"]}px; }}')
        inc_js.append(f'        tl.fromTo("{sel}", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.2, ease: "power2.out" }}, {r3(v.t(b["apparait"]) - 0.05)});')

    # --- les risers et les hoops des moments forts ---
    for s in cfg.get("sons", []):
        t = v.t(s["mot"])
        if s["type"] == "riser_hoop":
            sons.append(riser(t, s["longueur"], s["vol_riser"], s.get("riser", "rizer-windy.mp3"), s.get("pic")))
            sons.append(hit(t, s["vol_hit"]))
        elif s["type"] == "hoop":
            sons.append(hit(t, s["vol_hit"]))
        elif s["type"] == "woosh":
            sons.append(woosh(t, s.get("volume", tr["woosh_volume"])))
        else:
            raise SystemExit(f"son inconnu : {s}")

    # --- les sous-titres ---
    mots = sous_titres.mots_montes(v)
    gs = sous_titres.groupes(v, mots)
    cid_st = f"{cfg['video']['id']}-sous-titres"
    io.open(v.chemin("compositions", "sous-titres.html"), "w", encoding="utf-8", newline="\n").write(
        sous_titres.composition(v, gs, cid_st, DUREE))
    sous_titres.srt(mots, v.chemin("sous-titres.srt"), cfg["rendu"].get("vitesse", 1.0))

    # --- les pistes audio ---
    audios = [f'      <audio id="voix" src="assets/rushes/voix-montage.mp4" data-start="0" data-duration="{DUREE}" data-track-index="100" data-volume="1"></audio>']
    # [son] : des facteurs sur TOUS les bruitages et sur la musique (28 septembre : « réduis les clics,
    # risers et woosh de 40 %, la musique de 20 % »). Les volumes de la fiche restent ceux de la méthode.
    fs, fm = cfg.get("son", {}).get("sfx", 1.0), cfg.get("son", {}).get("musique", 1.0)
    for n, m in enumerate(cfg.get("musique", [])):
        de, a = v.t(m["de"]), v.t(m["a"])
        audios.append(f'      <audio id="musique-{n + 1}" src="{m["fichier"]}" data-start="{r3(de)}" data-duration="{r3(a - de)}" '
                      f'data-media-start="{m.get("media_start", 0)}" data-track-index="{90 + n}" data-volume="{r3(m["volume"] * fm)}"></audio>')
    for n, (src, st, du, vol, media) in enumerate(sons, 1):
        ms = f' data-media-start="{media}"' if media is not None else ""
        audios.append(f'      <audio id="son-{n:02d}" src="assets/sfx/{src}" data-start="{st}" data-duration="{du}"{ms} '
                      f'data-track-index="{100 + n}" data-volume="{r3(vol * fs)}"></audio>')

    carte = cb["carte"]
    bande_top = cb["bande_top"]
    feuilles = "\n".join(f'    <link rel="stylesheet" href="{f}">' for f in cfg["video"]["feuilles"])
    zx, zy = ca.get("zoom_origine", [540, 800])
    html = f"""<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1080, height=1920">
{feuilles}
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script src="assets/vendor/lucide.min.js"></script>
    <style>
      @font-face {{
        font-family: "Archivo";
        src: url("assets/fonts/Archivo.woff2") format("woff2");
        font-weight: 400 900;
        font-display: block;
      }}
      /* Le Kallaway edit, écrit par outils/kallaway-edit (ke.py montage) depuis kallaway.toml.
         Ne pas retoucher à la main : changer la fiche et régénérer.
         A : lui en grand. B : l'animation en haut (1080 x 960), lui détouré devant une carte en bas. */
      html, body {{ width: 1080px; height: 1920px; background: #1a1a1a; }}
      .calque {{ position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; overflow: hidden; will-change: transform; }}
      #zoom-a {{ position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; will-change: transform; }}
      .fond {{ position: absolute; left: 0; width: 1080px; height: 960px; display: block; }}
      #fond-haut {{ top: 0; }}
      #fond-bas {{ top: 960px; }}
      .hote {{ position: absolute; left: 0; top: 0; will-change: transform; }}
      /* La bande du visage (visage-b.mp4, {cb['bande_largeur']} x {cb['bande_hauteur']}) couvre y {bande_top} -> {bande_top + cb['bande_hauteur']}.
         La carte n'en montre que le fond : aucune bordure, un rebord plein, les coins arrondis. */
      #carte-visage {{ position: absolute; left: {carte['left']}px; top: {carte['top']}px; width: {carte['largeur']}px; height: {carte['hauteur']}px;
        border-radius: {carte['rayon']}px; overflow: hidden; box-shadow: 0 12px 0 rgba(0, 0, 0, 0.12); background: #222; }}
      #video-b-fond {{ position: absolute; left: {-carte['left']}px; top: {bande_top - carte['top']}px; width: {cb['bande_largeur']}px; height: {cb['bande_hauteur']}px; }}
      /* Lui, détouré, posé exactement sur la bande : sa tête sort de la carte par le haut. */
      #decoupe {{ position: absolute; left: 0; top: {bande_top}px; width: {cb['bande_largeur']}px; height: {cb['bande_hauteur']}px;
        filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.22)); }}
      #video-b-perso {{ position: absolute; left: 0; top: 0; width: {cb['bande_largeur']}px; height: {cb['bande_hauteur']}px; }}
      /* Les mots incrustés sur le cadre A, au-dessus de la tête. */
      .mot {{ position: absolute; top: {top}px; height: 110px; line-height: 110px; padding: 0 40px; border-radius: 30px;
        font-size: 70px; font-weight: 900; white-space: nowrap; opacity: 0; will-change: transform; text-align: center; color: var(--ink); }}
      .incruste-rond {{ position: absolute; top: {top}px; width: 110px; height: 110px; border-radius: 55px; color: var(--ink);
        opacity: 0; will-change: transform; }}
      .incruste-rond .ico {{ position: absolute; left: 27px; top: 27px; width: 56px; height: 56px; }}
      .incruste-rond .ico svg.lucide {{ display: block; width: 100%; height: 100%; }}
      .bandeau {{ position: absolute; top: {top - 25}px; height: 160px; border-radius: 48px; opacity: 0;
        background: rgba(15, 15, 15, 0.42); backdrop-filter: blur(10px); }}
{chr(10).join(inc_css)}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{DUREE}" data-width="1080" data-height="1920">

      <div id="calque-b" class="calque">
        <img class="fond" id="fond-haut" src="{cb['fonds'][0]}" alt="">
        <img class="fond" id="fond-bas" src="{cb['fonds'][1]}" alt="">
{chr(10).join(hotes)}
        <div id="carte-visage">
          <video id="video-b-fond" class="clip" data-layout-allow-overflow src="assets/rushes/visage-b.mp4" data-start="0" data-duration="{DUREE}" data-track-index="1" muted playsinline></video>
        </div>
        <div id="decoupe" data-layout-allow-overflow data-layout-allow-occlusion>
          <video id="video-b-perso" class="clip" src="assets/rushes/visage-b-detoure.webm" data-start="0" data-duration="{DUREE}" data-track-index="2" muted playsinline></video>
        </div>
      </div>

      <div id="calque-a" class="calque">
        <div id="zoom-a" data-layout-allow-overflow>
          <video id="video-a" class="clip" src="assets/rushes/voix-montage.mp4" data-start="0" data-duration="{DUREE}" data-track-index="0" muted playsinline></video>
        </div>
{chr(10).join(band_html + inc_html)}
      </div>

      <div id="host-sous-titres" data-composition-id="{cid_st}" class="clip hote" data-start="0" data-duration="{DUREE}" data-track-index="{3 + len(hotes)}" data-composition-src="compositions/sous-titres.html"></div>

{chr(10).join(audios)}
    </div>

    <script>
      (function () {{
        if (window.lucide) window.lucide.createIcons();
        var tl = gsap.timeline({{ paused: true }});
        gsap.set("#calque-b", {{ x: 1080 }});
        gsap.set("#zoom-a", {{ transformOrigin: "{zx}px {zy}px" }});

        // Les coupes : vers l'animation, glissé vers la gauche ; vers lui, glissé vers la droite.
{chr(10).join(js)}

        // Les zooms sur lui en grand : un par plan.
{chr(10).join(zoom)}

        // Les mots incrustés sur le cadre A.
{chr(10).join(inc_js)}

        window.__timelines["main"] = tl;
      }})();
    </script>
  </body>
</html>
"""
    io.open(v.chemin("index.html"), "w", encoding="utf-8", newline="\n").write(html)
    print(f"index.html : {DUREE} s, {len(plans)} plans, {len(plans) - 1} coupes, {len(sons)} sons, "
          f"{len(gs)} groupes de sous-titres ({len(mots)} mots)")
    print("sons :")
    for (src, st, du, vol, media) in sorted(sons, key=lambda s: s[1]):
        if src != "soft_click.wav":
            print(f"   {st:6.2f} s  {src:<20} vol {vol}")
    print("Ensuite : `npx hyperframes@0.8.21 check` dans le dossier, puis `ke.py <dossier> rendre brouillon`.")


if __name__ == "__main__":
    main(Video(sys.argv[1]), sys.argv[2:])
