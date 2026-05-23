"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { classifyOutlier, tierColor } from "@/lib/outlier"
import { compactNumber, formatDuration, timeAgo } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { OutlierVideo } from "@/lib/youtube-data.types"
import {
  RiSparkling2Line,
  RiExternalLinkLine,
  RiPlayCircleLine,
  RiRefreshLine,
  RiFilter3Line,
} from "@remixicon/react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Payload {
  source: OutlierVideo
  subject?: string
  entities?: string[]
  queries: string[]
  format?: string
  intent?: string
  window?: { from: string; to: string; weeks: number }
  filters?: {
    language: string | null
    sourceLanguage: string | null
    minSubs: number | null
    maxSubs: number | null
  }
  alternatives: OutlierVideo[]
}

interface Props {
  videoId: string
  script?: string
  analysis?: string
}

// Common YouTube languages — short list, "auto" leaves it to the source video,
// "any" disables the filter entirely.
const LANG_OPTIONS: { value: string; label: string }[] = [
  { value: "auto", label: "Auto-detect" },
  { value: "any", label: "Any language" },
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "it", label: "Italian" },
  { value: "ru", label: "Russian" },
  { value: "tr", label: "Turkish" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
]

function labelForLang(code: string | null | undefined): string {
  if (!code) return ""
  const hit = LANG_OPTIONS.find((o) => o.value === code)
  return hit?.label ?? code.toUpperCase()
}

interface Filters {
  language: string // "auto" | "any" | bcp47-2
  minSubs: string // numeric string or ""
  maxSubs: string
}

export function AlternativesSidebar({ videoId, script, analysis }: Props) {
  const [data, setData] = React.useState<Payload | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [tick, setTick] = React.useState(0)

  const [filters, setFilters] = React.useState<Filters>({
    language: "auto",
    minSubs: "",
    maxSubs: "",
  })
  const [appliedFilters, setAppliedFilters] = React.useState<Filters>(filters)

  // Reset loading on input change without an effect (React 19 pattern).
  const [prevDeps, setPrevDeps] = React.useState({ videoId, tick, appliedFilters })
  if (
    prevDeps.videoId !== videoId ||
    prevDeps.tick !== tick ||
    prevDeps.appliedFilters !== appliedFilters
  ) {
    setPrevDeps({ videoId, tick, appliedFilters })
    setLoading(true)
    setError(null)
  }

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const payload: Record<string, unknown> = { videoId, script, analysis }
        if (appliedFilters.language === "any") payload.language = "any"
        else if (appliedFilters.language !== "auto")
          payload.language = appliedFilters.language
        const minN = Number(appliedFilters.minSubs)
        const maxN = Number(appliedFilters.maxSubs)
        if (appliedFilters.minSubs && Number.isFinite(minN) && minN > 0)
          payload.minSubs = minN
        if (appliedFilters.maxSubs && Number.isFinite(maxN) && maxN > 0)
          payload.maxSubs = maxN

        const res = await fetch("/api/analyze/alternatives", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
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
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e))
          setData(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [videoId, tick, script, analysis, appliedFilters])

  const dirty =
    filters.language !== appliedFilters.language ||
    filters.minSubs !== appliedFilters.minSubs ||
    filters.maxSubs !== appliedFilters.maxSubs

  function apply() {
    setAppliedFilters(filters)
  }

  function reset() {
    const fresh: Filters = { language: "auto", minSubs: "", maxSubs: "" }
    setFilters(fresh)
    setAppliedFilters(fresh)
  }

  const detectedLang = data?.filters?.sourceLanguage ?? null
  const effectiveLang = data?.filters?.language ?? null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
          <RiSparkling2Line className="size-4" />
          Better alternatives
        </h3>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() => setTick((t) => t + 1)}
          disabled={loading}
          aria-label="Refresh"
        >
          <RiRefreshLine
            className={cn("size-3", loading && "animate-spin")}
          />
        </Button>
      </div>

      <Collapsible defaultOpen={false}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-2xl border border-dashed border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/40">
          <span className="flex items-center gap-1.5">
            <RiFilter3Line className="size-3.5" />
            Filters
            {(appliedFilters.language !== "auto" ||
              appliedFilters.minSubs ||
              appliedFilters.maxSubs) && (
              <Badge variant="secondary" className="h-4 text-[10px]">
                active
              </Badge>
            )}
          </span>
          {effectiveLang && (
            <span className="text-[10px]">
              {labelForLang(effectiveLang)}
              {detectedLang && effectiveLang === detectedLang && " · detected"}
            </span>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2.5 rounded-2xl bg-muted/30 p-3">
          <div className="space-y-1">
            <Label htmlFor="alt-lang" className="text-[11px]">
              Language
              {detectedLang && (
                <span className="ml-1 text-muted-foreground">
                  (source: {labelForLang(detectedLang)})
                </span>
              )}
            </Label>
            <Select
              value={filters.language}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, language: v }))
              }
            >
              <SelectTrigger id="alt-lang" size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANG_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="alt-min" className="text-[11px]">
                Min subs
              </Label>
              <Input
                id="alt-min"
                type="number"
                min="0"
                step="1000"
                placeholder="any"
                value={filters.minSubs}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, minSubs: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="alt-max" className="text-[11px]">
                Max subs
              </Label>
              <Input
                id="alt-max"
                type="number"
                min="0"
                step="1000"
                placeholder="e.g. 500000"
                value={filters.maxSubs}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, maxSubs: e.target.value }))
                }
              />
            </div>
          </div>
          <p className="text-[10px] leading-snug text-muted-foreground">
            Cap max subs to filter out big brand channels (Adidas, Nike, etc.) and
            surface independent creators.
          </p>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={apply}
              disabled={loading || !dirty}
            >
              Apply
            </Button>
            <Button size="sm" variant="ghost" onClick={reset} disabled={loading}>
              Reset
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {data && (data.subject || data.format || (data.queries?.length ?? 0) > 0) && (
        <div className="space-y-1.5 rounded-2xl bg-muted/30 p-2.5 text-[11px] text-muted-foreground">
          {data.subject && (
            <div>
              <span className="text-foreground/80">Subject:</span> {data.subject}
            </div>
          )}
          {data.entities && data.entities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {data.entities.slice(0, 6).map((e) => (
                <Badge
                  key={e}
                  variant="secondary"
                  className="h-4 text-[10px]"
                >
                  {e}
                </Badge>
              ))}
            </div>
          )}
          {data.format && (
            <div>
              <span className="text-foreground/80">Format:</span> {data.format}
            </div>
          )}
          {data.intent && (
            <div>
              <span className="text-foreground/80">Intent:</span> {data.intent}
            </div>
          )}
          {data.queries?.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {data.queries.map((q) => (
                <Badge
                  key={q}
                  variant="outline"
                  className="h-5 font-mono text-[10px]"
                >
                  {q}
                </Badge>
              ))}
            </div>
          )}
          {data.window && (
            <div className="pt-1 text-[10px]">
              <span className="text-foreground/80">Window:</span> ±{data.window.weeks}w of source publish (
              {new Date(data.window.from).toLocaleDateString()} →{" "}
              {new Date(data.window.to).toLocaleDateString()})
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && data && data.alternatives.length === 0 && (
        <div className="rounded-2xl border border-dashed p-3 text-xs text-muted-foreground">
          Nothing outperformed this video in the same niche. That&apos;s
          actually a good sign — you picked a strong reference.
        </div>
      )}

      {!loading && !error && data?.alternatives.map((v) => (
        <AlternativeCard key={v.videoId} video={v} source={data.source} />
      ))}
    </div>
  )
}

function AlternativeCard({
  video,
  source,
}: {
  video: OutlierVideo
  source: OutlierVideo
}) {
  const tier = classifyOutlier(video.outlier_score)
  const colors = tierColor(tier)
  const subs = video.channel_subscribers ?? 0
  const smallSignal =
    subs > 0 && subs < 100_000 ? "Small channel" : null
  const beatsBy =
    source.outlier_score > 0
      ? video.outlier_score / source.outlier_score
      : 0

  return (
    <Card size="sm" className="overflow-hidden">
      <div className="relative">
        {video.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnail}
            alt={video.title}
            className="aspect-video w-full object-cover"
          />
        )}
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
          {formatDuration(video.duration_seconds)}
        </span>
        <Badge
          className={cn(
            "absolute top-1.5 left-1.5 ring-1",
            colors.bg,
            colors.text,
            colors.ring
          )}
        >
          {video.outlier_score.toFixed(1)}×
        </Badge>
      </div>
      <CardContent className="space-y-1.5">
        <h4 className="line-clamp-2 text-xs font-semibold leading-snug">
          {video.title}
        </h4>
        <div className="text-[10px] text-muted-foreground">
          {video.channelTitle}
          {subs > 0 && <> · {compactNumber(subs)} subs</>}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-muted-foreground">
          <span>{compactNumber(video.views)} views</span>
          <span>·</span>
          <span>{timeAgo(video.publishedAt)}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {smallSignal && (
            <Badge variant="outline" className="h-4 text-[10px]">
              {smallSignal}
            </Badge>
          )}
          {beatsBy > 1.5 && (
            <Badge variant="outline" className={cn("h-4 text-[10px]", "text-emerald-500")}>
              {beatsBy.toFixed(1)}× the source&apos;s outlier
            </Badge>
          )}
        </div>
        <div className="mt-1 flex gap-1">
          <Button asChild size="xs" className="flex-1">
            <Link
              href={`/?url=${encodeURIComponent(video.url)}&autorun=true`}
            >
              <RiPlayCircleLine className="size-3" />
              Analyze
            </Link>
          </Button>
          <Button asChild size="icon-xs" variant="ghost" aria-label="Open on YouTube">
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              <RiExternalLinkLine className="size-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
