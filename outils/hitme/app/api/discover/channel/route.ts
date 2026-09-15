import { NextResponse } from "next/server"
import { getChannelInfo, getChannelUploads, resolveChannelId, QuotaExhaustedError } from "@/lib/youtube-data"
import { computeChannelBaseline, computeOutlier, isLongForm } from "@/lib/outlier"
import type { DiscoveryResponse } from "@/lib/youtube-data.types"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      channelUrlOrId?: string
      lookbackVideos?: number
    }
    const channelInput = body.channelUrlOrId?.trim()
    if (!channelInput) {
      return NextResponse.json({ error: "channelUrlOrId required" }, { status: 400 })
    }
    const lookback = Math.min(Math.max(body.lookbackVideos ?? 30, 5), 50)

    const channelId = await resolveChannelId(channelInput)
    const [channel, uploads] = await Promise.all([
      getChannelInfo(channelId),
      getChannelUploads(channelId, lookback),
    ])

    const longForm = uploads.filter(isLongForm)
    const baseline = computeChannelBaseline(longForm)
    const videos = longForm
      .map((v) => computeOutlier(v, baseline.median, channel.subscriberCount))
      .sort((a, b) => b.outlier_score - a.outlier_score)

    const resp: DiscoveryResponse = { channel, baseline, videos }
    return NextResponse.json(resp)
  } catch (err) {
    return errorResponse(err)
  }
}

function errorResponse(err: unknown) {
  if (err instanceof QuotaExhaustedError) {
    return NextResponse.json({ error: err.message, code: "QUOTA_EXHAUSTED" }, { status: 429 })
  }
  const message = err instanceof Error ? err.message : String(err)
  return NextResponse.json({ error: message }, { status: 500 })
}
