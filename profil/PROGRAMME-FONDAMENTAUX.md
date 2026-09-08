# Le programme : les longues et leurs shorts

Un seul type de vidéo : les calories et la nutrition, sans régime et sans jugement.
Deux formats : une longue YouTube par semaine, dix minutes minimum, où l'on entre dans
le mécanisme ; et trois shorts par semaine, découpés dans la même matière, pour
Instagram, avec leurs miroirs TikTok et YouTube Shorts. Le sport et la vie vivent dans
les stories.

Ce document est le programme d'écriture. `FONDAMENTAUX.md` dit qui tu es et ce que tu
défends ; `PLAN-SEMI-18-OCTOBRE.md` dit quelle semaine on tourne quoi, jour par jour ;
`STORIES-SEMI.md` dit ce que tu racontes en stories. Ici : les formats, la colonne
vertébrale, la liste des longues avec leurs chapitres, l'ordre, la méthode d'écriture
d'une longue, la méthode d'extraction de ses trois shorts, les scripts écrits, YouBud,
et le packaging. Il est écrit à partir du brief du 7 septembre 2026 ; en cas de
conflit avec un autre document, le brief a raison, puis `FONDAMENTAUX.md`.

> **Ce qui a changé le 7 septembre.** L'ancien modèle avait deux formats : un format
> parlé après la séance, que ce document appelait « le yapping », et une science
> courte à assiette animée. Les deux disparaissent. Le format parlé devient les
> stories (cinq stories de 15 s, `STORIES-SEMI.md`, qui remplace `YAPPING-SEMI.md`).
> La science courte devient le short découpé dans la longue. L'assiette animée n'est
> plus un format : c'est un dispositif visuel parmi les autres, hors chemin critique.
> Les deux vidéos de neuf minutes de `video/manger-sans-se-priver`, qui étaient
> garées jusqu'en 2027, deviennent S1 et S2.

---

## 1. Un seul type de vidéo, deux formats

| Format | Sert à | Durée | Cadence | Où | Coût par semaine |
|---|---|---|---|---|---|
| **La longue** | le mécanisme entier : une ouverture à froid, trois chapitres, une chute | 10:00 à 10:30, plafond 11:00, jamais sous 10:00 | **une par semaine**, le dimanche à 18 h | YouTube, playlist « Les calories, sans régime » (nom à confirmer, § 9) | tournage 4 h le lundi, montage 6 h (mardi, mercredi), inserts 2 h le jeudi, écriture 5 h (jeudi, samedi) |
| **Le short** | le noyau d'un chapitre, à un autre débit | 70 à 100 s ; plafond dur 2:00, jamais sous 70 s | **trois par semaine**, mardi, jeudi, samedi | Instagram Reels ; le même fichier, le même jour, sur TikTok et YouTube Shorts | 1 h chacun le vendredi ; les hooks et les chutes tournés le lundi dans la session du long |
| **Les stories** | le sport, les repas, la vie, comptés en calories | cinq stories de 15 s | les jours de séance et les repas qui valent une image | Instagram, archivées dans la « à la une » SEMI | 10 à 15 min par jour de séance |
| Le trailer | dire qui tu es et ce qu'on prépare | 35 s | une fois | épinglé en premier sur Instagram ; bande-annonce de chaîne YouTube en 16:9 | 3 h de montage, une fois (§ 7) |

**Le coût réel : 20 à 24 heures par semaine en régime de croisière.** 24 h quand le
script est à écrire et qu'un dispositif est neuf ; 20 h quand tout existe. C'est trois
fois l'ancien modèle, et c'est le prix d'une longue plus trois shorts. Le tableau jour
par jour est dans `PLAN-SEMI-18-OCTOBRE.md` ; le chiffre se mesure dans le journal dès
S1.

**La règle de casse.** Si la semaine casse, la longue sort quand même, en tête parlante
pure avec quatre inserts au plus ; les trois shorts sortent quand même, en prenant dans
la réserve (§ 4). Ce qui glisse : le dispositif neuf, la miniature travaillée, le
trailer en S1. Jamais la longue, jamais les trois shorts.

### Les dispositifs visuels : construits une fois, paramétrés ensuite

L'assiette animée n'est plus un format. Elle rejoint la liste des dispositifs, et elle
n'est pas sur le chemin critique des six semaines.

| Dispositif | État | Sert à |
|---|---|---|
| **SplitBar** | existe, `video/deficit-calorique-fr/compositions/components/` ; a porté 16 des 18 inserts du reel déficit | le TDEE, les 9 contre 4, les répartitions ; quatre par longue |
| **Carte 9-4-4** | à rendre une fois, 4 s | toute vidéo qui compte des calories |
| **Avant/après à échelle constante** | à construire, jeudi de S1, 3 h | les deux verres d'eau, l'anneau contre le bypass, les deux assiettes de même poids, le surplus de « Vingt kilos » |
| **Population de silhouettes** | à construire, jeudi de S4, 3 h | le corps cible (80 contre 70) en S5 |
| **Croix/coche, liste qui se remplit, frise** | cartes texte CapCut | tout le reste |
| **Assiette animée** | à construire un jeudi de libre, sinon après le 19 octobre | « L'huile coûte plus cher que ton dessert » (§ 7) et les fondamentaux légers, plus tard. Les trois assiettes à 200 calories de S4 se font en images fixes Higgsfield, fond retiré |

Par longue : huit à douze inserts, trois compositions au plus par chapitre (le
mécanisme, la preuve, la résolution), de 8 à 30 s chacune, découpées en plans de 3 à
5 s au montage. Tout le reste est tête parlante avec un chiffre en texte CapCut. Un
carton simple bat un plan mal assorti. Higgsfield sert aux décors et aux aliments,
image fixe d'abord, jamais à toi.

Les 55 compositions de `scenario.json` se trient par dispositif : la baignoire devient
une seule composition de 17 s (ou trois cartes de texte), on garde les instances des
dispositifs construits, le reste passe en carte. Les retenues se marquent avec un champ
`retenue: true`, pour que `build_2_annexes.py` régénère la liste de production ; ce
champ n'existe pas encore dans `scenario.json` ni dans le script au 7 septembre : à
ajouter avant le jeudi de S1. Les 14 articles à afficher : un par chapitre au plus,
trois par longue, capture d'écran avec la phrase surlignée ; les autres sont cités dans
la description.

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
fois, insérée dans toute vidéo qui compte des calories, longue ou short. Le spectateur
qui la voit pour la troisième fois la reconnaît en une seconde et n'a rien à
réapprendre. Celui qui la voit pour la première fois a tout.

---

## 3. La liste, par longue

Une idée, un seul endroit. Les vingt-quatre fondamentaux de l'ancienne liste, les
scripts déjà écrits et les six hot takes intemporels de l'ancien document de stories
sont répartis en chapitres de longues. Le tableau de correspondance est en fin de
section.

Chaque chapitre est décrit par la même colonne vertébrale : la croyance contestée, le
mécanisme nommé, la preuve, le chiffre à son échelle humaine. La colonne « sources »
donne les PMID déjà vérifiés dans le dépôt ; ce qui est marqué « à vérifier » n'a pas
encore été lu.

### S1 · « Pourquoi ça revient »

La vidéo 1 de `video/manger-sans-se-priver` (`SCRIPT-video-1.md`, `script-compact.txt`
pour le prompteur, `scenario.json`). Elle garde ses quatre chapitres : on ne réécrit pas
ce qui est vérifié.

| Ch. | Titre | La croyance | Le mécanisme nommé | La preuve | Le chiffre, à son échelle | Sources |
|---|---|---|---|---|---|---|
| 1 | Ce n'est pas ta volonté | j'ai pas assez de volonté | le déficit (la baignoire, 17 s, refermée à voix haute) puis l'assiduité | 160 personnes, 4 régimes, 1 an | un kilo d'écart entre le meilleur et le pire ; 20 sur 40 finissent l'année chez Ornish, 26 chez les deux régimes souples | Dansinger 2005, PMID 15632335 |
| 2 | Le levier que tu ne mâches jamais | les calories sont dans le dessert | la densité : 9 calories le gramme contre 4 | 100 g d'huile, 899 calories ; l'étude de satiété de 1995 | ta cuillère d'huile bien remplie, 135 calories, fait plus que le pot de crème dessert entier, 121 | Holt 1995, PMID 7498104 (utilisé pour le seul sens du gras sur la satiété, jamais pour son classement : conflit 14 de `scenario.json`) ; Westerterp 2004, PMID 15507147 |
| 3 | Ton estomac sent le volume | manger moins, c'est avoir faim | l'estomac ne compte pas, il sent quand il s'étire | le ballon d'eau (8 personnes, dit honnêtement) ; l'eau à côté contre l'eau dans l'assiette | deux grands verres d'eau ; 396 contre 392 calories avec le verre à côté, 289 avec l'eau dans le plat | Rolls 1999, PMID 10500012 ; Van Walleghen 2007, PMID 17228036 |
| 4 | Ce n'est pas la place, c'est le signal | un estomac plus petit règle le problème | le signal, pas le volume : la chirurgie retourne l'analogie | 65 000 opérés ; l'anneau contre le bypass ; les souris sans hormone de faim ; les légumes sur un an | un verre contre deux verres, même perte ; 14 kilos contre 30 sur cinq ans ; un kilo et demi d'écart en mangeant 225 g de plus par jour | le Roux 2006, PMID 16371744 ; PCORnet 2018, PMID 30383139 ; Ello-Martin 2007, PMID 17556681 |

| | |
|---|---|
| **État** | écrit, vérifié, 69 PMID, 9:08. Il manque 52 s : une ouverture à froid de 35 s (deuxième phrase : le titre ; puis les quatre questions) et une chute de 20 s qui conclut puis annonce « Quoi mettre dans l'assiette » : une heure d'écriture. Plus les quatre hooks (25 mots) et les quatre chutes (30 mots) de ses shorts, réécrits sans les gabarits « je te concède / ce qui survit », avec les deux corrections d'annexe de la vidéo 1 (§ 6) : ils se tournent dimanche 13, à débit reel. Le détail jour par jour est dans `PLAN-SEMI-18-OCTOBRE.md` S1 |
| **À auditer avant de tourner** | les quatre « moi aussi » des chapitres 1 à 4 (§ 5, règle 6) |
| **Inserts** | 8 : la baignoire en une composition de 17 s ou trois cartes, quatre SplitBar, deux avant/après (les deux verres d'eau ; l'anneau contre le bypass), le 20 sur 40 en carte |
| **Ses shorts** | sortent en S2 : mardi 22 · « La cuillère qui coûte plus cher que ton dessert » (ch. 2) ; jeudi 24 · « Ton estomac ne compte pas les calories. Il pèse. » (ch. 3) ; samedi 26 · « On lui a retiré 80 % de l'estomac, et ça n'explique rien » (ch. 4). Réserve : « Le régime que tu choisis ne prédit rien » (ch. 1), utilisé le samedi 10 octobre |
| **Miniature** | un SplitBar « un kilo d'écart » |

### S2 · « Quoi mettre dans l'assiette »

La vidéo 2 (`SCRIPT-video-2.md`). Quatre chapitres, numérotés 5 à 8 dans le dépôt.

| Ch. | Titre | La croyance | Le mécanisme nommé | La preuve | Le chiffre, à son échelle | Sources |
|---|---|---|---|---|---|---|
| 5 | Le poids de l'assiette | il y a une liste d'aliments à supprimer | la densité : des calories pour la place que ça prend | 18 femmes, trois versions du même menu, même poids dans l'assiette ; la soupe contre le snack contre rien d'imposé | 424 calories d'écart à poids identique, un déjeuner entier ; la pomme de terre à l'eau contre en chips, presque sept fois | Bell 1998, PMID 9497184 ; Rolls 2005, PMID 15976148 |
| 6 | Le levier fantôme | la petite assiette fait manger moins | le conseil vient d'un seul laboratoire, rétracté ; ce qui pèse, c'est la portion et la vitesse | 13 rétractations ; la réplication propre à 134 personnes ; la petite fourchette au restaurant | 19 calories d'écart entre 23 et 29 cm, même pas une demi-cuillère à café d'huile ; une pomme de terre de plus avec la petite fourchette | Wansink 2005, PMID 15827310, rétracté ; le bol sans fond non rétracté et répliqué en 2024 avec un effet de moitié, PMID 37917442 ; la fourchette : *Journal of Consumer Research*, jamais de PMID |
| 7 | L'aliment que tu as rayé de ta liste | s'interdire, c'est se contrôler | l'interdit rend l'aliment visible partout | les biscuits sous cloche ; 103 étudiantes, chocolat contre vanille ; 106 femmes et leur regard | ceux qui ont le plus mangé sont les gros amateurs qu'on n'avait privés de rien | Fisher & Birch 1999, PMID 10357749 ; Polivy 2005, PMID 16261600 |
| 8 | On ne vit qu'une fois | | déjà une chute : le contrôle souple contre rigide | 23 pratiquants de musculation, dix semaines : dix sur onze contre une sur quatre reprennent du muscle | cinq kilos six en moins, sur quatre-vingts ; et sur dix personnes qui seraient devenues diabétiques, il n'en reste que quatre, même chez ceux qui en ont repris la moitié | Westenhoefer 1999, PMID 10349584 (souple contre rigide) ; Conlin 2021, PMID 34187492 (les 23 pratiquants) ; Hall & Kahan 2018, PMID 29156185 (le diabète) ; le reste dans `scenario.json` |

| | |
|---|---|
| **État** | écrit, vérifié, 9:30. Il manque 30 s d'ouverture à froid. Six références sans PMID fiable restent signalées comme telles dans la description, jamais inventées |
| **À auditer** | les « moi aussi » des chapitres 5, 6, 7 |
| **Inserts** | 8 à 10 : deux avant/après (les deux assiettes de même poids ; la petite assiette), quatre SplitBar, la croix/coche, une liste en carte |
| **Ses shorts** | sortent en S3 : mardi 29 · « La petite assiette ne t'a jamais fait maigrir » (ch. 6, sans la séquence fourchette) ; jeudi 1er octobre · « Le même légume, sept fois plus cher » (ch. 5) ; samedi 3 octobre · « L'aliment que tu t'interdis » (ch. 7, sans le récapitulatif ni la carte « On ne vit qu'une fois »). Réserve : « La petite fourchette te fait manger plus » (ch. 6), qui demande un beat de 10 s en plus, à tourner dimanche 20 si le temps le permet |

### S3 · « Tu n'as jamais eu à le mériter » (la longue TDEE)

La version longue du reel `meriter` et du reel déficit. Source : `video/meriter-son-repas/SCRIPT.md`
et `TOURNAGE.md`, `video/deficit-calorique-fr`. À écrire en S1 et S2 ; 262 mots de reel
pour 1 650 à 1 750 mots nécessaires.

| Ch. | Titre | La croyance | Le mécanisme nommé | La preuve | Le chiffre, à son échelle | Sources |
|---|---|---|---|---|---|---|
| 1 | Le sport, c'est cinq pour cent | il faut brûler ce qu'on mange | le TDEE, la découpe de ce que tu brûles en une journée | la répartition typique d'une journée | le sport, environ 5 % ; presque tout le reste part à te maintenir en vie | le reel déficit et `meriter`, sources dans leurs légendes |
| 2 | Ce que tu dépenses en bougeant à côté | seule la séance compte | le NEAT : marcher, rester debout, les escaliers | Levine | 300 à 500 calories par jour, plus qu'une séance | Levine 2002, PMID 12468415 |
| 3 | La digestion bat le sport sur la journée | en dormant on ne brûle rien | la taxe à la digestion, sur la journée entière | Westerterp ; Halton & Hu | ta digestion, sur la journée, c'est le double de ta séance ; le rapport vaut sur une journée, jamais sur un aliment isolé | Westerterp 2004, PMID 15507147 ; Halton & Hu 2004, PMID 15466943 |

| | |
|---|---|
| **Attention** | le chapitre 1 rejoue le reel `meriter` qui sort le samedi 19. Il se réécrit à 165 mots/min avec 15 % de mots en plus, son landing devient un raccord, et **son short n'est pas redécoupé** : le reel est déjà sorti. Le reel reçoit sur YouTube le champ « vidéo associée » vers cette longue |
| **Inserts** | les quatre animations existantes des deux reels (la découpe du TDEE, digestion contre sport, les trois leviers, la variante de `meriter`) recalées ou reparamétrées, jeudi de S3, 2 à 3 h ; plus SplitBar |
| **Ses shorts** | sortent en S4 : mardi 6 octobre · « Ce que tu dépenses en bougeant à côté » (ch. 2, neuf) ; jeudi 8 · « Ta digestion brûle plus que ta séance » (ch. 3, neuf) ; samedi 10 · « Le régime que tu choisis ne prédit rien » (la réserve de S1) |
| **Concession obligatoire** | rien de tout ça n'annule le total : si tu manges plus que tu brûles sur la durée, tu prends du poids. La découpe est une répartition typique, pas une constante |

### S4 · « Une calorie, c'est une calorie »

Composée uniquement de matière existante : le script de `video/une-calorie-est-une-calorie/SCRIPT.md`,
ses suites 02 et 05, et le chapitre 2 de la vidéo 1.

| Ch. | Titre | La croyance | Le mécanisme nommé | La preuve | Le chiffre, à son échelle | Sources |
|---|---|---|---|---|---|---|
| 1 | La taxe à la digestion | seul le total compte, la source est un détail | l'effet thermique : la taxe que ton corps prélève sur chaque bouchée | deux personnes, même total, 30 % contre 15 % de protéines | 200 calories d'huile, tu en gardes 196 ; 200 de poulet, 150 ; sur un an, presque deux semaines de repas d'écart. **Le 50 ou 70 calories par jour est tranché en S2** en lisant Westerterp 2004 et Morton 2018 | Westerterp 2004, PMID 15507147 ; Halton & Hu 2004, PMID 15466943 ; Morton 2018, à vérifier |
| 2 | Le gras à neuf calories | le gras fait grossir parce qu'il a neuf calories | la densité (la carte 9-4-4) contre la destination | 899 calories aux cent grammes ; le 121 contre 135 du chapitre 2 de la vidéo 1 | ta cuillère bien remplie fait plus que le pot de crème dessert. Le « stocker coûte 3 %, convertir 25 % » de la suite 02 **seulement s'il est sourcé avant**, sinon il saute | sources vérifiées du chapitre 2 de la vidéo 1 |
| 3 | L'alcool | l'alcool, c'est du sucre | 7 calories le gramme, du côté de l'huile, et tu ne le mâches pas | l'insert alcool du chapitre 2 de la vidéo 1, écrit et sourcé | ton verre de rouge : bien plus près de l'huile que du sucre | `scenario.json`, axe liquides-et-boissons |

| | |
|---|---|
| **Chute du short 1** | le landing d'origine, mot pour mot : « Les calories décident si tu perds du poids. Les macros décident de quoi tu le perds. » |
| **Ce qui part après le 19 octobre** | la suite 03 « les glucides le soir » (tabou #18, à sourcer) et la suite 04 « les fibres » (sans PMID) |
| **Inserts** | les trois assiettes à 200 calories en images fixes Higgsfield ; les trois compositions du script (barres qui se vident, deux silhouettes, liste qui se remplit) sur SplitBar et cartes |
| **Ses shorts** | sortent en S5 : mardi 13 octobre · « Une calorie, c'est une calorie » (le reel de 82 s, tel quel, avec son landing) ; jeudi 15 · « Le gras a neuf calories, et alors ? » (ch. 2) ; samedi 17 · « L'alcool, c'est du côté de l'huile » (ch. 3) |
| **À CONFIRMER** | le reel « Une calorie » est écrit, pas tourné : le sortir « tel quel » demande une journée de tournage et d'animation qui n'est dans le budget d'aucune semaine. Sinon, le short du mardi 13 est le noyau [S] du chapitre 1, découpé le vendredi 9 octobre comme les deux autres, avec le landing d'origine en chute |

### S5 · « Mange comme le corps que tu vises »

Le nom de la série. Le plan de sept beats (§ 7) devient trois chapitres ; les chiffres
sortent de YouBud en S3.

| Ch. | Titre | La croyance | Le mécanisme nommé | La preuve | Le chiffre, à son échelle | Sources |
|---|---|---|---|---|---|---|
| 1 | « Il faut un régime » | il faut un régime | le corps cible : chaque corps a un budget | 160 personnes, quatre régimes, un kilo d'écart, la moitié qui lâche les deux plus durs ; rappel en 20 s, pas rejoué | **YouBud à l'écran au moment du calcul**, et la phrase sur Yazio : « je trouve Yazio très bien, je la recommande » | Dansinger 2005, PMID 15632335 |
| 2 | « Il faut manger moins » | il faut manger moins | l'écart entre un corps de 80 et un corps de 70, même taille | les deux budgets YouBud, même taille, même âge, même activité | l'écart en cuillères d'huile par jour, **chiffre à sortir de YouBud** ; le device population : deux silhouettes, chacune avec son budget | YouBud |
| 3 | « Donc je mange comme un 70 dès demain » | on change tout d'un coup | par paliers, avec l'estomac de 80 : ce qui contient de l'eau remplit, l'huile au filet, les protéines calent | les chapitres 3 et 5 rappelés en 20 s | un demi-kilo par semaine, **À CONFIRMER** | Rolls 1999, PMID 10500012 ; Bell 1998, PMID 9497184 |

| | |
|---|---|
| **Chute** | « C'est lent. Un demi-kilo par semaine, c'est déjà bien. Mais tu ne finis jamais un régime. Parce que t'en as jamais commencé un. » La vitesse est à confirmer |
| **Ce qu'elle ne fait pas** | le sens « prendre » reste entièrement à S6 |
| **Ses shorts** | découpés vendredi 9, programmés samedi 10 pour toute la semaine de course : mardi 13 · « Tu veux peser soixante-dix. Alors pourquoi tu manges comme un quatre-vingts ? » ; jeudi 15 · « Dix kilos de moins, c'est une cuillère d'huile par jour » (chiffre exact selon YouBud) ; samedi 17 · « Ton estomac ne rétrécit pas sur commande » |

### S6 · « Vingt kilos sans prendre de ventre »

Ton histoire, la plus légère à produire : photos et tête parlante, 3 à 4 inserts SplitBar.
Écrite en S5 à partir de l'entretien de S3 et de Wang 2010.

| Ch. | Titre | La croyance | Le mécanisme nommé | La preuve | Le chiffre, à son échelle | Sources |
|---|---|---|---|---|---|---|
| 1 | « Prendre du poids, c'est prendre du gras » | prendre du poids, c'est prendre du gras | le surplus se dose comme un déficit | tes chiffres réels | ton surplus par jour, en cuillères d'huile, **À CONFIRMER** à l'entretien de S3 | ton journal de poids |
| 2 | « Il faut manger énorme » | il faut manger énorme | un petit surplus, longtemps | tes kilos par mois, la durée de 60 à 80, ce qui a raté | **À CONFIRMER** | ton journal de poids |
| 3 | « Un kilo de muscle brûle cent calories par jour » | un kilo de muscle brûle cent calories | beaucoup moins, et c'est quand même le meilleur placement | Wang 2010 | ordre de grandeur réel, à vérifier | Wang 2010, à vérifier, PMID à retrouver |

| | |
|---|---|
| **Photos** | `D:\videos\trailer\avant\` (60 kg) et `apres\` (IMG_8249, IMG_8254) |
| **Packaging** | sur le mécanisme, pas sur la transformation : titre et miniature portent le surplus quotidien en calories et la durée ; les deux corps restent dans la vidéo. Une miniature avant/après attire l'audience « transformation », qui n'est pas celle des cinq longues précédentes |
| **La porte de décision** | à la fin de S3 : si le journal de poids n'existe pas, S6 devient « Ta montre ne sait pas ce que t'as brûlé » (ci-dessous), mêmes dates, même légèreté ; « Vingt kilos » passe après le 19 |
| **Ses shorts** | se découpent la semaine du 19 |

### Après le 19 octobre

Le rythme continue sans trou, une longue par semaine, dans cet ordre. Après six longues,
on relit le journal et on réordonne le reste ; pas avant.

| Sem. | Longue | Les trois chapitres | Source, état |
|---|---|---|---|
| S7 · 26 oct → 1er nov | **« Manger quand tu cours »**, la première après la course, pour rattraper les amis de course dans le format qui découvre | 1 · le coût du kilomètre : environ une calorie par kilo de poids de corps et par kilomètre, que tu ailles vite ou lentement ; un semi entier, c'est un repas et demi (A3 et B1) · 2 · la faim d'après n'est pas une dette : le glycogène se remplit avec du riz, pas avec du gras (B2) · 3 · le budget d'un jour de course et d'un jour de repos, avec YouBud (B3) | les anciens #11 et #12 fusionnés ; le tableau des six semaines rempli. L'approximation du kilomètre est à vérifier avant de la dire aussi net. Sans chrono, sans allure. Script écrit en S6, mercredi 21 et samedi 24 octobre ; tournée dimanche 25, en ligne dimanche 1er novembre, dans le cycle, sans glissade |
| S8 | **« Ta montre ne sait pas ce que t'as brûlé »** (si non utilisée en S6) | 1 · la montre devine à partir du pouls (Shcherbina 2017 : erreur d'un quart à presque le double) · 2 · l'après-brûlage, un dixième de la séance (A1, LaForgia 2006) · 3 · ce qu'on compte à la place : la distance et le poids | ancien #13 et A1 ; Shcherbina 2017 et LaForgia 2006 à vérifier, PMID à retrouver |
| S9 | **« Le cardio fait fondre le muscle ? »** | 1 · ce n'est pas la course, c'est le déficit sans protéines (A2, Longland 2016) · 2 · le groupe cardio de Bryner 1999 · 3 · la silhouette, c'est le rapport | ancien #15 et A2 ; teardown dans la bibliothèque ; Longland 2016 et Bryner 1999 à vérifier. Version lourde, trois animations |
| S10 | **« Manger le soir fait grossir ? »** | le total sur 24 h d'abord ; la nuance réelle sur l'heure ; la suite 03 de « Une calorie » | tabou #18, **à sourcer avant d'écrire** |
| S11 | **« Ma mère a essayé tous les régimes »**, après dix longues, quand quelqu'un est là pour l'entendre | vingt ans de salades, ce que tu lui as dit enfant, comment tu l'as aidée, le fait qu'elle a réussi ; la raison du « sans jugement » | ancien #24 ; **avec son accord, au degré qu'elle choisit** (acquis le 6 septembre pour en parler, pas pour l'image ; si elle apparaît, on lui demande le moment venu) |
| ensuite | les tabous en version lourde | Coca zéro contre Coca (#19, teardown existant) · le week-end qui annule la semaine (#22, un calcul, aucune source nécessaire) · le jeûne intermittent (#21) · le sucre est une drogue ? (#20) · Ozempic (#23, le vrai tabou, sourcé sérieusement avant d'y toucher) · « Ce que l'étiquette ne compte pas » (les fibres, suite 04) · « Ce que tu bois » (#10, sans l'alcool déjà traité en S4) · « Combien de calories pour prendre du muscle » (#16) si S6 ne l'a pas épuisé · « Courir à jeun brûle plus de gras ? » (#14, à sourcer, non placé) | aucun tabou ne s'écrit avant que la source soit lue |

### Où est passée chaque idée

| Ancienne entrée | Où elle vit maintenant |
|---|---|
| #1 L'huile coûte plus cher que ton dessert | short de réserve, script complet en § 7 ; sa matière est le chapitre 2 de S1 |
| #2 Mange comme le corps que tu vises | S5, la longue entière |
| #3 Vingt kilos sans prendre de ventre | S6 |
| #4 Un déficit calorique, c'est pas manger moins | publié le 27 août ; short du mardi 15 septembre tel quel ; sa matière est le chapitre 1 de S3 |
| #5 Tu n'as jamais eu à le mériter | short du samedi 19 septembre ; sa version longue est S3 |
| #6 Ce qui te cale, c'est le poids de l'assiette | chapitre 5 de S2, et chapitre 3 de S1 |
| #7 Pourquoi ça revient | chapitre 1 de S1, et le titre de la longue |
| #8 L'aliment que tu t'interdis | chapitre 7 de S2 |
| #9 Une calorie, c'est une calorie | S4, chapitre 1 ; le reel sort comme short le mardi 13 octobre (**À CONFIRMER**, § 3 : il n'est pas tourné) |
| #10 Ce que tu bois | l'alcool : chapitre 3 de S4 ; le reste après le 19 |
| #11 Ce que brûle vraiment un semi, #12 Pourquoi tu maigris pas en courant | fusionnés dans S7 |
| #13 Ta montre | S8, ou S6 si la porte de S3 se ferme |
| #14 Courir à jeun | après, non placé, à sourcer |
| #15 Le cardio fait fondre le muscle ? | S9 |
| #16 Combien de calories pour prendre du muscle | après, si S6 ne l'a pas épuisé |
| #17 Le muscle brûle des calories au repos ? | chapitre 3 de S6 |
| #18 à #23, les tabous | S10 et ensuite |
| #24 Ma mère | S11 |
| les suites 02 à 05 de « Une calorie » | 02 et 05 dans S4 ; 03 dans S10 ; 04 ensuite |
| A1 l'après-brûlage | chapitre 2 de S8 |
| A2 le muscle et le déficit | chapitre 1 de S9 |
| A3 courir vite ne brûle pas plus | chapitre 1 de S7 ; se dit aussi en stories la semaine 3, sans allure |
| B2 la faim d'après | chapitre 2 de S7 ; aussi en stories la semaine 2 |
| B3 le budget d'un jour de course | chapitre 3 de S7 ; aussi en stories la semaine 3 |
| B4 l'assiduité | reste une story ; son mécanisme est le chapitre 1 de S1 |
| B1, A4, A5, A6, B5, le jour de course | des stories, aux dates prévues, dans `STORIES-SEMI.md` |

---

## 4. L'ordre

Le premier mois décide de l'empreinte du compte : l'algorithme apprend qui tu es sur
les premières vidéos. On commence par ce qui surprend le spectateur, pas par ce qui
parle de toi. Et on décale d'un cran ce qui est écrit vers ce qui ne l'est pas : la
longue TDEE est la plus facile à écrire, pas la plus facile à sortir en premier.

| Ordre | Longue (dimanche 18 h) | Ses trois shorts (la semaine suivante) | Pourquoi là |
|---|---|---|---|
| **S1** · 20 sept, tournée dim 13 | « Pourquoi ça revient », **et le trailer une heure après** | les shorts de S1 viennent d'avant : mardi 15 · « Déficit calorique ≠ manger moins » (existe, zéro montage) ; jeudi 17 · « 300 calories par jour » (**À CONFIRMER** : le passage NEAT du reel déficit ? le fichier ?) ; samedi 19 · « Tu n'as jamais eu à le mériter » (deux pickups, voie Kdenlive une seule fois) | écrite, vérifiée, avec son prompteur et ses shorts annexés. Il ne manque que 52 s |
| **S2** · 27 sept, tournée dim 20 | « Quoi mettre dans l'assiette » | ceux de « Pourquoi ça revient » | écrite, vérifiée. La semaine la moins chère : aucun dispositif neuf |
| **S3** · 4 oct, tournée dim 27 sept | « Tu n'as jamais eu à le mériter », la longue TDEE | ceux de « Quoi mettre dans l'assiette » | écrite en S1 et S2, les animations existent |
| **S4** · 11 oct, tournée dim 4 | « Une calorie, c'est une calorie » | ceux de la longue TDEE, plus la réserve | composée de matière existante ; aucune écriture pour elle-même en S4 |
| **S5** · 18 oct, le jour de course, tournée dim 11 | « Mange comme le corps que tu vises » | ceux de « Une calorie » | le nom de la série, quand le spectateur a déjà vu quatre fois que tu sais compter ; exportée et programmée le jeudi 15, rien à faire le jour de la course |
| **S6** · 25 oct, tournée sam 17 | « Vingt kilos sans prendre de ventre », ou « Ta montre » | ceux de « Corps cible », programmés dès le samedi 17 | la plus légère à produire ; une session courte la veille de la course, la semaine d'après le semi |
| après | S7 à S11 et ensuite (§ 3) | | dans l'ordre du § 3, réordonné après six longues en relisant le journal |

**La réserve**, pour une semaine qui casse : « Le régime que tu choisis ne prédit rien »
(chapitre 1 de S1, utilisé en S4) ; « La petite fourchette te fait manger plus »
(chapitre 6 de S2, avec son beat de 10 s en plus) ; et les deux reels complets
« L'huile coûte plus cher que ton dessert » et « Une calorie, c'est une calorie »,
écrits, à tourner et animer une journée chacun.

**Ce qu'on ne fait jamais** : une longue sur la course avant le 19 octobre. Une seule
vidéo hors cible plombe les suivantes sur un compte de 101 abonnés. Le sport vit en
stories et en b-roll sous une phrase de calories.

**Les trois messages que tu veux faire passer**, « qui je suis », « c'est quoi le
projet », « ce qu'on prépare », n'ont pas droit à trois vidéos de présentation : une
chaîne neuve qui ouvre là-dessus parle à personne. Ils prennent **les trois
publications épinglées** sur Instagram :

1. le trailer : qui tu es, en trente-cinq secondes, tourné vers le spectateur
2. le premier short : ce que tu fais ici
3. la « à la une » SEMI, avec la première story de l'expérience : ce qu'on prépare, et le Hyrox en une phrase

---

## 5. La méthode d'écriture d'une longue

Une longue = **une ouverture à froid, trois chapitres, une chute.** Cible 10:00 à
10:30, plafond 11:00. Exception pour les deux scripts déjà écrits, qui gardent leurs
quatre chapitres.

| Bloc | Durée | Mots, à 165 mots/min | Ce qu'il fait |
|---|---|---|---|
| Ouverture à froid | 30 à 40 s | 80 à 110 | première phrase : un hook de science-reel. **Deuxième phrase : le titre de la vidéo, mot pour mot**, la confirmation du clic. Puis les trois questions des trois chapitres, nommées. Elle ne dépense pas le hook du chapitre 1 |
| Chapitre × 3 | 160 à 180 s chacun | 440 à 500 chacun | la colonne vertébrale complète, ci-dessous |
| Carte 9-4-4 | 4 s | | rendue une fois, insérée dans toute vidéo qui compte des calories |
| Chute | 15 à 20 s | 40 à 55 | elle **conclut** : concède, puis nomme ce qui survit. Puis elle annonce la longue de dimanche prochain en une phrase |

### Chaque chapitre

Un chapitre = **une croyance contestée, un mécanisme nommé, une preuve, un turn, une
résolution.** C'est la colonne vertébrale du science-reel, sans son hook ni sa chute
autonomes.

**L'ordre d'écriture est l'inverse de l'ordre de montage.** On écrit chaque chapitre
comme un short auquel on ajoute son contexte. D'abord le noyau du short, puis le
contexte du long autour. Sur la page, chaque bracket porte une marque :

| Marque | Ce que c'est | Contenu |
|---|---|---|
| **[S]** | survit dans le short | le mécanisme, la preuve, le turn, la résolution. L'ensemble [S] d'un chapitre fait **180 à 240 mots** et contient obligatoirement le turn |
| **[L]** | long seul | la deuxième preuve, le « toi aussi », le rappel d'un chapitre précédent, le raccord vers le suivant, l'ouverture à froid |

Le vendredi, le monteur suit les marques. Il ne choisit rien.

### Dans cet ordre

Le milieu est la partie la plus facile, et l'écrire en premier est comment on finit
avec deux mille mots et pas de turn.

1. **La croyance de chaque chapitre**, en une phrase : « Tout le monde pense X. En fait Y. » Trois croyances, trois chapitres. Si l'une ne s'écrit pas comme ça, ce n'est pas un chapitre, c'est une fiche.
2. **Le noyau [S] de chaque chapitre** : le hook du short (25 mots maximum), le mécanisme nommé, la preuve, le turn mot pour mot (« Donc je [la conclusion que le spectateur vient de tirer] ? » « Pas vraiment. »), la résolution, la chute du short (30 mots maximum, elle concède puis nomme ce qui survit). 180 à 240 mots sans le hook ni la chute.
3. **Le chiffre et son échelle**, dans chaque noyau : jamais un nombre nu. Des cuillères d'huile, des desserts, des repas, des journées de bouffe. Si tu ne peux pas l'ancrer, coupe-le.
4. **Le contexte [L]** : la deuxième preuve, le rappel du chapitre précédent en 20 s au plus, jamais rejoué, le raccord vers le suivant. Chaque transition est un « mais » ou un « donc ».
5. **L'ouverture à froid** : le hook, puis le titre mot pour mot, puis les trois questions.
6. **La chute qui conclut** : concède, nomme ce qui survit, annonce dimanche prochain. Pas de résumé, pas d'appel à l'action, pas de lien YouBud.
7. **Les cinq titres et la ligne de miniature** (§ 9), lus à voix haute comme le reste. Le plus court gagne.
8. **Les inserts** : trois compositions au plus par chapitre, le mécanisme, la preuve, la résolution, sur les dispositifs existants. Un article à afficher par chapitre au plus, capture d'écran avec la phrase surlignée ; les autres sont cités dans la description.
9. **Les listes « À couper »** de chaque chapitre (§ 6).
10. **La légende**, en six parties (ci-dessous), une pour la longue et une par short.
11. **La passe de contrôle**, avec le grep de performance (ci-dessous). Avant tournage, jamais après : ce qui est dit à l'image ne se corrige pas.
12. **Lire à voix haute, chrono en main** : 10:00 à 10:30. Ce qui sonne écrit se réécrit. C'est le rituel du dimanche soir pour le script de la semaine suivante.

### Les huit règles du long format

Tirées de la section « Scaling to long form » du skill `science-reel`, qui les a
apprises en portant le format à neuf minutes. Le réglage du reel (185 mots/min, plans
de 3 s) produit un long format inregardable : le spectateur regarde une fois,
linéairement, et doit être enseigné.

1. **Débit 160 à 175 mots/min, plans de 3 à 5 s.** On accepte la durée qui en découle.
2. **Une métaphore est un micro-module.** Installée en 15 à 20 s, chaque terme ancré à voix haute par une phrase entière (« le niveau de l'eau, c'est ton poids »), **refermée à voix haute** (« on peut oublier la baignoire ») et jamais reprise. Grep des noms de la métaphore dans les chapitres suivants avant de tourner.
3. **On ne dit jamais au spectateur ce qu'il conclut.** Sa pensée s'énonce à sa place (« alors on se dit : … ») et s'affiche entre guillemets à l'écran, pour qu'aucune capture isolée ne se lise comme l'affirmation de la vidéo.
4. **Aucun mot sans contexte** : un terme est introduit avant d'être utilisé.
5. **Aucune unité de laboratoire.** Deux grands verres d'eau, pas 400 millilitres. Calories et kilos restent ; tout le reste devient un objet que le spectateur a tenu. Aucune corrélation, aucune valeur p, aucune taille d'effet prononcée, aucune décimale épelée. Et un estomac ne compte rien : il sent quand il s'étire.
6. **Chaque phrase littéralement vraie**, lue au premier degré. **Rien à la première personne qui ne soit pas vrai pour toi.** Les sept « moi aussi » des huit chapitres écrits sont à auditer contre ta vie : ceux qui racontent perdre, reprendre et douter de sa volonté sont l'histoire de ta mère, pas la tienne. Ils se disent : « Ma mère s'est dit ça pendant vingt ans. Je l'ai vue faire. » Une seule occurrence de « moi aussi » par short. La règle complète des trois remplacements est dans `FONDAMENTAUX.md` § 6.
7. **Écrire comme quelqu'un qui parle**, pas comme une fiche : chaleur, pas autorité ; concéder quand la preuve est mince (« honnêtement, huit personnes, c'est pas grand-chose ») ; une phrase courte après une longue ; bannir les groupes nominaux empilés et le « il faut » impersonnel.
8. **Diviser avant de compresser.** Si dix minutes ne suffisent pas à expliquer proprement, on divise en deux longues à la couture où l'argument tourne déjà. On ne serre pas.

Les sept « moi aussi » à auditer, avec toi, 30 min avant le dimanche 13 :

| Ch. | La phrase | Statut |
|---|---|---|
| 1 | « Moi aussi je me suis dit ça, pendant des années. » (la volonté) | **À CONFIRMER** |
| 2 | « Moi, pendant des années, je surveillais le sucre. Le gras, je le voyais pas. » | **À CONFIRMER** |
| 3 | « Moi aussi j'ai cru ça pendant des années. Que j'étais juste pas assez solide. » | **À CONFIRMER** |
| 4 | « Moi aussi je l'ai cru. » (l'estomac plus petit) | **À CONFIRMER** |
| 5 | « Moi aussi je l'ai cherchée, cette liste. Pendant des années. » | **À CONFIRMER** |
| 6 | « Honnêtement, ces conseils sont pas idiots. Moi aussi je les ai suivis. » | **À CONFIRMER** |
| 7 | « Moi aussi j'ai eu cet aliment-là. Et plus je me l'interdisais, plus j'y pensais. » | **À CONFIRMER** |

Ce qui n'est pas vrai pour toi devient « ma mère, je l'ai vue faire », ou saute.

### Les règles maison

- Chaque chiffre a une échelle humaine : cuillères d'huile, desserts, journées de bouffe.
- Les deux côtés d'une comparaison partagent une unité, et une unité n'est jamais l'objet d'un verbe d'action (l'huile se mange, une dépense se brûle).
- Chaque transition est un « mais » ou un « donc ».
- On valide avant de corriger : jamais un dunk en première ligne.
- Un seul scratch par chapitre au plus, sur le turn. Une seule musique par longue.
- Aucune performance à l'image : « je prépare un semi-marathon, le dix-huit octobre » se dit ; le temps ne se dit pas, l'allure ne se dit pas.

### La légende, six parties

Sur chaque short, et dans la description de chaque longue. Les cinq premières sont la
légende Instagram ; la sixième ne s'ajoute que lorsque la longue correspondante est en
ligne.

| # | Partie | Ce que c'est |
|---|---|---|
| 1 | la thèse à plat | la phrase de la vidéo, sans le retournement |
| 2 | le qualificatif | ce que la thèse ne veut pas dire |
| 3 | l'expansion | le mécanisme, en trois lignes, avec les chiffres et leur échelle |
| 4 | la réserve honnête | ce que ça ne dit pas, la limite de la preuve |
| 5 | les sources | les PMID, jamais un DOI que tu n'as pas ouvert ; une référence sans PMID fiable est signalée comme telle |
| 6 | **la sixième ligne**, après les sources, jamais en première ligne | « Le mécanisme entier, dix minutes : *Mohamed Elmdimegh* sur YouTube. » Un nom à taper, pas un lien, pas « version complète » : le short est un mini-reel autonome, pas un extrait |

**Jamais de lien YouTube posté sur Instagram ni sur TikTok.** La bio Instagram garde un
seul lien, YouBud. Sur YouTube Shorts, et là seulement, le champ « vidéo associée »
pointe vers la longue. Le renvoi ne se dit jamais dans la bouche : le landing reste
philosophique.

**La description YouTube de la longue**, en plus des six parties : les chapitres en
horodatage ; tous les PMID de la vidéo (un script de vingt lignes, à écrire dans
`video/manger-sans-se-priver/tools/`, les sort de `scenario.json` ; `build_2_annexes.py`
en produit déjà le tableau dans les annexes) ; les références sans
PMID signalées comme telles ; aucun lien YouBud en fin de vidéo (§ 8, règle 3).

### La passe de contrôle

Celle de `video/manger-sans-se-priver/tools/README.md`, appliquée à chaque script
long, à chacun de ses textes de short, et à chaque légende :

- [ ] la métaphore confinée à son micro-module, refermée à voix haute, ses noms absents des chapitres suivants
- [ ] aucun jargon dans la bouche : millilitre, corrélation, « tu viens de conclure », valeur p
- [ ] aucun plan indicible : aucun plan au-dessus de 190 mots/min
- [ ] les accents : un français normal en compte environ 4 % ; un chapitre à 0 % signale un problème
- [ ] **le grep de performance** : aucun temps d'épreuve, en chiffres ou en lettres ; aucun des mots chrono, allure, record, VMA, « je vise », « objectif de temps », « temps visé », « min/km » ; « fraction » seulement quand elle ne désigne pas un temps ; aucune durée d'épreuve. La liste complète est dans `FONDAMENTAUX.md` § 6 et dans `tools/README.md`, section « Le grep de performance », qui lit tout `scenario.json` (narration, textes, hooks, chutes, légendes) ; ce qui n'est pas dans `scenario.json` (le trailer, les stories) se passe à la main
- [ ] chaque « moi aussi » vrai pour toi, un seul par short
- [ ] les deux côtés de chaque comparaison partagent une unité
- [ ] chaque chiffre a son échelle
- [ ] lu à voix haute, chrono en main : 10:00 à 10:30 pour la longue, 70 à 100 s pour chaque short

Elle tourne avant tournage, jamais après.

---

## 6. La méthode du short

Un short n'est pas un chapitre coupé. C'est le noyau [S] d'un chapitre, à un autre
débit, avec un hook et une chute tournés en plus. C'est la règle des annexes de
`video/manger-sans-se-priver` : « chaque chapitre est déjà un mini-reel ; il ne lui
manque qu'un hook et une chute autonomes ».

| Élément | Longueur | Tourné quand |
|---|---|---|
| **Le hook du short** | 25 mots maximum, 10 s maximum | le lundi, en plus, à débit reel (185 mots/min) |
| **Le bloc [S]** | 180 à 240 mots, avec le turn | le lundi, dans la prise du long à 165 mots/min ; accélération dans CapCut **jamais au-delà de 1,08×** |
| **La phrase du mécanisme** | une phrase | le lundi, **retournée une seconde fois à débit reel** : trois répliques de plus par session, 15 min |
| **La chute du short** | 30 mots maximum, 10 s maximum | le lundi, en plus, à débit reel |

Cible **70 à 100 s** ; plafond dur 2:00 quand un mécanisme ne tient pas en moins, mais
c'est l'exception, pas le réglage. **Sous 70 s, le short ne sort pas.**

### La chute du short

Elle concède, puis nomme ce qui survit, **sans jamais dire « je te concède » ni « ce
qui survit »** dans la bouche : lus huit fois dans le même feed, ces deux gabarits
s'entendent. Le modèle, c'est la chute de « L'huile » (§ 7) : « Après, personne ne pèse
son huile toute sa vie. Tu verses au filet, pas au glouglou. Et tu gardes ton
dessert. »

Le short ne finit jamais sur un raccord. Tout ce qui renvoie à un autre chapitre se
coupe : le récapitulatif, le rappel, « et ça, c'est le chapitre d'après ». C'est
exactement le type de fin qui fait passer un short pour une vidéo coupée.

### La liste « À couper »

Chaque chapitre porte, dans le script, sa liste au format des annexes de
`SCRIPT-video-1.md` et `SCRIPT-video-2.md` :

| Ligne | Contenu |
|---|---|
| **HOOK à tourner** | les 25 mots, mot pour mot |
| **CHUTE à tourner** | les 30 mots, mot pour mot |
| **À couper** | le premier et le dernier bracket du chapitre (ce sont les raccords) ; tout ce qui renvoie à un autre chapitre ; la deuxième preuve si le budget le permet |
| **Alerte budget** | si le short passe sous 70 s après les coupes, le beat à tourner en plus, ou le short ne sort pas |

Les huit listes existantes sont à refaire contre le bracket actuel : leurs timecodes
(1:06, 1:09, 1:10, 1:15) datent d'une version à 70 s par chapitre. Une heure,
mécanique.

### Les quatre corrections d'annexe, avant S2

Quatre textes d'annexe enfreignent déjà les règles du § 5 :

| Où | Avant | Après |
|---|---|---|
| vidéo 1, short 4, la chute | la corrélation épelée « zéro virgule zéro sept… » | « Vingt sur quarante ont fini l'année chez Ornish. Le régime, lui, fait un kilo d'écart. » |
| vidéo 2, short 1, la chute | « taille d'effet… quinze fois plus lourd » | « Ralentir pèse presque autant que la portion qu'on te sert. L'assiette : dix-neuf calories. » |
| vidéo 2, short 3, le hook | « Mets les deux mots à la poubelle » | « Tu tries entre les aliments sains et ceux qui font grossir. Moi aussi, pendant des années. Sauf que ton estomac ne lit pas d'étiquette. Il pèse. » |
| vidéo 1, short 1, le hook | « le plus gros poste de dépense de ta journée » | « le plus gros poste de ta journée » : l'huile se mange, une dépense se brûle |

Et le titre du short 2 de la vidéo 1 perd « il compte des millilitres » : « Ton estomac
ne compte pas les calories. Il pèse. »

Chaque correction se fait avant le tournage qui l'enregistre : celles de la vidéo 1
avant dimanche 13 (ses hooks et chutes se tournent ce jour-là), celles de la vidéo 2 samedi
19, avant dimanche 20. Les huit listes « À couper » suivent le même calendrier : vidéo 1
jeudi 17, elles servent au découpage de vendredi 18 ; vidéo 2 samedi 19, ou jeudi 24 au
plus tard.

### Le découpage du vendredi

| | |
|---|---|
| **Quand** | vendredi, 3 h pour les trois shorts, 1 h chacun, après le packaging de la longue |
| **Depuis quoi** | la timeline du long déjà montée : le short hérite des sous-titres corrigés et des inserts. Le recadrage 9:16 est fixe, un cran plus serré que le cadre du long ; jamais de recadrage animé |
| **Comment** | suivre les marques [S] et la liste « À couper ». Poser le hook tourné, le bloc [S] accéléré à 1,08× au plus, la phrase du mécanisme à débit reel, la chute tournée. Les inserts sont rendus une seule fois en 1080×1920 et passent plein cadre |
| **Sous-titres** | blocs de 2 à 4 mots, entre 70 et 78 % de la hauteur ; rien dans les 12 % du haut ni les 20 % du bas (l'interface TikTok et Shorts couvre le bas) ; aucun sous-titre sur le hook |
| **Le son** | la musique du long ; le scratch sur le turn ; la signature riser/whoosh/impact |
| **La légende** | les six parties du § 5 ; la sixième ligne seulement si la longue est en ligne |
| **Le titre YouTube Shorts** | reprend le hook du short, pas le titre de la longue |
| **Programmation** | le samedi, 1 h, les dix mises en ligne de la semaine suivante : YouTube Studio, Meta Business Suite, planificateur TikTok. Un Short YouTube n'est jamais en ligne avant la longue qu'il découpe |
| **Le contrôle** | lu chrono en main : 70 à 100 s ; le grep de performance sur le texte et la légende |

---

## 7. Les scripts

### « Mange comme le corps que tu vises », le plan validé

Le nom de la série, en S5. Le plan en sept beats est écrit et validé ; il devient les
trois chapitres du § 3. Les chiffres sortent de YouBud avec ton profil réel, en S3.

| Beat | Contenu | Ce qu'il faut |
|---|---|---|
| Hook, assiette animée | deux silhouettes de la même taille, 80 et 70, chacune avec son budget du jour affiché en dessous. « Tu veux peser soixante-dix. Alors pourquoi tu manges comme quelqu'un de quatre-vingts ? » | le device population, à construire |
| Pivot | on valide : « Un régime, ça marche. Vraiment. Cent soixante personnes, quatre régimes, un an : tout le monde a perdu. » | chapitre 1, sources vérifiées |
| Mécanisme, nommé | **le corps cible.** Chaque corps a un budget. Un corps de soixante-dix dépense moins qu'un corps de quatre-vingts, tous les jours, pour toujours. Tu manges le budget du corps que tu veux, et le corps suit | **le chiffre à sortir de YouBud** : le budget d'un corps de 70 contre 80, même taille, même âge, même activité. Puis l'écart en cuillères d'huile |
| Preuve | les quatre régimes : un kilo d'écart entre le meilleur et le pire. Et la moitié a lâché les deux plus durs. Ce qui a marché, c'est pas le régime, c'est tenir | chapitre 1 |
| **Turn** | « Donc je mange comme un corps de soixante-dix dès demain, et j'attends ? » « Enfin… pas vraiment. » | scratch |
| Résolution | ton estomac de quatre-vingts ne rétrécit pas sur commande : le budget de soixante-dix, avec le volume de quatre-vingts. Ce qui contient de l'eau remplit, l'huile se verse au filet, les protéines calent. Et par paliers, pas d'un coup | chapitres 3 et 5, et la vidéo 1 |
| Chute | « C'est lent. Un demi-kilo par semaine, c'est déjà bien. Mais tu ne finis jamais un régime. Parce que t'en as jamais commencé un. » | la vitesse à confirmer |

Comment les sept beats se répartissent en trois chapitres :

| Chapitre | Beats du plan | Ce qu'on ajoute |
|---|---|---|
| 1 · « Il faut un régime » | le pivot et la preuve (les 160 personnes, rappel en 20 s, pas rejoué), le mécanisme nommé | YouBud à l'écran au moment du calcul ; la phrase sur Yazio |
| 2 · « Il faut manger moins » | le hook (les deux silhouettes, le device population) et le chiffre YouBud | l'écart en cuillères d'huile par jour |
| 3 · « Donc je mange comme un 70 dès demain » | le turn, la résolution, la chute | les chapitres 3 et 5 rappelés en 20 s |

C'est la vidéo où YouBud a sa place naturelle : « tu tapes le corps que tu vises, il te
donne son budget ». Pas en fin de vidéo, au moment où le spectateur a besoin du calcul.
Le device population se construit le jeudi de S4.

### « Vingt kilos sans prendre de ventre »

Ton histoire, en S6, en trois chapitres (§ 3). Elle s'écrit en S5, après l'entretien de
S3 : les dates, le poids par mois, le surplus par jour, la durée de 60 à 80, ce qui a
raté, les photos datées. Tout est **À CONFIRMER** tant que l'entretien n'a pas eu lieu,
et si le journal de poids n'existe pas, « Ta montre » prend sa place.

### « Une calorie, c'est une calorie », élargie

Le script de 82 s existe, `video/une-calorie-est-une-calorie/SCRIPT.md`, avec ses trois
prompts de composition et sa légende. Il devient le chapitre 1 de S4, réécrit à
165 mots/min ; ses suites 02 (le gras à neuf calories) et 05 (l'alcool) deviennent les
chapitres 2 et 3 (§ 3). Le reel lui-même n'est pas tourné : le sortir tel quel le mardi
13 octobre coûte une journée non budgétée, sinon le short est le noyau [S] du chapitre 1
(**À CONFIRMER**, § 3). Deux choses à trancher avant d'écrire : 50 ou 70 calories par
jour (le calcul de la taxe dit plutôt 50, la légende dit déjà 50 à 100 ; la voix doit
dire pareil), et la source du « stocker coûte 3 %, convertir 25 % », sans laquelle la
phrase saute.

### « L'huile coûte plus cher que ton dessert », short de réserve

Script complet, écrit et validé. Il reste un short de réserve, à tourner et animer une
journée quand l'assiette animée existe. Cible 1:20, environ 250 mots parlés, turn vers 58 %.
Croyance : les calories sont dans le dessert. En fait elles sont dans ce que tu ne
mâches pas. Sa matière est le chapitre 2 de S1 ; les chiffres viennent des chapitres 2
et 5 du long format. **Avant de rendre l'assiette, vérifier chaque valeur sur Ciqual ou
dans YouBud.** Les plans « assiette » sont des rendus du composant ; les plans « toi »
sont face caméra. Si tu choisis de verser l'huile pour de vrai à ton bureau, le plan
00:34 devient un face caméra avec la balance, et la vidéo dit ce que la balance dit.

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

**Les aliments à générer pour ce short** : l'assiette vide, le riz, le poulet, les
légumes, le pot de crème dessert, la bouteille d'huile, une cuillère à soupe pleine. Sept
images fixes Higgsfield, fond retiré, un seul style, validées avant toute animation.
Elles resserviront aux longues qui comptent des calories.

**La légende** (les cinq parties ; la sixième ligne s'ajoute le jour où « Pourquoi ça
revient » est en ligne)

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
> PMID 7498104 (Holt 1995, l'étude de satiété du chapitre 2 du long format)
>
> #nutrition #calories #pertedepoids

**Contrôle avant tournage**

- [ ] chaque chiffre vérifié sur Ciqual ou YouBud
- [ ] les deux côtés de chaque comparaison partagent une unité : calories contre calories
- [ ] un seul scratch, sur « Pas vraiment »
- [ ] la chute concède (« personne ne pèse son huile ») avant de nommer ce qui survit
- [ ] aucune phrase à la première personne qui ne soit pas vraie pour toi
- [ ] lu à voix haute, chrono : entre 1:15 et 1:25

### Les deux reels déjà faits

| Reel | État | Sa place |
|---|---|---|
| **« Déficit calorique ≠ manger moins »** | publié le 27 août sur YouTube, 1080×1920 | short du mardi 15 septembre, tel quel sur Instagram et TikTok, zéro montage, légende en cinq parties sans la sixième ligne (la longue correspondante, S3, n'existe pas encore). Vérifier la zone sûre des sous-titres en Short. Sa matière est le chapitre 1 de S3 |
| **« Tu n'as jamais eu à le mériter »** | monté à deux plans près, `video/meriter-son-repas/montage/` | short du samedi 19 septembre. Les pickups A (« Sauf que le sport, c'est cinq pour cent de ce que tu brûles. Cinq. ») et B (la chute corrigée) tournés dimanche 13 au téléphone en portrait natif, 10 min, avant l'installation 4K, pour raccorder aux rushes du 1er septembre. Voie Kdenlive, une seule fois, 2 h, détail dans `PLAN-SEMI-18-OCTOBRE.md`. Sa version longue est S3 ; son chapitre 1 n'est pas redécoupé en short |

### Le trailer

Trente-cinq secondes, tourné vers le spectateur, épinglé en premier sur Instagram et
bande-annonce de chaîne sur YouTube. Chaque phrase sur toi est suivie d'une phrase sur
lui. Le plan par plan, avec les fichiers, est dans `video/trailer/TOURNAGE.md` ; ce qui
suit est le script, avec les deux répliques réécrites le 7 septembre. Ta mère est
d'accord pour qu'on parle d'elle : la ligne est dedans.

```
[00:00 — Photo : toi à 60 kg, le miroir de la salle de bain. Plein cadre, 2 s]
Un mètre quatre-vingt-dix. Soixante kilos.
TEXT: "60 KG"

[00:02 — Live Photo, de face, vestiaire. 1,5 s. Coupe franche]
Aujourd'hui, quatre-vingts.
TEXT: "80 KG"

[00:04 — Toi, face caméra]
Pas un régime. Juste des calories que je comprends.
TEXT: "SANS RÉGIME"

[00:09 — Trois cartes de texte, ou l'assiette animée si elle existe un jour :
ton assiette, ta bière, ton dessert]
Ici, je te montre où elles sont vraiment. Dans ton assiette, dans ta bière,
dans ton dessert. Sujets tabous compris.
TEXT: "OÙ SONT LES CALORIES"

[00:17 — Toi, face caméra, plus bas]
Ma mère a essayé tous les régimes pendant que je grandissais. Ça ne marchait jamais.
C'est pour ça qu'ici, personne n'est jugé.
TEXT: "SANS JUGEMENT"

[00:25 — Toi, en tenue de course, dehors. 7 s]
Et en attendant, je prépare un semi-marathon. Le dix-huit octobre. Après, un Hyrox.
Tout ce que je brûle, on le compte.
TEXT: "SEMI · 18 OCTOBRE"

[00:32 — Toi, face caméra, léger, un demi-sourire. Coupe sur « revient »]
Première vidéo : pourquoi ça revient.
TEXT: "CETTE SEMAINE"
```

| | |
|---|---|
| **Ce qui a changé** | le plan 0:25 ne dit plus de temps : le semi est une chose qu'on prépare à côté, jamais une performance qu'on annonce. Le dernier plan (0:32 ici et dans `video/trailer/TOURNAGE.md`, « plan 0:33 » dans le brief) nomme la longue réellement publiée le dimanche, sans bouteille d'huile ; la parole se règle sur la longue du jour, pas sur un ordre de document |
| **Tournage** | les trois plans face caméra dimanche 13 en fin de session, 20 min, en 4K 16:9 centré, trois prises chacun ; le plan 0:17 reste le plus important |
| **Montage** | vendredi 18 après les shorts, 3 h. **Deux exports** : 1080×1920 pour l'épingle Instagram ; 1920×1080 pour la bande-annonce de chaîne YouTube, le portrait centré sur le fond du kit, les textes repositionnés, mise en ligne comme vidéo classique (une verticale de moins de trois minutes serait classée Short). Sous-titres dans la zone sûre. Pas de scratch : il n'y a pas de turn dans un trailer |
| **Publication** | dimanche 20 septembre, une heure après la longue, épinglé en premier. Si S1 déborde, il glisse au dimanche 27 : il est épinglé, pas daté |
| **Higgsfield** | `plage-higgsfield-IA.mp4` reste écartée : une image de toi générée contredit « chaque phrase littéralement vraie » |

« Jamais repris » a disparu : c'est un mot de perte de poids, et ton histoire est une
prise. « Pas un régime » veut dire pas de restriction ; tu as compté, et c'est la phrase
d'après.

**La bio Instagram**, en trois lignes, avec le seul lien, YouBud : *Les calories, sans
régime et sans jugement. Semi le 18 octobre. Mon calculateur : YouBud.* À créer dans la
semaine du 8, avant le premier short de mardi 15, avec la « à la une » SEMI. Sans bio, le renvoi des
légendes ne renvoie nulle part. Le brief propose aussi, en deuxième ligne, la preuve
(60 → 80 kg sans régime) à la place du semi : **À CONFIRMER**, à toi de choisir.

---

## 8. YouBud, sans vendre

Tu veux que les gens finissent par utiliser YouBud, gratuitement. Quatre règles pour que
ça marche sans que ça sente la pub :

1. **Dans la bio dès le premier jour.** C'est là que va celui qui veut le calcul. C'est le seul lien de la bio.
2. **Dans une vidéo seulement quand la vidéo a besoin du calcul.** « Mange comme le corps que tu vises » en a besoin, au moment du calcul, et « Manger quand tu cours » aussi. « Pourquoi ça revient » n'en a pas besoin : on n'en parle pas.
3. **Jamais en fin de vidéo par défaut.** Les quatre plus grosses vidéos du corpus n'ont aucun appel à l'action ; les trois qui en ont un sont dans la moitié basse. Un appel se dépense, il ne s'installe pas. Aucun lien YouBud en fin de longue.
4. **Le renvoi vers la longue est une adresse, pas un appel.** La sixième ligne de la légende, le champ « vidéo associée » sur YouTube Shorts, et rien d'autre. Jamais un lien YouTube sur Instagram ou TikTok, jamais dans la bouche.

Et ce que tu as dit toi-même est ta meilleure carte : tu as utilisé MyFitnessPal et
Yazio, tu trouves Yazio très bien et tu la recommandes. **Dis-le à l'image le jour où
tu parles de YouBud.** Quelqu'un qui recommande le concurrent ne vend pas ; il aide. C'est
exactement la différence que le spectateur sent.

**La plateforme possédée, à une condition.** Kallaway appelle plateforme possédée ce
qui permet à quelqu'un de te retrouver sans passer par l'algorithme. YouBud n'en est une
que si l'appli a un chemin retour : une entrée « dernière vidéo », un mail
d'inscription. Tant qu'il n'existe pas, YouBud est un produit recommandé, pas un canal,
et on ne le compte pas comme couverture contre l'algorithme. Que ce chemin retour puisse
exister avant le 18 octobre est **À CONFIRMER**.

---

## 9. Le packaging

Écrit le lundi, avec le script, avant de tourner, et lu à voix haute comme le reste.
Titre, miniature et hypothèse se consignent dans le journal chaque dimanche ; on note,
on ne décide rien avant vingt vidéos.

| Élément | La règle |
|---|---|
| **Le titre** | cinq titres écrits, le plus court gagne. Il est répété mot pour mot en deuxième phrase de l'ouverture à froid : la confirmation du clic |
| **La miniature** | trois versions dans un gabarit fixe, testées sur fond noir. Un dispositif de la signature (SplitBar, carte 9-4-4, l'avant/après, la population de silhouettes) plus un chiffre. Trois éléments maximum, rien en bas à droite. **Jamais le visage seul** tant que la chaîne n'est pas reconnue : ton corps est déjà à l'image dans chaque face caméra, c'est la preuve visuelle, elle n'a pas besoin de miniature. Jamais une miniature avant/après, jamais une miniature de course. Une photo pour la miniature en fin de session du lundi, 5 min |
| **La grille** | 100 % nutrition : couvertures de reels et miniatures. Le sport n'apparaît qu'en stories |
| **L'écran de fin** | dès la deuxième longue, 20 s vers la longue précédente. Pas d'appel à s'abonner |
| **La playlist** | « Les calories, sans régime » (nom **À CONFIRMER**), qui reçoit chaque longue |
| **Les chapitres** | horodatés dans la description, un par chapitre du script |
| **La description** | les six parties de la légende, les chapitres, tous les PMID, aucun lien YouBud en fin de vidéo |
| **Le titre d'un Short YouTube** | le hook du short, pas le titre de la longue ; le champ « vidéo associée » vers la longue |
| **Le journal** | une ligne par publication : publiée le, titre, miniature, hypothèse avant, résultat à sept jours, heures réelles de la semaine. On lit uniquement Instagram pendant six semaines ; YouTube est un dépôt à longue demi-vie ; on ne compare pas les plateformes avant vingt vidéos |
