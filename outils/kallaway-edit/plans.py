"""Étape 4 · les plans : où tombe chaque coupe A/B dans la piste montée.

Un plan se déclare dans kallaway.toml par son PREMIER mot ([[plans]] de = "PRISE:mot") ; il finit là
où commence le suivant. La coupe entre deux plans tombe au début du morceau qui sépare le dernier mot
de l'un et le premier mot de l'autre (une coupe de souffle existe presque toujours là), sinon au
milieu du blanc.

Sortie : montage/plans.json, et à l'écran, pour chaque plan B, les mots avec leur temps « repère » :
le temps du mot dans le plan + [transition] avance_anim (0,15 s). C'est exactement le temps à écrire
dans la timeline GSAP de l'animation de ce plan, parce que l'hôte de l'animation démarre 0,15 s avant
la coupe (elle est déjà là pendant le glissé). Sur l'assiette, chaque animation a été recalée ainsi
sur la prise réelle, mot par mot (« Mardi » à 0,24, « bonbons » à 1,0…).

Règles de découpage, validées par Mohamed :
  - A et B alternent : A = lui en grand, pour le hook, les phrases qui piquent, la relance, la chute,
    l'appel ; B = l'animation en haut et lui détouré en bas, pour toute explication ;
  - ne jamais quitter une animation sur son dernier mot : le chiffre final reste au moins 0,5 s. Sur
    l'assiette, le glissé partait sur « neuf » ; le 9 reste maintenant pendant « Donc, pour les mêmes
    calories », et le petit plan A qui suivait (moins d'une seconde) a été supprimé : deux plans B se
    suivent, seule l'animation du haut glisse (B → B), la carte du visage ne bouge pas ;
  - un plan A de moins d'une seconde ne vaut pas la peine : fusionner avec le voisin.
"""
import sys
from commun import Video


def main(v, args):
    c = v.carte()
    mots = c["mots"]
    ordre = [(w["f"], w["i"]) for w in mots]           # l'ordre du texte, toutes prises confondues
    morceaux = c["morceaux"]
    cfg = v.cfg["plans"]
    av = v.cfg["transition"]["avance_anim"]

    def coupe(dernier, premier):
        for m in morceaux:
            if dernier["e"] - 0.001 <= m["t"] <= premier["s"] + 0.001 and m["t"] > 0:
                return m["t"]
        return round((dernier["e"] + premier["s"]) / 2, 3)

    premiers = [v.mot(p["de"]) for p in cfg]
    bornes = [0.0]
    for k in range(1, len(cfg)):
        j = ordre.index(premiers[k])
        premier, dernier = mots[j], mots[j - 1]
        bornes.append(coupe(dernier, premier))
    bornes.append(c["duree"])
    ids = set()
    sortie = []
    for k, p in enumerate(cfg):
        assert p["cadre"] in ("A", "B"), p
        assert p["id"] not in ids, f"id de plan en double : {p['id']}"
        ids.add(p["id"])
        d, e = bornes[k], bornes[k + 1]
        assert e > d, f"le plan {p['id']} est vide : vérifier l'ordre des « de »"
        j0 = ordre.index(premiers[k])
        j1 = ordre.index(premiers[k + 1]) if k + 1 < len(cfg) else len(mots)
        ws = mots[j0:j1]
        sortie.append({"id": p["id"], "k": k + 1, "cadre": p["cadre"], "anim": p.get("anim"), "debut": d, "fin": e,
                       "mots": [{"w": w["w"], "t": round(w["s"] - d, 3), "fin": round(w["e"] - d, 3)} for w in ws]})
        alerte = "   ← moins d'une seconde" if p["cadre"] == "A" and e - d < 1 else ""
        print(f"{k + 1:2d} {p['cadre']} {p['id']:<14} {d:6.2f} → {e:6.2f} ({e - d:4.2f} s) {p.get('anim') or ''}{alerte}")
        if p["cadre"] == "B":
            print("      repères : " + " | ".join(f"{w['w']} {w['s'] - d + av:.2f}" for w in ws))
    v.ecrire("plans.json", sortie)
    print("\nmontage/plans.json écrit. Les repères d'un plan B = temps du mot dans le plan + 0,15 s :"
          "\nce sont les temps à écrire dans la timeline de son animation.")


if __name__ == "__main__":
    main(Video(sys.argv[1]), sys.argv[2:])
