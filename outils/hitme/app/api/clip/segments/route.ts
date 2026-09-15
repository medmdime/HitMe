import { NextResponse } from "next/server"
import { existsSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { findStoredClip } from "@/lib/clip-pipeline"
import { parseScript } from "@/lib/parse-script"
import { cutSegments, findFfmpeg, timeShots, probeDuration } from "@/lib/segments"
import { segmentsDir } from "@/lib/workspace"

export const runtime = "nodejs"
export const maxDuration = 300

function slug(s: string, max = 80): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, max) || "clip"
  )
}

/** Cut a clip into per-shot files. */
export async function POST(req: Request) {
  let body: { id?: string; only?: "all" | "broll"; audio?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }
  const id = body.id?.trim()
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  if (!findFfmpeg()) {
    return NextResponse.json(
      {
        error:
          "ffmpeg is not available on this machine, so the clip cannot be cut. Install it with " +
          "`winget install Gyan.FFmpeg` (or run this locally where CapCut is installed).",
        code: "LOCAL_ONLY",
      },
      { status: 501 }
    )
  }

  const row = await findStoredClip(id)
  if (!row) return NextResponse.json({ error: `No clip "${id}"` }, { status: 404 })
  if (!row.localPath || !existsSync(row.localPath)) {
    return NextResponse.json(
      { error: "The downloaded video is missing on this machine. Re-run the transcription with force." },
      { status: 409 }
    )
  }
  const blocks = parseScript(row.script)
  if (blocks.length === 0) {
    return NextResponse.json({ error: "The stored script has no bracket blocks to cut on." }, { status: 422 })
  }

  try {
    const result = await cutSegments({
      clipId: id,
      sourcePath: row.localPath,
      blocks,
      only: body.only ?? "all",
      audio: body.audio ?? true,
      onProgress: (note) => console.log(`[segments] ${note}`),
    })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * Existing segments for a clip, if they were cut before — so the page can show
 * them without re-cutting. Also returns the timing plan so the UI can preview
 * what a cut would produce.
 */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id")?.trim()
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const row = await findStoredClip(id)
  if (!row) return NextResponse.json({ error: `No clip "${id}"` }, { status: 404 })

  const blocks = parseScript(row.script)
  const total =
    (row.localPath && existsSync(row.localPath) ? await probeDuration(row.localPath) : null) ??
    row.durationSeconds ??
    (blocks.at(-1)?.start_sec ?? 0) + 5
  const plan = timeShots(blocks, total).map((s) => ({
    index: s.index,
    timestamp: s.block.timestamp,
    shot: s.block.shot,
    start: s.start,
    end: s.end,
    broll: s.broll,
  }))

  const dir = join(segmentsDir(), slug(id))
  const existing = existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith(".mp4"))
        .sort()
        .map((f) => ({ file: f, path: join(dir, f), sizeBytes: statSync(join(dir, f)).size }))
    : []
  const audioPath = existsSync(join(dir, "audio.mp3")) ? join(dir, "audio.mp3") : null

  return NextResponse.json({
    id,
    totalSeconds: total,
    plan,
    dir: existing.length ? dir : null,
    segments: existing,
    audioPath,
    sourceAvailable: Boolean(row.localPath && existsSync(row.localPath)),
    ffmpegAvailable: Boolean(findFfmpeg()),
  })
}
