import { NextResponse } from "next/server"
import {
  getChannelInfo,
  getChannelUploads,
  getVideoStats,
  QuotaExhaustedError,
  searchVideos,
} from "@/lib/youtube-data"
import {
  computeChannelBaseline,
  computeOutlier,
  isLongForm,
} from "@/lib/outlier"
import type { DiscoveryResponse, OutlierVideo } from "@/lib/youtube-data.types"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      query?: string
      maxChannelSubs?: number
      minOutlier?: number
      publishedAfter?: string
      maxResults?: number
    }
    const query = body.query?.trim()
    if (!query) {
      return NextResponse.json({ error: "query required" }, { status: 400 })
    }
    const maxChannelSubs = body.maxChannelSubs ?? 100_000
    const minOutlier = body.minOutlier ?? 5
    const maxResults = Math.min(body.maxResults ?? 50, 50)

    const { videoIds } = await searchVideos({
      query,
      maxResults,
      publishedAfter: body.publishedAfter,
      videoDuration: "medium",
      order: "viewCount",
    })

    const stats = (await getVideoStats(videoIds)).filter(isLongForm)
    const uniqueChannelIds = Array.from(new Set(stats.map((s) => s.channelId)))

    const channelData = await Promise.all(
      uniqueChannelIds.map(async (cid) => {
        try {
          const [info, uploads] = await Promise.all([
            getChannelInfo(cid),
            getChannelUploads(cid, 30),
          ])
          const baseline = computeChannelBaseline(uploads)
          return { cid, subs: info.subscriberCount, median: baseline.median }
        } catch {
          return { cid, subs: 0, median: 0 }
        }
      })
    )
    const channelMap = new Map(channelData.map((c) => [c.cid, c]))

    const enriched: OutlierVideo[] = stats.map((v) => {
      const ch = channelMap.get(v.channelId)
      return computeOutlier(v, ch?.median ?? 0, ch?.subs)
    })

    const filtered = enriched
      .filter(
        (v) =>
          v.outlier_score >= minOutlier &&
          (v.channel_subscribers ?? Infinity) <= maxChannelSubs
      )
      .sort((a, b) => b.outlier_score - a.outlier_score)

    const resp: DiscoveryResponse = { videos: filtered }
    return NextResponse.json(resp)
  } catch (err) {
    return errorResponse(err)
  }
}

function errorResponse(err: unknown) {
  if (err instanceof QuotaExhaustedError) {
    return NextResponse.json(
      { error: err.message, code: "QUOTA_EXHAUSTED" },
      { status: 429 }
    )
  }
  const message = err instanceof Error ? err.message : String(err)
  return NextResponse.json({ error: message }, { status: 500 })
}
