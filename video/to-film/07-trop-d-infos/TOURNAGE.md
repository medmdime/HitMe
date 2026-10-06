# Tournage · Tu ne sais plus quoi manger avec toutes ces infos

J7 · **~29,5 s** souffles coupés (~27,3 s à ×1,08) · 140 mots · tournée à la session 2 (jeudi 1er octobre), montée le lundi 5 au plus tard, sort le **mardi 6 octobre**

La narration nue est dans [[video/to-film/07-trop-d-infos/PROMPTEUR|PROMPTEUR]], les sources et la légende dans [[video/to-film/07-trop-d-infos/SCRIPT|SCRIPT]].

## Les blocs à tourner

Six blocs, chacun **trois fois**, **un clap au début de chaque prise** (une fois dans les mains, face caméra : c'est ce qui recale ta bouche sur le son au montage). Puis le texte entier d'une traite deux fois, en secours.

| Bloc | Cadre | Du début… | …à la fin | Mots | Prises |
|---|---|---|---|---|---|
| 1 · le hook | A | « Tu ne sais plus » | « Pas le régime. » | 31 | 3 |
| 2 · les quatre régimes | B | « Des chercheurs » | « le même poids. » | 27 | 3 |
| 3 · le point commun, et le jeûne | B | « Leur point commun » | « pas mieux. » | 21 | 3 |
| 4 · la réponse | B | « Ce sont les calories » | « le biscuit. » | 25 | 3 |
| 5 · le geste | A | « Donc oublie » | « tes calories. » | 19 | 3 |
| 6 · l'appel | A | « Moi, c'est Mohamed » | « enregistre la vidéo. » | 17 | 3 |

## Réglages

Ceux de la session, sans rien changer d'une vidéo à l'autre : 4K 16:9, toi au centre, **cadré un peu large, avec de l'air au-dessus de la tête** (le cadre B te met en bas de l'image, ta tête doit pouvoir dépasser de la carte), la lampe chaude derrière, le t-shirt blanc, le micro-cravate. Tu regardes l'objectif sur toutes les phrases, en B comme en A. **Aucun accessoire** : ni assiette, ni téléphone, ni appli à l'écran.

## Le jeu

Le ton de toute la vidéo : **direct, comme un ami qui en a assez, pour toi, de tout ce qu'on te raconte.** Dur avec le bruit, chaleureux avec la personne. Jamais de moquerie envers ceux qui ont fait un régime, aucun sermon.

- **« Tu ne sais plus quoi manger, avec toutes ces infos ? »** : compréhensif, comme si tu voyais la pile d'infos qui se contredisent.
- **« Moins de gras. Non, moins de glucides. Non, jeûne seize heures. »** : tu imites trois voix qui se coupent la parole, de plus en plus vite, un peu agacé à chaque « Non ». Un petit geste de la main pour chaque voix si ça vient. « jeûne », le « eu » long.
- **« Pour ton poids, une seule chose décide. »** : tu reprends ta voix, plus net ; « une seule chose » posé.
- **« Pas le régime. »** : sec, un temps après. C'est la question qui tient la vidéo.
- **« Des chercheurs ont testé quatre régimes… »** : tu racontes, simple ; « plus ou moins gras, plus ou moins de glucides » en miroir, même rythme.
- **« Aucun n'a gagné : »** : détaché, un souffle ; c'est le « wow », sans surprise jouée. Puis « les quatre groupes ont perdu presque le même poids », posé.
- **« Leur point commun : »** : un temps, comme si tu donnais la clé ; puis « le même nombre de calories à enlever », « le même » appuyé. La boucle se ferme ici.
- **« Le jeûne ? »** : une vraie question, un sourcil levé ; puis « Avec les mêmes calories, il ne fait pas mieux », calme, sûr.
- **« Ce sont les calories qui décident, pas le régime. »** : posé ; « pas le régime » répond au hook.
- **« Tes calories, c'est l'énergie de tout ce que tu avales : le plat, le jus, le biscuit. »** : plus léger, concret ; la liste à ton rythme, comme si tu les comptais sur tes doigts.
- **« Donc oublie les règles qui se contredisent : »** : ferme, les yeux dans l'objectif.
- **« mange ce que tu aimes, et regarde une seule chose, tes calories. »** : un vrai sourire sur « mange ce que tu aimes », une permission ; puis lent sur « une seule chose » : c'est là que tombe le punch-in.
- **L'appel** : simple, comme si tu te présentais.

## Le montage, en trois temps

Toi en grand, puis **une seule animation**, puis toi en grand. Rien d'autre. Temps estimés à 4,75 mots par seconde, souffles coupés, avant l'accélération ; `ke.py … plans` donnera les vrais.

| Temps | Cadre | Ce que tu dis | À l'image | Son |
|---|---|---|---|---|
| **1 · le hook** · 0:00 → 0:06,5 | **A**, toi en grand | « Tu ne sais plus quoi manger, avec toutes ces infos ? Moins de gras. Non, moins de glucides. Non, jeûne seize heures. Pour ton poids, une seule chose décide. Pas le régime. » | plan serré, zoom lent (1 → 1,06) ; une coupe sèche à chaque souffle, rien d'autre | ta voix seule |
| *la transition* · 0:06,5 | A → B | (sur « Des chercheurs ») | **un glissé simple** : l'animation entre par la droite (0,28 s), tu passes en bas, détouré devant ta carte | aucun woosh |
| **2 · l'explication** · 0:06,5 → 0:21,9 | **B**, l'animation en haut, toi en bas | de « Des chercheurs ont testé » à « le plat, le jus, le biscuit. » | **l'animation « Quatre assiettes »** (ci-dessous) ; ta carte ne bouge pas | les quatre clics de l'animation, rien d'autre |
| *la transition* · 0:21,9 | B → A | (sur « Donc ») | le glissé retour, après que l'animation a tenu sur son dernier état | rien |
| **3 · le geste et l'appel** · 0:21,9 → 0:29,5 | **A**, toi en grand | « Donc oublie les règles qui se contredisent : mange ce que tu aimes, et regarde une seule chose, tes calories. » puis l'appel | zoom lent ; **le seul punch-in** (1,15) sur « regarde une seule chose » (vers 0:24,6) ; sur l'appel, ton prénom, **Abonne-toi** et l'icône d'enregistrement | aucun clic, aucun riser ni hoop |

Hook 6,5 s, explication 15,4 s, geste et appel 7,6 s (à ×1,08 : 6,0 s, 14,2 s, 7,0 s).

**Du début à la fin** :

- **Le titre fixe en haut** (y ≈ 70 → 210, au-dessus de la zone utile de l'animation) : **TROP D'INFOS : QUOI MANGER ?** (quatre mots), en ZY Elegant comme la couverture, en blanc avec **QUOI MANGER ?** en jaune, sur un léger dégradé sombre. C'est la seule phrase écrite à l'écran.
- **Les sous-titres, sobres** : blancs, sans pop ni effet, un mot en jaune par phrase ; sous ton menton en A (y ≈ 1320), entre l'animation et ta tête en B (y ≈ 980).
- **Pas de musique.** Aucun woosh, riser ni hoop.

**Les mots en jaune** (`[sous_titres] jaunes`, dans l'ordre, un par phrase) : `["infos", "gras", "glucides", "jeûne", "seule", "régime", "quatre", "Aucun", "calories", "mieux", "décident", "avales", "calories", "Mohamed", "abonne-toi", "enregistre"]`. Si Whisper écrit « jeune » sans accent, corriger la transcription ou le mot de la liste.

**Pour la fiche `kallaway.toml`** (encore celle de l'assiette, copiée par `ke.py … preparer`, à réécrire au montage) : trois `[[plans]]` seulement : `hook` (A, de « Tu », zoom lent), `assiettes` (B, de « Des », `anim = "compositions/B1-quatre-assiettes.html"`, `woosh = false`), `geste` (A, de « Donc », punch-in sur « regarde ») ; aucun `[[sons]]` ; aucune `[[musique]]` ; l'appel en `[[incrustes]]` sur son `[[bandeaux]]` ; `feuilles` sans `assiette.css` (la composition porte ses propres styles).

## L'animation : « Quatre assiettes »

**`compositions/B1-quatre-assiettes.html`**, id `trop-d-infos-b1`, refaite le 28 septembre au soir sur le nouveau texte. Une composition **1080 × 960, 15,67 s** (le temps B, 15,37 s, plus 0,3 s de tenue), DA YouBud (`youbud.css` et la toile claire copiés tels quels), contenu utile entre y = 230 et y = 940 (au-dessus, le titre fixe). **Trois éléments et un chiffre** : les quatre assiettes, « = Calories », ce que tu avales (trois icônes), et le trophée **0**. Des mots isolés, jamais de phrase ; aucune bordure ; aucune calorie chiffrée, aucun gramme, aucun kilo.

Les temps sont ceux de la vidéo ; dans la composition, ils partent de 0 au début du plan B (soustraire 6,53 s). Ils sont regroupés en tête du script, dans l'objet **`CUES`** (mot → seconde, le rang du mot ÷ 4,75, soit la fin du mot : jamais avant lui).

| Entre sur le mot | Temps (vidéo · compo) | Élément | Ce qu'on voit | Son |
|---|---|---|---|---|
| « testé **quatre** régimes » | ~0:07,6 · 1,05 s | **1 · les quatre assiettes** | à gauche, en grille 2 × 2, quatre assiettes blanches à rebord (190 px) ; dans chacune, ses parts, d'après l'essai : le gras en jaune (20 % en haut, 40 % en bas), les protéines en bleu (15 % à gauche, 25 % à droite), les glucides en vert (le reste, de 65 à 35 %). Aucun mot : on voit d'un coup d'œil que les quatre sont différentes. Entrée de carte (`scale 0 → 1, y 40 → 0, 0,55 s, power3.out`), stagger 0,12 s | `soft_click` |
| « **Aucun** n'a gagné » | ~0:09,9 · 3,37 s | **le chiffre** | sous la grille, une pilule rouge (`--yb-red`, rebord `--yb-red-edge`) : le trophée `trophy` et **0**, en blanc, `tabular-nums` ; `back.out(1.6)`. Aucun régime n'a gagné | `soft_click` |
| « le même nombre de **calories** » | ~0:13,9 · 7,37 s | **2 · la réponse** | à droite de la grille, centré sur elle : un rond blanc **=** (`back.out(1.6)`), puis 0,1 s après la carte jaune pâle (`--yb-yellow-2`) : la flamme `flame` en orange et le mot **Calories**. On lit : quatre assiettes différentes = Calories | `soft_click` |
| « Le jeûne ?… pas mieux. » | 0:14,3 → 0:16,6 | rien | l'image tient ; la voix porte le jeûne | |
| « les calories qui **décident** » | ~0:17,9 · 11,37 s | la réponse désignée | la carte Calories bat une fois (`scale 1 → 1,08 → 1`, 0,4 s) ; rien d'autre ne bouge | aucun |
| « tout ce que tu avales : le **plat**, le jus, le biscuit » | ~0:21,1 · 14,53 s | **3 · ce que tu avales** | sous la carte Calories, trois ronds blancs à rebord (84 px) : `utensils`, `cup-soda`, `cookie`, en encre, un toutes les 0,2 s (`scale 0 → 1, y 40 → 0, 0,5 s, power3.out`) ; fini à 15,43 s. Des icônes seules : la voix les nomme en même temps | `soft_click` (un seul, sur le plat) |
| fin de « biscuit » | 0:21,9 · 15,37 s | rien | 0,3 s de tenue, puis le glissé retour | |

**Les mots à l'écran** : 0 · = · Calories. Rien d'autre : ni « 811 », ni « 750 », ni « 2 ans », ni les kilos (ils sont dans la légende), ni « jeûne », ni « seize heures », ni « jus » (la voix les porte).

**Les sons** : quatre clics seulement (`soft_click`, volume 0,6, un `id` et une piste chacun, 11 à 14), écrits dans la composition. Ni `wrong`, ni `correct`, ni `impacts`, ni `bloop`, aucun woosh ni riser.

**Recaler après le tournage** : `ke.py … plans` donne les vrais temps ; déplacer chaque valeur de `CUES` sur sa syllabe, reporter `quatre`, `aucun`, `calories` et `plat` dans les `data-start` des quatre `<audio>`, et `fin` + 0,3 dans les deux `data-duration` (la racine et la scène), ainsi que dans `index.html`.

**Vérifié le 28 septembre au soir** : `npx hyperframes@0.8.21 check`, 0 erreur, 0 avertissement (lint, runtime, layout sur 9 échantillons, motion, contraste 7/7) ; snapshots à 1,2 · 2,0 · 3,6 · 4,2 · 7,6 · 8,2 · 11,47 · 14,7 · 15,2 · 15,6 s, regardés (dans `renders/snapshots/`) ; rendu brouillon `renders/B1-quatre-assiettes-brouillon.mp4` (1080 × 960, 15,7 s, un flux audio AAC ; les quatre clics s'entendent à 1,15, 3,47, 7,47 et 14,63 s, soit 0,1 s après chaque repère, l'attaque du fichier son). La page `index.html` du dossier n'héberge que cette animation, pour la relecture ; le montage la remplacera.

**Pas de b-roll généré.** Zéro crédit.

## La couverture

La question, en **ZY Elegant**, tout en capitales, sans accent (la police n'en a pas ; aucun mot n'en demande) :

- en blanc : **TOUTES CES INFOS…**
- en jaune, plus gros : **TU NE SAIS PLUS / QUOI MANGER ?**

L'image : toi en grand, bouche fermée, regard dans l'objectif, l'air bienveillant (`[couverture] temps` à choisir dans la piste montée). Le haut du texte vers y = 250.

## Publier

Le **mardi 6 octobre**. L'heure : à caler sur tes statistiques (proposition : à midi, quand on se demande quoi manger). La légende et le titre YouTube sont dans [[video/to-film/07-trop-d-infos/SCRIPT|SCRIPT]].

[[Tu ne sais plus quoi manger avec toutes ces infos]] · [[Tes questions]] · [[HUB]]
