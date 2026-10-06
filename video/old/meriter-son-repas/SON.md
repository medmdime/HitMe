# Son — ce qui est déjà dans les rendus, ce qui reste à poser

Le son de ce reel se pose à **deux endroits**, et le partage n'est pas arbitraire.

| | Où | Quoi | Pourquoi là |
|---|---|---|---|
| **Cuit dans les rendus** | HyperFrames | les 45 sons d'éléments — pops, clics, dings, buzz, nappes | calés à la frame sur l'élément qui entre. Impossible à replacer à la main sans décalage |
| **À poser dans CapCut** | montage | musique, trio riser/whoosh/impact, sous-titres | ils **traversent les coupes** — un son cuit à la frame 0 d'un rendu ne peut pas déborder sur le plan caméra qui le précède, et c'est exactement ce débordement qui fait qu'une coupe passe |

Les volumes viennent tous du skill `montage-capcut` § 6. Ils sont **absolus** : ils se
recopient tels quels, quelle que soit la durée de la vidéo.

---

## 1. Ce qui est déjà cuit — 45 événements

`assets/sfx/` contient neuf fichiers. Chaque `<audio>` des compositions porte un `id`,
un `data-start` et un `data-volume`.

> ⚠️ **Un `<audio>` sans `id` est SILENCIEUX au rendu.** HyperFrames découvre les médias
> par leur `id` ; sans lui l'élément passe le lint mais disparaît de la piste son sans
> aucune erreur. C'est `hyperframes check` qui l'attrape — le lancer avant chaque rendu.

| Composition | Événements | Répartition |
|---|---|---|
| `01-decoupe-tdee` | 10 | 4 pops (la découpe) · 3 clics (les focus) · 1 buzz (le sport) · 1 nappe + 1 ding (le gros bloc) |
| `02-digestion-vs-sport` | 6 | 2 pops (les blocs qui se posent) · 3 clics · 1 ding sur le ×2 |
| `03-les-trois-leviers` | 19 | 1 pop · 4 clics · 9 clics doux (les listes) · 3 dings · 1 nappe |

**La densité, c'est la règle** : environ un accent toutes les 2 à 3 secondes
d'animation. C'est ce qui donne la sensation que le graphique « fonctionne ».

### L'escalade erreur / réussite

`wrong` et `correct` ne se posent jamais seuls, et **le volume monte à chaque fois**.
C'est une escalade, pas une répétition. Sur toute la vidéo :

```
01  le sport barré          wrong    0.24
01  le bloc des 70 %        correct  0.55
02  le ×2                   correct  0.75
03  le badge 300-500 cal    correct  1.00
03  le badge ×3 à ×10       correct  1.15
03  le levier 3, le dernier correct  1.37   ← la plus forte de la vidéo
```

**Ne pas égaliser.** Si les six sonnent pareil, la dernière ne veut plus rien dire.

### Remplacer les sons par les tiens

Les neuf fichiers de `assets/sfx/` sont des **placeholders** que j'ai synthétisés
(ffmpeg, ondes pures et bruit filtré). Ils sonnent propre mais génériques.

Pour mettre les tiens : **écrase les fichiers en gardant les mêmes noms**, puis
relance `npm run render:01 render:02 render:03`. Aucune ligne de HTML à toucher.

```
pop.mp3          un segment qui se pose        ~0,15 s
click.mp3        un élément qui entre          ~0,05 s
soft-click.mp3   rafales et rythmes de liste   ~0,05 s
correct.mp3      la réussite, le vert          ~0,5 s
wrong.mp3        l'erreur, le rouge            ~0,35 s
impact.mp3       le coup de basse              ~0,9 s   ← CapCut uniquement
riser.mp3        la montée avant une coupe     ~1,2 s   ← CapCut uniquement
air-woosh.mp3    le lissage de coupe           ~0,55 s  ← CapCut uniquement
drone.mp3        la nappe sous le gros bloc    ~2,2 s
```

Un rendu muet : supprime le bloc `<!-- SON -->` de la composition, rien d'autre.

---

## 2. Ce qui reste à poser dans CapCut

### La bascule musicale — la règle la plus importante

**Deux morceaux, pas un.** Le changement tombe sur le turn, à **0:46**, sur
« Enfin… pas vraiment » — et nulle part ailleurs.

```
morceau 1    0:07 → 0:47    volume 0.11
morceau 2    0:45 → 1:34    volume 0.24     fondu croisé ~1,5 s
```

Trois choses ne changent jamais :

1. **Le changement de musique EST le marqueur du turn.** Le spectateur ne l'analyse
   pas, il le ressent. C'est plus fort que n'importe quel bruitage.
2. **Le second morceau est environ deux fois plus fort que le premier.** L'énergie
   monte après la bascule.
3. **Le morceau 1 ne démarre pas à 0:00.** Les deux premières secondes sur le lit sont
   silencieuses : c'est le plan. La musique entre à plein volume sur la coupe du lit
   vers ta tête, à **0:05**.

Deux morceaux de la même famille, d'énergie différente. Pas deux genres opposés : on
doit sentir une montée, pas un changement de vidéo.

### Le trio riser → whoosh → impact — trois emplois, pas quatre

| Moment | Coupe | Sons |
|---|---|---|
| **0:05** | le lit → ta tête | riser (0.24) → whoosh (0.09) → impact (0.43) |
| **0:46** | le turn, sur « pas vraiment » | riser (0.24) → impact (0.43) + whoosh de part et d'autre |
| **1:22** | vers le dernier plan caméra | riser (0.24) → impact (0.43) |

Le riser démarre **~1 s avant** la coupe, l'impact tombe **sur** la coupe ou juste
après. Le riser annonce, l'impact confirme.

**Trois emplois dans toute la vidéo.** Une vidéo plus longue n'a pas droit à un
quatrième. Si tu le mets partout, il ne veut plus rien dire.

> **Le whoosh à 0.09, c'est le chiffre qui surprend.** Il n'est pas là pour s'entendre,
> il est là pour lisser la coupe. Un whoosh audible fait amateur ; un whoosh à peine
> perceptible fait que la coupe passe.

### Le scratch de vinyle

**Un seul, à 0:46, sur « Enfin… pas vraiment ».** Même coupe que la bascule musicale.
C'est le seul de toute la vidéo.

### Les volumes, à recopier

| Élément | Volume |
|---|---|
| Voix | 1.00 |
| Musique 1 (avant le turn) | **0.11** |
| Musique 2 (après le turn) | **0.24** |
| `air-woosh` | **0.09** |
| `riser` | 0.24 |
| `impact` | 0.43 |

La musique à 0.11, c'est presque rien. **La voix ne doit jamais avoir à lutter.**

---

## 3. Les pistes CapCut

| Piste | Contenu |
|---|---|
| V1 | b-roll du lit + face caméra (4 retours) + les 3 MP4 d'animation |
| A1 | voix |
| A2 | musique — deux morceaux, bascule à 0:46 |
| A3 | le trio riser/whoosh/impact + le scratch — 4 événements en tout |

Pas de piste V2 : il n'y a aucun clip emprunté dans cette vidéo.

Les MP4 d'animation **portent déjà leur son** : ne coupe pas leur audio en les
important, et ne baisse pas leur volume sous 1.00.

---

## 4. Les sous-titres

```
position Y = -0.85 (tout en bas) · blocs de 2 à 4 mots · ~un bloc toutes les 2 s
```

Trois règles :

1. **Aucun sous-titre sur le plan du lit ni sur le premier plan caméra.** Le premier
   bloc tombe au début de `01-decoupe-tdee`, à 0:17. Avant ça le spectateur regarde
   une chambre puis un visage, pas un texte.
2. **Des blocs de phrase, pas du mot à mot.** Le français a peu de monosyllabes : un
   découpage automatique clignote et fatigue. Regrouper à la main.
3. **Tout en bas.** Les animations occupent le centre du cadre et les compositions
   laissent la zone basse libre exprès.

Un export SRT automatique est un point de départ, pas un résultat.

---

## 5. Ordre de montage

1. Poser les plans vidéo bord à bord, sans son
2. Serrer chaque plan caméra au maximum — coupe 0,25 s avant le premier mot,
   0,35 s après le dernier. **Seule exception : le silence du turn, qui se garde.**
3. Poser la voix, vérifier la synchro avec les animations
4. Poser **les deux musiques**, caler la bascule sur le turn
5. Poser les trois signatures riser/whoosh/impact — trois, pas plus
6. Sous-titres, regroupés à la main
7. Passe de volumes complète avec les tableaux ci-dessus

Les 45 accents d'animation sont déjà en place : tu n'as rien à faire pour eux.
