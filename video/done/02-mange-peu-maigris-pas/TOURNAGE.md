# Tournage · Tu manges peu, et tu ne maigris pas

J2 · **l'histoire de ton ami** · **~30 s** · 144 mots · tournée à la session 1 (lundi 28 au soir ou mardi 29), montée le mercredi 30 au plus tard, sort le **jeudi 1er octobre**

La narration nue est dans [[video/done/02-mange-peu-maigris-pas/PROMPTEUR|PROMPTEUR]], les sources et la légende dans [[video/done/02-mange-peu-maigris-pas/SCRIPT|SCRIPT]].

**Avant de tourner** : confirme les trois points de l'histoire que le texte déduit de tes notes (les trois cents calories étaient par jour, ton ami ne notait pas ces bouts, il ne maigrissait pas). Si l'un est faux, la phrase change avant la prise.

## Les blocs à tourner

C'est une histoire, le « yapping » maison : **d'abord le texte entier d'une traite, trois fois**, un clap au début de chaque prise. Une histoire racontée sans s'arrêter sonne plus vraie, et c'est cette prise qu'on monte si elle coule. Puis **chaque bloc trois fois**, en secours, un clap au début de chaque prise (une fois dans les mains, face caméra : c'est ce qui recale ta bouche sur le son au montage).

| Bloc | Cadre | Du début… | …à la fin | Prises |
|---|---|---|---|---|
| Le texte entier | A, B, A | « Tu manges peu » | « enregistre la vidéo. » | 3 |
| 1 · le hook | A | « Tu manges peu » | « ça ne compte pas. » | 3 |
| 2 · les bouts et l'appli | B | « Un petit biscuit » | « ce qui fait maigrir. » | 3 |
| 3 · le compte | B | « Mais quand on a compté » | « annuler son déficit. » | 3 |
| 4 · l'étude | B | « Mon ami n'est pas le seul » | « ce qu'ils notaient. » | 3 |
| 5 · la fin | A | « Un bout, ça compte » | « avant de l'oublier. » | 3 |
| 6 · l'appel | A | « Moi, c'est Mohamed » | « enregistre la vidéo. » | 3 |

## Réglages

Le même cadre que les autres vidéos, pour qu'on te reconnaisse : 4K 16:9, toi au centre **avec de l'air au-dessus de la tête** (le cadre B te met en bas de l'image, ta tête doit pouvoir dépasser de la carte), la lampe chaude derrière, le t-shirt blanc, le micro-cravate. Tu regardes l'objectif sur toutes les phrases. « Maison » veut dire ça : ton coin habituel, rien de plus.

## Le jeu

Le ton de toute la vidéo : **tu racontes une histoire à un pote**, pas une leçon. Un peu plus vivant que d'habitude : les mains peuvent bouger, le visage aussi. Tu parles de ton ami avec tendresse : on rit avec lui, jamais de lui.

- **« Tu manges peu, et tu ne maigris pas ? »** : une vraie question, doucement, comme si on venait de te la poser.
- **« Un ami à moi était au régime, dans ton cas. »** : le ton de quelqu'un qui commence une anecdote ; « dans ton cas » droit dans l'objectif.
- **« Il me disait : « Je prends juste un bout, ça ne compte pas. » »** : tu le joues un peu, comme lui, avec un petit sourire et un haussement d'épaules sur « ça ne compte pas ». Laisse un souffle après : c'est la question qui reste.
- **« Un petit biscuit par-ci, un bout de croissant par-là »** : léger, presque en chantonnant, la main qui picore à gauche puis à droite.
- **« il ne les notait pas. Donc sur son appli, il était toujours en déficit »** : tu poses les faits ; « déficit » net.
- **« moins de calories que ce que son corps brûle. C'est ce qui fait maigrir. »** : simple, comme on explique à un enfant, sans ralentir.
- **« Mais quand on a compté chaque bout »** : un temps avant « Mais », puis tu baisses d'un cran.
- **« ça faisait trois cents calories de plus par jour. »** : « trois cents » détaché, lent. C'est le moment fort.
- **« Assez pour annuler son déficit. »** : sec, court.
- **« Mon ami n'est pas le seul. »** : tu relances, un cran plus haut.
- **« Des chercheurs l'ont mesuré : … presque le double de ce qu'ils notaient. »** : posé, sûr ; « presque le double » appuyé.
- **« Un bout, ça compte. »** : droit dans l'objectif, net. C'est la réponse à la phrase de ton ami.
- **« Prends ton biscuit, mais note-le tout de suite, avant de l'oublier. »** : chaleureux, un conseil d'ami ; « Prends ton biscuit » avec un sourire.
- **L'appel** : simple, comme si tu te présentais.

## Le montage, en trois temps

Toi en grand, puis **une seule animation**, puis toi en grand. Rien d'autre. Temps estimés à 4,75 mots par seconde, souffles coupés, avant l'accélération ; `ke.py … plans` donnera les vrais.

| Temps | Cadre | Ce que tu dis | À l'image | Son |
|---|---|---|---|---|
| 0:00 → 0:06,3 | **A** | « Tu manges peu, et tu ne maigris pas ? Un ami à moi était au régime, dans ton cas. Il me disait : « Je prends juste un bout, ça ne compte pas. » » | toi en grand, zoom lent (1 → 1,06) | rien |
| 0:06,3 | A → B | | **un glissé simple** : l'animation entre par la droite, la carte ne bouge pas | aucun woosh |
| 0:06,3 → 0:23,6 | **B** | « Un petit biscuit par-ci… ce qu'ils notaient. » | **l'animation `B1-les-petits-bouts`**, en haut ; toi détouré sur la carte, en bas | les sept clics de l'animation, rien d'autre |
| 0:23,6 | B → A | | le glissé retour, après « notaient » | rien |
| 0:23,6 → 0:30,3 | **A** | « Un bout, ça compte. Prends ton biscuit, mais note-le tout de suite, avant de l'oublier. » puis l'appel | toi en grand ; **le seul punch-in** (1,15) sur « compte » de « Un bout, ça compte » ; sur l'appel, ton prénom, **Abonne-toi** et l'icône d'enregistrement sur le bandeau sombre | aucun clic, aucun riser ni hoop |

**Du début à la fin** :

- **Le titre fixe en haut** (y ≈ 70 → 210, au-dessus de la zone utile de l'animation) : **TU MANGES PEU, ET TU NE MAIGRIS PAS ?**, en ZY Elegant comme la couverture, en blanc avec « MAIGRIS PAS ? » en jaune, sur un léger dégradé sombre. C'est la seule phrase écrite à l'écran.
- **Les sous-titres, sobres** : blancs, un mot en jaune par phrase ; sous ton menton en A (y = 1320), entre l'animation et ta tête en B (y = 980). La phrase de ton ami s'écrit entre guillemets, comme tu la dis.
- **Aucun woosh, riser ni hoop, pas de musique** : la règle du format, dans [[Tes questions]].

**Les mots en jaune** (`[sous_titres] jaunes`, dans l'ordre ; à écrire comme large-v3 les entend, « 300 » en chiffres sans doute) : `["maigris", "ami", "compte", "notait", "déficit", "maigrir", "300", "annuler", "seul", "double", "compte", "note-le", "Mohamed", "abonne-toi", "enregistre"]`.

**Pour la fiche `kallaway.toml`** (celle du dossier est encore l'exemple de l'assiette, à réécrire après le tournage) : trois `[[plans]]` seulement : `hook` (A, de « Tu », zoom lent), `bouts` (B, de « Un » de « Un petit biscuit », `anim = "compositions/B1-les-petits-bouts.html"`, `woosh = false`), `fin` (A, de « Un » de « Un bout, ça compte », `zoom = { type = "punch_sur_mot", mot = …, echelle = 1.15 }` sur son « compte ») ; aucun `[[sons]]` ; aucune `[[musique]]` ; l'appel en `[[incrustes]]` sur son `[[bandeaux]]`. **Attention aux mots répétés** : dans la prise d'une traite, « un » revient cinq fois et « compte » trois fois (« ça ne compte pas », « compté », « ça compte ») ; désigne-les par leur rang, `PRISE@n`, tel que `ke.py … transcrire` l'affiche. Dans `[video] feuilles`, seulement `kit.css` et `youbud.css`.

## L'animation : `compositions/B1-les-petits-bouts.html`

**Une composition 1080 × 960**, id `mange-peu-b1`, DA YouBud (skill `inserts-youbud`), fond de toile claire (`assets/img/toile.jpg`), contenu entre y = 280 et y = 930 (au-dessus de 230, le titre fixe). **Trois éléments et un chiffre** : les bouts (un biscuit, un bout de croissant), l'appli, le déficit sous la ligne du corps ; et **+300**. Des mots seuls, jamais de phrase : **Appli · Déficit · Corps · +300**. Les bouts n'ont pas de mot : l'icône du biscuit et celle du croissant, dites par la voix au même moment. Aucune bordure. Durée : **17,26 s**, celle du temps B (82 mots).

Ce qu'elle dit, sans une phrase : **les petits bouts flottent à côté de l'appli, pas comptés ; l'appli est sous la ligne du corps, et l'espace vert entre les deux, c'est le déficit ; quand on compte les bouts, ils remplissent cet espace jusqu'à la ligne : +300, le déficit est barré.**

| Entre sur le mot | Repère (depuis le début de B) | Dans la vidéo | Élément | Ce qu'on voit | Son |
|---|---|---|---|---|---|
| « **biscuit** » (« Un petit biscuit ») | 0,42 s | ~0:06,7 | **1 · les bouts** | à droite, de travers : une tuile orange clair avec l'icône du biscuit | `soft_click` |
| « **croissant** » | 1,47 s | ~0:07,8 | les bouts | dessous, de travers dans l'autre sens : la tuile du croissant | `soft_click` |
| « **appli** » | 3,58 s | ~0:09,9 | **2 · l'appli** | au centre : une colonne blanche monte du sol, le téléphone dedans, le mot **Appli** dessous | `soft_click` |
| « **déficit** » | 4,63 s | ~0:11,0 | **3 · le déficit** | une zone vert clair monte au-dessus de la colonne ; le mot **Déficit** entre à sa gauche | `soft_click` |
| « **corps** » (« son corps brûle ») | 6,32 s | ~0:12,6 | le déficit | la ligne bleue se trace en haut de la zone verte ; la flamme et le mot **Corps** au-dessus | `soft_click` |
| « **compté** », « **bout** » | 8,63 → 9,05 s | ~0:15,0 → 0:15,4 | les bouts | le biscuit, puis le croissant, se redressent et tombent dans la zone verte, l'un sur l'autre : la pile arrive pile à la ligne | rien |
| « **trois** » (« trois cents ») | 9,68 s | ~0:16,0 | **+300** | la pilule jaune **+300** se pose à droite de la pile | `soft_click` |
| « **annuler** » | 11,58 s | ~0:17,9 | le déficit barré | un trait rouge barre le mot **Déficit**, qui encaisse (quatre secousses de 9 px) ; rien d'autre ne bouge ; tout tient jusqu'à la fin du plan | `soft_click` |

**Pendant la phrase de l'étude** (0:18,5 → 0:23,6), rien n'entre : l'image tient, on t'écoute. Le « presque le double » reste dans la voix : un seul chiffre à l'écran.

**La pile arrive à la ligne, pas au-dessus** : ton ami a annulé son déficit, il n'est pas passé au-dessus de ce qu'il brûle. Les tailles sont un schéma, pas une mesure : on ne connaît ni ce qu'il mangeait ni la taille de son déficit.

**Les sons** : sept `soft_click`, volume 0,6, un par élément qui se pose. Les deux bouts tombent sans bruit, le clic du +300 arrive juste après. Ni woosh, ni riser, ni musique, ni `wrong`, ni `correct`. Le clic a 0,1 s de silence en tête : on l'entend 0,1 s après le repère, pendant que l'élément se pose.

**Recaler après le tournage.** Les repères sont regroupés en tête du script de la composition, dans l'objet `CUES` (mot → seconde). Après `ke.py … plans` :

1. remplacer chaque valeur de `CUES` par le repère de son mot (le temps du mot + 0,15 s, ce que `plans` affiche) ;
2. mettre la même valeur dans le `data-start` de l'`<audio>` du même nom : `#b1-s-biscuit`, `#b1-s-croissant`, `#b1-s-appli`, `#b1-s-deficit`, `#b1-s-corps`, `#b1-s-trois`, `#b1-s-annuler` (`compte` et `bout` n'ont pas de clic) ;
3. régler le `data-duration` du root et de la scène : fin du plan − début de l'hôte + 0,14 s (`ke.py … montage` dit de combien allonger) ; la dernière image tient.

**La police.** Le texte sort dans la police de secours, comme sur l'assiette : le fichier `assets/fonts/Archivo.woff2` du kit ne contient pas les lettres latines. À remplacer dans le kit, pour toutes les vidéos à la fois, pas ici seul.

**Vérifié le 28 septembre au soir** : `npx hyperframes@0.8.21 check` sans erreur ni avertissement (lint, runtime, mise en page sur 9 échantillons, mouvement, contraste 13/13) ; snapshots à chaque entrée et à la fin (`renders/snapshots/`) : rien ne déborde, rien ne se chevauche, la pile arrive à la ligne, les mots se lisent ; rendu brouillon `renders/B1-les-petits-bouts-brouillon.mp4` (17,3 s, 1080 × 960, un flux audio AAC, les sept clics entendus à 0,52 · 1,57 · 3,68 · 4,73 · 6,42 · 9,78 · 11,68 s). La page `index.html` du dossier n'héberge que cette animation, pour la relecture : `ke.py … montage` la remplacera.

**Pas de b-roll généré.** Zéro crédit.

## La couverture

La question, en **ZY Elegant**, tout en capitales (la police n'a pas d'accents, la phrase n'en a pas besoin), comme l'assiette :

- en blanc : **TU MANGES PEU,**
- en jaune, plus gros : **ET TU NE / MAIGRIS PAS ?**

L'image : toi en grand, bouche fermée, regard dans l'objectif (`[couverture] temps` à choisir dans la piste montée ; le petit sourire après la phrase de ton ami marche bien). Le haut du texte vers y = 250.

## Publier

Le **jeudi 1er octobre**. Sur les trois plateformes, la légende et le titre YouTube sont dans [[video/done/02-mange-peu-maigris-pas/SCRIPT|SCRIPT]].

[[Tu manges peu, et tu ne maigris pas]] · [[HUB]]
