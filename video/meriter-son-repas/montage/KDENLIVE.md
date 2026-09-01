# Kdenlive — le strict nécessaire pour finir cette vidéo

Pas un manuel. Uniquement les gestes dont **ce montage-ci** a besoin, dans l'ordre.

## Lancer

```bash
flatpak run org.kde.kdenlive ~/Documents/hitMe/video/meriter-son-repas/montage/meriter-son-repas.kdenlive
```

> **Tu as deux Kdenlive installés.** `kdenlive` lance la 25.12.3 des dépôts Ubuntu ;
> `flatpak run org.kde.kdenlive` lance la **26.08.0**, celle qu'on configure ici.
> Utilise toujours la seconde — les extensions IA s'installent par version, ce qui
> est réglé dans l'une ne l'est pas dans l'autre.

---

## Les six gestes qui suffisent

| Geste | Comment |
|---|---|
| Lire / s'arrêter | **Espace** |
| Se déplacer image par image | **←** et **→** |
| Zoomer sur la timeline | **Ctrl + molette** |
| Couper un clip là où est la tête de lecture | **Maj + R** |
| Sélectionner un clip | clic ; le déplacer : glisser |
| Annuler | **Ctrl + Z** (illimité) |

Tout le reste se fait dans deux panneaux : **Effets** (à droite quand un clip est
sélectionné) et **Rendu** (à la fin).

---

## 1. Poser les deux plans manquants

Les trous sont déjà à leur place dans la timeline, avec un repère.
**Menu Timeline → Aller au repère suivant** pour sauter de l'un à l'autre.

1. Glisse ta nouvelle prise depuis le chutier vers le trou, sur la piste `incrustation`
2. Tire ses bords pour l'ajuster au trou
3. Son audio : glisse la même prise sur `A1`, au même endroit

Les répliques exactes sont dans `PROMPTEUR.md`.

---

## 2. Recadrer tes prises face caméra

Tes prises sont en 1280×720 paysage, le projet est en 1080×1920. Elles arrivent
donc avec des bandes noires — c'est voulu, tu recadres toi-même.

Sur chaque clip face caméra :

1. Sélectionne le clip
2. Panneau **Effets** → cherche **Transformer** (ou *Position et zoom*)
3. Double-clique pour l'ajouter
4. Dans le moniteur, tire les poignées jusqu'à te cadrer

**Point de départ qui marche** : une fenêtre de **405×720 prise à x = 330** te centre,
la lampe à gauche. Tu peux taper ces valeurs au clavier plutôt qu'à la souris.

Fais-le sur un clip, puis **clic droit → Copier**, et sur les autres
**clic droit → Coller les effets**. Trois clics au lieu de trois réglages.

---

## 3. Les sous-titres

**Tu as déjà les miens**, relus et corrigés : `montage/sous-titres.srt`.
Menu **Sous-titres → Importer un fichier de sous-titres**.

**Pour les regénérer toi-même** : menu **Sous-titres → Reconnaissance vocale**.
La 26.08 utilise ses propres scripts Python (pas le `whisper-cli` que tu as installé
pour Shotcut — le bac à sable Flatpak ne le voit pas). Elle te proposera d'installer
ce qu'il faut au premier lancement.

**Prends le modèle `medium`**, pas `base`. C'est ce qui sépare des sous-titres
publiables de sous-titres à corriger un par un.

**Le style** : sélectionne la piste de sous-titres, puis dans ses propriétés —
police **Archivo SemiBold** (celle de tes animations, je l'ai installée), contour noir
épais, position **tout en bas**.

---

## 4. Les trois textes à l'écran

Ce ne sont pas des sous-titres, ils se font autrement : **Projet → Ajouter un clip
titre**, puis tu le poses sur une piste vidéo au-dessus.

| Quand | Texte |
|---|---|
| 0:03, sur le lit | `EN DORMANT` |
| 0:07, sur le pivot | `« J'AURAIS PAS DÛ »` — garde les guillemets, c'est sa pensée |
| 1:28, sur la chute | `TA JOURNÉE, ET TA NUIT` |

Un seul mot en couleur par phrase : jaune pour le terme clé, vert pour ce qui marche,
rouge pour le mythe. Jamais deux couleurs dans la même phrase.

---

## 5. Remonter le son de tes retours

Mesuré : ton retour 1 sort à **−30,3 dB** quand la section C est à **−20,7**.
Presque 10 dB d'écart — ta tête sonnera lointaine juste avant que l'animation arrive.

Sur les trois clips face caméra de `A1` : **Effets** → **Normaliser (deux passes)**.

---

## 6. Exporter

**Projet → Rendu** (ou **Ctrl + Entrée**).

| | |
|---|---|
| Préréglage | **MP4-H264/AAC** |
| Résolution | 1080×1920 — déjà réglée par le projet |
| Sous-titres | coche **Incruster** — sinon ils partent en piste séparée, invisible sur Instagram |

---

## Le détourage IA, si tu en as besoin un jour

**Configuration → Configurer Kdenlive → Extensions** → *Object Segmentation (SAM2)*.

Kdenlive télécharge PyTorch et SAM2 (3 à 5 Go) et se sert de ta RTX 5060. SAM2 est
un modèle **vidéo** : tu cliques sur toi dans le moniteur, il te suit sur tout le plan.
C'est plus précis que le détourage image par image, qui fait frémir les contours.

Tu n'en as pas besoin pour cette vidéo — le format te veut plein cadre.

---

## Ce qui ne doit pas bouger

Trois choses ont coûté des réécritures. Elles sont détaillées dans `MONTAGE.md` :

1. **« Sur une journée entière »** au plan 0:37 — sans ces mots, la phrase est fausse
2. **Le badge NEAT à 300-500 cal/jour**, jamais le +1000-2000 de la référence anglaise
3. **Un seul scratch de vinyle**, sur le turn, et nulle part ailleurs
