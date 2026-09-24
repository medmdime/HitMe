# Brief · les quatre inserts de « Ton estomac ne compte pas les calories »

**Ce fichier se donne tel quel à un autre modèle**, avec le skill `inserts-youbud` chargé. Il dit ce que montre chaque animation, sous quelle phrase, sur quelle syllabe, avec quel son.

## Le contexte

Un reel vertical en français, format « mythe corrigé par un mécanisme », 1:28. Mohamed parle face caméra ; sa voix continue sous quatre inserts plein cadre. Le sujet : on croit qu'un grand verre d'eau avant de manger, ça cale. En fait l'estomac ne compte pas les calories, il sent la place ; et l'eau seule quitte l'estomac vite, la moitié en moins d'un quart d'heure. Bue à côté du plat, ou une demi-heure avant, elle ne cale pas. Mise dans le plat (une soupe), ou bue juste avant de manger, elle cale.

**Le but des inserts : que quelqu'un qui regarde sans le son comprenne quand même.** Tout tient dans une image : un estomac qui se remplit, et qui se vide plus ou moins vite selon l'endroit où est l'eau.

## Les règles, toutes tirées de `inserts-youbud`

- **La DA de YouBud** : recopie `video/creatine-gummies/compositions/components/youbud.css` et `kit.css` tels quels dans `video/estomac-sent-la-place/compositions/components/`, la police `Archivo.woff2`, `lucide.min.js` et les sons de `D:\editing_audio\` dans `assets/`. Les compositions de la créatine sont le modèle de structure.
- **L'estomac est dessiné une fois, à plat**, en SVG : une forme de haricot inclinée, teinte claire neutre, sans contour, avec un niveau de liquide intérieur qui monte et descend (un rectangle masqué par la forme, animé en `scaleY` depuis le bas). Il sert dans E1, E3 et E4.
- **Aucune bordure.** Cartes teintées, rebord plein en ombre dessous.
- **Des mots, jamais des phrases.** Un mot par élément (Place, Plein, Soupe, Soir), des nombres dits dans la voix (½, 15 min, 30 min, 0,5 L, −100, −140, < 35 ans), des symboles (≈, =, coche, croix), des icônes Lucide (`brain`, `timer`, `utensils`, `moon`, `clock`, `user-round`).
- **Les couleurs de cette vidéo**, les mêmes dans les quatre inserts :

| Couleur | Ce qu'elle porte ici |
|---|---|
| bleu `--yb-blue` | **l'eau**, partout : le verre, la bouteille, le niveau dans l'estomac |
| orange `--yb-orange` | **la soupe** et le plat |
| jaune `--yb-yellow` | **la place**, le terme clé ; et la cuillère d'huile de E2, l'unité de la série |
| vert `--yb-green` | ce qui cale : −100, −140, les coches |
| rouge `--yb-red` | ce qui ne cale pas : à côté, une demi-heure avant, les croix |

- **1080×1920, 30 i/s, fond plein.** Zone sûre : rien d'important dans les 12 % du haut ni les 20 % du bas.
- **Chaque élément entre sur sa syllabe.** Les temps ci-dessous sont estimés à 190 mots par minute, relatifs au début de l'insert, et se recalent sur la prise réelle (faster-whisper, `word_timestamps`) avant les rendus finaux. 0,3 s de tenue à la fin.
- **Le son est dans la composition**, une piste `<audio>` par bruitage, volumes du tableau de `inserts-youbud` § 4. Index des pistes : E1 = 11 à 39, E2 = 41 à 79, E3 = 81 à 99, E4 = 101 et plus.
- Fichiers : `compositions/E1-la-place.html`, `E2-la-preuve.html`, `E3-le-moment.html`, `E4-au-moment-de-t-asseoir.html`, rendus dans `renders/`, et un `PROMPTS-DETAILLES.md` qui décrit ce qui est rendu.

---

## E1 · la place · 16 s

Il commence après la phrase face caméra « Ton estomac ne compte pas les calories. Il n'a rien pour ça. »
**Voix dessous** : « Ce qu'il sent, c'est la place. Quand ses parois s'étirent, il prévient ton cerveau : c'est ça, se sentir plein. Sauf que l'eau seule ne reste pas. Un verre d'eau : en moins d'un quart d'heure, la moitié a déjà quitté ton estomac. Dans une soupe, elle reste bien plus longtemps. »
**Dispositif** : le mécanisme dessiné, puis avant / après à la même échelle.

**Tableau 1, la place**

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:00 | « Ce qu'il **sent** » | l'estomac, grand, au centre | `soft_click` |
| 0:01,6 | « c'est la **place** » | le mot **Place** en jaune sous l'estomac | `clicks` |
| 0:02,5 | « ses **parois** s'étirent » | l'estomac gonfle d'un quart (`scale` 1 → 1,25), trois petits arcs pulsent sur ses bords | `rizer-windy` 0.24 |
| 0:04,1 | « ton **cerveau** » | en haut, l'icône `brain` ; une ligne pointillée se dessine de l'estomac jusqu'à elle | `soft_click` |
| 0:05,7 | « se sentir **plein** » | à côté du cerveau, une carte verte **Plein**, la coche se dessine | `correct` 0.4 |

**Tableau 2, l'eau qui s'en va**

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:06,6 | « l'**eau** seule » | sortie du tableau 1 ; à gauche, un estomac plus petit ; un verre bleu se verse dedans, le niveau monte | `air-woosh` 0.09, `bloop` 0.5 |
| 0:07,6 | « ne **reste** pas » | une goutte sort par le bas de l'estomac, puis un filet continu | `bloop` 0.3 |
| 0:08,5 | « Un **verre** d'eau » | au-dessus, l'icône `timer` ; son aiguille se met à tourner | `soft_click` |
| 0:10,7 | « un quart d'**heure** » | pilule **15 min** sous le minuteur | `clicks` |
| 0:11,4 | « la **moi**tié » | le niveau bleu est tombé à la moitié ; pilule **½** ; une petite croix rouge | `wrong` 0.35 |
| 0:13,9 | « Dans une **soupe** » | à droite, à la même échelle, un second estomac rempli d'orange, avec des morceaux ; le même minuteur au-dessus | `soft_click` |
| 0:15,5 | « bien plus **long**temps » | l'aiguille tourne encore : à gauche le niveau bleu continue de baisser, à droite le niveau orange bouge à peine ; coche verte à droite | `correct` 0.5 |

## E2 · la preuve · 20 s

Il commence après le b-roll G1, sur « Une fois avec un grand verre ».
**Voix dessous** : « Une fois avec un grand verre d'eau à côté. Une fois sans. Et une fois avec la même eau mise dedans : le plat devient une soupe. Au repas d'après ? Avec le verre ou sans le verre : pareil, à quatre calories près. En soupe : cent calories de moins. L'équivalent d'une cuillère d'huile, sans rien enlever du plat. Et le soir, ils n'ont pas rattrapé. »
**Dispositif** : trois plateaux, puis le classement à la même échelle.

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:00 | « un grand **verre** d'eau » | plateau 1, à gauche : le plat orange et, à côté, un verre bleu | `soft_click` |
| 0:03,2 | « Une fois **sans** » | plateau 2, au centre : le plat seul | `soft_click` |
| 0:06,0 | « la même eau mise de**dans** » | plateau 3, à droite : un verre bleu penche et se verse dans le plat | `bloop` 0.6 |
| 0:07,6 | « devient une **soupe** » | le plat du plateau 3 devient un bol de soupe ; le mot **Soupe** dessous | `soft_click` |
| 0:08,8 | « Au repas d'a**près** » | les plateaux rétrécissent en haut ; dessous, l'icône `utensils` et trois pistes horizontales vides, une par plateau | `air-woosh` 0.09 |
| 0:11,4 | « **pa**reil » | les pistes 1 et 2 se remplissent à la même longueur ; pilule **≈** entre elles | `bloop` 0.3 puis 0.34 |
| 0:13,3 | « En **soupe** » | la piste 3 se remplit, nettement plus courte (les trois quarts des autres) | `bloop` 0.4 |
| 0:14,5 | « cent calories de **moins** » | au bout de la piste 3, pilule verte **−100**, coche | `correct` 0.66 |
| 0:15,6 | « une cuil**lère** d'huile » | à côté de la pilule −100, une cuillère à soupe d'huile jaune (la même que dans les inserts de l'assiette), pilule **≈** entre les deux | `soft_click` |
| 0:17,4 | « sans rien enle**ver** du plat » | le bol de soupe du plateau 3 pulse : il est entier | |
| 0:18,4 | « Et le **soir** » | en haut à droite, l'icône `moon` et le mot **Soir** | `soft_click` |
| 0:19,6 | « pas rattra**pé** » | la pilule **−100** pulse et reste ; une coche se dessine sous la lune | `correct` 0.5 |

Longueurs des pistes, pour que ce soit juste : 396, 392, 289 sur une piste de 420. Aucun de ces chiffres n'est écrit.

## E3 · le moment · 18,5 s

**Voix dessous** : « Tout dépend d'où est l'eau quand tu manges. Chez des moins de trente-cinq ans, un grand verre bu une demi-heure avant le repas : rien. Chez des jeunes hommes, une bouteille d'un demi-litre bue juste avant de manger : cent quarante calories de moins. Ce n'est pas l'eau qui cale. C'est l'eau qui est dans ton estomac quand tu manges. »
**Dispositif** : la frise, de gauche à droite, deux lignes l'une sous l'autre.

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:00 | « Tout dé**pend** » | une frise horizontale se dessine ; à droite, l'icône `utensils` sur le repère **0** | `clicks` |
| 0:01,6 | « d'où est l'**eau** » | au-dessus du repère 0, un petit estomac vide | `soft_click` |
| 0:04,7 | « trente-**cinq** ans » | à gauche de la ligne, pilule **< 35 ans** | `soft_click` |
| 0:05,7 | « un grand **verre** » | un verre bleu sur un repère **30 min** à gauche | `soft_click` |
| 0:06,6 | « une demi-**heure** avant » | le verre se verse dans un estomac au-dessus du repère ; puis un curseur glisse de 30 min à 0, et pendant le trajet l'estomac se vide | `bloop` 0.5, puis `rizer-windy` 0.24 |
| 0:07,9 | « **rien** » | au repère 0, l'estomac est vide ; croix rouge, la carte encaisse | `wrong` 0.45 |
| 0:09,1 | « jeunes **hommes** » | dessous, une seconde frise, même échelle ; à gauche, l'icône `user-round` | `air-woosh` 0.09 |
| 0:09,8 | « une **bou**teille » | une bouteille bleue sur le repère **0** | `soft_click` |
| 0:10,4 | « d'un demi-**litre** » | pilule **0,5 L** | `clicks` |
| 0:11,4 | « juste a**vant** » | la bouteille se verse dans l'estomac au repère 0 : il est plein au moment du repas | `bloop` 0.7 |
| 0:12,7 | « cent qua**rante** » | pilule verte **−140**, coche | `correct` 0.66 |
| 0:15,5 | « l'eau qui **cale** » | les deux frises s'effacent ; au centre, un verre seul, gris, barré | `wrong` 0.35 |
| 0:18,0 | « dans ton es**to**mac » | à sa place, l'estomac plein de bleu avec l'icône `utensils` dedans ; coche verte | `correct` 0.7 |

Les deux lignes viennent de deux études différentes : aucun trait ne les relie, elles sont juste l'une sous l'autre.

## E4 · au moment de t'asseoir · 3,5 s

Il vient après le b-roll G2.
**Voix dessous** : « Ou bois-la au moment de t'asseoir. Pas une demi-heure avant. »
**Dispositif** : la croix et la coche.

| Temps | Sur la syllabe | Ce qui entre | Son |
|---|---|---|---|
| 0:00 | « Ou **bois**-la » | l'icône `clock` au centre, deux pilules dessous : **0 min** et **30 min** | `soft_click` |
| 0:01,2 | « t'as**seoir** » | coche verte sur **0 min** | `correct` 0.5 |
| 0:02,2 | « une demi-**heure** avant » | croix rouge sur **30 min**, la pilule encaisse | `wrong` 0.45 |

---

## Ce qui fait rejeter un insert

Une bordure, une phrase à l'écran, deux couleurs sur un carton, un chiffre absent de la voix, un millilitre ou une calorie écrits en dehors des pilules −100 et −140, un élément qui entre avant sa syllabe, un rendu muet, une marque d'eau en bouteille.

[[Ton estomac ne compte pas les calories]] · [[HUB]]
