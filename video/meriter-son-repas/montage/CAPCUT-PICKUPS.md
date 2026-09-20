# Finir « Tu n'as jamais eu à le mériter » dans CapCut

**La base, c'est le rendu qui existe** : `montage/01-FINAL-sans-pickups.mp4`, 1080×1920,
1:29,5. Tout y est déjà : le lit, tes quatre retours, les trois animations avec leurs
bruitages, la voix, la musique en deux passages, les sous-titres. Il y manque deux plans,
laissés en noir, et une carte porte un mot interdit. On ne rouvre ni Kdenlive ni le projet
MLT : on pose les deux pickups par-dessus le rendu, on masque la carte, on exporte.
**Une heure de montage, dix minutes de tournage.**

Les deux trous, mesurés sur le rendu par détection des plans noirs :

| Trou | De | À | Durée | Ce qui va dedans |
|---|---|---|---|---|
| **A** | 0:13,50 | 0:18,00 | 4,5 s | « Sauf que le sport, c'est cinq pour cent de ce que tu brûles. Cinq. » |
| **B** | 1:16,90 | 1:28,93 | 12,0 s | « Après, ça se compte quand même. Manger plus que ce que tu brûles, ça finit par se voir. Mais ce que tu brûles, c'est pas ta séance d'hier. C'est ta journée, et ta nuit. » puis deux secondes de silence |

---

## 1. Tourner les deux pickups : dimanche 20 au matin, dix minutes, au téléphone

**Le raccord d'abord.** Tes retours ont été tournés le 1er septembre. Les pickups se
coupent au milieu d'eux, donc même endroit, même lumière, même toi :

![[video/meriter-son-repas/montage/raccord-retour-1.png|300]]

- le fauteuil noir derrière toi, le mur beige, la lampe **allumée, à gauche**, les rideaux
  tirés : le matin, la lumière du jour ne doit pas entrer plus que sur l'image ;
- la casquette, les lunettes, le t-shirt blanc, le micro-cravate visible au col ;
- plan poitrine, les yeux au tiers haut, toi centré. Le téléphone à hauteur des yeux, posé,
  pas tenu.

**Le réglage.** Portrait natif, 1080×1920 ou 4K, 30 images par seconde comme le rendu. Le
micro-cravate branché au téléphone si l'adaptateur existe ; sinon le téléphone à moins d'un
mètre et la pièce silencieuse. Trois prises de chaque, d'une traite.

| | Réplique | Jeu | Durée à tenir |
|---|---|---|---|
| **A** | « Sauf que le sport, c'est cinq pour cent de ce que tu brûles. » *(silence)* « Cinq. » *(silence)* | « Sauf que » repart franchement, après le « Moi aussi » qui précède dans le rendu. **« Cinq. »** se détache : silence avant, silence après, débit ralenti | 4,5 s. La phrase en trois secondes et demie, le « Cinq. » dans la seconde qui reste. Si ta prise fait cinq secondes, elle peut mordre d'une demi-seconde sur le début de l'animation qui suit, pas plus |
| **B** | « Après, ça se compte quand même. Manger plus que ce que tu brûles, ça finit par se voir. » *(respiration)* « Mais ce que tu brûles, c'est pas ta séance d'hier. C'est ta journée, et ta nuit. » | on redescend complètement. Le « Après, » comme on se reprend à voix haute. Ni punch, ni sourire de fin. **Le silence après « nuit » fait la moitié du travail** : tu te tais, tu regardes la caméra, deux secondes, puis tu coupes | 12 s. Les deux phrases en dix secondes, deux secondes de silence tenues à la fin |

Les fichiers vont dans `D:\videos\meriter-son-repas\`, nommés `pickup-A-1.mp4`,
`pickup-A-2.mp4`, `pickup-B-1.mp4`… Rien n'entre dans le dépôt.

---

## 2. Le montage, dans l'ordre

1. **Nouveau projet 9:16, 30 i/s.** Le rendu `01-FINAL-sans-pickups.mp4` sur la piste
   principale. On ne le coupe pas, on ne le déplace pas : tout ce qui suit se pose au-dessus.
2. **Pickup A** sur la piste du dessus, début calé à **0:13,50**, fin à **0:18,00**. Coupe la
   prise un quart de seconde avant « Sauf ». Sur « Cinq. », un punch-in : échelle 100 → 118 %
   par image-clé sur un tiers de seconde, ou une coupe franche à 120 %.
3. **Pickup B** au-dessus, de **1:16,90** jusqu'à la fin, **1:28,93**. Coupe un quart de seconde
   avant « Après ». Punch-in doux, 100 → 110 %, sur « Mais ce que tu brûles ». La prise
   couvre le noir jusqu'au bout ; si elle est plus courte que le trou, l'export s'arrête à la
   fin de ta prise, silence compris.
4. **Le son des pickups.** Volume 1,00, puis normalise chaque clip. Tes retours du 1er
   septembre sortaient dix décibels sous les voix seules : compare le pickup à la phrase qui
   le précède, ta tête ne doit pas sonner plus loin que l'animation. La musique du rendu
   continue dessous, c'est voulu ; le riser et l'impact de la coupe vers la chute sont déjà
   dans le rendu à 1:16.
5. **La carte du levier 2, à masquer.** De **1:06** à **1:16,9**, la carte « Les protéines »
   affiche « à digérer, elles coûtent plus cher / que les glucides ou le gras ». C'est le rendu
   du 6 septembre, d'avant la règle : jamais « coûte cher » pour des calories. Pose un
   rectangle (forme ou sticker uni, couleur prise à la pipette sur la carte) sur ces deux
   lignes seulement, puis un texte par-dessus, gras, gris moyen, même corps que la ligne
   cachée, aligné à gauche :
   > trois à dix fois plus de calories
   > à digérer que les glucides ou le gras

   Le badge « ×3 à ×10 » à droite reste visible. Pose le rectangle dès 1:06, quand la carte
   est encore vide et de la même couleur : la ligne y apparaît en fondu vers 1:07 et reste
   jusqu'au noir.
6. **Les trois textes à l'écran**, prévus depuis le début et absents du rendu. Majuscules,
   blanc, gras, dans le tiers haut de l'image, sans animation :
   - « EN DORMANT » sur le lit, de « T'as dormi » (vers 0:03) à la coupe de 0:05 ;
   - « J'AURAIS PAS DÛ », **entre guillemets**, quand tu dis « t'aurais pas dû » (vers 0:10),
     jusqu'à la coupe de 0:13,5 : c'est sa pensée, pas ton affirmation ;
   - « TA JOURNÉE, ET TA NUIT » sur le pickup B, de « C'est ta journée » jusqu'à la fin.
7. **Les sous-titres du pickup B.** Le rendu en porte jusqu'à 1:12 ; la chute n'en a pas
   parce qu'aucune prise n'existait. Sous-titres automatiques sur le clip du pickup B, tout
   en bas comme les autres, blanc gras contour noir, blocs de deux à quatre mots regroupés à
   la main. Aucun sous-titre sur le pickup A : la règle du rendu, rien sur le premier retour.
8. **Export** 1080×1920, 30 i/s, qualité maximale, vers `D:\videos\meriter-son-repas\02-FINAL.mp4`.

**Ce qu'on laisse.** Les sous-titres du rendu chevauchent la carte du levier 3 sur les
quatre dernières secondes de l'animation ; ça se voit à peine et le reprendre demande de
re-rendre. La voie propre existe si un jour tu veux le reel parfait : corriger la ligne 60
de `compositions/03-les-trois-leviers.html`, re-rendre l'animation (`npm run render:03`,
qui télécharge HyperFrames), et remonter les pièces dans CapCut depuis
[[video/meriter-son-repas/montage/MONTAGE|MONTAGE]]. Deux heures de plus, pas cette semaine.

---

## 3. Contrôle avant export

- [ ] Le silence des deux premières secondes, sur le lit, intact
- [ ] « Cinq. » isolé, un silence de chaque côté
- [ ] Le demi-silence du turn, avant « Enfin… pas vraiment », intact
- [ ] La ligne « coûtent plus cher » invisible sur toute la durée de la carte
- [ ] Deux secondes de silence après « nuit », puis la fin ; pas de carte de fin, pas d'appel à l'action
- [ ] Trois riser-impact dans toute la vidéo, jamais un quatrième
- [ ] Le volume de tes pickups au niveau des voix seules
- [ ] Rien à la première personne qui ne soit pas vrai pour toi : rien n'a changé dans le texte

## 4. Publier

- **YouTube**, en Short : titre « Tu n'as jamais eu à le mériter ». Description : la légende
  de [[video/meriter-son-repas/SCRIPT#4. La légende|SCRIPT § 4]], sources comprises. Vidéo
  associée : [[Déficit calorique]].
- **Instagram**, la même légende.
- **Samedi 19 septembre**, la troisième vidéo de la semaine :
  [[2026-09-27 📱 Tu n'as jamais eu à le mériter|l'événement]] est dans le [[Calendrier]].

[[Tu n'as jamais eu à le mériter]] · [[HUB]]
