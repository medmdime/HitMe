# HUB

**Tout part d'ici.** Ce coffre Obsidian est le dépôt lui-même : les mêmes fichiers que
Claude lit et écrit, ouverts comme des notes. La documentation d'abord ; le code n'est
qu'un outil, rangé dans `outils/` et masqué ici. Une page par vidéo, une note par jour
où il se passe quelque chose, la méthode à côté. Ce que tu changes ici, Claude le voit ;
ce que Claude écrit, tu le vois ici.

## Aujourd'hui

**Prochain tournage : dimanche 20 septembre**, tout d'un coup : la longue
[[Les calories, les fondamentaux]], ses trois shorts, [[Le trailer]], les deux pickups de
[[Tu n'as jamais eu à le mériter]]. La feuille de plateau, à avoir sous les yeux :
[[video/calories-fondamentaux/TOURNAGE|TOURNAGE]]. La note du jour : [[2026-09-20 🎬 Tournage · Les calories, les fondamentaux|dimanche 20]].

Avant dimanche, cinq choses à trancher, elles sont listées en bas de
[[Les calories, les fondamentaux#À confirmer avant de tourner|la page de la vidéo]].

**Cette semaine, du lundi 14 au dimanche 20 : trois vidéos à sortir.** Deux sont déjà sur
YouTube, [[Déficit calorique]] et « Trois cents calories par jour ». La troisième se tourne
au téléphone, en dix minutes : les deux pickups de [[Tu n'as jamais eu à le mériter]], dont
le montage attend depuis le 6 septembre. Comment le finir dans CapCut :
[[video/meriter-son-repas/montage/CAPCUT-PICKUPS|CAPCUT-PICKUPS]].

---

## 1. Le profil : les fondamentaux

Qui tu es, ce que tu défends, à qui tu parles, comment tu parles. À relire avant d'écrire
un script ou une légende.

| Note                                                      | Ce qu'elle contient                                                                                                                      |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [[profil/README\|Le topo]]                                | les décisions en dix lignes, la semaine type, ce qui est écrit et ce qui manque                                                          |
| [[profil/FONDAMENTAUX\|Les fondamentaux du profil]]       | le Brand Journey, le Brand Story, les deux spectateurs, le ton, la signature, le tournage, ce qu'on ne fait pas                          |
| [[profil/PROGRAMME-FONDAMENTAUX\|Le programme]]           | les vidéos longues chapitre par chapitre, la méthode d'écriture d'une longue, la méthode du short, le packaging YouTube, la règle YouBud |
| [[profil/STORIES-SEMI\|Les stories]]                      | le sport et la vie dans les stories, sans chrono ; le b-roll par séance ; la réserve « Manger quand tu cours »                           |
| [[profil/PLAN-SEMI-18-OCTOBRE\|Le plan des six semaines]] | la charge par semaine, les recherches à faire, le journal. **Pour les dates, c'est le [[Calendrier]] qui fait foi**, pas ce plan         |

Les dix décisions, en une ligne chacune : un seul type de vidéo, les calories ; une longue
YouTube par semaine, dix minutes ; trois shorts Instagram tirés du même script ; le sport
dans les stories ; aucune performance à l'image ; tenir longtemps ; chaque chiffre à
échelle humaine ; sans jugement, à cause de ta mère ; Instagram et YouTube, rien d'autre ;
aucune décision sur les vues avant vingt vidéos.

---

## 2. La direction long terme

Une longue par dimanche, dans cet ordre. Les fondamentaux d'abord, puis les mécanismes,
puis les tabous.

| Sort le | La longue | État |
|---|---|---|
| dim 27 sept | [[Les calories, les fondamentaux]] | **écrite**, à tourner dimanche 20 |
| dim 4 oct | [[Pourquoi ça revient]] | écrite et vérifiée, à tourner le 27 |
| dim 11 oct | [[Quoi mettre dans l'assiette]] | écrite et vérifiée, à tourner le 4 |
| dim 18 oct | [[Tu n'as jamais eu à le mériter]], version longue | le reel existe ; la longue est à écrire |
| dim 25 oct | [[Une calorie, c'est une calorie]] | le chapitre 1 est écrit ; deux chapitres à écrire |
| dim 1er nov | [[Vingt kilos sans prendre de ventre]] | ton histoire, à écrire avec tes chiffres |
| dim 8 nov | [[Manger quand tu cours]] | les douze hot takes, en réserve dans [[profil/STORIES-SEMI\|les stories]] |

Après : les tabous en version lourde (manger le soir, le Coca zéro, le sucre, le jeûne, le
week-end, les médicaments) et [[profil/PROGRAMME-FONDAMENTAUX#Après le 19 octobre|la vidéo pour ta mère]].
La liste complète des vingt-quatre sujets est dans [[profil/PROGRAMME-FONDAMENTAUX#3. La liste, par longue|le programme]].

---

## La semaine type

Tout se tourne le dimanche. Tout sort la semaine d'après.

| Jour | Ce que tu fais | Ce qui sort |
|---|---|---|
| **dimanche** | tournage : la longue, les hooks et chutes des trois shorts, le b-roll, la photo de miniature · à 18 h, la longue tournée le dimanche d'avant | la longue de la semaine d'avant, sur YouTube |
| lundi, mardi | montage de la longue | |
| **mardi** | | short 1, Instagram |
| jeudi | inserts, miniature, description avec les sources | short 2 |
| vendredi | les trois shorts découpés du montage, leurs légendes | |
| **samedi** | programmation, lecture à voix haute du script suivant | short 3 |

Le trailer sort une fois, le lundi 21. Sur YouTube, les Shorts se publient après la longue,
avec elle en vidéo associée. La ligne « Le mécanisme entier, dix minutes : Mohamed Elmdimegh
sur YouTube » s'ajoute aux légendes Instagram le dimanche soir. Les heures réelles se notent
dans le [[profil/PLAN-SEMI-18-OCTOBRE#6. Le journal|journal]].

---

## 3. Le calendrier

Comme dans Notion : la grille du mois, et dans chaque case les pages du jour. Le dossier
`calendrier/` contient **une note par événement** : un tournage, une sortie, un short, une
semaine de montage. Chaque note porte sa date en propriété, dit ce qui se passe, et affiche
la page de la vidéo en entier. La grille et les listes sont dans [[Calendrier]], qui lit
`Calendrier.base` : la vue **Mois** pose chaque événement à sa date, cliquer ouvre sa note,
le nom de la vidéo dans la case ouvre la page de la vidéo, et glisser un événement change
sa date. Les vues **Tout**, **Tournages** et **Sorties** listent les mêmes notes en tableau.

La vue Mois demande le plugin **Calendar Bases** (voir § 9) ; sans lui, les tableaux
marchent déjà. Les notes quotidiennes restent sur ce dossier pour le journal : une date sans
note s'en crée une depuis le modèle [[modeles/Jour|Jour]], et elle apparaît dans la grille
comme les autres.

---

## 4. Les vidéos, une page chacune

Chaque page dit l'état, les dates, ce qu'il faut filmer, où sont le script, les shorts, la
feuille de plateau et la direction de montage.

![[Vidéos.base#Tableau]]

Les propriétés en tête de chaque page, type, quoi, état, tournage, sortie, sont la source de
ce tableau : change-les dans la page, le tableau suit. Le détail, les fichiers et la feuille
de plateau restent dans la page.

---

## 5. La méthode

La méthode vit dans les skills de Claude, `.claude/skills/`, qu'Obsidian ne montre pas.
Le dossier `methode/` en garde une copie de lecture ; si tu changes la méthode, change la
source, puis recopie.

| Note | Pour quoi |
|---|---|
| [[methode/Écrire un science-reel\|Écrire un science-reel]] | le format mesuré sur douze reels : les sept beats, les cinq règles, le turn, la légende, l'adaptation française et ses pièges, et les huit règles du long format |
| [[methode/Monter un reel Train Bloom dans CapCut\|Monter un reel dans CapCut]] | les pistes, la bascule musicale sur le deuxième hook, riser, whoosh, impact, les volumes exacts, les sous-titres |
| [[methode/Le pipeline vidéo HitMe\|Le pipeline HitMe]] | la recherche d'outliers, le teardown, le remix, le b-roll, la sortie CapCut |
| [[methode/Les hooks (Kallaway)\|Les hooks]] | la formule en trois temps, les quatre composantes alignées, les archétypes |
| [[methode/Le storytelling (Kallaway)\|Le storytelling]] | l'échelle, les boucles, le mais et le donc, les verrous d'attention |

Les règles maison qui priment sur tout : chaque phrase littéralement vraie ; chaque chiffre
à échelle humaine ; aucune unité de laboratoire ; on valide avant de corriger ; jamais
« coûte cher » pour des calories ; rien à la première personne qui ne soit pas vrai pour
toi. Elles sont dans [[profil/FONDAMENTAUX#6. Le ton et la signature|les fondamentaux, § 6]].

---

## 6. Le tournage et le montage

- **Le réglage**, fait une fois : [[profil/FONDAMENTAUX#9. Le tournage|les fondamentaux, § 9]]. Une seule caméra en 4K 16:9, toi centré, recadrage fixe 9:16 pour les shorts, micro-cravate, la lampe à gauche.
- **La feuille de plateau** de chaque tournage est dans la page de la vidéo. Celle de dimanche : [[video/calories-fondamentaux/TOURNAGE|TOURNAGE]].
- **Les rushes** vont sur `D:\videos\`, un dossier par vidéo, nommés `NN-bloc-prise.mp4`. Les sons dans `D:\editing_audio\`. Rien de tout ça n'entre dans le dépôt.
- **Le montage** se fait dans CapCut. La grammaire sonore et les volumes : [[methode/Monter un reel Train Bloom dans CapCut\|la méthode]]. Pour la longue : tête parlante à 70 % au moins, huit à douze inserts, les rendus existants de `meriter` en colonne, sous-titres entre 70 et 78 % de la hauteur.
- **Les inserts** : `SplitBar` existe (`video/deficit-calorique-fr/compositions/`), la carte 9-4-4 se rend une fois, le reste en cartes CapCut ou en photos.

---

## 7. Les outils

| Outil | Ce qu'il fait | Où |
|---|---|---|
| HitMe | recherche d'outliers YouTube, TikTok, Instagram ; teardown d'une vidéo en script ; projets ; b-roll ; sortie CapCut | `outils/hitme/` : l'app et le serveur MCP. En local seulement ; la base de données sur Neon |
| HyperFrames | les animations en HTML rendu en vidéo | `.agents/skills/hyperframes*` |
| Higgsfield | images, vidéos, décors ; jamais toi | par Claude |
| CapCut | le montage | installé |
| YouBud | ton calculateur de calories, le seul lien de la bio | **à confirmer** : où il est disponible |
| Ciqual | les calories des aliments, pour vérifier chaque chiffre avant de tourner | ciqual.anses.fr |

---

## 8. Ce qui est publié

- **YouTube** `@medmdim`, « Mohamed Elmdimegh » : le dépôt du long. [[Déficit calorique]] y est depuis le 27 août.
- **Instagram**, à ton nom : la maison du court et des stories. **À confirmer** : le compte existe-t-il, avec la bio en trois lignes et le lien YouBud ? Il doit exister avant le trailer, lundi 21.

---

## 9. Ce coffre Obsidian

- **Le coffre est le dépôt** : `C:\Users\melmdim\HitMe`. Le code vit dans `outils/`, exclu de l'affichage dans les réglages du coffre, comme les compositions HyperFrames rangées à côté de leurs vidéos. Les dossiers qui commencent par un point (`.claude`, `.agents`) ne s'affichent jamais dans Obsidian : c'est pour ça que `methode/` existe.
- **Les dossiers** : `profil/` le profil ; `video/` une page et des fichiers par vidéo ; `calendrier/` une note par événement et la base du calendrier ; `methode/` la méthode ; `modeles/` les modèles de notes ; `pieces-jointes/` ce que tu glisses dans une note ; `outils/` le code, invisible ici.
- **Le plugin Calendar Bases**, d'Edrick Leong : Réglages → Plugins communautaires → Parcourir → « Calendar Bases » → Installer → Activer. Il ajoute la vue Mois à Bases ; `Calendrier.base` est déjà réglé dessus, la semaine commençant le lundi. C'est le seul plugin ; rien d'autre à installer.
- **Git** : les notes sont versionnées comme le reste. Après une session d'écriture, un commit. L'état de fenêtre d'Obsidian (`.obsidian/workspace.json`) est ignoré.
- **Les liens** entre notes sont des liens Obsidian, `[[Nom de la note]]`. Un nom de vidéo suffit : les noms sont uniques dans le coffre.
