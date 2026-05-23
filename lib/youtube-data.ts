import { cached, TTL } from "./cache"
import type {
  ChannelInfo,
  QuotaStatus,
  VideoStats,
} from "./youtube-data.types"

const YT_BASE = "https://www.googleapis.com/youtube/v3"
const DAILY_QUOTA_PER_PROJECT = 10000

export class QuotaExhaustedError extends Error {
  constructor() {
    super(
      "All configured YouTube Data API keys exhausted their daily quota. Add more keys (YOUTUBE_API_KEY_2..5) or wait until midnight Pacific time."
    )
    this.name = "QuotaExhaustedError"
  }
}

export class MissingKeyError extends Error {
  constructor() {
    super(
      "No YouTube Data API key configured. Set YOUTUBE_API_KEY_1 in .env.local."
    )
    this.name = "MissingKeyError"
  }
}

function loadKeys(): string[] {
  const keys: string[] = []
  for (let i = 1; i <= 5; i++) {
    const k = process.env[`YOUTUBE_API_KEY_${i}`]
    if (k && k.trim()) keys.push(k.trim())
  }
  return keys
}

// Per-process counters. Resets on cold start (acceptable for solo-user app).
const usage: number[] = []
const exhausted: boolean[] = []

function ensureCounters(n: number) {
  while (usage.length < n) usage.push(0)
  while (exhausted.length < n) exhausted.push(false)
}

function pickKeyIndex(keys: string[]): number {
  ensureCounters(keys.length)
  for (let i = 0; i < keys.length; i++) {
    if (!exhausted[i]) return i
  }
  throw new QuotaExhaustedError()
}

interface YouTubeError {
  error?: {
    code?: number
    message?: string
    errors?: { reason?: string; message?: string }[]
  }
}

async function call<T>(
  path: string,
  params: Record<string, string>,
  cost: number
): Promise<T> {
  const keys = loadKeys()
  if (keys.length === 0) throw new MissingKeyError()
  ensureCounters(keys.length)

  let lastErr: unknown = null
  for (let attempt = 0; attempt < keys.length; attempt++) {
    const idx = pickKeyIndex(keys)
    const url = new URL(`${YT_BASE}/${path}`)
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
    url.searchParams.set("key", keys[idx])

    const res = await fetch(url.toString())
    if (res.ok) {
      usage[idx] += cost
      return (await res.json()) as T
    }

    const text = await res.text()
    let parsed: YouTubeError = {}
    try {
      parsed = JSON.parse(text)
    } catch {
      // non-JSON error body
    }
    const reason = parsed.error?.errors?.[0]?.reason ?? ""
    const quotaProblem =
      res.status === 403 &&
      (reason === "quotaExceeded" || reason === "rateLimitExceeded" ||
        reason === "dailyLimitExceeded")

    if (quotaProblem) {
      exhausted[idx] = true
      lastErr = new Error(
        `YouTube API key #${idx + 1} quota exceeded: ${reason}`
      )
      continue
    }

    const msg = parsed.error?.message ?? text.slice(0, 300)
    throw new Error(`YouTube API ${res.status}: ${msg}`)
  }

  throw (lastErr as Error) ?? new QuotaExhaustedError()
}

export function getQuotaStatus(): QuotaStatus[] {
  const keys = loadKeys()
  ensureCounters(keys.length)
  return keys.map((_, i) => ({
    keyIndex: i + 1,
    estimatedUsed: usage[i] ?? 0,
    estimatedRemaining: Math.max(0, DAILY_QUOTA_PER_PROJECT - (usage[i] ?? 0)),
    exhausted: !!exhausted[i],
  }))
}

// ISO 8601 duration -> seconds. "PT4M30S" -> 270.
export function parseIsoDuration(iso: string): number {
  const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso)
  if (!m) return 0
  const [, d, h, mn, s] = m
  return (
    (Number(d ?? 0) * 86400) +
    (Number(h ?? 0) * 3600) +
    (Number(mn ?? 0) * 60) +
    Number(s ?? 0)
  )
}

interface SearchListResponse {
  items: { id: { videoId?: string }; snippet?: { channelId?: string } }[]
  nextPageToken?: string
}

interface VideosListResponse {
  items: {
    id: string
    snippet: {
      title: string
      description: string
      publishedAt: string
      channelId: string
      channelTitle: string
      defaultAudioLanguage?: string
      defaultLanguage?: string
      thumbnails: {
        maxres?: { url: string }
        high?: { url: string }
        medium?: { url: string }
        default?: { url: string }
      }
    }
    contentDetails: { duration: string }
    statistics: { viewCount?: string; likeCount?: string; commentCount?: string }
  }[]
}

interface ChannelsListResponse {
  items: {
    id: string
    snippet: {
      title: string
      description: string
      customUrl?: string
      thumbnails: { default?: { url: string }; high?: { url: string } }
    }
    statistics: {
      subscriberCount?: string
      videoCount?: string
      viewCount?: string
    }
    contentDetails: { relatedPlaylists: { uploads: string } }
  }[]
}

interface PlaylistItemsResponse {
  items: { contentDetails: { videoId: string } }[]
  nextPageToken?: string
}

function pickThumbnail(t: VideosListResponse["items"][number]["snippet"]["thumbnails"]): string {
  return (
    t.maxres?.url ?? t.high?.url ?? t.medium?.url ?? t.default?.url ?? ""
  )
}

export interface SearchParams {
  query: string
  maxResults?: number
  publishedAfter?: string
  publishedBefore?: string
  regionCode?: string
  relevanceLanguage?: string
  videoDuration?: "any" | "short" | "medium" | "long"
  order?: "viewCount" | "relevance" | "date" | "rating"
}

export async function searchVideos(
  p: SearchParams
): Promise<{ videoIds: string[]; channelIds: string[] }> {
  const cacheKey = `search:${JSON.stringify(p)}`
  return cached(cacheKey, TTL.search, async () => {
    const max = Math.min(p.maxResults ?? 50, 50)
    const params: Record<string, string> = {
      part: "snippet",
      q: p.query,
      type: "video",
      maxResults: String(max),
      order: p.order ?? "viewCount",
      videoDuration: p.videoDuration ?? "medium",
    }
    if (p.publishedAfter) params.publishedAfter = p.publishedAfter
    if (p.publishedBefore) params.publishedBefore = p.publishedBefore
    if (p.regionCode) params.regionCode = p.regionCode
    if (p.relevanceLanguage) params.relevanceLanguage = p.relevanceLanguage

    const data = await call<SearchListResponse>("search", params, 100)
    const videoIds = data.items
      .map((i) => i.id.videoId)
      .filter((v): v is string => Boolean(v))
    const channelIds = Array.from(
      new Set(
        data.items
          .map((i) => i.snippet?.channelId)
          .filter((c): c is string => Boolean(c))
      )
    )
    return { videoIds, channelIds }
  })
}

export async function getVideoStats(ids: string[]): Promise<VideoStats[]> {
  if (ids.length === 0) return []
  // batch by 50
  const out: VideoStats[] = []
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50)
    const cacheKey = `videos:${batch.join(",")}`
    const data = await cached<VideosListResponse>(cacheKey, TTL.videoStats, () =>
      call<VideosListResponse>(
        "videos",
        { part: "snippet,contentDetails,statistics", id: batch.join(",") },
        1
      )
    )
    for (const item of data.items) {
      out.push({
        videoId: item.id,
        title: item.snippet.title,
        description: item.snippet.description ?? "",
        thumbnail: pickThumbnail(item.snippet.thumbnails),
        publishedAt: item.snippet.publishedAt,
        views: Number(item.statistics.viewCount ?? 0),
        likes: Number(item.statistics.likeCount ?? 0),
        comments: Number(item.statistics.commentCount ?? 0),
        duration_seconds: parseIsoDuration(item.contentDetails.duration),
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${item.id}`,
        defaultAudioLanguage: item.snippet.defaultAudioLanguage,
        defaultLanguage: item.snippet.defaultLanguage,
      })
    }
  }
  return out
}

/**
 * `videos.list?chart=mostPopular` — YouTube's trending feed for a category/region.
 * Costs 1 unit per call regardless of result count. Cached for 30 min.
 */
export async function getMostPopular(opts: {
  regionCode: string
  categoryId?: string
  maxResults?: number
}): Promise<VideoStats[]> {
  const max = Math.min(opts.maxResults ?? 50, 50)
  const cacheKey = `mostPopular:${opts.regionCode}:${opts.categoryId ?? "all"}:${max}`
  return cached(cacheKey, TTL.search, async () => {
    const params: Record<string, string> = {
      part: "snippet,contentDetails,statistics",
      chart: "mostPopular",
      regionCode: opts.regionCode,
      maxResults: String(max),
    }
    if (opts.categoryId) params.videoCategoryId = opts.categoryId
    const data = await call<VideosListResponse>("videos", params, 1)
    return data.items.map((item) => ({
      videoId: item.id,
      title: item.snippet.title,
      description: item.snippet.description ?? "",
      thumbnail: pickThumbnail(item.snippet.thumbnails),
      publishedAt: item.snippet.publishedAt,
      views: Number(item.statistics.viewCount ?? 0),
      likes: Number(item.statistics.likeCount ?? 0),
      comments: Number(item.statistics.commentCount ?? 0),
      duration_seconds: parseIsoDuration(item.contentDetails.duration),
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id}`,
      defaultAudioLanguage: item.snippet.defaultAudioLanguage,
      defaultLanguage: item.snippet.defaultLanguage,
    }))
  })
}

export async function getChannelInfo(channelId: string): Promise<ChannelInfo> {
  const cacheKey = `channelInfo:${channelId}`
  return cached(cacheKey, TTL.channelInfo, async () => {
    const data = await call<ChannelsListResponse>(
      "channels",
      { part: "snippet,statistics,contentDetails", id: channelId },
      1
    )
    const c = data.items[0]
    if (!c) throw new Error(`Channel not found: ${channelId}`)
    return {
      channelId: c.id,
      title: c.snippet.title,
      description: c.snippet.description ?? "",
      subscriberCount: Number(c.statistics.subscriberCount ?? 0),
      videoCount: Number(c.statistics.videoCount ?? 0),
      viewCount: Number(c.statistics.viewCount ?? 0),
      thumbnail:
        c.snippet.thumbnails.high?.url ?? c.snippet.thumbnails.default?.url ?? "",
      customUrl: c.snippet.customUrl,
      uploadsPlaylistId: c.contentDetails.relatedPlaylists.uploads,
    }
  })
}

export async function getChannelUploads(
  channelId: string,
  max = 30
): Promise<VideoStats[]> {
  const cacheKey = `uploads:${channelId}:${max}`
  return cached(cacheKey, TTL.channelUploads, async () => {
    const info = await getChannelInfo(channelId)
    const playlistId = info.uploadsPlaylistId
    const ids: string[] = []
    let pageToken: string | undefined
    while (ids.length < max) {
      const need = Math.min(50, max - ids.length)
      const params: Record<string, string> = {
        part: "contentDetails",
        playlistId,
        maxResults: String(need),
      }
      if (pageToken) params.pageToken = pageToken
      const data = await call<PlaylistItemsResponse>(
        "playlistItems",
        params,
        1
      )
      for (const it of data.items) ids.push(it.contentDetails.videoId)
      if (!data.nextPageToken) break
      pageToken = data.nextPageToken
    }
    return getVideoStats(ids.slice(0, max))
  })
}

// --- Channel URL/handle resolver ---

export async function resolveChannelId(input: string): Promise<string> {
  const raw = input.trim()
  if (!raw) throw new Error("Empty channel input")

  // Raw UC... id
  if (/^UC[A-Za-z0-9_-]{20,}$/.test(raw)) return raw

  // Strip protocol/host
  let path = raw
  const urlMatch = raw.match(/^(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/(.+)$/i)
  if (urlMatch) path = urlMatch[1]

  // /channel/UC...
  const channelMatch = path.match(/^channel\/(UC[A-Za-z0-9_-]{20,})/)
  if (channelMatch) return channelMatch[1]

  // @handle (with or without /@)
  const handleMatch =
    path.match(/^@([A-Za-z0-9._-]+)/) ?? raw.match(/^@([A-Za-z0-9._-]+)$/)
  if (handleMatch) {
    return resolveByHandle(handleMatch[1])
  }

  // /c/customname  or  /user/legacyname
  const customMatch = path.match(/^(?:c|user)\/([A-Za-z0-9._-]+)/)
  if (customMatch) {
    return resolveByCustomOrUser(customMatch[1])
  }

  // Bare handle without @, treat as handle
  if (/^[A-Za-z0-9._-]+$/.test(raw)) {
    return resolveByHandle(raw)
  }

  throw new Error(`Could not parse channel reference: ${input}`)
}

async function resolveByHandle(handle: string): Promise<string> {
  const cacheKey = `resolveHandle:${handle}`
  return cached(cacheKey, TTL.channelInfo, async () => {
    const data = await call<ChannelsListResponse>(
      "channels",
      { part: "id", forHandle: `@${handle}` },
      1
    )
    const id = data.items?.[0]?.id
    if (id) return id
    // fallback: search
    return resolveBySearch(handle)
  })
}

async function resolveByCustomOrUser(name: string): Promise<string> {
  const cacheKey = `resolveCustom:${name}`
  return cached(cacheKey, TTL.channelInfo, async () => {
    // Try as username (legacy)
    try {
      const data = await call<ChannelsListResponse>(
        "channels",
        { part: "id", forUsername: name },
        1
      )
      const id = data.items?.[0]?.id
      if (id) return id
    } catch {
      // fallthrough
    }
    return resolveBySearch(name)
  })
}

async function resolveBySearch(q: string): Promise<string> {
  const data = await call<{
    items: { id: { channelId?: string }; snippet?: { channelId?: string } }[]
  }>(
    "search",
    {
      part: "snippet",
      q,
      type: "channel",
      maxResults: "1",
    },
    100
  )
  const id = data.items[0]?.id.channelId ?? data.items[0]?.snippet?.channelId
  if (!id) throw new Error(`Channel not found for: ${q}`)
  return id
}
