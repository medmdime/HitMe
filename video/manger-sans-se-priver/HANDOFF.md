# Handoff — « Ce n'est pas ta volonté »

Deux vidéos YouTube françaises de neuf minutes sur quoi manger quand on veut perdre du
poids. Le scénario est **écrit et vérifié** ; rien n'est encore tourné ni animé.

| | |
|---|---|
| Branche | `feat/scenarios-et-skills-video` |
| Document de production | `scenario.html` — publié en Artifact, se régénère depuis `scenario.json` |
| Statut | scripted — prêt à tourner |

---

## Les deux vidéos

**Vidéo 1 — « Pourquoi ça revient » · 9:08**

| | | |
|---|---|---|
| 0:00 | Ce n'est pas ta volonté | 160 personnes, 4 régimes, 1 an, un kilo d'écart |
| 1:48 | Le levier que tu ne mâches jamais | 9 cal/g dans l'huile contre 4 dans le sucre |
| 4:03 | Ton estomac sent le volume | il ne compte pas, il réagit quand ça s'étire |
| 6:18 | Ce n'est pas la place, c'est le signal | la chirurgie ne marche pas en rétrécissant |

**Vidéo 2 — « Quoi mettre dans l'assiette » · 9:30**

| | | |
|---|---|---|
| 0:00 | Le poids de l'assiette | 424 calories d'écart à poids d'assiette identique |
| 2:47 | Le levier fantôme | 13 rétractations, et la petite fourchette fait manger plus |
| 5:22 | L'aliment que tu as rayé de ta liste | l'interdit ne l'efface pas, il le rend visible |
| 7:36 | On ne vit qu'une fois | la chute |

**281 plans · 69 PMID vérifiés · 55 compositions à construire · 8 shorts planifiés.**

---

## Les fichiers

```
video/manger-sans-se-priver/
  scenario.json        LA SOURCE DE VÉRITÉ. Tout le reste en dérive.
  scenario.html        document de production complet (généré, ne pas éditer)
  SCRIPT-video-1.md    bracket + voix seule + hooks/chutes de shorts à tourner
  SCRIPT-video-2.md    idem
  script-compact.txt   narration nue, pour le prompteur
  tools/               les deux générateurs + le mode d'emploi
```

`scenario.json` contient : `videos`, `chapitres` (avec `plans`), `architecture`
(mécanismes, turns, `risques`), `production` (compositions, b-roll, articles),
`shorts`, `shorts_par_video`, `sources`.

**Pour régénérer le document** après toute modification du JSON :

```bash
python tools/build_1_scenario.py
python tools/build_2_annexes.py
```

Les deux, dans cet ordre. Aucune dépendance, chemins relatifs, ça marche depuis n'importe
quel clone. `tools/README.md` donne en plus une passe de contrôle prête à coller qui vérifie
les règles de rédaction — métaphore confinée au chapitre 1, aucun jargon dans la bouche,
aucun plan indicible, aucun chapitre revenu sans accents.

**Ne jamais éditer `scenario.html` à la main** : il est écrasé à chaque génération.

---

## Ce qui reste à faire

**Tournage.** Environ 34 % de chaque vidéo est face caméra. Les répliques exactes sont dans
`SCRIPT-video-*.md`. Ajouter les **16 hooks et chutes de shorts** (annexe de chaque script) :
ils se tournent le même jour, ce sont quelques secondes chacun.

**Animation.** 55 compositions HyperFrames, une par bloc, de 2 à 15 s. Le kit visuel et le
composant `SplitBar` existent déjà dans `video/deficit-calorique-fr/compositions/components/`
et se réutilisent tels quels. Ne jamais faire une seule timeline de neuf minutes.

**B-roll.** 6 plans à filmer soi-même, 5 à générer (prompts Higgsfield prêts à coller, en
anglais, dans `scenario.html` § Production), 14 articles à afficher avec la phrase exacte à
encadrer.

**Montage.** Suivre le skill `montage-capcut`. Les volumes de ce skill sont absolus et se
recopient ; ses timecodes sont des exemples et ne se recopient jamais.

**Six références sans PMID fiable** restent à compléter avant mise en ligne. Elles sont
signalées comme telles dans les descriptions plutôt qu'inventées. L'étude sur la fourchette
n'en aura jamais : le *Journal of Consumer Research* n'est pas indexé dans PubMed.

---

## Ce qu'il ne faut pas défaire

Ces décisions ont coûté plusieurs réécritures. Les 15 garde-fous complets sont dans
`scenario.html` § Garde-fous ; voici ceux qui se réintroduisent le plus facilement au montage.

**La métaphore de la baignoire vit 17 secondes.** De 0:21 à 0:38 au chapitre 1, refermée à
voix haute par « on peut oublier la baignoire ». Plus un seul robinet ensuite. Deux versions
antérieures ont été rejetées : les comptes bancaires (trop de concepts avant le propos) et
« changer la couleur de l'eau » (ne correspond à rien de vécu).

**Aucune statistique sans échelle humaine.** Ni corrélation, ni valeur p, ni taille d'effet
prononcée. Les kilos perdus et le nombre de gens restés disent la même chose et se tiennent à
l'oreille. Si une de ces valeurs revient dans la bouche au montage, le passage redevient
incompréhensible.

**Aucune unité de laboratoire.** Deux grands verres d'eau, pas 400 millilitres.

**On ne dit jamais au spectateur ce qu'il conclut.** Sa pensée s'énonce à sa place — « alors
on se dit : … » — et s'affiche entre guillemets à l'écran, pour qu'aucune capture isolée ne
se lise comme l'affirmation de la vidéo.

**La chirurgie bariatrique retourne l'analogie, elle ne la valide pas.** C'est le point le
plus important scientifiquement : le volume d'estomac restant ne prédit pas la perte de poids,
l'estomac se vide deux fois plus vite après l'opération, et l'anneau (restriction pure) donne
la moitié du bypass (hormonal). Couper ce retournement enseignerait un mécanisme faux.

**Wansink : 13 rétractations, dont « Super Bowls » par le JAMA.** Mais le bol sans fond n'est
**pas** rétracté — il a été répliqué en 2024 avec un effet de moitié. Une erreur de statut ici
détruit la crédibilité du chapitre 6 entier.

---

## Les skills du projet

`.claude/skills/`, tous versionnés.

**`science-reel`** — le format, mesuré sur 12 reels. Contient maintenant une section
**« Scaling to long form »** : les huit règles découvertes en portant le format à neuf
minutes. C'est la partie la plus utile pour reprendre l'écriture.

**`montage-capcut`** — le montage, relevé sur un projet fini.

**`video`** — le pipeline global : recherche, teardown, remix, production, montage.

---

## Outillage

**MCP HitMe** — projet `manger-sans-se-priver`, statut `scripted`. `library_list` avant
d'analyser quoi que ce soit : le teardown existe peut-être déjà.

**HyperFrames** — arrêter le serveur de preview avant toute édition scriptée du HTML : il
réécrit les fichiers sur disque en y injectant des `data-hf-id`.

**CapCut MCP** — `save_draft` produit des chemins vides sans `draft_folder`. `speed` n'est pas
appliqué à l'emprise timeline : ré-étalonner en amont avec ffmpeg. Pour relire un montage
terminé, ouvrir `draft_content.json`, pas `draft_info.json`.

**Transcription** — `transcribe_clip` est un résumeur de teardown, **pas un ASR**. Pour une
vraie transcription, faster-whisper `large-v3`.

**Prompts de subagents en français** — les écrire **avec les accents**. Un prompt en ASCII
fait revenir 100 % du texte produit sans accents : c'est arrivé sur 23 752 caractères
d'architecture et sur un chapitre entier. Vérifier après coup : un français normal compte
environ 4 % de caractères accentués, un champ à 0 % signale le problème.
