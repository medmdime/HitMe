# Tournage · Perdre 10 kilos en deux mois ?

J13 · **~29,5 s** · 140 mots · tournée à la **session 4 (mercredi 7 octobre)**, avec J14 ; montée le dimanche 11 au plus tard, sort le **lundi 12 octobre**

La narration nue est dans [[video/to-film/prochains-jalons/13-dix-kilos-deux-mois/PROMPTEUR|PROMPTEUR]], les sources et la légende dans [[video/to-film/prochains-jalons/13-dix-kilos-deux-mois/SCRIPT|SCRIPT]].

## Les blocs à tourner

Six blocs, chacun **trois fois**, **un clap au début de chaque prise** (une fois dans les mains, face caméra : c'est ce qui recale ta bouche sur le son au montage). Puis le texte entier d'une traite deux fois, en secours.

| Bloc | Temps | Cadre | Du début… | …à la fin | Prises |
|---|---|---|---|---|---|
| 1 · la question et la promesse | A · le hook | A | « Tu as deux mois » | « pas du gras. » | 3 |
| 2 · le sucre et l'eau | B · l'explication | B | « Quand tu manges moins » | « avec elles. » | 3 |
| 3 · la preuve | B | B | « Des chercheurs » | « c'était du gras. » | 3 |
| 4 · le déficit | B | B | « Le gras, lui » | « chaque jour. » | 3 |
| 5 · le geste | A · la fin | A | « Vise un demi-kilo » | « et après. » | 3 |
| 6 · l'appel | A | A | « Moi, c'est Mohamed » | « enregistre la vidéo. » | 3 |

## Réglages

Le même cadre que les autres vidéos, pour qu'on te reconnaisse : 4K 16:9, toi au centre **avec de l'air au-dessus de la tête** (le cadre B te met en bas de l'image, ta tête doit pouvoir dépasser de la carte), la lampe chaude derrière, le t-shirt blanc, le micro-cravate. Tu regardes l'objectif sur toutes les phrases.

## Le jeu

Le ton de toute la vidéo : **ferme contre la promesse, chaleureux avec elle**. Elle t'annonce sa date et ses dix kilos ; tu es de son côté. Ce qui t'agace, ce sont les régimes qui lui promettent n'importe quoi, pas elle. Pas d'ironie, pas de surprise jouée.

- **« Tu as deux mois pour perdre dix kilos ? »** : une vraie question, doucement, comme si elle venait de te la poser.
- **« Oublie les régimes "moins dix kilos en un mois" »** : le ton monte d'un cran, net, un peu agacé ; c'est la promesse que tu vises.
- **« ils promettent des kilos, pas du gras. »** : un temps avant « pas du gras », posé, presque bas.
- **« Quand tu manges moins… qui part avec elles. »** : tu expliques, simplement ; « trois à quatre fois » posé.
- **« Des chercheurs ont mesuré ce qui part : »** : un léger temps après « part ».
- **« …moins de la moitié des kilos perdus, c'était du gras. »** : « moins de la moitié » détaché, lent. C'est le premier moment fort.
- **« Le gras, lui, part lentement, avec un déficit : manger moins que ce que ton corps brûle. »** : calme, pédagogue ; c'est la définition, elle doit passer du premier coup.
- **« Dix kilos de gras en deux mois, c'est manger au minimum deux fois moins, chaque jour. »** : sans effet, comme un calcul ; « au minimum » appuyé, « chaque jour » un cran plus bas.
- **« Vise un demi-kilo à un kilo par semaine… jusqu'à ta date, et après. »** : droit dans l'objectif, un conseil d'ami ; « tu peux le tenir » appuyé, un sourire sur « et après ».
- **L'appel** : simple, comme si tu te présentais.

## Le montage, en trois temps

Toi en grand, puis **une seule animation**, puis toi en grand. Rien d'autre. Temps estimés à 4,75 mots par seconde, souffles coupés, avant l'accélération ; `ke.py … plans` donnera les vrais.

| Temps | Cadre | Ce que tu dis | À l'image | Son |
|---|---|---|---|---|
| 0:00 → 0:05,1 | **A** | « Tu as deux mois pour perdre dix kilos ? Oublie les régimes "moins dix kilos en un mois" : ils promettent des kilos, pas du gras. » | toi en grand, zoom lent (1 → 1,06) | rien |
| 0:05,1 | A → B | | **un glissé simple** : l'animation entre par la droite, la carte ne bouge pas | aucun woosh |
| 0:05,1 → 0:21,9 | **B** | « Quand tu manges moins… chaque jour. » | **l'animation « Ce qui part »**, en haut ; toi détouré sur la carte, en bas | les six clics de l'animation |
| 0:21,9 | B → A | | le glissé retour, une fois la tenue de l'animation finie (0:22,2) | rien |
| 0:21,9 → 0:29,5 | **A** | « Vise un demi-kilo à un kilo par semaine : ce rythme-là, tu peux le tenir jusqu'à ta date, et après. » puis l'appel | toi en grand ; **le seul punch-in** (1,15) sur « tu peux le tenir » ; sur l'appel, ton prénom, **Abonne-toi** et l'icône d'enregistrement sur le bandeau sombre | aucun clic, aucun riser ni hoop |

**Du début à la fin** :

- **Le titre fixe en haut** (y ≈ 70 → 210, au-dessus de la zone utile de l'animation) : **DIX KILOS EN DEUX MOIS ?**, en ZY Elegant comme la couverture (la police n'a pas d'accents, le titre n'en a pas besoin), en blanc avec « DEUX MOIS ? » en jaune, sur un léger dégradé sombre. C'est la seule phrase écrite à l'écran.
- **Les sous-titres, sobres** : blancs, un mot en jaune par phrase ; sous ton menton en A (y = 1320), entre l'animation et ta tête en B (y = 980).
- **Pas de musique.** Aucun woosh, riser ni hoop.

**Les mots en jaune** (`[sous_titres] jaunes`, dans l'ordre ; ils se cherchent l'un après l'autre dans la transcription, et s'écrivent comme large-v3 les a entendus) : `["kilos", "gras", "sucre", "eau", "moitié", "déficit", "fois", "tenir", "Mohamed", "abonne-toi", "enregistre"]`. « fois » marque « deux fois moins » : « moins » tomberait sur la phrase d'avant (« manger moins que… »), et « deux » sur « deux mois ».

**Pour la fiche `kallaway.toml`** (laissée telle que `preparer` l'a copiée, à réécrire au montage) : trois `[[plans]]` seulement : `hook` (A, de « Tu », zoom lent), `ce-qui-part` (B, de « Quand », l'animation `compositions/B1-ce-qui-part.html`, `woosh = false`), `geste` (A, de « Vise », punch-in sur « tenir ») ; aucun `[[sons]]` (les clics sont dans l'animation) ; aucune `[[musique]]` ; l'appel en `[[incrustes]]` sur son `[[bandeaux]]`.

## L'animation : « Ce qui part »

**`compositions/B1-ce-qui-part.html`**, id `dix-kilos-b1`, **1080 × 960**, **17,15 s** (B, 16,84 s, et 0,3 s de tenue). DA YouBud (skill `inserts-youbud`) : fond de toile claire (`assets/img/toile.jpg`), cartes teintées et barres sans bordure à rebord plein, Archivo 900, contenu utile entre y = 325 et y = 885 (au-dessus de 230, le titre fixe). **Trois éléments et un chiffre**, de gauche à droite ; des mots isolés, jamais de phrase. **Le jaune veut dire « gras »** (la part de la colonne) ; **le rouge pâle, ce qui manque dans l'assiette** (le déficit).

Les temps sont comptés depuis le début de B ; dans la vidéo, ajouter 5,05 s. Ils sont regroupés en tête du script, dans l'objet `CUES` (mot → seconde, commenté) : au recalage sur la prise, on ne change que ces valeurs et les `data-start` des six `<audio>`.

| Entre sur le mot | Dans B | Dans la vidéo | Élément | Ce qu'on voit | Son |
|---|---|---|---|---|---|
| « réserves de **sucre** » | 2,53 | 0:07,6 | **1 · le sucre** | à gauche, une carte bleu clair (`--yb-blue-2`) ; en haut, un morceau de sucre blanc dessiné à plat, le mot **Sucre** dessous | `soft_click` |
| « leur poids en **eau** » | 4,63 | 0:09,7 | **1 · son eau** | dans la même carte, **quatre gouttes** bleues (`--yb-blue`) qui tombent l'une après l'autre, **la quatrième pâle** : « trois à quatre fois » ; le mot **Eau** dessous | `soft_click` |
| « moins de la **moitié** » | 8,63 | 0:13,7 | **2 · la colonne** | au centre, une colonne bleu clair monte depuis un sol gris ; un **trait en pointillés** se dessine à sa moitié, le mot **Moitié** au-dessus | `soft_click` |
| « des kilos **perdus** » | 9,26 | 0:14,3 | | le mot **Perdu** sous la colonne | rien |
| « c'était du **gras** » | 9,89 | 0:14,9 | **2 · le gras** | une part **jaune** (`--yb-yellow`) monte du bas de la colonne jusqu'à **46 %**, et s'arrête **sous le trait** ; le mot **Gras** dedans | `soft_click` |
| « avec un **déficit** » | 11,58 | 0:16,6 | **3 · le déficit** | à droite, sur un sol gris, deux barres montent : une **orange** (`--yb-orange`, 420 px) et une **verte** (`--yb-green`, 80 % de l'orange) ; derrière la verte, un bloc **rouge pâle** (`--yb-red-2`) de la hauteur de l'orange : le haut qui dépasse, c'est le trou ; le mot **Déficit** au-dessus | `soft_click` |
| « **manger** moins » | 11,79 | 0:16,8 | | **Mangé** sous la barre verte | rien |
| « ton corps **brûle** » | 13,26 | 0:18,3 | | **Brûlé** sous la barre orange | rien |
| « au minimum **deux** fois moins » | 15,79 | 0:20,8 | **3 · ÷ 2** | la barre verte **tombe à la moitié de l'orange** (0,5 s), le trou rouge grandit d'autant ; la pilule blanche **÷ 2** se pose dedans ; fini à 16,4, « chaque jour » passe sans rien, puis tout tient | `soft_click` |

**De « Le gras, lui, part lentement » à « avec un »** (10,3 → 11,5 dans B) et **de « Dix kilos de gras » à « au minimum »** (13,5 → 15,7), rien n'entre : on écoute.

**Les mots à l'écran** : Sucre · Eau · Moitié · Perdu · Gras · Déficit · Mangé · Brûlé · ÷ 2. Rien d'autre : ni « 7 700 », ni « 2012 », ni cuillère, ni nom d'étude (ils sont dans la légende).

**Ce que les barres disent, et ne disent pas** : Mangé à 80 % de Brûlé, c'est un déficit ordinaire, sans chiffre ; à la moitié de Brûlé, c'est « deux fois moins », le minimum du calcul (pour une femme qui brûle 2 000 calories, ce serait encore moins : voir SCRIPT). La colonne garde sa règle : la part jaune fait 46 % de la hauteur, la moyenne de ce qu'a mesuré Heymsfield 2012 à un mois (0,43 chez les hommes, 0,48 chez les femmes), un peu sous la moitié, comme dans l'étude ; la part bleue n'a pas de mot, parce que l'étude a mesuré la masse maigre (eau, réserves de sucre, protéines), pas l'eau seule.

**Les sons** : six `soft_click` seulement, `data-volume` 0,6 (1,0 × 0,6, les bruitages baissés de 40 % le 28 septembre), pistes 11 à 16, un `id` à chacun. Ni `wrong`, ni `correct`, ni `impacts`, ni `bloop`.

**Vérifié le 28 septembre, au soir, après la réécriture** :

- `npx --yes hyperframes@0.8.21 check` : **0 erreur, 0 avertissement** (lint, exécution, mise en page sur 9 échantillons, mouvement, contraste 19 textes sur 19).
- `snapshot` aux entrées (3,2 · 5,3 · 9,3 · 10,5 · 12,3 · 13,7 · 16,5 s) et à la fin, regardés : rien ne se chevauche, rien ne déborde, le jaune reste sous le trait, la pilule « ÷ 2 » tient dans le trou rouge. Ils sont dans `renders/snapshots/` (ignoré par git).
- Le brouillon : `renders/B1-ce-qui-part-brouillon.mp4`, 1080 × 960, 17,2 s, **un flux audio** (AAC) ; les six clics détectés à 2,63 · 4,73 · 8,73 · 9,99 · 11,68 · 15,89 s, soit chaque repère + 0,10 s (l'attaque du fichier `soft_click.wav`, la même partout).
- `index.html` n'héberge que l'animation, pour la relecture (17,15 s) ; le montage le réécrira. Ses snapshots s'affichent dans une police de secours ; le rendu de la composition, lui, est bien en Archivo.

**Pas de b-roll généré.** Zéro crédit.

## La couverture

La question, en **ZY Elegant**, tout en capitales (la police n'a pas d'accents, la phrase n'en a pas besoin), comme l'assiette :

- en blanc : **PERDRE DIX KILOS**
- en jaune, plus gros : **EN DEUX MOIS ?**

L'image : toi en grand, bouche fermée, regard dans l'objectif (`[couverture] temps` à choisir dans la piste montée). Le haut du texte vers y = 250.

## Publier

Le **lundi 12 octobre**. Sur les trois plateformes, la légende et le titre YouTube sont dans [[video/to-film/prochains-jalons/13-dix-kilos-deux-mois/SCRIPT|SCRIPT]].

[[Perdre 10 kilos en deux mois]] · [[HUB]]
