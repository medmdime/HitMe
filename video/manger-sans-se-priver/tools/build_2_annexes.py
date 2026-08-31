# -*- coding: utf-8 -*-
"""Génère scenario.html depuis scenario.json — partie 2.

Production, formats courts, garde-fous, sources et paratextes YouTube. Ce script
AJOUTE au fichier écrit par build_1_scenario.py : toujours lancer les deux, et
dans cet ordre, sinon le document est tronqué ou dupliqué.
"""
import json, io, re, os, html

# La racine du projet est le dossier parent de tools/ : les scripts marchent
# depuis n'importe quel clone, sans chemin absolu.
S = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = r"C:\Users\melmdim\HitMe\video\manger-sans-se-priver\scenario.html"
d = json.load(io.open(os.path.join(S, "scenario.json"), encoding="utf-8"))
arch, prod, sources = d["architecture"], d["production"], d["sources"]
videos = d["videos"]
chs = d["chapitres"]
e = html.escape

P = []
w = P.append

CHT = {c["n"]: c["titre"] for c in chs}

# ---------------- PRODUCTION ----------------
w('<section id="prod"><div class="wrap">')
w('<div class="shead"><h2>Production</h2><span class="eyebrow">ce qu&rsquo;il faut fabriquer</span></div>')

comps = prod["compositions"]
n3d = len([c for c in comps if "2D suffit" not in (c.get("notes_3d") or "")])
w('<p style="max-width:44rem;color:var(--ink-2);margin-bottom:1.8rem">'
  '<b>%d compositions HyperFrames</b> à construire, une par bloc d&rsquo;animation, '
  'de 2 à 15&nbsp;secondes chacune &mdash; jamais une seule timeline de huit minutes. '
  '%d gagnent à passer en 3D, le reste tient en 2D. Toutes réutilisent les huit devices du '
  'format et le composant <span class="mono">SplitBar</span> déjà écrit.</p>' % (len(comps), n3d))

by_ch = {}
for c in comps:
    by_ch.setdefault(c["chapitre"], []).append(c)

for n in sorted(by_ch):
    w('<h3 style="font-size:1.05rem;margin:2rem 0 .7rem;color:var(--accent)">'
      '<span class="mono" style="font-size:.75rem">CH%02d</span> &nbsp;%s</h3>' % (n, e(CHT.get(n, ""))))
    w('<div class="scroller"><table class="tbl"><thead><tr>'
      '<th>Composition</th><th>Durée</th><th>Device</th><th>Ce qui bouge</th>'
      '<th>Valeurs</th><th>3D&nbsp;?</th></tr></thead><tbody>')
    for c in by_ch[n]:
        d3 = c.get("notes_3d") or ""
        is3 = "2D suffit" not in d3
        w('<tr><td class="mono" style="font-size:.76rem;white-space:nowrap">%s</td>'
          '<td class="mono">%.1f&nbsp;s</td><td>%s</td><td>%s</td>'
          '<td class="mono" style="font-size:.72rem">%s</td><td>%s</td></tr>'
          % (e(c["id"]), c["duree_s"], e(c["device"]), e(c["description"]),
             e(c.get("valeurs") or ""),
             ('<span class="pill p-solide">3D</span> ' + e(d3)) if is3 else '<span style="color:var(--faint)">2D</span>'))
    w("</tbody></table></div>")

# --- b-roll reel
w('<h3 style="font-size:1.15rem;margin:2.8rem 0 .8rem">À filmer soi-même</h3>')
w('<div class="grid2">')
for b in prod["broll_reel"]:
    w('<div class="cell"><span class="tag">CH%02d &middot; %s</span><p>%s</p>'
      '<p style="color:var(--muted);font-size:.8rem;margin-top:.5rem">%s</p></div>'
      % (b["chapitre"], e(b["plan"]), e(b["quoi"]), e(b["ou"])))
w("</div>")

# --- b-roll genere
w('<h3 style="font-size:1.15rem;margin:2.8rem 0 .8rem">À générer &mdash; prompts Higgsfield</h3>')
w('<p style="color:var(--muted);font-size:.9rem;margin-bottom:1rem;max-width:42rem">'
  'Prompts en anglais, prêts à coller.</p>')
w('<div class="grid2">')
for b in prod["broll_genere"]:
    w('<div class="cell"><span class="tag">CH%02d &middot; %s &middot; %s</span>'
      '<p class="mono" style="font-size:.76rem;line-height:1.55;color:var(--ink-2)">%s</p></div>'
      % (b["chapitre"], e(b["plan"]), e(b["modele"]), e(b["prompt"])))
w("</div>")

# --- articles a montrer
w('<h3 style="font-size:1.15rem;margin:2.8rem 0 .8rem">Articles à montrer à l&rsquo;écran</h3>')
w('<div class="scroller"><table class="tbl"><thead><tr><th>Ch.</th><th>Référence</th>'
  "<th>Ce qu&rsquo;on encadre</th></tr></thead><tbody>")
for a in prod["articles_a_montrer"]:
    w('<tr><td class="mono">%02d</td><td style="font-size:.8rem">%s</td><td>%s</td></tr>'
      % (a["chapitre"], e(a["reference"]), e(a["quoi_surligner"])))
w("</tbody></table></div>")
w("</div></section>")

# ---------------- FORMATS COURTS ----------------
sh = d.get("shorts")
if sh:
    w('<section id="shorts"><div class="wrap">')
    w('<div class="shead"><h2>Formats courts</h2>'
      '<span class="eyebrow">%d shorts &agrave; tirer du long format</span></div>' % len(sh["shorts"]))

    # le principe, en tete : pourquoi un chapitre n est pas encore un short
    w('<div class="card releve" style="margin-bottom:2.2rem">')
    for para in [x for x in sh["principe"].split("\n") if x.strip()]:
        cls = ' class="quote"' if para is sh["principe"].split("\n")[0] else ""
        w('<p%s style="margin-bottom:.8rem">%s</p>' % (cls, e(para.strip())))
    w('</div>')

    for s_ in sh["shorts"]:
        pot = s_["potentiel"]
        coul = {"fort": "good", "moyen": "key", "faible": "bad"}.get(pot, "key")
        w('<article class="chap" style="margin-top:2.4rem">')
        w('<div class="chead"><div class="cnum">%02d</div><div><h3>%s</h3></div>'
          % (s_["rang"], e(s_["titre"])))
        w('<div class="cmeta"><span><b>%d s</b></span>'
          '<span><span class="pill p-%s">%s</span></span><span>%s</span></div></div>'
          % (s_["duree_s"], {"fort": "solide", "moyen": "faible", "faible": "retractee"}[pot],
             pot, e(s_["source_chapitres"][:110])))

        w('<div class="beats" style="margin:1.4rem 0 1.2rem">')
        w('<div class="beat"><span class="eyebrow">La croyance contest&eacute;e</span><p>%s</p></div>'
          % e(s_["croyance"]))
        w('<div class="beat meca"><span class="eyebrow">M&eacute;canisme</span><p>%s</p></div>'
          % e(s_["mecanisme"]))
        w('<div class="beat"><span class="eyebrow">Le chiffre</span><p>%s</p></div>'
          % e(s_["chiffre_choc"]))
        w('</div>')

        w('<div class="ledger">')
        for lab, txt, mark in [
                ("&Agrave; TOURNER &mdash; le hook", s_["hook_a_tourner"], True),
                ("Le retournement, repris du long format", s_["turn"], False),
                ("&Agrave; TOURNER &mdash; la chute", s_["landing_a_tourner"], True),
                ("&Agrave; couper", s_["a_couper"], False)]:
            w('<div class="row%s">' % (" is-turn" if mark else ""))
            w('<div class="rail"><span class="tc" style="font-size:.62rem;letter-spacing:.06em">%s</span></div>' % lab)
            w('<div><p class="narr"%s>%s</p></div>'
              % (' style="font-size:1rem;color:var(--muted)"' if not mark else "", e(txt)))
            w('<div class="ann"></div></div>')
        w('</div>')
        w('<p style="margin-top:.9rem;font-size:.9rem;color:var(--muted);max-width:44rem">'
          '<b style="color:var(--ink)">Pourquoi ce rang :</b> %s</p>' % e(s_["pourquoi"]))
        w('</article>')

    w('<h3 style="font-size:1.15rem;margin:3rem 0 .9rem">Ordre de publication</h3>')
    w('<div class="card releve">')
    for para in [x for x in sh["ordre_publication"].split("\n") if x.strip()]:
        w('<p style="margin-bottom:.7rem;font-size:.95rem">%s</p>' % e(para.strip()))
    w('</div>')
    w('</div></section>')

# ---------------- GARDE-FOUS ----------------
w('<section id="garde"><div class="wrap">')
w('<div class="shead"><h2>Garde-fous</h2>'
  '<span class="eyebrow">%d conflits entre le brief et la littérature</span></div>' % len(arch["risques"]))
w('<p style="max-width:44rem;color:var(--ink-2);margin-bottom:1.8rem">'
  'Chacun est un endroit où l&rsquo;idée de départ ne survit pas telle quelle aux sources. '
  'Ils sont déjà traités dans le scénario ci-dessus &mdash; cette liste existe pour que le '
  'montage ne les réintroduise pas en coupant la mauvaise phrase.</p>')
for r in arch["risques"]:
    m = re.match(r"\s*(CONFLIT\s*\d+)\s*[—–-]\s*(.+)", r, re.S)
    if m:
        w('<div class="risk"><b>%s</b>%s</div>' % (e(m.group(1)), e(m.group(2).strip())))
    else:
        w('<div class="risk">%s</div>' % e(r))
w('<h3 style="font-size:1.15rem;margin:2.5rem 0 .8rem">Si tu dois descendre à 6&nbsp;min&nbsp;40</h3>')
w('<div class="card releve"><p style="font-size:.95rem;color:var(--ink-2)">%s</p></div>'
  % e(arch["coupe_court"]))
w("</div></section>")

# ---------------- SOURCES ----------------
w('<section id="src"><div class="wrap">')
w('<div class="shead"><h2>Sources</h2><span class="eyebrow">%d références uniques</span></div>' % len(sources))
from collections import Counter
cnt = Counter(s["force"] for s in sources)
w('<p style="margin-bottom:1.4rem;color:var(--ink-2)">')
for k, lab in [("solide", "solides"), ("moderee", "modérées"), ("faible", "faibles"),
               ("contestee", "contestées"), ("retractee", "rétractées")]:
    if cnt.get(k):
        w('<span class="pill p-%s" style="margin-right:.5rem">%d %s</span>' % (k, cnt[k], lab))
w("</p>")
w('<div class="scroller"><table class="tbl"><thead><tr><th>PMID</th><th>Référence</th>'
  "<th>Niveau de preuve</th></tr></thead><tbody>")
for s in sources:
    w('<tr><td class="mono"><a href="https://pubmed.ncbi.nlm.nih.gov/%s/" target="_blank" rel="noopener">%s</a></td>'
      '<td style="font-size:.82rem">%s</td><td><span class="pill p-%s">%s</span></td></tr>'
      % (s["pmid"], s["pmid"], e(s["texte"]), s["force"], s["force"]))
w("</tbody></table></div>")
w("</div></section>")

# ---------------- PARATEXTES ----------------
w('<section id="yt"><div class="wrap">')
w('<div class="shead"><h2>Paratexte YouTube</h2>'
  '<span class="eyebrow">un jeu par vidéo</span></div>')
for v in videos:
    body = (v["paratexte"] or "").strip()
    if body.startswith("```"):
        body = re.sub(r"^```\w*\n", "", body)
        body = re.sub(r"\n```\s*$", "", body)
    w('<h3 style="font-size:1.3rem;margin:2.4rem 0 .3rem;color:var(--accent)">'
      'Vidéo %d &middot; %s</h3>' % (v["n"], e(v["titre"])))
    w('<pre class="desc">%s</pre>' % e(body))
w('<p style="margin-top:2.5rem;color:var(--muted);font-size:.88rem;max-width:44rem;'
  'border-top:1px solid var(--rule);padding-top:1rem">'
  'Les timecodes des chapitres sont calculés sur les durées réelles du scénario. '
  'Quelques références citées dans les vidéos n&rsquo;ont pas pu être appariées de façon '
  'fiable à un PMID unique : elles sont signalées comme telles plutôt qu&rsquo;inventées, '
  'et restent à compléter avant mise en ligne.</p>')
w("</div></section>")

with io.open(OUT, "a", encoding="utf-8") as f:
    f.write("\n" + "\n".join(P))
print("final :", os.path.getsize(OUT) // 1024, "Ko")
