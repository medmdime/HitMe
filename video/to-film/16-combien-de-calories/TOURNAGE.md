# Tournage · Combien de calories par jour pour maigrir

J7 · **~28 s** · 132 mots · tournée à la session 2 (jeudi 1er octobre), montée la veille de sa sortie au plus tard, sort le **mardi 6 octobre** (le plan des 30 peut la décaler)

La narration nue est dans [[video/to-film/16-combien-de-calories/PROMPTEUR|PROMPTEUR]], les sources et la légende dans [[video/to-film/16-combien-de-calories/SCRIPT|SCRIPT]].

## Les blocs à tourner

Sept blocs, chacun **trois fois**, **un clap au début de chaque prise** (une fois dans les mains, face caméra : c'est ce qui recale ta bouche sur le son au montage). Puis le texte entier d'une traite deux fois, en secours.

| Bloc | Cadre | Du début… | …à la fin | Prises |
|---|---|---|---|---|
| 1 · la question | A | « Combien de calories » | « un chiffre différent. » | 3 |
| 2 · le retournement | A | « Mais aucun » | « pour toi. » | 3 |
| 3 · l'entretien | B | « Ton chiffre part » | « enlève un peu. » | 3 |
| 4 · l'étude | B | « Pas un quart » | « pendant deux ans. » | 3 |
| 5 · ce qu'ils ont tenu | B | « Au bout de six mois » | « sept kilos et demi de moins. » | 3 |
| 6 · le geste | A | « Donc vise » | « qui fait maigrir. » | 3 |
| 7 · l'appel | A | « Moi, c'est Mohamed » | « enregistre la vidéo. » | 3 |

Les blocs 1 et 2 peuvent se tourner d'une traite si ça vient mieux : garde un temps avant « Mais ».

## Réglages

Le même cadre que les autres vidéos : 4K 16:9, toi au centre **avec de l'air au-dessus de la tête** (le cadre B te met en bas de l'image, ta tête doit pouvoir dépasser de la carte), la lampe chaude derrière, le t-shirt blanc, le micro-cravate. Tu regardes l'objectif sur toutes les phrases.

## Le jeu

Le ton de toute la vidéo : **posé, comme à un ami** qui te pose la question en face de toi. Pas d'ironie, pas de leçon.

- **« Combien de calories par jour pour maigrir ? »** : la question qu'on t'a posée cent fois, posée simplement, sans lassitude.
- **« Chaque site dit un chiffre différent. »** : complice, un léger sourire.
- **« Mais aucun n'a été calculé pour toi. »** : un temps avant « Mais » ; « pour toi » droit dans l'objectif.
- **« Ton chiffre part de ton entretien… »** : tu expliques, simple ; « quand ton poids ne bouge pas » bien clair.
- **« Puis enlève un peu. »** : léger.
- **« Pas un quart : »** : un temps, puis tu racontes l'étude, posé.
- **« à peine un dixième de moins : presque deux cuillères d'huile par jour »** : un constat, sans moquerie ; les cuillères concrètes, comme si tu les montrais.
- **« Mais au bout de deux ans, ils avaient toujours sept kilos et demi de moins. »** : le moment fort ; un temps avant « Mais », « toujours » appuyé, un sourire.
- **« Donc vise ce qu'ils ont tenu, un dixième de moins… »** : droit dans l'objectif ; « un dixième de moins » détaché.
- **« c'est le total qui fait maigrir »** : simple, rassurant.
- **L'appel** : simple, comme si tu te présentais.

## Le montage, en trois temps

Toi en grand, puis **une seule animation**, puis toi en grand. Rien d'autre. Temps estimés à 4,75 mots par seconde, souffles coupés, avant l'accélération ; `ke.py … plans` donnera les vrais.

| Temps | Cadre | Ce que tu dis | À l'image | Son |
|---|---|---|---|---|
| 0:00 → 0:04,2 | **A** | « Combien de calories par jour pour maigrir ? Chaque site dit un chiffre différent. Mais aucun n'a été calculé pour toi. » | toi en grand, zoom lent (1 → 1,06) | rien |
| 0:04,2 | A → B | | **un glissé simple** : l'animation entre par la droite, la carte ne bouge pas | aucun woosh ; un clic discret au plus |
| 0:04,2 → 0:19,4 | **B** | « Ton chiffre part de ton entretien… sept kilos et demi de moins. » | **l'animation « La barre de l'entretien »**, en haut ; toi détouré sur la carte, en bas | les clics de l'animation ; la musique très basse part ici, ou rien |
| 0:19,4 | B → A | | le glissé retour, après que l'animation a tenu sur son dernier état | rien |
| 0:19,4 → 0:27,8 | **A** | « Donc vise ce qu'ils ont tenu, un dixième de moins, et fais le compte sur la semaine : c'est le total qui fait maigrir. » puis l'appel | toi en grand ; **le seul punch-in** (1,15) sur « un dixième de moins » ; sur l'appel, ton prénom, **Abonne-toi** et l'icône d'enregistrement sur le bandeau sombre | aucun clic, aucun riser ni hoop |

**Du début à la fin** :

- **Le titre fixe en haut** (y ≈ 70 → 210, au-dessus de la zone utile de l'animation) : **COMBIEN DE CALORIES PAR JOUR POUR MAIGRIR ?**, en ZY Elegant comme la couverture, « COMBIEN DE CALORIES » en blanc, « PAR JOUR POUR MAIGRIR ? » en jaune, sur un léger dégradé sombre. C'est la seule phrase écrite à l'écran.
- **Les sous-titres, sobres** : blancs, un mot en jaune par phrase ; sous ton menton en A (y = 1320), entre l'animation et ta tête en B (y = 980).
- **Aucun woosh, riser ni hoop.** La musique très basse, ou rien.

**Les mots en jaune** (`[sous_titres] jaunes`, dans l'ordre) : `["calories", "différent", "toi", "entretien", "peu", "quart", "cuillères", "kilos", "dixième", "Mohamed", "abonne-toi", "enregistre"]`.

**Pour la fiche `kallaway.toml`** : trois `[[plans]]` seulement : `hook` (A, de « Combien », zoom lent), `barre` (B, de « Ton », l'animation, `woosh = false`), `geste` (A, de « Donc », punch-in sur « dixième ») ; aucun `[[sons]]` ; une `[[musique]]` très basse de `plan:barre` à `"fin"`, ou aucune ; l'appel en `[[incrustes]]` sur son `[[bandeaux]]`.

## L'animation : « La barre de l'entretien »

**Une composition 1080 × 960**, DA YouBud (skill `inserts-youbud`), fond de toile claire, contenu utile entre y = 230 et y = 940 (au-dessus, le titre fixe). **Trois éléments et un chiffre.** Des mots isolés, jamais de phrase. Les temps sont ceux de la vidéo ; dans la composition, ils partent de 0 au début du plan B (soustraire 4,2 s).

**La mise en place** : une seule grande barre **verticale**, centrée un peu à gauche (x 300 → 600, y 250 → 900), comme un verre qu'on remplit : ce que tu manges en une journée d'entretien. Les mots se posent à sa droite (x ≈ 640).

| Entre sur le mot | Temps | Élément | Ce qu'on voit | Son |
|---|---|---|---|---|
| « **entretien** » | ~0:05,3 | **1 · l'entretien** | la barre monte du bas jusqu'en haut en 0,5 s, orange pâle (`--yb-orange-2`, rebord `--yb-orange-edge`), sans bordure ; à sa droite, en bas, ⚖️ et le mot **Entretien** | `soft_click` |
| « **quart** » (« devaient manger un quart de moins ») | ~0:10,9 | **2 · le quart prévu** | une ligne en pointillés gris (`--ink-faint`) traverse la barre au quart du haut (y ≈ 412) ; le quart du dessus pâlit, hachuré ; à droite de la ligne, le mot **Prévu**, en gris. Pas de rouge : on ne juge pas | `soft_click` |
| « **dixième** » (« à peine un dixième de moins ») | ~0:14,3 | **3 · le dixième tenu** | le dixième du haut de la barre (y 250 → 315) se remplit de jaune (`--key`) ; à sa droite, **−10 %** en gros sur une pastille jaune, et le mot **Tenu** dessous | `soft_click` |
| « **cuillères** » | ~0:15,4 | (dans l'élément 3) | deux cuillères 🥄 côte à côte apparaissent dans le morceau jaune | `soft_click` |
| « **kilos** » (« sept kilos et demi de moins ») | ~0:18,3 | (dans l'élément 3) | une coche verte (`--good`) se dessine à côté de **Tenu** ; tout tient jusqu'au glissé | `soft_click` |

**Pendant « Puis enlève un peu » et le début de l'étude** (0:07,6 → 0:10,9), rien n'entre : la barre seule, on t'écoute.

**Les mots à l'écran** : Entretien · Prévu · Tenu · −10 %. Rien d'autre : ni « 25 % » (le quart se voit, il ne s'écrit pas), ni « 7,5 kg », ni « 143 » (tu les dis ; les chiffres exacts sont dans la légende). Un seul chiffre, celui du geste.

**Les sons** : des clics seulement (`soft_click`, volume 0,6, déjà réduit comme le veut le § 7 du [[methode/Le Kallaway edit|Kallaway edit]]). Ni `wrong`, ni `correct`, ni `impacts`, ni `bloop`.

**Pas de b-roll généré.** Zéro crédit.

## La couverture

La question, en **ZY Elegant**, tout en capitales (la police n'a pas d'accents, la phrase n'en a pas besoin), comme l'assiette :

- en blanc : **COMBIEN DE CALORIES**
- en jaune, plus gros : **PAR JOUR / POUR MAIGRIR ?**

L'image : toi en grand, bouche fermée, regard dans l'objectif (`[couverture] temps` à choisir dans la piste montée). Le haut du texte vers y = 250.

## Publier

Le **mardi 6 octobre**, si le plan des 30 ne la décale pas. La légende et le titre YouTube sont dans [[video/to-film/16-combien-de-calories/SCRIPT|SCRIPT]].

[[Combien de calories par jour pour maigrir]] · [[HUB]]
