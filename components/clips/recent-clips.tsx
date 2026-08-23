"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { timeAgo, formatDuration } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ClipListItem } from "./types"
import { RiInstagramLine, RiTiktokLine, RiFileVideoLine, RiLayoutGridLine } from "@remixicon/react"

function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  if (platform === "instagram") return <RiInstagramLine className={className} />
  if (platform === "tiktok") return <RiTiktokLine className={className} />
  return <RiFileVideoLine className={className} />
}

export function RecentClips({
  activeId,
  onSelect,
  refreshSignal,
}: {
  activeId: string | null
  onSelect: (id: string) => void
  refreshSignal: number
}) {
  const [clips, setClips] = React.useState<ClipListItem[] | null>(null)

  React.useEffect(() => {
    let cancelled = false
    fetch("/api/clip")
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled) setClips(j.clips ?? [])
      })
      .catch(() => {
        if (!cancelled) setClips([])
      })
    return () => {
      cancelled = true
    }
  }, [refreshSignal])

  return (
    <div className="rounded-3xl border p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <RiLayoutGridLine className="size-4" />
        Library
        {clips && <span className="text-xs font-normal text-muted-foreground">({clips.length})</span>}
      </h2>
      {clips === null ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : clips.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nothing transcribed yet. Paste a link above.</p>
      ) : (
        <ul className="max-h-[60vh] space-y-1 overflow-y-auto">
          {clips.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-xl p-2 text-left transition-colors hover:bg-muted/60",
                  activeId === c.id && "bg-primary/5 ring-1 ring-primary/30"
                )}
              >
                <PlatformIcon platform={c.platform} className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-xs font-medium leading-snug">{c.title ?? c.id}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {c.author ? `@${c.author} · ` : ""}
                    {c.durationSeconds ? `${formatDuration(c.durationSeconds)} · ` : ""}
                    {timeAgo(c.analyzedAt)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
