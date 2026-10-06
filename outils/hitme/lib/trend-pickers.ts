/**
 * Trend picker scan: search TikTok and Instagram for the topics, then keep the
 * videos that broke out on an account too small to explain it.
 *
 * The search itself is bought from Apify (see apify.ts for why), and every
 * video it returns is billed. Two things follow from that:
 *
 *  - A scan is kept on disk for a few hours. The same topics, window and depth
 *    are answered from that copy, at no charge.
 *  - The copy holds what the provider returned, BEFORE the view and follower
 *    criteria. Moving a threshold re-filters the copy instead of paying again.
 *
 * Separately, every finished search is kept for good under trends/searches/,
 * whoever ran it. That folder is the "Previous searches" list of the /discover
 * tab, and how an agent's scan shows up there: the MCP server and the web app
 * are two processes that share nothing but this disk.
 *
 * Criteria and types live in trend-criteria.ts, which the browser also imports.
 */
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { MissingApifyTokenError, runActor } from "./apify"
import {
  DEFAULT_TREND_TOPICS,
  TREND_MAX_FOLLOWERS,
  TREND_MAX_SECONDS,
  TREND_MAX_TOPICS,
  TREND_MIN_VIEWS,
  TREND_PLATFORMS,
  TREND_RESULTS_PER_TOPIC,
  TREND_RESULTS_PER_TOPIC_MAX,
  TREND_REGION_USD_PER_1000,
  TREND_USD_PER_1000,
  TrendInputError,
  normalizeTopics,
  resolveTrendWindow,
  toHashtag,
  sortTrendPicks,
  windowBounds,
  type PlatformReport,
  type SavedTrendSearch,
  type SavedTrendSearchSummary,
  type TrendCandidate,
  type TrendPick,
  type TrendPickerResult,
  type TrendPickerRun,
  type TrendPlatform,
  type TrendSearchSource,
  type TrendWindow,
} from "./trend-criteria"
import { workspaceDir } from "./workspace"

const TIKTOK_SEARCH = "clockworks~tiktok-scraper"
const INSTAGRAM_SEARCH = "apify~instagram-hashtag-scraper"
const INSTAGRAM_PROFILES = "apify~instagram-profile-scraper"

const DAY_MS = 86_400_000
const SCAN_TTL_MS = 6 * 3_600_000
const FOLLOWERS_TTL_MS = 24 * 3_600_000

/**
 * TikTok topics per Actor run. The first real scan took 383 s for four topics,
 * against a 600 s limit per run; more topics than this go out as parallel runs.
 * Two runs of 4 GB plus Instagram's stay inside the free plan's 16 GB.
 */
const TIKTOK_TOPICS_PER_RUN = 4

/** Instagram accounts looked up per scan; each lookup is billed. */
const MAX_FOLLOWER_LOOKUPS = 80

export interface TrendPickerParams {
  topics?: string[]
  platforms?: TrendPlatform[]
  from?: string
  to?: string
  minViews?: number
  maxViews?: number
  maxFollowers?: number
  /** Longest video kept, in seconds. Null lifts the cap. */
  maxSeconds?: number | null
  resultsPerTopic?: number
  /** 2-letter country to run the TikTok search from. Billed as an add-on; off by default. */
  region?: string
  /** Ignore the stored copy and pay for a fresh scan. */
  force?: boolean
  /** Who is asking; recorded with the saved search. */
  source?: TrendSearchSource
}

// --- On-disk copies ---------------------------------------------------------

interface Stored<T> {
  savedAt: string
  value: T
}

function storeFile(name: string): string {
  return join(resolve(workspaceDir(), "trends"), `${name}.json`)
}

function readStored<T>(name: string): Stored<T> | null {
  const path = storeFile(name)
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Stored<T>
  } catch {
    // a half-written file is the same as no file
    return null
  }
}

function writeStored<T>(name: string, value: T, now: number): string {
  const savedAt = new Date(now).toISOString()
  mkdirSync(resolve(workspaceDir(), "trends"), { recursive: true })
  writeFileSync(storeFile(name), JSON.stringify({ savedAt, value } satisfies Stored<T>), "utf8")
  return savedAt
}

function isFresh(savedAt: string, ttlMs: number, now: number): boolean {
  const age = now - new Date(savedAt).getTime()
  return age >= 0 && age < ttlMs
}

function listPrice(platform: TrendPlatform, videos: number): number {
  return (videos / 1000) * TREND_USD_PER_1000[platform]
}

// --- TikTok -----------------------------------------------------------------

interface TikTokItem {
  id?: string
  text?: string
  createTime?: number
  createTimeISO?: string
  playCount?: number
  diggCount?: number
  shareCount?: number
  commentCount?: number
  collectCount?: number
  webVideoUrl?: string
  videoMeta?: { duration?: number }
  authorMeta?: { name?: string; nickName?: string; fans?: number }
  searchQuery?: string
  textLanguage?: string
}

/**
 * TikTok's search only filters by fixed ranges counted back from now, so ask
 * for the smallest one that reaches the start of the window; the exact dates
 * are applied afterwards.
 */
function tiktokDateFilter(window: TrendWindow, now: number): string {
  const reach = (now - windowBounds(window).startMs) / DAY_MS
  if (reach <= 1) return "PAST_24_HOURS"
  if (reach <= 7) return "PAST_WEEK"
  if (reach <= 30) return "PAST_MONTH"
  if (reach <= 90) return "LAST_3_MONTHS"
  if (reach <= 180) return "LAST_6_MONTHS"
  return "ALL_TIME"
}

/** A TikTok id carries its own creation time in the high 32 bits. */
function tiktokIdTime(id: string): number | null {
  try {
    const seconds = Number(BigInt(id) >> BigInt(32))
    return seconds > 1_400_000_000 ? seconds * 1000 : null
  } catch {
    return null
  }
}

/**
 * The TikTok Actor sometimes hands emoji back as the six characters `\ud83d`
 * instead of the character itself (seen on the first real scan). Put them back.
 */
function unescapeUnicode(text: string): string {
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
}

function fromTikTokItem(it: TikTokItem): TrendCandidate | null {
  const author = it.authorMeta?.name?.trim()
  if (!it.id || !author) return null
  const createdMs =
    (it.createTimeISO ? new Date(it.createTimeISO).getTime() : NaN) ||
    (it.createTime ? it.createTime * 1000 : NaN) ||
    tiktokIdTime(it.id)
  if (!createdMs) return null
  const fans = it.authorMeta?.fans
  return {
    platform: "tiktok",
    id: it.id,
    url: it.webVideoUrl || `https://www.tiktok.com/@${author}/video/${it.id}`,
    caption: unescapeUnicode(it.text ?? ""),
    createdAt: new Date(createdMs).toISOString(),
    durationSeconds: it.videoMeta?.duration ?? 0,
    views: it.playCount ?? 0,
    likes: it.diggCount ?? 0,
    comments: it.commentCount ?? 0,
    shares: it.shareCount ?? null,
    saves: it.collectCount ?? null,
    author,
    authorName: it.authorMeta?.nickName ?? author,
    followers: typeof fans === "number" ? fans : null,
    topic: it.searchQuery ?? null,
    language: it.textLanguage || null,
  }
}

async function searchTikTok(
  topics: string[],
  window: TrendWindow,
  perTopic: number,
  region: string | null,
  now: number
): Promise<TrendCandidate[]> {
  const batches: string[][] = []
  for (let i = 0; i < topics.length; i += TIKTOK_TOPICS_PER_RUN) {
    batches.push(topics.slice(i, i + TIKTOK_TOPICS_PER_RUN))
  }
  const found = await Promise.all(batches.map((batch) => searchTikTokBatch(batch, window, perTopic, region, now)))
  return found.flat()
}

async function searchTikTokBatch(
  topics: string[],
  window: TrendWindow,
  perTopic: number,
  region: string | null,
  now: number
): Promise<TrendCandidate[]> {
  const requested = topics.length * perTopic
  const items = await runActor<TikTokItem>(
    TIKTOK_SEARCH,
    {
      searchQueries: topics,
      searchSection: "/video",
      // Most liked inside the date range. What comes back is not a clean
      // ranking: the first real scan showed a handful of well-liked videos per
      // topic, then filler with a few dozen likes. So a scan gets more out of
      // many topics read shallow than of a few read deep.
      videoSearchSorting: "MOST_LIKED",
      videoSearchDateFilter: tiktokDateFilter(window, now),
      resultsPerPage: perTopic,
      ...(region ? { proxyCountryCode: region } : {}),
      shouldDownloadVideos: false,
      shouldDownloadCovers: false,
      shouldDownloadSubtitles: false,
      shouldDownloadSlideshowImages: false,
    },
    {
      maxItems: requested,
      expectedUsd: listPrice("tiktok", requested) + (region ? (requested / 1000) * TREND_REGION_USD_PER_1000 : 0),
    }
  )
  return items.map(fromTikTokItem).filter((c): c is TrendCandidate => c !== null)
}

// --- Instagram --------------------------------------------------------------

interface InstagramItem {
  id?: string
  shortCode?: string
  url?: string
  caption?: string
  timestamp?: string
  likesCount?: number
  commentsCount?: number
  videoPlayCount?: number
  igPlayCount?: number
  videoViewCount?: number
  videoDuration?: number
  ownerUsername?: string
  ownerFullName?: string
}

function fromInstagramItem(it: InstagramItem): TrendCandidate | null {
  const author = it.ownerUsername?.trim()
  const views = it.videoPlayCount ?? it.igPlayCount ?? it.videoViewCount
  const createdMs = it.timestamp ? new Date(it.timestamp).getTime() : NaN
  // No view count means a photo or a carousel: not a format to copy on video.
  if (!it.shortCode || !author || typeof views !== "number" || !createdMs) return null
  return {
    platform: "instagram",
    id: it.shortCode,
    url: it.url || `https://www.instagram.com/reel/${it.shortCode}/`,
    caption: it.caption ?? "",
    createdAt: new Date(createdMs).toISOString(),
    durationSeconds: it.videoDuration ?? 0,
    views,
    // Instagram reports -1 when the account hides its like count.
    likes: Math.max(0, it.likesCount ?? 0),
    comments: Math.max(0, it.commentsCount ?? 0),
    shares: null,
    saves: null,
    author,
    authorName: it.ownerFullName ?? author,
    followers: null,
    topic: null,
  }
}

async function searchInstagram(topics: string[], perTopic: number): Promise<TrendCandidate[]> {
  // Each topic is read as a hashtag. The Actor's keyword search was tried on
  // the first real scan and returned about four reels per keyword, most of them
  // months old. Instagram has no date filter to pass on either way: the window
  // is applied afterwards, so part of what is billed will be too old to keep.
  const hashtags = [...new Set(topics.map(toHashtag).filter(Boolean))]
  const items = await runActor<InstagramItem>(
    INSTAGRAM_SEARCH,
    {
      hashtags,
      resultsType: "reels",
      resultsLimit: perTopic,
    },
    { maxItems: hashtags.length * perTopic, expectedUsd: listPrice("instagram", hashtags.length * perTopic) }
  )
  return items.map(fromInstagramItem).filter((c): c is TrendCandidate => c !== null)
}

type FollowerBook = Record<string, { followers: number; at: string }>

/**
 * Instagram search results do not say how big the account is, so the accounts
 * that already cleared the view bar are looked up — and remembered for a day,
 * since a follower count does not move enough in that time to change a verdict.
 */
async function instagramFollowers(usernames: string[], now: number): Promise<Map<string, number>> {
  const book = readStored<FollowerBook>("instagram-followers")?.value ?? {}
  const known = new Map<string, number>()
  const missing: string[] = []
  for (const name of new Set(usernames.map((u) => u.toLowerCase()))) {
    const entry = book[name]
    if (entry && isFresh(entry.at, FOLLOWERS_TTL_MS, now)) known.set(name, entry.followers)
    else missing.push(name)
  }
  if (missing.length === 0) return known

  const profiles = await runActor<{ username?: string; followersCount?: number }>(
    INSTAGRAM_PROFILES,
    { usernames: missing },
    { maxItems: missing.length, expectedUsd: listPrice("instagram", missing.length) }
  )
  const at = new Date(now).toISOString()
  for (const p of profiles) {
    const name = p.username?.toLowerCase()
    if (!name || typeof p.followersCount !== "number") continue
    known.set(name, p.followersCount)
    book[name] = { followers: p.followersCount, at }
  }
  writeStored("instagram-followers", book, now)
  return known
}

// --- Previous searches ------------------------------------------------------

function searchesDir(): string {
  return resolve(workspaceDir(), "trends", "searches")
}

/**
 * The same criteria over the same underlying scans is the same search: running
 * it again refreshes its entry rather than piling up copies. A fresh scan has a
 * new fetch time, so it gets an entry of its own.
 */
function searchId(result: TrendPickerResult): string {
  return createHash("sha1")
    .update(
      JSON.stringify({
        criteria: result.criteria,
        window: result.window,
        scans: result.platforms.map((r) => [r.platform, r.fetched_at]),
      })
    )
    .digest("hex")
    .slice(0, 16)
}

function saveSearch(search: SavedTrendSearch): void {
  mkdirSync(searchesDir(), { recursive: true })
  writeFileSync(join(searchesDir(), `${search.id}.json`), JSON.stringify(search), "utf8")
}

export function getSavedSearch(id: string): SavedTrendSearch | null {
  // Ids are our own hashes; anything else is not a file we wrote.
  if (!/^[a-f0-9]{16}$/.test(id)) return null
  const path = join(searchesDir(), `${id}.json`)
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, "utf8")) as SavedTrendSearch
  } catch {
    return null
  }
}

/** Newest first. */
export function listSavedSearches(limit = 50): SavedTrendSearchSummary[] {
  if (!existsSync(searchesDir())) return []
  const all: SavedTrendSearch[] = []
  for (const file of readdirSync(searchesDir())) {
    if (!file.endsWith(".json")) continue
    const search = getSavedSearch(file.slice(0, -".json".length))
    if (search) all.push(search)
  }
  return all
    .sort((a, b) => b.ranAt.localeCompare(a.ranAt))
    .slice(0, limit)
    .map((s) => ({
      id: s.id,
      ranAt: s.ranAt,
      source: s.source,
      window: s.window,
      criteria: s.criteria,
      platforms: s.platforms.map((r) => ({ platform: r.platform, picks: r.picks, error: r.error })),
      picks: s.picks.length,
    }))
}

// --- Scan -------------------------------------------------------------------

interface PlatformScan {
  candidates: TrendCandidate[]
  cached: boolean
  fetchedAt: string
}

async function scanPlatform(
  platform: TrendPlatform,
  topics: string[],
  window: TrendWindow,
  perTopic: number,
  region: string | null,
  force: boolean,
  now: number
): Promise<PlatformScan> {
  const key = createHash("sha1")
    .update(
      JSON.stringify({
        platform,
        // How the platform is searched. A scan made another way is not the same scan.
        mode: platform === "instagram" ? "hashtag" : "search",
        topics: topics.map((t) => t.toLowerCase()).sort(),
        from: window.from,
        to: window.to,
        perTopic,
        region,
      })
    )
    .digest("hex")
    .slice(0, 16)
  const name = `scan-${platform}-${key}`

  if (!force) {
    const hit = readStored<TrendCandidate[]>(name)
    if (hit && isFresh(hit.savedAt, SCAN_TTL_MS, now)) {
      return { candidates: hit.value, cached: true, fetchedAt: hit.savedAt }
    }
  }

  const candidates =
    platform === "tiktok"
      ? await searchTikTok(topics, window, perTopic, region, now)
      : await searchInstagram(topics, perTopic)
  // An empty answer is more likely a hiccup than the truth; do not pin it for hours.
  const fetchedAt = candidates.length > 0 ? writeStored(name, candidates, now) : new Date(now).toISOString()
  return { candidates, cached: false, fetchedAt }
}

/** One entry per video, with every topic that surfaced it. */
function mergeByVideo(candidates: TrendCandidate[]): { candidate: TrendCandidate; topics: string[] }[] {
  const byId = new Map<string, { candidate: TrendCandidate; topics: string[] }>()
  for (const c of candidates) {
    const entry = byId.get(c.id) ?? { candidate: c, topics: [] }
    if (c.topic && !entry.topics.includes(c.topic)) entry.topics.push(c.topic)
    byId.set(c.id, entry)
  }
  return [...byId.values()]
}

function toPick(c: TrendCandidate, followers: number, topics: string[], now: number): TrendPick {
  const days = Math.max(1, (now - new Date(c.createdAt).getTime()) / DAY_MS)
  const engaged = c.likes + c.comments + (c.shares ?? 0) + (c.saves ?? 0)
  return {
    platform: c.platform,
    id: c.id,
    url: c.url,
    caption: c.caption,
    createdAt: c.createdAt,
    durationSeconds: c.durationSeconds,
    views: c.views,
    likes: c.likes,
    comments: c.comments,
    shares: c.shares,
    saves: c.saves,
    author: c.author,
    authorName: c.authorName,
    language: c.language ?? null,
    followers,
    topics,
    views_per_follower: c.views / Math.max(1, followers),
    velocity: c.views / days,
    engagement_rate: c.views > 0 ? engaged / c.views : 0,
  }
}

export async function findTrendPickers(
  p: TrendPickerParams = {},
  now: number = Date.now()
): Promise<TrendPickerRun> {
  const topics = normalizeTopics(p.topics?.length ? p.topics : DEFAULT_TREND_TOPICS)
  if (topics.length === 0) throw new TrendInputError("Give at least one topic.")
  if (topics.length > TREND_MAX_TOPICS) {
    throw new TrendInputError(
      `${topics.length} topics is too many for one scan (max ${TREND_MAX_TOPICS}): every video returned is billed.`
    )
  }

  const platforms = TREND_PLATFORMS.filter((x) => (p.platforms?.length ? p.platforms : TREND_PLATFORMS).includes(x))
  if (platforms.length === 0) throw new TrendInputError("Pick tiktok, instagram, or both.")

  const window = resolveTrendWindow(p.from, p.to, now)
  const { startMs, endMs } = windowBounds(window)

  const minViews = p.minViews ?? TREND_MIN_VIEWS
  const maxViews = p.maxViews ?? null
  const maxFollowers = p.maxFollowers ?? TREND_MAX_FOLLOWERS
  if (!(minViews >= 0) || !(maxFollowers >= 0)) {
    throw new TrendInputError("minViews and maxFollowers must be positive numbers.")
  }
  if (maxViews !== null && !(maxViews >= minViews)) {
    throw new TrendInputError(`maxViews (${maxViews}) is below minViews (${minViews}).`)
  }
  const maxSeconds = p.maxSeconds === null ? null : (p.maxSeconds ?? TREND_MAX_SECONDS)
  if (maxSeconds !== null && !(maxSeconds > 0)) {
    throw new TrendInputError("maxSeconds must be a positive number of seconds, or null for no cap.")
  }
  const perTopic = Math.round(
    Math.min(Math.max(p.resultsPerTopic ?? TREND_RESULTS_PER_TOPIC, 5), TREND_RESULTS_PER_TOPIC_MAX)
  )
  const region = p.region?.trim() ? p.region.trim().toUpperCase() : null
  if (region !== null && !/^[A-Z]{2}$/.test(region)) {
    throw new TrendInputError(`region must be a 2-letter country code, got "${p.region}".`)
  }

  const picks: TrendPick[] = []
  const reports = await Promise.all(
    platforms.map(async (platform): Promise<PlatformReport> => {
      const report: PlatformReport = {
        platform,
        fetched: 0,
        in_window: 0,
        views_ok: 0,
        followers_unknown: 0,
        too_long: 0,
        picks: 0,
        cached: false,
        fetched_at: null,
      }
      try {
        const scan = await scanPlatform(platform, topics, window, perTopic, region, p.force ?? false, now)
        report.cached = scan.cached
        report.fetched_at = scan.fetchedAt

        const videos = mergeByVideo(scan.candidates)
        report.fetched = videos.length

        const inWindow = videos.filter(({ candidate: c }) => {
          const t = new Date(c.createdAt).getTime()
          return t >= startMs && t <= endMs
        })
        report.in_window = inWindow.length

        const viewsOk = inWindow
          .filter(({ candidate: c }) => c.views >= minViews && (maxViews === null || c.views <= maxViews))
          .sort((a, b) => b.candidate.views - a.candidate.views)
        report.views_ok = viewsOk.length

        // A video with no known length is kept: better to show it than to guess.
        const fits = viewsOk.filter(({ candidate: c }) => maxSeconds === null || c.durationSeconds <= maxSeconds)
        report.too_long = viewsOk.length - fits.length

        const needLookup = fits
          .filter(({ candidate: c }) => c.followers === null)
          .slice(0, MAX_FOLLOWER_LOOKUPS)
          .map(({ candidate: c }) => c.author)
        let looked = new Map<string, number>()
        if (platform === "instagram" && needLookup.length > 0) {
          try {
            looked = await instagramFollowers(needLookup, now)
          } catch (err) {
            if (err instanceof MissingApifyTokenError) throw err
            // The search already ran and is stored; say why nothing passed
            // rather than discard it.
            report.error = `Follower lookup failed: ${err instanceof Error ? err.message : String(err)}`
          }
        }

        for (const { candidate: c, topics: surfacedBy } of fits) {
          const followers = c.followers ?? looked.get(c.author.toLowerCase())
          if (followers === undefined) {
            report.followers_unknown++
            continue
          }
          if (followers > maxFollowers) continue
          picks.push(toPick(c, followers, surfacedBy, now))
          report.picks++
        }
      } catch (err) {
        // Without a token nothing can run at all; anything else is one
        // platform's problem and should not hide the other's results.
        if (err instanceof MissingApifyTokenError) throw err
        report.error = err instanceof Error ? err.message : String(err)
      }
      return report
    })
  )

  const result: TrendPickerResult = {
    window,
    criteria: { topics, minViews, maxViews, maxFollowers, maxSeconds, resultsPerTopic: perTopic, region },
    platforms: reports,
    picks: sortTrendPicks(picks, "views"),
  }
  const run = { ...result, ranAt: new Date(now).toISOString(), source: p.source ?? "app" }
  // Nothing came back from any platform: there is no search to keep.
  if (!reports.some((r) => r.fetched_at)) return { ...run, id: null }
  const saved: SavedTrendSearch = { ...run, id: searchId(result) }
  saveSearch(saved)
  return saved
}
