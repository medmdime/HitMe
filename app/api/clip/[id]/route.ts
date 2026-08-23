import { NextResponse } from "next/server"
import { findStoredClip } from "@/lib/clip-pipeline"
import { parseScript } from "@/lib/parse-script"
import type { ClipMetadata } from "@/lib/media"

export const runtime = "nodejs"

/** One saved clip in full — the same shape the transcribe route returns. */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const decoded = decodeURIComponent(id)
  const row = await findStoredClip(decoded)
  if (!row) return NextResponse.json({ error: `No clip "${decoded}"` }, { status: 404 })
  const meta = (row.metadata as ClipMetadata | null) ?? null
  return NextResponse.json({
    ...row,
    cached: true,
    blocks: parseScript(row.script),
    sound: meta?.track ? { track: meta.track, artist: meta.artist } : null,
  })
}
