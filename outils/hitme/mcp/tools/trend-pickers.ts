/**
 * Trend pickers.
 *
 * The other research tools need a starting point — a channel, an account. This
 * one starts from topics and returns the videos that prove a format works
 * without an audience behind it: 50K+ views, on an account under 5K followers,
 * in the last two weeks.
 *
 * It is the only research tool that costs money per call (see lib/apify.ts), so
 * its output always says whether a scan was fresh or answered from disk, and
 * every search is kept: trend_pickers_history reads them back for free, and the
 * same list is the "Previous searches" panel of the /discover tab.
 */
import { z } from "zod"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { findTrendPickers, getSavedSearch, listSavedSearches } from "../../lib/trend-pickers"
import {
  DEFAULT_TREND_TOPICS,
  TREND_MAX_FOLLOWERS,
  TREND_MAX_SECONDS,
  TREND_MAX_TOPICS,
  TREND_MIN_VIEWS,
  TREND_RESULTS_PER_TOPIC,
  TREND_RESULTS_PER_TOPIC_MAX,
  TREND_WINDOW_DAYS,
  lengthBuckets,
  repeatAccounts,
  sortTrendPicks,
  type PlatformReport,
  type TrendPick,
  type TrendPickerResult,
  type TrendPickerRun,
  type TrendSort,
} from "../../lib/trend-criteria"
import { age, clamp, compact, duration, guard, text, truncate } from "../lib/text"

/** age() says "new" under an hour, which reads oddly in a sentence. */
function ago(iso: string): string {
  const a = age(iso)
  return a === "new" ? "under 1h ago" : `${a} ago`
}

function sourceLine(r: PlatformReport): string {
  if (!r.fetched_at) return "did not run"
  return r.cached ? `stored copy, fetched ${ago(r.fetched_at)} (nothing billed)` : "fresh scan (billed)"
}

function pickRow(p: TrendPick): string {
  return [
    p.platform,
    compact(p.views),
    compact(p.followers),
    `${compact(p.views_per_follower)}x`,
    compact(p.velocity),
    p.durationSeconds > 0 ? duration(p.durationSeconds) : "?",
    p.language ?? "?",
    p.createdAt.slice(0, 10),
    `@${p.author}`,
    truncate(p.caption || "(no caption)", 60).replace(/\|/g, "/"),
    p.url,
  ].join(" | ")
}

function bars(c: TrendPickerResult["criteria"]): string {
  return (
    `${compact(c.minViews)}${c.maxViews === null ? "+" : `–${compact(c.maxViews)}`} views · ` +
    `${compact(c.maxFollowers)} followers or fewer` +
    (c.maxSeconds ? ` · ${duration(c.maxSeconds)} or shorter` : "")
  )
}

function renderSearch(result: TrendPickerRun, sort: TrendSort, limit: number, replay: boolean): string {
  const { window, criteria: c } = result
  const picks = sortTrendPicks(result.picks, sort)
  const shown = picks.slice(0, limit)
  const lengths = lengthBuckets(picks)
  const repeats = repeatAccounts(picks)
  const errors = result.platforms.filter((r) => r.error)
  const unknown = result.platforms.reduce((s, r) => s + r.followers_unknown, 0)
  const tooLong = result.platforms.reduce((s, r) => s + (r.too_long ?? 0), 0)

  return [
    `## Trend pickers — ${window.from} → ${window.to} (${window.days} days)`,
    `${bars(c)} · topics: ${c.topics.join(", ")}`,
    replay
      ? `_Saved search \`${result.id}\`, run ${ago(result.ranAt)} by the ${result.source}. Read from disk: nothing billed, numbers as they were then._`
      : result.id
        ? `_Saved as search \`${result.id}\`: it is listed under Previous searches in the /discover tab, and trend_pickers_history reads it back for free._`
        : null,
    "",
    "platform | returned | in window | views ok | picks | source",
    "---|---|---|---|---|---",
    ...result.platforms.map((r) =>
      [r.platform, r.fetched, r.in_window, r.views_ok, r.picks, replay ? "saved" : sourceLine(r)].join(" | ")
    ),
    ...errors.map((r) => `\n**${r.platform} failed**: ${r.error}`),
    unknown > 0
      ? `\n_${unknown} videos cleared views and window but their account's follower count could not be read, so they are left out._`
      : null,
    tooLong > 0 && c.maxSeconds
      ? `\n_${tooLong} videos cleared views and window but run longer than ${duration(c.maxSeconds)}, so they are left out (maxSeconds lifts the cap)._`
      : null,
    "",
    picks.length === 0
      ? "_No video cleared every bar. Look at the funnel above: a low **in window** means the search returned " +
        "old videos (raise resultsPerTopic); a low **views ok** means the topic is small (try a broader one); " +
        "a healthy **views ok** with no picks means only big accounts are winning there (raise maxFollowers)._"
      : [
          "platform | views | followers | views/follower | views/day | len | lang | posted | account | caption | url",
          "---|---|---|---|---|---|---|---|---|---|---",
          ...shown.map(pickRow),
        ].join("\n"),
    picks.length > shown.length ? `\n_${picks.length - shown.length} more picks; raise limit to see them._` : null,
    lengths.length > 0 ? `\n**Lengths**: ${lengths.map((b) => `${b.label} ×${b.count}`).join(" · ")}` : null,
    repeats.length > 0
      ? `**Repeat accounts** (more than one pick in the window — a format that repeats, copy these first): ` +
        repeats
          .map((r) => `@${r.author} on ${r.platform}, ${compact(r.followers)} followers, ${r.picks} picks`)
          .join("; ")
      : null,
    picks.length > 0
      ? "\n_Next: `transcribe_clip` with a pick's url for the shot-by-shot script and its topic-agnostic format " +
        "template. `tiktok_account_outliers` or `instagram_account_outliers` on an account shows whether the " +
        "hit was a one-off or their usual format._"
      : null,
  ]
    .filter((l): l is string => l !== null)
    .join("\n")
}

const SORT = z
  .enum(["views", "ratio", "velocity", "recent"])
  .optional()
  .describe("views (default), ratio = views per follower, velocity = views per day, recent")

export function registerTrendPickerTools(server: McpServer) {
  server.registerTool(
    "trend_pickers",
    {
      title: "Trend pickers on TikTok and Instagram",
      description:
        `Find TikTok and Instagram videos that reached ${compact(TREND_MIN_VIEWS)}+ views on an account with fewer ` +
        `than ${compact(TREND_MAX_FOLLOWERS)} followers, inside a window of at most ${TREND_WINDOW_DAYS} days ` +
        "(default: the last two weeks). No audience explains those views, so the format does — these are the " +
        "videos to copy the structure of, on your own subject. Searches by topic, so no account needs naming. " +
        "COSTS MONEY: the search runs on Apify (APIFY_TOKEN) and bills every video returned — on the free plan " +
        "about $6.30 per 1,000 on TikTok and $2.60 on Instagram, so roughly $0.90 for a default scan of both. " +
        "A scan is kept on disk for 6 hours and changing minViews, maxViews or maxFollowers " +
        "re-filters that copy for free; changing topics, dates, platforms or resultsPerTopic pays for a new one. " +
        "Check trend_pickers_history first: the answer may already be saved. " +
        "Slow: a fresh scan takes 1-5 minutes. Follow with transcribe_clip on a pick's url.",
      inputSchema: {
        topics: z
          .array(z.string())
          .optional()
          .describe(
            `Search terms as a viewer would type them, max ${TREND_MAX_TOPICS}. TikTok searches them as typed; ` +
              `Instagram reads each one as a hashtag (spaces and accents removed). Many topics read shallow ` +
              `find more than a few read deep. ` +
              `Default: ${DEFAULT_TREND_TOPICS.join(", ")}`
          ),
        platforms: z
          .array(z.enum(["tiktok", "instagram"]))
          .optional()
          .describe("Default both"),
        from: z
          .string()
          .optional()
          .describe(`Window start, YYYY-MM-DD. Default ${TREND_WINDOW_DAYS} days before \`to\``),
        to: z.string().optional().describe("Window end, YYYY-MM-DD, inclusive. Default today"),
        minViews: z.number().optional().describe(`Default ${TREND_MIN_VIEWS}`),
        maxViews: z
          .number()
          .optional()
          .describe("Upper bound on views, e.g. 100000 for a strict 50-100K band. Default none"),
        maxFollowers: z.number().optional().describe(`Default ${TREND_MAX_FOLLOWERS}`),
        maxSeconds: z
          .number()
          .nullable()
          .optional()
          .describe(`Longest video kept, in seconds (default ${TREND_MAX_SECONDS}: a format to remake as a short). null lifts the cap`),
        resultsPerTopic: z
          .number()
          .optional()
          .describe(
            `Videos requested per topic and per platform, 5-${TREND_RESULTS_PER_TOPIC_MAX} ` +
              `(default ${TREND_RESULTS_PER_TOPIC}). Deeper finds more and costs more`
          ),
        region: z
          .string()
          .optional()
          .describe(
            "2-letter country to run the TikTok search from, e.g. FR. Off by default: it is billed as an add-on on every video"
          ),
        sort: SORT,
        limit: z.number().optional().describe("Max rows to return (default 30)"),
        force: z.boolean().optional().describe("Ignore the stored copy and pay for a fresh scan (default false)"),
      },
    },
    guard(async (a) => {
      const result = await findTrendPickers({
        topics: a.topics,
        platforms: a.platforms,
        from: a.from,
        to: a.to,
        minViews: a.minViews,
        maxViews: a.maxViews,
        maxFollowers: a.maxFollowers,
        maxSeconds: a.maxSeconds,
        resultsPerTopic: a.resultsPerTopic,
        region: a.region,
        force: a.force,
        source: "agent",
      })
      return text(renderSearch(result, a.sort ?? "views", clamp(a.limit, 1, 100, 30), false))
    })
  )

  server.registerTool(
    "trend_pickers_history",
    {
      title: "Previous trend picker searches",
      description:
        "List the trend picker searches already run — from the /discover tab or by any agent — or read one back " +
        "with its picks. Free: it only reads what trend_pickers saved, so use it before paying for a new scan, " +
        "and to pick up a search someone else ran. Without `id` it lists searches, newest first; with `id` it " +
        "returns that search's full table. Numbers are as they were when the search ran.",
      inputSchema: {
        id: z.string().optional().describe("A search id from the list. Omit to list searches"),
        sort: SORT,
        limit: z.number().optional().describe("Max rows: searches when listing (default 20), picks when reading one (default 30)"),
      },
    },
    guard(async (a) => {
      if (a.id) {
        const search = getSavedSearch(a.id.trim())
        if (!search) {
          throw new Error(`No saved search "${a.id}". Call trend_pickers_history without an id to list them.`)
        }
        return text(renderSearch(search, a.sort ?? "views", clamp(a.limit, 1, 100, 30), true))
      }

      const searches = listSavedSearches(clamp(a.limit, 1, 100, 20))
      if (searches.length === 0) {
        return text("No trend picker search has been run yet. `trend_pickers` runs one and saves it.")
      }
      return text(
        [
          `## ${searches.length} saved trend picker searches, newest first`,
          "",
          "id | ran | by | window | bars | topics | picks",
          "---|---|---|---|---|---|---",
          ...searches.map((s) =>
            [
              s.id,
              ago(s.ranAt),
              s.source,
              `${s.window.from} → ${s.window.to}`,
              bars(s.criteria),
              truncate(s.criteria.topics.join(", "), 60).replace(/\|/g, "/"),
              s.platforms.map((r) => `${r.platform} ${r.error ? "failed" : r.picks}`).join(", "),
            ].join(" | ")
          ),
          "",
          "_Pass an `id` to read that search's picks. Nothing here is billed._",
        ].join("\n")
      )
    })
  )
}
