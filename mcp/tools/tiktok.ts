/**
 * TikTok account research.
 *
 * Same thesis as the YouTube side — rank a post against the account's own
 * baseline, not against the whole platform — adapted to what short-form data
 * can actually support.
 *
 * Two honest limits shape everything here:
 *  1. There is no free hashtag, keyword, or trending feed. A run has to start
 *     from accounts you name.
 *  2. Public counts are rounded, and the step jumps to 100,000 above a million.
 *     So scores are shown to one decimal, ties are broken on engagement rather
 *     than left to arbitrary order, and coarse numbers are marked.
 */
import { z } from "zod"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import {
  fetchAccountPosts,
  isCoarse,
  parseAccount,
  type TikTokPost,
} from "../../lib/tiktok"
import { clamp, compact, guard, text, truncate } from "../lib/text"

/**
 * Median of the bottom 80%, matching the YouTube baseline so a "5x" means the
 * same thing on both sides of the app. Trimming the top stops an account's own
 * viral hits from inflating the bar they are measured against.
 */
function baseline(posts: TikTokPost[]): number {
  const views = posts.map((p) => p.views).sort((a, b) => a - b)
  if (views.length === 0) return 0
  const keep = Math.max(1, Math.floor(views.length * 0.8))
  const bottom = views.slice(0, keep)
  const mid = Math.floor(bottom.length / 2)
  return bottom.length % 2 === 0 ? (bottom[mid - 1] + bottom[mid]) / 2 : bottom[mid]
}

/** Shares and saves signal "worth passing on" far better than likes do. */
function engagementRate(p: TikTokPost): number {
  if (p.views <= 0) return 0
  return (p.likes + p.comments + p.shares + p.saves) / p.views
}

function daysOld(iso: string): number {
  return Math.max(1, (Date.now() - new Date(iso).getTime()) / 86400000)
}

export function registerTikTokTools(server: McpServer) {
  server.registerTool(
    "tiktok_account_outliers",
    {
      title: "Rank a TikTok account's posts by outlier score",
      description:
        "Read a public TikTok account's recent posts and rank them by views against that account's own " +
        "median — the short-form version of the YouTube outlier score. Use it to see which of a creator's " +
        "posts actually broke out, and what they had in common. " +
        "Works logged out with no API key. NOTE: TikTok offers no free hashtag/keyword/trending search, " +
        "so you must name an account; there is no way to browse the platform at large.",
      inputSchema: {
        account: z.string().describe("@handle, username, or a tiktok.com profile/video URL"),
        lookback: z
          .number()
          .optional()
          .describe(
            "How many recent posts form the baseline, 15-300 (default 45). Scores are only comparable across runs that used the same lookback."
          ),
        limit: z.number().optional().describe("Max rows to return (default 20)"),
        minOutlier: z.number().optional().describe("Only show posts at or above this multiple"),
        sort: z
          .enum(["outlier", "views", "engagement", "recent"])
          .optional()
          .describe("Ranking (default outlier)"),
      },
    },
    guard(async (a) => {
      const username = parseAccount(a.account)
      const lookback = clamp(a.lookback, 15, 300, 45)
      const { account, posts, truncated } = await fetchAccountPosts(username, lookback)

      if (posts.length === 0) {
        throw new Error(`@${username} returned no public posts.`)
      }

      const median = baseline(posts)
      const scored = posts.map((p) => ({
        post: p,
        score: median > 0 ? p.views / median : 0,
        er: engagementRate(p),
        velocity: p.views / daysOld(p.createdAt),
      }))

      const sort = a.sort ?? "outlier"
      scored.sort((x, y) => {
        if (sort === "views") return y.post.views - x.post.views
        if (sort === "engagement") return y.er - x.er
        if (sort === "recent") {
          return new Date(y.post.createdAt).getTime() - new Date(x.post.createdAt).getTime()
        }
        // Rounded view counts produce real ties; engagement breaks them on merit
        // rather than leaving order to chance.
        const d = y.score - x.score
        return Math.abs(d) > 1e-9 ? d : y.er - x.er
      })

      const filtered =
        a.minOutlier === undefined ? scored : scored.filter((s) => s.score >= a.minOutlier!)
      const shown = filtered.slice(0, clamp(a.limit, 1, 100, 20))
      const anyCoarse = shown.some((s) => isCoarse(s.post.views))

      const rows = shown.map((s) => {
        const p = s.post
        return [
          `${s.score.toFixed(1)}x${isCoarse(p.views) ? "~" : ""}`,
          compact(p.views),
          `${(s.er * 100).toFixed(1)}%`,
          compact(p.shares),
          compact(p.saves),
          p.createdAt.slice(0, 10),
          truncate(p.description || "(no caption)", 60).replace(/\|/g, "/"),
          p.id,
        ].join(" | ")
      })

      return text(
        [
          `## @${account.username}${account.verified ? " ✓" : ""} — ${account.nickname}`,
          `${compact(account.followers)} followers · ${account.totalVideos} posts total`,
          `Baseline: **${compact(median)}** median views over the last ${posts.length} posts` +
            (truncated ? ` (of ${account.totalVideos} — a slice, not the full catalogue)` : " (full catalogue)"),
          "",
          "score | views | eng | shares | saves | date | caption | id",
          "---|---|---|---|---|---|---|---",
          ...rows,
          "",
          filtered.length > shown.length
            ? `_${filtered.length - shown.length} more matched; raise limit to see them._`
            : "",
          anyCoarse
            ? "_`~` marks counts TikTok rounds to the nearest 100k — those scores carry up to ±5% error, so treat close ranks as equal._"
            : "",
          "",
          "**eng** = (likes+comments+shares+saves)/views. In short-form, shares and saves predict reach " +
            "better than likes: they are what push a post beyond its current audience.",
          truncated
            ? `\n_Baseline used ${posts.length} of ${account.totalVideos} posts. A deeper lookback moves the median and therefore every score — keep it fixed when comparing runs._`
            : "",
        ]
          .filter(Boolean)
          .join("\n")
      )
    })
  )

  server.registerTool(
    "tiktok_account_summary",
    {
      title: "Profile an account's posting pattern",
      description:
        "Cadence, typical length, engagement, and how consistent an account's reach is. Use it to judge " +
        "whether a creator is a good model to study before spending time on their individual posts.",
      inputSchema: {
        account: z.string().describe("@handle, username, or profile URL"),
        lookback: z.number().optional().describe("Posts to profile, 15-300 (default 60)"),
      },
    },
    guard(async (a) => {
      const username = parseAccount(a.account)
      const lookback = clamp(a.lookback, 15, 300, 60)
      const { account, posts, truncated } = await fetchAccountPosts(username, lookback)
      if (posts.length === 0) throw new Error(`@${username} returned no public posts.`)

      const median = baseline(posts)
      const views = posts.map((p) => p.views).sort((x, y) => x - y)
      const spanDays =
        (new Date(posts[0].createdAt).getTime() -
          new Date(posts[posts.length - 1].createdAt).getTime()) /
        86400000
      const perWeek = spanDays > 0 ? (posts.length / spanDays) * 7 : 0
      const avgDuration = posts.reduce((s, p) => s + p.durationSeconds, 0) / posts.length
      const avgEr = posts.reduce((s, p) => s + engagementRate(p), 0) / posts.length
      const breakouts = posts.filter((p) => median > 0 && p.views / median >= 3).length

      return text(
        [
          `## @${account.username}${account.verified ? " ✓" : ""} — ${account.nickname}`,
          `${compact(account.followers)} followers · ${account.totalVideos} posts total`,
          "",
          `- **Cadence**: ${perWeek.toFixed(1)} posts/week over the last ${Math.round(spanDays)} days`,
          `- **Typical length**: ${avgDuration.toFixed(0)}s average`,
          `- **Median views**: ${compact(median)} (bottom-80% baseline)`,
          `- **Range**: ${compact(views[0])} low → ${compact(views[views.length - 1])} high`,
          `- **Reach vs audience**: ${account.followers > 0 ? (median / account.followers).toFixed(2) : "?"}x followers per median post`,
          `- **Average engagement**: ${(avgEr * 100).toFixed(1)}%`,
          `- **Breakouts (≥3x)**: ${breakouts} of ${posts.length} posts`,
          "",
          breakouts === 0
            ? "_No post cleared 3x its own baseline — this account is consistent rather than spiky. Less to learn about breakout mechanics here._"
            : `_${breakouts} posts broke out. Run tiktok_account_outliers to see which, then transcribe_clip the best of them._`,
          truncated ? `\n_Profiled ${posts.length} of ${account.totalVideos} posts._` : "",
        ]
          .filter(Boolean)
          .join("\n")
      )
    })
  )
}
