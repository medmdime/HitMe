# Tournage · Tu manges moins, et tu craques au bout d'une semaine ?

J9 · **~29 s** · 139 mots · tournée à la session 3 (**dimanche 4 octobre**), montée le mercredi 7 au plus tard, sort le **jeudi 8 octobre**

La narration nue est dans [[video/to-film/09-deficit-trop-grand/PROMPTEUR|PROMPTEUR]], les sources et la légende dans [[video/to-film/09-deficit-trop-grand/SCRIPT|SCRIPT]]. Le texte a été **réécrit de zéro le 28 septembre au soir**, après la note de Mohamed (« c'est une catastrophe, 0 sur 10 ») : le détail est dans SCRIPT, § « Les notes de Mohamed ».

## Les blocs à tourner

Sept blocs, chacun **trois fois**, **un clap au début de chaque prise** (une fois dans les mains, face caméra : c'est ce qui recale ta bouche sur le son au montage). Puis le texte entier d'une traite deux fois, en secours.

| Bloc | Cadre | Du début… | …à la fin | Prises |
|---|---|---|---|---|
| 1 · la semaine | A | « Lundi, tu manges moins » | « C'est lundi. » | 3 |
| 2 · le déficit | B | « Un déficit » | « dans tes réserves. » | 3 |
| 3 · trop d'un coup | B | « Mais lundi » | « s'est réveillée. » | 3 |
| 4 · la preuve | B | « Des chercheurs » | « qu'un jour normal. » | 3 |
| 5 · pas ton caractère | B | « Ce n'est pas ton caractère » | « qui gagne. » | 3 |
| 6 · le geste | A | « Donc lundi prochain » | « te fait maigrir. » | 3 |
| 7 · l'appel | A | « Moi, c'est Mohamed » | « enregistre la vidéo. » | 3 |

## Réglages

Le même cadre que les autres vidéos, pour qu'on te reconnaisse : 4K 16:9, toi au centre **avec de l'air au-dessus de la tête** (le cadre B te met en bas de l'image, ta tête doit pouvoir dépasser de la carte), la lampe chaude derrière, le t-shirt blanc, le micro-cravate. Tu regardes l'objectif sur toutes les phrases.

## Le jeu

Le ton de toute la vidéo : **un ami qui a déjà vu ça cent fois**. Énergique et un peu agacé contre le régime choc ; chaleureux avec la personne. Pas de leçon.

- **« Lundi, tu manges moins. »** : posé, comme le début d'une histoire.
- **« Samedi, tu craques : le paquet de gâteaux, debout dans la cuisine. »** : avec un petit sourire, c'est une scène que tout le monde a vécue ; tu ne te moques pas.
- **« Le problème n'est pas samedi. »** : un temps, puis net. **« C'est lundi. »** : détaché, droit dans l'objectif. C'est le coup du hook.
- **« Un déficit, c'est manger moins que ce que tu brûles… »** : simple, comme à quelqu'un qui n'a jamais entendu le mot ; « la différence » bien articulé.
- **« Mais lundi, tu as enlevé trop d'un coup, et ta faim s'est réveillée. »** : c'est la réponse au hook ; « trop d'un coup » appuyé.
- **« Des chercheurs l'ont mesuré… »** : tu racontes ; « presque trois fois plus petits » un peu plus lent.
- **« Au repas d'après, elles ont mangé moitié plus qu'un jour normal. »** : un temps avant, puis « moitié plus » détaché. C'est le moment fort.
- **« Ce n'est pas ton caractère qui lâche : c'est ta faim qui gagne. »** : doux, sûr, comme une main sur l'épaule.
- **« Donc lundi prochain, pas de régime choc : enlève un peu. »** : « pas de régime choc » ferme, presque un ordre ; « enlève un peu » plus doux.
- **« Ta faim reste calme, tu tiens des mois, et c'est ce petit déficit qui te fait maigrir. »** : rassurant ; « ce petit déficit » appuyé.
- **L'appel** : simple, comme si tu te présentais.

## Le montage, en trois temps

Toi en grand, puis **une seule animation**, puis toi en grand. Rien d'autre. Temps estimés à 4,75 mots par seconde, souffles coupés, avant l'accélération ; `ke.py … plans` donnera les vrais.

| Temps | Cadre | Ce que tu dis | À l'image | Son |
|---|---|---|---|---|
| 0:00 → 0:04,6 | **A** | « Lundi, tu manges moins. Samedi, tu craques : le paquet de gâteaux, debout dans la cuisine. Le problème n'est pas samedi. C'est lundi. » | toi en grand, zoom lent (1 → 1,06) | rien |
| 0:04,6 | A → B | | **un glissé simple** : l'animation entre par la droite, la carte ne bouge pas | aucun woosh ; le premier clic de l'animation arrive à ~0:05,3 |
| 0:04,6 → 0:20,0 | **B** | « Un déficit… c'est ta faim qui gagne. » | **l'animation « Trop d'un coup »**, en haut ; toi détouré sur la carte, en bas | les trois clics de l'animation, rien d'autre |
| 0:20,0 | B → A | | le glissé retour, après le dernier battement de la jauge (fini à ~0:19,7) | rien |
| 0:20,0 → 0:29,3 | **A** | « Donc lundi prochain, pas de régime choc : enlève un peu. Ta faim reste calme, tu tiens des mois, et c'est ce petit déficit qui te fait maigrir. » puis l'appel | toi en grand ; **le seul punch-in** (1,15) sur « petit » ; sur l'appel, ton prénom, **Abonne-toi** et l'icône d'enregistrement sur le bandeau sombre | aucun clic, aucun riser ni hoop |

**Du début à la fin** :

- **Le titre fixe en haut** (y ≈ 70 → 210, au-dessus de la zone utile de l'animation) : **TU MANGES MOINS, TU CRAQUES ?**, cinq mots, en ZY Elegant comme la couverture (la police n'a pas d'accents, le titre n'en a pas besoin), en blanc avec « TU CRAQUES ? » en jaune, sur un léger dégradé sombre. C'est la seule phrase écrite à l'écran.
- **Les sous-titres, sobres** : blancs, un mot en jaune par phrase ; sous ton menton en A (y = 1320), entre l'animation et ta tête en B (y = 980).
- **Pas de musique. Aucun woosh, riser ni hoop.** Des coupes sèches seulement pour un souffle ou un raté.

**Les mots en jaune** (`[sous_titres] jaunes`, dans l'ordre) : `["craques", "lundi", "déficit", "trop", "petits", "moitié", "faim", "choc", "petit", "Mohamed", "abonne-toi", "enregistre"]`. Le premier « lundi » (« Lundi, tu manges moins ») vient avant « craques » : c'est celui de « C'est lundi » qui passe en jaune.

**Pour la fiche `kallaway.toml`** (laissée telle que `preparer` l'a copiée : elle sera réécrite au montage) : trois `[[plans]]` seulement : `hook` (A, de « Lundi », zoom lent), `deficit` (B, de « Un », `anim = "compositions/B1-trop-d-un-coup.html"`, `woosh = false`), `geste` (A, de « Donc », punch-in sur « petit ») ; aucun `[[sons]]` ; aucune `[[musique]]` ; l'appel en `[[incrustes]]` sur son `[[bandeaux]]` ; `feuilles` = kit.css et youbud.css seulement (tout le style de l'animation est dans sa composition).

## L'animation : « Trop d'un coup »

**`compositions/B1-trop-d-un-coup.html`**, id `deficit-trop-grand-b1`, **1080 × 960**, **15,67 s** (la fin de B, 15,37 s, plus 0,3 s de tenue ; tout est immobile dès 15,1 s). DA YouBud (skill `inserts-youbud`), fond de toile claire, contenu utile entre y = 290 et y = 866 (au-dessus, le titre fixe). Aucune bordure : des teintes claires à rebord plein. Elle remplace « Deux journées » (deux assiettes, Faim, un buffet à deux barres, « + ½ », un anneau, sept clics), jugée trop chargée.

**Deux éléments et un chiffre** :

- **l'assiette**, à gauche (bleu clair, creux blanc) : une portion orange avec un sandwich blanc (Lucide `sandwich`), posée sur une teinte orange pâle qui garde **la taille normale** en repère ;
- **la jauge Faim**, à droite : une piste blanche à rebord, du rouge (`--yb-red`) qui monte dedans, le mot **Faim** dessous ;
- **+ ½**, la seule pilule colorée (`--key`), au coin de l'assiette.

La portion raconte toute l'explication : elle rétrécit un peu (un déficit), beaucoup (trop d'un coup), puis revient plus grosse qu'avant (le repas d'après).

Les temps viennent de l'objet `CUES`, en tête du script de la composition, estimés à 4,75 mots par seconde depuis le premier mot de B (rang du mot − 1, ÷ 4,75) ; dans la vidéo, ajouter 4,6 s.

| Entre sur le mot | Dans B | Dans la vidéo | Ce qu'on voit | Son |
|---|---|---|---|---|
| « c'est **manger** moins » (4e mot) | 0,63 s | ~0:05,3 | **1 · l'assiette** entre, la portion à sa taille normale | `soft_click` |
| « manger **moins** » (5e) | 0,84 s | ~0:05,5 | la portion rétrécit un peu (0,9) : un anneau orange pâle apparaît autour, la taille normale | rien |
| « **trop** d'un coup » (25e) | 5,05 s | ~0:09,7 | la portion rétrécit beaucoup (0,607 de diamètre : une aire **2,7 fois** plus petite, le rapport de l'étude, 1 025 kJ contre 2 778 kJ par repas) | rien |
| « ta **faim** s'est réveillée » (30e) | 6,11 s | ~0:10,7 | **2 · la jauge Faim** entre ; le rouge monte à moitié | `soft_click` |
| « trois fois plus **petits** » (44e) | 9,05 s | ~0:13,7 | la petite portion se serre une fois et revient | rien |
| « plus **faim** » (50e) | 10,32 s | ~0:15,0 | le rouge monte à 0,82 | rien |
| « Au **repas** d'après » (52e) | 10,74 s | ~0:15,4 | la portion revient à sa taille normale | rien |
| « **moitié** plus » (57e) | 11,79 s | ~0:16,4 | elle dépasse la taille normale (1,245 de diamètre : une aire **1,55 fois** plus grande, le rapport mesuré au buffet, 3 965 kJ contre 2 560 kJ) | rien |
| « moitié **plus** » (58e) | 12,00 s | ~0:16,6 | **+ ½** en gros, sur sa pilule jaune | `soft_click` |
| « c'est ta **faim** qui gagne » (71e) | 14,74 s | ~0:19,4 | la jauge bat une fois (1,06) ; ensuite plus rien ne bouge | rien |

**Les mots à l'écran** : Faim · + ½. Rien d'autre : ni « 12 », ni calories, ni pourcentage (les chiffres exacts sont dans la légende). La portion garde les rapports de l'étude (2,7 et 1,55).

**Les sons** : trois `soft_click.wav`, un par élément qui se pose, volume **0,6** (le Kallaway edit), chacun avec son `id` (`b1-s-01` à `b1-s-03`, pistes 11 à 13). Ni `wrong`, ni `correct`, ni `impacts`, ni `bloop`, ni woosh.

**Recaler après le tournage** : `ke.py … plans` donne le vrai temps de chaque mot ; changer les valeurs de `CUES`, reporter `manger`, `faim` et `plus` dans les `data-start` des trois `<audio>`, et `fin` + 0,3 dans les deux `data-duration` (la racine et la scène), et dans `index.html`.

**Vérifié le 28 septembre au soir** :

- `npx --yes hyperframes@0.8.21 check` : **passé**, 0 erreur et 0 avertissement (lint, runtime, motion), 0 problème de mise en page sur 9 échantillons, 4/4 textes au contraste WCAG AA. Le rouge de la jauge dépasse de son creux arrondi par construction (il glisse vers le haut au lieu de grandir) : il porte `data-layout-allow-overflow`.
- `snapshot` à 0,4 · 1,4 · 5,7 · 7,0 · 9,12 · 10,95 · 11,3 · 12,6 · 14,85 s et à la fin, regardées une par une : la toile vide pendant le glissé, l'assiette et l'anneau pâle, la petite portion, la jauge à moitié, la jauge à 0,82 et la portion revenue, la grosse portion avec le « + ½ » ; aucun chevauchement, tout ressort sur la toile. Rangées dans `renders/snapshots/` (hors git).
- Rendu brouillon `renders/B1-trop-d-un-coup-brouillon.mp4` (hors git) : 1080 × 960, 15,7 s, rendu en 14,9 s ; `ffprobe` montre un flux **audio** AAC ; les trois clics tombent à 0,73 · 6,21 · 12,10 s.
- `index.html` : une page minimale qui héberge la composition, pour la relecture seulement ; `ke.py … montage` la remplacera.
- Le brouillon et les snapshots de l'ancienne animation sont rangés dans `renders/ancien-deux-journees/` (hors git), pour comparaison.

**Pas de b-roll généré.** Zéro crédit.

## La couverture

La question, en **ZY Elegant**, tout en capitales (la police n'a pas d'accents, la phrase n'en a pas besoin), comme l'assiette :

- en blanc : **TU MANGES MOINS,**
- en jaune, plus gros : **ET TU CRAQUES / AU BOUT D'UNE SEMAINE ?**

L'image : toi en grand, bouche fermée, regard dans l'objectif (`[couverture] temps` à choisir dans la piste montée). Le haut du texte vers y = 250.

## Publier

Le **jeudi 8 octobre**. Sur les trois plateformes, la légende et le titre YouTube sont dans [[video/to-film/09-deficit-trop-grand/SCRIPT|SCRIPT]].

[[Tu manges moins, et tu craques au bout d'une semaine]] · [[HUB]]
