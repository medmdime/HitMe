/**
 * Instagram account research.
 *
 * Same outlier thesis as YouTube and TikTok, with one adaptation forced by the
 * data: photos carry no view count, so **likes** is the only metric that ranks a
 * whole grid. Views exist for reels, and `metric: "views"` restricts to those.
 *
 * Unlike TikTok, Instagram reports exact counts, so scores here are not blurred
 * by rounding. The trade is that it throttles much sooner — see the lookback
 * guidance below.
 */
import { z } from "zod"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import {
  PROFILE_PAGE,
  fetchAccountPosts,
  parseAccount,
  type InstagramPost,
} from "../../lib/instagram"
import { clamp, compact, guard, text, truncate } from "../lib/text"

/** Median of the bottom 80%, matching the YouTube and TikTok baselines. */
function baselineOf(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  if (sorted.length === 0) return 0
  const keep = Math.max(1, Math.floor(sorted.length * 0.8))
  const bottom = sorted.slice(0, keep)
  const mid = Math.floor(bottom.length / 2)
  return bottom.length % 2 === 0 ? (bottom[mid - 1] + bottom[mid]) / 2 : bottom[mid]
}

function engagementRate(p: InstagramPost, followers: number): number {
  const base = p.views ?? followers
  if (base <= 0) return 0
  return (p.likes + p.comments) / base
}

function kind(p: InstagramPost): string {
  return p.isReel ? "reel" : p.isVideo ? "video" : "photo"
}

export function registerInstagramTools(server: McpServer) {
  server.registerTool(
    "instagram_account_outliers",
    {
      title: "Rank an Instagram account's posts by outlier score",
      description:
        "Read a public Instagram account's recent posts and rank them against that account's own baseline. " +
        "Ranks on LIKES by default because photos carry no view count; pass metric='views' to restrict to " +
        "reels and rank on plays. Works logged out with no API key. " +
        "NOTE: Instagram has no free hashtag, keyword, or explore search — you must name an account. " +
        "Keep lookback at 12 where possible: that costs one request, while deeper scans get throttled quickly.",
      inputSchema: {
        account: z.string().describe("@handle, username, or an instagram.com profile URL"),
        lookback: z
          .number()
          .optional()
          .describe(
            `Posts to read, 12-90 (default ${PROFILE_PAGE}). 12 is a single request; more risks throttling and returns what it got.`
          ),
        metric: z
          .enum(["likes", "views"])
          .optional()
          .describe("likes = every post (default). views = reels only, ranked on plays."),
        limit: z.number().optional().describe("Max rows to return (default 20)"),
        minOutlier: z.number().optional().describe("Only show posts at or above this multiple"),
        type: z
          .enum(["all", "reels", "photos"])
          .optional()
          .describe("Restrict by post type (default all)"),
      },
    },
    guard(async (a) => {
      const username = parseAccount(a.account)
      const lookback = clamp(a.lookback, PROFILE_PAGE, 90, PROFILE_PAGE)
      const metric = a.metric ?? "likes"
      const { account, posts, rateLimited, truncated } = await fetchAccountPosts(username, lookback)

      if (posts.length === 0) throw new Error(`@${username} returned no public posts.`)

      let pool = posts
      if (a.type === "reels") pool = pool.filter((p) => p.isReel)
      else if (a.type === "photos") pool = pool.filter((p) => !p.isVideo)
      if (metric === "views") pool = pool.filter((p) => p.views !== null)

      if (pool.length === 0) {
        throw new Error(
          metric === "views"
            ? `@${username} has no posts with a view count in the last ${posts.length}. Instagram only reports views for videos and reels — use metric='likes' to rank the whole grid.`
            : `No ${a.type} posts in @${username}'s last ${posts.length}.`
        )
      }

      const values = pool.map((p) => (metric === "views" ? (p.views ?? 0) : p.likes))
      const median = baselineOf(values)

      const scored = pool.map((p) => {
        const value = metric === "views" ? (p.views ?? 0) : p.likes
        return {
          post: p,
          value,
          score: median > 0 ? value / median : 0,
          er: engagementRate(p, account.followers),
        }
      })
      scored.sort((x, y) => y.score - x.score || y.er - x.er)

      const filtered =
        a.minOutlier === undefined ? scored : scored.filter((s) => s.score >= a.minOutlier!)
      const shown = filtered.slice(0, clamp(a.limit, 1, 90, 20))

      const rows = shown.map((s) => {
        const p = s.post
        return [
          `${s.score.toFixed(1)}x`,
          compact(p.likes),
          p.views === null ? "—" : compact(p.views),
          compact(p.comments),
          kind(p),
          p.createdAt.slice(0, 10),
          truncate(p.caption || "(no caption)", 52).replace(/\|/g, "/"),
          p.shortcode,
        ].join(" | ")
      })

      const reelCount = posts.filter((p) => p.isReel).length
      return text(
        [
          `## @${account.username}${account.verified ? " ✓" : ""} — ${account.fullName}`,
          `${compact(account.followers)} followers · ${account.totalPosts.toLocaleString()} posts total`,
          `Ranked on **${metric}** · baseline **${compact(median)}** across ${pool.length} posts` +
            (truncated ? ` (a slice of ${account.totalPosts.toLocaleString()}, not the full grid)` : ""),
          "",
          "score | likes | views | comments | type | date | caption | shortcode",
          "---|---|---|---|---|---|---|---",
          ...rows,
          "",
          filtered.length > shown.length
            ? `_${filtered.length - shown.length} more matched; raise limit to see them._`
            : "",
          rateLimited
            ? "\n⚠ Instagram throttled the scan partway, so this covers fewer posts than requested. Results are cached 6h; retry later or drop lookback to 12."
            : "",
          metric === "likes" && reelCount > 0
            ? `\n_Ranked on likes so photos are included. ${reelCount} of these are reels — pass metric='views' to rank those on plays instead, which is the better signal for short-form reach._`
            : "",
          metric === "views"
            ? "\n_Reels only. Instagram reports no view count for photos or carousels, so they cannot be ranked this way._"
            : "",
          "",
          "To tear one down: `transcribe_clip` with its URL (https://www.instagram.com/p/SHORTCODE/).",
        ]
          .filter(Boolean)
          .join("\n")
      )
    })
  )

  server.registerTool(
    "instagram_account_summary",
    {
      title: "Profile an Instagram account's posting pattern",
      description:
        "Cadence, format mix (reels vs photos), engagement, and how spiky an account's reach is. " +
        "Use it to decide whether a creator is worth studying before digging into individual posts.",
      inputSchema: {
        account: z.string().describe("@handle, username, or profile URL"),
        lookback: z.number().optional().describe(`Posts to profile, 12-90 (default ${PROFILE_PAGE})`),
      },
    },
    guard(async (a) => {
      const username = parseAccount(a.account)
      const lookback = clamp(a.lookback, PROFILE_PAGE, 90, PROFILE_PAGE)
      const { account, posts, rateLimited, truncated } = await fetchAccountPosts(username, lookback)
      if (posts.length === 0) throw new Error(`@${username} returned no public posts.`)

      const likeMedian = baselineOf(posts.map((p) => p.likes))
      const reels = posts.filter((p) => p.isReel)
      const photos = posts.filter((p) => !p.isVideo)
      const withViews = posts.filter((p) => p.views !== null)
      const spanDays =
        (new Date(posts[0].createdAt).getTime() -
          new Date(posts[posts.length - 1].createdAt).getTime()) /
        86400000
      const perWeek = spanDays > 0 ? (posts.length / spanDays) * 7 : 0
      const breakouts = posts.filter((p) => likeMedian > 0 && p.likes / likeMedian >= 3).length
      const reelMedianViews = withViews.length ? baselineOf(withViews.map((p) => p.views ?? 0)) : 0

      return text(
        [
          `## @${account.username}${account.verified ? " ✓" : ""} — ${account.fullName}`,
          `${compact(account.followers)} followers · ${account.totalPosts.toLocaleString()} posts total`,
          account.biography ? `\n> ${truncate(account.biography, 200)}` : "",
          "",
          `- **Cadence**: ${perWeek.toFixed(1)} posts/week over the last ${Math.round(spanDays)} days`,
          `- **Format mix**: ${reels.length} reels · ${photos.length} photos · ${posts.length - reels.length - photos.length} other (of ${posts.length})`,
          `- **Median likes**: ${compact(likeMedian)} (${account.followers > 0 ? ((likeMedian / account.followers) * 100).toFixed(2) : "?"}% of followers)`,
          reelMedianViews > 0 ? `- **Median reel views**: ${compact(reelMedianViews)}` : "",
          `- **Breakouts (≥3x likes)**: ${breakouts} of ${posts.length}`,
          "",
          breakouts === 0
            ? "_Nothing cleared 3x its own baseline in this window — a consistent account rather than a spiky one, so there is less to learn here about breakout mechanics._"
            : `_${breakouts} posts broke out. Run instagram_account_outliers to see which._`,
          rateLimited ? "\n⚠ Instagram throttled the scan, so this covers fewer posts than requested." : "",
          truncated ? `\n_Profiled ${posts.length} of ${account.totalPosts.toLocaleString()} posts._` : "",
        ]
          .filter(Boolean)
          .join("\n")
      )
    })
  )
}
