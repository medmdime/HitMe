"""Les sous-titres : incrustés mot à mot dans la vidéo, et un .srt à côté pour l'appli.

Les règles (Mohamed, format court : « les sous-titres mot par mot, blancs, un mot en jaune par
phrase », et le 26 septembre : « ajoute la transcription ») :
  - les mots de la DEUXIÈME écoute (large-v3, sans amorce) : ils collent à ce qui est dit, jusqu'aux
    écarts du texte (« profite bien sûr de ton dessert », dit tel quel) ;
  - deux ou trois mots par groupe, 16 caractères au plus ; un groupe ne passe jamais une coupe de
    plan ni une fin de phrase ; chaque mot apparaît quand il est prononcé (petit pop, 0,12 s) ;
  - blancs, un gros contour sombre (paint-order: stroke fill), pour se lire sur la toile claire du
    cadre B comme sur le t-shirt blanc du cadre A ; un mot en jaune par phrase ([sous_titres] jaunes,
    dans l'ordre du texte) ;
  - B : entre l'animation et la tête (y ≈ 980) ; A : sous le menton (y ≈ 1320). Rien sous y = 1536,
    l'interface d'Instagram le couvre ;
  - le .srt (une phrase par bloc, ponctuée) suit les temps de la vidéo LIVRÉE, donc accélérée :
    Instagram et TikTok traduisent ces sous-titres-là, jamais le texte incrusté.

Sur l'assiette : 164 mots, 73 groupes. Le premier jet mettait les sous-titres en text-shadow fin : il
se lisait mal sur le t-shirt ; le contour épais a réglé ça.
"""
import io, re
from commun import norm


def mots_montes(v):
    """Chaque mot de l'écoute « sous-titres », recollé (c 'est -> c'est), posé dans la piste montée."""
    carte = v.carte()
    large = v.lire(f"mots-{v.cfg['transcription']['sous_titres']}.json")
    out = []
    for f in v.ordre:
        ms = [m for m in carte["morceaux"] if m["f"] == f]
        colles = []
        for w in large[f]:
            if colles and (w["w"].startswith("'") or w["w"].startswith("-")):
                colles[-1]["w"] += w["w"]
                colles[-1]["e"] = w["e"]
            else:
                colles.append(dict(w))
        for w in colles:
            mid = (w["s"] + w["e"]) / 2
            m = next((m for m in ms if m["a"] <= mid <= m["b"]), None)
            if m is None:
                m = min(ms, key=lambda m: min(abs(m["a"] - mid), abs(m["b"] - mid)))
            tm = lambda x: round(m["t"] + min(max(x, m["a"]), m["b"]) - m["a"], 3)
            texte = re.sub(r"[.,;:!?]+$", "", w["w"])
            point = w["w"].endswith((".", "?", "!"))
            out.append({"w": texte, "s": tm(w["s"]), "e": tm(w["e"]), "fin": point or w["w"].endswith(","),
                        "point": point, "ponct": w["w"][len(texte):]})
    # une majuscule en tête des phrases que Whisper a laissées en minuscule : [["mardi", 0], …]
    # (le mot, et le combien-tième de ce mot dans toute la vidéo, à partir de 0)
    maj = {(m, n) for m, n in v.cfg["sous_titres"].get("majuscules", [])}
    vus = {}
    for w in out:
        k = w["w"].lower()
        n = vus.get(k, 0)
        vus[k] = n + 1
        if (k, n) in maj:
            w["w"] = w["w"][0].upper() + w["w"][1:]
    return out


def groupes(v, mots):
    """Deux ou trois mots par groupe, jamais à cheval sur une coupe de plan ni sur une fin de phrase."""
    coupes = [p["debut"] for p in v.plans()[1:]]
    gs, cur = [], []

    def plan_de(t):
        return sum(1 for c in coupes if t >= c - 0.001)

    for w in mots:
        if cur:
            long = len(" ".join(x["w"] for x in cur + [w]))
            if len(cur) >= 3 or long > 16 or plan_de(w["s"]) != plan_de(cur[0]["s"]) or cur[-1]["fin"]:
                gs.append(cur)
                cur = []
        cur.append(w)
    if cur:
        gs.append(cur)
    jaunes = v.cfg["sous_titres"]["jaunes"]
    k = 0
    for g in gs:
        for w in g:
            w["jaune"] = False
            if k < len(jaunes) and norm(w["w"]) == norm(jaunes[k]):
                w["jaune"] = True
                k += 1
    if k != len(jaunes):
        raise SystemExit(f"mots jaunes : {k}/{len(jaunes)} trouvés ; le suivant attendu est « {jaunes[k]} » "
                         f"(ils se cherchent dans l'ordre du texte)")
    return gs


def srt(mots, chemin, vitesse=1.0):
    """Une phrase par bloc (coupée à la virgule si elle dépasse 18 caractères, forcée à 60), ponctuée,
    aux temps de la vidéo accélérée."""
    blocs, cur = [], []
    for w in mots:
        cur.append(w)
        long = len(" ".join(x["w"] for x in cur))
        if w["point"] or (w["fin"] and long > 18) or long > 60:
            blocs.append(cur)
            cur = []
    if cur:
        blocs.append(cur)

    def ts(t):
        h, r = divmod(int(round(t / vitesse * 1000)), 3600000)
        m, r = divmod(r, 60000)
        s, ms = divmod(r, 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    lignes = []
    for i, b in enumerate(blocs, 1):
        fin = blocs[i][0]["s"] if i < len(blocs) else b[-1]["e"] + 0.3
        lignes += [str(i), f"{ts(b[0]['s'])} --> {ts(fin)}", " ".join(x["w"] + x["ponct"] for x in b), ""]
    io.open(chemin, "w", encoding="utf-8", newline="\n").write("\n".join(lignes))


CSS = """      /* Les sous-titres : blancs, un mot en jaune par phrase, un contour épais pour se lire sur la toile
         claire comme sur un t-shirt blanc. B : entre l'animation et la tête ; A : sous le menton.
         paint-order: stroke fill pose le contour DERRIÈRE la lettre (sinon il la ronge) ; un
         text-shadow en 8 directions, essayé d'abord, donnait un contour trop fin. */
      .st { position: absolute; left: 30px; width: 1020px; text-align: center; font-size: TAILLEpx; font-weight: 900;
        line-height: 1.12; color: #ffffff; opacity: 0; letter-spacing: 0.01em;
        -webkit-text-stroke: 14px #1f1f1f; paint-order: stroke fill; text-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); }
      .st-b { top: TOP_Bpx; }
      .st-a { top: TOP_Apx; }
      .st .w { display: inline-block; margin: 0 9px; opacity: 0; will-change: transform; }
      .st .w.j { color: var(--yb-yellow); }"""


def composition(v, gs, cid, duree):
    """compositions/sous-titres.html : une sous-composition 1080 × 1920 transparente, posée au-dessus de
    tout. Les temps sont dans deux tableaux et une boucle : une ligne GSAP par mot faisait 400 lignes
    et `check` avertissait (composition_file_too_large)."""
    st = v.cfg["sous_titres"]
    html, tg, tm = [], [], []
    for n, g in enumerate(gs):
        spans = " ".join(f'<span class="w{" j" if w["jaune"] else ""}" id="st-{n}-{k}">{w["w"]}</span>' for k, w in enumerate(g))
        cadre = v.plan_a(g[0]["s"])["cadre"].lower()
        html.append(f'        <div class="st st-{cadre}" id="st-{n}">{spans}</div>')
        fin = gs[n + 1][0]["s"] if n + 1 < len(gs) else -1
        tg.append(f"[{g[0]['s']}, {fin}]")
        tm.append("[" + ", ".join(str(w["s"]) for w in g) + "]")
    css = CSS.replace("TAILLE", str(st.get("taille", 72))).replace("TOP_B", str(st["top_b"])).replace("TOP_A", str(st["top_a"]))
    return f"""<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1080, height=1920">
    <link rel="stylesheet" href="compositions/components/kit.css">
    <link rel="stylesheet" href="compositions/components/youbud.css">
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      @font-face {{
        font-family: "Archivo";
        src: url("assets/fonts/Archivo.woff2") format("woff2");
        font-weight: 400 900;
        font-display: block;
      }}
      /* Écrit par outils/kallaway-edit (ke.py montage) : ne pas retoucher à la main, régénérer. */
{css}
    </style>
  </head>
  <body>
    <div id="st-root" data-composition-id="{cid}" data-start="0" data-duration="{duree}" data-width="1080" data-height="1920">
      <div id="st-scene" class="clip" data-start="0" data-duration="{duree}" data-track-index="0" data-layout-allow-overlap data-layout-allow-occlusion>
{chr(10).join(html)}
      </div>
    </div>

    <script>
      (function () {{
        var tl = gsap.timeline({{ paused: true }});
        // chaque groupe : [apparition, disparition (-1 : jusqu'à la fin)] ; chaque mot : son temps
        var G = [{", ".join(tg)}];
        var M = [{", ".join(tm)}];
        G.forEach(function (g, n) {{
          tl.set("#st-" + n, {{ opacity: 1 }}, g[0]);
          if (g[1] >= 0) tl.set("#st-" + n, {{ opacity: 0 }}, g[1]);
          M[n].forEach(function (t, k) {{
            tl.fromTo("#st-" + n + "-" + k, {{ opacity: 0, y: 14, scale: 0.85 }},
              {{ opacity: 1, y: 0, scale: 1, duration: 0.12, ease: "power3.out", immediateRender: false }}, t);
          }});
        }});
        window.__timelines["{cid}"] = tl;
      }})();
    </script>
  </body>
</html>
"""
