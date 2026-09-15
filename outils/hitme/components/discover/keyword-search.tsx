"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResultsGrid } from "./results-grid"
import type { OutlierVideo } from "@/lib/youtube-data.types"
import { RiSearchLine } from "@remixicon/react"
import { toast } from "sonner"

export function KeywordSearch({
  onChannelClick,
  onSearched,
}: {
  onChannelClick?: (channelId: string) => void
  onSearched?: () => void
}) {
  const [query, setQuery] = React.useState("")
  const [minOutlier, setMinOutlier] = React.useState("")
  const [publishedAfter, setPublishedAfter] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [videos, setVideos] = React.useState<OutlierVideo[]>([])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const body: Record<string, unknown> = {
        query: query.trim(),
        maxResults: 50,
      }
      if (minOutlier) body.minOutlier = Number(minOutlier)
      if (publishedAfter) {
        body.publishedAfter = new Date(publishedAfter).toISOString()
      }
      const res = await fetch("/api/discover/keyword", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
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
      <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[260px] space-y-1.5">
          <Label htmlFor="kw-query">Search query</Label>
          <Input
            id="kw-query"
            placeholder="e.g. AI agents tutorial"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="w-32 space-y-1.5">
          <Label htmlFor="kw-min">Min outlier ×</Label>
          <Input
            id="kw-min"
            type="number"
            min="0"
            step="0.5"
            placeholder="any"
            value={minOutlier}
            onChange={(e) => setMinOutlier(e.target.value)}
          />
        </div>
        <div className="w-44 space-y-1.5">
          <Label htmlFor="kw-after">Published after</Label>
          <Input
            id="kw-after"
            type="date"
            value={publishedAfter}
            onChange={(e) => setPublishedAfter(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading || !query.trim()}>
          <RiSearchLine className="size-4" />
          {loading ? "Searching…" : "Search"}
        </Button>
      </form>

      <ResultsGrid
        videos={videos}
        loading={loading}
        error={error}
        onChannelClick={onChannelClick}
        emptyHint="Search YouTube and rank results by outlier score (views ÷ channel median)."
      />
    </div>
  )
}
