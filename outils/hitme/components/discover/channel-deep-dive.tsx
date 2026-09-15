"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ResultsGrid } from "./results-grid"
import { compactNumber } from "@/lib/format"
import type { ChannelBaseline, ChannelInfo, OutlierVideo } from "@/lib/youtube-data.types"
import { RiSearchLine } from "@remixicon/react"
import { toast } from "sonner"

export function ChannelDeepDive({
  initialChannel,
  onSearched,
}: {
  initialChannel?: string
  onSearched?: () => void
}) {
  const [channel, setChannel] = React.useState(initialChannel ?? "")
  const [lookback, setLookback] = React.useState("30")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [data, setData] = React.useState<{
    channel?: ChannelInfo
    baseline?: ChannelBaseline
    videos: OutlierVideo[]
  } | null>(null)

  const submit = React.useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      if (!channel.trim()) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/discover/channel", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            channelUrlOrId: channel.trim(),
            lookbackVideos: Number(lookback),
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
    },
    [channel, lookback, onSearched]
  )

  // Auto-run if initialChannel provided
  const hasInitial = React.useRef(false)
  React.useEffect(() => {
    if (initialChannel && !hasInitial.current) {
      hasInitial.current = true
      void submit()
    }
  }, [initialChannel, submit])

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[280px] space-y-1.5">
          <Label htmlFor="channel">Channel URL, @handle, or ID</Label>
          <Input
            id="channel"
            placeholder="https://www.youtube.com/@mkbhd"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Lookback</Label>
          <Select value={lookback} onValueChange={setLookback}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">Last 20 videos</SelectItem>
              <SelectItem value="30">Last 30 videos</SelectItem>
              <SelectItem value="50">Last 50 videos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={loading || !channel.trim()}>
          <RiSearchLine className="size-4" />
          {loading ? "Analyzing…" : "Analyze channel"}
        </Button>
      </form>

      {data?.channel && data.baseline && (
        <Card size="sm">
          <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-3">
              {data.channel.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.channel.thumbnail}
                  alt={data.channel.title}
                  className="size-10 rounded-full"
                />
              )}
              <div>
                <div className="font-medium">{data.channel.title}</div>
                <div className="text-xs text-muted-foreground">
                  {compactNumber(data.channel.subscriberCount)} subscribers ·{" "}
                  {compactNumber(data.channel.videoCount)} videos
                </div>
              </div>
            </div>
            <Stat label="Median (bottom 80%)" value={compactNumber(data.baseline.median)} />
            <Stat label="Mean (bottom 80%)" value={compactNumber(data.baseline.mean)} />
            <Stat label="Considered long-form" value={String(data.baseline.considered_video_count)} />
          </CardContent>
        </Card>
      )}

      <ResultsGrid
        videos={data?.videos ?? []}
        loading={loading}
        error={error}
        emptyHint="Enter a channel above to see its outliers ranked by score."
      />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  )
}
