# Plan : six semaines jusqu'au semi

Du lundi 7 septembre au dimanche 18 octobre 2026. Ce plan applique `FONDAMENTAUX.md`,
`PROGRAMME-FONDAMENTAUX.md` et `YAPPING-SEMI.md` ; en cas de conflit, ce sont eux qui
ont raison. Version 4 : deux formats, trois publications par semaine.

| | |
|---|---|
| Course | semi-marathon, **dimanche 18 octobre 2026**, visé en **1h35** |
| Formats | le **yapping** du semi, deux par semaine · la **science**, un fondamental par semaine |
| Rythme | **mercredi** yapping A · **vendredi** science · **dimanche** yapping B |
| Total | 12 yappings + le jour de course · 6 vidéos science · le trailer = 19 publications |
| Maison | **Instagram.** TikTok et Shorts en miroir |

---

## 1. L'expérience

La série du semi n'est pas un vlog, même en yapping. C'est une expérience avec une
hypothèse annoncée au premier épisode et un verdict le 18 octobre. Le modèle est dans
la bibliothèque : Jeremy Ethier, une promesse chiffrée au départ, un chiffre qui
s'ajoute chaque semaine, une fin qui répond mot pour mot à la promesse.

### L'hypothèse publique

> **Six semaines de préparation semi, objectif 1h35. Tout ce que je vais brûler en
> courant, on va le compter. Et on va voir combien de desserts ça paie vraiment.**

Elle est la thèse du profil mise à l'épreuve. Tu as dit à l'image que le sport, c'est
cinq pour cent. Un bloc de course est le cas où cette part monte le plus. Si le chiffre
final reste petit à l'échelle d'une semaine de repas, la thèse tient. S'il devient gros,
tu le dis. **Aucune des deux issues ne t'oblige à mentir.** Le chrono est le deuxième
fil : 43 minutes au 10 km, 1h35 visé.

### Le calcul de la semaine

Un ordre de grandeur, **à recalculer avec tes kilomètres réels** :

```
énergie d'une sortie ≈ 1 kcal par kilo de poids de corps et par kilomètre
```

Pour toi, à quatre-vingts kilos, quarante kilomètres dans la semaine font environ
3 200 kcal, à peu près **une journée de repas**. Le semi lui-même, vingt et un
kilomètres : environ 1 700 kcal, un repas et demi. C'est l'échelle qu'on affiche, jamais
le nombre nu. La formule ignore la marche, la montée et le reste de ta journée : on le
dit une fois, dans la légende de B1, et on ne dit jamais que le dessert est gratuit.

---

## 2. Le yapping

Tout est dans `YAPPING-SEMI.md` : la règle, le gabarit, le générateur, les douze
épisodes, ce qu'il faut filmer, la règle de montage. Ici, le calage sur tes séances.

| | Séance | B-roll, sans parler | Le yapping |
|---|---|---|---|
| mardi | renfo des jambes | oui | |
| **mercredi** | fractionné | oui | **A**, en marchant, juste après, deux prises |
| samedi | social, puis haut du corps | oui | |
| **dimanche** | sortie longue | oui | **B**, en marchant, juste après, deux prises |

Le chiffre s'affiche à l'écran avant que tu parles. Soixante à quatre-vingt-dix
secondes. Un changement à l'image toutes les deux à trois secondes : un insert, un
punch-in, ou un chiffre qui apparaît. Jamais une coupe sans raison.

---

## 3. La science : six fondamentaux d'ici la course

Un par semaine, le vendredi. D'ici la course, la version légère : toi face caméra, et
l'assiette animée qui produit les chiffres. La version lourde à trois animations, une
journée de travail, prend le même créneau quand les fondamentaux seront faits, pour les
mythes et les tabous. `meriter` en est une, déjà faite.

| Sem. | Vidéo | État | Ce qu'il faut |
|---|---|---|---|
| **S1** | **Tu n'as jamais eu à le mériter** | monté, sous-titré, deux pickups | tourner A et B en portrait natif, relier le montage sous Windows, exporter, légende. Le trailer sort le même jour |
| **S2** | **L'huile coûte plus cher que ton dessert** | script complet, 251 mots | chiffres vérifiés sur Ciqual ou YouBud ; **l'assiette animée construite et ses sept aliments générés, en S1** |
| **S3** | **Mange comme le corps que tu vises** | plan beat par beat | tes deux budgets dans YouBud, repos et à 70 kg ; le device population pour les deux silhouettes |
| **S4** | **Vingt kilos sans prendre de ventre** | sujet | tes photos à 60 et à 80, ton surplus par jour, la durée, ce qui a raté. C'est la vidéo qui te rend crédible, au milieu de la série |
| **S5** | **Les protéines : combien, et pourquoi** | sujet, ordre de grandeur | le script, une source lue. Elle répond à A2 et à la question que tout le monde pose |
| **S6** | **Ta montre ne sait pas ce que t'as brûlé** | sujet | le script, Shcherbina 2017 retrouvé. Légère, elle tombe la semaine de la course |

### Les pickups de `meriter`, sous Windows

| Pickup | Réplique | Jeu |
|---|---|---|
| A | « Sauf que le sport, c'est cinq pour cent de ce que tu brûles. Cinq. » | plan moyen puis punch-in serré. **« Cinq. »** isolé : silence avant, silence après |
| B | « Après, ça se compte quand même. Manger plus que ce que tu brûles, ça finit par se voir. » puis « Mais ce que tu brûles, c'est pas ta séance d'hier. C'est ta journée, et ta nuit. » | on redescend. Aucun sourire de fin. Deux secondes de silence après « nuit » |

Le projet `meriter-son-repas.kdenlive` pointe vers `/run/media/elmdimegh/Storage/videos`,
qui est `D:\videos`, et Kdenlive n'est pas installé. Deux voies :

| Voie | Comment | Quand la choisir |
|---|---|---|
| **Kdenlive pour Windows** | l'installer, ouvrir le `.kdenlive`. Il signale les clips manquants et propose de les retrouver : `D:\videos`, puis `D:\editing_audio`. Poser les deux pickups dans les trous repérés | si tu n'as pas retouché le projet à la main. C'est la plus courte |
| **CapCut** | reconstruire depuis les timecodes de `montage/MONTAGE.md` : dix plans, sept pistes, les volumes du skill `montage-capcut` | si tu veux rester dans CapCut pour toute la suite. Deux heures |

Dans les deux cas : le demi-silence du turn, les trois textes à l'écran, la
normalisation des trois retours, l'export.

### Après le 19 octobre

Les dix-huit autres fondamentaux de `PROGRAMME-FONDAMENTAUX.md` § 3, dans l'ordre
qu'on décidera en relisant le journal. Le science-reel « Le cardio fait fondre le
muscle ? », dont le teardown existe, en premier : c'est le seul qui demande trois
animations et une semaine.

---

## 4. Le calendrier

| Sem. | Dates | mercredi · yapping A | vendredi · science | dimanche · yapping B | Production de la semaine |
|---|---|---|---|---|---|
| **S1** | 7 → 13 sept | **A1** · le fractionné brûle moins que ce qu'on te dit | **Tu n'as jamais eu à le mériter** + **le trailer**, épinglé | **B1** · l'hypothèse, épinglé | lundi-mardi : les deux pickups, le montage relié. Le trailer tourné. **L'assiette animée construite, les sept aliments générés.** Le réglage portrait natif |
| **S2** | 14 → 20 sept | **A2** · tu ne perds pas ton muscle en courant | **L'huile coûte plus cher que ton dessert** | **B2** · la faim après la sortie longue | face caméra de l'huile, rendu de l'assiette, montage. Les chiffres du corps cible sortis de YouBud |
| **S3** | 21 → 27 sept | **A3** · courir plus vite ne brûle pas plus | **Mange comme le corps que tu vises** | **B3** · un jour de course, un jour de repos | le device population. Tes photos et tes chiffres de prise de masse rassemblés |
| **S4** | 28 sept → 4 oct | **A4** · la semaine de volume, manger assez | **Vingt kilos sans prendre de ventre** | **B4** · la séance que tu ne rates jamais | source des protéines lue, script écrit |
| **S5** | 5 → 11 oct | **A5** · le kilo d'eau avant la course | **Les protéines : combien, et pourquoi** | **B5** · cinq semaines, la balance, la thèse | Shcherbina retrouvé, script de la montre écrit, court |
| **S6** | 12 → 18 oct | **A6** · les trois jours avant, court | **Ta montre ne sait pas ce que t'as brûlé** | **le jour de course**, tourné sur place | rien d'autre. La semaine est à la course |
| bilan | 19 → 25 oct | | | épisode de bilan, optionnel | relire le journal. Réécrire le yapping sur ce qui a été mesuré. Choisir les six sciences suivantes |

**Dix-neuf publications.** Si une semaine casse, c'est la science qui glisse d'une
semaine, jamais le yapping.

---

## 5. Les tâches de recherche

Elles ne bloquent pas la semaine 1.

### Le sweep des comptes francophones

Aucune recherche par hashtag ou mot-clé sur TikTok et Instagram : il faut une liste de
comptes, et elle n'existe pas. Dix à quinze comptes, `account_summary` pour savoir
lesquels valent l'étude, puis `account_outliers` avec un `lookback` fixe de 12.

| Liste | Question | Ce qu'on en tire |
|---|---|---|
| **Nutrition et fitness francophones** | où les percées ont-elles lieu ? Quels hooks en français ? Quelqu'un anime-t-il déjà une assiette ? | la confirmation d'Instagram, des clips sources si un hook en réaction s'impose |
| **Coureurs amateurs qui documentent une préparation** | à quoi ressemble un épisode qui bat la médiane de son compte ? | le format yapping, mesuré |

@bananamo_ et @15sdy.sport sont déjà connus. Pour le reste : un compte neuf sur chaque
plateforme, chercher « déficit calorique », « prise de masse », « préparation
semi-marathon », noter les comptes qui reviennent.

### Les sources à lire avant d'écrire

Les protéines et la masse maigre en déficit (Longland 2016), la montre et la dépense
(Shcherbina 2017), le cardio et le muscle (Bryner 1999). Tous à retrouver et à lire ;
aucun chiffre ne se dit à l'image avant.

---

## 6. Le journal

L'hypothèse avant de publier, le résultat à sept jours. **On note, on ne décide rien
avant vingt vidéos.**

| Sem. | Publication | Publiée le | Hypothèse (avant) | Résultat à 7 j (après) |
|---|---|---|---|---|
| S1 | A1 | | | |
| S1 | Tu n'as jamais eu à le mériter | | | |
| S1 | le trailer | | | |
| S1 | B1 | | | |
| S2 | A2 | | | |
| S2 | L'huile coûte plus cher que ton dessert | | | |
| S2 | B2 | | | |
| S3 | A3 | | | |
| S3 | Mange comme le corps que tu vises | | | |
| S3 | B3 | | | |
| S4 | A4 | | | |
| S4 | Vingt kilos sans prendre de ventre | | | |
| S4 | B4 | | | |
| S5 | A5 | | | |
| S5 | Les protéines | | | |
| S5 | B5 | | | |
| S6 | A6 | | | |
| S6 | Ta montre ne sait pas ce que t'as brûlé | | | |
| S6 | le jour de course | | | |
