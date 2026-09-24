# Brief · les trois inserts de « Mange comme le corps que tu vises »

**Ce fichier se donne tel quel à un autre modèle**, avec le skill `inserts-youbud` chargé. Il dit ce que montre chaque animation, sous quelle phrase, sur quelle syllabe, avec quel son.

## Le contexte

Un reel vertical en français, format « mythe corrigé par un mécanisme », 1:34. Mohamed parle face caméra ; sa voix continue sous trois inserts plein cadre. Le sujet : pour maigrir, on croit qu'il faut un régime, et que ça doit aller vite. En fait, chaque corps a un budget, et entre un corps de 80 kg et un corps de 70 kg, l'écart n'est que de deux cuillères d'huile par jour. Les régimes se valent à un kilo près et on les lâche ; ce qui compte, c'est de tenir. Le corps suit lentement : la moitié du chemin en un an, presque tout en trois ans.

**Le but des inserts : que quelqu'un qui regarde sans le son comprenne quand même.** Chaque insert montre une seule idée : l'écart minuscule, les régimes qui se valent, la lenteur.

## Les règles, toutes tirées de `inserts-youbud`

- **La DA de YouBud** : recopie `video/creatine-gummies/compositions/components/youbud.css` et `kit.css` tels quels dans `video/corps-cible/compositions/components/`, la police `Archivo.woff2`, `lucide.min.js` et les sons de `D:\editing_audio\` dans `assets/`. Les compositions de la créatine sont le modèle de structure.
- **La cuillère à soupe est la même que dans les inserts de l'assiette** (`video/assiette-pas-le-dessert/INSERTS-HYPERFRAMES.md`) : dessinée une fois, en SVG, réutilisée. C'est l'unité de la série.
- **Aucune bordure.** Cartes teintées, rebord plein en ombre dessous.
- **Des mots, jamais des phrases.** Un mot par élément (Budget, Régime, Tenir), des nombres dits dans la voix (80 kg, 70 kg, 160, 4, 1 kg, ½, 6 mois, 1 an, 3 ans), des symboles (×, ≈, ½, coche, croix), aucune calorie écrite : la voix n'en dit pas.
- **Les couleurs de cette vidéo**, les mêmes dans les trois inserts :

| Couleur | Ce qu'elle porte ici |
|---|---|
| jaune `--yb-yellow` | **le budget et les cuillères** : le terme clé |
| rouge `--yb-red` | **le régime** et ceux qui abandonnent |
| vert `--yb-green` | **tenir**, et le corps cible atteint |
| teinte neutre, encre | les silhouettes, les colonnes, les axes |

- **1080×1920, 30 i/s, fond plein.** Zone sûre : rien d'important dans les 12 % du haut ni les 20 % du bas.
- **Chaque élément entre sur sa syllabe.** Les temps ci-dessous sont estimés à 190 mots par minute, relatifs au début de l'insert, et se recalent sur la prise réelle (faster-whisper, `word_timestamps`) avant les rendus finaux. 0,3 s de tenue à la fin.
- **Le son est dans la composition**, une piste `<audio>` par bruitage, volumes du tableau de `inserts-youbud` § 4. Index des pistes : C1 = 11 à 39, C2 = 41 à 79, C3 = 81 à 99.
- Fichiers : `compositions/C1-le-budget.html`, `C2-l-etude.html`, `C3-la-lenteur.html`, rendus dans `renders/`, et un `PROMPTS-DETAILLES.md` qui décrit ce qui est rendu.

---

## C1 · le budget · 16 s

**Voix dessous** : « Chaque corps a un budget : ce qu'il dépense chaque jour pour rester comme il est. Plus il est lourd, plus il dépense. Entre un corps de quatre-vingts kilos et un corps de soixante-dix, la différence, c'est à peu près deux cuillères d'huile par jour. // Deux cuillères. Pas un régime. »
**Dispositif** : avant / après à la même échelle, deux jauges l'une sous l'autre.

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:00 | « Chaque **corps** » | une silhouette neutre (`person-standing`, grande), au centre | `soft_click` |
| 0:01,3 | « un **budget** » | à côté, une jauge horizontale jaune qui se remplit ; le mot **Budget** au-dessus | `clicks` |
| 0:05,4 | « Plus il est **lourd** » | la silhouette s'élargit d'un cran | `soft_click` |
| 0:06,3 | « plus il **dé**pense » | la jauge s'allonge d'autant | `bloop` 0.3 |
| 0:07,9 | « quatre-**vingts** kilos » | la scène se fige en haut : silhouette **80 kg**, sa jauge pleine | `soft_click` |
| 0:09,8 | « soixante-**dix** » | dessous, une silhouette un peu plus fine, **70 kg**, sa jauge presque aussi longue ; une ligne pointillée relie les deux bouts | `soft_click` |
| 0:10,4 | « la diffé**rence** » | le petit bout de jauge en trop, en haut, clignote en jaune | `clicks` |
| 0:12,0 | « **deux** cuillères d'huile » | deux cuillères pleines tombent dans cet écart, l'une après l'autre, et le remplissent exactement | `bloop` 0.5 puis 0.6 |
| 0:13,3 | « par **jour** » | pilule **/ jour** sous les cuillères | `soft_click` |
| 0:14,5 | « **Deux** cuillères » | les deux cuillères pulsent | |
| 0:15,1 | « **Pas** un régime » | une carte rouge **Régime** entre à droite, une croix se dessine dessus, la carte encaisse | `wrong` 0.45 |

L'écart doit se voir petit : le bout de jauge en trop fait environ un dixième de la jauge. C'est tout le propos.

## C2 · l'étude · 16 s

Il commence après la phrase face caméra et le b-roll G1, sur « Des chercheurs ».
**Voix dessous** : « Des chercheurs ont mis cent soixante personnes au régime pendant un an. Quatre régimes complètement différents. Entre le meilleur et le pire : à peine plus d'un kilo d'écart. Et dans les deux plus extrêmes, la moitié avait abandonné. Ce qui comptait, ce n'était pas le régime. C'était de tenir. »
**Dispositif** : la cohorte en personnages, puis le classement à la même échelle.

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:00 | « Des cher**cheurs** » | une fiole `flask-conical` en haut, discrète | `soft_click` |
| 0:01,4 | « cent soi**xante** personnes » | quarante personnages (`user-round`) arrivent en rafale, en grille ; compteur **160** au-dessus (un personnage vaut quatre personnes, rien ne l'écrit) | `soft_click` en rafale, six au plus |
| 0:03,5 | « pendant un **an** » | pilule **1 an** à côté du compteur | `clicks` |
| 0:03,8 | « **Quatre** régimes » | la grille se sépare en quatre colonnes de dix, chacune sur une carte teintée différente, pilule **4** | `air-woosh` 0.09 |
| 0:05,7 | « le meil**leur** et le **pire** » | sous chaque colonne, une barre de perte de poids se remplit : les quatre arrivent presque à la même longueur (2,1 · 3,2 · 3,0 · 3,3, rien n'est écrit) | `bloop` 0.22 à 0.34, en montant à peine |
| 0:08,5 | « à peine plus d'un **ki**lo » | une accolade entre la plus courte et la plus longue, pilule **≈ 1 kg** | `clicks` |
| 0:10,7 | « les deux plus ex**trêmes** » | la première et la quatrième colonne s'avancent d'un cran | |
| 0:11,4 | « la **moi**tié » | dans ces deux colonnes, cinq personnages sur dix passent au rouge, puis tombent hors du cadre ; pilule **½** | `wrong` 0.35 puis 0.45 |
| 0:14,5 | « pas le ré**gime** » | les quatre cartes s'effacent en gris | `air-woosh` 0.09 |
| 0:15,5 | « C'était de **tenir** » | au centre, une carte verte **Tenir**, la coche se dessine | `correct` 0.66 |

## C3 · la lenteur · 6,5 s

**Voix dessous** : « Le corps suit, mais lentement : la moitié du chemin prend à peu près un an. Presque tout, trois ans. »
**Dispositif** : la frise, de gauche à droite, avec une courbe qui descend.

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:00 | « Le corps **suit** » | un axe horizontal avec trois repères, **6 mois**, **1 an**, **3 ans** ; à gauche, **80**, à droite en bas, **70** en vert | `clicks` |
| 0:00,6 | « mais lente**ment** » | la courbe part de 80 et descend, vite au début puis de plus en plus doucement (une exponentielle : 29 % du chemin à 6 mois, 50 % à 1 an, 95 % à 3 ans) | `rizer-windy` 0.24 |
| 0:01,9 | « la **moi**tié du chemin » | la courbe atteint le repère **1 an** à mi-hauteur ; un point, pilule **½** | `soft_click` |
| 0:05,0 | « Presque **tout** » | la courbe finit presque sur la ligne du 70 | |
| 0:05,7 | « trois **ans** » | un point sur **3 ans**, une coche verte se dessine | `correct` 0.66 |

Le repère **6 mois** rappelle le turn qu'on vient d'entendre (« Même pas dans six mois ») : la courbe n'y est qu'au tiers du chemin, sans rien écrire de plus.

---

## Ce qui fait rejeter un insert

Une bordure, une phrase à l'écran, deux couleurs sur un carton, un chiffre absent de la voix, une calorie écrite, un élément qui entre avant sa syllabe, un rendu muet, un nom de régime ou une marque à l'écran.

[[Mange comme le corps que tu vises]] · [[HUB]]
