"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SocialGrid } from "./social-grid"
import type { SocialPostView } from "./social-card"
import { AccountHeader, type AccountSummary } from "./account-header"
import { RiInstagramLine } from "@remixicon/react"
import { toast } from "sonner"

type Metric = "likes" | "views"
type PostType = "all" | "reels" | "photos"

interface InstagramResponse {
  account: {
    username: string
    fullName: string
    followers: number
    totalPosts: number
    verified: boolean
  }
  baseline: number
  metric: Metric
  scanned: number
  rankable: number
  reelCount: number
  rateLimited: boolean
  truncated: boolean
  posts: {
    shortcode: string
    url: string
    caption: string
    createdAt: string
    likes: number
    comments: number
    views: number | null
    isReel: boolean
    isVideo: boolean
    outlier_score: number
    engagement_rate: number
  }[]
}

export function InstagramAccounts() {
  const [account, setAccount] = React.useState("")
  const [metric, setMetric] = React.useState<Metric>("likes")
  const [type, setType] = React.useState<PostType>("all")
  const [lookback, setLookback] = React.useState("12")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [data, setData] = React.useState<InstagramResponse | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!account.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/discover/instagram", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          account: account.trim(),
          lookback: Number(lookback) || 12,
          metric,
          type,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setData(json as InstagramResponse)
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
    id: p.shortcode,
    url: p.url,
    caption: p.caption,
    createdAt: p.createdAt,
    outlier_score: p.outlier_score,
    engagement_rate: p.engagement_rate,
    views: p.views,
    likes: p.likes,
    comments: p.comments,
    kind: p.isReel ? "reel" : p.isVideo ? "video" : "photo",
  }))

  // Ranking on views silently drops every photo, so say how much was excluded.
  const droppedForViews =
    data && data.metric === "views" ? data.scanned - data.rankable : 0

  const summary: AccountSummary | null = data
    ? {
        handle: data.account.username,
        name: data.account.fullName,
        verified: data.account.verified,
        followers: data.account.followers,
        totalPosts: data.account.totalPosts,
        baselineLabel: data.metric === "views" ? "median views" : "median likes",
        baseline: data.baseline,
        scanned: data.metric === "views" ? data.rankable : data.scanned,
        truncated: data.truncated,
        rateLimited: data.rateLimited,
        note:
          droppedForViews > 0
            ? `Ranking on views covers only the ${data.rankable} video posts — Instagram publishes no view count for photos or carousels, so ${droppedForViews} were excluded. Switch to likes to rank the whole grid.`
            : data.metric === "likes" && data.reelCount > 0
              ? `Ranked on likes so photos count too. ${data.reelCount} of these are reels — switch to views to rank those on plays, which tracks reach better for short-form.`
              : undefined,
      }
    : null

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-muted/40 p-4 text-sm">
        <p className="font-medium">Likes rank everything, views rank reels</p>
        <p className="mt-1 text-muted-foreground">
          Instagram publishes a view count only for videos and reels, so likes is the one
          metric that ranks a whole grid. There is also no free hashtag or explore search —
          scanning works from accounts you name. Instagram throttles quickly, so 12 posts
          is one clean request; deeper scans may return less than asked.
        </p>
      </div>

      <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-1 space-y-1.5">
          <Label htmlFor="ig-account">Instagram account</Label>
          <Input
            id="ig-account"
            placeholder="@nasa or a profile URL"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
        </div>
        <div className="w-36 space-y-1.5">
          <Label htmlFor="ig-metric">Rank by</Label>
          <Select value={metric} onValueChange={(v) => setMetric(v as Metric)}>
            <SelectTrigger id="ig-metric">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="likes">Likes (all posts)</SelectItem>
              <SelectItem value="views">Views (reels only)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-36 space-y-1.5">
          <Label htmlFor="ig-type">Post type</Label>
          <Select value={type} onValueChange={(v) => setType(v as PostType)}>
            <SelectTrigger id="ig-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="reels">Reels</SelectItem>
              <SelectItem value="photos">Photos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-32 space-y-1.5">
          <Label htmlFor="ig-lookback">Posts</Label>
          <Input
            id="ig-lookback"
            type="number"
            min="12"
            max="90"
            step="12"
            value={lookback}
            onChange={(e) => setLookback(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading || !account.trim()}>
          <RiInstagramLine className="size-4" />
          {loading ? "Scanning…" : "Scan account"}
        </Button>
      </form>

      {summary && <AccountHeader summary={summary} />}

      <SocialGrid
        posts={posts}
        loading={loading}
        error={error}
        emptyHint="Enter an Instagram handle to rank its posts against the account's own baseline."
      />
    </div>
  )
}
