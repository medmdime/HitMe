# outils/kallaway-edit — le Kallaway edit

Monte une vidéo courte face caméra de Mohamed façon Kallaway, entièrement dans HyperFrames : coupes à
chaque souffle, lèvres recalées, alternance A (lui en grand) / B (animation + lui détouré devant une
carte), glissés, woosh, risers et hoops, musique, sous-titres, rendu accéléré ×1,08.

**La méthode complète, les règles de Mohamed et les pièges** : le skill
[`.claude/skills/kallaway-edit/SKILL.md`](../../.claude/skills/kallaway-edit/SKILL.md) (copie de
lecture : `methode/Le Kallaway edit.md`). Ce fichier-ci n'est que l'aide-mémoire des commandes.

**L'exemple réel** : `video/assiette-pas-le-dessert/` (fiche `kallaway.toml` = `gabarit.toml`).
Relancer l'outil dessus refait exactement la vidéo livrée le 26 septembre 2026.

## Les commandes

```bash
K="python outils/kallaway-edit/ke.py video/<nom>"

python outils/kallaway-edit/ke.py video/<nom> preparer   # 0 · copier le kit et la fiche d'exemple
$K transcrire                    # 1 · Whisper medium (coupes) + large-v3 (sous-titres)
$K levres cadre H1 1.0           # 2 · relever la bouche de chaque prise
$K levres candidats              #     les mots en p, b, m
$K levres planche H1 2.20        #     la planche des lèvres + l'enveloppe du son → decalage
$K maitre                        # 3 · piste maître + bande B + carte.json   (--carte : la carte seule)
$K verifier coupes               #     aucune parole enlevée
$K levres verifier "H1:pas"      #     les lèvres s'ouvrent sur +0.000
$K plans                         # 4 · les coupes A/B et les repères des animations
                                 # 5 · les animations (skill inserts-youbud), calées sur les repères
$K detourer                      # 6 · lui détouré sur la bande B (~3 min)
$K montage                       # 7 · index.html, sous-titres incrustés, sous-titres.srt
$K check                         #     0 erreur, 0 avertissement
$K rendre brouillon              # 8 · rendu -q draft accéléré, puis sonie et crêtes
$K verifier planche renders/<nom>-brouillon.mp4
$K rendre final                  #     quand Mohamed valide : -q high
$K rendre test 1.1               #     comparer une autre vitesse
$K verifier synchro renders/<fichier>.mp4   # le rendu colle-t-il à la piste maître ?
$K verifier pic assets/sfx/<son>            # où culmine un son (à ajouter à PICS dans montage.py)
```

## Ce qu'on écrit à la main

1. `video/<nom>/kallaway.toml` — partir de `gabarit.toml`, chaque ligne y est commentée.
2. `video/<nom>/compositions/I*.html` — une animation 1080 × 960 par plan B.

Tout le reste est généré : ne jamais retoucher `index.html`, `compositions/sous-titres.html` ni
`sous-titres.srt` à la main, changer la fiche et relancer `montage`.

## Les modules

| Fichier | Étape | Lit | Écrit |
|---|---|---|---|
| `preparer.py` | 0 | l'assiette | le kit, `kallaway.toml`, `package.json`, une ligne de `.gitignore` |
| `transcrire.py` | 1 | les prises (`D:/videos`) | `montage/mots-medium.json`, `mots-large-v3.json` |
| `levres.py` | 2 | les prises, le maître | `montage/cache/levres/*.png` |
| `maitre.py` | 3 | prises, `mots-medium` | `assets/rushes/voix-montage.mp4`, `visage-b.mp4`, `montage/carte.json` |
| `plans.py` | 4 | `carte.json` | `montage/plans.json` |
| `ke.py detourer` | 6 | `visage-b.mp4` | `assets/rushes/visage-b-detoure.webm` |
| `montage.py` + `sous_titres.py` | 7 | fiche, carte, plans, `mots-large-v3` | `index.html`, `compositions/sous-titres.html`, `sous-titres.srt` |
| `rendre.py` | 8 | le projet | `renders/<nom>[-brouillon].mp4` |
| `verifier.py` | — | tout | des constats |
| `commun.py` | — | la fiche | références de mots (« H2:sucre », « TM:gras#1 », « GE@6 », « plan:turn », « fin ») |

Prérequis : Python ≥ 3.11 (`faster-whisper`, `numpy`, `Pillow`), ffmpeg, `npx hyperframes@0.8.21`,
Whisper large-v3 et `u2net_human_seg` en cache (déjà là sur la machine de Mohamed).
