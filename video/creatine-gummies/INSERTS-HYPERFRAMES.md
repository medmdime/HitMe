# Brief · les quatre inserts HyperFrames de la créatine

**Ce fichier se donne tel quel à un autre modèle.** Il contient tout ce qu'il faut pour écrire et rendre les quatre inserts, sans autre contexte.

## Le contexte

Un reel vertical en français, format « mythe corrigé par un mécanisme », 1:20. Un créateur parle face caméra ; sa voix continue sous quatre inserts animés plein cadre. Le sujet : la plupart des gummies de créatine ne contiennent presque pas de créatine, et ils se vendent quand même. Ton travail : les quatre inserts, un fichier de composition et un MP4 par insert.

## Les contraintes techniques

- **HyperFrames**, version 0.8.21 : compositions HTML avec timings `data-*`, une timeline GSAP en pause, rendu déterministe. Un fichier par insert dans `video/creatine-gummies/compositions/`.
- **1080×1920, 30 images par seconde**, fond plein, aucune transparence. Aucun son dans le rendu : les bruitages se posent au montage.
- **Le kit visuel existe déjà** : recopie `video/meriter-son-repas/compositions/components/kit.css` et `splitbar.js` dans `video/creatine-gummies/compositions/components/` et pars de là. Regarde `video/meriter-son-repas/compositions/02-digestion-vs-sport.html` comme modèle de structure, et son `package.json` pour les commandes.
- Commandes : `npx --yes hyperframes@0.8.21 check`, puis `npx --yes hyperframes@0.8.21 render -c compositions/NOM.html -o renders/NOM.mp4 -q high`.
- **Zone sûre** : rien d'important dans les 12 % du haut ni dans les 20 % du bas, que l'interface d'Instagram recouvre.
- Chaque élément entre sur la syllabe indiquée. Les temps sont ceux de l'insert, pas du reel. Laisse 0,3 s de tenue à la fin de chaque insert.

## Les règles de texte

- Tout le texte à l'écran est en **français**, en capitales, police grasse sans empattement du kit. Espace fine avant `?`, `!`, `:`.
- **Un seul mot coloré par carton.** Jaune : le terme clé. Vert : ce qui marche. Rouge : le mythe ou ce qui manque.
- **Aucun nom de marque de gummies, nulle part.** Les sachets sont génériques, numérotés de 1 à 23.
- Aucune unité de laboratoire sauf « g ». Aucun pourcentage.
- Jamais « coûte cher » ni aucune image d'argent pour parler de calories ou de doses. Des pièces et des billets sont permis seulement pour « ils gagnent des millions », qui n'est pas dans ces inserts.

## I1 · poudre contre bonbon · 14 s

**Dispositif** : avant / après à la même échelle, puis croix et coche.
**Voix dessous** : « Tout le monde sait que la créatine marche, aujourd'hui. Le plus dur, c'est de la prendre assez souvent pour que ça marche. Cinq grammes de poudre pâteuse tous les jours, c'est contraignant. Un bonbon, c'est facile. »

| Temps | Sur la syllabe | Ce qui entre |
|---|---|---|
| 0:00 | « Tout le monde sait » | carton LA CRÉATINE **MARCHE**, « marche » en vert, une coche |
| 0:03 | « Le plus dur » | un calendrier de sept cases ; les cases se cochent une par une, deux restent vides et clignotent. Carton LE PLUS DUR : **TOUS LES JOURS**, en jaune |
| 0:07 | « Cinq grammes de poudre » | à gauche, une cuillère doseuse et un verre d'eau trouble. Étiquette 5 g · TOUS LES JOURS |
| 0:10 | « c'est contraignant » | une croix rouge discrète sur la colonne de gauche |
| 0:11 | « Un bonbon » | à droite, à la même échelle, un bonbon gélifié. Étiquette **FACILE**, en vert, une coche |

## I2 · vingt-trois marques · 18 s · l'insert prioritaire

**Dispositif** : la cohorte. Une grille de vingt-trois sachets génériques, 5 colonnes, numérotés.
**Voix dessous** : « Avec NOW, ils ont testé séparément les marques de gummies les plus vendues, pour voir s'il y avait vraiment de la créatine dedans. Sur vingt-trois marques testées, huit contenaient ce que disait l'étiquette. La majorité : presque zéro. Des bonbons normaux, quoi. »

| Temps | Sur la syllabe | Ce qui entre |
|---|---|---|
| 0:00 | « Avec NOW » | titre TESTÉS EN LABO. Les vingt-trois sachets arrivent un par un, très vite, en grille |
| 0:06 | « Sur vingt-trois marques » | compteur **23** en jaune au-dessus de la grille |
| 0:08 | « huit contenaient » | huit sachets passent au vert avec une coche, un par un. Compteur **8** en vert |
| 0:12 | « La majorité » | les quinze autres se vident : la jauge de chaque sachet descend à presque rien, en rouge. Carton PRESQUE **ZÉRO** |
| 0:15 | « Des bonbons normaux » | les quinze sachets rouges perdent leur étiquette CRÉATINE, qui tombe ; il reste écrit BONBONS |
| toute la durée | | bandeau de source discret en bas de zone sûre : JAMES SMITH + NOW · TESTS INDÉPENDANTS |

## I3 · on vend d'abord, on contrôle après · 7 s

**Dispositif** : la frise, de gauche à droite.
**Voix dessous** : « En France, un gummy se vend sur déclaration. Aucun labo ne teste la dose avant la vente. »

| Temps | Sur la syllabe | Ce qui entre |
|---|---|---|
| 0:00 | « En France » | une frise à trois étapes vides |
| 0:01 | « sur déclaration » | étape 1 : un formulaire, étiquette **DÉCLARATION**, en jaune |
| 0:03 | | étape 2 : un sachet qui part en rayon, étiquette EN VENTE |
| 0:04 | « Aucun labo » | entre les étapes 1 et 2, un emplacement LABO en pointillés, vide, barré d'une croix rouge. Carton **AUCUN** TEST AVANT, « aucun » en rouge |
| 0:06 | | étape 3, loin à droite : CONTRÔLE, grisée |

## I4 · trois grammes ou zéro · 5 s

**Dispositif** : avant / après, l'étiquette et le contenu.
**Voix dessous** : « Si l'étiquette dit trois grammes et que le bonbon en contient zéro, personne ne le sait avant un contrôle. Et les contrôles arrivent après la vente. »

| Temps | Sur la syllabe | Ce qui entre |
|---|---|---|
| 0:00 | « l'étiquette dit » | à gauche, un sachet, étiquette CE QUI EST ÉCRIT : **3 g**, en jaune |
| 0:02 | « en contient zéro » | à droite, le bonbon en coupe, jauge vide : CE QU'IL Y A : **0**, en rouge |
| 0:03 | « après la vente » | sous les deux, la frise de I3 en petit : le curseur saute directement à CONTRÔLE, après EN VENTE |

## Ce que tu rends

- `compositions/I1-poudre-contre-bonbon.html`, `I2-vingt-trois-marques.html`, `I3-vendre-puis-controler.html`, `I4-trois-grammes-ou-zero.html`
- `renders/I1…I4.mp4`, qualité haute, et une version `-q draft` de I2 en premier pour valider le rythme
- un `package.json` avec les scripts `check`, `draft:I2`, `render:I1` à `render:I4`
- le résultat de `check` sans erreur, et une ligne par insert si un temps a dû bouger

## Ce qui ferait rejeter un insert

Un nom de marque. Du texte en anglais. Deux mots colorés sur le même carton. Un élément qui entre avant sa syllabe. Un chiffre qui n'est pas dans la voix : 23, 8, 5 g, 3 g, zéro, et rien d'autre.
