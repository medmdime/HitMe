# Tournage · Tu sais quoi faire, mais tu n'y arrives pas

J14 · **~29 s** · 139 mots · tournée à la **session 4 (mercredi 7 octobre)**, avec J13 · montée le lundi 12 au plus tard · sort le **mardi 13 octobre**

La narration nue est dans [[video/to-film/prochains-jalons/14-savoir-sans-y-arriver/PROMPTEUR|PROMPTEUR]], les sources et la légende dans [[video/to-film/prochains-jalons/14-savoir-sans-y-arriver/SCRIPT|SCRIPT]].

## Les blocs à tourner

Trois blocs, un par temps de la vidéo, chacun **trois fois**, **un clap au début de chaque prise** (une fois dans les mains, face caméra : c'est ce qui recale ta bouche sur le son au montage). Puis le texte entier d'une traite deux fois, en secours.

| Bloc | Cadre | Du début… | …à la fin | Mots | Prises |
|---|---|---|---|---|---|
| 1 · le hook | A | « Tu sais quoi faire » | « C'est faux. » | 23 | 3 |
| 2 · l'explication | B | « La motivation » | « tu es dans les temps. » | 74 | 3 |
| 3 · le geste et l'appel | A | « Commence par un seul geste » | « enregistre la vidéo. » | 42 | 3 |

Si le bloc 2 accroche d'une traite, coupe-le en deux prises : de « La motivation » à « Plus de deux mois. », puis de « Mais rater » à « dans les temps. ».

## Réglages

Le même cadre que les autres vidéos : 4K 16:9, toi au centre **avec de l'air au-dessus de la tête** (le cadre B te met en bas de l'image, ta tête doit pouvoir dépasser de la carte), la lampe chaude derrière, le t-shirt blanc, le micro-cravate. Tu regardes l'objectif sur toutes les phrases.

## Le jeu

Le ton de toute la vidéo : **direct et chaleureux**. Ferme contre la promesse des vingt et un jours et contre « il suffit d'être motivé » ; doux avec la personne en face, comme un ami qui lui enlève un poids. Pas d'ironie, pas de leçon.

- **« Tu sais quoi faire, mais tu n'y arrives pas ? »** : une vraie question, doucement, comme si on venait de te la confier.
- **« On t'a promis qu'une habitude se prend en vingt et un jours. »** : un peu d'agacement, contre ceux qui promettent, jamais contre la personne.
- **« C'est faux. »** : un temps avant, puis sec. Deux mots, droit dans l'objectif. C'est la question que la vidéo va fermer.
- **« La motivation te fait démarrer, pas tenir. »** : ferme ; un petit temps sur la virgule, « pas tenir » appuyé.
- **« Ce qui te fait tenir, c'est l'habitude… sans y penser. »** : tu expliques, simplement ; « tout seul » appuyé.
- **« Combien de temps pour en prendre une ? »** : une vraie question, tu relances.
- **« Des chercheurs l'ont mesuré : soixante-six jours en moyenne. »** : un temps avant « soixante-six », détaché. C'est le moment fort.
- **« Plus de deux mois. »** : posé, lent, presque pour toi.
- **« Mais rater un jour ne changeait presque rien. »** : plus léger, une bonne nouvelle ; « presque rien » avec le sourire.
- **« Donc si, au bout de vingt et un jours… tu es dans les temps. »** : doux, rassurant ; « tu n'as pas échoué » un cran plus bas, « tu es dans les temps » avec le sourire.
- **« Commence par un seul geste… le déclencher tout seul. »** : droit dans l'objectif, un conseil d'ami ; « au même moment » appuyé.
- **L'appel** : simple, comme si tu te présentais.

## Le montage, en trois temps

Toi en grand, puis **une seule animation**, puis toi en grand. Rien d'autre. Temps estimés à 4,75 mots par seconde, souffles coupés, avant l'accélération ; `ke.py … plans` donnera les vrais.

| Temps | Cadre | Ce que tu dis | À l'image | Son |
|---|---|---|---|---|
| 0:00 → 0:04,8 | **A** | « Tu sais quoi faire, mais tu n'y arrives pas ? On t'a promis qu'une habitude se prend en vingt et un jours. C'est faux. » | toi en grand, zoom lent (1 → 1,06) | rien |
| 0:04,8 | A → B | | **un glissé simple** : l'animation entre par la droite, la carte ne bouge pas | aucun woosh |
| 0:04,8 → 0:20,4 | **B** | « La motivation te fait démarrer… tu es dans les temps. » | **l'animation « Soixante-six jours »**, en haut ; toi détouré sur la carte, en bas | les quatre clics de l'animation, rien d'autre |
| 0:20,4 | B → A | | le glissé retour | rien |
| 0:20,4 → 0:29,3 | **A** | « Commence par un seul geste… le déclencher tout seul. » puis l'appel | toi en grand ; **le seul punch-in** (1,15) sur « au même moment » ; sur l'appel, ton prénom, **Abonne-toi** et l'icône d'enregistrement sur le bandeau sombre | aucun clic, aucun riser ni hoop |

**Du début à la fin** :

- **Le titre fixe en haut** (y ≈ 70 → 210, au-dessus de la zone utile de l'animation) : **TU N'Y ARRIVES PAS ?** (4 mots), en ZY Elegant comme la couverture, en blanc avec « ARRIVES PAS ? » en jaune, sur un léger dégradé sombre. Pas d'accent : la police n'en a pas, la phrase n'en a pas besoin. C'est la seule phrase écrite à l'écran.
- **Les sous-titres, sobres** : blancs, un mot en jaune par phrase ; sous ton menton en A (y = 1320), entre l'animation et ta tête en B (y = 980).
- **Pas de musique.** Aucun woosh, riser ni hoop.

**Les mots en jaune** (`[sous_titres] jaunes`, dans l'ordre, un par phrase) : `["arrives", "promis", "faux", "tenir", "penser", "combien", "soixante-six", "mois", "rater", "temps", "seul", "moment", "Mohamed", "abonne-toi", "enregistre"]`. L'outil les cherche dans l'ordre du texte : « penser » plutôt qu'« habitude » (Whisper écrit « l'habitude » d'un bloc, le mot ne serait pas trouvé), et « temps » tombe bien sur « dans les temps » : il vient après « rater » dans la liste, « Combien de temps » est donc déjà passé. Si Whisper écrit « 66 » en chiffres, mettre `"66"` à la place de `"soixante-six"`.

**Pour la fiche `kallaway.toml`** (celle du dossier est encore le gabarit de l'assiette, à réécrire au montage) : `feuilles` = `kit.css` et `youbud.css` seulement, **sans `assiette.css`** (l'animation porte ses propres règles) ; trois `[[plans]]` : `hook` (A, de « Tu », zoom lent), `jauge` (B, de « La », `anim = "compositions/B1-soixante-six-jours.html"`, `woosh = false`), `geste` (A, de « Commence », punch-in sur « moment ») ; aucun `[[sons]]`, aucune `[[musique]]` ; l'appel en `[[incrustes]]` sur son `[[bandeaux]]`.

## L'animation : « Soixante-six jours »

**`compositions/B1-soixante-six-jours.html`**, id `savoir-b1`, 1080 × 960, **15,58 s** (la durée du plan B), DA YouBud (skill `inserts-youbud`), fond de toile claire (`assets/img/toile.jpg`), contenu utile entre y = 230 et y = 940. **Trois éléments et un chiffre**, des mots isolés, aucune bordure, une seule timeline GSAP. Refaite le 28 septembre au soir sur le nouveau texte B : la carte « 1 geste » est devenue la carte Motivation, la jauge a pris son mot et le cran des 21. Les temps partent de 0 au premier mot du plan B (« La ») ; dans la vidéo, ajouter 4,8 s. Ils sont regroupés en tête du script dans l'objet `CUES`, un mot par repère.

| Entre sur le mot | Temps (dans B) | Élément | Ce qu'on voit | Son |
|---|---|---|---|---|
| « **motivation** » (mot 2) | 0,21 s | **1 · la motivation** | en haut à gauche : une carte orange pâle (`--yb-orange-2`, rebord plein), une flamme Lucide orange, **Motivation** dessous ; la flamme vacille deux fois | `soft_click` |
| « **pas** » (« pas tenir », mot 6) | 1,05 s | | la flamme retombe : elle rapetisse (× 0,6), descend et passe au gris en 0,6 s | aucun |
| « **l'habitude** » (mot 14) | 2,74 s | **2 · l'habitude** | au milieu : le mot **Habitude**, et dessous, sur toute la largeur (x 90 → 990, y 640), une piste blanche arrondie à rebord, vide, avec un cran fin aux 21/66 de sa longueur et **21** dessous, en gris | `soft_click` |
| « **Combien** » (mot 25) | 5,05 s → 7,37 s | la jauge se remplit | le vert (`--yb-green`, rebord `--yb-green-edge`) avance à vitesse constante pendant 2,3 s ; il passe le cran des 21 sans s'arrêter (vers 5,8 s) : la boucle « combien ? » se voit | aucun |
| « **chercheurs** » (mot 33) | 6,74 s | la source | en bas à gauche, en petit : **LALLY · 2010**, en fondu | aucun |
| « **soixante-six** » (mot 36) | 7,37 s | **le chiffre** | la jauge touche le bout ; en haut à droite, **66 jours** en grosse pilule jaune (`--key`), le seul rebond, puis une pulsation | `soft_click` |
| « **rater** » (mot 45) | 9,26 s | **3 · le jour raté** | une pastille rouge (`.yb-badge.ko`) se pose **sur la jauge pleine**, vers le 45e jour, sa croix se dessine ; **la jauge ne bouge pas** | `soft_click` |
| « **jour** » (« un jour », mot 47) | 9,68 s | | **1 jour** apparaît sous la croix | aucun |
| « **vingt** » (« vingt et un jours », mot 57) | 11,79 s | | le **21** sous la jauge fonce et pulse une fois (× 1,3) : il est au premier tiers, loin du bout | aucun |
| « dans les temps. » (fin, mot 74) | 12,2 s → 15,58 s | | tout tient, rien ne bouge (3,4 s de tenue) ; le glissé retour part sur cette image | |

**Les mots à l'écran** : Motivation · Habitude · 21 · 66 jours · 1 jour · LALLY · 2010. Rien d'autre : ni « 18 », ni « 254 » (ils sont dans la légende). Le 21 et le 66 sont dits dans la voix ; le vert qui passe le cran des 21 sans s'arrêter montre, sans une phrase, que la promesse était trop courte, et la croix sur la jauge pleine que rater un jour ne la vide pas.

**Les sons** : quatre `soft_click` (volume 0,6, déjà réduit comme le veut le § 7 du [[methode/Le Kallaway edit|Kallaway edit]]), un par élément, pistes 11 à 14 (`s14-s-motiv`, `s14-s-habitude`, `s14-s-66`, `s14-s-rate`). Ni `wrong`, ni `correct`, ni riser.

**Vérifié le 28 septembre au soir, sur la nouvelle version** :

- `npx --yes hyperframes@0.8.21 check` : **0 erreur, 0 avertissement** (lint, runtime, layout sur 9 échantillons, motion, contraste 21/21 en WCAG AA). Le vert qui glisse hors de sa piste est marqué `data-layout-allow-overflow` : il est coupé par la piste, c'est voulu.
- `snapshot` aux entrées (0,8 · 1,8 · 3,3 · 6,2 · 8,0 · 9,9 · 11,9 · 12,3 s) et à la fin (15,1 s), rangés dans `renders/snapshots/` : chaque élément à sa place, aucun chevauchement ; la pilule 66 jours et la carte Motivation gardent de l'air entre elles, le 21 et 1 jour aussi. L'outil `snapshot` affiche une police de repli (Roboto) au lieu d'Archivo.
- **Le rendu brouillon** : `renders/B1-soixante-six-jours-brouillon.mp4`, 1080 × 960, 15,6 s, rendu en 17 s ; `ffprobe` : un flux vidéo h264 et **un flux audio aac** (48 kHz, stéréo) ; les quatre clics entendus à 0,31 · 2,84 · 7,47 · 9,36 s (le pic de chaque clic, 0,1 s après son repère). La planche `renders/planche-brouillon.png` montre huit images du rendu.

**Avant le rendu final** : transcrire la prise (faster-whisper, mot à mot) et déplacer chaque repère de `CUES`, et les `data-start` des quatre `<audio>` qui les recopient, sur le mot réel ; si `ke.py montage` demande une durée plus longue pour couvrir le glissé de sortie, allonger `data-duration` (la dernière image tient). `index.html` n'est qu'une page de relecture, que `ke.py montage` remplacera.

**Pas de b-roll généré.** Zéro crédit.

## La couverture

La question, en **ZY Elegant**, tout en capitales, sans accent :

- en blanc : **TU SAIS QUOI FAIRE,**
- en jaune, plus gros : **MAIS TU N'Y / ARRIVES PAS ?**

L'image : toi en grand, bouche fermée, regard dans l'objectif (`[couverture] temps` à choisir dans la piste montée). Le haut du texte vers y = 250.

## Publier

Le **mardi 13 octobre**. Sur les trois plateformes, la légende et le titre YouTube sont dans [[video/to-film/prochains-jalons/14-savoir-sans-y-arriver/SCRIPT|SCRIPT]].

[[Tu sais quoi faire, mais tu n'y arrives pas]] · [[HUB]]
