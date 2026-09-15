# HitMe : le coffre

Ce dépôt est d'abord de la **documentation** : la marque personnelle de Mohamed autour des
calories, sans régime et sans jugement. Il s'ouvre tel quel comme un coffre Obsidian, à la
racine. Le code n'est qu'un outil, rangé dans `outils/`.

**Commence par [HUB.md](HUB.md).** Tout part de là.

| Dossier | Ce qu'il contient |
|---|---|
| `HUB.md` | la porte d'entrée : le profil, la direction, la semaine type, le calendrier, les vidéos, la méthode, les outils |
| `profil/` | qui je suis, ce que je défends, à qui je parle : les fondamentaux, le programme, les stories, le plan |
| `calendrier/` | une note par jour où il se passe quelque chose : ce qui se tourne, ce qui sort |
| `video/` | un dossier par vidéo : sa page, le script, les shorts, la feuille de plateau, le montage, les rendus |
| `methode/` | la méthode en copie de lecture ; la source est `.claude/skills/` |
| `modeles/` | les modèles de notes Obsidian |
| `outils/` | le code : [`hitme/`](outils/hitme/README.md), l'app Next.js et le serveur MCP de recherche et de teardown. **En local seulement, la base de données sur Neon** |

Les skills de Claude (`.claude/skills/`, `.agents/skills/`) et la config du coffre
(`.obsidian/`) restent à la racine parce que Claude Code et Obsidian les cherchent là.

## Lancer les outils

Tout le code se lance depuis `outils/hitme` :

```bash
cd outils/hitme && bun install && bun run dev
```

L'app répond sur http://localhost:3000. `bun run mcp:smoke` démarre le serveur MCP et
liste ses outils. Claude Code branche ce serveur depuis `.mcp.json` à la racine ; le
navigateur intégré lance « hitme-dev » depuis `.claude/launch.json`. Les clés API vivent
dans `outils/hitme/.env.local`, jamais dans le dépôt.
