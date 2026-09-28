# Tournage · La balance du lundi

Épisode 4 · **0:34 livrée** · 172 mots · monté avec [[methode/Le Kallaway edit|le Kallaway edit]]

La narration nue est dans [[video/balance-du-lundi/PROMPTEUR|PROMPTEUR]], les sources et la légende dans [[video/balance-du-lundi/SCRIPT|SCRIPT]].

## Les blocs à tourner

Cinq blocs, chacun **trois fois**, **un clap au début de chaque prise** (une fois dans les mains, face caméra : c'est ce qui recale ta bouche sur le son au montage, en une seconde). Puis le texte entier d'une traite deux fois, en secours.

| Bloc | Du début… | …à la fin | Prises |
|---|---|---|---|
| 1 · le hook | « Lundi matin, après un gros week-end » | « c'est surtout de l'eau. » | 3 |
| 2 · la réserve | « Le week-end, tu manges plus de sucre » | « Donc la balance monte. » | 3 |
| 3 · les soixante cuillères | « Mais pour prendre un kilo de gras » | « te priver pour de l'eau. » | 3 |
| 4 · l'étude | « Mais ce kilo repart. » | « au plus bas le vendredi. » | 3 |
| 5 · le geste et l'appel | « Ton gras, lui » | « et enregistre la vidéo. » | 3 |

## Réglages

Le même cadre que l'assiette, pour que la série se reconnaisse : 4K 16:9, toi au centre avec de l'air au-dessus de la tête (le cadre B te recadre en bas de l'image, ta tête doit pouvoir dépasser de la carte), la lampe chaude derrière, le t-shirt blanc, le micro-cravate. Tu regardes l'objectif sur toutes les phrases.

## Le jeu

- **« Lundi matin, après un gros week-end, la balance affiche un kilo de plus. »** : la scène, complice, un peu las ; « un kilo de plus » posé.
- **« Tu paniques, tu sautes le petit-déjeuner. »** : vite, comme la panique.
- **« Mais ce kilo, c'est surtout de l'eau. »** : un temps avant « Mais », puis calme, sûr ; « de l'eau » avec un demi-sourire.
- **La réserve** : tu expliques, simple, au rythme d'un prof qui aime son sujet ; « trois à quatre fois son poids en eau » détaché.
- **« plus de soixante cuillères d'huile de trop »** : le chiffre gros, lent ; « Presque personne ne fait ça » : un sourire.
- **« c'est te priver pour de l'eau »** : sec, c'est la phrase qu'on retient.
- **L'étude** : posé, tu racontes ; « au plus haut le lundi, au plus bas le vendredi » en miroir, même rythme.
- **« Ton gras, lui, se compte sur toute ta semaine. »** : sérieux, un cran plus bas.
- **« Ce matin, prends ton petit-déjeuner. »** : chaud, comme à un ami.
- **L'appel** : simple, comme si tu te présentais.

## Le plan, image par image

Le montage alterne **A**, toi en grand, et **B**, l'animation en haut avec toi détouré devant la carte en bas ([[methode/Le Kallaway edit|le Kallaway edit]]). Les temps sont estimés au rythme de l'assiette (4,75 mots par seconde une fois les souffles coupés), avant l'accélération ×1,08 ; `ke.py … plans` donnera les vrais.

| # | Temps | Ce que tu dis | Cadre | À l'image | Son |
|---|---|---|---|---|---|
| 1 | 0:00 → 0:01,3 | « Lundi matin, après un gros week-end, » | **A** | toi, zoom lent | riser sous la phrase, pas de musique |
| 2 | 0:01,3 → 0:04 | « la balance affiche un kilo de plus. Tu paniques, tu sautes le petit-déjeuner. » | **B** | **B1 · le lundi** : la semaine **L M M J V S D**, le L s'allume ; sur « un kilo », la balance affiche **+1 kg** ; sur « sautes », le bol du petit-déjeuner se barre en rouge | hoop sur la coupe ; la musique 1 démarre |
| 3 | 0:04 → 0:05,5 | « Mais ce kilo, c'est surtout de l'eau. » | **A** | punch-in 1,15 ; le mot **EAU** en pilule bleue sur « eau » | clic |
| 4 | 0:05,5 → 0:12 | « Le week-end, tu manges plus de sucre et de féculents. Ton corps en met en réserve, et cette réserve retient trois à quatre fois son poids en eau. Donc la balance monte. » | **B** | **B2 · la réserve** : S et D s'allument ; un morceau de sucre et une tranche de pain entrent dans une réserve (un bocal dessiné) ; sur « trois à quatre fois », trois gouttes puis une quatrième, pâle, se collent à chaque morceau ; sur « la balance monte », la balance passe de 0 à +1 | woosh |
| 5 | 0:12 → 0:13,5 | « Mais pour prendre un kilo de gras, » | **A** | zoom lent | le riser monte |
| 6 | 0:13,5 → 0:16,5 | « il faut manger plus de soixante cuillères d'huile de trop. Presque personne ne fait ça en un week-end. » | **B** | **B3 · soixante cuillères** : une grille de cuillères d'huile qui se remplit en rafale, le compteur monte jusqu'à **60+** ; en petit, **7 700 cal** ; sur « presque personne », la balance à +1 kg de gras se barre | **le hoop sur la coupe, à la place du woosh** (le moment fort) |
| 7 | 0:16,5 → 0:19 | « Donc sauter ton petit-déjeuner pour ce kilo, c'est te priver pour de l'eau. » | **A** | punch-in sur « pour de l'eau » | |
| 8 | 0:19 → 0:25,5 | « Mais ce kilo repart. Des chercheurs ont suivi le poids de plus de mille quatre cents personnes qui venaient de maigrir. En moyenne, il était au plus haut le lundi, au plus bas le vendredi. » | **B** | **B4 · la semaine du poids** : une grille de petits personnages qui se remplit, **1 400+** ; puis une courbe sur **L M M J V S D** : un point haut sous le L (rouge), qui descend jusqu'au V (vert) | woosh ; musique 1 coupée, le vent sous « En moyenne » |
| 9 | 0:25,5 → 0:27,4 | « Ton gras, lui, se compte sur toute ta semaine. » | **A** | zoom lent | hoop et musique 2 sur « Ton gras » |
| 10 | 0:27,4 → 0:30 | « Donc compare ton lundi au lundi d'avant, jamais au vendredi. » | **B** | **B5 · le geste** : deux semaines l'une sous l'autre ; les deux L reliés par une coche verte ; un trait du L au V, barré en rouge | woosh |
| 11 | 0:30 → 0:36 | « Ce matin, prends ton petit-déjeuner. Moi, c'est Mohamed : je t'explique la nutrition, sans régime. Abonne-toi pour la suite, et enregistre la vidéo. » | **A** | zoom lent ; ton prénom, le bouton **Abonne-toi** en pop, l'icône d'enregistrement | riser court + hoop sur « petit-déjeuner » (la chute) ; clics |

Onze plans en 36 secondes. La semaine ouvre et ferme la vidéo : c'est la signature de la série.

**Pour la fiche `kallaway.toml`** : les plans ci-dessus, les incrustes **EAU** (bleu, plan 3) et l'appel ; `[[sons]]` riser + hoop sur la coupe du plan 6 (`woosh = false` sur ce plan : le hoop remplace le woosh), sur « Ton gras » (la relance, plan 9) et sur « petit-déjeuner » (plan 11) ; la musique 1 de B1 à la relance, la musique 2 de « Ton gras » à la fin.

## Les animations à fabriquer

Cinq compositions **1080 × 960**, contenu utile entre y = 230 et y = 940, DA YouBud (skill `inserts-youbud`), fond de toile claire, chaque élément sur son repère (`ke.py … plans` les donne), aucun woosh dedans.

| | Ce qu'elle montre | Mots à l'écran | Son |
|---|---|---|---|
| **B1 · le lundi** | la semaine **L M M J V S D** (le composant de l'assiette), le L jaune ; une balance à plat qui affiche **+1 kg** ; un bol de petit-déjeuner barré en rouge | +1 kg | `soft_click` ; `wrong` 0.35 sur le bol |
| **B2 · la réserve** | S et D s'allument ; un sucre et une tranche de pain entrent dans un bocal ; trois gouttes bleues pleines et une pâle se collent à chacun ; la balance passe à +1 | Réserve · × 3 à 4 · +1 kg | `bloop` pour chaque goutte (quatre, en montant à peine) |
| **B3 · soixante cuillères** | une grille 8 × 8 de cuillères d'huile qui se remplit en rafale (en 1,5 s), compteur **60+** ; « 7 700 cal » en petit dessous ; une balance « +1 kg de gras » barrée | 60+ · 7 700 cal | `soft_click` en rafale, six au plus ; `impacts` sur 60 (le boum calé sur le compteur) |
| **B4 · la semaine du poids** | une grille de personnages (`user-round`), **1 400+** ; une courbe sur les sept jours, haute sous L, basse sous V | 1 400+ · L · V | `soft_click` en rafale ; `correct` 0.5 sur le V |
| **B5 · le geste** | deux semaines empilées ; les deux L reliés, coche verte ; L et V reliés, croix rouge | L = L · L ≠ V | `correct` 0.5 ; `wrong` 0.35 |

**Pas de b-roll généré** : tout ce qu'on voit est dessiné, comme pour l'assiette. Zéro crédit.

## Publier

Le **lundi 5 octobre au matin**, entre 7 h et 8 h, le moment où la personne monte sur sa balance (le 28, jour de l'assiette, était trop tôt : rien n'était tourné). L'épisode sort le jour dont il parle.

[[La balance du lundi]] · [[HUB]]
