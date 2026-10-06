# Les animations · version courte de l'assiette

**Quatre scènes HyperFrames, six passages, pour [[video/old/assiette-pas-le-dessert/VERSION-COURTE|la version courte]]** (environ 52 secondes). Mis à jour le 25 : l'étude racontée avec ce qu'elle a fait, dans une phrase facile à dire, et le geste dit avec les deux phrases de Mohamed. Demandé par Mohamed le 24 septembre au soir : « tu regardes la caméra sur toutes les frames ; on alterne ma tête en grand, puis ma tête en petit avec les animations, puis en grand, puis en petit ».

## Le montage : A, B, A, B…

**A** : toi en grand, plein cadre. **B** : l'animation en haut (1080 × 960), toi en petit en bas, recadré depuis la même prise. Un coup chacun, du début à la fin. Il n'y a plus de plan sans toi. Les temps viennent du texte : ta prise réelle fixera les vrais.

| # | Temps | Ce que tu dis | Cadre | À l'image |
|---|---|---|---|---|
| 1 | 0:00 → 0:02,5 | « Lundi, tu arrêtes le sucre : pas de dessert. » | **A** | toi, plan poitrine |
| 2 | 0:02,5 → 0:07,6 | « Mardi, pas de soda. Mercredi, pas de bonbons. Vendredi, la balance n'a pas bougé. » | **B** | scène 1a · la semaine |
| 3 | 0:07,6 → 0:10,1 | « Mais le problème, ce n'est pas le sucre. » | **A** | punch-in à 115 % ; le mot **SUCRE**, barré en rouge sur « le sucre » |
| 4 | 0:10,1 → 0:12,6 | « C'est le gras : l'huile, le beurre, les sauces. » | **B** | scène 1b · le gras |
| 5 | 0:12,6 → 0:14,5 | « Le gras, c'est le plus calorique. » | **A** | toi, 100 % |
| 6 | 0:14,5 → 0:18 | « Un gramme de sucre : quatre calories. Un gramme de gras : neuf. » | **B** | scène 2a · 4 contre 9 |
| 7 | 0:18 → 0:19,6 | « Donc, pour les mêmes calories, » | **A** | punch-in à 110 % |
| 8 | 0:19,6 → 0:27,4 | « il prend deux fois moins de place. Ton ventre se remplit à peine : la satiété, le signal « stop », est trop faible. Tu continues de manger. » | **B** | scène 2b · le ventre |
| 9 | 0:27,4 → 0:37,5 | « Mais le pire : du gras, tu en manges bien plus que tu crois. Dans une étude de 2006, on a demandé à des gens d'estimer le gras de plats de restaurant. » | **A** | punch-in à 115 %, plus bas ; le mot **GRAS** en jaune sur « du gras » ; retour à 100 % sur « Dans une étude », et la pilule **ÉTUDE · 2006** en pop |
| 10 | 0:37,5 → 0:39,7 | « Pour les plus gras, c'était le double. » | **B** | scène 3 · le double |
| 11 | 0:39,7 → 0:42 | « Chaque cuillère d'huile, c'est cent vingt calories. » | **A** | punch-in à 115 % ; la pilule **120** en pop sur « cent vingt » |
| 12 | 0:42 → 0:47 | « Alors la prochaine fois, prends ta cuillère, mesure bien ton huile, et profite de ton dessert. » | **B** | scène 4 · la cuillère et le dessert |
| 13 | 0:47 → 0:52,4 | « Moi, c'est Mohamed : je t'explique la nutrition, sans régime. Abonne-toi pour la suite, et enregistre la vidéo. » | **A** | ton prénom en bas une seconde ; le bouton **Abonne-toi** en pop sur « abonne-toi » ; l'icône d'enregistrement en pop sur « enregistre » |

Treize plans, un whoosh à 0,35 sur chaque coupe (voir Le format court).

## Où en est la fabrication

**Construites le 25 septembre**, avant le tournage, calées sur les temps du texte : les six compositions sont dans `compositions/`, les rendus brouillons dans `renders/`, et les six bout à bout dans `renders/relecture-draft.mp4` (27 s). `hyperframes check` passe sans erreur ni avertissement, 21 textes sur 21 au bon contraste. Chaque MP4 fait 1080 × 960, avec son son.

**Le fond** est une toile claire texturée, demandée par Mohamed d'après une image de référence : `assets/img/toile.jpg`, dessinée par `assets/img/toile.py` (un halo blanc en haut, des bords un peu plus gris, un grain de sergé en diagonale). Aucune image téléchargée.

**La version de HyperFrames** reste la 0.8.21, celle de la créatine : la mise à jour vers la 0.8.77 a planté sur un fichier corrompu du cache de npx, et la 0.8.21 passe le contrôle sans aucun avertissement.

**Reste à faire après le tournage** : transcrire la prise, recaler chaque repère sur la voix, refaire le contrôle et une planche-contact, rendre en qualité haute (`npm run render:I1a`… `render:I4`), écrire `PROMPTS-DETAILLES.md`.

## Le montage complet, dans HyperFrames (26 septembre)

`index.html` monte toute la vidéo (35 s). Depuis le 27 septembre, tout se refait avec **le Kallaway edit** ([[methode/Le Kallaway edit|la méthode]], l'outil `outils/kallaway-edit`) : la fiche de cette vidéo est `kallaway.toml`, commentée ligne par ligne, et `montage/` garde les transcriptions, la carte des coupes et les plans. `python outils/kallaway-edit/ke.py video/old/assiette-pas-le-dessert montage` refait exactement ce qui a été livré (vérifié). Les pistes restent sur la machine (`assets/rushes/`, `assets/musique/`, `montage/cache/` et `renders/` sont dans le `.gitignore`).

- **Les coupes** : chaque souffle et chaque blanc enlevés (52 s de prise, 35 s de vidéo, 27 morceaux), calées sur la grille des images (1/30 s) pour que le son ne glisse jamais.
- **Les lèvres** : dans chaque prise du téléphone, le son arrive avant la bouche. Mesuré sur les p, b et m, image par image : hook 0,21 s, « Mais le problème » 0,20, « le plus calorique » 0,19, « il ne cale pas » 0,18, « tu en manges plus que tu crois » 0,33, le geste 0,12. L'image de chaque prise est décalée d'autant.
- **A** : toi en grand, centré prise par prise, un zoom par plan. **B** : l'animation en haut ; en bas, toi détouré (`hyperframes remove-background`) devant une carte arrondie qui ne coupe que le fond. Ta tête dépasse en haut, tes mains sur les côtés, comme chez Kallaway. Cadré plus large depuis la source 4K (`visage-b.mp4`, 1080 × 800, posé de y 1060 à 1860) ; la carte descend à 60 px du bas, la même marge que sur les côtés.
- **Plus de plan 7** : le 9 reste à l'écran pendant « Donc, pour les mêmes calories », puis seule l'animation du haut glisse vers le ventre.
- **Le son** (corrigé le 26 au soir) : chaque son se cale sur son **pic**, pas sur son départ (air-woosh culmine à 0,70 s du fichier, rizer-windy à 2,75 s, rizer-mettalic à 1,75 s, le boum d'impacts, le « hoop », à 0,55 s). **Un woosh seulement quand on quitte ton plan pour une animation**, son pic au milieu du glissé : quatre en tout. La première transition, après « pas de dessert », prend un riser qui monte sous le hook et le hoop sur la coupe. Riser et hoop aussi sur « 120 », sur « Dans une étude » (avec le vent et la reprise de la musique) et sur « dessert », la chute. Dans les animations, les impacts de « 4 contre 9 » et du double tombent enfin sur leur mot, et le woosh interne du ventre est retiré.
- **Musique** : rien sous le riser du hook ; Careless Wandering (0.15) part sur le hoop de la première transition et va jusqu'à « Mais le pire », coupée net ; Particle Emission (0.55) repart sur « Dans une étude ».
- **Les sous-titres** (`compositions/sous-titres.html`, écrits par l'outil depuis une deuxième écoute en large-v3) : mot à mot, deux ou trois mots par groupe, blancs à gros contour, un mot en jaune par phrase ; en B entre l'animation et ta tête (y 980), en A sous ton menton (y 1320). Le même texte en `sous-titres.srt`, une phrase par bloc, pour l'appli.
- **Vérifié** : aucune parole coupée. Tout ce qui est enlevé reste sous −46 dB, et aucune coupe ne tombe dans du son. « Pour les plus gras, c'était le double » est bien la phrase de la prise, entière ; ce qui manque, c'est le lien (« les plats les plus gras », « le double de ce qu'ils pensaient »). La carte du plat porte donc le mot **Plats**, à côté d'Estimé et de Réel.
- **Vitesse ×1,08** (demandée le 26, comme au montage CapCut de la créatine) : la composition reste à vitesse normale ; on la rend à 250/9 i/s (27,78), puis ffmpeg accélère image et son de 1,08 (`setpts=PTS/1.08`, `atempo=1.08`), ce qui retombe pile sur 30 i/s sans sauter une image : 35 s deviennent 32,4 s. Le `.srt` est écrit aux temps accélérés. Un test ×1,1 se fait de même à 300/11 i/s.
- **« Pour les plus gras »** : le mot « repas » n'est pas dans la prise. Entre « Pour » et « plus », il y a 0,28 s de son, la place de « Pour les », et les lèvres ne se ferment que deux fois (le p de « Pour », celui de « plus ») ; « repas » en demanderait une troisième.
- **Livré le 26 septembre** : `renders/assiette-version-courte.mp4`, rendu `-q high` à 250/9 i/s puis accéléré ×1,08 (1080 × 1920, 30 i/s, 32,4 s, −16,4 LUFS, crête −0,6 dBFS), avec `sous-titres.srt` à ses temps. Le fichier reste sur la machine (`renders/` est ignoré par git).

## Les règles de ces animations

Celles du skill `inserts-youbud`, avec le format du cadre B :

- **1080 × 960**, sur la toile claire texturée (`assets/img/toile.jpg`). Rien d'important au-dessus de y = 230 : l'appli le recouvre. Le contenu vit entre y = 230 et y = 940.
- **Aucune bordure.** Une carte, c'est une teinte claire avec un rebord plein dessous (`.yb-card`).
- **Des mots, jamais des phrases** : des chiffres, des symboles, des icônes Lucide, un nom propre, un mot par élément. Chaque chiffre à l'écran est dit par ta voix.
- **Les objets sont dessinés à plat**, en divs et SVG : le morceau de sucre, la cuillère, la balance, l'estomac, la crème dessert. Jamais une photo.
- **Les couleurs** : le sucre en blanc (neutre), le gras et l'huile en jaune (`--key`), la croix en rouge, la coche en vert. Un seul mot ou chiffre coloré par carte.
- **Chaque élément entre sur sa syllabe**, en gras dans les tableaux. 0,3 s de tenue à la fin, rien ne bouge après.
- **Le son est écrit dans la composition**, aux volumes du skill ; dans CapCut, l'animation est posée à volume 0 et chaque son est reposé à part.
- **Avant le rendu final**, on transcrit ta prise et on recale chaque repère sur ta voix : tu parles toujours plus vite que le texte.

---

## Scène 1 · La semaine

### 1a · la semaine sans sucre · 5,1 s

« Mardi, pas de soda. Mercredi, pas de bonbons. Vendredi, la balance n'a pas bougé. »

`compositions/I1a-la-semaine.html` · id `assiette-i1a-semaine`

**Ce qu'on voit.** En haut (y ≈ 300), les sept jours **L M M J V S D**, sept pastilles blanches de 120 px. Sous chaque jour qui s'allume, une carte avec son sucre : une part de gâteau (`cake-slice`), un soda (`cup-soda`), des bonbons (`candy`), chacun barré d'une croix rouge qui se dessine. Sous le **V**, une balance dessinée à plat, plus grande, avec **0 kg** dans sa fenêtre. **J, S et D** restent éteints.

| Temps | Sur la syllabe | Ce qui se passe | Son |
|---|---|---|---|
| 0,00 | « **Mar**di » | la frise entre (pastilles en cascade, 0,04 s d'écart) ; le **L** est déjà allumé en jaune, avec la part de gâteau barrée : c'est le lundi que tu viens de dire | `soft_click` |
| 0,95 | « pas de **so**da » | le premier **M** s'allume ; la carte du soda entre, la croix se dessine | `soft_click` |
| 2,21 | « pas de **bon**bons » | le deuxième **M** s'allume ; la carte des bonbons entre, la croix se dessine | `soft_click` |
| 2,53 | « **Ven**dredi » | le **V** s'allume ; la carte de la balance entre, plus grande | `clicks` 0.95 |
| 3,16 | « la **ba**lance » | **0 kg** apparaît dans la fenêtre, en pop | `soft_click` |
| 4,11 | « n'a pas bou**gé** » | l'aiguille tremble et revient à zéro (quatre à-coups de 0,05 s) ; la carte encaisse | `wrong` 0.45 |
| 4,42 → 5,1 | le silence | rien ne bouge | |

### 1b · le gras · 2,6 s

« C'est le gras : l'huile, le beurre, les sauces. »

`compositions/I1b-le-gras.html` · id `assiette-i1b-gras`

**Ce qu'on voit.** À gauche, en petit, la carte blanche **Sucre**, barrée d'un trait rouge : c'est la phrase que tu viens de dire. Au centre, la grande carte jaune **Gras**. Dessous, trois cartes, un mot chacune : une goutte (`droplet`) avec **Huile**, une plaquette de beurre dessinée à plat avec **Beurre**, une casserole (`cooking-pot`) avec **Sauces**.

| Temps | Sur la syllabe | Ce qui se passe | Son |
|---|---|---|---|
| 0,00 | « **C'est** » | la carte **Sucre** barrée, déjà là, glisse à gauche et pâlit | |
| 0,63 | « le **gras** » | la carte jaune **Gras** entre en pop | `clicks` 0.95 |
| 1,00 | « l'**hui**le » | la carte **Huile** entre | `soft_click` |
| 1,58 | « le **beu**rre » | la carte **Beurre** entre | `soft_click` |
| 2,21 | « les **sau**ces » | la carte **Sauces** entre | `soft_click` |
| 2,53 → 2,6 | | tenue | |

---

## Scène 2 · Pourquoi le gras

### 2a · 4 contre 9 · 3,5 s

« Un gramme de sucre : quatre calories. Un gramme de gras : neuf. »

`compositions/I2a-quatre-contre-neuf.html` · id `assiette-i2a-4-9`

**Ce qu'on voit.** En haut, une pilule **1 g**. Dessous, deux colonnes à la même échelle, posées sur la même ligne : **Sucre** en blanc, qui monte à **4** ; **Gras** en jaune, qui monte à **9**, plus du double.

| Temps | Sur la syllabe | Ce qui se passe | Son |
|---|---|---|---|
| 0,32 | « un **gra**mme » | la pilule **1 g** entre | `soft_click` |
| 0,95 | « de **su**cre » | la colonne **Sucre** apparaît, vide | `soft_click` |
| 1,26 | « **qua**tre » | elle monte à 4 ; le chiffre **4** entre en pop | `bloop` 0.3 |
| 2,84 | « de **gras** » | la colonne **Gras** apparaît, vide ; la montée sonore commence | `rizer-windy` 0.24, qui finit sur le 9 |
| 3,16 | « **neuf** » | elle monte à 9, compteur 0 → 9 ; la pilule pulse | `impacts` 0.43 |
| 3,47 → 3,5 | | tenue | |

### 2b · le ventre · 7,9 s

« il prend deux fois moins de place. Ton ventre se remplit à peine : la satiété, le signal « stop », est trop faible. Tu continues de manger. »

`compositions/I2b-le-ventre.html` · id `assiette-i2b-ventre`

**Ce qu'on voit.** D'abord les mêmes calories, côte à côte : à gauche, un tas de sept morceaux de sucre (4-2-1, dessinés à plat) avec **Sucre** ; à droite, une cuillère d'huile dorée avec **Gras** ; un **=** entre les deux. Puis les deux estomacs, le même dessin que dans [[Ton estomac ne compte pas les calories]] : une forme de haricot, sans contour, et un niveau qui monte depuis le bas. Ici en bleu clair (l'eau, le volume) : en beige, ils se confondaient avec la toile. En petit, en bas à droite : **HOLT · 1995**.

| Temps | Sur la syllabe | Ce qui se passe | Son |
|---|---|---|---|
| 0,00 | « **il** prend » | le tas de sucre et la cuillère entrent, le **=** au milieu | `soft_click`, `soft_click` |
| 0,95 | « deux **fois** moins » | une accolade de hauteur à côté de chaque tas ; celle de la cuillère fait la moitié ; une pilule **½** entre de son côté | `soft_click` |
| 2,28 | | les cartes sortent vers le haut | `air-woosh` 0.09 |
| 2,53 | « ton **ven**tre » | les deux estomacs entrent ; les morceaux de sucre tombent dans celui de gauche, la cuillère se verse dans celui de droite | `bloop` 0.6, `bloop` 0.5 |
| 3,16 | « se rem**plit** » | à gauche, le niveau monte à 55 % ; à droite, à 20 % | |
| 3,79 | « à **pei**ne » | le niveau de droite frémit, sans monter | |
| 4,42 | « la sa**tié**té » | au-dessus de l'estomac de droite, un panneau stop rouge (`octagon-minus`) entre, pâle (opacité 0,35), avec **Satiété** dessous | `soft_click` |
| 5,37 | « le signal « **stop** » » | le panneau essaie de s'allumer : trois battements faibles, 0,35 ↔ 0,55 | |
| 6,32 | « trop **fai**ble » | il retombe à 0,25 | |
| 6,95 | « tu con**ti**nues » | une deuxième cuillère se verse à droite ; le niveau monte à peine | `bloop` 0.5 |
| 7,58 | « de man**ger** » | une troisième cuillère ; une croix rouge se dessine à côté du panneau ; la carte encaisse | `bloop` 0.6, `wrong` 0.45 |
| 7,89 → 7,9 | | tenue | |

C'est le plan que tu voulais depuis le début : le ventre qui se remplit contre le ventre presque vide, pour les mêmes calories. Il ne dit aucun chiffre : les niveaux suffisent.

---

## Scène 3 · Le double · 2,5 s

« Pour les plus gras, c'était le double. »

`compositions/I3-le-double.html` · id `assiette-i3-double`

**Ce qu'on voit.** L'étude est déjà dite sur ton visage (plan 9, avec la pilule **ÉTUDE · 2006**) : la scène ne montre que le résultat. En haut, petite, une cloche de restaurant soulevée (`hand-platter`), pour le contexte. Dessous, deux barres à la même échelle : **Estimé**, avec l'icône des gens (`users`) posée dessus, à mi-hauteur ; **Réel**, en jaune, qui monte au double, avec la pilule **× 2**. En petit, en bas : **BURTON · 2006**.

| Temps | Sur la syllabe | Ce qui se passe | Son |
|---|---|---|---|
| 0,00 | « **Pour** les plus gras » | la cloche et la barre **Estimé** entrent, l'icône des gens posée dessus ; **BURTON · 2006** apparaît en bas | `soft_click` |
| 1,20 | | la montée sonore commence | `rizer-windy` 0.24 |
| 1,26 | « c'é**tait** » | la barre **Réel** commence à monter, en jaune | |
| 1,89 | « le **dou**ble » | elle arrive au double ; la pilule **× 2** entre en pop | `impacts` 0.43 |
| 2,21 → 2,5 | | tenue | |

**Pourquoi « les plus gras »** : l'étude a trouvé ce double pour les plats les moins sains, pas pour tous, et c'est une moyenne, pas l'erreur de chaque personne. **Pourquoi × 2** : ta voix dit « le double ».

---

## Scène 4 · La cuillère et le dessert · 5,4 s

« Alors la prochaine fois, prends ta cuillère, mesure bien ton huile, et profite de ton dessert. »

`compositions/I4-la-cuillere-et-le-dessert.html` · id `assiette-i4-cuillere-dessert`

**Ce qu'on voit.** Le chiffre **120** est déjà dit sur ton visage (plan 11). À gauche, une carte jaune : une cuillère à soupe dessinée à plat, vide, un trait fin marque son bord ; **Huile** dessous. L'huile s'y verse et s'arrête pile au trait. À droite, une carte orange : une crème dessert dessinée à plat (un petit pot blanc, la crème au chocolat qui dépasse), **Dessert** dessous.

| Temps | Sur la syllabe | Ce qui se passe | Son |
|---|---|---|---|
| 1,89 | « prends ta cuil**lère** » | la carte de la cuillère entre, la cuillère vide | `soft_click` |
| 2,21 | « **me**sure » | une goutte d'huile tombe dans la cuillère, le niveau monte | `bloop` 0.5 |
| 3,16 | « ton **hui**le » | le niveau s'arrête pile au trait ; une coche verte se dessine à côté | `correct` 0.36 |
| 3,79 | « pro**fi**te » | la carte de la crème dessert entre | `soft_click` |
| 4,74 | « ton des**sert** » | une coche verte se dessine sur la crème dessert ; la carte grandit à 108 % et revient ; des confettis derrière la coche, une seule fois dans la vidéo | `correct` 0.7 |
| 5,05 → 5,4 | | tenue | |

Deux coches qui montent, 0.36 puis 0.7 : l'huile mesurée, puis le dessert gagné. Rien n'est barré : le geste est positif, comme ta phrase.

---

## Ce que fait CapCut, sur les plans A

Pas d'animation HyperFrames sur toi en grand : les punch-ins, le mot **SUCRE** barré (plan 3), le mot **GRAS** et la pilule **ÉTUDE · 2006** (plan 9), la pilule **120** (plan 11), ton prénom, le bouton **Abonne-toi** et l'icône d'enregistrement (plan 13).

## Le son

Chaque composition a ses propres pistes, pour qu'`index.html` puisse les lire toutes à la suite : 1a de 11 à 19, 1b de 21 à 29, 2a de 31 à 39, 2b de 41 à 59, 3 de 61 à 79, 4 de 81 à 99. Les sons viennent de `D:\editing_audio\`, copiés dans `assets/sfx/`, comme pour la créatine. Au montage, la liste des sons s'exporte en `sons-des-inserts.json` et chaque son se pose à part dans CapCut.

## Ce qu'on ne fabrique plus

**Aucun b-roll généré pour cette vidéo** : sans plan sans toi, le montage n'en a plus besoin, et la DA dessine les objets au lieu de les photographier. G1, G2, G3, G7, G8 et G9 restent écrits dans la version longue, pour plus tard. Zéro crédit Higgsfield.

## Dans quel ordre

1. Tu valides ce document.
2. Je construis les six compositions dans `video/old/assiette-pas-le-dessert/compositions/`, avec `kit.css` et `youbud.css` copiés de la créatine, et un premier rendu brouillon de chacune, calé sur ces temps.
3. Tu tournes.
4. Je transcris ta prise, je recale chaque repère sur ta voix, je vérifie (`check`, planche-contact), puis je rends les versions finales et j'écris `PROMPTS-DETAILLES.md`, qui décrit ce qui est rendu.

[[video/old/assiette-pas-le-dessert/VERSION-COURTE|Version courte]] · Le format court · [[HUB]]
