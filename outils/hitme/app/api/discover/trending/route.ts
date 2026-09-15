import { NextResponse } from "next/server"
import {
  getChannelInfo,
  getChannelUploads,
  getMostPopular,
  getVideoStats,
  QuotaExhaustedError,
  searchVideos,
} from "@/lib/youtube-data"
import {
  computeChannelBaseline,
  computeOutlier,
  isLongForm,
} from "@/lib/outlier"
import { findCategory } from "@/lib/trending-categories"
import type { OutlierVideo, VideoStats } from "@/lib/youtube-data.types"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      categoryId?: string
      regionCode?: string
      maxResults?: number
      // Only used for synthetic categories (Fitness, AI, Cooking, etc.)
      windowDays?: number
    }
    const regionCode = (body.regionCode ?? "US").toUpperCase()
    const categoryId = body.categoryId ?? "sports"
    const category = findCategory(categoryId)
    if (!category) {
      return NextResponse.json(
        { error: `Unknown category: ${categoryId}` },
        { status: 400 }
      )
    }
    const max = Math.min(body.maxResults ?? 50, 50)
    const windowDays = Math.max(1, Math.min(body.windowDays ?? 14, 90))

    let raw: VideoStats[]
    let mode: "native" | "synthetic"
    if (category.ytCategoryId) {
      mode = "native"
      raw = await getMostPopular({
        regionCode,
        categoryId: category.ytCategoryId,
        maxResults: max,
      })
    } else if (category.synthetic) {
      mode = "synthetic"
      const publishedAfter = new Date(
        Date.now() - windowDays * 86400 * 1000
      ).toISOString()
      const { videoIds } = await searchVideos({
        query: category.synthetic.query,
        maxResults: max,
        publishedAfter,
        videoDuration: "medium",
        order: "viewCount",
        regionCode,
      })
      raw = await getVideoStats(videoIds)
    } else {
      return NextResponse.json(
        { error: `Category ${categoryId} has no source` },
        { status: 500 }
      )
    }

    const longForm = raw.filter(isLongForm)
    const uniqueChannels = Array.from(new Set(longForm.map((v) => v.channelId)))

    const channelData = await Promise.all(
      uniqueChannels.map(async (cid) => {
        try {
          const [info, uploads] = await Promise.all([
            getChannelInfo(cid),
            getChannelUploads(cid, 30),
          ])
          return {
            cid,
            subs: info.subscriberCount,
            median: computeChannelBaseline(uploads).median,
          }
        } catch {
          return { cid, subs: 0, median: 0 }
        }
      })
    )
    const map = new Map(channelData.map((c) => [c.cid, c]))

    const enriched: OutlierVideo[] = longForm.map((v) => {
      const ch = map.get(v.channelId)
      return computeOutlier(v, ch?.median ?? 0, ch?.subs)
    })

    // For the trending feed, keep the chart order primary (it's what's hot)
    // but expose outlier scores so the user can spot the *replicable* hits.
    return NextResponse.json({
      category: { id: category.id, label: category.label, mode },
      regionCode,
      windowDays: mode === "synthetic" ? windowDays : undefined,
      videos: enriched,
    })
  } catch (err) {
    if (err instanceof QuotaExhaustedError) {
      return NextResponse.json(
        { error: err.message, code: "QUOTA_EXHAUSTED" },
        { status: 429 }
      )
    }
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
