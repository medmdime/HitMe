import { NextResponse } from "next/server"
import {
  deleteAllAnalyses,
  listAnalyses,
  upsertAnalysis,
  type AnalyzePayload,
} from "@/lib/db/analyses"

export const runtime = "nodejs"

export async function GET() {
  try {
    const rows = await listAnalyses()
    return NextResponse.json({ entries: rows })
  } catch (err) {
    return error(err)
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<AnalyzePayload>
    if (!body.videoId || !body.url || !body.script || !body.analysis) {
      return NextResponse.json(
        { error: "videoId, url, script and analysis are required" },
        { status: 400 }
      )
    }
    const row = await upsertAnalysis({
      videoId: body.videoId,
      url: body.url,
      script: body.script,
      analysis: body.analysis,
      metadata: body.metadata ?? null,
    })
    return NextResponse.json({ entry: row })
  } catch (err) {
    return error(err)
  }
}

export async function DELETE() {
  try {
    const n = await deleteAllAnalyses()
    return NextResponse.json({ deleted: n })
  } catch (err) {
    return error(err)
  }
}

function error(err: unknown) {
  const message = err instanceof Error ? err.message : String(err)
  return NextResponse.json({ error: message }, { status: 500 })
}
