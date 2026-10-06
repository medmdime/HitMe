/**
 * Trend pickers: what counts as one, and the arithmetic around it.
 *
 * A video that reached 50K+ views on an account with fewer than 5K followers
 * did not ride an audience — the format carried it, which makes it the most
 * copyable thing on the platform. The window is short on purpose: a format that
 * popped in the last two weeks is still working today.
 *
 * Nothing here touches the network; the /discover tab imports this file into
 * the browser. The scan itself lives in trend-pickers.ts.
 */

export const TREND_WINDOW_DAYS = 14
export const TREND_MIN_VIEWS = 50_000
export const TREND_MAX_FOLLOWERS = 5_000

/**
 * Longest video kept. The point is a format to remake as a short; the first real
 * scan put a 14-minute eating challenge at the top of the list.
 */
export const TREND_MAX_SECONDS = 180

/**
 * Videos requested per topic and per platform. Each one returned is billed, so
 * the default is sized for one scan a week inside Apify's free $5 a month.
 */
export const TREND_RESULTS_PER_TOPIC = 25
export const TREND_RESULTS_PER_TOPIC_MAX = 100
export const TREND_MAX_TOPICS = 8

/**
 * Apify prices per 1,000 videos on the FREE plan, read from the store listing
 * on 2026-10-06 (paid plans are cheaper). TikTok is the result price ($3.70)
 * plus the two add-ons this scan cannot do without, each billed per video: the
 * date filter ($1.30) and the most-liked sorting ($1.30). The advertised
 * "from $1.70" is the result price alone on the Gold plan.
 * Used to show a figure before a scan and to size the spending cap; the
 * provider's invoice decides.
 */
export const TREND_USD_PER_1000: Record<"tiktok" | "instagram", number> = {
  tiktok: 6.3,
  instagram: 2.6,
}

/** Running the TikTok search from a chosen country is one more add-on per video. */
export const TREND_REGION_USD_PER_1000 = 1.3

export const DEFAULT_TREND_TOPICS = [
  "déficit calorique",
  "perte de poids",
  "calories",
  "prise de masse",
]

export type TrendPlatform = "tiktok" | "instagram"
export const TREND_PLATFORMS: TrendPlatform[] = ["tiktok", "instagram"]

export type TrendSort = "views" | "ratio" | "velocity" | "recent"
export const TREND_SORTS: TrendSort[] = ["views", "ratio", "velocity", "recent"]

/** A video as the provider returned it, before any criterion is applied. */
export interface TrendCandidate {
  platform: TrendPlatform
  id: string
  url: string
  caption: string
  createdAt: string
  durationSeconds: number
  views: number
  likes: number
  comments: number
  /** TikTok only; Instagram does not publish them. */
  shares: number | null
  saves: number | null
  author: string
  authorName: string
  /** Null when the search result does not carry it (Instagram) and it has not been looked up. */
  followers: number | null
  /** The topic that surfaced it, when the provider says which. */
  topic: string | null
  /** Language of the caption as the platform detected it (TikTok only). Absent on scans stored before it was read. */
  language?: string | null
}

export interface TrendPick extends Omit<TrendCandidate, "followers" | "topic"> {
  followers: number
  topics: string[]
  /** How far past its own audience the video travelled. */
  views_per_follower: number
  /** Views per day since it was posted. */
  velocity: number
  engagement_rate: number
}

export interface TrendWindow {
  /** Both ends inclusive, YYYY-MM-DD, UTC. */
  from: string
  to: string
  days: number
}

export interface PlatformReport {
  platform: TrendPlatform
  /** Videos the provider returned. */
  fetched: number
  in_window: number
  views_ok: number
  /** Cleared views and window, but the account's follower count could not be read. */
  followers_unknown: number
  /** Cleared views and window but runs longer than the length cap. Absent on searches saved before the cap existed. */
  too_long?: number
  picks: number
  /** Served from an earlier identical scan kept on disk: nothing new was billed. */
  cached: boolean
  fetched_at: string | null
  /** Set when this platform failed; the other one still reports. */
  error?: string
}

export interface TrendPickerResult {
  window: TrendWindow
  criteria: {
    topics: string[]
    minViews: number
    maxViews: number | null
    maxFollowers: number
    /** Longest video kept, in seconds; null for no cap. Absent on searches saved before the cap existed. */
    maxSeconds?: number | null
    resultsPerTopic: number
    /** Country the TikTok search was run from; null when left to the provider. */
    region: string | null
  }
  platforms: PlatformReport[]
  picks: TrendPick[]
}

/** Who ran a search: the /discover tab, or an agent over MCP. */
export type TrendSearchSource = "app" | "agent"

/**
 * A search as it comes back from a run. `id` is null only when nothing could be
 * kept — every platform failed before returning anything.
 */
export interface TrendPickerRun extends TrendPickerResult {
  id: string | null
  ranAt: string
  source: TrendSearchSource
}

/** A search kept on disk, listed under "Previous searches". */
export interface SavedTrendSearch extends TrendPickerRun {
  id: string
}

/** One line of the history: everything but the picks themselves. */
export interface SavedTrendSearchSummary {
  id: string
  ranAt: string
  source: TrendSearchSource
  window: TrendWindow
  criteria: TrendPickerResult["criteria"]
  platforms: { platform: TrendPlatform; picks: number; error?: string }[]
  picks: number
}

export class TrendInputError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TrendInputError"
  }
}

const DAY_MS = 86_400_000

function parseDay(input: string, label: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(input.trim())
  const ms = m ? Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : NaN
  // Date.UTC rolls 02-31 over into March; refuse instead of guessing.
  if (!m || toDay(ms) !== `${m[1]}-${m[2]}-${m[3]}`) {
    throw new TrendInputError(`${label} must be a YYYY-MM-DD date, got "${input}".`)
  }
  return ms
}

function toDay(ms: number): string {
  return Number.isFinite(ms) ? new Date(ms).toISOString().slice(0, 10) : ""
}

/**
 * The window always has a start and an end. With neither given it is the last
 * two weeks; with only a start it runs two weeks from there, stopping at today.
 */
export function resolveTrendWindow(
  from?: string | null,
  to?: string | null,
  now: number = Date.now()
): TrendWindow {
  const today = Math.floor(now / DAY_MS) * DAY_MS
  const span = TREND_WINDOW_DAYS * DAY_MS

  let fromMs = from?.trim() ? parseDay(from, "from") : null
  let toMs = to?.trim() ? parseDay(to, "to") : null
  if (toMs === null) toMs = fromMs === null ? today : Math.min(today, fromMs + span)
  if (fromMs === null) fromMs = toMs - span

  if (fromMs > toMs) {
    throw new TrendInputError(`The window starts (${toDay(fromMs)}) after it ends (${toDay(toMs)}).`)
  }
  if (fromMs > today) {
    throw new TrendInputError(`The window starts in the future (${toDay(fromMs)}).`)
  }
  const days = Math.round((toMs - fromMs) / DAY_MS)
  if (days > TREND_WINDOW_DAYS) {
    throw new TrendInputError(
      `That window is ${days} days. Trend pickers only look at ${TREND_WINDOW_DAYS} days at a time: ` +
        `a format older than that may already be spent.`
    )
  }
  return { from: toDay(fromMs), to: toDay(toMs), days }
}

/** Start of the first day to the end of the last one, in ms. */
export function windowBounds(w: TrendWindow): { startMs: number; endMs: number } {
  return {
    startMs: parseDay(w.from, "from"),
    endMs: parseDay(w.to, "to") + DAY_MS - 1,
  }
}

/** "Rééquilibrage alimentaire" -> "reequilibragealimentaire": how a topic is written as a hashtag. */
export function toHashtag(topic: string): string {
  return topic
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
}

/** Trims, drops a leading #, removes blanks and case-insensitive repeats. */
export function normalizeTopics(topics: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of topics) {
    const t = raw.replace(/^#+/, "").replace(/\s+/g, " ").trim()
    const key = t.toLowerCase()
    if (!t || seen.has(key)) continue
    seen.add(key)
    out.push(t)
  }
  return out
}

export function sortTrendPicks(picks: TrendPick[], sort: TrendSort): TrendPick[] {
  const key: Record<TrendSort, (p: TrendPick) => number> = {
    views: (p) => p.views,
    ratio: (p) => p.views_per_follower,
    velocity: (p) => p.velocity,
    recent: (p) => new Date(p.createdAt).getTime(),
  }
  return [...picks].sort((a, b) => key[sort](b) - key[sort](a))
}

const LENGTH_BUCKETS: [number, string][] = [
  [20, "under 20 s"],
  [45, "20–45 s"],
  [90, "45–90 s"],
  [Infinity, "over 90 s"],
]

/** How long the picks run — the first thing to copy from a format. */
export function lengthBuckets(picks: TrendPick[]): { label: string; count: number }[] {
  const timed = picks.filter((p) => p.durationSeconds > 0)
  return LENGTH_BUCKETS.map(([max, label], i) => {
    const min = i === 0 ? 0 : LENGTH_BUCKETS[i - 1][0]
    return {
      label,
      count: timed.filter((p) => p.durationSeconds > min && p.durationSeconds <= max).length,
    }
  }).filter((b) => b.count > 0)
}

/**
 * Accounts with more than one pick in the window. One hit can be luck; two in
 * two weeks is a format that repeats, which is the one worth copying first.
 */
export function repeatAccounts(
  picks: TrendPick[]
): { platform: TrendPlatform; author: string; followers: number; picks: number; views: number }[] {
  const byAccount = new Map<string, TrendPick[]>()
  for (const p of picks) {
    const key = `${p.platform}:${p.author.toLowerCase()}`
    byAccount.set(key, [...(byAccount.get(key) ?? []), p])
  }
  return [...byAccount.values()]
    .filter((list) => list.length > 1)
    .map((list) => ({
      platform: list[0].platform,
      author: list[0].author,
      followers: list[0].followers,
      picks: list.length,
      views: list.reduce((s, p) => s + p.views, 0),
    }))
    .sort((a, b) => b.picks - a.picks || b.views - a.views)
}
