"use client"

import * as React from "react"
import { ResultCard } from "./result-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { OutlierVideo } from "@/lib/youtube-data.types"
import { RiInformationLine } from "@remixicon/react"

interface ResultsGridProps {
  videos: OutlierVideo[]
  loading?: boolean
  error?: string | null
  onChannelClick?: (channelId: string) => void
  emptyHint?: string
  pageSize?: number
}

export function ResultsGrid({
  videos,
  loading,
  error,
  onChannelClick,
  emptyHint,
  pageSize = 25,
}: ResultsGridProps) {
  const [visible, setVisible] = React.useState(pageSize)
  const [prevVideos, setPrevVideos] = React.useState(videos)
  const [prevPageSize, setPrevPageSize] = React.useState(pageSize)
  if (prevVideos !== videos || prevPageSize !== pageSize) {
    setPrevVideos(videos)
    setPrevPageSize(pageSize)
    setVisible(pageSize)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-video w-full rounded-3xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-3xl border border-dashed p-6 text-sm text-muted-foreground">
        <RiInformationLine className="size-4" />
        {emptyHint ?? "No results yet — run a search."}
      </div>
    )
  }

  const shown = videos.slice(0, visible)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((v, i) => (
          <ResultCard
            key={v.videoId}
            video={v}
            rank={i}
            onChannelClick={onChannelClick}
          />
        ))}
      </div>
      {visible < videos.length && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setVisible((v) => v + pageSize)}>
            Load more ({videos.length - visible} remaining)
          </Button>
        </div>
      )}
    </div>
  )
}
