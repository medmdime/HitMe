import type { VideoStats, ChannelBaseline, OutlierVideo } from "./youtube-data.types"

const SHORT_THRESHOLD_SECONDS = 60

export function isLongForm(v: { duration_seconds: number }): boolean {
  return v.duration_seconds >= SHORT_THRESHOLD_SECONDS
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0
  const sorted = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) return (sorted[mid - 1] + sorted[mid]) / 2
  return sorted[mid]
}

function mean(nums: number[]): number {
  if (nums.length === 0) return 0
  return nums.reduce((s, n) => s + n, 0) / nums.length
}

/**
 * Channel baseline: median of the bottom 80% of recent long-form video views.
 * Excluding the top 20% prevents a creator's own outliers from anchoring
 * their baseline upward.
 */
export function computeChannelBaseline(videos: VideoStats[]): ChannelBaseline {
  const longForm = videos.filter(isLongForm)
  if (longForm.length === 0) {
    return { median: 0, mean: 0, considered_video_count: 0 }
  }
  const sortedViews = longForm.map((v) => v.views).sort((a, b) => a - b)
  const keepCount = Math.max(1, Math.floor(sortedViews.length * 0.8))
  const bottom = sortedViews.slice(0, keepCount)
  return {
    median: median(bottom),
    mean: Math.round(mean(bottom)),
    considered_video_count: longForm.length,
  }
}

export function daysSince(iso: string): number {
  const then = new Date(iso).getTime()
  const days = (Date.now() - then) / 86400000
  return Math.max(1, days)
}

export function computeOutlier(
  v: VideoStats,
  baselineMedian: number,
  channelSubs?: number
): OutlierVideo {
  const denom = baselineMedian > 0 ? baselineMedian : 1
  return {
    ...v,
    outlier_score: v.views / denom,
    velocity: v.views / daysSince(v.publishedAt),
    channel_subscribers: channelSubs,
    channel_median: baselineMedian,
  }
}

export type OutlierTier = "normal" | "solid" | "strong" | "banger" | "freak"

export function classifyOutlier(score: number): OutlierTier {
  if (score >= 20) return "freak"
  if (score >= 10) return "banger"
  if (score >= 5) return "strong"
  if (score >= 3) return "solid"
  return "normal"
}

export function tierColor(tier: OutlierTier): {
  bg: string
  text: string
  ring: string
  label: string
} {
  switch (tier) {
    case "freak":
      return {
        bg: "bg-red-500/15",
        text: "text-red-500",
        ring: "ring-red-500/30",
        label: "Freak (20x+)",
      }
    case "banger":
      return {
        bg: "bg-orange-500/15",
        text: "text-orange-500",
        ring: "ring-orange-500/30",
        label: "Banger (10-20x)",
      }
    case "strong":
      return {
        bg: "bg-yellow-500/15",
        text: "text-yellow-500",
        ring: "ring-yellow-500/30",
        label: "Strong (5-10x)",
      }
    case "solid":
      return {
        bg: "bg-emerald-500/15",
        text: "text-emerald-500",
        ring: "ring-emerald-500/30",
        label: "Solid (3-5x)",
      }
    default:
      return {
        bg: "bg-muted",
        text: "text-muted-foreground",
        ring: "ring-border",
        label: "Normal",
      }
  }
}
