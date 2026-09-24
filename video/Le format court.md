# Le format court

**Validé par Mohamed le 24 septembre** (« c'est exactement ce format que je kiffe »), tiré de [[Ton week-end annule ta semaine]], la vidéo qui a percé. Chaque vidéo courte le suit : la version courte de l'assiette, les réponses aux commentaires, et les suivantes.

## La structure

| | Ce que c'est | Durée |
|---|---|---|
| **Le hook** | une scène de la semaine de la personne (un jour, un geste, un chiffre), puis la réponse, dite en mots simples ; chaque phrase répond à la précédente ; « Voici pourquoi. » Voir [[Idées · ce qui annule ton déficit#0. Le scénario de la semaine\|le scénario de la semaine]] | 7 à 12 s |
| **Un, deux, trois** | trois raisons numérotées, une idée chacune, un chiffre dit en unités qu'on connaît | 7 à 9 s chacune |
| **La solution** | un geste, ce soir | 5 à 8 s |
| **La chute** | chaleureuse ; « Enregistre-la » si ça sert | 2 à 3 s |
| **L'appel** | « Moi, c'est Mohamed : je t'explique la nutrition, sans régime. Abonne-toi pour la suite. » | 4 s |

Entre 40 et 50 secondes au total. Toi, face caméra, sur tout le texte : tu regardes l'objectif à chaque phrase, et c'est le montage qui fait le reste.

## Les trois cadres

Le montage alterne trois cadres. **Un changement toutes les deux à trois secondes**, jamais plus de quatre secondes sur le même plan.

| Cadre | À l'image | Quand |
|---|---|---|
| **A · TOI** | toi, plein cadre, plan poitrine ; punch-in à 115 % une phrase sur deux | le hook, chaque « Un / Deux / Trois », les phrases qui piquent, la chute, l'appel |
| **B · PARTAGÉ** | en haut, le visuel qui explique ; en bas, toi qui continues de parler à l'objectif | toute explication : un chiffre, un mécanisme, une étude |
| **C · VISUEL** | un plan plein cadre, sans toi, 0,4 à 1,5 s | les listes (« l'huile, le beurre, les sauces ») et les images qui claquent |

**Le cadre B, au pixel près** (1080 × 1920) :

- **La zone du haut, 1080 × 960**, de y = 0 à 960 : le visuel. TikTok et Instagram couvrent le haut de l'écran : rien d'important au-dessus de y = 230. Les inserts du cadre B se composent donc **en 1080 × 960**, avec leur contenu utile entre y = 230 et y = 940.
- **La zone du bas**, de y = 960 à 1920 : toi, recadré depuis la même prise. Les yeux vers y = 1180, le menton vers y = 1450. En dessous de y = 1536, l'interface de l'appli recouvre tout : c'est ton t-shirt, rien d'autre.
- **Pas de trait entre les deux zones** : la DA de YouBud n'a aucune bordure. Le fond des inserts (`--bg`, #f7f7f4) fait la séparation.
- **Les sous-titres** passent juste sous la couture, vers y = 1000, au-dessus de ta tête.

## Au tournage

- **Un seul plan, cadré un peu large** : plan poitrine avec de l'air au-dessus de la tête. La caméra filme en 4K 16:9 : il y a de quoi recadrer ton visage pour le cadre B sans perdre en netteté.
- **Tu regardes l'objectif à chaque phrase**, même pendant les explications : en cadre B, c'est toi en bas qui tiens l'attention pendant que le visuel explique.
- Rien ne change entre les vidéos courtes d'une même session : même lumière, même t-shirt, même micro.

## Le son et le texte

- **Les sous-titres mot par mot**, blancs, un mot en jaune par phrase, comme sur le week-end.
- **Les chiffres « 1 », « 2 », « 3 »** en très gros en haut du cadre, un pop à chaque fois.
- **Un whoosh à 0,35 sur chaque changement de cadre.**
- **La musique** : un fond léger dès la première seconde, très bas sous la voix. Pas de scratch : la vidéo est trop courte pour un turn.
- **L'appel** : ton prénom en bas du cadre une seconde, puis un bouton « Abonne-toi » en pop sur « abonne-toi ».

## Ce qui fabrique les visuels

| Source | Quoi | Règle |
|---|---|---|
| **Inserts HyperFrames** | les explications du cadre B : les chiffres, le ventre, l'étude | la DA de YouBud (skill `inserts-youbud`) ; en 1080 × 960 pour le cadre B ; des mots, jamais des phrases |
| **B-roll généré** | les plans du cadre C : l'huile qui coule, un dessert, un pot de pâte à tartiner | une image FLUX.2 pro validée, puis Kling 3.0 en 5 s ; jamais toi, jamais un visage, jamais une marque, jamais de texte dans l'image |
| **Réel** | toi ; tes captures d'écran (une vidéo, un commentaire) | rien de généré à ta place |

[[HUB]] · [[Idées · ce qui annule ton déficit]]
