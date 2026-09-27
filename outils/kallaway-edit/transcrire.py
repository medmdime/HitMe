"""Étape 1 · transcrire chaque prise mot à mot, avec le temps de chaque mot.

Deux écoutes, pour deux usages (c'est ce qui a marché sur l'assiette) :

  - [transcription] coupes = "medium", avec une amorce (quelques phrases du script) : sert à la
    carte des coupes (maitre) et aux références de mots de kallaway.toml. Ses bornes de mots sont
    serrées, ce qu'il faut pour protéger un silence à l'intérieur d'un mot (« enre-gistre »).
  - [transcription] sous_titres = "large-v3", SANS amorce : il entend mieux ce qui a vraiment été
    dit (« Mohamed » et pas « Mohammed », « bien sûr de ton dessert » et pas « bien sur ton »).
    Une amorce pousse le modèle à entendre le script ; pour vérifier une prise, il n'en faut pas.
    Ses débuts de mots débordent souvent dans le silence d'avant : ce n'est pas grave pour les
    sous-titres, la carte les recale sur les morceaux gardés.

Les deux modèles tournent sur le processeur (int8) ; large-v3 est déjà en cache
(~/.cache/huggingface/hub/models--Systran--faster-whisper-large-v3). Compter 2 à 4 minutes pour
six prises d'une dizaine de secondes.

Sortie : montage/mots-<modèle>.json = {alias: [{"w": mot, "s": début, "e": fin, "p": confiance}]}.
"""
import sys
from commun import Video


def transcrire(v, modele, amorce=None):
    from faster_whisper import WhisperModel
    m = WhisperModel(modele, device="cpu", compute_type="int8")
    res = {}
    for alias in v.ordre:
        opts = dict(language="fr", word_timestamps=True, beam_size=5)
        if amorce:
            opts["initial_prompt"] = amorce
        else:
            opts.update(vad_filter=False, condition_on_previous_text=False)
        segs, _ = m.transcribe(v.wav(alias), **opts)
        mots = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3), "p": round(w.probability, 2)}
                for s in segs for w in s.words]
        res[alias] = mots
        print(f"[{modele}] {alias} · {v.prises[alias]['fichier']}")
        print("   " + " ".join(f"{w['w']}@{i}" for i, w in enumerate(mots)), flush=True)
    v.ecrire(f"mots-{modele}.json", res)


def main(v, args):
    t = v.cfg["transcription"]
    quoi = args[0] if args else "tout"
    if quoi in ("tout", "coupes"):
        transcrire(v, t["coupes"], t.get("amorce"))
    if quoi in ("tout", "sous-titres"):
        transcrire(v, t["sous_titres"], None)
    print("\nÀ relire : chaque mot suivi de son index (mot@i). Les références de kallaway.toml se font sur la"
          "\ntranscription des coupes (« PRISE:mot » ou « PRISE@i »).")


if __name__ == "__main__":
    main(Video(sys.argv[1]), sys.argv[2:])
