"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ResultsGrid } from "./results-grid"
import type { OutlierVideo } from "@/lib/youtube-data.types"
import {
  TRENDING_CATEGORIES,
  TRENDING_REGIONS,
} from "@/lib/trending-categories"
import { RiFireLine, RiRefreshLine } from "@remixicon/react"
import { toast } from "sonner"

type SortMode = "chart" | "outlier"

interface Payload {
  category: { id: string; label: string; mode: "native" | "synthetic" }
  regionCode: string
  windowDays?: number
  videos: OutlierVideo[]
}

export function Trending({
  onChannelClick,
  onSearched,
}: {
  onChannelClick?: (channelId: string) => void
  onSearched?: () => void
}) {
  const [categoryId, setCategoryId] = React.useState("sports")
  const [regionCode, setRegionCode] = React.useState("US")
  const [windowDays, setWindowDays] = React.useState("14")
  const [sort, setSort] = React.useState<SortMode>("chart")

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [data, setData] = React.useState<Payload | null>(null)
  const [tick, setTick] = React.useState(0)

  // React 19: reset loading on filter change via render-time state sync.
  const deps = { categoryId, regionCode, windowDays, tick }
  const [prevDeps, setPrevDeps] = React.useState(deps)
  if (
    prevDeps.categoryId !== deps.categoryId ||
    prevDeps.regionCode !== deps.regionCode ||
    prevDeps.windowDays !== deps.windowDays ||
    prevDeps.tick !== deps.tick
  ) {
    setPrevDeps(deps)
    setLoading(true)
    setError(null)
  }

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch("/api/discover/trending", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            categoryId,
            regionCode,
            windowDays: Number(windowDays),
          }),
        })
        const json = await res.json()
        if (cancelled) return
        if (!res.ok) {
          setError(json.error ?? `HTTP ${res.status}`)
          setData(null)
          return
        }
        setData(json)
        setError(null)
        onSearched?.()
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : String(e)
          setError(msg)
          toast.error(msg)
          setData(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [categoryId, regionCode, windowDays, tick, onSearched])

  function refresh() {
    setTick((t) => t + 1)
  }

  const synthetic = data?.category.mode === "synthetic"

  const sortedVideos = React.useMemo(() => {
    if (!data) return [] as OutlierVideo[]
    if (sort === "outlier") {
      return [...data.videos].sort((a, b) => b.outlier_score - a.outlier_score)
    }
    // chart order = preserved order from API
    return data.videos
  }, [data, sort])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRENDING_CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                  {!c.ytCategoryId && (
                    <span className="ml-1 text-[10px] text-muted-foreground">
                      (synthetic)
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Region</Label>
          <Select value={regionCode} onValueChange={setRegionCode}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRENDING_REGIONS.map((r) => (
                <SelectItem key={r.code} value={r.code}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {synthetic && (
          <div className="space-y-1.5">
            <Label>Window</Label>
            <Select value={windowDays} onValueChange={setWindowDays}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-1.5">
          <Label>Sort</Label>
          <Select value={sort} onValueChange={(v) => setSort(v as SortMode)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chart">Chart order (hottest)</SelectItem>
              <SelectItem value="outlier">
                Outlier score (replicable hits)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={refresh} disabled={loading}>
          <RiRefreshLine
            className={loading ? "size-4 animate-spin" : "size-4"}
          />
          Refresh
        </Button>
      </div>

      {data && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="h-5">
            <RiFireLine className="size-3" />
            {data.category.label} · {data.regionCode}
          </Badge>
          {data.category.mode === "native" ? (
            <span>YouTube chart=mostPopular — live trending feed.</span>
          ) : (
            <span>
              Synthetic feed: keyword search over the last {data.windowDays}{" "}
              days, ordered by view count.
            </span>
          )}
          <span>
            ·{" "}
            <span className="font-medium text-foreground">
              Sort by outlier score
            </span>{" "}
            to spot videos that punched above their channel&apos;s usual weight
            — those formats are the most replicable.
          </span>
        </div>
      )}

      <ResultsGrid
        videos={sortedVideos}
        loading={loading}
        error={error}
        onChannelClick={onChannelClick}
        emptyHint="No trending videos returned — try a different region or category."
      />
    </div>
  )
}
