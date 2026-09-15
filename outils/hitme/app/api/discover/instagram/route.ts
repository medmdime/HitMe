import { NextResponse } from "next/server"
import {
  InstagramError,
  InstagramRateLimited,
  PROFILE_PAGE,
  fetchAccountPosts,
  parseAccount,
} from "@/lib/instagram"
import { scoreInstagramPosts, type InstagramMetric } from "@/lib/social-outlier"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      account?: string
      lookback?: number
      metric?: InstagramMetric
      type?: "all" | "reels" | "photos"
      minOutlier?: number
    }
    const input = body.account?.trim()
    if (!input) {
      return NextResponse.json({ error: "account required" }, { status: 400 })
    }

    const username = parseAccount(input)
    const lookback = Math.min(Math.max(body.lookback ?? PROFILE_PAGE, PROFILE_PAGE), 90)
    const metric: InstagramMetric = body.metric === "views" ? "views" : "likes"

    const { account, posts, rateLimited, truncated } = await fetchAccountPosts(
      username,
      lookback
    )
    if (posts.length === 0) {
      return NextResponse.json(
        { error: `@${username} returned no public posts.` },
        { status: 404 }
      )
    }

    let pool = posts
    if (body.type === "reels") pool = pool.filter((p) => p.isReel)
    else if (body.type === "photos") pool = pool.filter((p) => !p.isVideo)

    const { scored, baseline } = scoreInstagramPosts(pool, metric, account.followers)
    const filtered =
      body.minOutlier === undefined
        ? scored
        : scored.filter((p) => p.outlier_score >= body.minOutlier!)

    return NextResponse.json({
      account,
      baseline,
      metric,
      scanned: posts.length,
      // Instagram publishes no view count for photos, so a views-ranked run
      // silently covers fewer posts. Say so rather than letting it look complete.
      rankable: scored.length,
      reelCount: posts.filter((p) => p.isReel).length,
      rateLimited,
      truncated,
      posts: filtered,
    })
  } catch (err) {
    return errorResponse(err)
  }
}

function errorResponse(err: unknown) {
  if (err instanceof InstagramRateLimited) {
    return NextResponse.json({ error: err.message, code: "RATE_LIMITED" }, { status: 429 })
  }
  if (err instanceof InstagramError) {
    return NextResponse.json({ error: err.message }, { status: 502 })
  }
  const message = err instanceof Error ? err.message : String(err)
  return NextResponse.json({ error: message }, { status: 500 })
}
