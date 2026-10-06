# Tournage · Tu fais du sport, et ta balance ne descend pas

J8 · **~25 s** · 128 mots · tournée à la session 2 (jeudi 1er octobre), montée le mardi 6 au plus tard, sort le **mercredi 7 octobre**

La narration nue est dans [[video/to-film/08-sport-balance-monte/PROMPTEUR|PROMPTEUR]], les sources et la légende dans [[video/to-film/08-sport-balance-monte/SCRIPT|SCRIPT]].

## Les blocs à tourner

Cinq blocs, chacun **trois fois**, **un clap au début de chaque prise** (une fois dans les mains, face caméra : c'est ce qui recale ta bouche sur le son au montage). Puis le texte entier d'une traite deux fois, en secours.

| Bloc | Cadre | Du début… | …à la fin | Mots | Prises |
|---|---|---|---|---|---|
| 1 · le hook | A | « Tu fais du sport » | « que tu crois. » | 21 | 3 |
| 2 · la preuve | B | « Des chercheurs » | « qu'un pain au chocolat. » | 30 | 3 |
| 3 · la raison | B | « Donc un pain au chocolat » | « elle, le remarque. » | 34 | 3 |
| 4 · le geste | A | « Garde ton sport » | « pas fait ta séance. » | 26 | 3 |
| 5 · l'appel | A | « Moi, c'est Mohamed » | « enregistre la vidéo. » | 17 | 3 |

## Réglages

Le même cadre que les autres vidéos, pour qu'on te reconnaisse : 4K 16:9, toi au centre **avec de l'air au-dessus de la tête** (le cadre B te met en bas de l'image, ta tête doit pouvoir dépasser de la carte), la lampe chaude derrière, le t-shirt blanc, le micro-cravate. Tu regardes l'objectif sur toutes les phrases. Aucun accessoire : ni balance, ni pain au chocolat, ni montre de sport.

## Le jeu

Le ton de toute la vidéo : **un ami qui connaît le sujet**, à quelqu'un qui revient de la salle découragé. Direct contre l'idée fausse, chaleureux avec la personne. Pas d'ironie appuyée, pas de sermon.

- **« Tu fais du sport pour maigrir, et ta balance ne descend pas ? »** : une vraie question, comme si on venait de te la poser.
- **« Normal : ta séance brûle beaucoup moins que tu crois. »** : « Normal » court et chaud, presque un sourire ; puis la phrase droite, « beaucoup moins » appuyé. C'est la réponse : elle doit sonner sûre.
- **« Des chercheurs l'ont mesuré : … quatre fois plus, en moyenne. »** : tu racontes, simple ; « quatre fois plus » lent, détaché ; « en moyenne » dit normalement.
- **« Deux cents calories, c'est moins qu'un pain au chocolat. »** : un demi-sourire, c'est l'image qui fait voir le chiffre.
- **« Donc un pain au chocolat de plus, et la séance est effacée. »** : net, sans dramatiser ; « effacée » posé.
- **« Mais quand on se met au sport, on mange un peu plus chaque jour, sans le remarquer. »** : doux, c'est ce qui arrive à tout le monde, pas un reproche.
- **« Ta balance, elle, le remarque. »** : un temps avant, puis posé, un petit sourire en coin. La question du hook se ferme ici.
- **« Garde ton sport : il te rend plus fort. »** : droit dans l'objectif, encourageant.
- **« Mais le gras, lui, se perd surtout dans l'assiette : mange comme si tu n'avais pas fait ta séance. »** : le conseil d'ami ; « mange comme si » posé, c'est là que tombe le punch-in ; « n'avais pas » en entier.
- **L'appel** : simple, comme si tu te présentais.

## Le montage, en trois temps

Toi en grand, puis **une seule animation**, puis toi en grand. Rien d'autre. Temps estimés à 4,75 mots par seconde, souffles coupés, avant l'accélération ; `ke.py … plans` donnera les vrais.

| Temps | Cadre | Ce que tu dis | À l'image | Son |
|---|---|---|---|---|
| 0:00 → 0:04,4 | **A** | « Tu fais du sport pour maigrir, et ta balance ne descend pas ? Normal : ta séance brûle beaucoup moins que tu crois. » | toi en grand, zoom lent (1 → 1,06) | rien |
| 0:04,4 | A → B | | **un glissé simple** : l'animation entre par la droite, la carte ne bouge pas | aucun woosh |
| 0:04,4 → 0:17,9 | **B** | « Des chercheurs l'ont mesuré… Ta balance, elle, le remarque. » | **l'animation « La séance »**, en haut ; toi détouré sur la carte, en bas | les clics de l'animation, rien d'autre |
| 0:17,9 | B → A | | le glissé retour, **après le souffle qui suit « le remarque »** : le « = » de la balance tient au moins 0,5 s avant de partir | rien |
| 0:17,9 → 0:26,9 | **A** | « Garde ton sport : il te rend plus fort. Mais le gras, lui, se perd surtout dans l'assiette : mange comme si tu n'avais pas fait ta séance. » puis l'appel | toi en grand ; **le seul punch-in** (1,15) sur « mange » ; sur l'appel, ton prénom, **Abonne-toi** et l'icône d'enregistrement sur le bandeau sombre | aucun clic |

**Du début à la fin** :

- **Le titre fixe en haut** (y ≈ 70 → 210, au-dessus de la zone utile de l'animation) : **LE SPORT FAIT MAIGRIR ?** (quatre mots, la croyance du million de vues, posée en question), en ZY Elegant comme la couverture, en blanc avec « MAIGRIR ? » en jaune, sur un léger dégradé sombre. C'est la seule phrase écrite à l'écran, et elle n'a pas besoin d'accent.
- **Les sous-titres, sobres** : blancs, un mot en jaune par phrase ; sous ton menton en A (y = 1320), entre l'animation et ta tête en B (y = 980).
- **Pas de musique.** Aucun woosh, riser ni hoop.
- **Des coupes sèches** seulement pour un souffle ou un raté.

**Les mots en jaune** (`[sous_titres] jaunes`, dans l'ordre) : `["descend", "moins", "quatre", "chocolat", "effacée", "jour", "remarque", "fort", "l'assiette", "Mohamed", "abonne-toi", "enregistre"]`. L'outil compare le mot entier, dans l'ordre : le « moins » jaune est celui du hook, le « chocolat » celui de « moins qu'un pain au chocolat », et « remarque » ne prend pas « remarquer ».

**Pour la fiche `kallaway.toml`** (celle que `preparer` a copiée est encore l'exemple de l'assiette, à réécrire au montage) : trois `[[plans]]` seulement : `hook` (A, de « Tu », zoom lent), `seance` (B, de « Des », `anim = "compositions/B1-la-seance.html"`, `woosh = false`), `geste` (A, de « Garde », punch-in sur « mange ») ; aucun `[[sons]]` ; aucune `[[musique]]` ; l'appel en `[[incrustes]]` sur son `[[bandeaux]]`. Le plan B finit sur son dernier mot : garde le souffle qui suit « le remarque » (0,5 s au moins), la règle « ne jamais quitter une animation sur son dernier mot ».

## L'animation : « La séance »

**Refaite le 28 septembre** : `compositions/B1-la-seance.html`, id `sport-balance-b1` (l'ancienne, `B1-eau-du-muscle.html`, est retirée du dossier). La page `index.html` du dossier ne sert qu'à la relire seule (`ke.py … montage` la remplacera) ; le brouillon est `renders/B1-la-seance-brouillon.mp4`.

**Une composition 1080 × 960**, DA YouBud (`youbud.css` copié tel quel, fond de toile claire `toile.jpg`, cartes sans bordure à rebord plein), contenu entre **y = 352 et y = 770** (au-dessus de 230, le titre fixe). **Trois cartes blanches de 300 × 300 sur une ligne** (x = 50, 390, 730) : **la séance, le pain au chocolat, la balance ; et un chiffre, × 4**. Un seul texte à l'écran, « × 4 », jamais une phrase. Durée **14,5 s** : le plan B fait 64 mots (~13,47 s), et la dernière image tient une seconde pour couvrir le glissé.

Les repères sont regroupés en tête du script, dans l'objet `CUES` (le mot, puis la seconde depuis « Des chercheurs »). Dans la vidéo, ajouter 4,4 s.

| Entre sur le mot | Vidéo | `CUES` | Élément | Ce qu'on voit | Son |
|---|---|---|---|---|---|
| « **séance** » (« après une séance ») | 0:05,7 | 1,26 s | **1 · la séance** | à gauche, une carte blanche, une flamme orange (Lucide `flame`, 200 px, `--yb-orange`) : ce que la séance brûle ; entrée `scale 0 → 1, y 40 → 0`, 0,55 s, `power3.out` | `soft_click` |
| « **quatre** » (« quatre fois plus ») | 0:07,8 | 3,37 s | le chiffre | **× 4** sur une pilule jaune (`--yb-yellow`, rebord `--yb-yellow-edge`), centrée au-dessus de la carte ; à droite, **trois flammes pâles** (opacité 0,3) : ce qu'ils croyaient avoir brûlé ; `scale 0,3 → 1, back.out(1.6)`, 0,1 s d'écart | `soft_click` |
| « **Deux** » (« Deux cents calories ») | 0:08,8 | 4,42 s | | retour au réel : les trois flammes pâles s'en vont (`opacity → 0, y → −30`, 0,25 s) ; × 4 reste | rien |
| « **pain** » (« moins qu'un pain au chocolat ») | 0:10,1 | 5,68 s | **2 · le pain au chocolat** | au milieu, à la place des flammes pâles : un pain au chocolat dessiné à plat en SVG (la pâte dorée à rebord, deux couches feuilletées, les deux barres de chocolat qui dépassent à chaque bout) ; même entrée que la séance | `soft_click` |
| « **plus** » (« un pain au chocolat de plus ») | 0:12,0 | 7,58 s | | le pain au chocolat pulse une fois (`scale 1 → 1,12 → 1`) | rien |
| « **effacée** » | 0:13,1 | 8,63 s | | la flamme s'éteint : elle passe au gris (`#c9c8c0`) et rapetisse (`scale 0,8`), 0,45 s | rien |
| « **balance** » (« Ta balance ») | 0:17,1 | 12,63 s | **3 · la balance** | à droite, un pèse-personne vu de dessus : carte très arrondie, deux repose-pieds gris, un écran bleu clair **sans aucun nombre** ; même entrée | `soft_click` |
| « **remarque** » | 0:17,7 | 13,26 s | | dans l'écran, un **=** bleu (Lucide `equal`, 110 px) : la balance n'a pas bougé | rien |

**Un seul chiffre coloré** : la pilule jaune du × 4, dit dans la voix (« quatre fois plus »). Rien d'autre : ni « 200 », ni calories, ni kilo, ni flèche, ni nombre sur la balance.

**Les sons** : quatre `soft_click` (la séance, le × 4, le pain au chocolat, la balance), volume 0,6 (le barème × 0,6 du 28 septembre), pistes 11 à 14, chaque `<audio>` avec son `id`. Ni woosh, ni riser, ni `correct`, ni `wrong`, ni `bloop`, ni `impacts`.

**Avant le rendu final, recaler** : `ke.py … plans` donne le temps de chaque mot de la prise (+ 0,15 s) ; changer ensemble la valeur dans `CUES` et le `data-start` de l'`<audio>` du même élément, puis la durée (root et scène) : le dernier mot du plan B + une seconde.

**Vérifié le 28 septembre** : `npx hyperframes@0.8.21 check` passe, 0 erreur et 0 avertissement (lint, runtime, layout, motion, contraste 4/4) ; snapshots à chaque repère et à la fin, regardés (`renders/snapshots-v2/`) : rien n'entre avant son mot, aucun chevauchement, la pilule ne touche aucune carte ; rendu brouillon de 14,5 s en 1080 × 960, avec un flux audio (AAC), et les quatre clics s'entendent à 1,36, 3,47, 5,78 et 12,73 s (l'attaque du clic tombe 0,1 s après son départ).

**La police, un défaut du kit** : `assets/fonts/Archivo.woff2`, copié à l'identique dans toutes les vidéos, ne contient que le sous-ensemble vietnamien de Google Fonts (ni minuscules latines, ni chiffres). « × 4 » sort donc dans la police de secours, comme les animations précédentes. À corriger dans le kit, pas dans ce dossier.

**Ce qui fait refuser l'animation** : une bordure, une phrase, un chiffre qui n'est pas dans la voix, une balance qui affiche un nombre, un pain au chocolat en photo, un élément qui entre avant son mot, une composition muette.

**Pas de b-roll généré.** Zéro crédit.

## La couverture

La question du hook, en **ZY Elegant**, tout en capitales (la police n'a pas d'accents, la phrase n'en a pas besoin), comme l'assiette :

- en blanc : **TU FAIS DU SPORT,**
- en blanc : **ET TA BALANCE**
- en jaune, plus gros : **NE DESCEND PAS ?**

L'image : toi en grand, bouche fermée, regard dans l'objectif (`[couverture] temps` à choisir dans la piste montée). Le haut du texte vers y = 250.

## Publier

Le **mercredi 7 octobre**, le matin, vers 7 h - 8 h : l'heure où la personne monte sur sa balance (proposition, à caler sur tes statistiques). La légende et le titre YouTube sont dans [[video/to-film/08-sport-balance-monte/SCRIPT|SCRIPT]].

[[Tu fais du sport, et ta balance ne descend pas]] · [[Tes questions]] · [[HUB]]
