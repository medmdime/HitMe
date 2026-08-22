/**
 * TikTok public account reader.
 *
 * TikTok has no free API for discovery, but one endpoint — the profile's own
 * `item_list` — is still unsigned and answers logged-out requests. That is
 * enough to do the thing that actually matters: read a specific creator's back
 * catalogue with view counts and rank their posts against their own baseline.
 *
 * Deliberate constraints:
 *  - Logged out, always. No cookies are sent and none should be added. There is
 *    no account to put at risk if no account is involved, and attaching a real
 *    session is the one action with genuine account-loss risk.
 *  - Read-only, modest volume, cached. Polite pacing between pages.
 *
 * What this cannot do: hashtag, keyword, trending, or For-You discovery. Those
 * endpoints are signed and return empty bodies without a valid signature, so a
 * research run has to be seeded with accounts you already care about.
 */
import { cached, TTL } from "./cache"

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"

/** The endpoint rejects any page size other than 15. */
const PAGE_SIZE = 15

export interface TikTokPost {
  id: string
  url: string
  description: string
  createdAt: string
  views: number
  likes: number
  comments: number
  shares: number
  saves: number
  durationSeconds: number
}

export interface TikTokAccount {
  username: string
  nickname: string
  followers: number
  totalVideos: number
  verified: boolean
}

export class TikTokError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TikTokError"
  }
}

/** Accepts "@name", "name", or any tiktok.com profile / video URL. */
export function parseAccount(input: string): string {
  const raw = input.trim()
  const fromUrl = raw.match(/tiktok\.com\/@([\w.-]+)/i)
  if (fromUrl) return fromUrl[1]
  const bare = raw.replace(/^@/, "")
  if (/^[\w.-]+$/.test(bare)) return bare
  throw new TikTokError(`Could not read a TikTok username from "${input}"`)
}

interface ProfileSeed {
  secUid: string
  account: TikTokAccount
}

/**
 * The profile page carries both the opaque `secUid` the list endpoint needs and
 * the account's real video total, which is how we tell a complete scan from a
 * truncated one.
 */
async function fetchProfileSeed(username: string): Promise<ProfileSeed> {
  const res = await fetch(`https://www.tiktok.com/@${encodeURIComponent(username)}`, {
    headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
  })
  if (!res.ok) {
    throw new TikTokError(
      `TikTok returned ${res.status} for @${username}. The account may not exist, or TikTok is rate-limiting this IP.`
    )
  }
  const html = await res.text()

  const secUid = html.match(/"secUid":"(MS4wLjABAAAA[\w-]{64})"/)?.[1]
  if (!secUid) {
    if (/private/i.test(html) && /accountType/i.test(html)) {
      throw new TikTokError(`@${username} looks private — its posts are not publicly readable.`)
    }
    throw new TikTokError(
      `Could not read @${username}'s profile key. Either the account does not exist, or TikTok changed its page shape (this reader would need updating).`
    )
  }

  const num = (re: RegExp): number => Number(html.match(re)?.[1] ?? 0)
  return {
    secUid,
    account: {
      username,
      nickname: html.match(/"nickname":"([^"]*)"/)?.[1] ?? username,
      followers: num(/"followerCount":(\d+)/),
      totalVideos: num(/"videoCount":(\d+)/),
      verified: /"verified":true/.test(html),
    },
  }
}

interface ItemListResponse {
  itemList?: {
    id?: string
    desc?: string
    createTime?: number
    video?: { duration?: number }
    stats?: {
      playCount?: number
      diggCount?: number
      commentCount?: number
      shareCount?: number
      collectCount?: number
    }
  }[]
  // Note: this endpoint does NOT return `hasMore` or `cursor`, despite what
  // most write-ups about it claim. Do not reintroduce a dependency on them.
}

function buildListUrl(secUid: string, cursor: number): string {
  const qs = new URLSearchParams({
    aid: "1988",
    app_name: "tiktok_web",
    channel: "tiktok_web",
    device_platform: "web_pc",
    os: "windows",
    region: "US",
    from_page: "user",
    type: "1",
    count: String(PAGE_SIZE),
    cursor: String(cursor),
    secUid,
  })
  return `https://www.tiktok.com/api/creator/item_list/?${qs}`
}

/**
 * Reads up to `want` recent posts, newest first.
 *
 * Returns `truncated` so callers can say whether a baseline came from the whole
 * catalogue or just a slice — the two produce materially different medians.
 */
export async function fetchAccountPosts(
  username: string,
  want: number
): Promise<{ account: TikTokAccount; posts: TikTokPost[]; truncated: boolean }> {
  return cached(`tiktok:${username}:${want}`, TTL.channelUploads, async () => {
    const { secUid, account } = await fetchProfileSeed(username)
    const posts: TikTokPost[] = []
    let cursor = 0
    // This endpoint returns neither `hasMore` nor a `cursor` field, so paging is
    // driven by the last post's timestamp and ends when a page comes back short.
    let exhausted = false
    // One page per 15 posts, plus a hard ceiling so a malformed reply cannot loop.
    const maxPages = Math.min(Math.ceil(want / PAGE_SIZE) + 2, 60)

    for (let page = 0; page < maxPages && !exhausted && posts.length < want; page++) {
      if (page > 0) await new Promise((r) => setTimeout(r, 350))

      const res = await fetch(buildListUrl(secUid, cursor), {
        headers: {
          "User-Agent": UA,
          Referer: `https://www.tiktok.com/@${username}`,
          "Accept-Language": "en-US,en;q=0.9",
        },
      })
      if (!res.ok) {
        if (posts.length > 0) break // keep what we have
        throw new TikTokError(`TikTok returned ${res.status} listing @${username}'s posts.`)
      }

      const body = await res.text()
      if (!body.trim()) {
        // An empty 200 is how TikTok signals a request it declined to sign.
        if (posts.length > 0) break
        throw new TikTokError(
          `TikTok returned an empty response for @${username}. This usually means the IP is being rate-limited — wait a few minutes and retry.`
        )
      }

      let json: ItemListResponse
      try {
        json = JSON.parse(body) as ItemListResponse
      } catch {
        throw new TikTokError(`TikTok returned unparseable data for @${username}.`)
      }

      const items = json.itemList ?? []
      if (items.length === 0) break

      for (const it of items) {
        if (!it.id) continue
        posts.push({
          id: it.id,
          url: `https://www.tiktok.com/@${username}/video/${it.id}`,
          description: it.desc ?? "",
          createdAt: new Date((it.createTime ?? 0) * 1000).toISOString(),
          views: it.stats?.playCount ?? 0,
          likes: it.stats?.diggCount ?? 0,
          comments: it.stats?.commentCount ?? 0,
          shares: it.stats?.shareCount ?? 0,
          saves: it.stats?.collectCount ?? 0,
          durationSeconds: it.video?.duration ?? 0,
        })
      }

      // A page shorter than the fixed size means there is nothing left behind it.
      if (items.length < PAGE_SIZE) exhausted = true

      const last = items[items.length - 1]
      const nextCursor = (last?.createTime ?? 0) * 1000
      // Guard against a repeated cursor, which would otherwise re-read one page.
      if (!nextCursor || nextCursor === cursor) break
      cursor = nextCursor
    }

    const trimmed = posts.slice(0, want)
    return {
      account,
      posts: trimmed,
      truncated: account.totalVideos > trimmed.length,
    }
  })
}

/**
 * TikTok rounds public counts, and the step changes with magnitude: 100 below a
 * million, 100,000 above it. A video just over 1M can therefore be off by up to
 * 5%, which is why scores here are never presented to two decimals and why
 * ranking needs a tiebreaker.
 */
export function countPrecision(views: number): { quantum: number; worstErrorPct: number } {
  const quantum = views >= 1_000_000 ? 100_000 : 100
  return { quantum, worstErrorPct: views > 0 ? (quantum / 2 / views) * 100 : 0 }
}

export function isCoarse(views: number): boolean {
  return countPrecision(views).worstErrorPct >= 1
}
