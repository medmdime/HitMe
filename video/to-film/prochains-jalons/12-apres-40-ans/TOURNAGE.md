# Tournage · Après 40 ans, c'est fini ?

J12 · **~28,2 s** · 134 mots · tournée à la **session 3, le dimanche 4 octobre**, montée le samedi 10 au plus tard, sort le **dimanche 11 octobre**

La narration nue est dans [[video/to-film/prochains-jalons/12-apres-40-ans/PROMPTEUR|PROMPTEUR]], les sources et la légende dans [[video/to-film/prochains-jalons/12-apres-40-ans/SCRIPT|SCRIPT]].

## Les blocs à tourner

Cinq blocs, chacun **trois fois**, **un clap au début de chaque prise** (une fois dans les mains, face caméra : c'est ce qui recale ta bouche sur le son au montage). Puis le texte entier d'une traite deux fois, en secours.

| Bloc | Cadre | Du début… | …à la fin | Prises |
|---|---|---|---|---|
| 1 · le hook | A | « Depuis la ménopause » | « C'est faux. » | 3 |
| 2 · la preuve | B | « Ton métabolisme, c'est ce que » | « qu'à soixante. » | 3 |
| 3 · ce qui a changé | B | « Alors, qu'est-ce qui a changé ? » | « changé de forme. » | 3 |
| 4 · le geste | A | « Donc non » | « après cinquante ans. » | 3 |
| 5 · l'appel | A | « Moi, c'est Mohamed » | « enregistre la vidéo. » | 3 |

## Réglages

Le même cadre que les autres vidéos, pour qu'on te reconnaisse : 4K 16:9, toi au centre **avec de l'air au-dessus de la tête** (le cadre B te met en bas de l'image, ta tête doit pouvoir dépasser de la carte), la lampe chaude derrière, le t-shirt blanc, le micro-cravate. Tu regardes l'objectif sur toutes les phrases.

## Le jeu

Le ton de toute la vidéo : **ferme avec l'idée, chaleureux avec elle**. Tu parles à une amie qui te dit qu'elle a tout essayé : tu es de son côté, et c'est la phrase qu'on lui répète que tu démontes. Pas d'ironie sur elle, pas de surprise jouée, rien qui ressemble à une leçon.

- **« Depuis la ménopause, tu n'arrives plus à perdre, alors que plus jeune, c'était simple ? »** : une vraie question, doucement, avec de l'empathie ; « c'était simple » un peu nostalgique.
- **« On te répond : « c'est l'âge, ton métabolisme s'effondre ». »** : tu cites, un ton un peu las, la phrase entendue cent fois ; « l'âge » et « s'effondre » bien dits.
- **« C'est faux. »** : un petit temps avant, puis sec, droit dans l'objectif, un demi-sourire. C'est le coup de la vidéo : ferme contre l'idée, jamais contre elle.
- **« Ton métabolisme, c'est ce que ton corps brûle chaque jour. »** : simple, comme on explique à une amie ; « brûle » posé (la flamme entre dessus).
- **« Des chercheurs l'ont mesuré chez des milliers de gens : »** : tu racontes, un souffle après « gens ».
- **« à corps égal, on brûle autant à vingt ans qu'à soixante. »** : lent ; « autant » et « soixante » détachés. C'est le moment fort. Si « à corps égal » accroche, dis « pour un même corps ».
- **« Alors, qu'est-ce qui a changé ? »** : sa question, que tu poses pour elle ; un petit temps après.
- **« À la ménopause, le muscle baisse un peu, le gras se met plus sur le ventre, et on bouge souvent moins. »** : trois constats simples, sans dramatiser ; « un peu » et « souvent » dits, pas avalés.
- **« Ton métabolisme n'a pas lâché : ton corps a changé de forme. »** : chaleureux, rassurant ; « n'a pas lâché » appuyé.
- **« Donc non, ce n'est pas fini. »** : ferme et doux, un sourire.
- **« Le muscle, ça se reprend : la musculation… »** : de l'énergie, un encouragement ; « en quelques mois » et « même après cinquante ans » appuyés.
- **L'appel** : simple, comme si tu te présentais.

## Le montage, en trois temps

Toi en grand, puis **une seule animation**, puis toi en grand. Rien d'autre. Temps estimés à 4,75 mots par seconde, souffles coupés, avant l'accélération ; `ke.py … plans` donnera les vrais.

| Temps | Cadre | Ce que tu dis | À l'image | Son |
|---|---|---|---|---|
| 0:00 → 0:05,1 | **A** | « Depuis la ménopause… C'est faux. » | toi en grand, zoom lent (1 → 1,06) | rien |
| 0:05,1 | A → B | | **un glissé simple** : l'animation entre par la droite, la carte ne bouge pas | aucun woosh |
| 0:05,1 → 0:19,2 | **B** | « Ton métabolisme… ton corps a changé de forme. » | **l'animation « La courbe plate »**, en haut ; toi détouré sur la carte, en bas | les quatre clics de l'animation, rien d'autre |
| 0:19,2 | B → A | | le glissé retour ; l'animation tient son dernier état depuis ~0:18,4 | rien |
| 0:19,2 → 0:28,2 | **A** | « Donc non, ce n'est pas fini… » puis l'appel | toi en grand ; **le seul punch-in** (1,15) sur « la musculation » ; sur l'appel, ton prénom, **Abonne-toi** et l'icône d'enregistrement sur le bandeau sombre | aucun clic, aucun riser ni hoop |

**Du début à la fin** :

- **Le titre fixe en haut** (y ≈ 70 → 210, au-dessus de la zone utile de l'animation), la question en cinq mots, en ZY Elegant comme la couverture : **APRES 40 ANS, C'EST FINI ?**, en blanc avec « C'EST FINI ? » en jaune, sur un léger dégradé sombre. **ZY Elegant n'a pas de lettres accentuées** : le « È » d'« APRÈS » s'écrit donc « E », comme on le fait souvent en capitales (voir la couverture). C'est la seule phrase écrite à l'écran.
- **Les sous-titres, sobres** : blancs, un mot en jaune par phrase ; sous ton menton en A (y = 1320), entre l'animation et ta tête en B (y = 980).
- **Pas de musique.** Aucun woosh, riser ni hoop.

**Les mots en jaune** (`[sous_titres] jaunes`, dans l'ordre) : `["perdre", "s'effondre", "faux", "brûle", "autant", "muscle", "ventre", "forme", "fini", "musculation", "Mohamed", "abonne-toi", "enregistre"]`.

**Pour la fiche `kallaway.toml`** (laissée telle que `preparer` l'a copiée, à réécrire au montage) : trois `[[plans]]` seulement : `hook` (A, de « Depuis », zoom lent), `courbe` (B, de « Ton métabolisme, c'est » : le « ton métabolisme » du hook, dans la citation, n'est pas le bon ; `anim = "compositions/B1-courbe-plate.html"`, `woosh = false`), `geste` (A, de « Donc », punch-in sur « musculation ») ; aucun `[[sons]]` ; **aucune** `[[musique]]` ; l'appel en `[[incrustes]]` sur son `[[bandeaux]]`. Dans `[video]`, `id = "apres-40-ans"` et `feuilles = ["compositions/components/kit.css", "compositions/components/youbud.css"]` : la composition porte tous ses styles, il n'y a pas de feuille propre à la vidéo (la fiche copiée pointe encore vers les plans de l'assiette).

## L'animation : « La courbe plate »

**`compositions/B1-courbe-plate.html`**, id `apres-40-ans-b1`, **1080 × 960**, **14,1 s** (la durée de B), DA YouBud (skill `inserts-youbud`), fond de toile claire (`assets/img/toile.jpg`), contenu utile entre y = 310 et y = 850. **Trois éléments et un chiffre** : la flamme, la courbe 20 ans → 60 ans (le chiffre), Muscle, Ventre. Des mots isolés, jamais de phrase. Elle se relit seule avec `index.html` (relecture seulement, réécrit au montage).

Les temps sont comptés **depuis le premier mot de B** (« Ton métabolisme »), estimés à 4,75 mots par seconde (le temps d'un mot = son rang dans B / 4,75) ; ils sont regroupés en tête du script de la composition dans l'objet `CUES`, avec le mot de chaque entrée, et à recaler sur la prise transcrite avant le rendu final (les `<audio>` portent les mêmes temps). Dans la vidéo, ajouter ~5,1 s.

| Entre sur le mot | Dans B | Dans la vidéo | Élément | Ce qu'on voit | Son |
|---|---|---|---|---|---|
| « **brûle** » (« ce que ton corps brûle chaque jour ») | 1,47 s | ~0:06,5 | **1 · la flamme** | une carte blanche sans bordure (y 310 → 560) ; à gauche, la flamme orange (`flame`) : ce que le corps brûle | `soft_click` |
| « **vingt** » (« autant à vingt ans ») | 5,47 s | ~0:10,5 | **2 · la courbe** (le chiffre) | le point jaune et **20 ans** ; la ligne jaune part vers la droite, **plate** | `soft_click` |
| « **soixante** » | 6,11 s | ~0:11,2 | (la courbe arrive) | la ligne touche le second point : **60 ans**. Elle n'a pas bougé d'un pixel en hauteur | aucun |
| « **muscle** » (« le muscle baisse un peu ») | 8,21 s | ~0:13,3 | **3 · Muscle** | en bas à gauche (y 660 → 840) : une carte bleu pâle, le mot **Muscle**, une pastille bleue dont la flèche **vers le bas** se dessine | `soft_click` |
| « **ventre** » (« le gras se met plus sur le ventre ») | 10,53 s | ~0:15,6 | **4 · Ventre** | en bas à droite : une carte orange pâle, le mot **Ventre**, une pastille orange dont la flèche **vers le haut** se dessine | `soft_click` |
| « **lâché** » (« Ton métabolisme n'a pas lâché ») | 12,63 s | ~0:17,7 | la flamme bat | la flamme grossit deux fois (1 → 1,14) puis revient : elle brûle toujours | aucun |
| (« ton corps a changé de **forme** ») | 14,1 s | ~0:19,2 | la fin | plus rien ne bouge depuis ~13,4 s dans B ; tout tient jusqu'au glissé retour | aucun |

**Au début de B** (0 → 1,5 s), l'écran du haut n'a que la toile : c'est le temps du glissé et de « Ton métabolisme, c'est ce que ton corps ». Rien n'entre avant son mot.

**Pendant « Alors, qu'est-ce qui a changé ? À la ménopause, le »** (6,4 → 8,2 s dans B) et **pendant « et on bouge souvent moins »** (10,9 → 12,6 s), rien n'entre : l'image tient, on t'écoute. « On bouge moins » n'a pas sa carte, pour rester à trois éléments.

**Les mots à l'écran** : 20 ans · 60 ans · Muscle · Ventre. Rien d'autre : ni « 6 421 », ni « −0,7 % », ni « 63 ans » (les chiffres exacts sont dans la légende), et plus de compteur 6 400, puisque le nombre n'est plus dit. La ligne est la seule chose jaune de la carte : c'est la phrase qu'on retient. Les cartes Muscle et Ventre sont dans l'ordre de la voix, de gauche à droite.

**Les sons** : quatre clics (`soft_click.wav`, volume 1,0 × 0,6 = **0,6**, 0,22 s, pistes 11 à 14, un `id` chacun), un par entrée. Ni `wrong`, ni `correct`, ni `impacts`, ni `bloop`, ni woosh. La flamme qui bat n'a pas de son.

**Ce qui a été vérifié le 28 septembre au soir, après la réécriture** :

- `npx --yes hyperframes@0.8.21 check` : **0 erreur, 0 avertissement** (lint, runtime, layout sur 9 échantillons, motion), contraste **9/9** en WCAG AA.
- `snapshot` à 1,0 ; 2,2 ; 5,8 ; 6,6 ; 8,8 ; 11,1 ; 12,8 ; 13,7 et 14,0 s (rangés dans `renders/snapshots/`, hors de git), regardés un par un : chaque élément entre sur son mot, rien ne déborde ni ne se chevauche, la ligne arrive plate sur 60 ans, la flamme est plus grosse à 12,8 s et revenue à sa taille à la fin. Les textes s'affichent dans une police de secours : la police Archivo du kit n'a pas de lettres latines, un défaut connu de tout le kit.
- **Brouillon** : `renders/B1-courbe-plate-brouillon.mp4` (`-q draft`, 14,1 s, 1080 × 960, h264 + **aac**), planche tirée du rendu dans `renders/rendu/planche.png`. Les quatre clics s'entendent à 1,57 ; 5,57 ; 8,31 et 10,63 s (le fichier du clic a ~0,1 s de silence avant l'attaque).

**Pas de b-roll généré.** Zéro crédit.

## La couverture

La question, en **ZY Elegant**, tout en capitales. La police n'a pas d'accents : « APRÈS » s'écrit **APRES**.

- en blanc : **APRES 40 ANS,**
- en jaune, plus gros : **C'EST FINI ?**

L'image : toi en grand, bouche fermée, regard dans l'objectif, l'air calme (`[couverture] temps` à choisir dans la piste montée). Le haut du texte vers y = 250.

## Publier

Le **dimanche 11 octobre**. Sur les trois plateformes, la légende et le titre YouTube sont dans [[video/to-film/prochains-jalons/12-apres-40-ans/SCRIPT|SCRIPT]].

[[Après 40 ans, c'est fini]] · [[HUB]]
