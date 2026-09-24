---
name: inserts-youbud
description: Fabriquer les inserts animés HyperFrames d'un reel science-based dans la direction artistique YouBud — palette, cartes teintées sans bordure à rebord, pastilles de verdict qui se dessinent, têtes en emoji, la règle du texte (des mots, jamais des phrases : chiffres, icônes, noms propres, un mot par élément) parce qu'Instagram ne traduit pas le texte incrusté, le vocabulaire d'animation GSAP et la grammaire sonore intégrée au rendu. Extrait des quatre inserts de la vidéo créatine, rendus le 22 septembre 2026. À charger dès qu'on écrit, retouche ou juge une composition d'insert pour une vidéo de Mohamed.
---

# Les inserts YouBud

**Portée.** Un insert = une composition HyperFrames de 5 à 20 s, plein cadre 1080×1920, posée
dans CapCut sous la voix de Mohamed. Ce skill fixe **à quoi ça ressemble, comment ça bouge et
comment ça sonne**. Le script vient de `science-reel`, la timeline du montage de
`montage-capcut`, la mécanique HyperFrames de `hyperframes-core`. La référence vivante :
`video/creatine-gummies/compositions/` et son `PROMPTS-DETAILLES.md`.

**Trois règles avant tout le reste.**

1. **Aucune bordure, jamais.** Une carte est une teinte claire avec un rebord plein en ombre
   dessous. Un trait noir autour d'une carte, c'est l'ancien kit, c'est refusé.
2. **Des mots, jamais des phrases.** Instagram traduit les sous-titres, pas le texte incrusté
   dans une animation, et le marché visé reste le français. Un insert porte des chiffres, des
   symboles, des icônes, des noms propres et **un mot par élément** quand il donne le sens
   (Déclaration, Vente, Contrôle, Force, Facile). Une phrase ou un carton de plusieurs mots,
   c'est la voix et les sous-titres qui les portent.
3. **Le son est écrit dans la composition, réglé dans CapCut.** Chaque élément qui se pose a
   son clic, chaque coche sa réussite, chaque croix son erreur, en `<audio>` dans le fichier.
   Le MP4 est rendu avec, pour la relecture ; dans CapCut il est posé à volume 0 et chaque son
   est reposé à part, pour que Mohamed règle les volumes (voir `montage-capcut`, dernier §).

---

## 1. La direction artistique

C'est celle de l'appli de Mohamed, YouBud (« Ubod » sur les stores) : vert vif, orange, jaune,
cartes blanches très arrondies, rebord plein sous les boutons, mascotte renard. Les tokens sont
dans **`video/<dossier>/compositions/components/youbud.css`**, chargé **après** `kit.css`. On
copie ce fichier tel quel d'une vidéo à l'autre, on ne le réécrit pas.

| Token | Valeur | Teinte claire `-2` | Rebord `-edge` | Sert à |
|---|---|---|---|---|
| `--yb-green` | `#58cc02` | `#e6f7d5` | `#46a302` | ce qui marche, la coche, le compteur des reçus |
| `--yb-orange` | `#ff9600` | `#ffefd6` | `#e07f00` | le bonbon, le sachet, la force |
| `--yb-yellow` | `#ffc800` | `#fff5cc` | `#e0ae00` | le terme clé, le compteur d'ensemble, le calendrier |
| `--yb-blue` | `#1cb0f6` | `#dcf2fd` | `#1899d6` | l'eau, le labo, le médicament |
| `--yb-red` | `#ff4b4b` | `#ffe2e2` | `#e03a3a` | le mythe, la croix, ce qui manque |
| `--yb-purple` | `#ce82ff` | `#f3e5ff` | `#b36be0` | le cerveau, une troisième catégorie |
| `--ink` | `#3c3c3c` | | | tout le texte, les icônes neutres |
| `--bg` | `#f7f7f4` | | | le fond, plein, jamais transparent |

Sémantique : `--good` = vert, `--bad` = rouge, `--key` = jaune. **Un seul mot ou chiffre
coloré par carton.** Encre sur vert et jaune, blanc sur rouge.

Police : Archivo 900 (locale, `assets/fonts/Archivo.woff2`, déclarée dans le `<style>` de chaque
composition, jamais dans la feuille partagée). Chiffres en `tabular-nums`.

### Les composants, tous dans `youbud.css`

| Classe | C'est quoi | Détail qui compte |
|---|---|---|
| `.yb-card` | la carte teintée | `background: var(--tint)`, `border-radius: 36px`, `box-shadow: 0 10px 0 var(--edge)`. Aucun `border`. |
| `.yb-badge` / `.yb-badge.ko` | la pastille de verdict, 88 à 110 px | ronde, verte ou rouge, rebord 6 px, trait blanc 12 px qui **se dessine** |
| `.yb-emoji` | une tête ou un logo en rond | `border: 10px solid #fff`, rebord, image détourée dedans |
| `.yb-pill` | une pilule | fond couleur vive + rebord, pour un chiffre, un `?`, un `≈ 0` |
| `svg.lucide` | les icônes | Lucide uniquement, colorées dans la teinte vive de leur carte |

Une tête de personne : capture du MP4 source, `npx hyperframes@0.8.21 remove-background` (ne
détoure **que les humains**, un objet revient vide), puis `.yb-emoji` 220 px avec l'image
sur-dimensionnée et décalée pour cadrer le visage. Un objet, un pot, un sachet : **dessiné à
plat** en divs et SVG, jamais photographié.

---

## 2. La règle du texte

Instagram et TikTok traduisent les sous-titres et la légende, jamais un texte incrusté dans
l'insert. Le marché visé est le français : on accepte qu'un mot incrusté reste en français,
on refuse qu'une phrase entière échappe à la traduction. Décision de Mohamed, 22 septembre 2026.

| Autorisé | Interdit |
|---|---|
| chiffres et unités : `23`, `8`, `5 g`, `0`, `30 €`, `× 30`, `5 g / jour` | une phrase : « Le plus dur : tous les jours », « Autorisation avant vente » |
| symboles : `?`, `≈`, `=`, `×`, une coche, une croix | un carton de plusieurs mots : « Aucun test avant », « Il y en a vraiment dedans ? » |
| noms propres : `James Smith`, `NOW` (le mot sous le logo), les marques testées | un texte en anglais « pour faire universel » |
| **un mot par élément**, qui porte le sens : `Force`, `Cerveau`, `Récup`, `Jour 7`, `Facile`, `Déclaration`, `Contrôle`, `Vente`, `Médicament`, `Complément`, `Labo`, `Promesse`, `Étiquette`, `Créatine` | un mot qui ne dit rien sans la phrase autour |
| un mot + un chiffre : `Dedans ?`, `Presque 0`, `Dedans : 0`, `0 contrôle avant` | |
| une icône Lucide **avec** son mot quand la chose a un nom : `flask-conical` + Contrôle, `shopping-cart` + Vente | une icône seule quand elle est ambiguë |

Comment ramener une phrase à un mot : « Testé par » → la fiole au-dessus du logo et **NOW** en
pilule dessous ; « tous les jours » → `calendar-days` + `× 30` ; « Ce qui est écrit » →
`tag` + Étiquette ; « Ce qu'il y a » → `search` + Dedans ; « Autorisation avant vente » et
« Déclaration, pas de test » → une frise de trois ronds Déclaration → Contrôle → Vente, la
case Contrôle cochée ou vide ; « Presque zéro » → Presque + `0` ; « Aucun test avant » → une
fiole barrée + `0 contrôle avant`. Une frise sans ses mots ne se comprend pas : les mots
restent.

Un chiffre à l'écran doit être **dit dans la voix**. Pas de pourcentage, pas d'unité de labo.

---

## 3. Le vocabulaire d'animation

Une seule `gsap.timeline({ paused: true })` par composition, enregistrée sur
`window.__timelines["<id>"]`. Tout en `fromTo` avec l'état de départ explicite. Chaque élément
entre **sur sa syllabe**, jamais avant. 0,3 s de tenue à la fin, rien ne bouge après.

| Geste | Recette | Où |
|---|---|---|
| **Entrée d'une carte** | `scale 0→1, y 40→0, 0.55 s, power3.out`, stagger 0.12 à 0.18 | toute carte, toute colonne |
| **Entrée d'un verdict, d'un emoji, d'un chiffre** | `scale 0.3→1, 0.35 à 0.55 s, back.out(1.4 à 1.8)` | le seul rebond autorisé à l'entrée |
| **La coche ou la croix se dessine** | `stroke-dasharray = getTotalLength() × 1.05`, `strokeDashoffset → 0, 0.3 s, power2.out`, 0.1 s après la pastille | chaque `.yb-badge` |
| **La carte encaisse** | `x -9 / +9, 0.05 s × 4, ease none`, puis retour à 0 | sur chaque croix |
| **L'icône vit** | rotation ±14° ou scale 1→1.14, `repeat 3 à 5, yoyo`, puis un `to` de retour à 0 | l'haltère bascule, le cœur bat, la gélule salue, le `?` vacille |
| **Le calendrier se retourne** | `rotationY -90→0, transformPerspective 900, 0.5 s, power3.out` | cartes jour |
| **Ça tombe et s'écrase** | `y -420→0, 0.32 s, power2.in` · `scaleY 0.78 / scaleX 1.16, 0.09 s` · retour en `elastic.out(1, 0.45)` | le bonbon |
| **Confettis** | pool de 16 divs, valeurs dérivées de l'index (`prand`), un seul driver `T 0→1, ease none`, position = formule balistique, gravité 1300, 1 s | derrière une coche finale, une fois par insert au plus |
| **Une jauge** | `.fill` en `scaleX 0→v, 0.45 s, power3.out`, origine à gauche ; la ligne de référence **au bout exact** de la piste, jamais dépassée ; un bout rouge visible même pour presque rien (7 % minimum) | classement, cohorte |
| **Un compteur** | objet `{v}` tweené, `onUpdate` écrit `Math.round`, pilule qui pulse `1→1.12` à l'arrivée | 23, 8 |
| **Une ligne de référence** | `scaleY 0→1` depuis le haut, `power2.out` | la promesse |
| **Un curseur qui saute** | `x` en `power2.inOut 0.6 s` + `y 0→-90→0` en deux tweens | frise |
| **Sortie de scène** | `opacity 0, y -30, 0.25 s, power2.in`, la scène suivante entre 0.2 à 0.3 s après | entre chaque tableau |

Ce qui est refusé : un `back.out` sur une carte ou un texte, un `repeat: -1`, un `width` ou
`height` tweené, une transition CSS, un `Math.random`, un élément qui bouge après la tenue.

---

## 4. Le son, dans la composition

Bibliothèque : `D:\editing_audio\` copiée dans `assets/sfx/` du dossier vidéo. Un
`<audio id src data-start data-duration data-track-index data-volume>` par bruitage,
**une piste par son** et des index uniques d'une composition à l'autre (I1 = 11 à 39,
I2 = 41 à 79, I3 = 81 à 99, I4 = 101 et plus), parce que `index.html` les héberge toutes.

| Événement | Fichier | Volume | Extrait |
|---|---|---|---|
| un élément se pose | `soft_click.wav` | 1.0 | 0.22 s |
| un accent, un logo, une frise | `clicks.wav` | 0.95 | 0.35 s |
| une coche isolée | `correct.wav` | 0.24 puis **en montant** : 0.30, 0.36 … jusqu'à 0.7 sur la dernière | 0.5 s |
| une liste qui se valide (cohorte, jauges) | `bloop.mp3` en bulles, 0.22 → 0.40 en montant à peine, puis **une seule** `correct` 0.66 sur le dernier | 0.5 s |
| une croix | `wrong.mp3` | 0.35 puis 0.45, 0.55, 0.7 | 0.5 s |
| une chute, un versement | `bloop.mp3` | 0.5 à 0.8 | 0.63 s |
| un changement de tableau | `air-woosh.wav` | **0.09**, à peine audible | 1.0 s, 0.25 s avant la coupe |
| une ligne qui se pose, un carton | `impacts.mp3` | 0.43 | `data-media-start="0.2"`, 1.3 s |
| un compteur qui monte | `rizer-windy.mp3` | 0.24 | `data-media-start="1.3"`, 1.55 s, l'impact tombe à la fin |
| une liste qui se remplit | `soft_click.wav` en rafale | 1.0 | un clic toutes les 0.2 s, six au plus |

Les volumes viennent du montage mesuré dans `montage-capcut` : ils ne se discutent pas, ils se
recopient. La liste `<audio>` de la composition est **la source de vérité** : au montage, elle
s'exporte en `sons-des-inserts.json` (temps timeline, piste sans chevauchement, volume) et chaque
son se pose dans CapCut, l'insert lui-même à volume 0. Ne jamais poser un son deux fois.
**Jamais huit réussites d'affilée** : la cohorte de la créatine a été rejetée pour ça, les
listes prennent des bulles et une seule réussite finale.

**Recaler avant de rendre.** Les cues d'une composition viennent du brief ; la prise réelle est
presque toujours plus rapide. Avant les rendus finaux : transcrire la prise mot à mot
(faster-whisper `medium`, `language='fr'`, `word_timestamps=True`, CPU int8), relever le temps de
chaque syllabe repère relative au premier mot de l'insert, et déplacer chaque cue dessus. La
durée de l'insert devient : dernier mot + 0,3 s de tenue, ou le mot sur lequel la tête revient.

---

## 5. La structure d'un insert

```
video/<dossier>/
  compositions/components/kit.css        le kit science-reel (commun)
  compositions/components/youbud.css     la DA, copiée telle quelle
  compositions/I1-<nom>.html … I4-<nom>.html
  assets/fonts/Archivo.woff2 · assets/vendor/lucide.min.js · assets/sfx/ · assets/img/
  index.html                             les inserts bout à bout, relecture seulement
  renders/                               un MP4 par insert, -q high
  PROMPTS-DETAILLES.md                   tout ce qui est rendu, cote par cote
```

Squelette d'une composition :

```html
<link rel="stylesheet" href="compositions/components/kit.css">
<link rel="stylesheet" href="compositions/components/youbud.css">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script src="assets/vendor/lucide.min.js"></script>
<style>@font-face { font-family: "Archivo"; src: url("assets/fonts/Archivo.woff2") format("woff2"); font-weight: 400 900; font-display: block; }</style>
…
<div id="i1-root" data-composition-id="creatine-i1-poudre" data-start="0" data-duration="14.3" data-width="1080" data-height="1920">
  <div id="i1-scene" class="clip" data-start="0" data-duration="14.3" data-track-index="0"><div class="stage">…</div></div>
  <audio id="i1-s-01" src="assets/sfx/soft_click.wav" data-start="0" data-duration="0.22" data-track-index="11" data-volume="1"></audio>
</div>
<script>(function(){ window.__timelines = window.__timelines || {}; if (window.lucide) window.lucide.createIcons(); /* mesurer les path.draw */ var tl = gsap.timeline({ paused: true }); … window.__timelines["creatine-i1-poudre"] = tl; })();</script>
```

Zone sûre : rien d'important dans les 12 % du haut ni les 20 % du bas. Tout en px absolus sur
1080×1920, pas d'unités relatives.

### Les pièges rencontrés

- **Lucide remplace `<i data-lucide>` par un `<svg class="lucide">`.** Une règle CSS sur `i` ne
  s'applique plus après. Dimensionner un conteneur (`div`, `span`) ou cibler `svg.lucide`.
- **Une `url()` dans `youbud.css` ou `kit.css` se résout depuis la feuille**, pas depuis le
  document : la police se déclare dans chaque composition.
- **`check` sonde le contraste pendant un fondu** : un avertissement à 1.3:1 sur un texte qui
  entre en `opacity` est un faux positif. Un vrai défaut se corrige avec la couleur proposée.
- **`remove-background` ne détoure que les humains.** Un objet se dessine.
- **Le rendu haute qualité a 20 s de retard sur les brouillons** : après une retouche, refaire
  les `-q high`, la date des fichiers fait foi.

---

## 6. Vérifier avant de livrer

```bash
npx --yes hyperframes@0.8.21 check
npx --yes hyperframes@0.8.21 render -c compositions/I2-<nom>.html -o renders/I2-<nom>-draft.mp4 -q draft
```

Puis une planche-contact avec ffmpeg aux temps qui comptent (entrée de chaque tableau, chaque
verdict, la tenue finale), regardée en vrai : un chevauchement de texte, une icône démesurée,
une jauge qui dépasse sa ligne ne se voient que là. `ffprobe` doit lister un flux `audio` sur
chaque MP4. Ensuite seulement les `-q high`, et le `PROMPTS-DETAILLES.md` mis à jour cote par
cote : il doit toujours décrire **ce qui est rendu**, pas ce qu'on voulait.

Ce qui fait rejeter un insert : une bordure, une phrase à l'écran, deux couleurs sur un carton,
un chiffre absent de la voix, un élément qui entre avant sa syllabe, un rendu muet, un logo ou
une marque là où le brief les interdit.
