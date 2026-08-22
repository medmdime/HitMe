import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { extractVideoId } from "@/lib/youtube-url"
import { getChannelInfo, getVideoStats } from "@/lib/youtube-data"
import { upsertAnalysis } from "@/lib/db/analyses"
import { SCRIPT_PROMPT, splitScriptAndAnalysis } from "@/lib/prompts"

export const runtime = "nodejs"
export const maxDuration = 300


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
