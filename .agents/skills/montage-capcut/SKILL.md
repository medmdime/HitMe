---
name: montage-capcut
description: Monter un reel science-based façon Train Bloom dans CapCut — structure des pistes, grammaire sonore (bascule musicale sur le deuxième hook, signature riser/whoosh/impact, paires erreur/réussite, rafales de clics), volumes exacts, incrustation de la tête sur le hook, et style de sous-titres. Extrait d'un montage réel terminé, pas d'un modèle théorique. À charger dès qu'on assemble, sonorise ou sous-titre un reel de ce format dans CapCut.
---

# Monter un science-reel dans CapCut

**Portée.** Ce skill décrit le montage d'**un reel science-based au format Train Bloom** :
correction de croyance, mécanisme expliqué, alternance face caméra / animation, deux
mouvements séparés par un turn. Il ne se transpose pas tel quel à un vlog, un tuto, une
story ou un talking-head continu. Le script se fabrique avec le skill `science-reel` ;
celui-ci commence quand les rushes sont là.

**Comment lire les chiffres.** Tout est mesuré sur un montage fini de 71,4 s : 10 plans,
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
