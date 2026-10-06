# Tournage · Un régime, ou un rééquilibrage alimentaire

J6 bis, la sœur de [[Tu te prives de ce que tu aimes, et tu craques|J6]] · **~28,2 s** souffles coupés (~26,1 s à ×1,08) · 134 mots · **pas encore au calendrier** : à tourner à la prochaine session qui a de la place, avec les mêmes réglages

La narration nue est dans [[video/done/06b-reequilibrage-alimentaire/PROMPTEUR|PROMPTEUR]], les sources et la légende dans [[video/done/06b-reequilibrage-alimentaire/SCRIPT|SCRIPT]].

## Les blocs à tourner

Six blocs, chacun **trois fois**, **un clap au début de chaque prise** (une fois dans les mains, face caméra : c'est ce qui recale ta bouche sur le son au montage). Puis le texte entier d'une traite deux fois, en secours.

| Bloc | Cadre | Du début… | …à la fin | Mots | Prises |
|---|---|---|---|---|---|
| 1 · le hook | A | « Tu te remets au régime » | « avec un autre nom. » | 21 | 3 |
| 2 · le régime | B | « Un régime, c'est te priver » | « tes anciennes habitudes. » | 28 | 3 |
| 3 · le bilan | B | « L'Anses, l'agence » | « dans l'année. » | 20 | 3 |
| 4 · le rééquilibrage | B | « Mais un rééquilibrage » | « rien à arrêter. » | 27 | 3 |
| 5 · le test | A | « Avant de changer » | « c'est un régime. » | 21 | 3 |
| 6 · l'appel | A | « Moi, c'est Mohamed » | « enregistre la vidéo. » | 17 | 3 |

## Réglages

Ceux de la session, sans rien changer d'une vidéo à l'autre : 4K 16:9, toi au centre, **cadré un peu large, avec de l'air au-dessus de la tête** (le cadre B te met en bas de l'image, ta tête doit pouvoir dépasser de la carte), la lampe chaude derrière, le t-shirt blanc, le micro-cravate. Tu regardes l'objectif sur toutes les phrases, en B comme en A. **Aucun accessoire, aucun aliment** : les deux cartes de l'animation suffisent.

## Le jeu

Le ton de toute la vidéo : **franc et chaleureux, comme à un ami qui t'annonce pour la cinquième fois qu'il recommence lundi.** Dur contre l'idée, jamais contre lui. Pas d'ironie, rien qui fasse honte, aucun sermon.

- **« Tu te remets au régime lundi ? »** : complice, un petit sourire ; tu connais la phrase, tout le monde l'a dite.
- **« Arrête. »** : net, seul, le demi-sourire gardé ; un temps après. C'est « arrête les régimes », pas « arrête-toi ».
- **« Fais un rééquilibrage alimentaire. »** : posé, comme une évidence ; « rééquilibrage » en entier.
- **« Non, ce n'est pas un régime avec un autre nom. »** : ferme, un cran plus sûr, comme si tu entendais déjà l'objection. C'est la question qui tient la vidéo.
- **« Un régime, c'est te priver pendant un temps. »** : tu expliques, simple ; « pendant un temps » un peu détaché.
- **« Se priver toute sa vie, presque personne n'y arrive. »** : avec compréhension ; « presque personne » doux : ce n'est pas sa faute.
- **« Donc un jour, tu arrêtes, et tu reprends tes anciennes habitudes. »** : factuel, sans reproche ; « tu arrêtes » un peu appuyé (la croix tombe dessus).
- **« L'Anses, l'agence de sécurité sanitaire, a fait le bilan des régimes : »** : tu cites, posé ; un souffle sur les deux-points.
- **« huit fois sur dix, le poids remonte dans l'année. »** : « huit fois sur dix » détaché, lentement. Pas de drame joué : le chiffre suffit.
- **« Mais un rééquilibrage, c'est changer un peu ta façon de manger, pour de bon, sans te priver. »** : un temps avant « Mais », puis plus léger, presque content ; « pour de bon » et « sans te priver » bien séparés.
- **« Il n'a pas de fin : tu n'as rien à arrêter. »** : calme, simple, comme une bonne nouvelle.
- **« Avant de changer quelque chose, demande-toi si tu peux manger comme ça toute ta vie. »** : chaud, comme un conseil d'ami ; un temps après « toute ta vie ».
- **« Si c'est non, c'est un régime. »** : lent, les yeux dans l'objectif, un demi-sourire. C'est la phrase qu'on retient ; le punch-in tombe dessus.
- **L'appel** : simple, comme si tu te présentais. « sans régime » sonne comme la suite logique : laisse-le venir, sans l'appuyer.

## Le montage, en trois temps

Toi en grand, puis **une seule animation**, puis toi en grand. Rien d'autre. Temps estimés à 4,75 mots par seconde, souffles coupés, avant l'accélération ; `ke.py … plans` donnera les vrais.

| Temps | Cadre | Ce que tu dis | À l'image | Son |
|---|---|---|---|---|
| **1 · le hook** · 0:00 → 0:04,4 | **A**, toi en grand | « Tu te remets au régime lundi ? Arrête. Fais un rééquilibrage alimentaire. Non, ce n'est pas un régime avec un autre nom. » | plan serré, zoom lent (1 → 1,06) ; une coupe sèche après « Arrête. » s'il y a un souffle | ta voix seule |
| *la transition* · 0:04,4 | A → B | (sur « Un régime ») | **un glissé simple** : l'animation entre par la droite (0,35 s), tu passes en bas, détouré devant ta carte | aucun woosh |
| **2 · l'explication** · 0:04,4 → 0:20,2 | **B**, l'animation en haut, toi en bas | de « Un régime, c'est te priver » à « rien à arrêter. » | **l'animation « Régime, Rééquilibrage »** (ci-dessous) ; ta carte ne bouge pas | les quatre clics de l'animation, rien d'autre |
| *la transition* · 0:20,2 | B → A | (sur « Avant ») | le glissé retour ; l'animation a tenu sur son dernier état depuis 0:15,5 | rien |
| **3 · la conclusion et l'appel** · 0:20,2 → 0:28,2 | **A**, toi en grand | « Avant de changer quelque chose… c'est un régime. » puis l'appel | zoom lent ; **le seul punch-in** (1,15) sur « Si c'est non » (vers 0:23,4) ; sur l'appel, ton prénom, **Abonne-toi** et l'icône d'enregistrement | aucun clic, aucun riser ni hoop |

Hook 4,4 s, explication 15,8 s, conclusion et appel 8,0 s (à ×1,08 : 4,1 s, 14,6 s, 7,4 s).

**Du début à la fin** :

- **Le titre fixe en haut** (y ≈ 70 → 210, au-dessus de la zone utile de l'animation) : **TU RECOMMENCES LUNDI ?** (trois mots), en ZY Elegant comme la couverture, en blanc avec **LUNDI ?** en jaune, sur un léger dégradé sombre. C'est la seule phrase écrite à l'écran. ZY Elegant n'a pas d'accents : « RÉGIME » et « RÉÉQUILIBRAGE » n'y passent pas, d'où un titre sans accent (voir « Ce que Mohamed doit trancher »).
- **Les sous-titres, sobres** : blancs, sans pop ni effet, un mot en jaune par phrase ; sous ton menton en A (y ≈ 1320), entre l'animation et ta tête en B (y ≈ 980).
- **Pas de musique.** Aucun woosh, riser ni hoop.

**Les mots en jaune** (`[sous_titres] jaunes`, dans l'ordre) : `["régime", "arrête", "rééquilibrage", "nom", "temps", "personne", "habitudes", "huit", "bon", "fin", "vie", "régime", "Mohamed", "abonne-toi", "enregistre"]`. L'outil les cherche un par un, dans l'ordre de la transcription : le deuxième « régime » tombe donc sur « c'est un régime », après « vie ». Si Whisper coupe « rééquilibrage » ou écrit « Arrête » avec sa majuscule, écrire le mot comme il le rend.

**Pour la fiche `kallaway.toml`** (encore le gabarit de l'assiette, copié par `ke.py … preparer`) : trois `[[plans]]` seulement : `hook` (A, de « Tu », zoom lent), `regime` (B, de « Un », l'animation `compositions/B1-regime-reequilibrage.html`, `woosh = false`), `test` (A, de « Avant », punch-in sur « Si ») ; aucun `[[sons]]` ; aucune `[[musique]]` ; l'appel en `[[incrustes]]` sur son `[[bandeaux]]`.

## L'animation : « Régime, Rééquilibrage »

**Fabriquée le 28 septembre** : `compositions/B1-regime-reequilibrage.html`, id `reequilibrage-b1`, **1080 × 960**, **16,09 s** (la fin de B, 15,79 s, plus 0,3 s de tenue). DA YouBud (`youbud.css` et la toile claire copiés par `ke.py … preparer`), contenu utile entre y = 250 et y = 830, sous le titre fixe. **Trois éléments et un chiffre** : la carte Régime, sa croix, 8/10, la carte Rééquilibrage. Des mots isolés, jamais de phrase ; aucun aliment, aucune calorie, aucun confetti. Brouillon rendu : `renders/B1-regime-reequilibrage-brouillon.mp4` ; relecture seule dans `index.html`.

**L'idée** : la même paire rouge et verte que J6, mais **une autre image**. La carte Régime est courte et porte un **sablier** (un temps, puis ça s'arrête) ; la carte Rééquilibrage va d'un bord à l'autre et porte **l'infini** (pour de bon). La longueur des deux cartes dit la différence avant même les mots.

Les temps partent de 0 au début du plan B (« Un régime »). Ils sont regroupés en tête du script, dans l'objet `CUES` (mot → seconde), et repris dans les `data-start` des quatre `<audio>` : **les changer ensemble**.

| Entre sur le mot | Temps (compo · vidéo) | Élément | Ce qu'on voit | Son |
|---|---|---|---|---|
| « pendant un **temps** » (8e mot) | 1,47 s · ~0:05,9 | **la carte Régime** | en haut à gauche (x 80 → 520, y 300 → 520), teinte rouge claire (`--yb-red-2`), l'icône `hourglass` en `--yb-red`, 120 px, le mot **Régime** à côté ; `scale 0 → 1, y 40 → 0, 0,55 s, power3.out` | `soft_click` |
| « tu **arrêtes** » (22e) | 4,42 s · ~0:08,8 | **la croix** | la pastille rouge (`.yb-badge.ko`, 100 px) se pose sur le coin haut droit de la carte, en `back.out(1.6)` ; ses deux traits blancs se dessinent l'un après l'autre (0,18 s chacun) ; la carte encaisse (−9 / +9 / −9 / +9, 0,05 s chacun, puis 0) | `soft_click` |
| « **huit** fois sur dix » (40e) | 8,21 s · ~0:12,6 | **le chiffre** | à droite de la carte Régime (x 610 → 1000, y 345 → 475) : une pilule jaune (`--yb-yellow`, rebord `--yb-yellow-edge`), l'icône `trending-up` et **8/10**, en `back.out(1.6)`, 0,45 s | `soft_click` |
| « Mais un **rééquilibrage** » (51e) | 10,53 s · ~0:15,0 | **la carte Rééquilibrage** | en dessous, d'un bord à l'autre (x 80 → 1000, y 600 → 820), teinte verte claire (`--yb-green-2`), l'icône `infinity` en `--yb-green`, le mot **Rééquilibrage** à côté ; même entrée que la carte Régime | `soft_click` |
| de « c'est changer un peu » à « rien à arrêter. » | 11,08 → 16,09 s | rien | l'image tient, rien ne bouge, puis le glissé retour | |

**Les mots à l'écran** : Régime · 8/10 · Rééquilibrage. Rien d'autre : ni « Anses », ni « 80 % », ni « an » (ils sont dans la voix et la légende).

**Les sons** : quatre `soft_click` (volume 0,6, `id` `b1-s-01` à `b1-s-04`, pistes 11 à 14), écrits dans la composition. Ni `wrong` sur la croix, ni `correct`, ni `impacts`, ni `bloop`, aucun woosh ni riser : la règle du format, un clic par élément.

**Au montage** : `ke.py … plans` donne les vrais temps de chaque mot ; recaler les quatre valeurs de `CUES` sur leur syllabe, les reporter dans les `data-start` des `<audio>`, et fin + 0,3 dans les deux `data-duration` (la racine et la scène), ou plus si `montage` demande de couvrir le glissé de sortie.

**Vérifié le 28 septembre** : `npx --yes hyperframes@0.8.21 check`, 0 erreur, 0 avertissement (lint, runtime, layout, motion, contraste 8/8) ; snapshots à chaque entrée et à la fin (`renders/snapshots/`), regardés ; brouillon rendu en 14 s, 16,1 s, 1080 × 960, un flux audio AAC, les quatre clics entendus à 1,57 · 4,52 · 8,31 · 10,63 s. La police Archivo du kit n'a pas de lettres latines : le rendu tombe sur la police de secours, comme pour toutes les animations (connu).

**Pas de b-roll généré.** Zéro crédit.

## La couverture

La question, en **ZY Elegant**, tout en capitales, sans accent (la police n'en a pas) :

- en blanc : **TU RECOMMENCES**
- en jaune, plus gros : **LUNDI ?**

L'image : toi en grand, bouche fermée, regard dans l'objectif, le demi-sourire du « Arrête. » (`[couverture] temps` à choisir dans la piste montée). Le haut du texte vers y = 250.

## Ce que Mohamed doit trancher

- **Le titre et la couverture** : « TU RECOMMENCES LUNDI ? » tient sans accent. Si tu veux le mot « régime » sur l'image, ZY Elegant ne sait pas écrire « É » : soit on l'écrit « REGIME » (l'outil le permet, mais c'est une faute en français), soit on passe ce titre dans une autre police.
- **L'Anses dans la voix** : J4 avait gardé ce chiffre hors de la voix. Ici, c'est la preuve même du sujet, dite comme ce qu'elle est (« a fait le bilan », « le poids remonte »). Si tu préfères, le bloc 3 peut se couper au montage : la vidéo tient sans lui (~24 s), mais perd son chiffre, et la pilule 8/10 sort de l'animation.
- **Quand la publier** : pas avant une semaine après J6 (lundi 5 octobre), pour que les deux vidéos sœurs ne se suivent pas.

## Publier

À placer au calendrier. L'heure : à caler sur tes statistiques (proposition : le dimanche soir ou le lundi matin, quand on se dit « je recommence lundi »). La légende et le titre YouTube sont dans [[video/done/06b-reequilibrage-alimentaire/SCRIPT|SCRIPT]].

[[Un régime, ou un rééquilibrage alimentaire]] · [[Tes questions]] · [[HUB]]
