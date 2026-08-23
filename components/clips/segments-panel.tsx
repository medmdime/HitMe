"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { fileUrl, type SegmentsState } from "./types"
import { RiScissorsCutLine, RiInformationLine, RiFolderOpenLine } from "@remixicon/react"
import { toast } from "sonner"

/**
 * The reference cut into pieces. Shows the plan (what the script's timestamps
 * imply) before cutting, then each shot as a playable file afterwards.
 */
export function SegmentsPanel({ clipId }: { clipId: string }) {
  const [state, setState] = React.useState<SegmentsState | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [cutting, setCutting] = React.useState(false)
  const [only, setOnly] = React.useState<"all" | "broll">("all")

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/clip/segments?id=${encodeURIComponent(clipId)}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setState(json as SegmentsState)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [clipId])

  React.useEffect(() => {
    let cancelled = false
    void Promise.resolve().then(() => {
      if (!cancelled) void load()
    })
    return () => {
      cancelled = true
    }
  }, [load])

  async function cut() {
    setCutting(true)
    try {
      const res = await fetch("/api/clip/segments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: clipId, only, audio: true }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      toast.success(`Cut ${json.segments.length} segments`)
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e))
    } finally {
      setCutting(false)
    }
  }

  if (loading && !state) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }
  if (!state) return null

  const brollCount = state.plan.filter((p) => p.broll).length
  const byIndex = new Map(state.segments.map((s) => [Number(s.file.slice(0, 2)), s]))

  return (
    <div className="space-y-4 text-sm">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border p-4">
        <div className="flex-1">
          <p className="font-medium">
            {state.plan.length} shots · {brollCount} b-roll · {state.totalSeconds.toFixed(0)}s
          </p>
          <p className="text-xs text-muted-foreground">
            One file per shot, cut on the script&apos;s timestamps, plus the full audio track.
            Frame-accurate, so each piece is exactly one shot.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-muted p-1 text-xs">
          {(["all", "broll"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setOnly(v)}
              className={`rounded-full px-3 py-1 font-medium ${only === v ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              {v === "all" ? "All shots" : "B-roll only"}
            </button>
          ))}
        </div>
        <Button onClick={cut} disabled={cutting || !state.sourceAvailable || !state.ffmpegAvailable}>
          <RiScissorsCutLine className="size-4" />
          {cutting ? "Cutting…" : state.segments.length ? "Re-cut" : "Cut segments"}
        </Button>
      </div>

      {!state.ffmpegAvailable && (
        <p className="flex items-start gap-2 rounded-2xl bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
          <RiInformationLine className="mt-0.5 size-4 shrink-0" />
          ffmpeg is not available here, so cutting is disabled. Install it with{" "}
          <code className="rounded bg-muted px-1">winget install Gyan.FFmpeg</code> and reload.
        </p>
      )}
      {!state.sourceAvailable && (
        <p className="flex items-start gap-2 rounded-2xl bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
          <RiInformationLine className="mt-0.5 size-4 shrink-0" />
          The downloaded video is not on this machine, so there is nothing to cut. Re-run the
          transcription with &quot;re-analyze&quot; to download it again.
        </p>
      )}

      {state.dir && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <RiFolderOpenLine className="size-4" />
          <code className="break-all">{state.dir}</code>
        </p>
      )}

      {state.audioPath && (
        <div className="rounded-2xl border p-3">
          <p className="mb-2 text-xs font-medium">Full audio track</p>
          <audio controls preload="none" src={fileUrl(state.audioPath)} className="w-full" />
          <p className="mt-1 text-xs text-muted-foreground">
            Play this into Shazam or a similar app to name the music.
          </p>
        </div>
      )}

      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {state.plan.map((p) => {
          const seg = byIndex.get(p.index)
          return (
            <li key={p.index} className="overflow-hidden rounded-2xl border">
              {seg ? (
                <video
                  controls
                  preload="metadata"
                  src={fileUrl(seg.path)}
                  className="aspect-[9/16] max-h-72 w-full bg-black object-contain"
                />
              ) : (
                <div className="flex aspect-[9/16] max-h-72 w-full items-center justify-center bg-muted/40 text-xs text-muted-foreground">
                  not cut yet
                </div>
              )}
              <div className="space-y-1 p-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">#{p.index}</span>
                  <span className="font-mono text-xs">
                    {p.start.toFixed(1)}–{p.end.toFixed(1)}s
                  </span>
                  <Badge variant={p.broll ? "default" : "secondary"} className="ml-auto">
                    {p.broll ? "b-roll" : "face"}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-xs leading-snug">{p.shot}</p>
                {seg && (
                  <a
                    href={fileUrl(seg.path)}
                    download={seg.file}
                    className="text-xs text-primary underline-offset-4 hover:underline"
                  >
                    {seg.file} · {(seg.sizeBytes / 1e6).toFixed(1)} MB
                  </a>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
