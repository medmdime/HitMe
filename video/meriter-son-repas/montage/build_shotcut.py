#!/usr/bin/env python3
"""Même montage, en projet Shotcut (.mlt). Interface bien plus simple que Kdenlive,
même moteur MLT dessous — donc rigoureusement le même rendu."""
import os, subprocess, math, xml.etree.ElementTree as ET
from xml.dom import minidom

FPS=30; PROJ=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUD="/run/media/elmdimegh/Storage/editing_audio"; RUSH="/run/media/elmdimegh/Storage/videos"
f=lambda s:int(round(s*FPS)); R=lambda p:os.path.join(PROJ,p); T=lambda n:os.path.join(RUSH,f"2026-09-01 {n}.mp4"); F=lambda n:os.path.join(RUSH,n)
CLIPS={"lit":R("assets/broll/lit-A.mp4"),"cam1":F("video-2.mp4"),"cam2":T("00-26-53"),"cam3":T("00-28-18"),
 "vx_hook":F("lit-audio-1.mp4"),"vx_A":F("01-decoupe-tdee.mp4"),
 "vx_B":F("02-digestion-vs-sport.mp4"),"vx_C":F("03-les-trois-leviers.mp4"),
 "anim1":R("renders/01-decoupe-tdee.mp4"),"anim2":R("renders/02-digestion-vs-sport.mp4"),
 "anim3":R("renders/03-les-trois-leviers.mp4"),
 "music":os.path.join(AUD,"LoVibe. - a good man with a broken heart.mp3"),
 "riser":os.path.join(AUD,"rizer-mettalic.mp3"),"impact":os.path.join(AUD,"impacts.mp3"),
 "woosh":os.path.join(AUD,"air-woosh.wav")}
TIMELINE={
 "V1 hook":[("lit",0.00,0.00,5.04,None)],
 "V2 montage":[("cam1",5.04,0.28,8.75,None),(None,13.51,0,18.01,None),("anim1",18.01,0,17.50,None),
   ("cam2",35.51,0.73,2.97,None),("anim2",37.75,0,5.50,None),("cam3",43.25,0.41,5.07,None),
   ("anim3",47.91,0,25.50,None),(None,73.41,0,85.41,None)],
 "A1 voix":[("vx_hook",0.31,0,3.90,1.0),("cam1_a",5.04,0.28,8.75,1.0),("vx_A",18.01,0.04,17.54,1.0),
   ("cam2_a",35.51,0.73,2.97,1.0),("vx_B",38.01,0,5.24,1.0),("cam3_a",43.25,0.41,5.07,1.0),
   ("vx_C",47.91,0.04,24.90,1.0)],
 "A2 musique":[("music",5.04,0,41.96,0.11),("music",46.00,60.00,99.41,0.24)],
 "A3 risers":[("riser",4.04,0,1.88,0.24),("riser",45.60,0,1.88,0.24),("riser",72.40,0,1.88,0.24)],
 "A4 impacts":[("impact",5.04,0,1.50,0.43),("impact",46.62,0,1.50,0.43),("impact",73.41,0,1.50,0.43)],
 "A5 whoosh":[("woosh",4.90,0,0.90,0.09),("woosh",46.40,0,0.90,0.09),("woosh",73.25,0,0.90,0.09)]}
ORDER=["A5 whoosh","A4 impacts","A3 risers","A2 musique","A1 voix","V1 hook","V2 montage"]
TOTAL=f(85.41)
def prop(p,n,v):
    e=ET.SubElement(p,"property",{"name":n}); e.text=str(v); return e
def dur(p): return float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p],capture_output=True,text=True).stdout.strip())

mlt=ET.Element("mlt",{"LC_NUMERIC":"C","version":"7.36.1","title":"Shotcut version 26.1",
                      "producer":"background","root":PROJ})
ET.SubElement(mlt,"profile",{"description":"1080x1920 30fps","width":"1080","height":"1920",
 "progressive":"1","sample_aspect_num":"1","sample_aspect_den":"1","display_aspect_num":"1080",
 "display_aspect_den":"1920","frame_rate_num":"30","frame_rate_den":"1","colorspace":"709"})
bg=ET.SubElement(mlt,"producer",{"id":"black","in":"00:00:00.000","out":str(TOTAL)})
for k,v in [("length",TOTAL+1),("eof","pause"),("resource","0"),("aspect_ratio","1"),
            ("mlt_service","color"),("mlt_image_format","rgba")]: prop(bg,k,v)
pbg=ET.SubElement(mlt,"playlist",{"id":"background"})
ET.SubElement(pbg,"entry",{"producer":"black","in":"0","out":str(TOTAL)})

pid={}; i=0
for key,path in CLIPS.items():
    L=f(dur(path)); ao = key.startswith("vx_") or key in ("music","riser","impact","woosh")
    for variant,is_audio in ([("", ao)] + ([("_a",True)] if key.startswith("cam") else [])):
        n=f"chain{i}"; i+=1
        c=ET.SubElement(mlt,"chain",{"id":n,"out":str(L)})
        prop(c,"length",L+1); prop(c,"resource",path); prop(c,"mlt_service","avformat-novalidate")
        prop(c,"audio_index","-1" if (key.startswith("cam") and variant=="") else "0")
        prop(c,"video_index","-1" if (is_audio or variant=="_a") else "0")
        prop(c,"shotcut:caption",os.path.basename(path))
        pid[key+variant]=n

pl_ids=[]
for t,name in enumerate(ORDER):
    is_audio=name.startswith("A")
    pl=ET.SubElement(mlt,"playlist",{"id":f"playlist{t}"})
    prop(pl,"shotcut:video" if not is_audio else "shotcut:audio","1")
    prop(pl,"shotcut:name",name)
    cur=0
    for key,start,tin,tout,vol in TIMELINE[name]:
        sf=f(start)
        if sf>cur: ET.SubElement(pl,"blank",{"length":str(sf-cur)}); cur=sf
        if key is None: ET.SubElement(pl,"blank",{"length":str(f(tout)-sf)}); cur=f(tout); continue
        e=ET.SubElement(pl,"entry",{"producer":pid[key],"in":str(f(tin)),"out":str(f(tout)-1)})
        if vol not in (None,1.0):
            fl=ET.SubElement(e,"filter",{"id":f"flt{t}_{cur}"})
            prop(fl,"mlt_service","volume"); prop(fl,"level",f"{20*math.log10(vol):.2f}")
            prop(fl,"shotcut:filter","volumeGain")
        cur+=f(tout)-f(tin)
    pl_ids.append(f"playlist{t}")

tr=ET.SubElement(mlt,"tractor",{"id":"tractor0","title":"Shotcut version 26.1",
                                "in":"00:00:00.000","out":str(TOTAL)})
prop(tr,"shotcut","1"); prop(tr,"shotcut:projectAudioChannels","2"); prop(tr,"shotcut:projectFolder","1")
ET.SubElement(tr,"track",{"producer":"background"})
for idx,p in enumerate(pl_ids):
    a = {"producer":p}
    if ORDER[idx].startswith("A"): a["hide"]="video"
    ET.SubElement(tr,"track",a)
for idx,name in enumerate(ORDER,start=1):
    t1=ET.SubElement(tr,"transition",{"id":f"tmix{idx}"})
    for k,v in [("a_track","0"),("b_track",str(idx)),("mlt_service","mix"),("always_active","1"),
                ("sum","1")]: prop(t1,k,v)
    if not name.startswith("A"):
        t2=ET.SubElement(tr,"transition",{"id":f"tblend{idx}"})
        for k,v in [("a_track","0"),("b_track",str(idx)),("version","0.1"),
                    ("mlt_service","qtblend"),("always_active","1"),
                    ("disable","1" if name.startswith("V1") else "0")]: prop(t2,k,v)

out=os.path.join(PROJ,"montage","meriter-son-repas.mlt")
open(out,"w").write(minidom.parseString(ET.tostring(mlt,"utf-8")).toprettyxml(indent=" "))
print("écrit :",out,"·",TOTAL,"images ·",round(TOTAL/FPS,2),"s")
