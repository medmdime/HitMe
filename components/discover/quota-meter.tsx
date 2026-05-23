"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { RiRefreshLine } from "@remixicon/react"
import { cn } from "@/lib/utils"
import type { QuotaStatus } from "@/lib/youtube-data.types"

interface QuotaResponse {
  quota: QuotaStatus[]
  daily_quota_per_project: number
  refreshed_at: string
}

export function QuotaMeter({ refreshSignal }: { refreshSignal?: number }) {
  const [data, setData] = React.useState<QuotaResponse | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const refresh = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/discover/quota", { cache: "no-store" })
      const json = (await res.json()) as QuotaResponse
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch("/api/discover/quota", { cache: "no-store" })
        const json = (await res.json()) as QuotaResponse
        if (!cancelled) setData(json)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e))
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refreshSignal])

  return (
    <Card size="sm" className="sticky top-20">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">API quota</div>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={refresh}
            disabled={loading}
            aria-label="Refresh quota"
          >
            <RiRefreshLine className={cn("size-3", loading && "animate-spin")} />
          </Button>
        </div>

        {error && (
          <div className="text-xs text-destructive">{error}</div>
        )}

        {!data && !error && (
          <div className="text-xs text-muted-foreground">Loading…</div>
        )}

        {data && data.quota.length === 0 && (
          <div className="text-xs text-muted-foreground">
            No YouTube API keys configured. Set{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
              YOUTUBE_API_KEY_1
            </code>{" "}
            in .env.local.
          </div>
        )}

        {data?.quota.map((k) => {
          const total = data.daily_quota_per_project
          const used = Math.min(k.estimatedUsed, total)
          const pct = Math.round((used / total) * 100)
          const tone =
            k.exhausted || pct >= 95
              ? "bg-red-500"
              : pct >= 70
              ? "bg-yellow-500"
              : "bg-emerald-500"
          return (
            <div key={k.keyIndex} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Key #{k.keyIndex}</span>
                <span className="text-muted-foreground">
                  {used}/{total} {k.exhausted && "(exhausted)"}
                </span>
              </div>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("absolute inset-y-0 left-0 transition-all", tone)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}

        {data && (
          <p className="text-[10px] leading-snug text-muted-foreground">
            Estimated, this process only. Quota resets daily at midnight Pacific time.
          </p>
        )}
        <Progress className="hidden" />
      </CardContent>
    </Card>
  )
}
