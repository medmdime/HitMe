"use client"

import * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { analyzeTitle, engagementRate, lengthSweetSpot } from "@/lib/title-heuristics"
import { compactNumber, formatDuration } from "@/lib/format"
import type { OutlierVideo } from "@/lib/youtube-data.types"
import { RiArrowDownSLine } from "@remixicon/react"
import { cn } from "@/lib/utils"

export function WhyItWorked({ video }: { video: OutlierVideo }) {
  const [open, setOpen] = React.useState(false)
  const titleSignals = analyzeTitle(video.title)
  const engagement = engagementRate(video.likes, video.comments, video.views)
  const length = lengthSweetSpot(video.duration_seconds, null)
  const baselineMedian = video.channel_median ?? 0
  const velocityHint =
    baselineMedian > 0 && video.velocity > baselineMedian / 30
      ? "Above-channel daily pace"
      : "Within channel daily pace"

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-2">
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center justify-between rounded-2xl border border-dashed border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/40"
        )}
      >
        <span>Why it might have worked</span>
        <RiArrowDownSLine
          className={cn("size-4 transition-transform", open && "rotate-180")}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2 rounded-2xl bg-muted/30 p-3 text-xs">
        <div>
          <div className="mb-1 font-medium text-foreground">
            Title patterns ({titleSignals.length} chars)
          </div>
          <div className="flex flex-wrap gap-1">
            {titleSignals.patterns.length === 0 ? (
              <span className="text-muted-foreground">
                No notable patterns detected.
              </span>
            ) : (
              titleSignals.patterns.map((p) => (
                <Badge key={p} variant="outline" className="h-5">
                  {p}
                </Badge>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stat label="Engagement rate" value={`${(engagement * 100).toFixed(2)}%`} />
          <Stat label="Velocity" value={`${compactNumber(Math.round(video.velocity))}/day`} hint={velocityHint} />
          <Stat label="Duration" value={formatDuration(video.duration_seconds)} hint={length.label} />
          <Stat label="Published" value={new Date(video.publishedAt).toLocaleDateString()} hint="Correlate with trending events" />
        </div>

        <div className="text-[11px] leading-relaxed text-muted-foreground">
          Heuristics only — for the real teardown click <span className="font-medium text-foreground">Analyze</span>.
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl bg-background/60 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-medium">{value}</div>
      {hint && <div className="text-[10px] text-muted-foreground">{hint}</div>}
    </div>
  )
}
