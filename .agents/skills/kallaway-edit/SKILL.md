---
name: kallaway-edit
description: Monter une vidéo courte face caméra de Mohamed façon Kallaway, entièrement dans HyperFrames, de la prise brute à la vidéo livrée — coupes à chaque souffle, recalage des lèvres prise par prise, alternance A (lui en grand, zooms, mots incrustés) / B (animation en haut, lui détouré devant une carte arrondie dont sa tête dépasse), glissés gauche/droite, grammaire sonore (woosh calé sur son pic et seulement vers une animation, riser + « hoop », musique en deux morceaux), sous-titres mot à mot, accélération ×1,08. L'outil est outils/kallaway-edit (ke.py + une fiche kallaway.toml par vidéo) ; l'exemple réel, validé le 26 septembre 2026, est l'assiette. À charger dès que Mohamed demande de monter, remonter, corriger ou rendre une vidéo « comme Kallaway », « comme l'assiette » ou dans HyperFrames.
---

# Le Kallaway edit

**Ce que c'est.** Le montage que Mohamed a validé le 26 septembre 2026 sur la version courte de
l'assiette (« le montage est très bien, la coupure est très bien, les transitions sont super, les
zooms sont assez cool »), et qu'il veut refaire « souvent, pour les prochaines ». Une vidéo de 30 à
50 s, lui face caméra du début à la fin, montée sans CapCut : tout est une composition HyperFrames
générée depuis une fiche, `kallaway.toml`, par l'outil `outils/kallaway-edit/ke.py`.

**Ce qui vient avant, ce qui vient à côté.**
- Le script : skill `science-reel` (crible Kallaway, hooks de `methode/Les hooks (Kallaway).md`).
- Les animations du cadre B : skill `inserts-youbud` (une composition 1080 × 960 par plan B).
- La mécanique HyperFrames : skills `hyperframes-core` et `hyperframes-cli`.
- L'ancien montage dans CapCut : skill `montage-capcut`. Ses volumes et sa musique en deux morceaux
  ont été repris ici ; le reste ne s'applique pas.

**La référence vivante.** `video/assiette-pas-le-dessert/` : sa fiche `kallaway.toml` (identique à
`outils/kallaway-edit/gabarit.toml`, commentée ligne par ligne), ses données de montage dans
`montage/`, ses six animations dans `compositions/`, la vidéo livrée dans
`renders/assiette-version-courte.mp4`. Relancer l'outil sur ce dossier refait exactement le montage
livré : c'est vérifié (mêmes 27 coupes, mêmes 12 plans, mêmes 23 sons, mêmes 43 mouvements, mêmes
73 groupes de sous-titres).

---

## 1. La grammaire du montage

| | Ce qu'on voit | Quand |
|---|---|---|
| **A · lui en grand** | plein cadre, centré sur sa bouche prise par prise ; **un zoom par plan** (lent 1 → 1,06, ou punch-in 1,15, ou lent puis punch-in sur un mot) ; des **mots incrustés** en pilule au-dessus de sa tête (y = 250), en pop sur le mot, avec un clic | le hook, les phrases qui piquent, la relance, la chute, l'appel |
| **B · partagé** | en haut (1080 × 960), l'animation du plan sur la toile claire ; en bas, **la carte façon Kallaway** : une carte arrondie (aucune bordure, rebord plein) qui montre le **fond** d'une bande cadrée large, et **lui détouré par-dessus**, posé exactement sur la bande : sa tête et le haut de son front sortent de la carte par le haut, ses mains par les côtés | toute explication : un chiffre, un mécanisme, une étude |

- **Les coupes.** Vers une animation : glissé **vers la gauche** (A part à gauche, B arrive de la
  droite). Retour vers lui : glissé **vers la droite**. 0,28 s, `power2.inOut`. Entre deux plans B,
  seule l'animation du haut glisse vers la gauche ; la carte ne bouge pas. L'animation démarre
  **0,15 s avant la coupe**, pour être là pendant le glissé.
- **Le rythme.** Chaque souffle et chaque blanc coupés (« parole, parole, parole »). Un changement
  toutes les 2 à 3 s. Un plan A de moins d'une seconde ne vaut pas la peine : on le fusionne.
- **Le son.** La voix d'abord (−16 LUFS). **Un woosh seulement quand on quitte son plan pour une
  animation**, son pic au milieu du glissé. La première transition prend un riser et le « hoop ».
  Riser + hoop sur les deux ou trois moments forts. Deux musiques. Détails au § 7.
- **Les sous-titres.** Incrustés mot à mot, blancs à gros contour, un mot en jaune par phrase ; en B
  entre l'animation et sa tête, en A sous son menton. Un `.srt` à côté pour l'appli.
- **La vitesse.** La vidéo livrée est accélérée ×1,08, sans sauter une image.

---

## 2. Ce que Mohamed a dit, round par round (à ne pas refaire à l'envers)

| Version | Ce qui a été fait | Ce qu'il a répondu |
|---|---|---|
| v1 · 25 sept. | coupes à chaque souffle, A/B, glissés, woosh 0,35 sur **chaque** coupe, zooms, mots incrustés, visage dans une carte simple | « très bien », mais : ① « ma bouche et le son ne sont pas alignés, vers la 20e seconde » ; ② « quand je dis 9, t'as transitionné trop vite » ; ③ « un peu plus de woosh, un peu plus de musique » ; ④ la carte comme Kallaway : « enlever le background de tout mon corps… ma tête dépasse en haut, mes mains à droite, à gauche » |
| v2 · 26 sept. | lèvres recalées par prise ; coupes sur la grille des images ; le 9 tient, plan A suivant supprimé (B → B) ; woosh 0,5 ; deux musiques ; lui détouré sur la carte | « baisse ma tête… réduis le bottom margin » |
| v3 | carte et bande descendues de 160 px : 60 px du bas, comme les côtés | ① « le départ du woosh est décalé d'une demi-seconde : la fin du woosh doit arriver au même moment que la transition » ; ② « pas de woosh à toutes les transitions, seulement quand on va de ma scène vers les animations » ; ③ « des risers avec des hoop, des hits » ; ④ « la première fois, un riser directement, hop, pas de dessert » ; ⑤ « t'as coupé une phrase » ; ⑥ « ajoute la transcription » |
| v4 | woosh calés sur leur pic, 4 au lieu de 11 ; riser + hoop sur la première transition, sur 120, sur la relance et sur la chute ; hits des animations recalés ; sous-titres ; rien n'était coupé (vérifié), le mot « Plats » ajouté dans l'animation | « avec le riser au début et le boom, pas de musique : la musique commence après » |
| v5 | musique à partir du hoop de la première transition | « t'as coupé le mot repas » (il ne l'avait pas dit : vérifié) ; « accélère, teste 1,1… peut-être 1,08, l'idéal » |
| v6 | ×1,08 et un test ×1,1 | « on garde 1,08, lance le rendu final » |

**Leçons à appliquer d'office** sur la prochaine vidéo : lèvres mesurées avant tout ; woosh calés sur
leur pic et seulement vers une animation ; riser + hoop sur la première transition ; pas de musique
sous ce riser ; chiffre final tenu 0,5 s ; carte à 60 px du bas ; sous-titres ; ×1,08.

**Quand il croit qu'un mot ou une phrase a été coupé** : ne pas deviner. `ke.py … verifier coupes`
(l'énergie de tout ce qui a été enlevé), la transcription large-v3 de la prise, et au besoin une
planche des lèvres. Sur l'assiette, deux fois de suite, rien n'avait été coupé : la phrase tournée
(« Pour les plus gras, c'était le double ») manquait d'un lien. On le lui dit avec les chiffres (le
blanc enlevé est sous −46 dB ; entre « Pour » et « plus », 0,28 s, la place de « Pour les » ; les
lèvres ne se ferment que deux fois), et on rattrape au montage si possible (le mot « Plats » dans
l'animation), sans refilmer : il ne refilme pas.

---

## 3. L'outil

```
outils/kallaway-edit/
  ke.py            la commande : python outils/kallaway-edit/ke.py <dossier-video> <étape> [options]
  commun.py        la fiche, les chemins, les références de mots (« H2:sucre », « TM:gras#1 », « GE@6 », « plan:turn », « fin »)
  preparer.py      étape 0 : copie le kit dans un nouveau dossier
  transcrire.py    étape 1 : Whisper medium (coupes) et large-v3 (sous-titres)
  levres.py        étape 2 : mesurer le décalage son/lèvres
  maitre.py        étape 3 : la piste maître et la bande B
  plans.py         étape 4 : les coupes A/B et les repères des animations
  montage.py       étape 6 : index.html, sous-titres
  sous_titres.py   (utilisé par montage.py)
  rendre.py        étape 7 : rendu accéléré
  verifier.py      les contrôles
  couverture.py    étape 9 : le titre sur une image de lui, en première image de la vidéo
  gabarit.toml     la fiche de l'assiette, commentée : le modèle de toute nouvelle fiche
  README.md        l'aide-mémoire des commandes
```

Chaque module commence par un long commentaire : ce qu'il fait, pourquoi, et ce qui s'est passé sur
l'assiette. Les lire avant de changer quoi que ce soit.

**Dans le dossier d'une vidéo** (`video/<nom>/`) :

| Chemin | Quoi | Git |
|---|---|---|
| `kallaway.toml` | la fiche : **la seule chose qu'on écrit à la main**, avec les animations | versionné |
| `montage/mots-medium.json`, `mots-large-v3.json` | les transcriptions mot à mot | versionné |
| `montage/carte.json`, `plans.json` | les morceaux gardés, les mots et les plans en temps de la piste montée | versionné |
| `montage/cache/` | wav, planches des lèvres, planches de contrôle | ignoré |
| `assets/rushes/` | `voix-montage.mp4` (A + voix), `visage-b.mp4` (bande B), `visage-b-detoure.webm` | **ignoré** : sa voix, son visage |
| `assets/musique/` | Careless Wandering, Particle Emission | **ignoré** : bibliothèque tierce, dépôt public |
| `compositions/I*.html` | les animations du cadre B | versionné |
| `index.html`, `compositions/sous-titres.html`, `sous-titres.srt` | générés par `ke.py … montage` : **ne jamais retoucher à la main** | versionné |
| `renders/` | les MP4 | ignoré (ligne ajoutée par `preparer`) |

**Prérequis** (déjà là sur la machine de Mohamed, Windows) : Python ≥ 3.11 avec `faster-whisper`,
`numpy`, `Pillow` ; ffmpeg 9 ; Node et `npx hyperframes@0.8.21` (épinglé : la 0.8.77 plante sur le
cache npx) ; les modèles en cache : Whisper large-v3 (`~/.cache/huggingface`) et
`u2net_human_seg` (`~/.cache/hyperframes/background-removal`). Rien à télécharger ; si un modèle
manque, demander à Mohamed avant de le télécharger.

---

## 4. La chaîne, étape par étape

Toutes les commandes se lancent depuis la racine du dépôt : `K="python outils/kallaway-edit/ke.py video/<nom>"`.

**0 · Préparer** — `ke.py video/<nom> preparer`. Copie depuis l'assiette la DA (`kit.css`,
`youbud.css`), la police, Lucide, les sons, la toile, les musiques, la fiche d'exemple, un
`package.json` ; ajoute `video/<nom>/renders/` au `.gitignore`. N'écrase rien.

**1 · Transcrire** — `$K transcrire`. Mettre d'abord dans la fiche : `[[prises]]` (alias, fichier,
dans l'ordre du texte) et `[transcription] amorce` (deux phrases du script). 2 à 4 minutes. Affiche
chaque prise en `mot@index` : c'est là qu'on lit les références. **Comparer au script** : la prise
fait foi (sur l'assiette, mardi et mercredi inversés, « Satiété » jamais dit ; les animations ont
suivi la prise).

**2 · Les lèvres** — voir § 5. Remplir `bouche` et `decalage` de chaque prise.

**3 · La piste maître** — `$K maitre` (1 à 2 minutes). Écrit `voix-montage.mp4`, `visage-b.mp4` et
`carte.json`. `$K maitre --carte` recalcule la carte seule, sans réencoder. Puis :
- `$K verifier coupes` : « aucune alerte » attendu (tout ce qui est enlevé sous −40 dB) ;
- `$K levres verifier "H1:pas" "TM:Pour"` : sur chaque planche, les lèvres s'ouvrent sur l'image
  marquée `+0.000` (à une image près).

**4 · Les plans** — écrire les `[[plans]]` (id, cadre, premier mot `de`, zoom ou animation), puis
`$K plans`. Affiche chaque plan, alerte sur un plan A de moins d'une seconde, et pour chaque plan B
**les repères** : le temps de chaque mot + 0,15 s. **Ce sont les temps à écrire dans la timeline de
l'animation**.

**5 · Les animations** — une par plan B, skill `inserts-youbud`, en 1080 × 960 (règle
`.clip.scene-b` de la feuille de la vidéo), fond `assets/img/toile.jpg` en `<img>`, chaque élément
sur son repère. Deux règles propres au montage :
- son `data-duration` doit couvrir la fin du plan + le glissé de sortie (fin du plan − début de
  l'hôte + 0,14 s ; la dernière image tient) ; sinon `montage` refuse et dit de combien allonger ;
- le son dans l'animation suit le § 7 : **aucun woosh**, les hits calés sur leur boum.
Rendre chaque animation seule pour la regarder : `npx hyperframes@0.8.21 render -c compositions/<f>.html -o renders/<f>-draft.mp4 -q draft`.

**6 · Détourer** — `$K detourer`. `hyperframes remove-background` sur `visage-b.mp4` (modèle
`u2net_human_seg`, ne détoure que les humains), ~0,14 s par image sur le processeur : ~3 minutes
pour 35 s. Sortie : `visage-b-detoure.webm` (VP9 avec transparence). À refaire à chaque nouveau
`maitre`.

**7 · Le montage** — remplir `[[incrustes]]`, `[[sons]]`, `[[musique]]`, `[sous_titres]`, puis
`$K montage` (écrit `index.html`, `compositions/sous-titres.html`, `sous-titres.srt`, et la liste des
sons avec leur temps), puis `$K check` : **0 erreur, 0 avertissement**. Regarder avec
`npx hyperframes@0.8.21 snapshot --at <temps…> --no-end -o <dossier>` : un temps par plan, et les
instants délicats (mi-glissé, un mot incrusté, un sous-titre sur le t-shirt).

**8 · Rendre** — `$K rendre brouillon` (~2 min), `$K verifier son renders/<nom>-brouillon.mp4`
(−16 LUFS, crête sous −0,5 dBFS), `$K verifier planche …`, puis l'envoyer à Mohamed. Quand il valide :
`$K rendre final` (`-q high`). Pour comparer une autre vitesse : `$K rendre test 1.1`.

**9 · La couverture** — remplir `[couverture]` (le temps d'une image de lui dans la piste maître,
bouche fermée ; le titre en deux parties), puis `$K couverture`. Le titre en **ZY Elegant** (la police
de CapCut, tout en capitales, **sans accents** : pas de « é » dans la police), la première partie en
**blanc**, la seconde en **jaune** YouBud et plus grosse, une ombre douce, un dégradé sombre en haut ;
le haut du texte vers y = 250, dans la zone que la grille d'Instagram garde (3:4). Sorties :
`renders/couverture-<nom>.png`, et `renders/<nom>-couverture.mp4`, la vidéo livrée précédée d'**une
seule image**, la couverture, à choisir comme couverture dans l'appli (demandé le 28 septembre :
« découpe une partie blanche et une autre jaune, et ajoute une frame simple avant la vidéo »).

---

## 5. Mesurer le décalage des lèvres

**Le fait.** Sur son téléphone, avec le micro-cravate, **le son de chaque prise arrive avant les
lèvres**, et pas du même écart : sur l'assiette 0,21 · 0,20 · 0,19 · 0,18 · 0,33 · 0,12 s. Il a
repéré la prise à 0,33 s tout de suite. Le rendu HyperFrames, lui, est fidèle à l'image près
(`verifier synchro`) : un défaut de lèvres vient toujours de la prise.

**Au tournage, un clap** (ajouté le 27 septembre, pour les prises suivantes) : Mohamed frappe une
fois dans ses mains, face caméra, au début de chaque prise. Le claquement fait un pic net dans le
son, et l'image où les mains se touchent se voit à 60 i/s : `decalage = image du contact − pic du
son`, lu sur une planche (`$K levres planche <prise> <temps du clap>`, recentrer `bouche` sur les
mains pour l'occasion). Plus fiable qu'un « p », et sans chercher. Le clap tombe avant le premier
mot : les coupes l'enlèvent d'elles-mêmes. Sans clap, la méthode des lèvres ci-dessous.

**La méthode** (la seule qui a tenu) :
1. `$K levres cadre H1 1.0` → une image quadrillée ; relever la bouche (un carreau = 90 px de la
   source 4K) dans `bouche = [x, y]`. Une fois par prise : il bouge d'une prise à l'autre.
2. `$K levres candidats` → les mots en p, b, m de chaque prise.
3. `$K levres planche H1 2.20` → la bouche image par image à 60 i/s autour de 2,20 s, et l'enveloppe
   du son toutes les 10 ms.
4. Lire **l'explosion** dans le son (un p ou un b : l'enveloppe tombe, lèvres fermées, puis saute ;
   un m après un blanc : le début de la voyelle) et **l'ouverture** des lèvres sur la planche
   (dernière image lèvres closes → première image ouverte).
5. `decalage = ouverture − explosion`. Deux ou trois mots par prise, loin l'un de l'autre.

Exemples réels : hook-1, « pas » : explosion 2,19 s, lèvres ouvertes 2,40 s → 0,21. hook-2, « Mais »
après un blanc : voyelle 0,81 s, ouverture 1,017 s → 0,20. « tu en manges », « Pour » : explosion
7,89 s, lèvres closes 8,13-8,22, ouvertes 8,233 → 0,34 ; « plus » 8,17 → 8,47 : 0,30 → retenu 0,33.

**Pièges.** Une planche mal centrée (bouche au bord) donne n'importe quoi : recentrer `bouche`. Une
voyelle arrondie (« le », « u ») ressemble à des lèvres fermées : chercher la fermeture complète. Les
temps de Whisper sont à ±0,1 s : l'explosion se lit dans l'enveloppe, pas dans la transcription.
`levres auto` (corrélation mouvement/son) s'est trompé de 0,19 s sur une prise : indice seulement.

---

## 6. Remplir kallaway.toml

Lire `outils/kallaway-edit/gabarit.toml` : chaque ligne est commentée avec sa raison. En résumé :

- **Références de mots** : `"PRISE:mot"` (premier de ce mot dans la prise), `"PRISE:mot#1"`
  (deuxième), `"PRISE@6"` (par index), `"plan:<id>"`, `"fin"`. Cherchées dans la transcription
  **medium** : Whisper coupe « c'est » en `c` + `'est` (on écrit `"H2:c"`) et peut mal orthographier
  (`"GE:Mohammed"`). Une référence introuvable fait afficher toute la prise en `mot@index`.
- **`[coupe]`** : ne pas toucher sans raison (−34 dB, 0,12 s, garder 0,05 s avant, 0,08 après, 0,14
  en fin de prise, grille 30). Validé : « la coupure est très bien ».
- **`[cadre_b]`** : échelle 0,44 (tête ~400 px), bande 1080 × 800 posée à y = 1060, bouche à 397 px
  du haut de la bande, carte `{left 60, top 1240, 960 × 620, rayon 44}` : 60 px de marge partout,
  la tête dépasse de ~120 px. Changer `bande_top` et `carte.top` **ensemble** (même écart : 180).
- **`[[plans]]`** : alterner A et B ; aucun plan A sous 1 s ; ne jamais quitter une animation sur
  son dernier mot (le chiffre final tient 0,5 s) ; deux B de suite sont permis (B → B) ; un zoom par
  plan A. `decalage_anim` : 0 pour une nouvelle vidéo (l'omettre). `woosh = false` sur un plan B quand le hoop d'un moment fort tombe sur sa coupe (deux sons forts à 0,5 s se marchent dessus : les soixante cuillères de la balance, la jambe des abdos).
- **`[[incrustes]]`** : des mots, jamais des phrases (Instagram ne traduit pas le texte incrusté) ;
  un par idée forte ; style blanc, jaune (le terme clé, un chiffre), vert (l'appel), bleu clair (l'eau) ; `barre` pour
  barrer en rouge sur un mot (SUCRE) ; `disparait = "fin_plan"` ou un mot avec `avance` (pour laisser
  la place au suivant) ; `chevauchement = true` si deux se touchent exprès. **L'appel** (prénom et Abonne-toi en blanc, icône d'enregistrement en rose : `style = "rose"`) passe sur un `[[bandeaux]]` : un fond sombre semi-transparent et flouté, sinon il se perd sur le mur clair (28 septembre : « met un background transparent car ce n'est pas super visible ») ; l'icône en `rond = 130`.
- **`[[sons]]`** : 2 ou 3 `riser_hoop` : le chiffre fort, la relance (le turn), la chute.
- **`[[musique]]`** : morceau 1 de la première animation au turn, morceau 2 du mot de la relance à
  `"fin"`.
- **`[sous_titres]`** : `jaunes` = un mot par phrase, dans l'ordre du texte (l'outil les cherche dans
  l'ordre et s'arrête sur le premier introuvable) ; `majuscules` pour les débuts de phrase que
  Whisper a laissés en minuscule.

---

## 7. La grammaire sonore

**Le niveau** (28 septembre, après l'assiette : « réduis le bruit des animations, les clics, les risers
et les woosh de 40 %, la musique de 20 % ») : `[son] sfx = 0.6` et `musique = 0.8` dans la fiche
multiplient tous les bruitages et la musique du montage ; **dans les animations, écrire directement
les volumes d'`inserts-youbud` × 0,6**. Mesuré ensuite : −17,0 LUFS, crête −1,4 dBFS, la voix devant.
Les volumes du tableau ci-dessous sont ceux d'avant ce facteur.

**Un son se cale sur son pic, jamais sur son départ.** Pics mesurés (`$K verifier pic <fichier>` pour
un son nouveau, puis l'ajouter à `PICS` dans `montage.py`) :

| Fichier | Rôle | Pic | Comment on le pose | Volume |
|---|---|---|---|---|
| `air-woosh.wav` | le woosh d'une coupe vers une animation | 0,70 s | lu depuis 0,25 s, pendant 1 s ; pic au milieu du glissé (sur la coupe) | 0,5 |
| `rizer-windy.mp3` | riser « souffle » (première transition, relance, chute) | 2,75 s (fichier de 2,88 s) | on ne lit que ses `longueur` dernières secondes, pic sur le mot | 0,2 à 0,3 |
| `rizer-mettalic.mp3` | riser court et métallique (un chiffre) | 1,75 s | idem | 0,55 (il est faible) |
| `impacts.mp3` | le « hoop » : un souffle qui finit en boum | 0,55 s | lu depuis 0,2 s, pendant 1,2 s : lancé 0,35 s avant le mot | 0,34 à 0,45 |
| `soft_click.wav` | chaque mot incrusté, chaque barre | début | sur le mot | 1 |
| Careless Wandering | musique 1 (forte : −14,9 LUFS) | | du hoop de la première transition au turn, coupée net | 0,15 |
| Particle Emission | musique 2 (faible : −25 LUFS) | | du mot de la relance à la fin, avec un hoop | 0,55 |

- **Woosh** : seulement A → B, pas la première fois. Sur l'assiette : 4. Aucun au retour vers lui,
  aucun B → B, **aucun dans les animations** (celui du ventre a été retiré).
- **La première transition** : un riser qui monte sous la première phrase du hook (depuis 0 s), le
  hoop pile sur la coupe, et **aucune musique avant** : elle part sur le hoop.
- **Le turn** (la relance, « Mais le pire… ») : la musique 1 s'arrête net sur la coupe ; le vent
  (riser 1,4 s) monte sous la phrase ; hoop + musique 2 + punch-in sur le mot suivant (« Dans une
  étude »).
- **Dans les animations** : un hit lancé sur son repère avec `data-media-start="0.2"` et
  `data-duration="0.3"` n'a **jamais** fait entendre son boum (il tombe à 0,55 s). Toujours :
  `data-start = repère − 0,35`, `media-start 0.2`, durée ≥ 0,7.
- **Mesuré sur l'assiette** : −16,4 LUFS, crête −0,6 dBFS. Les crêtes viennent de la voix.

---

## 8. Les sous-titres

- Les mots de **large-v3** (ce qui a été dit, pas le script) ; recollés (`c 'est` → `c'est`).
- Deux ou trois mots par groupe, 16 caractères au plus, jamais à cheval sur une coupe de plan ni sur
  une fin de phrase ; chaque mot pop quand il est prononcé (0,12 s).
- Archivo 900, 72 px, blanc, contour `-webkit-text-stroke: 14px #1f1f1f` avec **`paint-order:
  stroke fill`** (sinon le contour ronge la lettre) ; un text-shadow en 8 directions était trop fin
  sur son t-shirt blanc. Un mot jaune (`--yb-yellow`) par phrase.
- B : `top_b = 980` (entre le bas de l'animation ~940 et sa tête ~1110). A : `top_a = 1320` (sous le
  menton). Rien sous y = 1536 : l'interface d'Instagram.
- Composition à part (`compositions/sous-titres.html`) avec deux tableaux de temps et une boucle :
  une ligne GSAP par mot dépassait 400 lignes et `check` avertissait.
- Le `.srt` : une phrase par bloc, ponctuée, **aux temps de la vidéo accélérée**. C'est celui-là
  qu'Instagram et TikTok traduisent.

---

## 9. Le rendu accéléré

La composition reste à vitesse 1 (tous les temps de la fiche sont ceux de la parole réelle). La
vidéo livrée est accélérée de `[rendu] vitesse` = **1,08** (1,1 testé ; 1,15 était trop rapide dans
CapCut). Pour ne sauter aucune image : **rendre à 30 ÷ vitesse i/s** (`--fps 250/9` pour 1,08,
`300/11` pour 1,1), puis ffmpeg `setpts=PTS/1.08` et `atempo=1.08` (la voix garde sa hauteur),
sortie à 30 i/s : 972 images rendues → 972 images livrées, 35 s → 32,4 s. Rendre à 30 × vitesse
(32,4 i/s, le premier essai) fait jeter des images. `rendre.py` fait tout.

---

## 10. Livrer à Mohamed

- Envoyer le MP4 (SendUserFile) et, si utile, une image ou une planche ; dire en quelques lignes ce
  qui a changé et ce qui reste à faire ; lui demander de regarder précisément ce qui est nouveau.
- Répondre à chaque retour point par point, avec les chiffres quand c'est une vérification.
- **Ne jamais committer sans qu'il le demande**, et jamais de ligne `Co-Authored-By` ni « Generated
  with Claude Code ». Les prises montées, les musiques et les rendus ne vont jamais dans le dépôt
  (public).
- Mettre à jour la page de la vidéo (`INSERTS-*.md` ou la page du dossier) : ce qui est rendu, pas
  ce qu'on voulait.

---

## 11. Les pièges rencontrés

| Symptôme | Cause | Remède |
|---|---|---|
| lèvres en retard sur le son, une prise plus que les autres | le téléphone enregistre le son en avance, d'un écart propre à chaque prise | § 5, `decalage` par prise |
| animations de plus en plus en avance sur la voix (0,3 s à la fin) | le concat d'ffmpeg rallonge chaque morceau audio jusqu'à sa dernière image, avec du silence | coupes sur la grille 1/30 s, `trim=end_frame`, `apad` + `atrim=end_sample` (fait dans `maitre.py`) |
| woosh qui arrive après la transition | calé sur son départ ; son pic est à 0,70 s | caler le pic (`PICS`) |
| hits muets dans les animations | lus 0,3 s depuis 0,2 s, le boum est à 0,55 s | § 7 |
| rendu accéléré saccadé | rendu à 30 × vitesse | rendre à 30 ÷ vitesse (`rendre.py`) |
| le 9 à peine vu | glissé parti sur le dernier mot | tenir 0,5 s ; supprimer le plan A trop court (B → B) |
| une animation disparaît pendant le glissé de sortie | `data-duration` trop court | l'allonger (la dernière image tient) ; `montage` le signale |
| sous-titres invisibles | CSS aux accolades doublées `{{ }}` hors f-string | une chaîne CSS normale ; toujours regarder un snapshot |
| `composition_file_too_large` | une ligne GSAP par mot | tableaux + boucle (fait) |
| `container_overflow`, `text_occluded` | la vidéo de fond déborde de la carte, la découpe couvre le bas des animations : voulu | `data-layout-allow-overflow`, `data-layout-allow-occlusion` (fait) |
| `duplicate_media_discovery_risk` | deux `<video>` sur le même fichier | la carte B a son propre fichier (`visage-b.mp4`) |
| contour des sous-titres illisible sur le t-shirt | text-shadow trop fin | `-webkit-text-stroke` + `paint-order: stroke fill` |
| « t'as coupé un mot » | souvent : il ne l'a pas dit | `verifier coupes`, large-v3, planche des lèvres ; répondre chiffres à l'appui |
| mots fantômes dans `verifier coupes` | Whisper pose des mots de durée nulle ou dans un silence | ignorés s'il n'y a pas de son à cet endroit (fait) |
| `print` qui plante sous Windows | console en cp1252 | `commun.py` passe stdout en UTF-8 |
| `npx` introuvable depuis Python | c'est un `.cmd` sous Windows | `shutil.which("npx")` (fait) |
| `/tmp` différent entre Git Bash et Python | deux racines sous Windows | `cygpath -m /tmp/…`, ou le dossier `montage/cache/` |
| `\v`, `\n` mangés dans un script passé par heredoc | l'outil Bash interprète les barres obliques inverses | écrire les scripts avec l'outil Write |
| `hyperframes upgrade` qui plante | cache npx corrompu (0.8.77) | rester en 0.8.21 |

---

## 12. L'exemple : l'assiette, plan par plan

Piste montée 34,93 s (52 s de prises, 27 morceaux), composition 34,98 s, livrée 32,4 s (×1,08).

| # | Plan | Cadre | Temps (s) | Ce qu'il dit | À l'image | Son |
|---|---|---|---|---|---|---|
| 1 | hook | A | 0,00-1,75 | « Lundi, tu arrêtes le sucre : pas de dessert. » | zoom lent 1 → 1,06 | riser sous la phrase, pas de musique |
| 2 | semaine | B | 1,75-6,40 | « Mardi, pas de bonbons… La balance n'a pas bougé. » | I1a, la semaine, la balance à 0 kg | hoop sur la coupe ; musique 1 démarre |
| 3 | probleme | A | 6,40-7,60 | « Mais le problème, ce n'est pas le sucre, » | punch-in 1,15 ; SUCRE, barré sur « sucre » | clics |
| 4 | gras | B | 7,60-9,87 | « c'est le gras, le beurre, l'huile et les sauces. » | I1b | woosh |
| 5 | calorique | A | 9,87-11,40 | « Le gras, c'est le plus calorique. » | zoom lent | |
| 6 | quatre-neuf | B | 11,40-15,27 | « Un gramme de sucre, 4 calories… de gras, 9. Donc, pour les mêmes calories, » | I2a, le 9 tient | woosh ; riser + boum sur le 9 (dans l'animation) |
| 7 | ventre | B | 15,27-18,67 | « il prend deux fois moins de place… tu continues de manger. » | I2b ; seule l'animation glisse | |
| 8 | turn | A | 18,67-24,47 | « Mais le pire du gras… Dans une étude de 2006… dans leur plat. » | lent 1 → 1,05, punch-in 1,15 sur « Dans » ; GRAS, puis ÉTUDE · 2006 | musique coupée ; vent ; hoop + musique 2 sur « Dans » |
| 9 | double | B | 24,47-25,80 | « Pour les plus gras, c'était le double. » | I3 : Plats, Estimé, Réel × 2 | woosh ; boum sur « double » |
| 10 | cuillere | A | 25,80-27,50 | « Chaque cuillère d'huile, c'est 120 calories, » | punch-in sur 120 ; pilule 120 | riser métallique + hoop sur 120 |
| 11 | dessert | B | 27,50-31,27 | « alors la prochaine fois… profite bien sûr de ton dessert. » | I4 : cuillère, huile, dessert | woosh ; riser + hoop sur « dessert » |
| 12 | appel | A | 31,27-34,93 | « Moi, c'est Mohamed… enregistre la vidéo. » | zoom lent 1 → 1,08 ; Mohamed, Abonne-toi, icône | clics |

---

## 13. Ce que l'outil ne fait pas (encore)

- Il n'écrit pas les animations : elles restent faites à la main (skill `inserts-youbud`), calées
  sur les repères de `plans`.
- Il ne choisit ni les plans, ni les mots incrustés, ni les moments forts : c'est la fiche, écrite
  depuis le script et les retours de Mohamed.
- Il ne place pas les incrustés au pixel : `left` et `largeur` se règlent à l'œil sur un snapshot.
- Un son nouveau demande de mesurer son pic (`verifier pic`) et de l'ajouter à `PICS`.
- Une nouvelle façon de zoomer ou un nouveau type de son : l'ajouter dans `montage.py`, le documenter
  ici et dans `gabarit.toml`.
