"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { compactNumber, formatDuration, timeAgo } from "@/lib/format"
import { extractVideoId } from "@/lib/youtube-url"
import type { ChannelInfo, VideoStats } from "@/lib/youtube-data.types"
import {
  RiPlayCircleLine,
  RiSparklingLine,
  RiDownloadLine,
  RiClipboardLine,
  RiCompass3Line,
  RiExternalLinkLine,
  RiDeleteBin6Line,
} from "@remixicon/react"
import {
  YouTubePlayer,
  type YouTubePlayerHandle,
} from "./youtube-player"
import { ScriptViewer } from "./script-viewer"
import { TeardownMarkdown } from "./teardown-markdown"
import { AlternativesSidebar } from "./alternatives-sidebar"
import { RecentAnalyses } from "./recent-analyses"
import {
  getRecent,
  deleteRecent,
  type RecentAnalysis,
} from "@/lib/recent-analyses"
import { RiRefreshLine } from "@remixicon/react"

interface AnalyzeResponse {
  videoId: string
  url: string
  script: string
  analysis: string
  metadata: { video: VideoStats; channel: ChannelInfo | null } | null
}

export function AnalyzerWorkspace() {
  const search = useSearchParams()
  const initialUrl = search.get("url") ?? ""
  const autorun = search.get("autorun") === "true"

  const [url, setUrl] = React.useState(initialUrl)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<AnalyzeResponse | null>(null)
  const playerRef = React.useRef<YouTubePlayerHandle>(null)

  const submit = React.useCallback(
    async (target: string, opts: { force?: boolean } = {}) => {
      const value = target.trim()
      if (!value) return
      const videoId = extractVideoId(value)
      if (!videoId) {
        const msg = "Could not parse a YouTube video URL or ID."
        setError(msg)
        toast.error(msg)
        return
      }

      if (!opts.force) {
        try {
          const cached = await getRecent(videoId)
          if (cached) {
            setResult(cached)
            setError(null)
            setLoading(false)
            toast.success("Loaded from shared analyses (cached)")
            return
          }
        } catch {
          // ignore cache lookup failures — proceed to fresh analyze
        }
      }

      setLoading(true)
      setError(null)
      setResult(null)
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ url: value }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
        setResult(json)
        // Server-side already upserted to Neon; just nudge subscribers.
        window.dispatchEvent(new Event("hitme:recent-analyses-changed"))
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        setError(msg)
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const autoRanRef = React.useRef(false)
  React.useEffect(() => {
    if (autorun && initialUrl && !autoRanRef.current) {
      autoRanRef.current = true
      void submit(initialUrl)
    }
  }, [autorun, initialUrl, submit])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    void submit(url)
  }

  function copyScript() {
    if (!result?.script) return
    navigator.clipboard.writeText(result.script).then(
      () => toast.success("Script copied"),
      () => toast.error("Copy failed")
    )
  }

  function downloadScript() {
    if (!result?.script) return
    const blob = new Blob([result.script], { type: "text/plain;charset=utf-8" })
    const a = document.createElement("a")
    const filename = `${result.metadata?.video.title ?? result.videoId}`
      .replace(/[^a-z0-9\- _]/gi, "_")
      .slice(0, 80)
    a.href = URL.createObjectURL(blob)
    a.download = `${filename}.txt`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function onSeek(sec: number) {
    playerRef.current?.seekTo(sec, true)
  }

  function openRecent(entry: RecentAnalysis) {
    setUrl(entry.url)
    setResult(entry)
    setError(null)
    setLoading(false)
  }

  function reanalyze() {
    if (!result) return
    void submit(result.url, { force: true })
  }

  async function removeFromRecents() {
    if (!result) return
    try {
      await deleteRecent(result.videoId)
      toast.success("Removed from shared analyses")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold">Analyze</h1>
        <p className="text-sm text-muted-foreground">
          Paste a YouTube URL — get a timestamped bracket-format script + teardown.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[280px] space-y-1.5">
              <Label htmlFor="yt-url">YouTube URL or video ID</Label>
              <Input
                id="yt-url"
                placeholder="https://www.youtube.com/watch?v=…"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading || !url.trim()}>
              <RiPlayCircleLine className="size-4" />
              {loading ? "Analyzing…" : "Generate script"}
            </Button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">
            Analysis takes 30s–3min depending on video length. The video is read directly by Gemini — no scraping.
          </p>
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="aspect-video w-full max-w-3xl rounded-3xl" />
          <Skeleton className="h-24 w-full rounded-3xl" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {result && !loading && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6 min-w-0">
            <YouTubePlayer
              ref={playerRef}
              videoId={result.videoId}
              key={result.videoId}
            />

            {result.metadata?.video && (
              <Card>
                <CardContent className="flex flex-col gap-2">
                  <h2 className="font-heading text-lg font-medium">
                    {result.metadata.video.title}
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {result.metadata.video.channelTitle}
                    {result.metadata.channel && (
                      <>
                        {" · "}
                        {compactNumber(result.metadata.channel.subscriberCount)} subs
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline">
                      {compactNumber(result.metadata.video.views)} views
                    </Badge>
                    <Badge variant="outline">
                      {compactNumber(result.metadata.video.likes)} likes
                    </Badge>
                    <Badge variant="outline">
                      {compactNumber(result.metadata.video.comments)} comments
                    </Badge>
                    <Badge variant="outline">
                      {formatDuration(result.metadata.video.duration_seconds)}
                    </Badge>
                    <Badge variant="outline">
                      {timeAgo(result.metadata.video.publishedAt)}
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <RiExternalLinkLine className="size-4" />
                        Open on YouTube
                      </a>
                    </Button>
                    {result.metadata.video.channelId && (
                      <Button asChild size="sm" variant="secondary">
                        <Link
                          href={`/discover?mode=channel&channel=${encodeURIComponent(result.metadata.video.channelId)}`}
                        >
                          <RiCompass3Line className="size-4" />
                          Find more like this
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {result.analysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RiSparklingLine className="size-4" />
                    Script teardown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TeardownMarkdown text={result.analysis} />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Script (click any line to seek)</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={reanalyze}
                    disabled={loading}
                    title="Bypass the local cache and re-run Gemini"
                  >
                    <RiRefreshLine className="size-4" />
                    Re-analyze
                  </Button>
                  <Button size="sm" variant="ghost" onClick={removeFromRecents}>
                    <RiDeleteBin6Line className="size-4" />
                    Remove
                  </Button>
                  <Button size="sm" variant="ghost" onClick={copyScript}>
                    <RiClipboardLine className="size-4" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadScript}>
                    <RiDownloadLine className="size-4" />
                    Download .txt
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScriptViewer script={result.script} onSeek={onSeek} />
              </CardContent>
            </Card>
          </div>

          <aside className="min-w-0">
            <div className="sticky top-20 max-h-[calc(100svh-6rem)] overflow-y-auto pr-1 [scrollbar-width:thin]">
              <AlternativesSidebar
                videoId={result.videoId}
                script={result.script}
                analysis={result.analysis}
              />
            </div>
          </aside>
        </div>
      )}

      {!loading && !result && !error && (
        <>
          <RecentAnalyses onOpen={openRecent} className="mt-2" />
          <div className="mt-6 rounded-3xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            Paste a URL above, or jump to{" "}
            <Link
              href="/discover"
              className="font-medium text-foreground underline"
            >
              Discover
            </Link>{" "}
            to find outlier videos first.
          </div>
        </>
      )}
    </div>
  )
}
