import { NextResponse } from "next/server"
import { TikTokError, fetchAccountPosts, parseAccount } from "@/lib/tiktok"
import { scoreTikTokPosts } from "@/lib/social-outlier"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      account?: string
      lookback?: number
      minOutlier?: number
    }
    const input = body.account?.trim()
    if (!input) {
      return NextResponse.json({ error: "account required" }, { status: 400 })
    }

    const username = parseAccount(input)
    const lookback = Math.min(Math.max(body.lookback ?? 45, 15), 300)
    const { account, posts, truncated } = await fetchAccountPosts(username, lookback)

    if (posts.length === 0) {
      return NextResponse.json(
        { error: `@${username} returned no public posts.` },
        { status: 404 }
      )
    }

    const { scored, baseline } = scoreTikTokPosts(posts)
    const filtered =
      body.minOutlier === undefined
        ? scored
        : scored.filter((p) => p.outlier_score >= body.minOutlier!)

    return NextResponse.json({
      account,
      baseline,
      scanned: posts.length,
      truncated,
      posts: filtered,
    })
  } catch (err) {
    return errorResponse(err)
  }
}

function errorResponse(err: unknown) {
  if (err instanceof TikTokError) {
    return NextResponse.json({ error: err.message }, { status: 502 })
  }
  const message = err instanceof Error ? err.message : String(err)
  return NextResponse.json({ error: message }, { status: 500 })
}
