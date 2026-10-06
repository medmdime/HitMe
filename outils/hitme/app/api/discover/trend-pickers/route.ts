import { NextResponse } from "next/server"
import { ApifyError, MissingApifyTokenError } from "@/lib/apify"
import { TrendInputError } from "@/lib/trend-criteria"
import { findTrendPickers, listSavedSearches, type TrendPickerParams } from "@/lib/trend-pickers"

export const runtime = "nodejs"
// Two provider runs back to back; each can take a few minutes.
export const maxDuration = 800

/** Previous searches, newest first — the app's own and the ones agents ran over MCP. */
export async function GET() {
  try {
    return NextResponse.json({ searches: listSavedSearches() })
  } catch (err) {
    return errorResponse(err)
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TrendPickerParams
    return NextResponse.json(await findTrendPickers({ ...body, source: "app" }))
  } catch (err) {
    return errorResponse(err)
  }
}

function errorResponse(err: unknown) {
  const message = err instanceof Error ? err.message : String(err)
  if (err instanceof TrendInputError) {
    return NextResponse.json({ error: message }, { status: 400 })
  }
  if (err instanceof MissingApifyTokenError) {
    return NextResponse.json({ error: message, code: "NO_APIFY_TOKEN" }, { status: 503 })
  }
  if (err instanceof ApifyError) {
    return NextResponse.json({ error: message }, { status: 502 })
  }
  return NextResponse.json({ error: message }, { status: 500 })
}
