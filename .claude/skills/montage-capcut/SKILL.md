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
- `speed` **n'est pas appliqué à l'emprise timeline** : un clip de 16 s à vitesse 1,34 occupe
  quand même 16 s et écrase le suivant. Ré-étalonner les fichiers en amont avec ffmpeg
  (`setpts`) plutôt que de compter sur ce paramètre.
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
