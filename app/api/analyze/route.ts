import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { extractVideoId } from "@/lib/youtube-url"
import { getChannelInfo, getVideoStats } from "@/lib/youtube-data"
import { upsertAnalysis } from "@/lib/db/analyses"

export const runtime = "nodejs"
export const maxDuration = 300

const SCRIPT_PROMPT = `You are reverse-engineering a YouTube video to extract its script in a specific bracket format.

Watch the video carefully and produce a complete, timestamped script in EXACTLY this format:

[MM:SS — Face camera frame]
narration text exactly as spoken

[MM:SS — Broll of <description of what is on screen>]
narration text exactly as spoken

Rules:
- Use MM:SS timestamps (e.g., [00:00], [01:23], [12:45]).
- Each bracket header describes the SHOT TYPE and what is visible on screen.
  - "Face camera frame" = the host is on camera talking to the viewer.
  - "Broll of X" = b-roll, screen recording, archival footage, graphic, etc. Describe X concretely.
  - "Cutaway to X" = brief insert shot.
  - "Text overlay: \"…\"" = on-screen text shown.
- Below each bracket, write the narration EXACTLY as spoken in the video. If a segment has no narration (e.g., music-only b-roll), write "[no narration]".
- Start a new bracket every time the shot changes OR every 15-30 seconds of continuous narration, whichever comes first.
- Capture the hook (first 5-15 seconds) with extra granularity — separate brackets for each beat.
- Do NOT add commentary, summary, or analysis. Output ONLY the bracket-format script.

After the script, append a section starting with:

---SCRIPT ANALYSIS---

Then provide a tight (under 250 words) analysis covering:
- Hook structure: what is the opening promise / curiosity gap?
- Pacing: average shot length, where it speeds up / slows down.
- Retention tactics: pattern interrupts, payoffs, callbacks.
- Packaging cues: title-to-content alignment, recurring visual motifs.
- One sentence on what a creator could steal from this format.`

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not configured" },
      { status: 500 }
    )
  }

  let body: { url?: string }
  try {
    body = (await req.json()) as { url?: string }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }
  const url = body.url?.trim()
  if (!url) {
    return NextResponse.json({ error: "url required" }, { status: 400 })
  }
  const videoId = extractVideoId(url)
  if (!videoId) {
    return NextResponse.json(
      { error: "Could not parse a YouTube video ID from that URL" },
      { status: 400 }
    )
  }
  const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`

  // Pull metadata in parallel with the model call (best effort)
  const metadataPromise = fetchMetadata(videoId).catch(() => null)

  try {
    const ai = new GoogleGenAI({ apiKey })
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { fileData: { fileUri: canonicalUrl, mimeType: "video/*" } },
            { text: SCRIPT_PROMPT },
          ],
        },
      ],
    })

    const text = result.text ?? ""
    const { script, analysis } = splitScriptAndAnalysis(text)
    const meta = await metadataPromise

    const payload = {
      videoId,
      url: canonicalUrl,
      script,
      analysis,
      metadata: meta,
    }

    // Persist to shared Neon DB so it's instantly visible to collaborators
    // and serves as the cache on the next request. DB failure shouldn't
    // break the analyze flow — the user still gets their result.
    if (process.env.DATABASE_URL) {
      try {
        await upsertAnalysis(payload)
      } catch (dbErr) {
        console.error("[analyze] DB upsert failed:", dbErr)
      }
    }

    return NextResponse.json(payload)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: `Gemini analysis failed: ${message}` },
      { status: 500 }
    )
  }
}

function splitScriptAndAnalysis(text: string): {
  script: string
  analysis: string
} {
  const marker = "---SCRIPT ANALYSIS---"
  const idx = text.indexOf(marker)
  if (idx === -1) return { script: text.trim(), analysis: "" }
  return {
    script: text.slice(0, idx).trim(),
    analysis: text.slice(idx + marker.length).trim(),
  }
}

async function fetchMetadata(videoId: string) {
  try {
    const stats = await getVideoStats([videoId])
    const video = stats[0]
    if (!video) return null
    let channel = null
    try {
      channel = await getChannelInfo(video.channelId)
    } catch {
      // ignore
    }
    return { video, channel }
  } catch {
    return null
  }
}
