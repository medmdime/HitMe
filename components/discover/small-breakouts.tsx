"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResultsGrid } from "./results-grid"
import type { OutlierVideo } from "@/lib/youtube-data.types"
import { RiFireLine } from "@remixicon/react"
import { toast } from "sonner"

export function SmallBreakouts({
  onChannelClick,
  onSearched,
}: {
  onChannelClick?: (channelId: string) => void
  onSearched?: () => void
}) {
  const [query, setQuery] = React.useState("")
  const [maxSubs, setMaxSubs] = React.useState("100000")
  const [minOutlier, setMinOutlier] = React.useState("5")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [videos, setVideos] = React.useState<OutlierVideo[]>([])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/discover/small-breakouts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          maxChannelSubs: Number(maxSubs),
          minOutlier: Number(minOutlier),
          maxResults: 50,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setVideos(json.videos ?? [])
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
      <div className="rounded-3xl bg-muted/40 p-4 text-sm">
        <p className="font-medium">Why this is the killer mode</p>
        <p className="mt-1 text-muted-foreground">
          Small channels can&apos;t lean on audience momentum — a hit means the{" "}
          <em>content</em> worked. The format is replicable: no celebrity, no
          production army, just script + packaging.
        </p>
      </div>

      <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[240px] space-y-1.5">
          <Label htmlFor="sb-query">Niche / query</Label>
          <Input
            id="sb-query"
            placeholder="e.g. solo dev story"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="w-40 space-y-1.5">
          <Label htmlFor="sb-subs">Max channel subs</Label>
          <Input
            id="sb-subs"
            type="number"
            min="1000"
            step="1000"
            value={maxSubs}
            onChange={(e) => setMaxSubs(e.target.value)}
          />
        </div>
        <div className="w-36 space-y-1.5">
          <Label htmlFor="sb-min">Min outlier ×</Label>
          <Input
            id="sb-min"
            type="number"
            min="1"
            step="0.5"
            value={minOutlier}
            onChange={(e) => setMinOutlier(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading || !query.trim()}>
          <RiFireLine className="size-4" />
          {loading ? "Searching…" : "Find breakouts"}
        </Button>
      </form>

      <ResultsGrid
        videos={videos}
        loading={loading}
        error={error}
        onChannelClick={onChannelClick}
        emptyHint="Find videos where a small channel had a breakout — the most replicable format lessons."
      />
    </div>
  )
}
