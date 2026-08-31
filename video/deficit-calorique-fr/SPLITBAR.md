# SplitBar — spécification

Le device n°1 du format science-reel. Une barre qui monte, se découpe en segments
étiquetés, en isole un, le sort, le fait grossir.

**16 des 18 inserts de cette vidéo sont ce composant** avec des props différentes. C'est
là qu'il faut mettre le soin : une fois `SplitBar` solide, le coût marginal d'un insert
tombe à l'écriture des props.

Fichiers : `compositions/components/splitbar.js` + les règles `.sb-*` de `kit.css`.

---

## Montage

```js
const bar = SplitBar.mount("#bars", {
  layout: "stack",          // "stack" | "group"
  width: 240,               // largeur de la barre (px)
  height: 960,              // hauteur totale = 100 %
  gap: 16,                  // écart entre segments après split()
  labelGap: 60,             // distance barre → étiquette (layout stack)
  segments: [
    { key: "bmr",   label: "MÉTABOLISME DE BASE", value: "70 %", pct: 70, color: "var(--bmr)" },
    { key: "neat",  label: "EN DEHORS DU SPORT",  value: "15 %", pct: 15, color: "var(--neat)" },
    { key: "tef",   label: "DIGESTION",           value: "10 %", pct: 10, color: "var(--tef)" },
    { key: "sport", label: "SPORT",               value: "5 %",  pct: 5,  color: "var(--sport)" },
  ],
})
```

**`stack`** — une seule barre verticale, segments empilés du bas vers le haut dans
l'ordre du tableau, étiquettes à droite. C'est la découpe d'un tout en parts.

**`group`** — plusieurs barres côte à côte, étiquettes dessous. C'est la comparaison
de deux grandeurs indépendantes.

Chaque segment est exposé : `bar.nodes[key] = { seg, fill, label, mark }`.
Le calque d'étiquettes : `bar.layer`.

---

## Méthodes

Toutes suivent le même contrat : **elles écrivent dans une timeline que tu fournis, à
une position que tu donnes, et renvoient la position de fin.** Les appels se chaînent
sans compter les secondes à la main.

```js
const tl = gsap.timeline({ paused: true })
let t = bar.grow(tl, 0)          // t vaut maintenant la fin de l'animation
t = bar.labels(tl, t, ["bmr"])   // on enchaîne
```

| Méthode | Effet |
|---|---|
| `grow(tl, at, {duration, stagger})` | les segments montent de 0 à leur taille |
| `split(tl, at, {duration, gap})` | les segments s'écartent — la barre pleine devient découpée |
| `focus(tl, at, key, {dim, duration})` | isole un segment, atténue les autres |
| `clearFocus(tl, at, {duration})` | tout revient à pleine opacité |
| `labels(tl, at, keys, {stagger, from})` | fait apparaître des étiquettes, l'une après l'autre |
| `mark(tl, at, key, "x"\|"check")` | pose une croix ou une coche au centre d'un segment |
| `resize(tl, at, key, pct)` | change une part ; les autres se réajustent au prorata |
| `extract(tl, at, key, {x, y, scale, moveLabel})` | sort un segment de la barre |
| `bracket(tl, at, keys, label)` | accolade verticale sur un groupe contigu |

---

## Les trois règles non négociables

**1. Aucune transition CSS.** Tout passe par GSAP. Le rendu HyperFrames capture image
par image en déplaçant la tête de lecture : une transition CSS n'est pas *seekable* et
produit des frames incohérentes. La timeline doit être `paused: true` et enregistrée
sur `window.__timelines[compositionId]`.

**2. Aucune source de non-déterminisme.** Pas de `Date.now()`, pas de `Math.random()`,
pas de `fetch`. Deux rendus du même fichier doivent donner deux fichiers identiques.

**3. Les étiquettes ne vivent jamais dans le segment.** Elles sont dans un calque à part
(`.sb-label-layer`), positionné par calcul à partir des pourcentages. Deux raisons :
un texte qui déborde de son aplat coloré fait échouer le poste Layout de
`hyperframes check`, et un `bottom: 100%` sur un segment dont la hauteur est animée
place l'étiquette au mauvais endroit dès que la barre bouge.

---

## Pièges rencontrés en construisant cette vidéo

Ils coûtent tous une heure si on ne les connaît pas.

**Les `url()` d'une feuille de style ne se résolvent pas comme les chemins d'un
document.** Les HTML sont servis avec la racine du projet comme base, mais une `url()`
dans un CSS se résout relativement au CSS. Depuis `compositions/components/`,
`assets/fonts/…` partait chercher `compositions/components/assets/fonts/…` → 404 au
rendu, et `../../assets/` fait échouer le lint. **La `@font-face` est donc déclarée dans
le `<style>` de chaque composition**, seule forme que les deux résolveurs lisent pareil.

**Les sous-compositions sont inlinées dans le MÊME document.** Trois fichiers qui
déclarent chacun `id="bars"` et `const tl` produisent : (a) une `SyntaxError` sur le
deuxième `const tl`, (b) un `querySelector("#bars")` qui renvoie la barre de la
*première* composition. Résultat : la 02 montait sa barre sur la 01, et le reel
composite affichait trois graphiques superposés. **Chaque composition préfixe donc tous
ses ids** (`d1-`, `d2-`, `d3-`) **et enferme son script dans une IIFE.**
`data-composition-id` échappe au préfixe : c'est la clé de `window.__timelines`.

**Le serveur de preview réécrit les fichiers.** `hyperframes preview --background`
injecte des `data-hf-id="…"` dans le HTML sur disque. Les remplacements textuels lancés
pendant que la preview tourne échouent silencieusement. **Arrêter la preview
(`preview --stop`) avant toute édition scriptée.**

**Le poste Contrast est strict et il a raison.** Les couleurs de segment sont réglées
pour un aplat de 240 px de large, pas pour du texte de 30 px. D'où les variantes
`--neat-ink` / `--tef-ink`, et un pourcentage toujours en encre.

---

## Vérifier

```bash
npm run check      # lint + runtime + layout + motion + contraste
npm run render:01  # une composition seule
npm run render     # le reel de relecture
```

`check` **ne prend pas de `-c`** : il vérifie toujours le projet entier depuis
`index.html`. Une composition ne peut donc pas être validée isolément — si le reel
composite est cassé, `check` échoue même quand les trois compositions sont bonnes prises
séparément.

État actuel : **0 erreur, 0 avertissement, 22/22 en contraste.**

---

## Les sept autres devices

`SplitBar` couvre le premier des huit devices du format. Les sept autres restent à
écrire quand une vidéo les demandera :

| Device | Statut |
|---|---|
| 1. La barre qui se découpe | ✅ `SplitBar` |
| 2. La liste qui se remplit | partiel — `.cl` dans `kit.css`, pas encore un composant |
| 3. Croix / coche | ✅ `SplitBar.mark()` |
| 4. Population de silhouettes | à écrire |
| 5. La frise chronologique | à écrire |
| 6. Le classement | à écrire |
| 7. Avant / après à échelle constante | partiel — fait à la main dans la 03 |
| 8. La grille absurde | à écrire |
