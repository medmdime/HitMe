import { NextResponse } from "next/server"
import { transcribeClip, type ClipResult } from "@/lib/clip-pipeline"
import { findYtDlp, isHttpUrl } from "@/lib/media"
import { listClips } from "@/lib/db/clips"
import { listLocalClips } from "@/lib/clip-store"

export const runtime = "nodejs"
export const maxDuration = 300

/**
 * Short-form transcription runs where yt-dlp and ffmpeg live — on your own
 * machine. The hosted build has neither, and TikTok/Instagram block datacenter
 * IPs anyway, so this route says so instead of failing obscurely.
 */
function localOnlyError() {
  return NextResponse.json(
    {
      error:
        "Clip transcription runs locally, not on the hosted app: it needs yt-dlp on this machine and the " +
        "platforms refuse datacenter IPs. Run `bun run dev` on your computer and use this page there, or use " +
        "the HitMe MCP server.",
      code: "LOCAL_ONLY",
    },
    { status: 501 }
  )
}

export async function POST(req: Request) {
  let body: {
    url?: string
    file?: string
    force?: boolean
    longForm?: boolean
    cookiesFromBrowser?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const url = body.url?.trim()
  const file = body.file?.trim()
  if (!url && !file) {
    return NextResponse.json({ error: "url or file required" }, { status: 400 })
  }
  if (url && !isHttpUrl(url)) {
    return NextResponse.json({ error: "url must start with http:// or https://" }, { status: 400 })
  }
  if (url && !findYtDlp()) return localOnlyError()

  try {
    const result: ClipResult = await transcribeClip({
      url,
      file,
      force: body.force,
      longForm: body.longForm,
      cookiesFromBrowser: body.cookiesFromBrowser,
      onProgress: (note) => console.log(`[clip] ${note}`),
    })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const status = /not installed|No such file/i.test(message) ? 501 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

/** Recent clips, DB first with the local sidecars as the fallback. */
export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await listClips(100)
      return NextResponse.json({
        clips: rows.map((r) => ({
          id: r.id,
          platform: r.platform,
          url: r.url,
          title: r.title,
          author: r.author,
          durationSeconds: r.durationSeconds,
          analyzedAt: r.analyzedAt.toISOString(),
          hasTemplate: Boolean(r.template),
        })),
      })
    }
  } catch (err) {
    console.error("[clip] list from DB failed, falling back to local:", err)
  }
  return NextResponse.json({
    clips: listLocalClips().map((c) => ({
      id: c.id,
      platform: c.platform,
      url: c.url,
      title: c.title,
      author: c.author,
      durationSeconds: c.durationSeconds,
      analyzedAt: c.analyzedAt,
      hasTemplate: Boolean(c.template),
    })),
  })
}
