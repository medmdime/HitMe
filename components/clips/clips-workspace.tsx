"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScriptViewer } from "@/components/analyzer/script-viewer"
import { TeardownMarkdown } from "@/components/analyzer/teardown-markdown"
import { AudioPanel } from "./audio-panel"
import { SegmentsPanel } from "./segments-panel"
import { RecentClips } from "./recent-clips"
import { fileUrl, type ClipView } from "./types"
import { compactNumber, formatDuration } from "@/lib/format"
import { collectAnnotations, isBrollShot } from "@/lib/parse-script"
import {
  RiFileTextLine,
  RiSearchEyeLine,
  RiLayoutGridLine,
  RiMusic2Line,
  RiScissorsCutLine,
  RiExternalLinkLine,
  RiRefreshLine,
  RiFileCopyLine,
  RiInstagramLine,
  RiTiktokLine,
} from "@remixicon/react"
import { toast } from "sonner"

const STEPS = ["downloading", "uploading to Gemini", "watching and listening", "writing the breakdown"]

export function ClipsWorkspace() {
  const router = useRouter()
  const search = useSearchParams()
  const [url, setUrl] = React.useState(search.get("url") ?? "")
  const [clip, setClip] = React.useState<ClipView | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [step, setStep] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshSignal, setRefreshSignal] = React.useState(0)
  const [currentTime, setCurrentTime] = React.useState(0)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // A slow request with no feedback feels broken; rotate through the real stages.
  React.useEffect(() => {
    if (!loading) return
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 9000)
    return () => clearInterval(t)
  }, [loading])

  const loadById = React.useCallback(async (id: string) => {
    setStep(0)
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/clip/${encodeURIComponent(id)}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setClip(json as ClipView)
      setUrl(json.url ?? "")
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  // Deep link: /clips?id=instagram:SHORTCODE
  const idParam = search.get("id")
  React.useEffect(() => {
    if (!idParam || (clip && clip.id === idParam)) return
    let cancelled = false
    void Promise.resolve().then(() => {
      if (!cancelled) void loadById(idParam)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam])

  async function run(force = false) {
    const u = url.trim()
    if (!u) return
    setStep(0)
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/clip", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: u, force }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setClip(json as ClipView)
      setRefreshSignal((n) => n + 1)
      const sp = new URLSearchParams()
      sp.set("id", json.id)
      router.replace(`/clips?${sp.toString()}`, { scroll: false })
      if (json.cached && !force) toast.info("Loaded from the library — use re-analyze for a fresh pass.")
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  function seek(sec: number) {
    const v = videoRef.current
    if (!v) return
    v.currentTime = sec
    void v.play().catch(() => {})
  }

  async function copy(text: string, what: string) {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${what} copied`)
    } catch {
      toast.error("Could not copy")
    }
  }

  const sfxCount = clip ? collectAnnotations(clip.blocks, "SFX").length : 0
  const textCount = clip ? collectAnnotations(clip.blocks, "TEXT").length : 0
  const brollCount = clip ? clip.blocks.filter((b) => isBrollShot(b.shot)).length : 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold">Clips</h1>
        <p className="text-sm text-muted-foreground">
          Paste an Instagram reel or TikTok. Get the full script, every sound effect, the music,
          each b-roll shot as a file, and a template to remake it on your own topic.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          void run(false)
        }}
        className="mb-6 flex flex-wrap items-center gap-2"
      >
        <Input
          placeholder="https://www.instagram.com/p/… or https://www.tiktok.com/@…/video/…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="min-w-[280px] flex-1"
        />
        <Button type="submit" disabled={loading || !url.trim()}>
          <RiSearchEyeLine className="size-4" />
          {loading ? STEPS[step] + "…" : "Break it down"}
        </Button>
        {clip && clip.url === url.trim() && (
          <Button type="button" variant="outline" disabled={loading} onClick={() => run(true)} title="Re-download and re-analyze">
            <RiRefreshLine className="size-4" />
            Re-analyze
          </Button>
        )}
      </form>

      {error && (
        <div className="mb-6 whitespace-pre-wrap rounded-3xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0 space-y-4">
          {clip ? (
            <>
              <header className="rounded-3xl border p-4">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {clip.platform === "instagram" ? (
                        <RiInstagramLine className="size-4 text-muted-foreground" />
                      ) : clip.platform === "tiktok" ? (
                        <RiTiktokLine className="size-4 text-muted-foreground" />
                      ) : null}
                      <h2 className="font-heading text-lg font-semibold">{clip.title}</h2>
                      {clip.cached && <Badge variant="secondary">from library</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {clip.author && <span className="font-medium text-foreground">@{clip.author}</span>}
                      {clip.metadata?.viewCount !== null && clip.metadata?.viewCount !== undefined && (
                        <> · {compactNumber(clip.metadata.viewCount)} views</>
                      )}
                      {clip.metadata?.likeCount !== null && clip.metadata?.likeCount !== undefined && (
                        <> · {compactNumber(clip.metadata.likeCount)} likes</>
                      )}
                      {clip.durationSeconds ? <> · {formatDuration(clip.durationSeconds)}</> : null}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline">{clip.blocks.length} shots</Badge>
                      <Badge variant="outline">{brollCount} b-roll</Badge>
                      <Badge variant="outline">{sfxCount} SFX</Badge>
                      <Badge variant="outline">{textCount} text overlays</Badge>
                      {clip.sound && (
                        <Badge variant="outline" className="max-w-xs truncate">
                          <RiMusic2Line className="size-3" /> {clip.sound.track}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {clip.url && (
                      <Button asChild size="sm" variant="outline">
                        <a href={clip.url} target="_blank" rel="noopener noreferrer">
                          <RiExternalLinkLine className="size-4" />
                          Open
                        </a>
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => copy(clip.script, "Script")}>
                      <RiFileCopyLine className="size-4" />
                      Copy script
                    </Button>
                  </div>
                </div>
                {clip.caption && (
                  <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-xs text-muted-foreground">{clip.caption}</p>
                )}
              </header>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,280px)_1fr]">
                <div className="md:sticky md:top-20 md:self-start">
                  {clip.localPath ? (
                    <video
                      ref={videoRef}
                      controls
                      playsInline
                      preload="metadata"
                      src={fileUrl(clip.localPath)}
                      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                      className="aspect-[9/16] w-full rounded-2xl bg-black object-contain"
                    />
                  ) : (
                    <div className="flex aspect-[9/16] w-full items-center justify-center rounded-2xl bg-muted/40 text-xs text-muted-foreground">
                      video not on this machine
                    </div>
                  )}
                  <p className="mt-2 text-center text-[11px] text-muted-foreground">
                    Click any shot to jump there.
                  </p>
                </div>

                <Tabs defaultValue="script" className="min-w-0">
                  <TabsList className="flex-wrap">
                    <TabsTrigger value="script">
                      <RiFileTextLine /> Script
                    </TabsTrigger>
                    <TabsTrigger value="teardown">
                      <RiSearchEyeLine /> Teardown
                    </TabsTrigger>
                    <TabsTrigger value="template">
                      <RiLayoutGridLine /> Template
                    </TabsTrigger>
                    <TabsTrigger value="audio">
                      <RiMusic2Line /> Audio
                    </TabsTrigger>
                    <TabsTrigger value="segments">
                      <RiScissorsCutLine /> Segments
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="script" className="mt-4">
                    <ScriptViewer script={clip.script} onSeek={seek} currentTime={currentTime} />
                  </TabsContent>
                  <TabsContent value="teardown" className="mt-4">
                    {clip.analysis ? <TeardownMarkdown text={clip.analysis} /> : <Empty what="teardown" />}
                  </TabsContent>
                  <TabsContent value="template" className="mt-4 space-y-3">
                    {clip.template ? (
                      <>
                        <div className="flex justify-end">
                          <Button size="sm" variant="outline" onClick={() => copy(clip.template, "Template")}>
                            <RiFileCopyLine className="size-4" />
                            Copy template
                          </Button>
                        </div>
                        <div className="overflow-x-auto">
                          <TeardownMarkdown text={clip.template} />
                        </div>
                      </>
                    ) : (
                      <Empty what="template" hint="Re-analyze to generate one — older entries predate templates." />
                    )}
                  </TabsContent>
                  <TabsContent value="audio" className="mt-4">
                    <AudioPanel clip={clip} onSeek={seek} />
                  </TabsContent>
                  <TabsContent value="segments" className="mt-4">
                    <SegmentsPanel clipId={clip.id} />
                  </TabsContent>
                </Tabs>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed p-8 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">What you get for a link</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>A shot-by-shot script: exact words, every on-screen text, camera move and effect.</li>
                <li>Every sound effect with its timestamp, and what the music is doing.</li>
                <li>A teardown of the hook, structure, captions, b-roll sources and edit style.</li>
                <li>A fill-in template to remake the format on a different subject.</li>
                <li>Each shot cut out as its own video file, plus the audio track.</li>
              </ul>
              <p className="mt-3 text-xs">
                Runs on this machine — it needs yt-dlp and ffmpeg, and the platforms block hosted servers.
              </p>
            </div>
          )}
        </div>

        <aside>
          <RecentClips activeId={clip?.id ?? null} onSelect={(id) => {
            const sp = new URLSearchParams()
            sp.set("id", id)
            router.replace(`/clips?${sp.toString()}`, { scroll: false })
          }} refreshSignal={refreshSignal} />
        </aside>
      </div>
    </div>
  )
}

function Empty({ what, hint }: { what: string; hint?: string }) {
  return (
    <p className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
      No {what} for this clip.{hint ? ` ${hint}` : ""}
    </p>
  )
}
