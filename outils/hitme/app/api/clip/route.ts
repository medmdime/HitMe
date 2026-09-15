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

interface ClipListRow {
  id: string
  platform: string
  url: string | null
  title: string | null
  author: string | null
  durationSeconds: number | null
  analyzedAt: string
  hasTemplate: boolean
}

/**
 * Recent clips: local sidecars merged with the shared DB, newest wins per id.
 *
 * Transcription writes the sidecar unconditionally and the DB best effort, so a
 * DB that is stale, unreachable, or rejecting rows must not make local work
 * invisible — that failure mode hid eleven clips once already. The DB still
 * contributes, so teardowns someone else ran on the same DATABASE_URL show up
 * here too.
 */
export async function GET() {
  const byId = new Map<string, ClipListRow>()

  for (const c of listLocalClips()) {
    byId.set(c.id, {
      id: c.id,
      platform: c.platform,
      url: c.url,
      title: c.title,
      author: c.author,
      durationSeconds: c.durationSeconds,
      analyzedAt: c.analyzedAt,
      hasTemplate: Boolean(c.template),
    })
  }

  if (process.env.DATABASE_URL) {
    try {
      for (const r of await listClips(100)) {
        const analyzedAt = r.analyzedAt.toISOString()
        const local = byId.get(r.id)
        if (local && local.analyzedAt >= analyzedAt) continue
        byId.set(r.id, {
          id: r.id,
          platform: r.platform,
          url: r.url,
          title: r.title,
          author: r.author,
          durationSeconds: r.durationSeconds,
          analyzedAt,
          hasTemplate: Boolean(r.template),
        })
      }
    } catch (err) {
      console.error("[clip] list from DB failed, showing local clips only:", err)
    }
  }

  const clips = [...byId.values()].sort((a, b) => b.analyzedAt.localeCompare(a.analyzedAt))
  return NextResponse.json({ clips })
}
