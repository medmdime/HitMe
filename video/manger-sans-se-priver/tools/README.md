# Régénérer le document de production

`scenario.json` est **la source de vérité**. `scenario.html` en dérive entièrement et ne se
modifie jamais à la main : toute édition manuelle sera écrasée à la prochaine génération.

```bash
python tools/build_1_scenario.py
python tools/build_2_annexes.py
```

Les deux, dans cet ordre. Le premier écrit le fichier, le second y ajoute la suite — lancer
seulement le second duplique les annexes, lancer seulement le premier tronque le document.

Les chemins sont relatifs au dossier parent de `tools/`, donc ça marche depuis n'importe quel
clone, sans rien configurer. Aucune dépendance : Python 3 seul suffit.

## Ce que chacun produit

| | |
|---|---|
| `build_1_scenario.py` | bandeau de chiffres, thèse, les 8 chapitres groupés par vidéo, plan par plan |
| `build_2_annexes.py` | production, formats courts, garde-fous, sources, paratextes YouTube |

## Vérifier une génération

Le document doit rester équilibré en balisage et contenir ce qu'on attend :

```bash
python -c "
import io,re
h=io.open('scenario.html',encoding='utf-8').read()
print('vidéos    :',len(re.findall(r'id=\"v\d\"',h)))
print('chapitres :',len(re.findall(r'class=\"chap\" id=',h)))
print('plans     :',len(re.findall(r'class=\"row',h)))
print('PMID      :',len(re.findall(r'pubmed.ncbi',h)))
o,c=h.count('<div'),h.count('</div>')
print('balisage  :','équilibré' if o==c else 'DÉSÉQUILIBRÉ %d/%d'%(o,c))
"
```

Attendu : 2 vidéos, 8 chapitres, 313 lignes, 69 PMID, balisage équilibré.

## Les contrôles de rédaction

Ces règles ont coûté plusieurs réécritures et se réintroduisent facilement. Après toute
modification de `scenario.json`, relancer cette passe :

```bash
python -c "
import json,io,re
d=json.load(io.open('scenario.json',encoding='utf-8'))
def nw(t): return len([x for x in re.findall(r\"[0-9A-Za-zÀ-ÿ'-]+\",t or '') if x.strip(\"'-\")])
# la métaphore ne doit vivre qu'au chapitre 1
hors=[(c['n'],p['t']) for c in d['chapitres'] if c['n']!=1 for p in c['plans']
      for m in ['robinet','baignoire'] if m in (p['narration'] or '').lower()]
print('métaphore hors du ch1 :',hors or 'aucune')
# jamais de jargon ni de statistique nue dans la bouche
for m in ['millilitre','corrélation','viens de conclure','p égale']:
    n=sum(1 for c in d['chapitres'] for p in c['plans'] if m in (p['narration'] or '').lower())
    print('%-20s %d'%(m,n))
# aucun plan indicible
lents=[(c['n'],p['t'],round(nw(p['narration'])/(p['duree_s']/60)))
       for c in d['chapitres'] for p in c['plans']
       if nw(p['narration']) and nw(p['narration'])/(p['duree_s']/60)>190]
print('plans > 190 mots/min :',lents or 'aucun')
# les accents : un français normal en compte ~4 %, un chapitre à 0 % signale un problème
ACC=set('àâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇœ')
for c in d['chapitres']:
    t=' '.join(p['narration'] or '' for p in c['plans'])
    r=100*sum(1 for ch in t if ch in ACC)/max(1,len(t))
    if r<1.2: print('!! ch%d : %.1f %% d accents — suspect'%(c['n'],r))
"
```

Tout doit être à zéro, sauf la métaphore au chapitre 1 où elle est légitime — dix-sept
secondes, refermée à voix haute.
