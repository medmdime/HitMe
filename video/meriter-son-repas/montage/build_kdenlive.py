#!/usr/bin/env python3
"""Génère le projet Kdenlive du reel « Tu n'as jamais eu à le mériter ».

Le montage est décrit ici en secondes, dans TIMELINE. Modifier ce fichier puis
relancer le script régénère le .kdenlive — mais UNE FOIS QUE TU AS TOUCHÉ AU
PROJET DANS KDENLIVE, ne le relance plus : il écraserait ton travail.
"""
import os, uuid as _uuid, xml.etree.ElementTree as ET
from xml.dom import minidom

FPS = 30
HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
AUD  = "/run/media/elmdimegh/Storage/editing_audio"
def f(s): return int(round(s * FPS))

R = lambda p: os.path.join(PROJ, p)
RUSH = "/run/media/elmdimegh/Storage/videos"
T = lambda n: os.path.join(RUSH, f"2026-09-01 {n}.mp4")
CLIPS = {
    "lit":     R("assets/broll/lit-A.mp4"),
    "cam1":    T("00-26-00"),
    "cam2":    T("00-26-53"),
    "cam3":    T("00-28-18"),
    "vx_hook": T("00-17-20"),
    "vx_A":    T("00-26-19"),
    "vx_B":    T("00-27-19"),
    "vx_C":    T("00-28-39"),
    "anim1":   R("renders/01-decoupe-tdee.mp4"),
    "anim2":   R("renders/02-digestion-vs-sport.mp4"),
    "anim3":   R("renders/03-les-trois-leviers.mp4"),
    "music":   os.path.join(AUD, "LoVibe. - a good man with a broken heart.mp3"),
    "riser":   os.path.join(AUD, "rizer-mettalic.mp3"),
    "impact":  os.path.join(AUD, "impacts.mp3"),
    "woosh":   os.path.join(AUD, "air-woosh.wav"),
}

# (piste, clip, début timeline, in, out, volume)  — tout en secondes
TIMELINE = {
 "main": [                                      # ne porte QUE le fond du hook
   ("lit",   0.00, 0.00, 5.04, None),
 ],
 "incrustation": [                              # tout le montage
   ("cam1",  5.04, 0.28, 8.75, None),
   (None,   13.51, 0.00, 18.01, None),          # TROU — pickup A
   ("anim1",18.01, 0.00, 17.50, None),
   ("cam2", 35.51, 0.73, 2.97, None),
   ("anim2",37.75, 0.00, 8.00, None),
   ("cam3", 45.75, 0.41, 5.07, None),
   ("anim3",50.41, 0.00, 26.50, None),
   (None,   76.91, 0.00, 88.91, None),          # TROU — pickup B (la chute)
 ],
 "A1": [                                        # voix seule
   ("vx_hook", 1.26, 0.00, 3.10, 1.0),
   ("cam1_a",  5.04, 0.28, 8.75, 1.0),
   ("vx_A",   18.01, 0.04, 17.54, 1.0),
   ("cam2_a", 35.51, 0.73, 2.97, 1.0),
   ("vx_B",   37.98, 0.00, 7.77, 1.0),
   ("cam3_a", 45.75, 0.41, 5.07, 1.0),
   ("vx_C",   50.41, 0.64, 27.14, 1.0),
 ],
 "A2": [                                        # musique — deux mouvements
   ("music",  5.04, 0.00, 41.46, 0.11),         # avant le turn
   ("music", 46.20, 60.00, 103.00, 0.24),       # après le turn, plus fort
 ],
 "A3": [                                        # risers — 3 emplois, pas un de plus
   ("riser",  4.04, 0.00, 1.88, 0.24),
   ("riser", 47.90, 0.00, 1.88, 0.24),
   ("riser", 75.60, 0.00, 1.88, 0.24),
 ],
 "A4": [                                        # impacts
   ("impact",  5.04, 0.00, 1.50, 0.43),
   ("impact", 48.90, 0.00, 1.50, 0.43),
   ("impact", 76.91, 0.00, 1.50, 0.43),
 ],
 "A5": [                                        # whoosh — à peine audible, il lisse la coupe
   ("woosh",  4.90, 0.00, 0.90, 0.09),
   ("woosh", 48.70, 0.00, 0.90, 0.09),
   ("woosh", 76.75, 0.00, 0.90, 0.09),
 ],
}
TRACK_ORDER = ["A5", "A4", "A3", "A2", "A1", "main", "incrustation"]  # bas -> haut
TOTAL = f(88.91)

MARKERS = [(13.51, "PICKUP A — « Sauf que le sport, c'est cinq pour cent de ce que tu brules. Cinq. »"),
           (45.75, "LE TURN — bascule musicale + riser/whoosh/impact"),
           (76.91, "PICKUP B — la chute, 12 s, A REFILMER")]

def prop(parent, name, value):
    p = ET.SubElement(parent, "property", {"name": name}); p.text = str(value); return p

mlt = ET.Element("mlt", {"LC_NUMERIC":"C", "version":"7.36.1", "root": PROJ,
                         "title":"meriter-son-repas", "producer":"main_bin"})
ET.SubElement(mlt, "profile", {
  "description":"1080x1920 30fps", "width":"1080", "height":"1920", "progressive":"1",
  "sample_aspect_num":"1","sample_aspect_den":"1","display_aspect_num":"1080",
  "display_aspect_den":"1920","frame_rate_num":"30","frame_rate_den":"1","colorspace":"709"})

# --- piste noire de fond
blk = ET.SubElement(mlt, "producer", {"id":"black", "in":"0", "out":str(TOTAL)})
for k,v in [("length",TOTAL+1),("eof","pause"),("resource","0"),("aspect_ratio","1"),
            ("mlt_service","color"),("mlt_image_format","rgba"),("set.test_audio","0")]:
    prop(blk,k,v)
bt = ET.SubElement(mlt, "playlist", {"id":"black_track"})
ET.SubElement(bt, "entry", {"producer":"black", "in":"0", "out":str(TOTAL)})

# --- producteurs du chutier
pid, kid = {}, 2
import subprocess
def dur(path):
    return float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
                                 "-of","csv=p=0",path],capture_output=True,text=True).stdout.strip())
for key, path in CLIPS.items():
    n = f"producer_{key}"; L = f(dur(path))
    audio_only = key.startswith("vx_") or key in ("music","riser","impact","woosh")
    p = ET.SubElement(mlt, "producer", {"id":n, "in":"0", "out":str(L)})
    prop(p,"length",L+1); prop(p,"eof","pause"); prop(p,"resource",path)
    prop(p,"mlt_service","avformat-novalidate")
    prop(p,"audio_index","-1" if key.startswith("cam") else "0")
    prop(p,"video_index","-1" if audio_only else "0")
    if audio_only: prop(p,"set.test_image","1")
    prop(p,"kdenlive:id",kid); prop(p,"kdenlive:clipname",os.path.basename(path))
    prop(p,"kdenlive:duration",L+1)
    pid[key]=n; kid+=1
    if key.startswith("cam"):            # volet audio du clip AV, posé sur A1
        na = n+"_audio"
        pa = ET.SubElement(mlt, "producer", {"id":na, "in":"0", "out":str(L)})
        prop(pa,"length",L+1); prop(pa,"eof","pause"); prop(pa,"resource",path)
        prop(pa,"mlt_service","avformat-novalidate")
        prop(pa,"audio_index","0"); prop(pa,"video_index","-1")
        prop(pa,"set.test_image","1")
        prop(pa,"kdenlive:id",kid); prop(pa,"kdenlive:clipname",os.path.basename(path))
        prop(pa,"kdenlive:duration",L+1)
        pid[key+"_a"]=na; kid+=1

SEQ = "{" + str(_uuid.uuid5(_uuid.NAMESPACE_URL, "meriter-son-repas")) + "}"
mb = ET.SubElement(mlt, "playlist", {"id":"main_bin"})
for k,v in [("kdenlive:docproperties.version","1.1"),
            ("kdenlive:docproperties.kdenliveversion","25.12.3"),
            ("kdenlive:docproperties.uuid",SEQ),
            ("kdenlive:docproperties.activetimeline",SEQ),
            ("kdenlive:docproperties.profile","1080x1920 30fps"),
            ("kdenlive:docproperties.documentid","1756700000000"),
            ("kdenlive:docproperties.seekOffset","30000"),
            ("xml_retain","1")]:
    prop(mb,k,v)
for key in CLIPS: ET.SubElement(mb,"entry",{"producer":pid[key],"in":"0","out":"-1"})

# --- pistes
tid = 0
def make_track(name, items, is_audio):
    global tid
    pl = ET.SubElement(mlt, "playlist", {"id":f"playlist{tid}"})
    prop(pl,"kdenlive:audio_track","1") if is_audio else None
    cur = 0
    for it in items:
        key, start, tin, tout, vol = it
        sf, inf, outf = f(start), f(tin), f(tout)-1
        if sf > cur:
            ET.SubElement(pl,"blank",{"length":str(sf-cur)})
            cur = sf
        if key is None:
            ET.SubElement(pl,"blank",{"length":str(f(tout)-sf)}); cur = f(tout); continue
        e = ET.SubElement(pl,"entry",{"producer":pid[key],"in":str(inf),"out":str(outf)})
        if vol is not None and vol != 1.0:
            fl = ET.SubElement(e,"filter",{"id":f"vol{tid}_{cur}"})
            prop(fl,"mlt_service","volume"); prop(fl,"level",f"{20*__import__('math').log10(vol):.2f}")
            prop(fl,"kdenlive_id","volume"); prop(fl,"kdenlive:collapsed","0")
        cur += outf-inf+1
    pl2 = ET.SubElement(mlt,"playlist",{"id":f"playlist{tid+1}"})
    prop(pl2,"kdenlive:audio_track","1") if is_audio else None
    ET.SubElement(pl2,"blank",{"length":str(TOTAL+1)})
    tr = ET.SubElement(mlt,"tractor",{"id":f"tractor{tid//2}","in":"0","out":str(TOTAL)})
    prop(tr,"kdenlive:trackName",name); prop(tr,"kdenlive:timeline_active","1")
    if is_audio: prop(tr,"kdenlive:audio_track","1")
    ET.SubElement(tr,"track",{"producer":f"playlist{tid}"})
    ET.SubElement(tr,"track",{"producer":f"playlist{tid+1}"})
    tra = ET.SubElement(tr,"transition",{"id":f"tr_mix{tid}"})
    for k,v in [("a_track","0"),("b_track","1"),("mlt_service","mix"),("always_active","1"),
                ("sum","1"),("accepts_blanks","1"),("internal_added","237")]: prop(tra,k,v)
    tid += 2
    return f"tractor{(tid-2)//2}"

tractors = [make_track(n, TIMELINE[n], n.startswith("A")) for n in TRACK_ORDER]

# --- tractor maître
mt = ET.SubElement(mlt,"tractor",{"id":SEQ,"in":"0","out":str(TOTAL),"global_feed":"1"})
for k,v in [("kdenlive:uuid",SEQ), ("kdenlive:clipname","Sequence 1"),
            ("kdenlive:producer_type","17"), ("kdenlive:id","1"),
            ("kdenlive:duration",TOTAL+1), ("kdenlive:maxduration",TOTAL+1),
            ("kdenlive:sequenceproperties.hasAudio","1"),
            ("kdenlive:sequenceproperties.hasVideo","1"),
            ("kdenlive:sequenceproperties.activeTrack","6"),
            ("kdenlive:sequenceproperties.tracksCount",str(len(TRACK_ORDER))),
            ("kdenlive:sequenceproperties.documentuuid",SEQ),
            ("kdenlive:sequenceproperties.position","0")]:
    prop(mt,k,v)
prop(mb,"kdenlive:docproperties.subtitleFile", os.path.join(PROJ,"montage","sous-titres.srt"))
ET.SubElement(mt,"track",{"producer":"black_track"})
for t in tractors: ET.SubElement(mt,"track",{"producer":t})
for i,n in enumerate(TRACK_ORDER, start=1):
    tr = ET.SubElement(mt,"transition",{"id":f"main_mix{i}"})
    for k,v in [("a_track","0"),("b_track",str(i)),("mlt_service","mix"),("always_active","1"),
                ("sum","1"),("accepts_blanks","1"),("internal_added","237")]: prop(tr,k,v)
    if not n.startswith("A"):
        tb = ET.SubElement(mt,"transition",{"id":f"main_blend{i}"})
        # piste vidéo du bas : rien à composer, on la laisse passer.
        # piste du dessus : elle se compose par-dessus.
        off = "1" if n == "main" else "0"
        for k,v in [("a_track","0"),("b_track",str(i)),("mlt_service","qtblend"),
                    ("always_active","1"),("disable",off),
                    ("accepts_blanks","1"),("internal_added","237")]: prop(tb,k,v)
for i,(t,txt) in enumerate(MARKERS):
    prop(mt, f"kdenlive:guide.{f(t)}", f'["{txt}",{i%5}]')

ET.SubElement(mb,"entry",{"producer":SEQ,"in":"0","out":str(TOTAL)})
mlt.set("producer","main_bin")

out = os.path.join(PROJ,"montage","meriter-son-repas.kdenlive")
xml = minidom.parseString(ET.tostring(mlt,"utf-8")).toprettyxml(indent=" ")
open(out,"w").write(xml)
print("écrit :", out, "·", TOTAL, "images ·", round(TOTAL/FPS,2), "s")
