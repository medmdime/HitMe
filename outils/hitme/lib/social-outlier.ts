/**
 * Shared scoring for short-form platforms.
 *
 * The web UI and the MCP tools both rank posts, and they must agree — a "5x" in
 * the browser has to mean the same thing as a "5x" in a tool result. Keeping the
 * arithmetic here is what guarantees that.
 *
 * The baseline matches lib/outlier.ts: median of the bottom 80%, so an
 * account's own viral hits do not inflate the bar they are measured against.
 */
import type { InstagramPost } from "./instagram"
import type { TikTokPost } from "./tiktok"

export function socialBaseline(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  if (sorted.length === 0) return 0
  const keep = Math.max(1, Math.floor(sorted.length * 0.8))
  const bottom = sorted.slice(0, keep)
  const mid = Math.floor(bottom.length / 2)
  return bottom.length % 2 === 0 ? (bottom[mid - 1] + bottom[mid]) / 2 : bottom[mid]
}

function daysOld(iso: string): number {
  return Math.max(1, (Date.now() - new Date(iso).getTime()) / 86400000)
}

export interface ScoredTikTokPost extends TikTokPost {
  outlier_score: number
  engagement_rate: number
  velocity: number
  /** True when TikTok's rounding makes this count imprecise enough to matter. */
  coarse: boolean
}

/** Shares and saves signal "worth passing on" better than likes do. */
function tiktokEngagement(p: TikTokPost): number {
  if (p.views <= 0) return 0
  return (p.likes + p.comments + p.shares + p.saves) / p.views
}

export function scoreTikTokPosts(posts: TikTokPost[]): {
  scored: ScoredTikTokPost[]
  baseline: number
} {
  const baseline = socialBaseline(posts.map((p) => p.views))
  const scored = posts.map((p) => ({
    ...p,
    outlier_score: baseline > 0 ? p.views / baseline : 0,
    engagement_rate: tiktokEngagement(p),
    velocity: p.views / daysOld(p.createdAt),
    // Above a million TikTok rounds to the nearest 100k, so a post just over
    // the line can be off by ~5%.
    coarse: p.views >= 1_000_000,
  }))
  // Rounded counts produce genuine ties; engagement breaks them on merit.
  scored.sort((a, b) => {
    const d = b.outlier_score - a.outlier_score
    return Math.abs(d) > 1e-9 ? d : b.engagement_rate - a.engagement_rate
  })
  return { scored, baseline }
}

export type InstagramMetric = "likes" | "views"

export interface ScoredInstagramPost extends InstagramPost {
  outlier_score: number
  engagement_rate: number
  /** The number this post was ranked on, given the chosen metric. */
  metric_value: number
}

export function scoreInstagramPosts(
  posts: InstagramPost[],
  metric: InstagramMetric,
  followers: number
): { scored: ScoredInstagramPost[]; baseline: number } {
  // Views only exist on videos, so that metric necessarily drops photos.
  const pool = metric === "views" ? posts.filter((p) => p.views !== null) : posts
  const valueOf = (p: InstagramPost) => (metric === "views" ? (p.views ?? 0) : p.likes)
  const baseline = socialBaseline(pool.map(valueOf))

  const scored = pool.map((p) => {
    const value = valueOf(p)
    // Reach is the honest denominator when we have it; followers stand in for
    // photos, where Instagram publishes no view count at all.
    const reach = p.views ?? followers
    return {
      ...p,
      metric_value: value,
      outlier_score: baseline > 0 ? value / baseline : 0,
      engagement_rate: reach > 0 ? (p.likes + p.comments) / reach : 0,
    }
  })
  scored.sort((a, b) => b.outlier_score - a.outlier_score || b.engagement_rate - a.engagement_rate)
  return { scored, baseline }
}

export type SocialTier = "normal" | "solid" | "strong" | "banger" | "freak"

/** Same thresholds as the YouTube tiers, so the whole app reads consistently. */
export function classifySocial(score: number): SocialTier {
  if (score >= 20) return "freak"
  if (score >= 10) return "banger"
  if (score >= 5) return "strong"
  if (score >= 3) return "solid"
  return "normal"
}
