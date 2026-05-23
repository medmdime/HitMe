"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ResultCard } from "./result-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { ChannelInfo, OutlierVideo } from "@/lib/youtube-data.types"
import { RiArrowRightSLine, RiSearchLine, RiSparkling2Line } from "@remixicon/react"
import { toast } from "sonner"

interface ComparePayload {
  channel: ChannelInfo
  outliers: OutlierVideo[]
  flops: OutlierVideo[]
  paired_suggestions: {
    outlier: OutlierVideo
    flop: OutlierVideo
    similarity: number
    similarity_note: string
  }[]
}

export function HitVsFlop({ onSearched }: { onSearched?: () => void }) {
  const [channel, setChannel] = React.useState("")
  const [minOutlier, setMinOutlier] = React.useState("3")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [data, setData] = React.useState<ComparePayload | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!channel.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/discover/compare", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          channelUrlOrId: channel.trim(),
          minOutlier: Number(minOutlier),
          lookbackVideos: 40,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setData(json)
      onSearched?.()
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[280px] space-y-1.5">
          <Label htmlFor="hf-channel">Channel URL, @handle, or ID</Label>
          <Input
            id="hf-channel"
            placeholder="https://www.youtube.com/@mkbhd"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          />
        </div>
        <div className="w-32 space-y-1.5">
          <Label htmlFor="hf-min">Min outlier ×</Label>
          <Input
            id="hf-min"
            type="number"
            min="1"
            step="0.5"
            value={minOutlier}
            onChange={(e) => setMinOutlier(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading || !channel.trim()}>
          <RiSearchLine className="size-4" />
          {loading ? "Comparing…" : "Compare"}
        </Button>
      </form>

      {loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-3xl" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {data && data.paired_suggestions.length === 0 && (
        <div className="rounded-3xl border border-dashed p-6 text-sm text-muted-foreground">
          No clean hit/flop pairs found. Either the channel has no flops below
          1× baseline, or no outliers at or above the threshold.
        </div>
      )}

      {data?.paired_suggestions.map((pair, i) => (
        <Card key={i}>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline">
                  <RiSparkling2Line className="size-3" />
                  Pair #{i + 1}
                </Badge>
                <span className="text-muted-foreground">{pair.similarity_note}</span>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link
                  href={`/?compare_url_a=${encodeURIComponent(pair.outlier.url)}&compare_url_b=${encodeURIComponent(pair.flop.url)}`}
                >
                  Diff both <RiArrowRightSLine className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Badge className="bg-emerald-500/15 text-emerald-500">HIT — {pair.outlier.outlier_score.toFixed(1)}×</Badge>
                <ResultCard video={pair.outlier} />
              </div>
              <div className="space-y-2">
                <Badge className="bg-red-500/15 text-red-500">FLOP — {pair.flop.outlier_score.toFixed(2)}×</Badge>
                <ResultCard video={pair.flop} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
