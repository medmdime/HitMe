---
name: montage-capcut
description: Monter un reel science-based façon Train Bloom dans CapCut. Contient en tête LA RECETTE du format Train Bloom tourné en blocs (1:10 à 1:30, react + animations plein cadre), à refaire à l'identique — coupes 70 ms avant sa voix et respirations retirées, yeux alignés, large / serré à 1,2, pistes, sons et volumes, textes et sous-titres, scripts plan_bloom / construire_bloom, contrôles, rangement après export. Aussi — le format simple « Tes questions », la grammaire sonore d'origine (bascule musicale sur le deuxième hook, signature riser/whoosh/impact, paires erreur/réussite, clics), les volumes. Extrait de montages réels terminés. À charger dès qu'on assemble, sonorise ou sous-titre un reel dans CapCut.
---

# Monter un science-reel dans CapCut

**Portée.** Ce skill décrit le montage d'**un reel science-based au format Train Bloom** :
correction de croyance, mécanisme expliqué, alternance face caméra / animation, deux
mouvements séparés par un turn. Il ne se transpose pas tel quel à un vlog, un tuto, une
story ou un talking-head continu. Le script se fabrique avec le skill `science-reel` ;
celui-ci commence quand les rushes sont là.

**Quelle partie suivre.**

| Ce qu'on monte | La partie qui fait foi |
|---|---|
| une vidéo **au format Train Bloom, tournée en blocs** (1:10 à 1:30, un react, des animations plein cadre) | **« LA RECETTE TRAIN BLOOM »**, juste en dessous : à refaire à l'identique. Elle l'emporte sur tout le reste de ce skill |
| un « Tes questions » (25 à 40 s, deux cadres A / B) | « Le format simple dans CapCut », à partir de « La version 3 : ses propres réglages » |
| le reste (§ 1 à 10, la méthode créatine) | la grammaire d'origine et l'historique : à lire pour comprendre, pas pour régler |

---

## LA RECETTE TRAIN BLOOM — à refaire à l'identique

**La référence** : le projet « BLOOM 17 v3 - Douze kilos avec des gateaux » (vidéo 17, « Il a perdu douze kilos en
mangeant des gâteaux »), 1:13, monté le 5 octobre 2026 en trois versions et exporté par Mohamed le soir même. Avant
d'exporter il n'a retouché que deux sons (le riser des barres). Puis il a écrit : « tous ces détails de editing,
ajoute-les dans le skill de Train Bloom, pour que le montage, le prochain, soit exactement similaire, avec les 1.2,
avec la manière où t'as coupé ». Pour une vidéo de ce format, on ne réinvente donc rien : on refait ce qui suit, avec
les mêmes chiffres. Ils sont relevés dans le projet exporté et portés par les scripts de
`D:\editingvideo\tes-questions\outils\`. La fiche de la référence :
`D:\editingvideo\tes-questions\17-gateaux-douze-kilos\MONTAGE.md`.

**Son principe** : « les assets en brut sur CapCut et tous les éléments faits nativement par CapCut, comme ça je peux
directement éditer et prendre la relève ». Rien n'est rendu en amont, sauf sa voix (normalisée) et les animations.
Le cadrage, les coupes, les sons, les textes, le masque de la carte sont des réglages CapCut qu'il peut changer.

### 0. Ce qu'il faut avant de commencer

- **Ses blocs** : un fichier par bloc du prompteur, une prise chacun (`D:\videos\Bloc 0.mp4` … `Bloc 9.mp4`, OBS,
  3840 × 2160, 16:9). **Les compter contre le PROMPTEUR avant tout** : le 5 octobre un bloc manquait et un fichier
  daté était un faux départ. Un bloc manquant se dit en premier, et sa place est tenue dans le projet (l'animation
  sans voix, un texte rouge « BLOC N A TOURNER »).
- **Une prise où il regarde l'objectif en souriant sans parler**, pour le plan du hook où il écoute le clip : la
  chercher dans toutes ses prises (`silencedetect` : celle qui commence par un long silence ; le 5 octobre, son faux
  départ, dix secondes sans un mot). Toujours de la vidéo, jamais une image figée. La même image, exportée en 9:16
  et en 4K, sert de photo de couverture (`renders/photo-sourire-9x16.jpg`).
- **Le clip du react**, en français, qui dit en une phrase ce que sa première réplique valide (« Il a raison. »).
  `transcribe_clip` sur chaque candidat : une légende ne dit pas ce que la voix dit. TikTok ne se cherche pas par
  mot-clé ; faute de TikTok, un extrait YouTube (`yt-dlp --download-sections`), son normalisé à −16 LUFS.
- **Les animations** plein cadre 1080 × 1920 (skill `inserts-youbud`), une composition par bloc d'animation, chaque
  repère de `CUES` attaché à un mot et chaque son dans une balise `<audio id="iN-s-<repère>">`.
- **Les dossiers** : `D:\editingvideo\tes-questions\<slug>\` avec `rushes/brut`, `rushes/normalise`, `animation`,
  `clip`, `sons`, `musique`, `travail` ; dans le coffre, `video/to-edit/<slug>/`.

### 1. L'ordre, commande par commande

Depuis `D:\editingvideo\tes-questions\outils\` :

1. `python transcrire_blocs.py <slug> bloc0="D:\videos\Bloc 0.mp4" bloc1=… clip=…` : faster-whisper `large-v3`
   (CPU, int8), mot à mot → `travail/<nom>-mots.json` et `<nom>-16k.wav`.
2. `python normaliser_blocs.py <slug> bloc0=… ` : `loudnorm` en deux passes vers **−16 LUFS, crête −1,5 dBTP**, la
   voix **retardée de 50 ms** (les lèvres, sur ses prises OBS), l'image copiée telle quelle → `rushes/normalise/`.
   La prise où il sourit va dans `rushes/brut/ecoute.mp4`, sans traitement (elle est muette dans le projet).
3. `python plan_bloom.py --sans-recaler` jusqu'à ce que le plan soit bon (§ 2 et 3), puis `python plan_bloom.py` :
   écrit `travail/plan.json` et **recale chaque composition sur la prise** (`CUES`, `data-start` des sons, durées).
4. Dans le dossier de la vidéo : `npx --yes hyperframes@0.8.21 check`, puis chaque animation :
   `npx --yes hyperframes@0.8.21 render -c compositions/<nom>.html -o renders/<nom>.mp4 -q high`, copiée dans
   `animation/`. Regarder une planche d'images de chaque rendu.
5. **CapCut fermé** : `D:\editingvideo\tools\VectCutAPI\venv-capcut\Scripts\python.exe construire_bloom.py`. S'il
   est ouvert, le lui dire ou mettre en attente (`quand_capcut_ferme.sh`). **Un nouveau nom par version**
   (« BLOOM NN vK - Titre sans accents ») ; `--remplacer` seulement si le projet n'a jamais été ouvert (pas de
   `draft_content.json` dans son dossier). Jamais d'écriture dans un projet qu'il a ouvert, jamais de dossier de
   projet renommé.
6. `python apercu_bloom.py "<projet>"` : le mixage exact du projet et un aperçu demi-résolution → les contrôles du § 7.
7. `…\venv-capcut\Scripts\python.exe srt_youtube_bloom.py` → `sous-titres YouTube.srt` ; puis `DESCRIPTION.md`,
   `TEXTE.md`, `MONTAGE.md`.

### 2. Les coupes — « la manière où t'as coupé »

Vitesse **1,0** partout (son « rythme humain ») : jamais de ×1,08 dans ce format.

**Sa demande** : « regarde où l'audio commence et coupe 50 à 100 millisecondes avant que je parle… je veux que tu
coupes toute la partie où je respire ». Le résultat de référence : 32 morceaux (le plan du hook, et 31 pour ses neuf
blocs), 1:13 au lieu de 1:22, aucun mot retiré.

- **Le début de sa voix se mesure sur le son, jamais sur la transcription.** Whisper colle la respiration au premier
  mot (« Il » donné 0,5 s trop tôt). `voix.py`, sur le son 16 kHz du bloc, calcule toutes les 5 ms deux niveaux,
  rapportés à sa voix (le 90e centile du bas) : **le bas** (90 à 700 Hz : la voix voisée ; une respiration y est
  30 dB plus bas) et **le haut** (2 à 7,5 kHz : les consonnes sourdes). Il parle quand le bas dépasse **−18 dB** ;
  deux passages séparés de moins de 60 ms sont recollés.
- **Un morceau commence 70 ms avant sa voix et finit 50 ms après** (`AVANCE`, `TRAINE`). Si le premier mot commence
  par une consonne sourde (s, ç, c, f, p, t, k, q, x), le début recule jusqu'à elle (haut au-dessus de −38 dB, dans
  les 160 ms qui précèdent) ; la fin s'allonge de même sur une consonne finale (150 ms au plus). Le dernier bloc
  (l'appel) garde **0,35 s** de tenue.
- **Une pause se coupe à l'intérieur d'un bloc** quand deux passages de voix sont séparés d'au moins **0,28 s**
  (`PAUSE`) **et** qu'il y a entre eux au moins **0,12 s de vrai calme** (`CALME` : bas sous −22 dB et haut sous
  −33 dB). Sans la seconde condition on retire des syllabes faibles (« ce qui ») et on mange des fins de mots
  (« gâteaux », « quart »).
- **La fin d'un morceau ne tombe jamais avant la fin du dernier mot** donnée par Whisper (+ 0,04 s, sans dépasser la
  fin de la voix + 0,25 s ni le morceau suivant − 0,03 s) : une voyelle finale faible passe sous le seuil.
- **Deux morceaux séparés de moins de 0,12 s après ces réglages sont recollés** : c'était un faux silence.
- **Ses mots en trop se coupent sans qu'il le demande** (« avec » qui traîne, « en fait », « finalement ») : dans
  `PLANS`, un `retrait` donne les numéros des mots et l'intervalle exact de la prise. Chaque retrait est essayé sur
  le son seul et retranscrit avant d'être écrit : à 0,03 s près, Whisper entendait « on ne te fera pas ».
- **À l'image près** : le début d'un morceau est arrondi à la microseconde, sa durée est un nombre entier d'images
  (30 i/s), chaque clip est raccourci de 3 µs ; juste avant un mot retiré, la durée est arrondie vers le bas. Sinon
  deux voisins se chevauchent et la bibliothèque refuse (`SegmentOverlap`).
- Les temps de `plan.json` sont ceux des fichiers normalisés : ceux de la transcription **+ 0,05 s**.

### 3. Le cadre — ses yeux, le large, le serré à 1,2

**Ses demandes** : « aligne à chaque fois les yeux au même endroit », « tu peux ne pas zoomer à ce point », puis
« le zoom serré est trop fort, mets 1,3… mets même 1,2 ».

- **Ses yeux au même point dans chaque morceau** : au centre (x = 540) et à la même hauteur (y = 941 dans la
  référence), en large comme en serré. `yeux.py` cherche un gabarit de ses yeux et de ses sourcils à plusieurs
  échelles (OpenCV 5 n'a plus les cascades de visages) et rend le milieu de ses pupilles. La mesure se prend sur la
  **première demi-seconde de chaque morceau** : c'est là que le regard du spectateur retombe après la coupe.
  Le gabarit vient de `D:\videos\Bloc 1.mp4` du 5 octobre : s'il change de pièce, de caméra ou de lunettes, le
  refaire (`BOITE`, `MILIEU`) et vérifier sur une planche.
- **Le large est le plus large possible, et il est fixe.** Une prise 16:9 remplit la hauteur d'une vidéo verticale à
  **316 %** : on ne peut pas montrer plus large, et il faut le lui dire (pour plus large : caméra verticale, ou lui
  plus loin). Le large de la référence est à **334 %** : la marge sert seulement à aligner ses yeux en hauteur d'un
  bloc à l'autre sans bande noire. `plan_bloom.py` calcule cette échelle minimale à chaque vidéo.
- **Le serré vaut 1,2 fois le large** (`ZOOM_SERRE`), soit 401 %, le même chiffre dans tous les blocs. 1,5 était
  « trop fort ».
- **Aucun zoom progressif, aucune image clé** : un morceau a une échelle et une position, c'est tout.
- **Large / serré** dans un plan où on le voit : la première phrase est en large ; le cadre bascule **à chaque fin de
  phrase** (si le cadre en cours a duré au moins 1,2 s) et **après chaque mot retiré**. Une respiration coupée au
  milieu d'une phrase ne change pas le cadre : ses yeux sont alignés, seule sa bouche saute. Relever ces endroits et
  les lui donner (deux dans la référence).
- Le plan du hook (il écoute) est en large. Sous une animation, ses morceaux sont au large, centrés (on ne les voit pas).
- Les formules, pour un clip de 3840 × 2160 : `f = 0,28125 × échelle` ; `transform_x = (1920 − x_yeux) × f / 540` ;
  `transform_y = (960 − (y_cible − (y_yeux − 1080) × f)) / 960`, bornée pour ne jamais montrer de bande noire.

### 4. Les pistes

| Piste | Contenu | Réglages |
|---|---|---|
| `main` | tous ses morceaux, bord à bord, sa voix dedans | volume 1,0 ; le plan du hook (il écoute) à volume 0 |
| `animation` | chaque animation plein cadre, **volume 0**, entre deux **copies-voisines** de 0,4 s (12 images) du morceau face caméra voisin, muettes, au même cadre | les copies portent les transitions de CapCut : **Left** 0,2 s pour entrer, **Right** 0,2 s pour sortir, Left entre deux animations qui se suivent |
| `clip` | le clip emprunté, **en carte devant sa poitrine**, avec son propre son (volume 1,0) | un clip 16:9 : 900 × 506, de y = 1300 à 1806 (échelle 0,833) ; masque rectangle de CapCut sur tout le clip, `roundCorner` 0,12 |
| `riser`, `boom` | trois signatures riser → boom, et un boom sous le carton | voir ci-dessous |
| `musique` | Garden of Eden, lue depuis 1,23 s | volume **0,02** ; de boom 1 + 0,20 s jusqu'au début du plan du retournement ; fondu de sortie 0,5 s |
| `musique2` | Particle Emission, lue depuis 0 | volume **0,10** ; de l'animation qui suit le retournement (+ 0,10 s) jusqu'à boom 3 + 0,97 s ; fondu de sortie 0,83 s |
| `souffle` | `air-woosh.wav`, de 0,43 à 1,10 s du fichier | volume **0,11**, posé 0,26 s avant chaque passage entre lui et une animation, ou entre deux animations |
| `fx1`, `fx2`… | les sons des animations, **un par un**, lus dans les balises `<audio>` des compositions | les volumes des compositions : clic doux 0,6, `clicks` 0,57, bulle 0,13 à 0,42, réussite 0,4 |
| `erreur` | son son d'erreur doux (`erreur-douce.mp3`, de 0,2 à 0,75 s), à la place de chaque `wrong.mp3` d'une animation | volume 0,3, posé 0,04 s avant la croix |
| `titre`, `source`, `carton`, `appel` | le texte natif (§ 5) | |
| quatre pistes de sous-titres | une piste par position (§ 5) | |

**Les trois signatures** (riser `rizer-windy.mp3` lu depuis 1,0 s à **0,2** ; boom `impacts.mp3` lu depuis 0,2 s
pendant 1,5 s à **0,3**) :

| Où | Le boom | Le riser |
|---|---|---|
| la sortie du hook (« Il a raison. ») | 0,04 s avant le premier plan face caméra | 1,75 s, il finit 0,37 s après le boom |
| le deuxième hook : l'entrée de l'animation qui suit le retournement | 0,07 s avant ce plan | 1,75 s, il finit 0,13 s après le début du plan |
| l'appel (« Moi, c'est Mohamed ») | sur le début du plan | de 1,60 s avant à 0,13 s après |

**Un riser sur une barre qui se remplit** (le son « Electronic Riser sound » de la bibliothèque CapCut, qu'il avait
glissé lui-même dans le projet : son fichier est dans `…\CapCut\User Data\Cache\music\<hash>.mp3`, à copier dans
`sons/` et jamais dans le dépôt public) : le segment commence quand la barre part, sa source est décalée pour que la
fin de la montée (2,35 s dans le fichier) tombe quand le chiffre se pose, et la barre se remplit pendant toute la
montée (`clip-path`, pas `scaleY`). **Ses réglages, ceux qu'il a exportés : 1,33 s, volume 0,14 puis 0,11, fondu de
sortie 0,5 s.** Je l'avais posé à 0,5 sur 2,7 s : il l'a baissé et raccourci. Tout son ajouté sous sa voix part de
ces niveaux.

### 5. Le texte

- **Le titre**, pendant tout le hook (de 0 à la fin du premier plan face caméra + 0,07 s) : trois lignes en
  capitales, sans accents, la première en jaune et les autres en blanc (« MAIGRIR / AVEC DES / GATEAUX ? »).
  ZY Elegant (posé en Inter Black, la police est remplacée dans `draft_info.json`), taille 12, y = 350, ombre
  (opacité 0,7, distance 2, angle −45).
- **La source du clip** : « Dr Jean-Michel Cohen · YouTube », Inter Black taille 5, blanc, 34 px au-dessus de la carte.
- **Le carton du mécanisme** (« DÉFICIT / CALORIQUE ») : Inter Black taille 21, blanc, ombre (0,85, distance 4),
  y = 1520, sur lui, quand il dit ces mots : de 0,02 s avant le premier jusqu'à 0,3 s après le dernier, **mais jamais
  sur le mot suivant** (sinon ses sous-titres disparaissent). Les sous-titres de ces mots sont retirés. Un boom à
  0,2 (1 s) 0,03 s avant.
- **L'appel** : la pastille « Mohamed » (texte #3c3c3c sur fond blanc, arrondi 0,4, taille 12, `transform_y` 0,66)
  du mot « Mohamed » jusqu'à « abonne » ; puis « Abonne-toi » sur fond vert #58cc02 jusqu'à la fin.
- **Les sous-titres** : des groupes de **trois mots et seize caractères au plus**, jamais à cheval sur deux phrases,
  une virgule ferme le groupe, et un dernier mot court ne reste pas seul (il prend le dernier mot du groupe d'avant). Un segment par mot : tout le
  groupe en blanc, le mot en cours en jaune (1,0 · 0,784 · 0,0), aucune animation. Inter Black taille 11 (9 sur la
  carte), contour 40.
- **Quatre pistes, parce qu'une piste n'a qu'une position** : `sous-titres` y = **1470** (plan large),
  `sous-titres serre` y = **1560** (plan serré : son menton descend), `sous-titres anim` y = **1585**,
  `sous-titres clip` y = **1700** (les mots du clip, sur la carte). Sous une animation les groupes passent par-dessus
  les coupes ; face caméra ils restent dans leur morceau, parce que le cadre change.
- **Le texte des sous-titres se relit contre le PROMPTEUR**, pas contre Whisper : `REGLES` corrige plan par plan ce
  qu'il a mal entendu (« Ça sent sûrement pas » était « Ce ne sont sûrement pas »). Les nombres en chiffres
  (« 10 semaines », « 2 600 », « 20 % »), la négation complète. Un mot que deux passes de Whisper entendent
  différemment se signale à Mohamed : il l'écoute.

### 6. Les animations dans le montage

- **Elles se recalent sur la prise avant le rendu `-q high`** : dans `plan_bloom.py`, `reperes()` attache chaque
  repère à un numéro de mot du bloc ; `recaler()` réécrit `CUES`, le `data-start` de chaque `<audio>` et la durée de
  la composition (celle de son plan dans le montage). Si la prise dit autre chose que le texte, l'animation suit la
  prise.
- **Elles sont muettes dans CapCut** : `construire_bloom.py` relit leurs balises `<audio>` (`src`, `data-start`,
  `data-duration`, `data-media-start`, `data-volume`) et repose chaque son sur une piste `fx`, pour qu'il règle
  chacun. Le fichier nommé dans `src` doit exister dans `sons/`. Un son qui commencerait à moins de 0,05 s de la fin
  du plan est laissé de côté.
- Tout le reste (la DA, les vraies photos, les mots et pas les phrases) : skill `inserts-youbud`.

### 7. Vérifier avant de rendre la main

1. **Aucun mot mangé** : `apercu_bloom.py` écrit `voix-vN.wav`, la voix du projet tel qu'il est écrit ; elle
   repasse dans Whisper et **chaque phrase doit revenir entière**.
2. **Ses yeux** : une image avant et une image après chaque coupe où on le voit, côte à côte, la ligne des yeux tracée.
3. **Une planche de chaque cadre** avec le sous-titre à sa place : pas de bande noire, le texte sous son menton.
4. **Les sous-titres relus en entier** (`sous-titres.srt`) : c'est là qu'on a trouvé le trou sous le carton.
5. **Le niveau des sons sous sa voix**, sur `mix-vN.wav`, par tranches de 0,25 s autour de chaque son nouveau.
6. `lire_projet.py "<projet>" info` : la durée, le nombre de morceaux, les volumes.

### 8. Ce qu'on lui dit en rendant le projet

Le nom du projet ; ce qu'il a demandé et ce qui est fait, demande par demande ; la limite des 316 % s'il parle de
zoom ; les coupes sans changement de cadre, avec leur timecode ; les mots à écouter ; ce que la prise dit autrement
que le texte (un chiffre arrondi, une marque) ; ce qui reste à faire à la main (la couverture, les deux exports).
L'aperçu (`apercu-vN.mp4`, copié dans `renders/` du dossier de la vidéo) part avec le message : demi-résolution,
sans texte ni transitions, le son exact.

### 9. Après ses exports

Le 5 octobre il a exporté lui-même, en 4K, HEVC, mov, dans `D:\exports` : le projet tel quel, puis les quatre pistes de
sous-titres masquées (fichier « …-yt.mov »). S'il demande l'export : `capcut_export.ps1`, plus bas dans ce skill. Le contenu est à 30 images par seconde : exporter en 60 ne fait que doubler le
fichier.

1. Comparer `draft_content.json` à `draft_info.json` **piste par piste** : ce qu'il a retouché est un réglage à
   reprendre dans les scripts et ici. Si la timeline n'a pas bougé, le `.srt` tient.
2. Une planche d'images des deux fichiers : sous-titres dans l'un, pas dans l'autre.
3. Ranger : le dossier passe de `video/to-edit/` à `video/done/` (corriger les liens `video/to-edit/<slug>` des
   notes) ; les exports sont déplacés dans `renders/` sous les noms `<Titre> - TikTok Instagram (avec
   sous-titres).mov` et `<Titre> - YouTube (sans sous-titres).mov` ; une ligne **ajoutée à la main** dans
   `video/done/À publier.md` (relancer `a_publier.py` réécrirait l'état des autres pages) ; `DESCRIPTION.md` dit
   quel fichier va où et donne la légende à coller.

### 10. Pour la vidéo suivante : ce qui change, et rien d'autre

Les scripts sont encore écrits pour la vidéo 17 : on adapte leur fiche, pas leur méthode. L'état qui correspond au
projet exporté (avec ses réglages du riser) est gardé dans `outils\bloom-17\` : ne pas le modifier, s'y reporter en
cas de doute.

| Script | Ce qu'on adapte | Ce qu'on ne touche pas |
|---|---|---|
| `plan_bloom.py` | `SLUG` ; `CLIP` (le passage du clip) ; `ECOUTE` (la prise où il sourit, et sa seconde de départ) ; `PLANS` (nom, `face` ou `anim`, bloc, animation, retraits, `traine` 0,35 sur l'appel) ; `COMPOS` ; `reperes()` (les mots de chaque repère) ; le bloc du riser dans `recaler()` s'il y a une barre | `ZOOM_SERRE` 1,2 · `AVANCE` 0,07 · `TRAINE` 0,05 · `PAUSE` 0,28 · `CALME` 0,12 · `DUREE_MINI` 1,2 · `RETARD` 0,05 · tout `voix.py` |
| `construire_bloom.py` | `SLUG`, `PROJET`, `COMPOS`, `REGLES` ; les lignes du titre (`jaunes`, `blancs`) ; le texte de la source ; le mot du carton ; les noms des plans qui portent les signatures (le premier face caméra, le retournement, l'animation qui le suit, l'appel) et la liste `coupes` | `COPIE`, `TRANSITION`, la carte, `ST_Y`, les volumes, tout ce qui vient de `construire.py` |
| `apercu_bloom.py` | `SLUG`, `COMPOS` | |
| `yeux.py` | le gabarit, seulement si le décor ou la caméra changent | |

### Ce qui a été essayé le 5 octobre et qu'il a refusé — ne pas y revenir

- un zoom lent sur chaque plan (3,16 → 3,35, images clés) et un cadrage sur sa bouche : ses yeux sautaient d'un bloc
  à l'autre, et il se trouvait trop gros ;
- un serré à 1,5, ajusté à la taille de son visage : « trop fort » ;
- un bloc = un clip, coupé 0,12 s avant le premier mot de Whisper : il restait une demi-seconde de respiration ;
- le riser à 0,5 avec son écho ; avant lui, le souffle `rizer-windy` sur la barre ;
- pendant le clip du hook, lui les yeux baissés sur son téléphone ;
- une icône pour une personne, un lieu ou un objet réels (skill `inserts-youbud`) ;
- un sous-titre qui écrit la négation tronquée que Whisper a entendue.

---

**Comment lire les chiffres des § 1 à 10** (le montage d'origine). Tout est mesuré sur un montage fini de 71,4 s : 10 plans,
48 événements sonores sur 13 pistes, 25 sous-titres. Les chiffres sont relevés dans le
projet, pas estimés — mais ils se lisent selon deux régimes :

| | |
|---|---|
| **Les volumes** | **absolus, à recopier.** Un whoosh à 0.09 reste à 0.09 quelle que soit la vidéo |
| **Les timecodes** | **des exemples, jamais des consignes.** Ils dépendent de la longueur et du découpage de *ta* vidéo |

Chaque fois qu'un timecode apparaît ci-dessous, il indique **quel événement du montage**
déclenche le son, pas à quelle seconde le poser. Sur une vidéo de 105 s, aucun de ces
chiffres n'est juste — les règles, elles, tiennent toutes.

---

## 1. La structure des pistes

Deux pistes vidéo seulement, et elles ne servent pas à ce qu'on croit.

| Piste | Contenu |
|---|---|
| `main` | **le hook uniquement** — le clip emprunté, en pleine image |
| `incrustation` | **tout le reste** — ta tête en petit sur le hook, puis tous les plans plein cadre |

C'est contre-intuitif et c'est volontaire : la piste du dessus porte le montage, celle du
dessous ne sert qu'au fond du hook. Ça permet de changer le clip emprunté sans toucher au
reste.

### Le hook : le clip en grand, toi en petit

**Le clip emprunté est en PLEINE IMAGE. Toi tu es l'incrustation.** Pas un split-screen,
pas l'inverse.

```
main          clip emprunté     échelle 1.00   plein cadre
incrustation  toi               échelle 1.50   position (-0.33, -0.52)
```

Position `(-0.33, -0.52)` = **en haut à gauche**. Échelle 1,5 sur une source déjà verticale :
tu remplis la vignette, on voit ton visage et rien d'autre. Le spectateur regarde le clip,
te voit réagir en périphérie.

Durée du hook : **5 à 6 s**. Pas 10. C'est la seule durée du montage qui ne dépend pas de
la longueur totale : le hook se termine quand le clip emprunté a fini de dire la bêtise,
et ça prend toujours à peu près le même temps.

**Si la prise de Mohamed qui écoute n'a pas été filmée**, la générer avec Higgsfield plutôt
que de la refaire tourner (fait le 22 septembre 2026 pour la créatine, `rushes/attente-hook.mp4`) :
prendre la **première image** d'une prise face caméra (avant qu'il parle : bouche fermée, regard
caméra, mains baissées), la recadrer en 9/16 autour de lui (`crop=1215:2160:1620:0` sur un
rush 4K où il est à 57 %), l'envoyer par `media_upload` → `curl PUT` → `media_confirm`, puis
`generate_video` avec `seedance_2_5`, `mode=omni_reference`, rôle `start_image`, 14 s, 1080p,
9/16, `generate_audio=false`. **Le prompt décrit une réaction, pas une attente** : « immobile,
bouche fermée, regard caméra » donne un clip exact mais figé et triste, que Mohamed a trouvé
glauque. Ce qui marche : il regarde le clip hors champ (les yeux un peu à droite de l'objectif,
en bas comme un téléphone ou en haut), le visage se détend dès la première seconde, il hoche la
tête, lève les sourcils, sourit en coin, et **revient vers la caméra sur les deux dernières
secondes** avec un petit signe d'approbation, pour enchaîner sur sa première phrase. Silencieux,
mains hors champ, caméra fixe, même visage et même fond. 168 crédits, environ 4 minutes ;
refuser le preset que le serveur propose (`declined_preset_id`). Vérifier sur une planche à
1 i/s qu'il ne parle pas avant de la poser. Générer deux variantes (approbation / sceptique
amusé) pour qu'il choisisse.

### Après le hook

Tout passe sur `incrustation`, plein cadre, échelle 1.0, alternance caméra / animation.
Le montage mesuré, à titre d'exemple (71,4 s au total) :

```
 5.4 →  7.9   caméra    (1,8 s)   le pivot
 7.9 → 19.8   animation (12,0 s)
19.8 → 22.6   caméra    (2,8 s)   le pont
22.6 → 36.5   animation (13,9 s)
36.5 → 39.8   caméra    (3,3 s)   LE TURN
39.8 → 65.2   animation (25,4 s)
65.2 → 71.4   caméra    (6,2 s)   la chute
```

Ce qu'il faut en retenir n'est pas la colonne de gauche mais **l'alternance** : hook,
puis caméra / animation / caméra / animation / caméra / animation / caméra. Quatre
retours face caméra, trois blocs d'animation. Sur une vidéo plus longue, ce sont les
blocs d'animation qui s'allongent, pas les plans caméra.

**Les plans caméra sont plus courts que ce qu'on croit.** 1,8 s pour le pivot. Serre au
maximum : coupe 0,25 s avant le premier mot, 0,35 s après le dernier, et supprime toute
respiration qui ne sert pas le jeu. Seule exception : le silence du turn, qui se garde.

---

## 2. La bascule musicale — la règle la plus importante

**Deux morceaux, pas un. Le changement tombe sur le deuxième hook.**

Le format a deux mouvements. Le premier pose la croyance et la démonte ; le second
relance sur une nouvelle question — *le deuxième hook*, celui qui fait rester jusqu'au
bout. C'est là, et nulle part ailleurs, que la musique change.

**Ne cherche pas une seconde.** Repère d'abord le deuxième hook dans le montage :
c'est le plan face caméra où tu poses la question que le spectateur vient de se
formuler tout seul (*« Donc le sport, ça sert à rien ? »*). La bascule se cale dessus,
qu'il tombe à 22 s, à 35 s ou à 58 s.

Le montage mesuré, **à titre d'exemple seulement** :

```
morceau 1    3,5 → 36,5 s    volume 0.11
morceau 2   34,9 → 71,4 s    volume 0.24
```

Le point de bascule y tombe à 35 s sur 71,4, soit 49 %. **Ce n'est pas une cible.** Ça
tombait au milieu parce que le deuxième hook y était ; si ton script le place à 40 %
ou à 60 % du montage, la musique y va aussi. Un turn qui arrive tard n'est pas un
défaut de montage, c'est un choix d'écriture — le montage suit l'écriture.

Ce qui, lui, ne change jamais :

1. **Le changement de musique EST le marqueur du deuxième hook.** Le spectateur ne
   l'analyse pas, il le ressent : quelque chose vient de changer. C'est plus fort que
   n'importe quel bruitage.
2. **Le second morceau est plus fort que le premier** (0.24 contre 0.11, soit environ
   le double). L'énergie monte après la bascule. La première moitié pose le problème à
   voix basse, la seconde apporte la réponse.
3. **Fondu croisé d'environ 1,5 s**, obtenu en faisant démarrer le morceau 2 avant la
   fin du morceau 1. Une coupe franche s'entend et fait rupture.
4. **Le morceau 1 démarre après le hook**, pas à 0 s — le clip emprunté a son propre son.

Choisis deux morceaux de la même famille mais d'énergie différente. Pas deux genres
opposés : on doit sentir une montée, pas un changement de vidéo.

---

## 3. La signature de transition : riser → whoosh → impact

Trois sons, dans cet ordre, sur les trois moments qui comptent — **des moments de
montage, pas des timecodes** :

| Moment | Où exactement |
|---|---|
| La sortie du hook | sur la coupe entre le clip emprunté et ton premier plan |
| **Le deuxième hook** | sur la même coupe que la bascule musicale |
| La chute | sur la coupe vers le dernier plan face caméra |

Relevé dans le montage mesuré, pour les volumes :

```
sortie du hook   riser (0.24) → whoosh (0.09) → impact (0.43)
DEUXIÈME HOOK    riser (0.24) → impact (0.43)   + whoosh de part et d'autre
la chute         riser (0.24) → impact (0.43)
```

Le riser démarre **~1 s avant** la coupe, l'impact tombe **sur** la coupe ou juste après.
Le riser annonce, l'impact confirme. C'est un rapport de temps, pas une position : il
reste vrai où que tombe la coupe.

Trois emplois dans toute la vidéo, quelle que soit sa durée. **Une vidéo plus longue n'a
pas droit à un quatrième.** Si tu le mets partout, il ne veut plus rien dire.

---

## 4. Les paires erreur / réussite

`wrong` et `correct` ne se posent jamais seuls — ils marchent en **paire**, et la réussite
répond à l'erreur.

Ils se posent **sur l'image**, quand la croix ou la coche apparaît à l'écran. Leur
nombre suit donc le nombre d'éléments faux/justes de tes animations, pas la durée.

Dans le montage mesuré, cinq occurrences, réparties une paire avant la bascule et le
reste après :

```
avant la bascule   wrong (0.24)  →  correct (0.55)
la bascule          correct (0.49)
après               wrong (1.00)  →  correct (1.00)  →  correct (1.37)
```

**Le volume monte à chaque occurrence** : 0.49 → 0.55 → 1.00 → 1.37. La dernière réussite
est la plus forte de la vidéo. C'est une escalade, pas une répétition — et c'est ça qu'il
faut reproduire, pas les cinq positions.

`wrong` sur la croix, sur le segment barré, sur ce qui est faux.
`correct` sur la coche, sur le levier qui marche, sur la bascule finale.

---

## 5. Les clics — deux outils différents

**`soft_click` en rafale** : 3 à 4 clics rapprochés pour une liste qui se remplit.

```
rafale serrée     4 clics en 0,1 s      quand plusieurs éléments surgissent ensemble
rythme de liste   ~0,9 s d'écart        un clic par item qui se pose
```

Deux usages distincts : la **mitraillette** quand plusieurs éléments apparaissent d'un coup,
et le **rythme de liste** quand ils arrivent un par un. Ne les mélange pas.

**`clicks` en accent isolé** : un seul, sur un élément qui entre. Huit dans le montage
mesuré, **tous pendant les blocs d'animation, aucun sur un plan face caméra**.

La densité est ce qui compte : **environ un toutes les 2 à 3 secondes d'animation**.
C'est ce qui donne la sensation que le graphique « fonctionne ». Sur une animation deux
fois plus longue, tu en poses deux fois plus — le rythme reste le même.

---

## 6. Les volumes — c'est là que se joue le pro

Relevés du montage, à recopier tels quels :

| Élément | Volume |
|---|---|
| Voix | 1.00 |
| Musique 1 (avant le turn) | **0.11** |
| Musique 2 (après le turn) | **0.24** |
| `air-woosh` | **0.09** |
| `rizer-mettalic` | 0.24 |
| `impacts` | 0.43 |
| `clicks` | 0.95 – 1.00 |
| `soft_click` | 1.00, jusqu'à 3.2 sur les accents |
| `correct` / `wrong` | 0.24 → 1.37 (croissant) |

**Le whoosh à 0.09, c'est le chiffre qui surprend.** Il n'est pas là pour s'entendre, il est
là pour lisser la coupe. Un whoosh audible fait amateur. Un whoosh à peine perceptible fait
que la coupe « passe ».

Même logique pour la musique : **0.11**, c'est presque rien. La voix ne doit jamais avoir à
lutter.

---

## 7. Les sous-titres

```
25 blocs · position Y = -0.85 (tout en bas) · durée 0,6 à 3,4 s · moyenne 2,2 s
```

Trois règles :

1. **Pas de sous-titres sur le hook, ni sur le plan qui le suit.** Dans le montage mesuré
   le premier bloc arrive à 13 s, soit bien après la fin du hook — ce n'est pas un délai
   à recopier, c'est un point de départ : le premier sous-titre tombe **au début du
   premier bloc d'animation**. Le clip emprunté a déjà les siens, et pendant ton pivot le
   spectateur regarde une réaction, pas un texte.
2. **Des blocs de phrase, pas du mot à mot.** Environ **un bloc toutes les 2 s de parole
   sous-titrée** — 25 blocs ici. Un découpage automatique en sort deux fois plus : ça
   clignote et ça fatigue.
3. **Tout en bas — Y = −0.85.** Les animations occupent le centre et la droite du cadre. La
   zone basse leur est réservée, et les compositions HyperFrames laissent 240 px de marge en
   bas exprès.

Un export SRT automatique est un point de départ, pas un résultat : il faut regrouper et
remonter la ponctuation à la main.

---

## 8. Ordre de montage

1. Poser les plans vidéo, bord à bord, sans son
2. Serrer chaque plan caméra au maximum
3. Poser la voix, vérifier la synchro avec les animations
4. Poser **les deux musiques** et caler la bascule sur le deuxième hook
5. Poser les trois signatures riser/whoosh/impact — trois, pas plus
6. Poser les paires erreur/réussite
7. Poser les clics sur les entrées de graphiques
8. Sous-titres en dernier, regroupés à la main
9. Passe de volumes complète avec le tableau ci-dessus

---

## 9. Ce que le MCP CapCut peut et ne peut pas

Le serveur MCP sert à **préparer** le projet, pas à le finir. Il pose les rushes aux bons
timecodes et importe les sons ; le placement fin se fait à la main.

Contraintes vérifiées :

- `add_subtitle` **plante** sans `font` — passer `Inter_Black`
- `save_draft` accepte un `draft_folder` non déclaré. **Sans lui, le projet s'ouvre vide.**
- `speed` **marche** dès que `start` et `end` sont donnés : l'emprise timeline vaut
  `(end − start) / speed`, et `start`/`end` se lisent dans le fichier à vitesse normale. Sans
  `end`, le segment part à longueur nulle et l'enregistrement le rallonge à la durée entière du
  fichier — c'est sans doute ce qui donnait autrefois « un clip de 16 s à vitesse 1,34 qui
  occupe quand même 16 s et écrase le suivant ». Vérifié le 22 septembre 2026 sur la créatine
  (§ 3 de la méthode) : le plan s'ouvre dans CapCut avec « Vitesse 1,08x », modifiable.
- Il faut un `end` et un `target_start` explicites sur chaque `add_video`, sinon le segment
  est créé à longueur nulle.
- Deux sons qui se recouvrent sur la même piste sont refusés — répartir sur `sfx`, `sfx2`,
  `sfx3`.
- Le serveur de preview HyperFrames **réécrit les fichiers HTML** (il injecte des
  `data-hf-id`). L'arrêter avant toute édition scriptée.

**Importer des sons sans les placer est impossible.** Le seul moyen de les faire entrer dans
le projet est de les poser sur la timeline. Les mettre en file **après la fin de la vidéo**
(à partir de 76 s par exemple), en réserve, puis les glisser où il faut et supprimer le reste.

---

## 10. Le format de projet

CapCut Windows écrit `draft_content.json` + `Timelines/`. Le MCP écrit `draft_info.json`
(format macOS 6.5). **Les deux coexistent dans le même dossier** : CapCut lit le sien et
convertit à la première ouverture.

Pour relire un montage terminé, c'est **`draft_content.json`** qu'il faut ouvrir, pas
`draft_info.json` — ce dernier reste figé sur la version écrite par le MCP.

---

## La méthode de la vidéo créatine (22 septembre 2026) — à suivre telle quelle

Quatre versions du projet ont été nécessaires ; celle-ci est la bonne. Elle répond à ce que
Mohamed a demandé après avoir ouvert le projet : sa voix collée à sa vidéo et prioritaire, des
cuts serrés, les transitions de CapCut, un zoom qui attire l'attention, chaque son réglable.

### 1. La voix d'abord — mesurer avant de mixer

Les prises au téléphone sortent à **−28 à −30 LUFS**, soit 12 dB sous un mixage normal. Posées
telles quelles, tout le reste paraît trop fort. Avant tout : normaliser la voix **dans le
fichier, sans toucher à l'image** :

```
ffmpeg -i brut/scene-1.mp4 -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 scene-1.mp4
```

Vérifier avec `ffmpeg -i f.mp4 -af ebur128=peak=true -f null -` : **−16 LUFS, crête −1,5 dBFS**.
Les originaux restent dans `rushes/brut/`. Tous les volumes du tableau du § 6 sont relatifs à
une voix à −16 LUFS ; sur cette vidéo Mohamed a demandé les bruitages **à 80 %** de ces valeurs
en plus, pour que sa voix domine nettement.

**C'est la seule chose rendue en amont.** Un simple gain dans CapCut ne la remplace pas : les
prises ont des crêtes à −8 dBFS (scene-2) pour −30 LUFS, +14 dB de volume les ferait saturer,
alors que `loudnorm` limite en même temps qu'il remonte. **Tout le reste — vitesse, cadrage,
zoom, transitions, volumes — se règle dans CapCut, jamais dans le fichier** : Mohamed continue
le montage dessus et doit pouvoir tout changer (demande du 22 septembre 2026, après une version
où la vitesse avait été rendue par ffmpeg).

### 2. Les pistes

| Piste | Contenu | Volume |
|---|---|---|
| `main` | le clip emprunté du hook, seul | 1.00 |
| `incrustation` | **tous les plans face caméra, avec leur propre son**, bord à bord | 1.00 |
| `inserts` | les animations en surimpression, **chacune encadrée d'une copie de 0,6 s du plan face caméra** | **0** |
| `musique`, `musique2` | morceau 1 puis morceau 2 | 0.11 / 0.24 |
| `sfx`, `sfx2`, `sfx3` | riser / whoosh / impact | 0.19 / 0.07 / 0.34 |
| `fx1` à `fx4` | les sons des inserts, un par un | `sons-des-inserts.json` |
| `subtitle` | le SRT, face caméra seulement | |

**Jamais de piste voix séparée.** Une version posait les rushes à volume 0 et leur son sur une
piste `voix` : CapCut ne l'affichait pas, Mohamed ne retrouvait plus sa voix, et une coupe sur
l'image ne suivait plus le son. La voix reste dans le plan.

**Les orientations.** Les rushes sont horizontaux (3840×2160), le clip emprunté vertical
(720×1280). Le vertical remplit la toile à l'échelle 1, un rush horizontal à l'échelle **3,16**
(`scale_x` / `scale_y` sur `add_video`). Importer tel quel, jamais de recadrage ffmpeg.

### 3. Quand couper — les cuts serrés

Transcrire chaque prise mot à mot (faster-whisper `medium`, `language='fr'`,
`word_timestamps=True`, CPU int8 ; VAD et CUDA ne marchent pas sur cette machine). Puis :

- début du plan = **premier mot − 0,12 s**, fin = **dernier mot + 0,15 s** ; aucune respiration ;
- quand un insert entre sur le premier mot d'un plan, le plan commence **sur le mot** (l'insert
  couvre l'image, seul le son compte) ;
- l'insert entre sur le premier mot de sa ligne et sort sur le mot où la tête revient ;
- la chute garde deux secondes de tenue ; le turn n'a pas de silence dans la prise.

Les cues des inserts se recalent sur ces timestamps **avant** le rendu final (`inserts-youbud`).
Mohamed parle plus vite que le brief : la créatine est passée de 45 s à 34 s d'inserts.

**Tout ce qui est face caméra est accéléré ×1,08**, voix et image, et les inserts avec, pour
rester calés sur la voix. 1,15 a été jugé trop rapide ; 1,08 est la bonne valeur. **La vitesse
se règle dans CapCut, jamais dans le fichier** : Mohamed veut pouvoir la changer, et un rush
accéléré par ffmpeg ne se rattrape plus. Sur chaque `add_video` : le fichier **à vitesse
normale** (`rushes/normalise/`, `inserts/vitesse-normale/`), `speed=1.08`, et `start`/`end`
lus dans ce fichier, donc **× 1,08** par rapport aux temps de la transcription accélérée.
L'emprise timeline vaut `(end − start) / 1,08`, les positions ne bougent pas, et les timecodes
du montage (sous-titres, sons, images clés) restent ceux de la timeline accélérée. Le clip
emprunté du hook reste à `speed=1`. Le plus sûr : partir de la durée timeline voulue et poser
`end = start + durée × 1,08`, pour que les clips voisins restent bord à bord.

Ne jamais pré-rendre la vitesse (`setpts`/`atempo`) : fait une fois, rejeté le 22 septembre
2026 — « tout doit être sur CapCut ».

**Le cadrage.** Mohamed est à 57 % de la largeur dans ses rushes 16/9. À l'échelle 3,16, le
rush se décale vers la gauche pour centrer sa poitrine : `transform_x` entre −0,42 et −0,51 selon
la prise (unités : ±1 = demi-largeur de toile ; 1 px source = 0,889 px de toile). Mesurer avec
une grille à 10 % sur une image de chaque prise, les copies-voisines prennent le même décalage.
Vertical : impossible sans bande noire à 3,16, il faut monter l'échelle.

### 4. Les transitions — celles de CapCut, pas des images clés

Mohamed veut les transitions de CapCut : tête → animation `Left` (l'image part vers la gauche),
animation → tête `Right`, 0,3 s. Une transition CapCut ne joue qu'**entre deux clips voisins
d'une même piste**, et l'insert est en surimpression. Le voisin est donc fabriqué : sur la piste
`inserts`, avant et après chaque insert, **une copie de 0,6 s du plan face caméra** (même rush,
même `start`, volume 0, échelle 3,16), invisible à l'écran parce qu'elle montre exactement ce
que le rush montre dessous. La transition se pose sur le clip qui **précède** la coupe : `Left`
sur la copie d'avant, `Right` sur l'insert. Deux inserts qui s'enchaînent : rien entre eux.
**Un whoosh sur chaque coupe, sans exception, et qu'on l'entende** : rush → rush, rush →
insert, insert → insert, la reprise de la musique, la fin. 0,2 s avant la coupe, **à 0.35**. Le
0.09 du tableau vient d'un montage où la voix n'était pas normalisée ; sous une voix à −16 LUFS
il est inaudible, et Mohamed a demandé « un vfff » sur chaque transition. Les whoosh internes des
inserts passent à 0.25 pour la même raison.

Ne pas remplacer par des images clés de position sur l'insert : « transitions bizarres »,
rejetées.

**Le plan de présentation.** Quand Mohamed dit « Lui, c'est James Smith », on ne voit ni
Mohamed ni la vidéo de James : **un insert HyperFrames de 1,6 s** (`I0-james-smith`), un
bonhomme Lucide `person-standing` avec la tête détourée de James en emoji et la pilule « James
Smith », qui bascule à mi-course (le bonhomme file à gauche, le logo NOW arrive de la droite,
pilule « NOW »). En surimpression sur `inserts`, précédé d'une copie-voisine avec `Left`, et
lui-même avec `Left` vers l'insert qui suit sur « Avec NOW ». Le glissement finit sur « Lui ».

### 5. Le zoom — un seul par plan

Le motif voulu, après deux versions rejetées : **un seul zoom par plan face caméra**. Zoom avant
sur 2 à 3 s, puis retour à la normale, puis on garde. Sur le plan suivant, l'inverse : on arrive
zoomé, un zoom arrière, puis un zoom avant, puis on garde. Jamais plusieurs coups de zoom
d'affilée, jamais de reset sec répété. Base 3,16, zoom **+10 %** (3,48), punch-in du turn
**+15 %** (3,64), courbes linéaires (ease in à la main si on veut). Le zoom se coupe aux fins de
mots.

- premier plan : 3,16 → 3,48 sur la première phrase, retour à 3,16 avant la copie-voisine ;
- retour après un insert : la copie-voisine arrive zoomée (3,40) et zoome en arrière, le rush
  continue le zoom arrière derrière ;
- **le turn** : la copie-voisine commence le zoom (3,16 → 3,33), le rush monte à 3,64 sur « Et
  le plus fou dans tout ça », retour à 3,16 sur « c'est qu'ils peuvent encore les vendre », et
  ça reste normal ;
- la chute : arrive zoomée (3,48), zoom arrière sur 2,5 s, un zoom avant sur 2,5 s, puis on garde.

Pendant une fenêtre de copie-voisine, le rush et la copie ont la même échelle au même instant,
sinon ça saute à la coupe.

**Où écrire une image clé.** CapCut stocke `time_offset` en **temps source absolu**, en
microsecondes du fichier, pas en décalage depuis le début du plan : pour un zoom à l'instant
`t` de la timeline, sur un plan qui commence à `tgt_start` avec `source_start` et `speed`,
`time_offset = source_start + (t − tgt_start) × speed`. Vérifié sur des projets faits à la
main dans CapCut : les offsets tombent entre `source.start` et `source.end`, au-delà de la
durée du plan. Un offset relatif au plan met le zoom en avance de `source_start` (la version
`…92403…` de la créatine avait ce défaut).

C'est la technique documentée par CapCut (image clé d'échelle au début de la phrase, seconde
image clé 2 à 6 s plus tard à +3 à +12 %, ease in), utilisée avec un reset net au lieu d'un
retour progressif.

### 6. Les musiques et leur bascule

Morceau 1 **Careless Wandering** à 0.11, entre sur la coupe qui sort du hook et **s'arrête net
sur la coupe du turn**. Pendant « Et le plus fou dans tout ça » il n'y a plus de musique : **le
vent** (`rizer-windy`, les 1,4 dernières secondes, 0.19) monte sous la phrase. Morceau 2
**Particle Emission** à 0.24 **repart sur le mot suivant** (« c'est qu'ils peuvent… ») avec un
impact à 0.34, en même temps que le retour à la normale du zoom. Whoosh 0,2 s avant la coupe et
0,2 s avant la reprise. Fin de la vidéo : whoosh, impact, la musique s'arrête. Fichiers dans
`C:\Users\melmdim\Downloads\Audio`, copiés dans `musique/`.

### 7. Le son des inserts

Les compositions décrivent leur son ; dans CapCut **l'insert est à volume 0 et chaque son est
reposé à part**, exporté en `sons-des-inserts.json` (temps = début de l'insert + `data-start`,
durée, `data-media-start`, volume × 0,8), réparti en glouton sur `fx1`, `fx2`… sans
chevauchement. **Pas huit réussites d'affilée** : une liste qui se remplit prend des bulles
(`bloop` en montant à peine) et une seule `correct` sur le dernier. **Un objet qui tourne a son
son** (le logo NOW : `rizer-mettalic` 0,9 s à 0.15), **un objet qu'on secoue a son cliquetis**
(le pot : six `soft_click` à 0,09 s d'écart, 0.3). Ces sons s'écrivent d'abord dans la
composition, puis passent par l'export.

### 8. Ce que le MCP ne sait pas faire

- **`add_video_keyframe` cherche le segment par le temps** : une image clé pile sur une coupe
  atterrit sur le segment qui finit là. Ne pas l'utiliser : sauvegarder, puis écrire les
  `common_keyframes` dans `draft_info.json` (`KFTypeScaleX` + `KFTypeScaleY`, `time_offset`
  **en temps source absolu**, voir la règle du § 5, gabarit copié d'une image clé existante).
  CapCut Windows convertit `draft_info.json` en `draft_content.json` à l'ouverture et **garde**
  ces images clés et les transitions (vérifié).
- **Refaire une version** ne passe pas par 130 appels MCP : relire le `draft_content.json` de
  la version précédente (segments, `source_timerange`, `target_timerange`, `clip`, transitions,
  images clés, pistes audio), retrouver chaque fichier source par son md5 dans `assets/`, et
  rejouer le tout dans un script avec le venv du MCP (`add_video_track`, `add_audio_track`,
  `add_subtitle_impl`, `save_draft_impl(draft_id, draft_folder=…)` importés en direct), en ne
  changeant que ce qui change. CapCut recale les segments sur ses images (30 i/s) à l'ouverture :
  les valeurs relues sont déjà alignées.
- `add_video` n'a pas d'animation d'entrée ni de sortie (seul `add_image` en a).
- Un `.mp4` posé avec `add_audio` n'apparaît pas dans CapCut.
- Les cartons texte ne se positionnent pas ; les fondus de musique non plus. À la main.
- Transitions valides : `Left`, `Right`, `Pull_in`, `Pull_Out`, `Slide`, `Wipe_Left`,
  `Wipe_Right`, `Mix`, `Dissolve` (liste complète :
  `D:\editingvideo\tools\VectCutAPI\venv-capcut\Scripts\python.exe -c "import pyJianYingDraft as d; print([a for a in dir(d.CapCut_Transition_type) if not a.startswith('_')])"`).

Les noms de transitions valides du MCP se listent depuis son venv :
`D:\editingvideo\tools\VectCutAPI\venv-capcut\Scripts\python.exe -c "import pyJianYingDraft as d; print([a for a in dir(d.CapCut_Transition_type) if not a.startswith('_')])"`.
Utiles : `Left`, `Right`, `Pull_in`, `Pull_Out`, `Slide`, `Wipe_Left`, `Wipe_Right`, `Mix`, `Dissolve`.

---

## Le format simple dans CapCut (2 octobre 2026) — les vidéos « Tes questions »

Quatre vidéos tournées en une prise chacune (J2, J4, J5 bis, J6 bis), montées de A à Z dans CapCut à la
demande de Mohamed : « je préfère que tu fasses le editing sur CapCut… comme ça moi je peux venir et ajouter
tout ce que j'ai envie », « sans beaucoup d'animation… quand je dis animation, je parle aussi des transitions
entre moi full écran et moi animé ». La méthode de la créatine reste la base (voix dans le plan, ×1,08 dans
CapCut, rien de rendu sauf la voix) ; voici ce qui change.

**Les trois temps, deux coupes franches.** A (lui en grand) → B (l'animation en haut, lui en bas) → A. Pas de
transition CapCut, pas de copie-voisine : une coupe, et un `air-woosh` à **0.2** dont le pic (0,71 s dans le
fichier) tombe sur la coupe. Ni musique, ni riser, ni impact.

**Le cadre B sans rien rendre.** Sur la piste `main`, les clips du plan B ont une autre échelle et une autre
position que ceux des plans A : échelle **1,9**, décalés vers le bas pour que le haut de ses cheveux soit
~130 px sous la couture (`transform_y` ≈ −0,40 ; l'image dépasse au-dessus, cachée par l'animation). L'animation
1080 × 960 est sur une piste au-dessus (`relative_index=1`), échelle 1, `transform_y=+0.5`, volume 0, ×1,08.
Cadre A : échelle 3,16, `transform_x = (1920 − x_bouche) × 0,889 / 540`, et un zoom lent de 6 % sur tout le plan
(images clés d'échelle sur chaque morceau, en temps source absolu).

**Une prise, des morceaux.** La prise entière est importée une fois ; chaque morceau gardé est un clip
(`start`/`end` dans la prise, `speed=1.08`). Les coupes viennent de `silencedetect` (−34 dB, 0,12 s ; on garde
0,05 s avant un mot, 0,08 s après), chaque morceau dure un nombre entier d'images de timeline (0,036 s de source
par image), et chaque clip est raccourci de 3 µs, sinon l'arrondi à la microseconde fait se chevaucher deux
voisins et la bibliothèque refuse (`SegmentOverlap`).

**Réécouter la piste coupée.** Le son des morceaux recollés est transcrit à nouveau (large-v3) : on vérifie
qu'aucun mot n'est mangé, et ses temps de mots sont directement ceux du montage (÷ 1,08 pour la timeline).
C'est aussi de là que viennent les repères des animations (temps du mot − début du plan B) et les sous-titres.
Seul large-v3 est en cache sur la machine : `medium` demanderait un téléchargement.

**Ce que la prise dit, pas ce que le texte disait.** Comparer la transcription au prompteur avant de couper :
un fait dit faux se retire (J4 : « pendant six semaines, dix personnes » au lieu de « pendant dix ans, des
personnes » ; la preuve entière est sortie), un nom faux aussi quand la coupe tient (J6 bis : « l'agence de
sécurité nationale », retirée : « L'Anses a fait le bilan… »). Essayer la coupe sur le son seul et la réécouter
avant de l'écrire. Une nuance perdue (« personne » pour « presque personne ») ne se rattrape pas : le dire.

**Les lèvres.** Sur ces prises OBS, le son arrive ~0,05 s avant la bouche (mesuré sur un p et un m, trois
prises) : corrigé dans la passe de normalisation (`adelay=50:all=1,loudnorm=…`, image copiée telle quelle).

**Le texte.** Le titre (carte blanche) sur le hook seulement : les animations montent jusqu'à y ≈ 230 et le
couvriraient. « Mohamed » puis « Abonne-toi » sur l'appel. Deux pistes de sous-titres, parce qu'une piste a une
seule position : `sous-titres A` à `transform_y=−0.42`, `sous-titres B` à `−0.045` (juste sous l'animation).
Blocs de 26 caractères au plus, phrase par phrase, sans mot orphelin ; ils écrivent ce qu'il dit.

**Le nom du projet.** `update_cache("TQ 04 - …", draft.Script_file(1080, 1920))` avant le premier ajout : le
dossier du projet porte ce nom, et CapCut l'affiche tel quel.

**Les aperçus.** `hyperframes snapshot` n'est pas nécessaire : un aperçu ffmpeg (la prise mise à l'échelle, posée
sur une toile 1080 × 1920, l'animation par-dessus) suffit pour vérifier les deux cadres avant d'écrire.

Les scripts : `D:\editingvideo\tes-questions\outils\` (`transcrire4.py`, `couper.py`, `recaler.py`,
`construire.py`, `fiches.py` ; `construire.py` se lance avec le Python du MCP). Une fiche `MONTAGE.md` par vidéo
dans `D:\editingvideo\tes-questions\<dossier>\`.

**La version 2, le soir même.** Mohamed a ouvert les projets (« c'est très bien ») et demandé : des sous-titres à
l'horizontale, un riser et le boom sur le hook, la musique Garden of Eden, son son d'erreur, le titre en ZY Elegant.

- **`vertical=False` sur `add_subtitle_impl`.** Son défaut est `True`, et il écrit le texte de haut en bas
  (`typesetting: 1`) : les sous-titres de la créatine avaient le même défaut. Il préfère d'ailleurs les légendes
  automatiques de CapCut, qu'on ne peut pas lancer de l'extérieur : le lui dire, et laisser les nôtres supprimables.
- **Riser + boom sur les deux coupes, plus de souffle.** `rizer-windy.mp3` lu de (2,75 − 1,75) à 2,75 s, fini sur
  la coupe, à 0.2 ; `impacts.mp3` lu depuis 0,2 s, posé 0,15 s avant la coupe, à 0.3.
- **La musique entre les deux booms** : Garden of Eden (−10 LUFS) depuis 1,0 s du fichier, à **0.08** ; elle entre
  sur le premier boom et s'arrête net sur le second. Rien sous le hook ; la fin se dit dans le silence (« riser,
  boom, avant que je puisse parler, comme ça t'as un silence à la fin »).
- **Le son d'erreur** (`erreur-douce.mp3`, attaque à 0,24 s du fichier : lu de 0,2 à 0,75 s, posé 0,04 s avant le
  repère, à 0.3) remplace le clic sur chaque croix d'une animation.
- **Le titre en ZY Elegant**, dès la première image (c'est aussi la couverture) : capitales sans accents (la police
  n'a ni É ni È), le début en jaune (1, 0.784, 0), la suite en blanc, taille 12, contour et ombre. La police n'est
  pas dans `Font_type` : poser le texte en Inter, puis, après `save_draft_impl`, réécrire `content.styles` (deux
  plages) avec `font = {id: "176684093", path: …/Cache/effect/176684093/…/ZY Elegant.ttf}` et `font_path`.
  La police est large (1 400 px pour 23 capitales à 100 px) : des lignes de 15 caractères au plus.
- **Ne jamais réécrire un projet ouvert** : une nouvelle version porte un nouveau nom (« TQ 02 v2 - … »).
- Une icône seule ne dit pas ce qu'elle représente (« on ne comprend pas le téléphone ») : l'appli de calories se
  dessine avec son écran (un compteur en anneau « kcal », des repas notés et cochés).

**La version 3 : ses propres réglages, LA RÉFÉRENCE.** Mohamed a retouché « TQ 04 v2 » dans CapCut « exactement comme
j'aime », puis demandé de faire pareil partout et de l'écrire ici. Relevé dans son `draft_content.json`
(`outils/lire_projet.py "<projet>"` affiche un projet piste par piste) ; ça **remplace** ce que disent plus haut la
version 1 (pas de transition, souffle à 0.2) et la version 2 (riser sur les deux coupes, musique entre les booms à 0.08).

| Élément | Où | Réglage |
|---|---|---|
| **Riser du hook** | de 0,07 s à (boom 1 + 0,37 s), sous sa question | `rizer-windy.mp3` lu depuis 1,00 s, 1,75 s au plus, volume **0.2** |
| **Boom 1** | démarre 0,04 s avant le **dernier mot de la question du hook** (« repris ? ») : le pic tombe dans le mot | `impacts.mp3` lu de 0,2 à 1,7 s, volume **0.3** |
| **Musique** | démarre 0,20 s après le boom 1, court sous TOUTE la vidéo, s'arrête 0,97 s après le boom 2 | Garden of Eden lu depuis 1,23 s, volume **0.02**, fondu de sortie **0,83 s** |
| **Riser de fin** | de (boom 2 − 1,60 s) à (boom 2 + 0,13 s), sous la dernière phrase de la conclusion | même fichier, depuis 1,00 s, volume 0.2 |
| **Boom 2** | démarre 0,07 s avant « Moi, c'est Mohamed » : l'appel se dit dans le silence | volume 0.3 |
| **Transitions** | sur la piste `main`, sur le clip qui précède la coupe | `Left` 0,2 s vers l'animation, `Right` 0,2 s pour revenir |
| **Souffle** | sur ces deux coupes, posé 0,26 s avant (pic sur la coupe) | `air-woosh.wav` lu de 0,43 à 1,10 s, volume **0.11** |
| **Titre** | de 0 à (fin du hook + 0,07 s) | ZY Elegant, jaune puis blanc, **sans contour**, ombre douce : opacité 0,7, distance 2, flou 0,7 |
| Clics, erreur, sous-titres, appel | inchangés | 0.6 ; 0.3 |

- Quand le hook tient en une seule phrase (J5 bis), son dernier mot est juste avant la coupe : le boom et le souffle se
  suivent à 0,15 s. Quand la question est très courte (J6 bis, « …lundi ? »), le boom va sur le mot fort qui suit (« Arrête. »).
- **Le fondu de la musique** ne passe pas par `add_audio_track` : après `save_draft_impl`, ajouter à
  `materials.audio_fades` un `{type: "audio_fade", fade_type: 0, fade_in_duration: 0, fade_out_duration: 833333}` et
  son `id` dans `extra_material_refs` du segment.
- **L'ombre du titre** : « réduis les shadows… plus doux et plus beau ». Dans `add_text_impl` : pas de `border_width`,
  `shadow_enabled=True, shadow_alpha=0.7, shadow_distance=2, shadow_smoothing=0.7`. (Dans le JSON : `diffuse` =
  lissage ÷ 6, `shadow_smoothing` = lissage × 3.)
- **Retoucher un projet qu'il a modifié** : jamais le réécrire. `outils/adoucir_titre.py` montre comment : CapCut
  fermé, une sauvegarde, puis la même modification dans toutes les copies du contenu (`draft_content.json`, `.bak`,
  `template-2.tmp`, à la racine ET dans `Timelines/<id>/`). Les projets qu'il n'a pas touchés se réécrivent sous le
  même nom, CapCut fermé.

**La version 4 : les coupes, la carte façon Kallaway, les sous-titres mot à mot.** Après avoir regardé la version 3,
Mohamed a relevé une respiration et un mot buté dans J6 bis (« tout ça doit être corrigé de base »), demandé des
sous-titres « qui animent réellement », « un effet Kallaway », et montré dans CapCut une carte arrondie autour de lui.

- **Les respirations se retirent au second passage, jamais en baissant le seuil.** Il tient le micro près de la bouche :
  ses respirations ont des crêtes au-dessus de −34 dB et `silencedetect` les garde. Une détection sur l'énergie (RMS)
  les attrape, mais mange les syllabes faibles (un « je », la fin de « application ») : essayée, abandonnée. La bonne
  méthode (`couper.py`) : couper comme avant, transcrire la piste coupée, puis **réécouter seul chaque trou ≥ 0,18 s
  entre deux mots**. Si Whisper n'y entend rien, ou invente un générique (« Sous-titrage ST' 501 »), c'est un bruit :
  on le retire. Puis on retranscrit et on **vérifie que les deux mots voisins sont toujours là, côte à côte** ; sinon
  le retrait est annulé. Un dernier contrôle compare les mots de la prise et ceux de la piste coupée.
- **Un mot buté** (« r… rien ») : Whisper l'efface de sa transcription. Le chercher dans les mots anormalement longs
  du rapport de `couper.py`, trouver le mot net en réécoutant de petits extraits (`essai_coupe.py`), l'écrire dans
  `hors`.
- **Le cadre B façon Kallaway** : `recaler.py` écrit `index.html`, le cadre entier en 1080 × 1920 (la toile partout,
  l'animation descendue de 100 px, le rebord de la carte), rendu en `animation/<nom>-cadre.mp4`. Dans CapCut : ce
  rendu en plein cadre sur la piste `animation` ; **lui sur une piste au-dessus, `carte`**, les mêmes clips que `main`,
  muets, avec un masque rectangle arrondi (60, 1240, 960 × 620 ; `roundCorner` 0.14 ; dans le repère du clip :
  largeur et hauteur en fraction du clip, centre en demi-clips, **y vers le haut**). Le masque se copie du gabarit
  `outils/masque-rectangle.json` (celui qu'il a posé) dans `materials.common_mask`. Les clips B de `main` restent
  dessous : ils portent la voix. Pour cacher la toile d'une sous-composition : `display: none !important` (le
  compilateur préfixe les règles des sous-compositions, une règle simple ne gagne pas toujours).
- **Les repères des animations se calculent** : chaque repère est attaché à un mot (`recaler.py`, `ANIMS`) ; après un
  nouveau découpage, relancer le script, pas de chiffres à la main.
- **Les sous-titres mot à mot** : deux ou trois mots et seize caractères au plus par groupe, jamais à cheval sur une
  phrase ; **un texte CapCut par mot**, qui contient tout le groupe. **Depuis le 3 octobre : le groupe entier est
  affiché en blanc dès son premier mot, seul le mot en cours est jaune, et il n'y a AUCUNE animation d'entrée.**
  Mohamed : « the animation we use is buggy, the text is coming from the sky in a weird way. I just want a really
  simple animation of the yellow on the main text, that's it, nothing more. » La version d'avant (les mots à venir
  transparents, et `Pop_Up` sur le premier mot de chaque groupe) est refusée : ne plus poser d'animation de texte
  CapCut sur un sous-titre, quelle qu'elle soit. Inter Black 11, contour 40. En A : y = 1320 ; en B : y = 1140,
  entre l'animation et sa tête. « petit déjeuner » s'écrit « petit-déjeuner », en un seul mot, pour qu'un groupe
  ne le coupe pas. Les corrections de transcription sont des règles par suite de mots (`outils/regles.json`), pas
  des index : les index changent à chaque découpage. **Relire le texte des sous-titres groupe par groupe avant de
  livrer** (il le demande : « check if the text on the caption is correct »).
- **Corriger les sous-titres d'un projet déjà écrit, sans le reconstruire** : `outils/sous_titres_simples.py`
  (`--essai` pour lire sans écrire) ne touche qu'à la piste « sous-titres », dans toutes les copies du contenu, et
  garde donc ce que Mohamed a retouché à la main. CapCut ouvert : `outils/quand_capcut_ferme.sh python
  sous_titres_simples.py` attend la fermeture et applique.
- **« Les sous-titres de CapCut »** : sa reconnaissance automatique ne se lance pas de l'extérieur. Les nôtres sont
  du texte CapCut ordinaire, qu'il peut retoucher ou remplacer par les siens (Captions → Auto captions).
- **Incrustés ou non, sur Instagram ?** Depuis juillet 2026, Instagram double et sous-titre les Reels dans d'autres
  langues, français compris ; il traduit la voix et ses propres sous-titres, jamais un texte incrusté. Tant que le
  public visé est francophone : les mêmes sous-titres incrustés partout. Le jour où il vise l'étranger : un second
  export pour Instagram, piste « sous-titres » masquée. À lui de trancher ; ne pas décider à sa place.
- **CapCut fermé pour écrire** : `construire.py` refuse de tourner sinon. Une sauvegarde des projets avant chaque
  réécriture (`sauvegardes/`).

**La version 5 : la carte collée en bas, la tête qui en sort.** La carte flottante de la version 4 était une
mauvaise lecture de son masque : « tu m'as mis dans un petit cube, mais ma tête doit sortir du cube en haut, et le
cube doit être collé au bottom […] comme si je rentre dans la vidéo, prenant 1/3 du cadran en bas », « tu n'as pas
utilisé la fonctionnalité de cut de CapCut pour hide le background ». C'est le montage qu'il avait fait lui-même
dans son projet « VIDEO3_DEFICIT » (à relire avant de toucher au cadre B) :

- **Trois couches au-dessus de `main`** : `animation` (le rendu `-cadre.mp4`, la toile et l'animation seules, sans
  carte dessinée) ; `carte` (la prise masquée en rectangle arrondi, de y = 1620 jusque **sous** l'image pour qu'il
  n'y ait pas de coins en bas, 36 px de marge de chaque côté, `roundCorner` 0.26) ; `tete` (la même prise, au même
  cadrage, **détourée par CapCut**, sans masque). Les deux dernières sont muettes ; la voix reste sur `main`.
- **Le détourage est un réglage du matériau**, pas du clip : la piste `tete` lit une copie du matériau de la prise
  avec `matting = {"flag": 3, "path": "", …, "custom_matting_id": <GUID>}` (la forme relevée dans ses projets ;
  3 = suppression automatique). CapCut calcule les masques à l'ouverture et les range dans `matting/<md5 du chemin
  de la source>` du projet. Si le fond n'est pas retiré : sélectionner les clips de `tete`, Vidéo → Supprimer
  l'arrière-plan → Suppression automatique.
- **Le cadrage se calcule** : le bas de la prise sur le bas de l'image, le haut de ses cheveux à y = 1295 (lui en
  entier dans le tiers du bas), sa bouche au milieu ; l'échelle sort de là (≈ 1,34 à 1,42). Cheveux → bouche : 720 px
  de la source. Le haut de la carte passe au menton.
- **Ne jamais renommer le dossier d'un projet écrit** : les médias sont copiés dans `assets/` du projet et référencés
  par leur chemin complet. Un dossier renommé = tous les médias perdus (J6 bis, « ne fonctionne pas »). CapCut tronque
  un nom à 50 caractères quand Mohamed le renomme : relire `root_meta_info.json` et écrire sous le nom qu'il y trouve.
- **Un aperçu fait hors de CapCut ne montre pas son détourage** : GrabCut laisse des bouts de décor, et il l'a pris
  pour le résultat (« le découpage ne fonctionne pas bien dans tes screens »). Le dire dans le message, ou ne pas
  montrer de détourage approché.

**La version 6 : la carte monte à la racine des cheveux.** Après avoir vu le détourage de CapCut dans la version 5
(la carte au menton, toute la tête détourée) : « on découpe trop bas, on doit découper juste à côté des cheveux, pas
toute la tête, genre 20 pixels autour des cheveux, pas plus, car le découpage n'est pas ouf ».

- **Le détourage de CapCut est médiocre : en montrer le moins possible.** Son visage reste DANS la carte, avec le
  vrai fond. Le haut de la carte passe à la racine de ses cheveux (y = 1375) ; seul le dessus de sa chevelure sort.
- **La piste `tete` porte deux réglages** : le détourage (sur le matériau) et un masque rectangle arrondi
  (`roundCorner` 0.35) qui limite ce qu'on en voit à une boîte de 20 px autour de ses cheveux, 40 px de
  chevauchement dans la carte (là, les deux pistes montrent la même image, le bord du détourage ne se voit pas).
- **Ses cheveux se mesurent** (`outils/mesurer_cheveux.py` → `travail/cheveux.json`) : trois images par seconde sur
  tout le plan B, la plus grande tache sombre au-dessus de ses sourcils ; on garde la médiane du haut (elle fixe
  l'échelle : cheveux à y = 1295, bas de la prise à 1920) et l'enveloppe gauche / droite / haut (elle fixe la boîte,
  il bouge en parlant). La racine des cheveux au milieu du front tombe à y ≈ 1370 dans les quatre prises.
- **L'aperçu** (`outils/apercu_v6.py`) appelle `cadrages()` de `construire.py` : mêmes chiffres que le projet. Il
  porte la mention « PAS le détourage de CapCut ».
- **Écrire quand CapCut se ferme** : `outils/ecrire_quand_ferme.sh <dossier de sauvegarde>` attend la fermeture,
  sauvegarde les projets, puis lance `construire.py`. Lui dire de ne pas rouvrir CapCut avant le message de fin.

**L'export, le rangement, et ce qui ne va pas encore (2 octobre, 23 h 30).**

- **Exporter** : `outils/capcut_export.ps1 -x <x> -y <y>` sur la vignette du projet (lire d'abord une capture de
  l'accueil : l'ordre des vignettes change à chaque ouverture). Le script vérifie le nom du projet dans le titre de la
  boîte « Export-… », garde les réglages d'export de Mohamed (4K, HEVC, mov, `D:\exports`), attend que le fichier ne
  grossisse plus, ferme par « Close ». La fenêtre doit être maximisée (`capcut_ui.ps1 maximiser`). Jamais pendant
  qu'il tape au clavier ; jamais « Share », jamais « Renew ».
- **Ranger** (`outils/classer_exports.py`, puis `srt_youtube.py`, `descriptions.py`, `a_publier.py`) : deux exports
  par vidéo, **déplacés** de `D:\exports` dans `video/done/<dossier>/renders/` (ignoré par git ; Mohamed, 3 octobre :
  « mets-les dans renders ») : `<Titre> - TikTok Instagram (avec sous-titres).mov` et `<Titre> - YouTube (sans
  sous-titres).mov` ; `sous-titres YouTube.srt` à la racine du dossier. Les exports dépassés vont à la corbeille
  (`recycler.ps1`), jamais supprimés pour de bon, et seulement ceux des vidéos en cours. L'index
  `video/done/À publier.md` liste ce qui est prêt dans l'ordre de la série ; le dossier passe de `video/to-edit/` à
  `video/done/`, avec `TEXTE.md` (`outils/textes.py`) et `DESCRIPTION.md` (`outils/descriptions.py`, tiré de la
  section « La légende » du SCRIPT et de ses sources ; il dit quel fichier va sur quelle plateforme).
- **Les animations en cartes et en barres sont refusées** (« ultra simples ») : le cadre B montre une scène dessinée
  qui se transforme, un plan par phrase. Storyboard d'abord, construction après son choix.

- **Une animation explique, elle ne décore pas** (sa réponse au storyboard, le même soir) : chaque chose porte son
  chiffre (Corps 2 000, Appli 1 700, Déficit −300, +300, 0), on lit où on en est sans le son, et chaque phrase a son
  geste sur son mot. La référence : `video/done/02-mange-peu-maigris-pas/compositions/B1-les-petits-bouts.html`.
  Un chiffre qu'il n'a pas dit et qu'aucune étude n'a mesuré est un exemple : lui demander avant.

- **Un aliment à l'écran est une photo détourée**, vue de dessus, jamais une icône (3 octobre : « de vrais aliments,
  pas des emoji »). Ce sont des **assets Higgsfield** : générés (`gpt_image_2_5` sur fond gris uni, 0,25 crédit
  l'image), détourés (`remove_background`), rangés dans la banque `D:\editingvideo\tes-questions\aliments\` par
  `outils/aliments.py`, copiés dans `assets/img/aliments/` de chaque vidéo. La banque, le prompt, le coût, ce qu'on
  ne génère pas et la façon de poser une photo dans une composition : skill `inserts-youbud`, § 7. Dans CapCut,
  rien à faire : les photos sont dans le rendu `-cadre.mp4`, pas sur une piste.

**Deux versions par vidéo, et la publication (3 octobre au soir).**

- **Avec sous-titres** (TikTok, et Instagram tant que le public est francophone) et **sans sous-titres** (YouTube, qui
  reçoit `sous-titres YouTube.srt`, les affiche et les traduit). La version sans s'exporte en retirant la piste
  « sous-titres » le temps de l'export : CapCut fermé, `pistes.py sans-sous-titres` ; exporter ; CapCut fermé,
  `pistes.py restaurer <sauvegarde>`. Le titre et les pastilles « Mohamed », « Abonne-toi » restent.
- **Pas de sous-titre qui répète le titre pendant le hook** : il les retire à la main ; `construire.py` les saute.
- **Avant d'exporter** : `pistes.py retirer-essais` (un modèle de texte laissé avec « The quick brown fox » sort dans
  la vidéo), et dans la boîte d'export, « Sync exported videos to space » décochée (le script le fait).
- **Après chaque export** : une image tirée du fichier (`ffmpeg -ss … -frames:v 1`), regardée, avant de classer.
- **`capcut_export.ps1 -tuile N -dejaFaits "TQ 02|TQ 04"`** : l'éditeur s'ouvre parfois sur l'autre écran, dans une
  fenêtre de 1919 × 1031 au lieu de 1936 × 1048 ; les boutons se comptent depuis le bord droit. `ffprobe` n'est pas
  dans le PATH de PowerShell : chemin complet dans le script.
- **Publier depuis ici** : TikTok seulement, par le connecteur Higgsfield (`tiktok_connect`, puis
  `tiktok_prepare_publish` ; la vidéo doit être hébergée chez Higgsfield, et c'est Mohamed qui valide le formulaire).
  Pas d'outil relié pour YouTube ni Instagram. Rien ne se relie ni ne se publie sans qu'il le demande.
