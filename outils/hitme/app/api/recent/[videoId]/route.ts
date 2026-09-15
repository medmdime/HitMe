import { NextResponse } from "next/server"
import { deleteAnalysis, getAnalysis } from "@/lib/db/analyses"

export const runtime = "nodejs"

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await ctx.params
    const row = await getAnalysis(videoId)
    if (!row) return NextResponse.json({ entry: null }, { status: 404 })
    return NextResponse.json({ entry: row })
  } catch (err) {
    return error(err)
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await ctx.params
    const ok = await deleteAnalysis(videoId)
    return NextResponse.json({ deleted: ok })
  } catch (err) {
    return error(err)
  }
}

function error(err: unknown) {
  const message = err instanceof Error ? err.message : String(err)
  return NextResponse.json({ error: message }, { status: 500 })
}
