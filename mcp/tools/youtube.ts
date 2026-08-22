/**
 * YouTube research tools.
 *
 * These re-expose the exact scoring the /discover routes use, so a number the
 * model quotes here matches what the web UI shows for the same input.
 */
import { z } from "zod"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import {
  getChannelInfo,
  getChannelUploads,
  getMostPopular,
  getQuotaStatus,
  getVideoStats,
  resolveChannelId,
  searchVideos,
} from "../../lib/youtube-data"
import {
  computeChannelBaseline,
  computeOutlier,
  isLongForm,
} from "../../lib/outlier"
import {
  analyzeTitle,
  engagementRate,
  titleSimilarity,
} from "../../lib/title-heuristics"
import { TRENDING_CATEGORIES, findCategory } from "../../lib/trending-categories"
import { extractVideoId } from "../../lib/youtube-url"
import type { OutlierVideo, VideoStats } from "../../lib/youtube-data.types"
import {
  clamp,
  compact,
  duration,
  guard,
  text,
  truncate,
  videoDetail,
  videoTable,
} from "../lib/text"

/**
 * Scores a flat list of videos against each one's own channel baseline.
 * Shared by every search-driven tool. Channel lookups are cached, so the
 * repeated getChannelUploads calls collapse across tools within a session.
 */
async function enrichWithChannelBaselines(
  videos: VideoStats[]
): Promise<OutlierVideo[]> {
  const channelIds = Array.from(new Set(videos.map((v) => v.channelId)))
  const entries = await Promise.all(
    channelIds.map(async (cid) => {
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
  const map = new Map(entries.map((e) => [e.cid, e]))
  return videos.map((v) => {
    const ch = map.get(v.channelId)
    return computeOutlier(v, ch?.median ?? 0, ch?.subs)
  })
}

function header(lines: (string | null | undefined | false)[]): string {
  return lines.filter(Boolean).join("\n")
}

export function registerYouTubeTools(server: McpServer) {
  server.registerTool(
    "yt_channel_outliers",
    {
      title: "Channel deep-dive",
      description:
        "Rank one channel's recent long-form uploads by outlier score (views divided by channel median). " +
        "Use this to find which of a creator's videos overperformed their own baseline — the ones worth tearing down. " +
        "Accepts a channel URL, @handle, or UC id.",
      inputSchema: {
        channel: z.string().describe("Channel URL, @handle, or UC channel id"),
        lookbackVideos: z
          .number()
          .optional()
          .describe("How many recent uploads to consider (5-50, default 30)"),
        limit: z.number().optional().describe("Max rows to return (default 25)"),
      },
    },
    guard(async ({ channel, lookbackVideos, limit }) => {
      const lookback = clamp(lookbackVideos, 5, 50, 30)
      const channelId = await resolveChannelId(channel)
      const [info, uploads] = await Promise.all([
        getChannelInfo(channelId),
        getChannelUploads(channelId, lookback),
      ])
      const longForm = uploads.filter(isLongForm)
      const baseline = computeChannelBaseline(longForm)
      const videos = longForm
        .map((v) => computeOutlier(v, baseline.median, info.subscriberCount))
        .sort((a, b) => b.outlier_score - a.outlier_score)
        .slice(0, clamp(limit, 1, 50, 25))

      return text(
        header([
          `## ${info.title} — ${compact(info.subscriberCount)} subs, ${info.videoCount.toLocaleString()} videos`,
          `Baseline (median views of the bottom 80% of ${baseline.considered_video_count} long-form uploads): **${compact(baseline.median)}**`,
          "",
          videoTable(videos),
        ])
      )
    })
  )

  server.registerTool(
    "yt_keyword_outliers",
    {
      title: "Keyword search ranked by outlier score",
      description:
        "Search YouTube and rank results by how far each video beat its OWN channel median — not by raw views. " +
        "This surfaces replicable hits instead of just big channels. Use it to research a topic before scripting.",
      inputSchema: {
        query: z.string().describe("Search query, as a viewer would type it"),
        maxResults: z
          .number()
          .optional()
          .describe("Search breadth, 1-50 (default 50)"),
        publishedAfter: z
          .string()
          .optional()
          .describe("ISO date lower bound, e.g. 2025-01-01T00:00:00Z"),
        regionCode: z.string().optional().describe("2-letter region, e.g. US, FR"),
        relevanceLanguage: z
          .string()
          .optional()
          .describe("2-letter language, e.g. en, fr"),
        videoDuration: z
          .enum(["any", "medium", "long"])
          .optional()
          .describe("Default medium (4-20 min)"),
        minOutlier: z
          .number()
          .optional()
          .describe("Drop videos below this multiple of channel median"),
        maxChannelSubs: z
          .number()
          .optional()
          .describe("Drop videos from channels bigger than this"),
        limit: z.number().optional().describe("Max rows to return (default 25)"),
      },
    },
    guard(async (a) => {
      const { videoIds } = await searchVideos({
        query: a.query,
        maxResults: clamp(a.maxResults, 1, 50, 50),
        publishedAfter: a.publishedAfter,
        regionCode: a.regionCode,
        relevanceLanguage: a.relevanceLanguage,
        videoDuration: a.videoDuration ?? "medium",
        order: "viewCount",
      })
      const stats = (await getVideoStats(videoIds)).filter(isLongForm)
      let enriched = await enrichWithChannelBaselines(stats)
      if (a.minOutlier !== undefined) {
        enriched = enriched.filter((v) => v.outlier_score >= a.minOutlier!)
      }
      if (a.maxChannelSubs !== undefined) {
        enriched = enriched.filter(
          (v) => (v.channel_subscribers ?? Infinity) <= a.maxChannelSubs!
        )
      }
      enriched.sort((x, y) => y.outlier_score - x.outlier_score)
      const shown = enriched.slice(0, clamp(a.limit, 1, 50, 25))
      return text(
        header([
          `## "${a.query}" — ${enriched.length} long-form results scored, showing ${shown.length}`,
          "",
          videoTable(shown),
        ])
      )
    })
  )

  server.registerTool(
    "yt_small_breakouts",
    {
      title: "Small-channel breakouts",
      description:
        "Find videos in a niche where a SMALL channel had an outsized hit. These carry the most replicable lessons — " +
        "the video won on idea and packaging, not on an existing audience. Best starting point for a new topic.",
      inputSchema: {
        query: z.string().describe("Niche / topic query"),
        maxChannelSubs: z
          .number()
          .optional()
          .describe("Subscriber ceiling (default 100000)"),
        minOutlier: z
          .number()
          .optional()
          .describe("Minimum outlier multiple (default 5)"),
        publishedAfter: z.string().optional().describe("ISO date lower bound"),
        maxResults: z
          .number()
          .optional()
          .describe("Search breadth, 1-50 (default 50)"),
        limit: z.number().optional().describe("Max rows to return (default 25)"),
      },
    },
    guard(async (a) => {
      const maxSubs = a.maxChannelSubs ?? 100_000
      const minOutlier = a.minOutlier ?? 5
      const { videoIds } = await searchVideos({
        query: a.query,
        maxResults: clamp(a.maxResults, 1, 50, 50),
        publishedAfter: a.publishedAfter,
        videoDuration: "medium",
        order: "viewCount",
      })
      const stats = (await getVideoStats(videoIds)).filter(isLongForm)
      const enriched = (await enrichWithChannelBaselines(stats))
        .filter(
          (v) =>
            v.outlier_score >= minOutlier &&
            (v.channel_subscribers ?? Infinity) <= maxSubs
        )
        .sort((x, y) => y.outlier_score - x.outlier_score)
      const shown = enriched.slice(0, clamp(a.limit, 1, 50, 25))
      return text(
        header([
          `## Breakouts for "${a.query}" (max ${compact(maxSubs)} subs, min ${minOutlier}x) — ${enriched.length} found`,
          enriched.length === 0
            ? "\n_Nothing cleared the bar. Loosen minOutlier or raise maxChannelSubs._"
            : "",
          "",
          videoTable(shown),
        ])
      )
    })
  )

  server.registerTool(
    "yt_trending",
    {
      title: "Trending feed with outlier scores",
      description:
        "YouTube's trending chart for a category/region, annotated with outlier scores so you can tell a genuine " +
        "breakout from a big channel's normal Tuesday. Categories: " +
        TRENDING_CATEGORIES.map((c) => c.id).join(", "),
      inputSchema: {
        categoryId: z.string().optional().describe("Category id (default sports)"),
        regionCode: z.string().optional().describe("2-letter region (default US)"),
        maxResults: z.number().optional().describe("1-50 (default 50)"),
        windowDays: z
          .number()
          .optional()
          .describe(
            "Only for synthetic categories (fitness/ai/cooking): 1-90, default 14"
          ),
        limit: z.number().optional().describe("Max rows to return (default 25)"),
      },
    },
    guard(async (a) => {
      const regionCode = (a.regionCode ?? "US").toUpperCase()
      const category = findCategory(a.categoryId ?? "sports")
      if (!category) {
        throw new Error(
          `Unknown category "${a.categoryId}". Valid: ${TRENDING_CATEGORIES.map((c) => c.id).join(", ")}`
        )
      }
      const max = clamp(a.maxResults, 1, 50, 50)
      const windowDays = clamp(a.windowDays, 1, 90, 14)

      let raw: VideoStats[]
      let mode: string
      if (category.ytCategoryId) {
        mode = "native trending chart"
        raw = await getMostPopular({
          regionCode,
          categoryId: category.ytCategoryId,
          maxResults: max,
        })
      } else if (category.synthetic) {
        mode = `synthetic keyword search, last ${windowDays}d`
        const { videoIds } = await searchVideos({
          query: category.synthetic.query,
          maxResults: max,
          publishedAfter: new Date(
            Date.now() - windowDays * 86400_000
          ).toISOString(),
          videoDuration: "medium",
          order: "viewCount",
          regionCode,
        })
        raw = await getVideoStats(videoIds)
      } else {
        throw new Error(`Category ${category.id} has no source configured`)
      }

      const enriched = (
        await enrichWithChannelBaselines(raw.filter(isLongForm))
      ).sort((x, y) => y.outlier_score - x.outlier_score)
      return text(
        header([
          `## Trending — ${category.label} / ${regionCode} (${mode})`,
          "Sorted by outlier score, not chart position.",
          "",
          videoTable(enriched.slice(0, clamp(a.limit, 1, 50, 25))),
        ])
      )
    })
  )

  server.registerTool(
    "yt_hit_vs_flop",
    {
      title: "Hit vs flop pairs on one channel",
      description:
        "Pair a channel's outliers with its flops on similar topics. Same creator, same production quality — " +
        "so the difference is script and packaging. The cleanest natural experiment available for learning what works.",
      inputSchema: {
        channel: z.string().describe("Channel URL, @handle, or UC id"),
        minOutlier: z
          .number()
          .optional()
          .describe("Outlier threshold for the hit side (default 3)"),
        lookbackVideos: z
          .number()
          .optional()
          .describe("Uploads to consider, 10-50 (default 40)"),
      },
    },
    guard(async (a) => {
      const lookback = clamp(a.lookbackVideos, 10, 50, 40)
      const minOutlier = a.minOutlier ?? 3
      const channelId = await resolveChannelId(a.channel)
      const [info, uploads] = await Promise.all([
        getChannelInfo(channelId),
        getChannelUploads(channelId, lookback),
      ])
      const longForm = uploads.filter(isLongForm)
      const baseline = computeChannelBaseline(longForm)
      const scored = longForm
        .map((v) => computeOutlier(v, baseline.median, info.subscriberCount))
        .sort((x, y) => y.outlier_score - x.outlier_score)

      const outliers = scored.filter((v) => v.outlier_score >= minOutlier)
      const flops = scored
        .filter((v) => v.outlier_score < 1)
        .sort((x, y) => x.outlier_score - y.outlier_score)
        .slice(0, 10)

      const used = new Set<string>()
      const pairs: string[] = []
      for (const hit of outliers) {
        let best: { f: OutlierVideo; sim: number } | null = null
        for (const f of flops) {
          if (used.has(f.videoId)) continue
          const sim = titleSimilarity(hit.title, f.title)
          if (!best || sim > best.sim) best = { f, sim }
        }
        if (!best || best.sim <= 0) continue
        used.add(best.f.videoId)
        pairs.push(
          [
            `### ${hit.outlier_score.toFixed(1)}x vs ${best.f.outlier_score.toFixed(2)}x (title overlap ${(best.sim * 100).toFixed(0)}%)`,
            `- HIT  ${compact(hit.views)} views · ${duration(hit.duration_seconds)} · ${hit.videoId} — ${truncate(hit.title, 90)}`,
            `- FLOP ${compact(best.f.views)} views · ${duration(best.f.duration_seconds)} · ${best.f.videoId} — ${truncate(best.f.title, 90)}`,
          ].join("\n")
        )
      }

      return text(
        header([
          `## ${info.title} — hit vs flop`,
          `Baseline ${compact(baseline.median)} views · ${outliers.length} hits at or above ${minOutlier}x · ${flops.length} flops below 1x`,
          "",
          pairs.length
            ? pairs.join("\n\n")
            : "_No topic-similar pairs found. Try a larger lookbackVideos._",
        ])
      )
    })
  )

  server.registerTool(
    "yt_video_info",
    {
      title: "Single video stats + packaging signals",
      description:
        "Full stats for one video plus its outlier score against its channel, engagement rate, and title-pattern " +
        "signals. Use before deciding whether a video is worth a full Gemini teardown.",
      inputSchema: {
        video: z
          .string()
          .describe(
            "YouTube URL, youtu.be link, /shorts/ link, or bare 11-char video id"
          ),
        includeDescription: z
          .boolean()
          .optional()
          .describe("Include the full description (default false)"),
      },
    },
    guard(async (a) => {
      const videoId = extractVideoId(a.video)
      if (!videoId) {
        throw new Error(`Could not parse a YouTube video id from "${a.video}"`)
      }
      const [video] = await getVideoStats([videoId])
      if (!video) throw new Error(`Video not found: ${videoId}`)

      let outlierLine = "_Channel baseline unavailable._"
      try {
        const [info, uploads] = await Promise.all([
          getChannelInfo(video.channelId),
          getChannelUploads(video.channelId, 30),
        ])
        const baseline = computeChannelBaseline(uploads)
        const o = computeOutlier(video, baseline.median, info.subscriberCount)
        outlierLine = `- **outlier: ${o.outlier_score.toFixed(1)}x** channel median (${compact(baseline.median)}) · ${compact(info.subscriberCount)} subs · ${compact(o.velocity)} views/day`
      } catch {
        // Baseline is a nice-to-have; the stats above still stand.
      }

      const t = analyzeTitle(video.title)
      const er = engagementRate(video.likes, video.comments, video.views)
      return text(
        header([
          videoDetail(video),
          outlierLine,
          `- engagement: ${(er * 100).toFixed(2)}% ((likes+comments)/views)`,
          `- title signals: ${t.patterns.length ? t.patterns.join(", ") : "none detected"}`,
          a.includeDescription && video.description
            ? `\n**Description**\n\n${truncate(video.description, 2000)}`
            : null,
        ])
      )
    })
  )

  server.registerTool(
    "yt_quota",
    {
      title: "YouTube API quota status",
      description:
        "Estimated remaining YouTube Data API quota per configured key. Check this if searches start failing — " +
        "each search costs 100 units of a 10,000/day per-project budget.",
      inputSchema: {},
    },
    guard(async () => {
      const status = getQuotaStatus()
      if (status.length === 0) {
        return text(
          "No YouTube API keys configured (set YOUTUBE_API_KEY_1 in .env.local)."
        )
      }
      return text(
        [
          "key | used | remaining | exhausted",
          "---|---|---|---",
          ...status.map(
            (s) =>
              `#${s.keyIndex} | ${s.estimatedUsed} | ${s.estimatedRemaining} | ${s.exhausted ? "YES" : "no"}`
          ),
          "",
          "_Estimates only — counted per process from documented unit costs, reset when the server restarts._",
        ].join("\n")
      )
    })
  )
}
