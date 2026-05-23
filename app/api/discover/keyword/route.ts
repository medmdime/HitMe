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
      regionCode?: string
      relevanceLanguage?: string
      publishedAfter?: string
      maxResults?: number
      minOutlier?: number
      maxChannelSubs?: number
      videoDuration?: "any" | "medium" | "long"
    }
    const query = body.query?.trim()
    if (!query) {
      return NextResponse.json({ error: "query required" }, { status: 400 })
    }

    const max = Math.min(body.maxResults ?? 50, 50)
    const { videoIds } = await searchVideos({
      query,
      maxResults: max,
      publishedAfter: body.publishedAfter,
      regionCode: body.regionCode,
      relevanceLanguage: body.relevanceLanguage,
      videoDuration: body.videoDuration ?? "medium",
      order: "viewCount",
    })

    const stats = (await getVideoStats(videoIds)).filter(isLongForm)
    const uniqueChannelIds = Array.from(new Set(stats.map((s) => s.channelId)))

    // Fetch channel info + baseline in parallel (cached)
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

    let filtered = enriched
    if (body.minOutlier !== undefined) {
      filtered = filtered.filter((v) => v.outlier_score >= body.minOutlier!)
    }
    if (body.maxChannelSubs !== undefined) {
      filtered = filtered.filter(
        (v) => (v.channel_subscribers ?? Infinity) <= body.maxChannelSubs!
      )
    }
    filtered.sort((a, b) => b.outlier_score - a.outlier_score)

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
