# Montage — Kdenlive

**Deux versions du même montage, au choix. Les deux rendent exactement pareil** —
Kdenlive et Shotcut tournent sur le même moteur (MLT).

| Fichier | Logiciel | |
|---|---|---|
| `meriter-son-repas.mlt` | **Shotcut** | **conseillé** — interface bien plus simple |
| `meriter-son-repas.kdenlive` | Kdenlive | plus complet, plus dur à prendre en main |

**1080×1920 · 30 i/s · 88,9 s · 7 pistes.** Tous les chemins sont absolus, les médias
sont là. Pour installer Shotcut : `sudo apt install shotcut`.

`00-preview-assemblage.mp4` est le rendu de contrôle de ce projet, pour vérifier
sans ouvrir Kdenlive.

> **Le générateur `build_kdenlive.py` a fait son travail.** Il reste dans le dossier pour
> que tu voies d'où viennent les timecodes. **Ne le relance plus** une fois que tu as
> touché au projet : il réécrit le `.kdenlive` et écrase ton montage.

---

## 1. Deux plans manquent, et c'est le plus important

Tu as filmé **avant** qu'on corrige deux choses. Les trous sont déjà en place dans la
timeline, avec un repère Kdenlive à chaque fois.

### PICKUP A — 0:13,5 → 0:18 · 4,5 s

Ta prise `00-26-00` est bonne sur ses trois premières phrases, je l'ai coupée à 8,5 s.
La quatrième dit **« Sauf que ceux-là, ils portent sur cinq pour cent »** — l'ancienne
formulation. Avec le pivot actuel, « ceux-là » n'a plus aucun antécédent : le spectateur
ne sait pas de quoi tu parles.

> **« Sauf que le sport, c'est cinq pour cent de ce que tu brûles. Cinq. »**

Plan moyen, punch-in serré. **« Cinq. »** se détache : silence avant, silence après.

### PICKUP B — 1:16,9 → 1:28,9 · 12 s · la chute

**Tes deux prises portent la version fausse.** C'est la faute que tu as toi-même
repérée : en surplus calorique, le corps ne s'occupe de rien.

| | Ce que tu dis |
|---|---|
| `00-30-11` | « t'as jamais eu de mériter ce que tu manges, **ça nous occupe pendant que tu dors** » |
| `00-30-44` | « **Mange comme tu veux et profite de ta vie, ton corps s'en occupe du reste** » |

La seconde est la plus dangereuse : elle dit littéralement que le dessert est gratuit.

> **« Après, ça se compte quand même. Manger plus que ce que tu brûles, ça finit par se voir. »**
>
> **« Mais ce que tu brûles, c'est pas ta séance d'hier. C'est ta journée, et ta nuit. »**

Plan moyen puis punch-in doux. On redescend, aucun sourire de fin, et tu laisses
tourner deux secondes après « nuit ».

---

## 2. Les prises retenues, et pourquoi

20 prises, identifiées à l'oreille (faster-whisper, français).

| Bloc | Prise | Pourquoi elle |
|---|---|---|
| Hook, voix | `00-17-20` | 3 prises. `00-17-28` dit « **tu n'as** rien fait » — du français écrit. Les deux autres sont contractées ; la plus courte tombe mieux dans les 5 s du lit |
| Retour 1 | `00-26-00` **coupée à 8,5 s** | prise unique. Les 3 premières phrases sont justes, « j'aurais pas dû » compris |
| Section A · TDEE | `00-26-19` | prise unique, 17,4 s, complète |
| Retour 2 | `00-26-53` | prise unique. Tu dis « les deux **au** milieu » au lieu de « du milieu » — c'est aussi juste, je garde |
| Section B | `00-27-19` | **6 prises.** `00-27-15` est un faux départ ; `00-27-38` et `00-27-46` finissent mal (« quand t'entraîner », « jusqu'à t'entraîner »). Restent `05`, `19`, `30` — j'ai pris `19` parce que son « deux fois plus » tombe à 3,07 s, ce qui cale le ×2 de l'animation au mot près |
| Retour 3 · le turn | `00-28-18` | 2 prises. `00-28-02` dit « je **ne** fais rien » — écrit. Celle-ci dit « je fais rien » |
| Section C | `00-28-39` | **4 prises.** `00-28-34` et `00-29-09` sont incomplètes. Contre `00-29-20`, celle-ci finit sur « c'est là où il y a le plus à prendre », qui est la phrase du script — l'autre finit sur « c'est ça qui fonctionne » |
| Chute | **aucune** | voir PICKUP B |

---

## 3. Les animations ont été recalées sur ta voix

Elles étaient écrites sur un débit théorique. Je les ai reprises **sur tes mots réels**,
mesurés au centième :

| | Avant | Après | Calé sur |
|---|---|---|---|
| `01-decoupe-tdee` | 18 s | **17,5 s** | « découpe » 5,48 · « sport » 6,46 · « digestion » 11,34 · « gros » 12,78 |
| `02-digestion-vs-sport` | 8 s | 8 s | « deux fois plus » à 3,07 → le ×2 tombe dessus |
| `03-les-trois-leviers` | 30 s | **26,5 s** | « leviers » 3,94 · « protéines » 12,54 · « gros » 20,16 |

Sans ce recalage, le levier 3 arrivait **2,2 s** après que tu l'aies annoncé.

Les 41 bruitages d'éléments (pops, clics, dings) sont **cuits dans les MP4** — tu n'as
rien à poser pour eux, et ils suivent le recalage automatiquement.

---

## 4. Les pistes

Structure du § 1 du skill : **deux pistes vidéo**, et la piste du bas ne sert qu'au
fond du hook. Ça permet de changer le hook sans toucher au reste du montage.

| Piste | Contenu | Volume |
|---|---|---|
| **incrustation** | tout le montage — face caméra + les 3 animations (elles portent leurs bruitages) | 1.00 |
| **main** | le fond du hook uniquement — le plan du lit, 0:00 → 0:05 | 1.00 |
| **A1** | **tout le son parlé** — le volet audio des 3 retours face caméra + les 3 sections voix seule | 1.00 |
| **A2** | musique — deux mouvements | **0.11** puis **0.24** |
| **A3** | `rizer-mettalic` ×3 | 0.24 |
| **A4** | `impacts` ×3 | 0.43 |
| **A5** | `air-woosh` ×3 | **0.09** |

Chaque retour face caméra est posé en **deux clips liés** : l'image sur `incrustation`,
le son sur `A1`, aux mêmes timecodes. C'est comme ça que Kdenlive attend un clip AV —
posé seulement sur la piste vidéo, sa forme d'onde n'apparaît pas et tu ne peux rien
régler dessus.

> **Le son de tes retours est plus bas que celui des voix seules** : le retour 1 sort à
> −30,3 dB de moyenne quand la section C est à −20,7. Presque 10 dB d'écart. Passe un
> coup de normalisation sur les trois clips de retour avant la passe de volumes finale,
> sinon ta tête sonnera lointaine à côté des animations.

Volumes repris tels quels du skill `montage-capcut` § 6. Le whoosh à 0.09 n'est pas là
pour s'entendre, il est là pour lisser la coupe.

### La bascule musicale

Tu n'as **qu'un seul morceau** (`LoVibe. - a good man with a broken heart`, 1:58).
Le format en demande deux, avec le changement sur le turn — c'est ce changement, plus
que n'importe quel bruitage, qui fait sentir au spectateur que quelque chose a basculé.

En attendant, j'ai fait au plus proche : le **même morceau, deux passages différents**.
Le premier mouvement part du début à 0.11 ; le second repart à **1:00 du morceau**, à
0.24, sur le turn. L'énergie monte et la matière change un peu.

**Si tu trouves un deuxième morceau**, remplace le clip de A2 qui commence à 0:46 — c'est
un gain net.

### Les trois signatures riser → whoosh → impact

Trois emplois, jamais un quatrième :

| Quand | Où |
|---|---|
| 0:05 | la coupe du lit vers ta tête |
| **0:48,9** | le turn, sur « Enfin… pas vraiment » — même endroit que la bascule musicale |
| 1:16,9 | la coupe vers la chute |

Le riser démarre ~1 s avant la coupe, l'impact tombe dessus.

---

## 5. Le recadrage, et la résolution

**Le projet pointe tes fichiers d'origine**, dans `/run/media/elmdimegh/Storage/videos/`.
Aucun recadrage, aucune copie, aucune réencodage : tes prises arrivent telles quelles,
en 1280×720, avec des bandes noires en haut et en bas dans le cadre 1080×1920.
**Le recadrage se fait dans Kdenlive**, où tu le contrôles à l'image près.

Repère utile si tu veux aller vite : une fenêtre **405×720 prise à x = 330** te centre
bien, avec la lampe à gauche. C'est ce que j'avais testé.

Une chose à savoir en le faisant : ce recadrage agrandit **2,67×** pour remplir le cadre.
Le visage sera plus doux que les animations, qui sont natives en 1080×1920. On ne
récupère pas des pixels qui n'ont jamais existé — **pour tout ce que tu refilmeras,
filme en portrait 1080×1920 natif**, l'écart se voit.

## 6. Ce qui reste à faire dans Kdenlive

1. **Tourner les deux pickups**, les poser dans les trous repérés
2. **Le demi-silence du turn** — dans `00-28-18` tu enchaînes « c'est réglé ? » et
   « Enfin » sans respirer. Coupe entre les deux et écarte de ~0,5 s : c'est ce silence
   qui fait le retournement, et c'est là que tombe l'impact
3. **Les sous-titres sont générés** — `sous-titres.srt`, 23 blocs, 0,4 à 3,6 s,
   moyenne 2,1 s. Le premier tombe à 18,31 s, au début du premier bloc d'animation :
   rien sur le hook ni sur le plan qui le suit, comme le veut le § 7.
   Ils sont référencés par le projet ; si Kdenlive ne les charge pas tout seul,
   Projet → Sous-titres → Importer. **À placer tout en bas (Y = −0,85)** et à
   surligner : un seul mot par phrase
4. **Les textes à l'écran** — « EN DORMANT » sur le lit, « J'AURAIS PAS DÛ » entre
   guillemets sur le pivot, « TA JOURNÉE, ET TA NUIT » sur la chute
5. **Un deuxième morceau** pour la bascule (§ 4)


---

## 7. Shotcut plutôt que Kdenlive

Même moteur MLT, donc **rien n'est perdu à la conversion** : mêmes pistes, mêmes
timecodes, mêmes volumes, mêmes bruitages. J'ai rendu les deux projets et comparé —
image identique, niveaux identiques au dixième de dB.

Ce qui change, c'est l'interface : une seule timeline, glisser-déposer, un panneau de
filtres au lieu de la pile d'effets de Kdenlive. C'est ce qui existe de plus proche de
CapCut sur Linux.

**Les sous-titres** s'importent par Timeline → Piste → Ajouter une piste de sous-titres,
puis le bouton d'import qui lit `sous-titres.srt`.

**Le recadrage de tes prises** : filtre **Taille, position, rotation** sur chaque clip
face caméra. Tu tires les poignées à la souris, tu vois le résultat en direct.

### Les autres pistes, et pourquoi je ne les conseille pas

- **CapCut sur le web** (capcut.com dans ton navigateur) — c'est l'interface que tu
  connais déjà, et elle marche sur Ubuntu. Mais tout ton tournage part sur leurs
  serveurs, et **ce montage-ci n'est pas importable** : il faudrait le refaire à la main
  depuis les timecodes de ce document. À garder en tête si Shotcut ne te convient pas.
- **DaVinci Resolve** — la version Linux gratuite ne lit **ni le H.264 ni l'AAC**, donc
  ni tes prises ni tes animations sans tout réencoder d'abord. Et l'interface est plus
  lourde que Kdenlive, pas plus légère.
- **OpenShot** — plus simple encore, mais il plante régulièrement sur les projets à
  plusieurs pistes. Ce montage en a sept.
