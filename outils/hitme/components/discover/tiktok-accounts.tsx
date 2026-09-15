"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SocialGrid } from "./social-grid"
import type { SocialPostView } from "./social-card"
import { AccountHeader, type AccountSummary } from "./account-header"
import { compactNumber } from "@/lib/format"
import { RiMusic2Line } from "@remixicon/react"
import { toast } from "sonner"

interface TikTokResponse {
  account: {
    username: string
    nickname: string
    followers: number
    totalVideos: number
    verified: boolean
  }
  baseline: number
  scanned: number
  truncated: boolean
  posts: {
    id: string
    url: string
    description: string
    createdAt: string
    views: number
    likes: number
    comments: number
    shares: number
    saves: number
    outlier_score: number
    engagement_rate: number
    coarse: boolean
    durationSeconds: number
  }[]
}

export function TikTokAccounts() {
  const [account, setAccount] = React.useState("")
  const [lookback, setLookback] = React.useState("45")
  const [minOutlier, setMinOutlier] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [data, setData] = React.useState<TikTokResponse | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!account.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/discover/tiktok", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          account: account.trim(),
          lookback: Number(lookback) || 45,
          minOutlier: minOutlier ? Number(minOutlier) : undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setData(json as TikTokResponse)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      setData(null)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const posts: SocialPostView[] = (data?.posts ?? []).map((p) => ({
    id: p.id,
    url: p.url,
    caption: p.description,
    createdAt: p.createdAt,
    outlier_score: p.outlier_score,
    engagement_rate: p.engagement_rate,
    views: p.views,
    likes: p.likes,
    comments: p.comments,
    shares: p.shares,
    saves: p.saves,
    coarse: p.coarse,
    kind: p.durationSeconds >= 60 ? "long" : "short",
  }))

  const summary: AccountSummary | null = data
    ? {
        handle: data.account.username,
        name: data.account.nickname,
        verified: data.account.verified,
        followers: data.account.followers,
        totalPosts: data.account.totalVideos,
        baselineLabel: "median views",
        baseline: data.baseline,
        scanned: data.scanned,
        truncated: data.truncated,
      }
    : null

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-muted/40 p-4 text-sm">
        <p className="font-medium">Scan one creator at a time</p>
        <p className="mt-1 text-muted-foreground">
          TikTok offers no free hashtag, keyword, or trending search — those endpoints
          require signing. What is open is any public account&apos;s own history, so
          research works from a list of creators you already follow in your niche. A post
          that beat its own account&apos;s median is a lesson you can copy.
        </p>
      </div>

      <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
        <div className="min-w-[240px] flex-1 space-y-1.5">
          <Label htmlFor="tt-account">TikTok account</Label>
          <Input
            id="tt-account"
            placeholder="@duolingo or a profile URL"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
        </div>
        <div className="w-36 space-y-1.5">
          <Label htmlFor="tt-lookback">Posts to scan</Label>
          <Input
            id="tt-lookback"
            type="number"
            min="15"
            max="300"
            step="15"
            value={lookback}
            onChange={(e) => setLookback(e.target.value)}
          />
        </div>
        <div className="w-32 space-y-1.5">
          <Label htmlFor="tt-min">Min outlier ×</Label>
          <Input
            id="tt-min"
            type="number"
            min="0"
            step="0.5"
            placeholder="any"
            value={minOutlier}
            onChange={(e) => setMinOutlier(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading || !account.trim()}>
          <RiMusic2Line className="size-4" />
          {loading ? "Scanning…" : "Scan account"}
        </Button>
      </form>

      {summary && <AccountHeader summary={summary} />}

      {data && data.posts.some((p) => p.coarse) && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">~</span> marks posts where TikTok rounds the view
          count to the nearest 100k. Those scores carry up to ±5% error, so treat close
          ranks as ties. Scores also shift with the scan depth — keep{" "}
          <span className="font-medium">Posts to scan</span> fixed when comparing accounts.
        </p>
      )}

      <SocialGrid
        posts={posts}
        loading={loading}
        error={error}
        emptyHint={`Enter a TikTok handle to rank its posts by how far each beat the account's own median${
          data ? ` (baseline ${compactNumber(data.baseline)} views)` : ""
        }.`}
      />
    </div>
  )
}
