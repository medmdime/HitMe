# Brief · les cinq inserts de « Le plus calorique de ton assiette, ce n'est pas le dessert »

**Ce fichier se donne tel quel à un autre modèle**, avec le skill `inserts-youbud` chargé. Il dit ce que montre chaque animation, sous quelle phrase, sur quelle syllabe, avec quel son.

## Le contexte

Un reel vertical en français, format « mythe corrigé par un mécanisme », 1:38. Mohamed parle face caméra ; sa voix continue sous cinq inserts plein cadre. Le sujet : quand on fait attention, on enlève le dessert, alors que le plus calorique est déjà dans l'assiette. C'est le gras qu'on ajoute sans le voir (l'huile, le beurre, la sauce). Une cuillère à soupe de gras, c'est presque un dessert ; dans une assiette toute simple, le gras passe devant le poulet et vaut plus de deux desserts. La solution n'est pas de le supprimer, c'est de le compter une fois, à la cuillère.

**Le but des inserts : que quelqu'un qui regarde sans le son comprenne quand même.** Chaque insert montre une seule idée, avec des objets qu'on reconnaît : une cuillère, un pot de dessert, une assiette, un bol.

## Les règles, toutes tirées de `inserts-youbud`

- **La DA de YouBud** : recopie `video/creatine-gummies/compositions/components/youbud.css` et `kit.css` tels quels dans `video/assiette-pas-le-dessert/compositions/components/`, la police `Archivo.woff2`, `lucide.min.js` et les sons de `D:\editing_audio\` dans `assets/`. Les compositions de la créatine sont le modèle de structure.
- **Aucune bordure.** Cartes teintées, rebord plein en ombre dessous.
- **Des mots, jamais des phrases.** Un mot par élément (Huile, Beurre, Sauce, Sucre, Protéines, Gras, Estimé, Réel, Poulet, Riz, Légumes, Invisible), des symboles (≈, ×, >, ?, coche, croix), les noms propres (BURTON · 2006). **Aucun chiffre qui n'est pas dans la voix** : ni calories, ni grammes sur l'assiette. Les longueurs des barres parlent à la place.
- **Les objets sont dessinés à plat**, en divs et SVG : la cuillère à soupe, le pot de crème dessert, la bouteille d'huile, la plaquette de beurre, le flacon de sauce, l'assiette vue de dessus, le bol transparent, la poêle. Jamais de photo, jamais de marque.
- **Les couleurs de cette vidéo**, les mêmes dans les cinq inserts :

| Couleur | Ce qu'elle porte ici |
|---|---|
| jaune `--yb-yellow` | **le gras**, partout : l'huile, la colonne Gras, la piste Gras, la jauge Réel |
| violet `--yb-purple` | **le dessert** : le pot, à chaque apparition |
| rouge `--yb-red` | l'estimation fausse : la croix sur Estimé |
| vert `--yb-green` | le bon geste : la coche sur « une seule suffit » |
| teinte neutre, encre | tout le reste : Sucre, Protéines, Poulet, Riz, Légumes |

- **1080×1920, 30 i/s, fond plein.** Zone sûre : rien d'important dans les 12 % du haut ni les 20 % du bas.
- **Chaque élément entre sur sa syllabe.** Les temps ci-dessous sont estimés à 190 mots par minute, relatifs au début de l'insert : ils se recalent sur la prise réelle (faster-whisper, `word_timestamps`) avant les rendus finaux. 0,3 s de tenue à la fin.
- **Le son est dans la composition**, une piste `<audio>` par bruitage, volumes du tableau de `inserts-youbud` § 4. Index des pistes : I1 = 11 à 39, I2 = 41 à 79, I3 = 81 à 99, I4 = 101 à 139, I5 = 141 et plus.
- **Le b-roll généré passe par-dessus** ([[video/assiette-pas-le-dessert/TOURNAGE#G · Le b-roll généré, à côté de toi|TOURNAGE § G]]) : G1 à G3 couvrent les trois cartes Huile, Beurre, Sauce de I1, G4 couvre le tableau 2 de I2, G5 couvre le tableau 1 de I4. Rends quand même chaque insert entier : les tableaux couverts sont le repli si un b-roll est refusé. L'assiette dessinée de I4 reprend la disposition de G5 : poulet à gauche, riz à droite, légumes en bas.
- Fichiers : `compositions/I1-le-gras.html` … `I5-le-test-du-bol.html`, rendus dans `renders/`, et un `PROMPTS-DETAILLES.md` qui décrit ce qui est rendu.

---

## I1 · le gras · 7,5 s

**Voix dessous** : « C'est le gras : l'huile de cuisson, le beurre, la sauce. Une seule cuillère à soupe d'huile, c'est presque autant de calories que ce dessert. »
**Dispositif** : la liste qui se remplit, puis l'avant / après à la même échelle.

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:00 | « C'est le **gras** » | une grande carte jaune, le mot **GRAS** | `clicks` |
| 0:01,1 | « l'**huile** de cuisson » | la carte GRAS monte et rétrécit en titre ; dessous, première carte : une bouteille d'huile dessinée, le mot Huile | `soft_click` |
| 0:02,0 | « le **beurre** » | deuxième carte : une plaquette de beurre, Beurre | `soft_click` |
| 0:02,6 | « la **sauce** » | troisième carte : un flacon souple, Sauce | `soft_click` |
| 0:03,4 | « Une **seule** cuillère » | les trois cartes sortent ; à gauche, une cuillère à soupe pleine d'huile jaune, grande, bien lisible | `air-woosh` 0.09, puis `soft_click` |
| 0:05,6 | « **presque** autant » | au centre, une pilule jaune **≈** qui pulse | `clicks` |
| 0:06,6 | « ce **dessert** » | à droite, à la même échelle que la cuillère, le pot de crème dessert, violet | `impacts` 0.43 |

L'image finale, la cuillère ≈ le pot, revient à la fin de I5 : c'est la phrase qu'on retient, dite deux fois en image.

## I2 · 9 · 4 · 4 · 12 s

Il commence après la question face caméra « Pourquoi autant, dans une si petite cuillère ? ».
**Voix dessous** : « Un gramme de sucre ou de protéines, c'est quatre calories. Un gramme de gras, c'est neuf. Plus du double, pour le même poids. Et dans l'assiette, le gras se cache : il enrobe tout. »
**Dispositif** : le classement à la même échelle, puis un avant / après.

**Tableau 1, les trois colonnes**

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:00 | « Un **gramme** » | en haut, une pilule **1 g** | `clicks` |
| 0:00,8 | « de **sucre** » | colonne neutre, le mot Sucre, sa jauge verticale monte à 4 | `soft_click` |
| 0:01,5 | « ou de **protéines** » | colonne neutre, Protéines, jauge à 4 | `soft_click` |
| 0:02,4 | « c'est **quatre** calories » | un **4** apparaît au-dessus de chacune | `bloop` 0.22 puis 0.26 |
| 0:03,4 | « Un gramme de **gras** » | troisième colonne, jaune, Gras, jauge vide | `soft_click` |
| 0:04,4 | « c'est **neuf** » | la jauge Gras monte, compteur 0 → **9**, plus du double de hauteur | `rizer-windy` 0.24, `impacts` 0.43 à l'arrivée |
| 0:05,5 | « Plus du **double** » | à côté du 9, deux blocs fantômes de hauteur 4 s'empilent l'un sur l'autre : ils arrivent à 8, le 9 dépasse encore. Pilule **> × 2** | `soft_click` × 2, `clicks` |
| 0:07,0 | « pour le **même** poids » | la pilule 1 g pulse | |

**Tableau 2, la goutte qui disparaît**

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:08,3 | « Et dans l'**assiette** » | sortie du tableau 1 ; une assiette vue de dessus, riz et légumes dessinés | `air-woosh` 0.09 |
| 0:09,6 | « le gras se **cache** » | une goutte jaune tombe au centre et s'étale en un film brillant | `bloop` 0.6 |
| 0:10,6 | « il en**robe** tout » | le film recouvre les aliments, puis s'efface : l'assiette est exactement la même qu'avant. Icône `eye-off` + le mot **Invisible** | `clicks` |

## I3 · l'étude · 15 s

**Voix dessous** : « C'est pour ça que tout le monde se fait avoir. Des chercheurs ont demandé à des gens d'estimer ce que contenaient des plats de restaurant. Dans les plats les plus riches, il y avait deux fois plus de gras que ce qu'ils pensaient. Et presque deux fois plus de calories. »
**Dispositif** : la cohorte, puis l'avant / après à la même échelle.

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:00 | « tout le **monde** » | une rangée de huit personnages (`user-round`), en rafale ; un **?** vacille au-dessus | `soft_click` en rafale, six au plus |
| 0:03,0 | « Des **chercheurs** » | une fiole `flask-conical` + le mot Étude | `clicks` |
| 0:04,6 | « plats de **restaurant** » | une assiette sous cloche + Restaurant | `soft_click` |
| 0:07,5 | « les plus **riches** » | sortie ; titre jaune **GRAS** ; deux jauges verticales à la même échelle, vides : Estimé (une tête avec un ?) et Réel | `air-woosh` 0.09 |
| 0:08,6 | « deux **fois** plus de gras » | Estimé monte à une hauteur ; Réel monte au double, en jaune. Pilule **× 2**. Croix rouge sur Estimé, la carte encaisse | `rizer-windy` 0.24, `wrong` 0.35 |
| 0:12,0 | « presque deux fois plus de **calories** » | à droite, la même paire pour **Calories** : Réel à un peu moins du double. Pilule **≈ × 2** | `clicks` |
| toute la durée | | bandeau de source discret en bas de zone sûre : **BURTON · 2006** | |

## I4 · ton assiette · 19 s · l'insert prioritaire

**Voix dessous** : « Prends une assiette toute simple : du poulet et des légumes à la poêle, avec du riz. Tu mets deux cuillères d'huile pour la cuisson, et une de sauce à côté. Le plus calorique de cette assiette, ce n'est ni le poulet ni le riz. C'est le gras. Ton dessert, tu l'as enlevé. Bravo. Tu viens d'en remettre plus de deux. »
**Dispositif** : l'assiette, puis le classement, puis le dessert qui sort et ceux qui rentrent.

**Tableau 1, l'assiette**

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:00 | « une **assiette** » | une assiette blanche vue de dessus, au centre | `soft_click` |
| 0:01,6 | « du **poulet** » | un morceau de poulet grillé se pose, à gauche | `soft_click` |
| 0:02,3 | « des **légumes** » | des haricots et des brocolis, en bas | `soft_click` |
| 0:03,6 | « avec du **riz** » | le riz, à droite | `soft_click` |

**Tableau 2, les trois cuillères**

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:05,0 | « **deux** cuillères d'huile » | deux cuillères pleines, jaunes, entrent au-dessus de l'assiette, pilule **× 2** | `soft_click` × 2 |
| 0:06,3 | « pour la **cuisson** » | elles basculent, l'huile coule sur l'assiette, un reflet passe et s'efface : l'assiette ne change pas | `bloop` 0.5 puis 0.6 |
| 0:07,5 | « et **une** de sauce » | une cuillère de sauce blanche se pose à côté de l'assiette | `bloop` 0.7 |

**Tableau 3, le classement**

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:09,3 | « Le plus **calorique** » | l'assiette rétrécit en haut ; dessous, quatre pistes horizontales à la même échelle. Légumes, Riz, Poulet se remplissent dans cet ordre, en teinte neutre | `soft_click` × 3 |
| 0:11,2 | « ni le **poulet** » | la piste Poulet pulse | |
| 0:11,8 | « ni le **riz** » | la piste Riz pulse | |
| 0:12,6 | « C'est le **gras** » | la piste Gras, jaune, se remplit et passe devant Poulet ; une couronne `crown` se pose au bout | `rizer-windy` 0.24, `impacts` 0.43 |

Longueurs, pour que l'ordre soit juste : Légumes 60, Riz 200, Poulet 240, Gras 315, sur une piste de 350. Aucun de ces chiffres n'est écrit.

**Tableau 4, les desserts**

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:14,0 | « Ton **dessert** » | à droite, le pot de crème dessert violet, celui de I1 | `soft_click` |
| 0:15,0 | « tu l'as en**levé** » | le pot glisse hors du cadre et disparaît | `air-woosh` 0.09 |
| 0:15,8 | « **Bravo** » | à la place du pot, une pastille verte, la coche se dessine : l'ironie, en image | `correct` 0.4 |
| 0:16,6 | « Tu viens d'en re**mettre** » | la coche se retourne en croix rouge ; au-dessus de la piste Gras, deux pots violets tombent et s'écrasent l'un après l'autre, puis un troisième à moitié rempli | `wrong` 0.45, `bloop` × 3 |
| 0:18,5 | « plus de **deux** » | pilule jaune **> 2** | `impacts` 0.43 |

## I5 · le test du bol · 15 s · remplaçable par les vrais plans

Si Mohamed a tourné les plans du bol ([[video/assiette-pas-le-dessert/TOURNAGE#F · Les plans du bol|TOURNAGE § F]]), ils passent à la place des tableaux 1 et 2, et seuls les tableaux 3 et 4 restent en insert.
**Voix dessous** : « Alors fais le test ce soir : verse ton huile comme d'habitude, mais dans un bol. Puis vide-le dans ta poêle avec une cuillère à soupe, en comptant. Chaque cuillère, c'est presque un dessert. Pour une portion, une seule suffit. Pas trois. Une. Et la sauce, pareil : à la cuillère, pas au flacon. »
**Dispositif** : le geste, puis la liste qui se remplit, puis la coche.

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:00 | « fais le **test** » | un bol transparent, vide, vu de profil | `soft_click` |
| 0:01,3 | « **verse** ton huile » | une bouteille penche, un filet jaune remplit le bol | `rizer-windy` 0.24 |
| 0:04,0 | « Puis **vide**-le » | une poêle vue de profil à droite | `soft_click` |
| 0:04,8 | « avec une **cuillère** à soupe, en comptant » | la cuillère plonge, remonte pleine, se vide dans la poêle, trois fois ; à chaque fois le bol baisse d'un cran et un pot violet rejoint une rangée en bas | `bloop` 0.22, 0.30, 0.40 |
| 0:08,0 | « Chaque cuillère, c'est **presque** un dessert » | la carte de la fin de I1 revient : la cuillère **≈** le pot | `clicks` |
| 0:10,3 | « une **seule** suffit » | une seule cuillère au-dessus de la poêle | `soft_click` |
| 0:11,2 | « Pas **trois** » | deux autres cuillères la rejoignent, puis prennent chacune une croix rouge et sortent | `wrong` 0.35 puis 0.45 |
| 0:12,0 | « **Une** » | la cuillère restante, pilule **1**, coche verte qui se dessine | `correct` 0.5 |
| 0:12,8 | « Et la **sauce** » | le flacon souple de I1, une cuillère sous le bec, coche verte ; sur « pas au **flacon** », le flacon seul prend une croix | `correct` 0.66, `wrong` 0.55 |

Le nombre de cuillères du tableau 2 suit le test de Mohamed : trois par défaut, son vrai chiffre s'il le dit dans la ligne en option. Pas de chiffre écrit sous la rangée de pots s'il n'est pas dit.

---

## Ce qui fait rejeter un insert

Une bordure, une phrase à l'écran, deux couleurs sur un carton, un chiffre absent de la voix, un gramme ou une calorie écrits sur l'assiette, un élément qui entre avant sa syllabe, un rendu muet, une marque visible sur un pot ou une bouteille.

[[Le plus calorique de ton assiette, ce n'est pas le dessert]] · [[HUB]]
