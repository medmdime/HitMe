"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  RiTimeLine,
  RiCloseLine,
  RiDeleteBin6Line,
  RiPlayCircleLine,
  RiCloudLine,
} from "@remixicon/react"
import {
  clearRecent,
  deleteRecent,
  type RecentAnalysis,
} from "@/lib/recent-analyses"
import { useRecentAnalyses } from "@/lib/use-recent-analyses"
import { compactNumber, timeAgo, formatDuration } from "@/lib/format"
import { toast } from "sonner"

interface Props {
  onOpen: (entry: RecentAnalysis) => void
  className?: string
}

export function RecentAnalyses({ onOpen, className }: Props) {
  const { entries, loading, error } = useRecentAnalyses()

  if (loading && entries.length === 0) {
    return (
      <section className={cn("space-y-3", className)}>
        <h2 className="flex items-center gap-1.5 font-heading text-lg font-semibold">
          <RiTimeLine className="size-4" />
          Recent analyses
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-3xl" />
          ))}
        </div>
      </section>
    )
  }

  if (error && entries.length === 0) {
    return (
      <section className={cn("space-y-3", className)}>
        <h2 className="flex items-center gap-1.5 font-heading text-lg font-semibold">
          <RiTimeLine className="size-4" />
          Recent analyses
        </h2>
        <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      </section>
    )
  }

  if (entries.length === 0) return null

  async function handleClearAll() {
    if (!confirm(`Clear all ${entries.length} analyses from the shared DB?`)) return
    try {
      await clearRecent()
      toast.success("Cleared")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e))
    }
  }

  async function handleDelete(videoId: string) {
    try {
      await deleteRecent(videoId)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 font-heading text-lg font-semibold">
          <RiTimeLine className="size-4" />
          Recent analyses
          <span className="text-xs font-normal text-muted-foreground">
            ({entries.length})
          </span>
          <Badge variant="outline" className="ml-1 h-5 text-[10px]">
            <RiCloudLine className="size-3" />
            shared
          </Badge>
        </h2>
        <Button size="sm" variant="ghost" onClick={handleClearAll}>
          <RiDeleteBin6Line className="size-4" />
          Clear all
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <RecentCard
            key={entry.videoId}
            entry={entry}
            onOpen={() => onOpen(entry)}
            onDelete={() => handleDelete(entry.videoId)}
          />
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground">
        Stored in your shared Neon database — visible to anyone with the same{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
          DATABASE_URL
        </code>
        .
      </p>
    </section>
  )
}

function RecentCard({
  entry,
  onOpen,
  onDelete,
}: {
  entry: RecentAnalysis
  onOpen: () => void
  onDelete: () => void
}) {
  const video = entry.metadata?.video
  const title = video?.title ?? `Video ${entry.videoId}`
  const channel = video?.channelTitle ?? ""
  const thumbnail =
    video?.thumbnail ?? `https://i.ytimg.com/vi/${entry.videoId}/hqdefault.jpg`

  function stop(e: React.MouseEvent | React.KeyboardEvent) {
    e.stopPropagation()
  }

  return (
    <Card size="sm" className="group/recent overflow-hidden">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left"
        title="Open this cached analysis instantly"
      >
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt=""
            className="aspect-video w-full object-cover transition-transform group-hover/recent:scale-[1.02]"
          />
          {video?.duration_seconds && (
            <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
              {formatDuration(video.duration_seconds)}
            </span>
          )}
          <Badge className="absolute top-1.5 left-1.5 bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/30">
            cached
          </Badge>
          <button
            type="button"
            onClick={(e) => {
              stop(e)
              onDelete()
            }}
            className="absolute top-1.5 right-1.5 inline-flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover/recent:opacity-100 focus-visible:opacity-100"
            aria-label="Delete from recents"
          >
            <RiCloseLine className="size-3" />
          </button>
        </div>
        <CardContent className="space-y-1.5">
          <h3 className="line-clamp-2 text-xs font-semibold leading-snug">
            {title}
          </h3>
          {channel && (
            <div className="truncate text-[11px] text-muted-foreground">
              {channel}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-muted-foreground">
            {video?.views !== undefined && (
              <>
                <span>{compactNumber(video.views)} views</span>
                <span>·</span>
              </>
            )}
            <span>analyzed {timeAgo(entry.analyzed_at)}</span>
          </div>
          <div className="pt-1">
            <Button size="xs" variant="secondary" className="pointer-events-none">
              <RiPlayCircleLine className="size-3" />
              Open instantly
            </Button>
          </div>
        </CardContent>
      </button>
    </Card>
  )
}
