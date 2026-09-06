# Le programme : les fondamentaux

Les fondamentaux, au sens où tu l'entends : **les questions de base** de la nutrition, de
la course et de la muscu, une vidéo par question, chacune regardable seule. C'est quoi une
calorie. Où elles sont dans l'assiette. Comment on perd du poids sans se priver. Comment
on en prend sans prendre de ventre. Une vingtaine de vidéos, et le semi qui avance à côté.

Ce document est le programme d'écriture. `FONDAMENTAUX.md` dit qui tu es et ce que tu
défends ; `PLAN-SEMI-18-OCTOBRE.md` dit quelle semaine on tourne quoi. Ici : quels
formats, quelle liste, dans quel ordre, avec quelle méthode, et les deux premiers scripts.
Version 2 : l'assiette est animée, pas filmée.

---

## 1. Deux formats

Tu l'as tranché : pas besoin de multiplier les formats, il faut du constant et de la
qualité qui tienne jusqu'au 18 octobre. Deux formats, et le trailer une seule fois.

| Format | Sert à | Durée | Coût | Cadence | Où |
|---|---|---|---|---|---|
| **Le yapping** | le semi : tu parles, en marchant, après la séance | 60 à 90 s | une heure | **2 par semaine**, mercredi et dimanche | `YAPPING-SEMI.md` |
| **La science** | les fondamentaux : toi face caméra, et une assiette animée qui se remplit avec son compteur | 60 à 100 s | une demi-journée, une fois le composant construit | **1 par semaine**, le vendredi | ce document |
| Le trailer | dire qui tu es et ce qu'on prépare, épinglé | 30 à 40 s | une demi-journée | une fois | § 7 |

Le science-reel lourd, à trois animations, reste une **version de production** de la
science, pas un troisième format : on la choisit quand le sujet a besoin d'un mécanisme
dessiné en plusieurs temps, comme `meriter`. Il n'a plus de cadence à lui.

Par semaine : deux yappings et une science, entre sept et neuf heures, b-roll compris.
Si une semaine casse, c'est la science qui glisse, jamais le yapping.

### La science, version assiette animée

Tu l'as dit : pas de vraie cuisine, le plus simple c'est face caméra et le montage
après. Alors **l'assiette est une animation, et les aliments sont générés.** Ça garde
tout ce qui fait le format, le chiffre produit à l'écran plutôt qu'affirmé, et ça
enlève tout ce que tu ne sais pas encore filmer.

Le principe est celui de `SplitBar` : **un composant construit une fois, réutilisé
avec des paramètres.** Le `SplitBar` a porté seize des dix-huit inserts du reel déficit.
L'« Assiette » portera les fondamentaux.

| | |
|---|---|
| **Le composant « Assiette »** | une composition HyperFrames, sur le modèle de `splitbar.js`. On lui donne une liste d'aliments avec leur poids, leurs calories et leur image ; elle les fait arriver un par un sur l'assiette, avec l'étiquette et le compteur en haut qui monte |
| **Ses gestes** | poser un aliment (pop), verser (la bouteille s'incline, le filet coule, le compteur de grammes défile), isoler un aliment, en comparer deux côte à côte à la même échelle, la croix ou la coche, et le total |
| **Les aliments** | des images générées avec Higgsfield, fond retiré : la cuisse de poulet, le riz, les haricots, la bouteille d'huile, le dessert. **Un seul style pour tous**, décidé une fois : vue de dessus, flat, sur le fond du kit. Une image fixe d'abord, validée, jamais une vidéo pour un aliment qui ne bouge pas |
| **Le compteur** | en haut de l'assiette, le total de calories monte à chaque élément. C'est le seul graphisme de la vidéo avec la carte 9-4-4 |
| **La carte 9-4-4** | quatre secondes, toujours la même, réutilisée partout (§ 2) |
| **Toi** | face caméra, plan poitrine, entre les blocs d'animation, comme dans le science-reel : tu ponctues, tu ne portes pas le corps de la vidéo |
| **Son** | une musique à 0,11, un pop par aliment qui arrive, un pop grave sur le gros chiffre, **un seul scratch sur le turn** |

Ce que ça coûte : **construire le composant et générer la première dizaine d'aliments,
une journée, une fois.** Ensuite, par vidéo : tes plans face caméra en une demi-heure,
les paramètres de l'assiette en une heure, le montage CapCut en une heure et demie.

**Le seul vrai geste, optionnel.** Verser de l'huile et la peser, à ton bureau, une
bouteille et une balance de cuisine, face caméra. Ça se filme exactement comme un plan
face caméra, et c'est le moment le plus fort de la vidéo 1 : le spectateur voit la
balance afficher le vrai chiffre. Si tu ne veux pas, l'animation le fait, et elle le
fait bien. La vraie cuisine viendra quand tu sauras la filmer, et ce sera une
amélioration, pas une condition.

La colonne vertébrale reste celle du science-reel, condensée : hook (l'assiette qui se
remplit, 1 à 4 s), la croyance validée, le mécanisme, la démonstration dans l'assiette,
**le turn**, la résolution, la chute qui concède.

---

## 2. La colonne vertébrale

Deux choses reviennent dans toutes les vidéos et font la signature.

### Le corps cible

C'est ton idée, et elle porte les deux sens : perdre et prendre. **Un régime, c'est manger
comme quelqu'un que tu ne seras jamais. Manger comme le corps que tu vises, c'est manger
comme quelqu'un que tu deviens.** Un corps de soixante-dix kilos a un budget. Un corps de
quatre-vingt-dix aussi. Tu manges le budget du corps que tu veux, et le corps suit. La
seule chose qui change, c'est l'habitude ; et l'habitude, contrairement au régime, ne se
termine pas.

On lui donne un nom, « le corps cible », et on le dit à chaque fois qu'il sert. Un terme
nommé crée l'attente de sa définition. C'est le verrou *Term Branding* de Kallaway, et
c'est ce qui fait qu'une série se reconnaît.

### La carte 9-4-4

Tu veux que chaque vidéo réexplique les calories pour être regardable seule. Alors on
ne le réexplique pas différemment à chaque fois : **on rejoue la même carte, mot pour
mot, quatre secondes.**

> Une calorie, c'est de l'énergie. Un gramme de sucre : quatre. Un gramme de protéines :
> quatre. Un gramme de gras : **neuf.** Plus du double.

À l'écran, trois colonnes, la troisième plus haute que les deux autres. Rendue une
fois, insérée partout. Le spectateur qui la voit pour la troisième fois la reconnaît en
une seconde et n'a rien à réapprendre. Celui qui la voit pour la première fois a tout.

---

## 3. La liste

Vingt-quatre vidéos, quatre groupes. La colonne « état » dit ce qui existe déjà : une
grande partie de la recherche est faite, elle vit dans les 69 sources du long format et
dans les 8 shorts déjà écrits avec leur hook et leur chute.

La colonne « format » ne désigne pas deux formats : elle dit la **version de
production** de la science. « table », c'est toi face caméra plus l'assiette animée, une
demi-journée. « science-reel », c'est trois animations et une semaine, comme `meriter`.
On choisit la version légère chaque fois qu'elle suffit, c'est-à-dire presque toujours.

### A · La cuisine : les calories

| # | Vidéo | La croyance | La surprise | Dans l'assiette | Le chiffre, à son échelle | Format | État |
|---|---|---|---|---|---|---|---|
| 1 | **L'huile coûte plus cher que ton dessert** | les calories sont dans le dessert | le truc le plus léger de l'assiette fait le plus gros chiffre | riz, poulet, légumes, dessert, puis l'huile versée | 30 g d'huile ≈ presque deux desserts, plus que le poulet | table | **script ci-dessous.** Chiffres à vérifier sur Ciqual ou YouBud |
| 2 | **Mange comme le corps que tu vises** | il faut un régime | quatre régimes, un an, un kilo d'écart. Ce qui marche, c'est le budget du corps cible | deux silhouettes, 80 et 70, même taille, chacune avec son budget | dix kilos de moins ≈ une cuillère d'huile de moins par jour, à calculer | table | plan ci-dessous. Chiffres à sortir de YouBud |
| 3 | **Vingt kilos sans prendre de ventre** | prendre du poids, c'est prendre du gras | le surplus se dose comme un déficit | tes photos, 60 puis 80, et ton assiette de prise de masse | ton surplus réel par jour, ta vitesse réelle | table + photos | **ton histoire.** Tes chiffres à toi |
| 4 | Un déficit calorique, c'est pas manger moins | déficit = manger moins | la moitié de l'équation, le TDEE | | sport 5 % | science-reel | **publié** le 27 août sur YouTube `@medmdim`, 1,3 K vues en neuf jours. Ta rep 1 |
| 5 | Tu n'as jamais eu à le mériter | il faut brûler ce qu'on mange | en dormant tu brûles plus qu'à ta séance | | digestion ×2 sur la journée | science-reel | **monté**, deux pickups |
| 6 | Ce qui te cale, c'est le poids de l'assiette | manger moins = avoir faim | mêmes calories, deux fois le volume | deux assiettes de même poids, l'une à 1 800, l'autre à 1 376 | 424 calories d'écart, un déjeuner entier | table | chapitres 3 et 5 écrits, sources vérifiées |
| 7 | Pourquoi ça revient | j'ai pas assez de volonté | la moitié lâche les régimes les plus durs, et le plus dur fait perdre le moins | quatre groupes de silhouettes, ceux qui restent | 160 personnes, 20 sur 40 finissent l'année | table ou science-reel | chapitre 1 écrit |
| 8 | L'aliment que tu t'interdis | s'interdire, c'est se contrôler | l'interdit rend l'aliment visible partout | des biscuits sous une cloche | 103 étudiantes, chocolat contre vanille | science-reel | chapitre 7 écrit, hook et chute prêts |
| 9 | Les protéines : combien, et pourquoi | c'est pour les bodybuilders | ton corps en perd un quart rien qu'à les digérer | le tas : ce que font 150 g de protéines en poulet, œufs, yaourt | 1,6 à 2,2 g par kilo, donc pour 80 kg… | table | ordre de grandeur à confirmer, une source déjà citée (PMID 15466943) |
| 10 | Ce que tu bois | l'alcool, ça compte pas | sept calories le gramme, du côté de l'huile, et tu le mâches pas | un verre de vin, une bière, un soda, à côté de l'huile | un verre = … cuillères d'huile | table | insert alcool du chapitre 2 écrit |

### B · La course, par les calories

Tu n'es pas un expert de course et tu le dis. Alors on ne parle de course que par ce
que tu maîtrises : ce qu'elle coûte, ce qu'elle rend, et ce qu'elle ne fait pas.

| # | Vidéo | La croyance | La surprise | Le chiffre | Format | État |
|---|---|---|---|---|---|---|
| 11 | **Ce que brûle vraiment un semi** | 21 km, c'est une licence de manger | environ une calorie par kilo et par kilomètre | 80 kg × 21 km ≈ 1 700 : un repas et demi | table | à calculer avec ton poids réel |
| 12 | Pourquoi tu maigris pas en courant | je cours, donc je perds | la compensation : l'appétit monte, le reste de la journée bouge moins | | science-reel | sources à trouver |
| 13 | Ta montre ne sait pas ce que t'as brûlé | la montre mesure | elle estime à partir du pouls | erreur d'un quart à presque le double, en laboratoire | table | Shcherbina 2017 à vérifier, PMID à retrouver |
| 14 | Courir à jeun brûle plus de gras ? | à jeun = plus de gras | pendant la sortie oui, sur 24 h le corps rééquilibre | | science-reel | à sourcer, le plus long des quatre |

### C · La muscu, par les calories

| # | Vidéo | La croyance | La surprise | Le chiffre | Format | État |
|---|---|---|---|---|---|---|
| 15 | Le cardio fait fondre le muscle ? | courir, c'est perdre du muscle | la perte vient du gras ou du muscle, et la silhouette c'est le rapport | groupe cardio : plus de poids perdu, dont l'équivalent de 4 kg de muscle | science-reel | teardown complet dans la bibliothèque, étude d'origine à retrouver |
| 16 | Combien de calories pour prendre du muscle | il faut manger énorme | un petit surplus, longtemps | ton surplus réel, ta vitesse réelle, tes photos | table | **ton histoire** |
| 17 | Le muscle brûle des calories au repos ? | un kilo de muscle brûle cent calories par jour | beaucoup moins, et c'est quand même le meilleur investissement | ordre de grandeur réel à vérifier | table ou science-reel | Wang 2010 à vérifier |

### D · Les tabous

Les sujets que les gens n'aiment pas, pris sans jugement. Le format science-reel, parce
qu'un tabou sans mécanisme est une opinion. **Aucun ne s'écrit avant que la source soit
lue** : c'est la règle 2 du skill, et sur ces sujets-là elle protège.

| # | Vidéo | La croyance | Le mécanisme candidat | État |
|---|---|---|---|---|
| 18 | Manger le soir fait grossir ? | l'heure compte | le total sur 24 h d'abord, et une nuance réelle sur l'heure | à sourcer |
| 19 | Coca zéro contre Coca | le zéro est pire | la dose sans effet, le tampon de sécurité ×100 | teardown dans la bibliothèque (`DcRIpQBO1Mu`, 94 K likes) |
| 20 | Le sucre est une drogue ? | addiction | ce que « addiction » veut dire en laboratoire, et ce qu'on observe vraiment | à sourcer |
| 21 | Le jeûne intermittent | la fenêtre fait maigrir | le déficit fait maigrir, la fenêtre aide certains à le tenir | à sourcer |
| 22 | Le week-end qui annule la semaine | un écart, c'est rien | l'arithmétique de cinq jours de déficit contre deux jours de surplus | à calculer, aucune source nécessaire |
| 23 | Ozempic et les médicaments | c'est de la triche | ce que le médicament fait à la faim, et ce qu'il ne fait pas | le vrai tabou. À sourcer sérieusement avant d'y toucher |

### E · L'origine

| # | Vidéo | Ce que c'est | Format | État |
|---|---|---|---|---|
| 24 | **Ma mère a essayé tous les régimes** | vingt ans de salades qui ne marchent pas, ce que tu lui as dit enfant, comment tu l'as aidée, et le fait qu'elle a réussi. La raison du « sans jugement » | face caméra, peut-être elle | **seulement avec son accord**, au degré qu'elle choisit. Après les dix premières vidéos, quand quelqu'un est là pour l'entendre |

---

## 4. L'ordre

Le premier mois décide de l'empreinte du compte : l'algorithme apprend qui tu es sur les
premières vidéos. Alors on commence par ce qui surprend le spectateur, pas par ce qui
parle de toi. Ton histoire arrive en quatrième, quand quelqu'un a déjà une raison de
s'y intéresser. Le reel déficit est déjà sorti : c'est la rep 1, et elle compte.

| Ordre | Vidéo | Pourquoi là |
|---|---|---|
| S1 | Tu n'as jamais eu à le mériter, **et le trailer le même jour** | deux pickups et c'est fini. Ta meilleure vidéo, et elle laisse la semaine 1 pour construire l'assiette animée |
| S2 | L'huile coûte plus cher que ton dessert | la surprise la plus forte du lot, tout est écrit, c'est la première assiette animée |
| S3 | Mange comme le corps que tu vises | le nom de la série. Il définit tout ce qui suit |
| S4 | Vingt kilos sans prendre de ventre | ton histoire, avec les photos. La preuve, quand le spectateur a déjà vu trois fois que tu sais compter |
| S5 | Les protéines : combien, et pourquoi | la question que tout le monde pose, et la réponse au yapping sur le muscle |
| S6 | Ta montre ne sait pas ce que t'as brûlé | légère, pour la semaine de la course |
| après | Ce qui te cale, c'est le poids de l'assiette · Ce que tu bois · Le cardio fait fondre le muscle ? · Ma mère a essayé tous les régimes, si elle est d'accord | dans l'ordre qu'on décidera en relisant le journal |

« Ce que brûle vraiment un semi » n'a plus besoin d'une vidéo science : c'est le fil de
toute la série de yapping, et B1 le pose. Après six vidéos, on relit le journal et on
réordonne le reste. Pas avant.

**Les trois messages que tu veux faire passer**, « qui je suis », « c'est quoi le
projet », « ce qu'on prépare », existent, mais pas en trois vidéos de présentation.
Une chaîne neuve qui ouvre sur trois vidéos de présentation parle à personne : le
spectateur n'est pas encore là. Ils prennent trois places qui existent déjà sur
Instagram, **les trois publications épinglées** :

1. le trailer : qui tu es, en trente secondes, tourné vers le spectateur
2. la vidéo 1 : ce que tu fais ici
3. le premier yapping du semi : ce qu'on prépare, et le Hyrox en une phrase à la fin

---

## 5. La méthode d'écriture d'une science

Dans cet ordre. Le milieu est la partie la plus facile, et l'écrire en premier est
comment on finit avec quatre cents mots et pas de turn.

1. **La croyance**, en une phrase : « Tout le monde pense X. En fait Y. » Si ça ne s'écrit pas comme ça, ce n'est pas une vidéo, c'est une fiche.
2. **Le geste de l'assiette** : qu'est-ce qui, posé ou versé dans l'assiette animée, rend Y visible sans un mot ? Un aliment qui arrive et fait sauter le compteur. Deux assiettes de même poids. Un tas. Si aucun geste n'existe, c'est la version lourde, à trois animations, pas l'assiette.
3. **Le chiffre et son échelle** : jamais un nombre nu. Des cuillères, des desserts, des repas, des journées de bouffe. Si tu ne peux pas l'ancrer, coupe-le.
4. **Le turn**, mot pour mot : « Donc je [la conclusion que le spectateur vient de tirer] ? » « Pas vraiment. »
5. **La chute** : concède quelque chose, puis nomme ce qui survit. Pas de résumé, pas d'appel à l'action.
6. **Le hook**, en dernier, maintenant que tu sais ce qu'il doit préparer. Les quatre composantes alignées : ce qu'on voit, ce que tu dis, le texte, le son.
7. **Remplir** jusqu'à 220 à 280 mots. Chaque transition est un mais ou un donc.
8. **Lire à voix haute, chrono en main.** Ce qui sonne écrit se réécrit. Les deux côtés de chaque comparaison partagent une unité. Aucune unité de laboratoire.
9. **Les aliments** : la liste de ce que l'assiette montre, avec le poids et les calories de chacun, vérifiés sur Ciqual ou dans YouBud. Ceux qui n'existent pas encore en image se génèrent avec Higgsfield, dans le style décidé une fois, et se rangent dans la bibliothèque d'assets pour les vidéos suivantes.
10. **La légende**, cinq parties : la thèse à plat, le qualificatif, l'expansion, la réserve honnête, les sources.

Le tournage : face caméra, caméra posée, tout d'une traite, trois prises par beat. Le
montage dans CapCut : tes plans, les rendus de l'assiette, la carte 9-4-4, les pops, la
musique, le scratch, les sous-titres en dernier. Une heure et demie.

---

## 6. Le yapping, deux fois par semaine, avec une colonne vertébrale

Yapper, c'est le bon choix pour le semi : simple, pratique, et c'est là que la
sympathie se construit. Mais yapper sans structure, c'est un vlog, et personne ne reste
pour un vlog de quelqu'un qu'il ne connaît pas encore. **La règle, le gabarit, le
générateur et les douze épisodes écrits sont dans `YAPPING-SEMI.md`.** La structure
tient sur une carte de cinq lignes, que tu lis avant de lancer l'enregistrement et que
tu ne relis plus.

| Ligne | Quoi | Exemple |
|---|---|---|
| **Le chiffre** | à l'image avant de parler : la montre, l'appli | « Quarante-deux kilomètres cette semaine. » |
| **Ce qu'on croit** | la phrase de tout le monde | « Donc j'ai le droit à tout. » |
| **La séance, ou la semaine** | ce qui a marché, ce qui a cassé. Trois choses, pas dix | la sortie longue, le repas d'après, la fatigue de jeudi |
| **La leçon** | le chiffre remis à son échelle | « Quarante-deux kilomètres, c'est une journée de bouffe. Une. » |
| **La concession, puis la question d'après** | | « Après, ça se compte quand même. Dimanche, on teste la semaine de volume. » |

Deux par semaine, calés sur tes séances : **A**, après le fractionné, la séance dure, ce
que le corps demande à cette allure ; **B**, le dimanche après la sortie longue, les
kilomètres de la semaine et ce qu'ils ont brûlé. Le samedi social se filme sans parler,
dix secondes de plans pour le B. Le renfo des jambes et le haut du corps ne se filment
pas : ils apparaissent dans le B en une phrase.

Tu marches et tu parles, juste après la séance, encore en tenue, au même endroit chaque
fois. Deux prises maximum, quatre-vingt-dix secondes maximum. Le fil de toute la série
est l'hypothèse posée au premier épisode : *tout ce que je brûle en six semaines, on le
compte, et on voit combien de desserts ça paie.* Détails dans `PLAN-SEMI-18-OCTOBRE.md`.

---

## 7. Les deux premiers scripts, et le trailer

### Vidéo 1 · L'huile coûte plus cher que ton dessert

Format table · cible 1:20 · 251 mots parlés · turn vers 58 %.
Croyance : les calories sont dans le dessert. En fait elles sont dans ce que tu ne
mâches pas.

Les chiffres viennent des chapitres 2 et 5 du long format. **Avant de rendre l'assiette,
vérifier chaque valeur sur Ciqual ou dans YouBud.** Les plans « assiette » sont des
rendus du composant ; les plans « toi » sont face caméra. Si tu choisis de verser
l'huile pour de vrai à ton bureau, le plan 00:34 devient un face caméra avec la balance,
et la vidéo dit ce que la balance dit.

```
[00:00 — Assiette animée : l'assiette vide, plein cadre. Les aliments arrivent un par
un, un pop chacun : le riz, le poulet, les légumes, puis le dessert posé à côté]
Sur cette assiette, il y a un truc qui coûte plus cher que le dessert.
Et tu le vois même pas.
TEXT: "PLUS CHER QUE LE DESSERT"
SFX: un pop par aliment posé
MUSIC: rien. Silence jusqu'à la coupe sur toi

[00:05 — Toi, plan poitrine]
Quand tu surveilles ce que tu manges, tu regardes le dessert. C'est normal :
c'est le seul truc qu'on t'a appris à compter.
TEXT: "LE SEUL QU'ON T'A APPRIS À COMPTER" (surbrillance jaune sur "seul")
MUSIC: entre à plein volume sur la coupe

[00:11 — La carte 9-4-4, trois colonnes]
Une calorie, c'est de l'énergie. Un gramme de sucre : quatre. Un gramme de
protéines : quatre. Un gramme de gras : neuf. Plus du double.
TEXT: "4 · 4 · 9"
SFX: trois pops, le troisième plus grave
FX: la carte 9-4-4, la même dans toutes les vidéos

[00:17 — Assiette animée : chaque aliment s'isole à son tour, son étiquette et ses
calories s'affichent, le compteur en haut monte]
Alors on compte. Le riz, cent cinquante grammes : deux cents calories.
Le poulet, cent cinquante grammes : deux cent trente.
Les légumes, deux cents grammes : soixante.
Le dessert, le pot entier : cent cinquante.
TEXT: le compteur : 200 → 430 → 490 → 640
SFX: un pop par chiffre

[00:31 — Toi. La bouteille d'huile en main, ou l'image de la bouteille à l'écran]
Et l'huile. Verse-la comme tu fais d'habitude.
TEXT: "COMME D'HABITUDE"
CAM: léger punch-in

[00:34 — Assiette animée : la bouteille s'incline, un filet coule sur l'assiette, un
compteur de grammes défile jusqu'à 30. Ou toi, face caméra, avec la balance]
Trente grammes. Neuf calories le gramme.
Deux cent soixante-dix.
TEXT: "30 g" puis "270" (rouge)
SFX: un pop grave sur le chiffre

[00:40 — Toi]
Le truc le plus léger de l'assiette. Et le plus gros chiffre.
Presque deux fois le dessert. Plus que le poulet.
TEXT: "PLUS QUE LE POULET" (surbrillance rouge sur "poulet")

[00:47 — Toi, punch-in serré. LE TURN]
Donc je vire l'huile ?
(un demi-temps)
Pas vraiment.
TEXT: « JE VIRE L'HUILE ? » entre guillemets, puis "Pas vraiment."
SFX: le scratch de vinyle. Le seul de la vidéo

[00:51 — Toi, plan moyen]
Ceux qui suppriment le gras tiennent trois semaines, et ils craquent.
Parce qu'ils ont enlevé des calories, sans rien enlever à la faim.
TEXT: "SANS RIEN ENLEVER À LA FAIM" (jaune sur "faim")

[00:58 — Assiette animée : le dessert d'un côté, l'huile de l'autre, à la même échelle]
Le dessert que tu t'interdis, tu y penses toute la soirée.
L'huile, tu l'as jamais sentie passer.
C'est pour ça que c'est elle qu'on ajuste. Pas le dessert.
TEXT: "C'EST ELLE QU'ON AJUSTE" (vert sur "elle")
SFX: correct, sur l'huile

[01:07 — Assiette animée : une cuillère à soupe pleine, son poids et ses calories]
Une cuillère en moins, quinze grammes, c'est quasiment ton dessert entier.
Et celle-là, tu la sentiras pas passer.
TEXT: "15 g ≈ LE DESSERT"
SFX: pop

[01:14 — Toi, plan moyen. La chute]
Après, personne ne pèse son huile toute sa vie.
Ce qui reste, c'est un geste : tu verses au filet, pas au glouglou.
Et tu gardes ton dessert.
TEXT: "AU FILET, PAS AU GLOUGLOU" (vert sur "filet")
MUSIC: redescend. Deux secondes de silence avant de couper
```

**Les aliments à générer pour cette vidéo** : l'assiette vide, le riz, le poulet, les
légumes, le pot de crème dessert, la bouteille d'huile, une cuillère à soupe pleine. Sept
images, fond retiré, le même style. Elles resserviront aux vidéos 3, 6, 9 et 10.

**La légende**

> L'huile coûte plus cher que ton dessert.
>
> Pas parce que le dessert est innocent. Parce qu'on ne compte jamais ce qu'on ne mâche pas.
>
> Un gramme de gras, c'est 9 calories. Un gramme de sucre ou de protéines, 4. Cent grammes d'huile d'olive : environ 900 calories. Une cuillère à soupe, c'est 10 à 15 grammes, donc 90 à 135 calories. Un pot de crème dessert au chocolat : environ 150.
>
> Pourquoi on ajuste l'huile et pas le dessert : dans une étude de 1995 qui comparait ce qui cale le mieux, le gras est le seul qui allait dans l'autre sens. Plus il y en avait dans le plat, moins les gens se sentaient calés. Une cuillère en moins ne crée pas de faim. Un dessert en moins crée une envie.
>
> Ce que ça ne dit pas : ton corps a besoin de gras, et l'huile d'olive en est une bonne source. On parle de la quantité qu'on verse sans la voir, pas de la supprimer. Et un dessert reste un dessert : ça se compte quand même.
>
> Les chiffres de l'assiette sont des ordres de grandeur, calculés sur [Ciqual / YouBud]. Le tien dépend de ce que tu verses.
>
> PMID [étude de satiété 1995, chapitre 2 du long format]
>
> #nutrition #calories #pertedepoids

**Contrôle avant tournage**

- [ ] chaque chiffre vérifié sur Ciqual ou YouBud
- [ ] les deux côtés de chaque comparaison partagent une unité : calories contre calories
- [ ] un seul scratch, sur « Pas vraiment »
- [ ] la chute concède (« personne ne pèse son huile ») avant de nommer ce qui survit
- [ ] aucune phrase à la première personne qui ne soit pas vraie pour toi
- [ ] lu à voix haute, chrono : entre 1:15 et 1:25

### Vidéo 3 · Mange comme le corps que tu vises

Format table · cible 1:30 · le nom de la série. Un plan, pas encore un script : les
chiffres sortent de YouBud avec ton profil réel.

| Beat | Contenu | Ce qu'il faut |
|---|---|---|
| Hook, assiette animée | deux silhouettes de la même taille, 80 et 70, chacune avec son budget du jour affiché en dessous. « Tu veux peser soixante-dix. Alors pourquoi tu manges comme quelqu'un de quatre-vingts ? » | le device population, à construire |
| Pivot | on valide : « Un régime, ça marche. Vraiment. Cent soixante personnes, quatre régimes, un an : tout le monde a perdu. » | chapitre 1, sources vérifiées |
| Mécanisme, nommé | **le corps cible.** Chaque corps a un budget. Un corps de soixante-dix dépense moins qu'un corps de quatre-vingts, tous les jours, pour toujours. Tu manges le budget du corps que tu veux, et le corps suit | **le chiffre à sortir de YouBud** : le budget d'un corps de 70 contre 80, même taille, même âge, même activité. Puis l'écart en cuillères d'huile |
| Preuve | les quatre régimes : un kilo d'écart entre le meilleur et le pire. Et la moitié a lâché les deux plus durs. Ce qui a marché, c'est pas le régime, c'est tenir | chapitre 1 |
| **Turn** | « Donc je mange comme un corps de soixante-dix dès demain, et j'attends ? » « Enfin… pas vraiment. » | scratch |
| Résolution | ton estomac de quatre-vingts ne rétrécit pas sur commande : le budget de soixante-dix, avec le volume de quatre-vingts. Ce qui contient de l'eau remplit, l'huile se verse au filet, les protéines calent. Et par paliers, pas d'un coup | chapitres 3 et 5, et la vidéo 1 |
| Chute | « C'est lent. Un demi-kilo par semaine, c'est déjà bien. Mais tu ne finis jamais un régime. Parce que t'en as jamais commencé un. » | la vitesse à confirmer |

C'est la vidéo où YouBud a sa place naturelle : « tu tapes le corps que tu vises, il te
donne son budget ». Pas en fin de vidéo, au moment où le spectateur a besoin du calcul.

### Le trailer · épinglé, publié le même jour que la vidéo 1

Trente-cinq secondes, tourné vers le spectateur. Chaque phrase sur toi est suivie d'une
phrase sur lui. **À CONFIRMER** : « jamais repris » n'est vrai que si ton poids n'est
jamais redescendu entre soixante et quatre-vingts ; « pas un régime » veut dire pas de
restriction, mais tu as compté. On dit ce qui est vrai.

```
[00:00 — Photo : toi à 60 kg]
Un mètre quatre-vingt-dix. Soixante kilos.
TEXT: "60 KG"

[00:03 — Toi, aujourd'hui, même cadrage que la photo]
Aujourd'hui, quatre-vingts. Jamais repris. Pas un régime.
Juste des calories que je comprends.
TEXT: "80 KG · SANS RÉGIME"

[00:10 — Assiette animée : l'assiette, l'huile, une bière, un dessert]
Ici, je te montre où elles sont vraiment. Dans ton assiette, dans ta bière,
dans ton dessert. Sans jugement. Sujets tabous compris.
TEXT: "SANS JUGEMENT"

[00:20 — Toi, en tenue de course, dehors]
Et en attendant, je prépare un semi-marathon. Le dix-huit octobre, en une heure
trente-cinq. Après, un Hyrox. On compte tout.
TEXT: "SEMI · 18 OCTOBRE · 1H35"

[00:30 — Assiette animée : la bouteille d'huile]
Première vidéo : ton huile d'olive.
TEXT: "VIDÉO 1"
```

Une ligne de plus est possible entre 00:10 et 00:20, **seulement avec l'accord de ta
mère** : « J'ai vu quelqu'un que j'aime essayer tous les régimes pendant vingt ans. C'est
pour ça que je ne juge personne. » Sans accord, elle ne se dit pas.

Dans la bio, une ligne et un lien : *Les calories, sans régime et sans jugement. Semi
le 18 octobre. Mon calculateur : YouBud.*

---

## 8. YouBud, sans vendre

Tu veux que les gens finissent par utiliser YouBud, gratuitement. Trois règles pour que
ça marche sans que ça sente la pub :

1. **Dans la bio dès le premier jour.** C'est là que va celui qui veut le calcul.
2. **Dans une vidéo seulement quand la vidéo a besoin du calcul.** La vidéo 3 en a besoin. La vidéo 1 n'en a pas besoin : on n'en parle pas.
3. **Jamais en fin de vidéo par défaut.** Les quatre plus grosses vidéos du corpus n'ont aucun appel à l'action ; les trois qui en ont un sont dans la moitié basse. Un appel se dépense, il ne s'installe pas.

Et ce que tu as dit toi-même est ta meilleure carte : tu as utilisé MyFitnessPal et
Yazio, tu trouves Yazio très bien et tu la recommandes. **Dis-le à l'image le jour où
tu parles de YouBud.** Quelqu'un qui recommande le concurrent ne vend pas ; il aide. C'est
exactement la différence que le spectateur sent.

Et une chose que Kallaway appelle la plateforme possédée : quelqu'un qui installe YouBud
n'est plus soumis à l'algorithme pour te retrouver. C'est mieux qu'un abonné. C'est
la seule raison stratégique de le mentionner, et elle suffit.
