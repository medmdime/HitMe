# -*- coding: utf-8 -*-
"""Génère scenario.html depuis scenario.json — partie 1.

Le bandeau de chiffres, la thèse, et les huit chapitres regroupés par vidéo, plan
par plan. À lancer AVANT build_2_annexes.py, qui ajoute la suite au même fichier.

    python tools/build_1_scenario.py
    python tools/build_2_annexes.py
"""
import json, io, re, os, html

# La racine du projet est le dossier parent de tools/ : les scripts marchent
# depuis n'importe quel clone, sans chemin absolu.
S = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(S, "scenario.html")
d = json.load(io.open(os.path.join(S, "scenario.json"), encoding="utf-8"))
chs, arch, prod, sources = d["chapitres"], d["architecture"], d["production"], d["sources"]
videos = d["videos"]

e = html.escape
COL = {"jaune": "key", "rouge": "bad", "vert": "good", "bleu": "cool"}


def screen(t):
    """[MOT:jaune] -> span colore."""
    if not t:
        return ""
    out = e(t)
    out = re.sub(r"\[([^\]:]+):([a-zA-Zéè]+)\]",
                 lambda m: '<b class="hl hl-%s">%s</b>' % (COL.get(m.group(2).lower(), "key"), m.group(1)),
                 out)
    return out


def nw(t):
    return len([x for x in re.findall(r"[0-9A-Za-zÀ-ÿ'\u2019-]+", t or "") if x.strip("'\u2019-")])


SRC_LABEL = {"camera": "caméra", "animation": "animation", "broll": "b-roll", "article": "article"}


def _toks(s):
    """Mots significatifs, sans accents, pour comparer deux phrases."""
    import unicodedata
    s = unicodedata.normalize("NFKD", (s or "").lower())
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    return set(x for x in re.findall(r"[a-z0-9]+", s) if len(x) > 3)


def turn_shot(chap, arch_chap):
    """Le plan qui PORTE le retournement du chapitre : un seul, jamais zero.

    On ne peut pas se fier au seul bruitage : le riser et l'impact debordent sur
    les plans voisins, et la casse varie d'un chapitre a l'autre. On prend donc
    le plan dont la narration recouvre le mieux le turn ecrit dans l'architecture,
    en departageant a egalite par la presence du riser ou de l'impact.
    """
    if not arch_chap:
        return None
    tn = _toks(arch_chap.get("turn"))
    best, best_score = None, 0
    for p in chap["plans"]:
        sfx = 1 if re.search(r"(?i)\b(riser|impact)\b", p.get("sfx") or "") else 0
        score = len(_toks(p.get("narration")) & tn) * 2 + sfx
        if score > best_score:
            best, best_score = p["t"], score
    return best if best_score >= 4 else None


t0, starts = 0.0, []
for c in chs:
    starts.append(t0)
    t0 += c["duree_s"]


def mmss(x):
    return "%d:%02d" % (int(x // 60), int(round(x % 60)))


P = []
w = P.append

w("<title>Ce n'est pas ta volonté</title>")
w('<link rel="preconnect" href="https://fonts.googleapis.com">')
w('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
w('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
  'family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1'
  '&family=Newsreader:opsz,wght@6..72,200..700'
  '&family=IBM+Plex+Mono:wght@400;500;600&display=swap">')

CSS = """<style>
:root{
  --paper:#F1F3EF; --surface:#FCFDFB; --sunk:#E7EAE3;
  --ink:#191C18; --ink-2:#3D4438; --muted:#666D5E; --faint:#8A9180;
  --rule:#D6DACE; --rule-2:#C2C8B8;
  --accent:#166B4E; --accent-soft:#E0EDE6;
  --bad:#B23124; --bad-soft:#F7E4E1;
  --good:#1A7040; --good-soft:#E1EFE5;
  --key:#8A6200; --key-soft:#FAEEC6;
  --cool:#2B5C99; --cool-soft:#E2EAF4;
  --shadow:0 1px 2px rgba(25,28,24,.05),0 8px 24px -14px rgba(25,28,24,.22);
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --paper:#141711; --surface:#1C201A; --sunk:#232821;
  --ink:#E9ECE3; --ink-2:#C3C9B9; --muted:#98A08C; --faint:#79806E;
  --rule:#2E342A; --rule-2:#3C4436;
  --accent:#5CC79B; --accent-soft:#17301F;
  --bad:#E87A6B; --bad-soft:#331C18;
  --good:#5FC287; --good-soft:#16301F;
  --key:#E3B443; --key-soft:#332A10;
  --cool:#7FAEE6; --cool-soft:#182534;
  --shadow:0 1px 2px rgba(0,0,0,.3),0 8px 24px -14px rgba(0,0,0,.7);
}}
:root[data-theme="dark"]{
  --paper:#141711; --surface:#1C201A; --sunk:#232821;
  --ink:#E9ECE3; --ink-2:#C3C9B9; --muted:#98A08C; --faint:#79806E;
  --rule:#2E342A; --rule-2:#3C4436;
  --accent:#5CC79B; --accent-soft:#17301F;
  --bad:#E87A6B; --bad-soft:#331C18;
  --good:#5FC287; --good-soft:#16301F;
  --key:#E3B443; --key-soft:#332A10;
  --cool:#7FAEE6; --cool-soft:#182534;
  --shadow:0 1px 2px rgba(0,0,0,.3),0 8px 24px -14px rgba(0,0,0,.7);
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--paper);color:var(--ink);
  font-family:Newsreader,Georgia,"Times New Roman",serif;
  font-optical-sizing:auto;font-size:17px;line-height:1.62;
  -webkit-font-smoothing:antialiased;padding-bottom:6rem}
.mono{font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace;font-variant-numeric:tabular-nums}
.wrap{max-width:76rem;margin:0 auto;padding:0 clamp(1rem,4vw,2.5rem)}
h1,h2,h3,h4{font-family:Fraunces,Georgia,serif;font-variation-settings:"SOFT" 20,"WONK" 1;
  text-wrap:balance;line-height:1.1;letter-spacing:-.012em;font-weight:500}
.eyebrow{font-family:"IBM Plex Mono",monospace;font-size:.68rem;letter-spacing:.15em;
  text-transform:uppercase;color:var(--muted);font-weight:500}

nav{position:sticky;top:0;z-index:40;background:var(--paper);
  border-bottom:1px solid var(--rule)}
.navin{display:flex;gap:.15rem;align-items:center;overflow-x:auto;
  padding:.45rem clamp(1rem,4vw,2.5rem);max-width:76rem;margin:0 auto}
.navin a{flex:0 0 auto;text-decoration:none;color:var(--muted);
  font-family:"IBM Plex Mono",monospace;font-size:.72rem;padding:.3rem .5rem;
  border-radius:4px;white-space:nowrap}
.navin a:hover,.navin a:focus-visible{color:var(--ink);background:var(--sunk)}
.navin a b{color:var(--accent);font-weight:600}
.navin .brand{color:var(--ink);font-weight:600;margin-right:.6rem;
  border-right:1px solid var(--rule);padding-right:.8rem}

header.hero{padding:clamp(3rem,8vw,5.5rem) 0 2.5rem;border-bottom:2px solid var(--ink)}
h1{font-size:clamp(2.6rem,7.5vw,4.6rem);font-weight:600;margin:.7rem 0 0;
  font-variation-settings:"SOFT" 30,"WONK" 1;line-height:.98}
.sub{font-size:clamp(1.05rem,2vw,1.22rem);color:var(--ink-2);margin-top:1.4rem;max-width:44rem}
.strip{display:flex;flex-wrap:wrap;gap:0;margin-top:2.4rem;border-top:1px solid var(--rule)}
.stat{flex:1 1 8.5rem;padding:.85rem 1rem .85rem 0;border-bottom:1px solid var(--rule)}
.stat dt{font-family:"IBM Plex Mono",monospace;font-size:.63rem;letter-spacing:.13em;
  text-transform:uppercase;color:var(--faint)}
.stat dd{font-family:Fraunces,serif;font-size:1.6rem;font-weight:500;margin-top:.15rem;
  font-variant-numeric:tabular-nums}
.stat dd small{font-size:.8rem;color:var(--muted);font-family:"IBM Plex Mono",monospace;
  margin-left:.15rem}

section{padding:clamp(3rem,6vw,4.5rem) 0 0}
.shead{border-bottom:1px solid var(--rule-2);padding-bottom:.7rem;margin-bottom:2rem;
  display:flex;align-items:baseline;gap:1rem;flex-wrap:wrap}
.shead h2{font-size:clamp(1.5rem,3.2vw,2rem)}

.card{background:var(--surface);border:1px solid var(--rule);box-shadow:var(--shadow)}
.releve{padding:clamp(1.4rem,3vw,2.2rem);position:relative;overflow:hidden}
.releve::before{content:"";position:absolute;top:0;bottom:0;left:0;width:3px;background:var(--accent)}
.releve p{max-width:42rem}
.quote{font-size:clamp(1.1rem,2.2vw,1.32rem);line-height:1.5}
.fix{margin-top:1.6rem;padding-top:1.2rem;border-top:1px dashed var(--rule-2);
  font-size:.95rem;color:var(--ink-2)}
.fix p+p{margin-top:.9rem}
.fix b{color:var(--bad);font-weight:600}

.chap{margin-top:clamp(2.5rem,5vw,4rem);scroll-margin-top:4rem}
.chead{display:grid;grid-template-columns:auto 1fr;gap:0 clamp(1rem,3vw,1.8rem);
  align-items:start;border-top:2px solid var(--ink);padding-top:1.1rem}
.cnum{font-family:Fraunces,serif;font-size:clamp(2.6rem,7vw,4.2rem);font-weight:400;
  line-height:.82;color:var(--accent);font-variant-numeric:tabular-nums}
.chead h3{font-size:clamp(1.45rem,3.4vw,2.05rem)}
.cmeta{grid-column:2;display:flex;flex-wrap:wrap;gap:.35rem .9rem;margin-top:.55rem;
  font-family:"IBM Plex Mono",monospace;font-size:.72rem;color:var(--muted)}
.cmeta b{color:var(--ink);font-weight:500}

.beats{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));gap:1px;
  background:var(--rule);border:1px solid var(--rule);margin:1.6rem 0 2rem}
.beat{background:var(--surface);padding:1rem 1.1rem}
.beat .eyebrow{display:block;margin-bottom:.4rem}
.beat p{font-size:.95rem;line-height:1.5}
.beat.turn{background:var(--bad-soft)}
.beat.turn .eyebrow{color:var(--bad)}
.beat.meca .eyebrow{color:var(--accent)}

.ledger{border-top:1px solid var(--rule-2)}
.row{display:grid;grid-template-columns:5.4rem 1fr minmax(0,17rem);
  gap:0 clamp(.8rem,2vw,1.6rem);padding:1rem 0;border-bottom:1px solid var(--rule)}
.row.is-turn{background:linear-gradient(90deg,var(--bad-soft),transparent 62%);
  box-shadow:inset 3px 0 0 var(--bad);padding-left:.9rem}
.rail{font-family:"IBM Plex Mono",monospace;font-size:.74rem;color:var(--muted);padding-top:.2rem}
.rail .tc{color:var(--ink);font-weight:500;display:block;font-size:.82rem}
.rail .du{display:block;color:var(--faint)}
.chip{display:inline-block;margin-top:.4rem;font-family:"IBM Plex Mono",monospace;
  font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;padding:.12rem .35rem;
  border:1px solid currentColor;font-weight:500}
.c-camera{color:var(--bad)}
.c-animation{color:var(--accent)}
.c-broll{color:var(--cool)}
.c-article{color:var(--key)}
.narr{font-size:1.16rem;line-height:1.5;color:var(--ink)}
.narr.mute{color:var(--faint);font-style:italic;font-size:1rem}
.turnflag{display:inline-block;font-family:"IBM Plex Mono",monospace;font-size:.6rem;
  letter-spacing:.12em;color:var(--bad);border:1px solid var(--bad);padding:.1rem .3rem;
  margin-bottom:.45rem}
.ann{font-size:.83rem;line-height:1.5;color:var(--muted);display:grid;gap:.5rem;align-content:start}
.ann .kv{display:grid;grid-template-columns:2.9rem 1fr;gap:.5rem}
.ann k{font-family:"IBM Plex Mono",monospace;font-size:.58rem;letter-spacing:.06em;
  text-transform:uppercase;color:var(--faint);padding-top:.22rem}
.hl{font-weight:600;padding:0 .16em}
.hl-key{background:var(--key-soft);color:var(--key)}
.hl-bad{background:var(--bad-soft);color:var(--bad)}
.hl-good{background:var(--good-soft);color:var(--good)}
.hl-cool{background:var(--cool-soft);color:var(--cool)}
.scr{font-family:"IBM Plex Mono",monospace;font-size:.73rem;color:var(--ink-2);line-height:1.5}

.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr));gap:1px;
  background:var(--rule);border:1px solid var(--rule)}
.cell{background:var(--surface);padding:1rem 1.1rem}
.cell h4{font-size:1rem;font-weight:600;margin-bottom:.3rem}
.cell p{font-size:.88rem;color:var(--ink-2);line-height:1.5}
.cell p+p{margin-top:.45rem}
.tag{font-family:"IBM Plex Mono",monospace;font-size:.6rem;letter-spacing:.07em;
  text-transform:uppercase;color:var(--faint);display:block;margin-bottom:.35rem}
.risk{border-left:3px solid var(--bad);background:var(--surface);padding:.9rem 1.1rem;
  margin-bottom:.6rem;font-size:.92rem;line-height:1.55;color:var(--ink-2)}
.risk b{color:var(--bad);font-family:"IBM Plex Mono",monospace;font-size:.7rem;
  letter-spacing:.08em;display:block;margin-bottom:.3rem;text-transform:uppercase}
.tbl{width:100%;border-collapse:collapse;font-size:.86rem}
.tbl th{text-align:left;font-family:"IBM Plex Mono",monospace;font-size:.62rem;
  letter-spacing:.1em;text-transform:uppercase;color:var(--faint);font-weight:500;
  padding:.5rem .8rem .5rem 0;border-bottom:1px solid var(--rule-2);white-space:nowrap}
.tbl td{padding:.6rem .8rem .6rem 0;border-bottom:1px solid var(--rule);
  vertical-align:top;color:var(--ink-2)}
.tbl td:first-child{color:var(--ink)}
.scroller{overflow-x:auto}
.pill{display:inline-block;font-family:"IBM Plex Mono",monospace;font-size:.6rem;
  padding:.1rem .35rem;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap}
.p-solide{background:var(--good-soft);color:var(--good)}
.p-moderee{background:var(--cool-soft);color:var(--cool)}
.p-faible{background:var(--key-soft);color:var(--key)}
.p-contestee{background:var(--key-soft);color:var(--key)}
.p-retractee{background:var(--bad-soft);color:var(--bad)}
pre.desc{background:var(--surface);border:1px solid var(--rule);padding:1.2rem;
  font-family:"IBM Plex Mono",monospace;font-size:.78rem;line-height:1.65;
  white-space:pre-wrap;overflow-x:auto;color:var(--ink-2)}
a{color:var(--accent)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (max-width:820px){
  .row{grid-template-columns:4.2rem 1fr}
  .ann{grid-column:1/-1;padding-top:.7rem;margin-top:.3rem;border-top:1px dotted var(--rule-2)}
  .chead{grid-template-columns:1fr}
  .cmeta{grid-column:1}
}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>"""
w(CSS)

# ---------------- NAV ----------------
w('<nav><div class="navin"><a class="brand" href="#top">Ce n&rsquo;est pas ta volonté</a>')
for _v in videos:
    w('<a href="#v%d" style="color:var(--accent);font-weight:600">VIDÉO %d</a>' % (_v["n"], _v["n"]))
    for _n in _v["chapitres"]:
        _c = next(c for c in chs if c["n"] == _n)
        w('<a href="#ch%d"><b>%d</b> %s</a>' % (_n, _n, e(_c["titre"])))
w('<a href="#prod">Production</a><a href="#shorts">Formats courts</a>'
  '<a href="#garde">Garde-fous</a><a href="#src">Sources</a><a href="#yt">YouTube</a>'
  '</div></nav>')

# ---------------- HERO ----------------
tot = sum(c["duree_s"] for c in chs)
mots = sum(nw(p["narration"]) for c in chs for p in c["plans"])
nplans = sum(len(c["plans"]) for c in chs)
cam = sum(p["duree_s"] for c in chs for p in c["plans"] if p["source"] == "camera")

w('<div id="top"></div><header class="hero"><div class="wrap">')
w('<div class="eyebrow">Scénario de tournage &middot; long format &middot; français</div>')
w("<h1>Ce n'est pas<br>ta volonté</h1>")
w('<p class="sub">Sept chapitres, chacun bâti comme un reel complet : accroche, mécanisme nommé, '
  'preuve chiffrée, retournement, chute. Le sujet était trop gros pour un seul film : il est '
  'coupé en deux vidéos autonomes de neuf minutes. Chaque chiffre prononcé existe dans une '
  'source citée, et chaque source a été vérifiée &mdash; y compris pour savoir si elle a été '
  'rétractée.</p>')
w('<dl class="strip">')
for lab, val, unit in [("Vidéos", str(len(videos)), ""),
                       ("Vidéo 1", mmss(videos[0]["duree_s"]), ""),
                       ("Vidéo 2", mmss(videos[1]["duree_s"]), ""),
                       ("Plans", str(nplans), ""),
                       ("Débit", str(round(mots / (tot / 60))), "mots/min"),
                       ("Sources", str(len(sources)), "PMID")]:
    u = ' <small>%s</small>' % unit if unit else ""
    w('<div class="stat"><dt>%s</dt><dd>%s%s</dd></div>' % (lab, val, u))
w('</dl></div></header>')

# ---------------- THESE ----------------
w('<section><div class="wrap">')
w('<div class="shead"><h2>La thèse</h2><span class="eyebrow">ce que la vidéo défend</span></div>')
w('<div class="card releve"><p class="quote">%s</p>' % e(arch["these"]))
meta_txt = arch["metaphore_argent"]
# La formulation de reference vit entre les guillemets francais du premier paragraphe.
_a = meta_txt.find("\u00ab")
_b = meta_txt.rfind("\u00bb", 0, meta_txt.find("LA CORRESPONDANCE"))
formule = meta_txt[_a + 1:_b].strip() if _a >= 0 and _b > _a else ""

w('<div class="fix"><span class="eyebrow" style="display:block;margin-bottom:.6rem">'
  'Le fil rouge &mdash; la baignoire qui fuit</span>')
w('<p style="font-size:1.08rem;color:var(--ink)">%s</p>' % e(formule))

w('<div class="scroller" style="margin-top:1.3rem;max-width:34rem">'
  '<table class="tbl"><thead><tr><th>Dans ta vie</th><th>Dans la baignoire</th>'
  '</tr></thead><tbody>')
for gauche, droite in [
        ("ton poids", "le niveau"),
        ("quel aliment tu manges", "quel robinet tu ouvres"),
        ("combien tu en manges", "combien &ccedil;a coule"),
        ("ce que ton corps d&eacute;pense", "la fuite, en permanence")]:
    w('<tr><td>%s</td><td>%s</td></tr>' % (gauche, droite))
w('</tbody></table></div>')

w('<p style="margin-top:1.3rem"><b>Deux versions ont &eacute;t&eacute; rejet&eacute;es avant '
  'celle-ci.</b> Les comptes bancaires d&rsquo;abord : compte courant, &eacute;pargne, guichet, '
  'd&eacute;couvert &mdash; trois concepts &agrave; installer avant d&rsquo;arriver au propos. '
  'Puis &laquo;&nbsp;tu ne fais pas baisser le niveau en changeant la couleur de l&rsquo;eau&nbsp;&raquo; : '
  'la couleur ne correspond &agrave; rien de v&eacute;cu, il faudrait expliquer que couleur '
  '&eacute;gale aliment, et une image qu&rsquo;on doit traduire ne sert &agrave; rien. '
  'C&rsquo;est le <em>robinet</em> qui change. Le mot &laquo;&nbsp;bonde&nbsp;&raquo; tombe pour '
  'la m&ecirc;me raison : personne ne le conna&icirc;t, donc la baignoire <em>fuit</em>.</p>')

w('<p>Une fuite est involontaire et continue, exactement comme le m&eacute;tabolisme de base : '
  'rien &agrave; ouvrir, &ccedil;a ne s&rsquo;arr&ecirc;te jamais. &Agrave; l&rsquo;&eacute;cran le '
  'jet est trois fois plus &eacute;pais que le filet, donc l&rsquo;asym&eacute;trie se voit sans '
  'qu&rsquo;on l&rsquo;explique &mdash; &ccedil;a monte vite, &ccedil;a descend lentement, et '
  'c&rsquo;est vrai. Surtout, les robinets portent aussi le chapitre&nbsp;2 : tous n&rsquo;ont pas '
  'le m&ecirc;me d&eacute;bit. L&rsquo;huile est un robinet minuscule qui coule &agrave; flots ; '
  'le dessert, un gros robinet qui coule moins vite qu&rsquo;il en a l&rsquo;air.</p>')

w('<p style="color:var(--muted);font-size:.88rem">La baignoire est une figure &eacute;ditoriale, '
  'pas un fait sourc&eacute;. Aucun chiffre &agrave; l&rsquo;&eacute;cran dessus &mdash; ni litres, '
  'ni capacit&eacute;, ni d&eacute;bit chiffr&eacute;. Elle revient une seule fois, au '
  'retournement du chapitre&nbsp;7, et nulle part ailleurs.</p>')
w("</div></div></div></section>")

# ---------------- CHAPITRES ----------------
w('<section><div class="wrap">')
w('<div class="shead"><h2>Le scénario</h2>'
  '<span class="eyebrow">deux vidéos &middot; narration verbatim &middot; plan par plan</span></div>')

_depart = {}
for _v in videos:
    _t = 0.0
    for _n in _v["chapitres"]:
        _depart[_n] = _t
        _t += next(c for c in chs if c["n"] == _n)["duree_s"]

for _v in videos:
    w('<div id="v%d" style="scroll-margin-top:4rem;margin:clamp(2.5rem,5vw,4rem) 0 0;'
      'padding:1.4rem 0 0;border-top:3px solid var(--accent)">' % _v["n"])
    w('<div class="eyebrow" style="color:var(--accent)">Vidéo %d &middot; %s</div>' % (_v["n"], mmss(_v["duree_s"])))
    w('<h2 style="font-size:clamp(1.8rem,4vw,2.6rem);margin:.35rem 0 .5rem">%s</h2>' % e(_v["titre"]))
    w('<p style="max-width:42rem;color:var(--ink-2)">%s</p></div>' % e(_v["sujet"]))

    for _n in _v["chapitres"]:
        c = next(x for x in chs if x["n"] == _n)
        ac = next((a for a in arch["chapitres"] if a["n"] == _n), None)
        dur = c["duree_s"]
        m = sum(nw(p["narration"]) for p in c["plans"])
        ccam = sum(p["duree_s"] for p in c["plans"] if p["source"] == "camera")
        tshot = turn_shot(c, ac)
        w('<article class="chap" id="ch%d">' % _n)
        w('<div class="chead"><div class="cnum">%02d</div><div><h3>%s</h3></div>' % (_n, e(c["titre"])))
        w('<div class="cmeta"><span>départ <b>%s</b></span><span>durée <b>%.0f&nbsp;s</b></span>'
          '<span>mots <b>%d</b></span><span>débit <b>%d</b>&nbsp;mots/min</span>'
          '<span>caméra <b>%d&nbsp;%%</b></span><span>plans <b>%d</b></span></div></div>'
          % (mmss(_depart[_n]), dur, m, round(m / (dur / 60)), round(100 * ccam / dur), len(c["plans"])))
        if ac:
            w('<div class="beats">')
            w('<div class="beat meca"><span class="eyebrow">Mécanisme</span><p>%s</p></div>' % e(ac["mecanisme"]))
            w('<div class="beat turn"><span class="eyebrow">Le retournement</span><p>%s</p></div>' % e(ac["turn"]))
            w('<div class="beat"><span class="eyebrow">Chute</span><p>%s</p></div>' % e(ac["landing"]))
            w("</div>")
        w('<div class="ledger">')
        for p in c["plans"]:
            isturn = (p["t"] == tshot)
            w('<div class="row%s">' % (" is-turn" if isturn else ""))
            w('<div class="rail"><span class="tc">%s</span><span class="du">%.1f&nbsp;s</span>'
              '<span class="chip c-%s">%s</span></div>'
              % (e(p["t"]), p["duree_s"], e(p["source"]), SRC_LABEL.get(p["source"], p["source"])))
            w("<div>")
            if isturn:
                w('<span class="turnflag">TURN</span>')
            if (p.get("narration") or "").strip():
                w('<p class="narr">%s</p>' % e(p["narration"]))
            else:
                w('<p class="narr mute">&mdash; plan muet &mdash;</p>')
            if p.get("texte_ecran"):
                w('<p class="scr" style="margin-top:.5rem">%s</p>' % screen(p["texte_ecran"]))
            w("</div>")
            w('<div class="ann">')
            if p.get("visuel"):
                w('<div class="kv"><k>Visuel</k><span>%s</span></div>' % e(p["visuel"]))
            if p.get("sfx"):
                w('<div class="kv"><k>Son</k><span>%s</span></div>' % e(p["sfx"]))
            w("</div></div>")
        w("</div></article>")
w("</div></section>")

io.open(OUT, "w", encoding="utf-8").write("\n".join(P))
print("partie 1 :", os.path.getsize(OUT) // 1024, "Ko")
