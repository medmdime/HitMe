"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { compactNumber, formatDuration } from "@/lib/format"
import {
  DEFAULT_TREND_TOPICS,
  TREND_MAX_FOLLOWERS,
  TREND_MAX_TOPICS,
  TREND_MIN_VIEWS,
  TREND_PLATFORMS,
  TREND_RESULTS_PER_TOPIC,
  TREND_RESULTS_PER_TOPIC_MAX,
  TREND_USD_PER_1000,
  TREND_WINDOW_DAYS,
  lengthBuckets,
  normalizeTopics,
  repeatAccounts,
  resolveTrendWindow,
  type PlatformReport,
  type SavedTrendSearchSummary,
  type TrendPick,
  type TrendPickerRun,
  type TrendPlatform,
} from "@/lib/trend-criteria"
import { cn } from "@/lib/utils"
import { RiArrowDownSFill, RiArrowUpSFill, RiRadarLine, RiRefreshLine } from "@remixicon/react"
import { toast } from "sonner"

const TOPICS_KEY = "hitme:trend-topics"

type Column = "views" | "followers" | "ratio" | "velocity" | "length" | "posted"

const COLUMNS: { key: Column; label: string; title: string; value: (p: TrendPick) => number }[] = [
  { key: "views", label: "VIEWS", title: "Views", value: (p) => p.views },
  { key: "followers", label: "FOLLOWERS", title: "Followers of the account", value: (p) => p.followers },
  { key: "ratio", label: "×AUDIENCE", title: "Views per follower", value: (p) => p.views_per_follower },
  { key: "velocity", label: "/DAY", title: "Views per day since posting", value: (p) => p.velocity },
  { key: "length", label: "LEN", title: "Video length", value: (p) => p.durationSeconds },
  { key: "posted", label: "POSTED", title: "Date posted", value: (p) => new Date(p.createdAt).getTime() },
]

const PLATFORM_LABEL: Record<TrendPlatform, string> = { tiktok: "TikTok", instagram: "Instagram" }
const PLATFORM_TAG: Record<TrendPlatform, string> = { tiktok: "TT", instagram: "IG" }

// The topics are his, not the app's: the edited list is kept between visits.
// Read through useSyncExternalStore so the server render and the first client
// render agree (both see "nothing saved") before the saved list shows up.
const subscribeNever = () => () => {}
function readSavedTopics(): string | null {
  try {
    return window.localStorage.getItem(TOPICS_KEY)
  } catch {
    return null
  }
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

function hoursAgo(iso: string): string {
  const h = (Date.now() - new Date(iso).getTime()) / 3_600_000
  return h < 1 ? `${Math.max(1, Math.round(h * 60))} min ago` : `${h.toFixed(0)} h ago`
}

export function TrendPickers() {
  const defaults = React.useMemo(() => resolveTrendWindow(), [])
  const savedTopics = React.useSyncExternalStore(subscribeNever, readSavedTopics, () => null)
  const [editedTopics, setTopics] = React.useState<string | null>(null)
  const topics = editedTopics ?? (savedTopics?.trim() ? savedTopics : DEFAULT_TREND_TOPICS.join("\n"))
  const [platforms, setPlatforms] = React.useState<TrendPlatform[]>(TREND_PLATFORMS)
  const [from, setFrom] = React.useState(defaults.from)
  const [to, setTo] = React.useState(defaults.to)
  const [minViews, setMinViews] = React.useState(String(TREND_MIN_VIEWS))
  const [maxViews, setMaxViews] = React.useState("")
  const [maxFollowers, setMaxFollowers] = React.useState(String(TREND_MAX_FOLLOWERS))
  const [perTopic, setPerTopic] = React.useState(String(TREND_RESULTS_PER_TOPIC))

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [data, setData] = React.useState<TrendPickerRun | null>(null)
  // True while the terminal shows a search read back from the history.
  const [replay, setReplay] = React.useState(false)
  const [history, setHistory] = React.useState<SavedTrendSearchSummary[]>([])
  const [historyTick, setHistoryTick] = React.useState(0)
  const [sort, setSort] = React.useState<{ column: Column; desc: boolean }>({ column: "views", desc: true })

  // Searches run by agents over MCP land in the same folder, so the list is
  // re-read on demand rather than only after this tab's own scans.
  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch("/api/discover/trend-pickers", { cache: "no-store" })
        const json = await res.json()
        if (!cancelled && res.ok) setHistory(json.searches ?? [])
      } catch {
        // the list is a convenience; scanning works without it
      }
    })()
    return () => {
      cancelled = true
    }
  }, [historyTick])

  const topicList = normalizeTopics(topics.split("\n"))
  const requested = topicList.length * (Number(perTopic) || 0)
  const estimate = platforms.reduce((s, p) => s + (requested / 1000) * TREND_USD_PER_1000[p], 0)

  async function scan(force: boolean) {
    setLoading(true)
    setError(null)
    try {
      window.localStorage.setItem(TOPICS_KEY, topics)
    } catch {
      // storage blocked: nothing to keep
    }
    try {
      const res = await fetch("/api/discover/trend-pickers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topics: topicList,
          platforms,
          from,
          to,
          minViews: Number(minViews),
          maxViews: maxViews ? Number(maxViews) : undefined,
          maxFollowers: Number(maxFollowers),
          resultsPerTopic: Number(perTopic),
          force,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setData(json as TrendPickerRun)
      setReplay(false)
      setHistoryTick((t) => t + 1)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  async function openSaved(id: string) {
    setError(null)
    try {
      const res = await fetch(`/api/discover/trend-pickers/${id}`, { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setData(json as TrendPickerRun)
      setReplay(true)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      toast.error(msg)
    }
  }

  function togglePlatform(p: TrendPlatform) {
    setPlatforms((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]))
  }

  const picks = React.useMemo(() => {
    if (!data) return []
    const value = COLUMNS.find((c) => c.key === sort.column)!.value
    return [...data.picks].sort((a, b) => (sort.desc ? value(b) - value(a) : value(a) - value(b)))
  }, [data, sort])

  const canScan = !loading && topicList.length > 0 && topicList.length <= TREND_MAX_TOPICS && platforms.length > 0
  const anyStored = !replay && (data?.platforms.some((r) => r.cached) ?? false)

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (canScan) void scan(false)
        }}
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
      >
        <div className="space-y-1.5">
          <Label htmlFor="tp-topics">Topics, one per line (max {TREND_MAX_TOPICS})</Label>
          <Textarea
            id="tp-topics"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            className="min-h-32 font-mono"
            spellCheck={false}
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tp-from">From</Label>
              <Input id="tp-from" type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tp-to">To</Label>
              <Input id="tp-to" type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Platforms</Label>
              <div className="flex gap-1.5">
                {TREND_PLATFORMS.map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant={platforms.includes(p) ? "default" : "outline"}
                    aria-pressed={platforms.includes(p)}
                    onClick={() => togglePlatform(p)}
                  >
                    {PLATFORM_LABEL[p]}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="w-32 space-y-1.5">
              <Label htmlFor="tp-min">Min views</Label>
              <Input id="tp-min" type="number" min="0" step="5000" value={minViews} onChange={(e) => setMinViews(e.target.value)} />
            </div>
            <div className="w-32 space-y-1.5">
              <Label htmlFor="tp-max">Max views</Label>
              <Input id="tp-max" type="number" min="0" step="5000" placeholder="no cap" value={maxViews} onChange={(e) => setMaxViews(e.target.value)} />
            </div>
            <div className="w-36 space-y-1.5">
              <Label htmlFor="tp-followers">Max followers</Label>
              <Input id="tp-followers" type="number" min="0" step="500" value={maxFollowers} onChange={(e) => setMaxFollowers(e.target.value)} />
            </div>
            <div className="w-36 space-y-1.5">
              <Label htmlFor="tp-depth">Videos per topic</Label>
              <Input id="tp-depth" type="number" min="5" max={TREND_RESULTS_PER_TOPIC_MAX} step="5" value={perTopic} onChange={(e) => setPerTopic(e.target.value)} />
            </div>
            <Button type="submit" disabled={!canScan}>
              <RiRadarLine className={cn("size-4", loading && "animate-spin")} />
              {loading ? "Scanning…" : "Scan"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            The window is {TREND_WINDOW_DAYS} days at most. A new scan asks Apify for up to{" "}
            <span className="font-medium text-foreground">
              {(requested * platforms.length).toLocaleString()} videos
            </span>{" "}
            (about ${estimate.toFixed(2)} on Apify&apos;s free plan) and takes 1 to 5 minutes. It is then kept for 6 hours:
            changing the view or follower bars re-filters it for free.
          </p>
        </div>
      </form>

      {error && (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <Terminal
        data={data}
        replay={replay}
        picks={picks}
        loading={loading}
        sort={sort}
        onSort={(column) =>
          setSort((s) => (s.column === column ? { column, desc: !s.desc } : { column, desc: true }))
        }
        footer={
          anyStored && !loading ? (
            <button
              type="button"
              onClick={() => void scan(true)}
              className="inline-flex items-center gap-1 text-amber-400 hover:underline"
            >
              <RiRefreshLine className="size-3" />
              run a fresh scan (billed)
            </button>
          ) : null
        }
      />

      <History
        searches={history}
        activeId={data?.id ?? null}
        onOpen={(id) => void openSaved(id)}
        onRefresh={() => setHistoryTick((t) => t + 1)}
      />
    </div>
  )
}

function Terminal({
  data,
  replay,
  picks,
  loading,
  sort,
  onSort,
  footer,
}: {
  data: TrendPickerRun | null
  replay: boolean
  picks: TrendPick[]
  loading: boolean
  sort: { column: Column; desc: boolean }
  onSort: (column: Column) => void
  footer: React.ReactNode
}) {
  const lengths = lengthBuckets(picks)
  const repeats = repeatAccounts(picks)

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-2">
        <span className="font-semibold tracking-widest text-amber-400">TREND PICKERS</span>
        {data ? (
          <span className="text-zinc-400">
            {data.window.from} → {data.window.to} · {compactNumber(data.criteria.minViews)}
            {data.criteria.maxViews === null ? "+" : `–${compactNumber(data.criteria.maxViews)}`} views · ≤{" "}
            {compactNumber(data.criteria.maxFollowers)} followers
            {replay && (
              <span className="text-amber-400">
                {" "}
                · saved search, ran {shortDate(data.ranAt)} by {data.source === "agent" ? "an agent" : "you"}
              </span>
            )}
          </span>
        ) : (
          <span className="text-zinc-500">no scan yet</span>
        )}
      </div>

      {loading && (
        <div className="px-4 py-10 text-center text-zinc-400">
          <span className="animate-pulse">searching TikTok and Instagram — this takes a few minutes…</span>
        </div>
      )}

      {!loading && !data && (
        <div className="px-4 py-10 text-center text-zinc-500">
          Videos from the last two weeks that passed the view bar on an account too small to explain it.
          <br />
          Set your topics and press Scan.
        </div>
      )}

      {!loading && data && (
        <>
          <div className="space-y-1 border-b border-zinc-800 px-4 py-3">
            {data.platforms.map((r) => (
              <Funnel key={r.platform} report={r} replay={replay} />
            ))}
          </div>

          {picks.length === 0 ? (
            <div className="px-4 py-10 text-center text-zinc-500">
              No video cleared every bar. Read the funnel above: few in window means the search came back with old
              videos (raise videos per topic); few past the view bar means a small topic (try a broader one); many
              past the view bar and no pick means only big accounts are winning there (raise max followers).
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse tabular-nums">
                <thead>
                  <tr className="border-b border-zinc-800 text-left text-[10px] tracking-wider text-zinc-500">
                    <th className="px-3 py-2 font-normal">#</th>
                    <th className="px-2 py-2 font-normal">SRC</th>
                    {COLUMNS.map((c) => (
                      <th key={c.key} className="px-2 py-2 text-right font-normal" title={c.title}>
                        <button
                          type="button"
                          onClick={() => onSort(c.key)}
                          className={cn(
                            "inline-flex items-center gap-0.5 hover:text-zinc-200",
                            sort.column === c.key && "text-amber-400"
                          )}
                        >
                          {c.label}
                          {sort.column === c.key &&
                            (sort.desc ? <RiArrowDownSFill className="size-3" /> : <RiArrowUpSFill className="size-3" />)}
                        </button>
                      </th>
                    ))}
                    <th className="px-2 py-2 font-normal">ACCOUNT</th>
                    <th className="px-2 py-2 font-normal">CAPTION</th>
                    <th className="px-3 py-2 font-normal" />
                  </tr>
                </thead>
                <tbody>
                  {picks.map((p, i) => (
                    <tr key={`${p.platform}:${p.id}`} className="border-b border-zinc-900 hover:bg-zinc-900/60">
                      <td className="px-3 py-1.5 text-zinc-600">{i + 1}</td>
                      <td className={cn("px-2 py-1.5", p.platform === "tiktok" ? "text-cyan-400" : "text-fuchsia-400")}>
                        {PLATFORM_TAG[p.platform]}
                      </td>
                      <td className="px-2 py-1.5 text-right text-emerald-400">{compactNumber(p.views)}</td>
                      <td className="px-2 py-1.5 text-right">{compactNumber(p.followers)}</td>
                      <td className="px-2 py-1.5 text-right text-amber-300">
                        {compactNumber(Math.round(p.views_per_follower))}×
                      </td>
                      <td className="px-2 py-1.5 text-right">{compactNumber(Math.round(p.velocity))}</td>
                      <td className="px-2 py-1.5 text-right text-zinc-400">
                        {p.durationSeconds > 0 ? formatDuration(p.durationSeconds) : "—"}
                      </td>
                      <td className="px-2 py-1.5 text-right text-zinc-400" title={new Date(p.createdAt).toLocaleString()}>
                        {p.createdAt.slice(5, 10)}
                      </td>
                      <td className="max-w-40 truncate px-2 py-1.5 text-zinc-200" title={p.authorName}>
                        @{p.author}
                      </td>
                      {/* w-full + max-w-0: takes what is left and truncates, so the links stay in view */}
                      <td className="w-full max-w-0 truncate px-2 py-1.5 font-sans text-zinc-400" title={p.caption}>
                        {p.caption || "(no caption)"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-1.5 text-right">
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white hover:underline">
                          open
                        </a>
                        <span className="px-1 text-zinc-700">·</span>
                        <Link href={`/clips?url=${encodeURIComponent(p.url)}`} className="text-amber-400 hover:underline">
                          teardown
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(lengths.length > 0 || repeats.length > 0 || footer) && (
            <div className="space-y-1 border-t border-zinc-800 px-4 py-3 text-zinc-400">
              {lengths.length > 0 && (
                <div>
                  <span className="text-zinc-500">LENGTHS </span>
                  {lengths.map((b) => `${b.label} ×${b.count}`).join(" · ")}
                </div>
              )}
              {repeats.length > 0 && (
                <div>
                  <span className="text-zinc-500">REPEAT ACCOUNTS </span>
                  {repeats.map((r) => `@${r.author} ×${r.picks}`).join(" · ")}
                  <span className="text-zinc-600"> — more than one pick in the window: a format that repeats</span>
                </div>
              )}
              {footer && <div>{footer}</div>}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Funnel({ report: r, replay }: { report: PlatformReport; replay: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={cn("w-20", r.platform === "tiktok" ? "text-cyan-400" : "text-fuchsia-400")}>
        {PLATFORM_LABEL[r.platform].toUpperCase()}
      </span>
      {r.fetched_at ? (
        <>
          <span>
            {r.fetched} returned → {r.in_window} in window → {r.views_ok} past the view bar →{" "}
            <span className="text-emerald-400">{r.picks} picks</span>
          </span>
          {!replay && (
            <span className="text-zinc-500">
              {r.cached ? `stored scan, ${hoursAgo(r.fetched_at)} · nothing billed` : "fresh scan"}
            </span>
          )}
          {r.followers_unknown > 0 && (
            <span className="text-zinc-500">· {r.followers_unknown} left out, follower count unreadable</span>
          )}
          {(r.too_long ?? 0) > 0 && <span className="text-zinc-500">· {r.too_long} left out, over 3 min</span>}
        </>
      ) : (
        <span className="text-zinc-500">did not run</span>
      )}
      {r.error && <span className="basis-full text-red-400">{r.error}</span>}
    </div>
  )
}

/**
 * Every search that finished, whoever ran it. Opening one reads it back from
 * disk as it was: no scan, no charge.
 */
function History({
  searches,
  activeId,
  onOpen,
  onRefresh,
}: {
  searches: SavedTrendSearchSummary[]
  activeId: string | null
  onOpen: (id: string) => void
  onRefresh: () => void
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
        <span className="font-semibold tracking-widest text-amber-400">PREVIOUS SEARCHES</span>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-100"
          title="Re-read the list, including searches agents ran over MCP"
        >
          <RiRefreshLine className="size-3" />
          refresh
        </button>
      </div>

      {searches.length === 0 ? (
        <div className="px-4 py-6 text-center text-zinc-500">
          Nothing saved yet. Every scan is kept here: yours from this tab, and the ones your agents run over MCP.
        </div>
      ) : (
        <ul>
          {searches.map((s) => (
            <li key={s.id} className="border-b border-zinc-900 last:border-b-0">
              <button
                type="button"
                onClick={() => onOpen(s.id)}
                className={cn(
                  "flex w-full flex-wrap items-baseline gap-x-3 gap-y-0.5 px-4 py-2 text-left hover:bg-zinc-900/60",
                  s.id === activeId && "bg-zinc-900"
                )}
              >
                <span className="w-28 shrink-0 text-zinc-200">{shortDate(s.ranAt)}</span>
                <span className={cn("w-12 shrink-0", s.source === "agent" ? "text-fuchsia-400" : "text-cyan-400")}>
                  {s.source === "agent" ? "AGENT" : "YOU"}
                </span>
                <span className="shrink-0 text-zinc-400">
                  {s.window.from.slice(5)} → {s.window.to.slice(5)}
                </span>
                <span className="shrink-0 text-zinc-400">
                  {compactNumber(s.criteria.minViews)}
                  {s.criteria.maxViews === null ? "+" : `–${compactNumber(s.criteria.maxViews)}`} · ≤{" "}
                  {compactNumber(s.criteria.maxFollowers)}
                </span>
                <span className="min-w-0 flex-1 truncate font-sans text-zinc-400">{s.criteria.topics.join(", ")}</span>
                <span className="shrink-0 text-emerald-400">
                  {s.platforms
                    .map((r) => `${PLATFORM_TAG[r.platform]} ${r.error ? "failed" : r.picks}`)
                    .join(" · ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
