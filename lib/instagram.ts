/**
 * Instagram public account reader.
 *
 * Instagram is stricter than TikTok in three ways that shape this whole module:
 *
 *  1. **It throttles hard and fast.** A handful of paged requests earns a
 *     `401 "Please wait a few minutes"`. So the default path is a SINGLE
 *     request — the profile endpoint already returns the most recent 12 posts —
 *     and going deeper is opt-in, paced, and degrades to whatever it managed
 *     to collect rather than failing outright.
 *  2. **Only videos carry a view count.** Photos and carousels expose likes and
 *     comments and nothing else, so likes is the only metric that ranks a whole
 *     grid. Views are available when you restrict to reels.
 *  3. **The web endpoints need an app-id header.** Without `X-IG-App-ID` the
 *     same URL returns `400 SecFetch Policy violation`.
 *
 * Logged out, always. No cookies are sent and none should be added: attaching a
 * real session is the one action here with genuine account-loss risk.
 */
import { cached, TTL } from "./cache"

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"

/** Instagram's public web client id. Requests without it are rejected. */
const IG_APP_ID = "936619743392459"

/** How many posts the profile endpoint returns in one call. */
export const PROFILE_PAGE = 12

export interface InstagramPost {
  shortcode: string
  url: string
  caption: string
  createdAt: string
  likes: number
  comments: number
  /** Videos and reels only; null for photos and carousels. */
  views: number | null
  isVideo: boolean
  isReel: boolean
  durationSeconds: number
}

export interface InstagramAccount {
  username: string
  fullName: string
  userId: string
  followers: number
  following: number
  totalPosts: number
  verified: boolean
  isPrivate: boolean
  biography: string
}

export class InstagramError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "InstagramError"
  }
}

export class InstagramRateLimited extends InstagramError {
  constructor() {
    super(
      "Instagram is rate-limiting this IP (it asks you to wait a few minutes). " +
        "Results are cached for 6 hours, so retry the same account later, or reduce `lookback` to stay on the " +
        "single-request path."
    )
    this.name = "InstagramRateLimited"
  }
}

/** Accepts "@name", "name", or any instagram.com profile / post URL. */
export function parseAccount(input: string): string {
  const raw = input.trim()
  const fromUrl = raw.match(/instagram\.com\/([A-Za-z0-9._]+)/i)
  if (fromUrl && !["p", "reel", "reels", "tv", "explore", "stories"].includes(fromUrl[1].toLowerCase())) {
    return fromUrl[1]
  }
  const bare = raw.replace(/^@/, "")
  if (/^[A-Za-z0-9._]+$/.test(bare)) return bare
  throw new InstagramError(`Could not read an Instagram username from "${input}"`)
}

function headers(username: string): Record<string, string> {
  return {
    "User-Agent": UA,
    "Accept-Language": "en-US,en;q=0.9",
    Accept: "*/*",
    "X-IG-App-ID": IG_APP_ID,
    Referer: `https://www.instagram.com/${username}/`,
  }
}

interface GraphNode {
  shortcode?: string
  is_video?: boolean
  product_type?: string
  video_view_count?: number
  video_play_count?: number
  video_duration?: number
  taken_at_timestamp?: number
  edge_liked_by?: { count?: number }
  edge_media_preview_like?: { count?: number }
  edge_media_to_comment?: { count?: number }
  edge_media_to_caption?: { edges?: { node?: { text?: string } }[] }
}

function fromGraphNode(n: GraphNode): InstagramPost | null {
  if (!n.shortcode) return null
  const views = n.video_view_count ?? n.video_play_count ?? null
  return {
    shortcode: n.shortcode,
    url: `https://www.instagram.com/p/${n.shortcode}/`,
    caption: n.edge_media_to_caption?.edges?.[0]?.node?.text ?? "",
    createdAt: new Date((n.taken_at_timestamp ?? 0) * 1000).toISOString(),
    likes: n.edge_liked_by?.count ?? n.edge_media_preview_like?.count ?? 0,
    comments: n.edge_media_to_comment?.count ?? 0,
    views: n.is_video ? views : null,
    isVideo: Boolean(n.is_video),
    isReel: n.product_type === "clips",
    durationSeconds: n.video_duration ?? 0,
  }
}

interface FeedItem {
  code?: string
  media_type?: number
  product_type?: string
  play_count?: number
  ig_play_count?: number
  like_count?: number
  comment_count?: number
  taken_at?: number
  video_duration?: number
  caption?: { text?: string } | null
}

function fromFeedItem(i: FeedItem): InstagramPost | null {
  if (!i.code) return null
  const isVideo = i.media_type === 2
  const views = i.play_count ?? i.ig_play_count ?? null
  return {
    shortcode: i.code,
    url: `https://www.instagram.com/p/${i.code}/`,
    caption: i.caption?.text ?? "",
    createdAt: new Date((i.taken_at ?? 0) * 1000).toISOString(),
    likes: i.like_count ?? 0,
    comments: i.comment_count ?? 0,
    views: isVideo ? views : null,
    isVideo,
    isReel: i.product_type === "clips",
    durationSeconds: i.video_duration ?? 0,
  }
}

interface ProfileResponse {
  data?: {
    user?: {
      id?: string
      username?: string
      full_name?: string
      biography?: string
      is_verified?: boolean
      is_private?: boolean
      edge_followed_by?: { count?: number }
      edge_follow?: { count?: number }
      edge_owner_to_timeline_media?: {
        count?: number
        edges?: { node?: GraphNode }[]
      }
    }
  }
}

export interface AccountScan {
  account: InstagramAccount
  posts: InstagramPost[]
  /** True when the scan stopped early because Instagram throttled it. */
  rateLimited: boolean
  truncated: boolean
}

/**
 * Reads an account's recent posts, newest first.
 *
 * `want` at or below 12 costs exactly one request. Above that, each extra page
 * risks a throttle; the scan keeps whatever it has and reports `rateLimited`
 * instead of throwing, because a short answer beats no answer.
 */
export async function fetchAccountPosts(username: string, want: number): Promise<AccountScan> {
  return cached(`instagram:${username}:${want}`, TTL.channelUploads, async () => {
    const h = headers(username)

    const res = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`,
      { headers: h }
    )
    if (res.status === 401 || res.status === 429) throw new InstagramRateLimited()
    if (res.status === 404) throw new InstagramError(`No Instagram account @${username}.`)
    if (!res.ok) {
      throw new InstagramError(
        `Instagram returned ${res.status} for @${username}.` +
          (res.status === 400 ? " (The request was rejected before reaching the profile.)" : "")
      )
    }

    let profile: ProfileResponse
    try {
      profile = (await res.json()) as ProfileResponse
    } catch {
      throw new InstagramError(`Instagram returned unparseable data for @${username}.`)
    }

    const u = profile.data?.user
    if (!u?.id) throw new InstagramError(`No Instagram account @${username}, or its profile is unavailable.`)

    const account: InstagramAccount = {
      username: u.username ?? username,
      fullName: u.full_name ?? "",
      userId: u.id,
      followers: u.edge_followed_by?.count ?? 0,
      following: u.edge_follow?.count ?? 0,
      totalPosts: u.edge_owner_to_timeline_media?.count ?? 0,
      verified: Boolean(u.is_verified),
      isPrivate: Boolean(u.is_private),
      biography: u.biography ?? "",
    }

    if (account.isPrivate) {
      throw new InstagramError(`@${username} is private — its posts are not publicly readable.`)
    }

    const posts: InstagramPost[] = []
    for (const edge of u.edge_owner_to_timeline_media?.edges ?? []) {
      const p = edge.node ? fromGraphNode(edge.node) : null
      if (p) posts.push(p)
    }

    let rateLimited = false
    if (posts.length < want) {
      const deeper = await paginate(account, want - posts.length, h, posts)
      rateLimited = deeper.rateLimited
    }

    const seen = new Set<string>()
    const unique = posts.filter((p) => !seen.has(p.shortcode) && seen.add(p.shortcode))
    const trimmed = unique.slice(0, want)

    return {
      account,
      posts: trimmed,
      rateLimited,
      truncated: account.totalPosts > trimmed.length,
    }
  })
}

/**
 * Walks the private feed endpoint for posts beyond the profile's first page.
 * Paced deliberately slowly — this is the request pattern Instagram throttles.
 */
async function paginate(
  account: InstagramAccount,
  extraWanted: number,
  h: Record<string, string>,
  into: InstagramPost[]
): Promise<{ rateLimited: boolean }> {
  let maxId: string | undefined
  const maxPages = Math.min(Math.ceil(extraWanted / 33) + 1, 8)

  for (let page = 0; page < maxPages; page++) {
    await new Promise((r) => setTimeout(r, page === 0 ? 800 : 1500))

    const url =
      `https://www.instagram.com/api/v1/feed/user/${account.userId}/?count=33` +
      (maxId ? `&max_id=${encodeURIComponent(maxId)}` : "")

    let res: Response
    try {
      res = await fetch(url, { headers: h })
    } catch {
      return { rateLimited: false }
    }
    // Throttled: keep what we have rather than losing the whole scan.
    if (res.status === 401 || res.status === 429) return { rateLimited: true }
    if (!res.ok) return { rateLimited: false }

    let json: {
      items?: FeedItem[]
      more_available?: boolean
      next_max_id?: string
      status?: string
    }
    try {
      json = (await res.json()) as typeof json
    } catch {
      return { rateLimited: false }
    }
    if (json.status === "fail") return { rateLimited: true }

    const items = json.items ?? []
    if (items.length === 0) return { rateLimited: false }
    for (const it of items) {
      const p = fromFeedItem(it)
      if (p) into.push(p)
    }

    if (!json.more_available || !json.next_max_id) return { rateLimited: false }
    if (into.length >= extraWanted + PROFILE_PAGE) return { rateLimited: false }
    maxId = String(json.next_max_id)
  }
  return { rateLimited: false }
}
