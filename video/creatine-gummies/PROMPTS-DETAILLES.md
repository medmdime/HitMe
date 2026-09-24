# Prompts détaillés — les 4 inserts HyperFrames

Tout est repris tel que rendu le 22 septembre. Copie-colle tel quel pour générer ailleurs.
Stack : HyperFrames 0.8.21, GSAP 3.14.2, Lucide 1.47.0 en local (`assets/vendor/lucide.min.js`), kit `components/kit.css` + `components/youbud.css` + `Archivo.woff2`.

## Contraintes globales appliquées à chaque insert

- Toile : `1080×1920`, `30fps`, `data-start="0"`, fond plein `--bg #f7f7f4`, pas de transparence.
- **Direction artistique YouBud** (l'appli Ubod) : vert `#58cc02`, orange `#ff9600`, jaune `#ffc800`, bleu `#1cb0f6`, rouge `#ff4b4b`, violet `#ce82ff`, encre `#3c3c3c`. Chaque couleur a sa teinte claire (`-2`) et son rebord (`-edge`). Tokens dans `components/youbud.css`.
- **Aucune bordure.** Une carte = une teinte claire + un rebord plein de 10px en ombre dessous (`box-shadow: 0 10px 0 edge`), rayon 36px. Les icônes Lucide prennent la couleur vive de la carte.
- Verdicts : pastille ronde verte (coche) ou rouge (croix), trait blanc qui **se dessine** (`stroke-dashoffset` mesuré), entrée `back.out(1.6)` 0,35 s.
- **Des mots, jamais des phrases** (Instagram traduit les sous-titres, pas le texte incrusté, et le marché visé est le français) : chiffres et unités, symboles (`?`, `≈`, `=`, `×`), icônes Lucide, noms propres, et un mot par élément quand il porte le sens. Archivo 900, chiffres en `tabular-nums`. Un seul élément coloré par carton : pilule jaune ou verte avec encre dessus, pilule rouge avec blanc dessus.
- Zone sûre : rien d'important dans les 12 % haut / 20 % bas. 0,3 s de tenue à la fin.
- Timeline : `gsap.timeline({ paused: true })` sur `window.__timelines["<id>"]`. Entrées en `power3.out`, rebond réservé aux verdicts et au bonbon.
- **Le son est dans le rendu** : `<audio id src data-start data-duration data-track-index data-volume>` par bruitage, une piste par son. Bibliothèque `assets/sfx/` copiée de `D:\editing_audio\`. Volumes du montage CapCut : `soft_click` 1.0 sur chaque élément qui se pose, `clicks` 0.95 sur un accent, `correct` 0.24 → 0.7 en montant, `wrong` 0.35 → 0.7, `impacts` 0.43 (extrait à 0.2 s, 1.3 s), `air-woosh` 0.09 sur chaque changement de scène, `rizer-windy` 0.24 (extrait à 1.3 s), `bloop` 0.5 à 0.8 sur une chute.
- Images : tête de James Smith détourée (`assets/img/james-head.png`, `hyperframes remove-background` sur une capture 4,5 s du MP4 source) posée **en rond, bord blanc 10px, rebord** comme un emoji. Logo NOW (`assets/img/now-logo.png`, favicon 192px de nowfoods.com) dans le même rond blanc. Le pot est dessiné à plat, pas photographié.
- Commandes : `npx --yes hyperframes@0.8.21 check` puis `npx --yes hyperframes@0.8.21 render -c compositions/NOM.html -o renders/NOM.mp4 -q high`.

---

## I0 · James Smith → NOW · 1.62s · `compositions/I0-james-smith.html` → `renders/I0-james-smith.mp4`

Voix dessous : « Lui, c'est James Smith. » Sert de plan de présentation, à la place d'un extrait de sa vidéo.

- Un bonhomme Lucide `person-standing` 480px encre à x=300, y=680, avec **la tête détourée de James** en rond emoji 176px (`james-head.png` à 290px, décalée -66/-94) posée sur la tête de l'icône ; pilule blanche `James Smith` 44px à y=1210.
- Le logo NOW dans un rond blanc 280px à x=400, y=720, pilule `NOW` dessous à y=1050.
- Animation : bonhomme scale 0.4→1 y 40→0 `back.out(1.4)` à 0 ; nom à 0.2 ; **la tête hoche** (±7° × 3) à 0.35 ; à 0.85 **la bascule** : le bonhomme file à gauche (x -700, rotation -8, opacity 0, 0.3s power2.in), le nom s'efface, le logo arrive de la droite (x 700→0, scale 0.6→1, rotation 20→0, `back.out(1.3)`) à 0.95, `NOW` à 1.15. Tenue jusqu'à 1.62.
- Son : soft_click à 0, whoosh 0.35 sur la bascule à 0.75, bloop 0.6 à 0.95.

Prompt icônes : `person-standing`.

---

## I1 · poudre contre bonbon · 14.3s · `compositions/I1-poudre-contre-bonbon.html` → `renders/I1-poudre-contre-bonbon.mp4`

Voix dessous : « Tout le monde sait que la créatine marche, aujourd'hui. Le plus dur, c'est de la prendre assez souvent pour que ça marche. Cinq grammes de poudre pâteuse tous les jours, c'est contraignant. Un bonbon, c'est facile. »

### Carte 1 — 3 bénéfices (0:00)
- Titre : pilule verte `Créatine` 66px à rebord, à y=300. Aucun autre mot.
- 3 cartes `290×300` sans bordure à y=470, x=80/395/710 : orange `dumbbell` Force · violet `brain` Cerveau · vert `heart-pulse` Récup. Icône 120px en haut, le mot 40px en bas.
- Pastille verte 88px en haut-droite, coche dessinée.
- Animation : titre scale 0.85→1 y 24→0 power3.out 0.5s à 0s ; cartes scale 0→1 y 40→0 stagger 0.12 à 0.3s ; pastilles à 0.95/1.17/1.39 ; **l'haltère bascule** (rotation ±14° × 5) à 1.0, **le cerveau pulse** (1→1.14 × 3) à 1.25, **le cœur bat** (1→1.18, deux salves) à 1.45 et 2.15.
- Son : soft_click ×4 (titre + cartes), correct 0.24/0.30/0.36 sur les coches.

### Carte 2 — calendrier (0:03)
- La scène A file vers le haut (opacity 0, y -30, 0.25s à 2.6).
- 3 cartes `290×330` jaune clair avec **bandeau calendrier jaune et deux anneaux** en haut, icône `smile` verte / `meh` orange / `frown` rouge, `Jour 1` / `Jour 7` / `Jour 15` en 42px.
- Animation : chaque carte **se retourne** (`rotationY -90→0`, perspective 900) stagger 0.18 à 3.0 ; pastilles ✓ à 3.75, ✕ à 4.05 et 4.35 avec **secousse** de la carte (x ±9, 0.3s) ; le visage triste vacille (rotation ±10°) à 4.5.
- Carton : pilule jaune `calendar-days` + `× 30` à y=860, y 30→0 à 3.4.
- Son : soft_click ×3, correct 0.30, wrong 0.35 puis 0.45, whoosh 0.09 sur la coupe.

### Carte 3 — poudre vs bonbon (0:07)
- Deux colonnes `440×640` à x=70 et x=570, y=560 ; carte `440×520` bleu clair à gauche, orange clair à droite.
- Gauche : verre SVG 300×340 (eau bleue, **nuage de poudre** qui apparaît), cuillère doseuse bleue 190×150. Label `5 g / jour` 46px sous la carte.
- Droite : bonbon gélifié 240×250 orange (blob, ombre interne, deux reflets), étincelle Lucide `sparkles` jaune, label `Facile` en pilule verte à rebord.
- Animation : gauche x -80→0 à 7.0 ; **la cuillère verse** (rotation -55°, x -40, y 30) à 7.5, l'eau se trouble à 7.8, la cuillère revient à 8.4 ; croix rouge 110px + secousse de la carte à 10.0 ; droite x 80→0 à 11.0 ; **le bonbon tombe** (y -420→0 power2.in 0.32) puis s'écrase (scaleY 0.78 / scaleX 1.16) et reprend forme en `elastic.out(1, 0.45)` ; coche verte à 11.6 ; **16 confettis** aux couleurs YouBud partent derrière la coche à 11.65 (balistique déterministe, 1 s, gravité 1300) ; étincelle à 11.75.
- Son : whoosh 0.09 à 6.7 et 10.85, soft_click à 7.05, bloop 0.5 sur le versement, wrong 0.55 sur la croix, bloop 0.8 sur l'écrasement, correct 0.7 sur la coche.

Prompt icônes : `dumbbell, brain, heart-pulse, smile, meh, frown, sparkles, calendar-days, thumbs-up`.

---

## I2 · vingt-trois marques · 18.3s · `I2-vingt-trois-marques.html` → `I2-vingt-trois-marques.mp4` (prioritaire)

Voix dessous : « Avec NOW, ils ont testé séparément les marques ... Sur vingt-trois marques ... huit ... La majorité : presque zéro. Des bonbons normaux, quoi. »

### A — Qui a testé (0:00)
- Groupe à y=600. **Tête de James en emoji** : rond 220px bord blanc, image `james-head.png` à 360px de large décalée (-80, -116), à x=130. Pilule blanche `James Smith` 34px dessous.
- Flèche `move-right` 140px encre à x=470.
- Une fiole `flask-conical` bleue 70px au-dessus du **logo NOW**, dans le même rond blanc 220px à x=730, et la pilule blanche `NOW` 34px dessous, comme celle de James.
- Animation : tête scale 0→1 rotation -12→0 `back.out(1.4)` à 0 ; nom à 0.3 ; flèche x -40→0 à 0.6 ; logo scale 0→1 rotation 12→0 à 0.9 ; fiole `back.out(1.6)` à 1.15 ; **James hoche la tête** (rotation ±6° × 3) à 1.4 ; **le logo fait un tour complet** (0.9s) à 1.6. Le tout file vers le haut à 2.7.
- Son : bloop 0.6, soft_click, clicks 0.95, et un `rizer-mettalic` court (0.9 s, 0.15) sur le tour du logo.

### B — Le pot et la question (0:03)
- Pot dessiné 240×300 : corps encre `#3c3c3c` arrondi, couvercle `#2b2b2b` avec rebord, étiquette blanche `CRÉATINE` 32px + `gummies` orange 24px, quatre bonbons colorés au fond. À x=270, y=590.
- Pipettes `test-tubes` 170px bleu à x=570.
- La question : `Dedans ?` 84px dans une pilule jaune à rebord, y=940.
- Animation : pot y 60→0 scale 0.9→1 à 3.0 puis **on le secoue** (rotation ±7° × 5) à 3.55 ; pipettes scale 0.5→1 rotation 14→0 à 3.3 ; `?` scale 0.4→1 `back.out(1.6)` à 3.6 puis vacille (±8° × 5) à 4.1. Effacé à 5.7.
- Son : whoosh 0.09, soft_click, clicks, bloop 0.5, et six `soft_click` à 0.09 s d'écart (0.3) pendant que le pot se secoue : le cliquetis.

### C — Classement contre la promesse (0:06)
- Kicker à y=222 : une fiole `flask-conical` bleue 48px puis le mot `Labo`. Compteur **`23` en pilule jaune** 96px (0→23 en 1.4s, pulse à l'arrivée) puis **`8` en pilule verte** (0→8 en 1.6s, synchronisé avec les jauges).
- 23 lignes de 42px à y=450 : nom 230px aligné à droite, piste `560×24` gris `#e6e6e1`, remplissage `scaleX` depuis la gauche.
- **La ligne de la promesse** : pointillés encre 6px à x=897, exactement au bout des pistes (x=900), avec une pilule noire `tag` + `Promesse` 24px au-dessus ; **aucune jauge ne la dépasse**. Elle se déroule de haut en bas (`scaleY 0→1`) à 7.6.
- Valeurs : 8 premières à `1` → **vert** `#58cc02` plein, avec une **coche ronde verte au bout** de chaque jauge ; les 15 autres à `0.4, 0.3, 0.5, 0.08` puis `0.07` → **rouge** `#ff4b4b`, un bout bien visible (40px minimum), et la ligne **tremble** (x ±5) quand elle tombe.
- Animation : lignes x -50→0 stagger 0.05 à 6.1 ; vertes à 8.2 +0.2 chacune (coche à +0.25) ; rouges à 12.0 +0.08 chacune.
- Carton blanc y=1418, 54px : le bonbon dessiné 64px puis `Presque` et `0` en pilule rouge, à 12.4 ; source `James Smith + NOW` 26px à y=1526 dessous ; à 14.85 les deux s'effacent, le bonbon puis `=` et `30 €` en pilule rouge prend la place à 15.1.
- Son : whoosh 0.09 à 5.7, riser 0.24 de 6.05 à 7.6 sous le compteur, rafale de 6 soft_click sur les lignes (6.1 → 7.1), impact 0.43 à 7.6 quand la promesse se pose, **7 bulles `bloop` en montant de 0.22 à 0.40 puis une seule `correct` à 0.66** sur les jauges vertes (huit réussites d'affilée, c'était trop), wrong 0.5 à 12.0 et 0.7 à 12.7, impact 0.43 sur chaque carton, whoosh avant le second.

Prompt icônes : `move-right, flask-conical, test-tubes, tag`.

---

## I3 · on vend d'abord, on contrôle après · 7.3s · `I3-vendre-puis-controler.html`

Voix dessous : « En France, un gummy se vend sur déclaration. Aucun labo ne teste la dose avant la vente. »

- Deux cartes `440×580` sans bordure à y=440, x=70/570, un mot par élément :
  - bleu clair, `pill` bleu 130px, titre `Médicament` 44px, puis une frise interne de trois ronds blancs 110px : `file-text` → `flask-conical` vert avec mini-coche → `shopping-cart`, et sous chaque rond son mot 24px `Déclaration` · `Contrôle` · `Vente` ; pastille ✓ verte
  - orange clair, `package` orange, titre `Complément`, même frise et mêmes mots, mais la case Contrôle est **vide, en pointillés gris**, son mot grisé, barrée d'une mini-croix rouge ; pastille ✕ rouge
- Ligne du bas y=1080 : `user-round` encre 140px + `circle-help` rouge 100px → un rond rouge clair 180px avec une `flask-conical` rouge et une pastille ✕ à y=1286, puis `0` en pilule rouge et `contrôle avant` 44px à y=1476.
- Animation : cartes y 70→0 scale 0.92→1 power3.out à 0 et 0.15 ; frise du médicament (ronds scale 0→1, liens scaleX 0→1) à 0.5, mini-coche et coche à 1.0, **la gélule salue** (rotation ±16° × 3) ; frise du complément à 2.2 ; mini-croix et croix à 3.0 + secousse de la carte + **le colis sursaute** (y -18) ; toi scale 0→1 à 4.0 ; le `?` arrive en `back.out(1.8)` à 4.2 puis **vacille** (±12° × 5) à 4.65 ; le rond à 4.3, sa croix à 4.55, le `0 contrôle avant` à 4.6. Les mots de chaque frise entrent avec leur rond, stagger 0.16.
- Son : soft_click ×5 sur les cartes et la frise, correct 0.3, soft_click ×2, wrong 0.55, clicks, bloop 0.5, impact 0.43.

Prompt icônes : `pill, package, file-text, flask-conical, shopping-cart, user-round, circle-help`.

---

## I4 · trois grammes ou zéro · 5.3s · `I4-trois-grammes-ou-zero.html`

Voix dessous : « Si l'étiquette dit trois grammes et que le bonbon en contient zéro, personne ne le sait avant un contrôle. Et les contrôles arrivent après la vente. »

- Gauche : carte jaune clair `440×440` à y=470, **sachet orange** 250×320 avec scellé plus foncé et une étiquette blanche centrée en flex : icône `tag` 40px, le mot `Étiquette` 24px, puis `3 g` 52px orange foncé ; pilule jaune `3 g` à rebord sous la carte.
- Droite : carte rouge clair, **bonbon en coupe** (demi-dôme orange 250×200 sur un sol) avec une **jauge blanche** dedans : le remplissage vert `scaleY 0.95 → 0.02` se vide, un trait rouge apparaît au fond. Label 44px : une loupe `search` 52px, `Dedans :` puis `0` en pilule rouge à rebord.
- Mini frise y=1160 : ligne grise 800px, étapes rondes à rebord (les deux premières **en vert**, la troisième blanche), sous chacune une icône 50px et son mot 28px : `file-text` Déclaration, `shopping-cart` Vente, `flask-conical` Contrôle grisé ; curseur triangle rouge.
- Animation : gauche y 60→0 à 0 + le sachet oscille (±4°) à 0.5 ; droite à 2.0, la jauge se vide `power3.in` 0.55 à 2.3, le bonbon s'écrase et reprend forme à 2.85 ; frise y 24→0 à 3.0 ; **le curseur saute** en cloche (x 0→646 `power2.inOut` 0.6, y 0→-90→0) de 3.2 à 3.8 ; l'étape fiole pulse (scale 1.25) et son icône passe au rouge `#d63a3a` à 3.8.
- Son : soft_click, clicks, soft_click, wrong 0.6 quand la jauge se vide, clicks sur la frise, whoosh 0.09 pendant le saut, impact 0.43 à l'atterrissage.

---

## Rendu

```bash
npx --yes hyperframes@0.8.21 check
npx --yes hyperframes@0.8.21 render -c compositions/I1-poudre-contre-bonbon.html -o renders/I1-poudre-contre-bonbon.mp4 -q high
npx --yes hyperframes@0.8.21 render -c compositions/I2-vingt-trois-marques.html -o renders/I2-vingt-trois-marques.mp4 -q high
npx --yes hyperframes@0.8.21 render -c compositions/I3-vendre-puis-controler.html -o renders/I3-vendre-puis-controler.mp4 -q high
npx --yes hyperframes@0.8.21 render -c compositions/I4-trois-grammes-ou-zero.html -o renders/I4-trois-grammes-ou-zero.mp4 -q high
```

Écarts assumés : logo NOW en favicon 192px (pas de SVG officiel trouvé), James et le logo en rond blanc façon emoji, pot dessiné à plat, cotes 8/23 et jauges proportionnelles reconstituées d'après les captures, Jour 1/7/15 et 30 € hors voix mais voulus par toi. Le `check` passe ; un seul avertissement de contraste restant, sur un texte sondé pendant son fondu d'entrée.
