"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { classifyOutlier, tierColor } from "@/lib/outlier"
import { compactNumber, formatDuration, timeAgo } from "@/lib/format"
import type { OutlierVideo } from "@/lib/youtube-data.types"
import { WhyItWorked } from "./why-it-worked"
import { cn } from "@/lib/utils"
import {
  RiPlayCircleLine,
  RiExternalLinkLine,
  RiSparklingLine,
} from "@remixicon/react"

interface ResultCardProps {
  video: OutlierVideo
  onChannelClick?: (channelId: string) => void
  rank?: number
}

export function ResultCard({ video, onChannelClick, rank }: ResultCardProps) {
  const tier = classifyOutlier(video.outlier_score)
  const colors = tierColor(tier)
  const analyzeHref = `/?url=${encodeURIComponent(video.url)}&autorun=true`

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <a
          href={video.thumbnail}
          target="_blank"
          rel="noopener noreferrer"
          className="block aspect-video w-full overflow-hidden bg-muted"
        >
          {video.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.thumbnail}
              alt={video.title}
              className="h-full w-full object-cover transition-transform group-hover/card:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              no thumbnail
            </div>
          )}
        </a>
        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {formatDuration(video.duration_seconds)}
        </span>
        {typeof rank === "number" && (
          <span className="absolute top-2 left-2 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            #{rank + 1}
          </span>
        )}
        <Badge
          className={cn(
            "absolute top-2 right-2 ring-1",
            colors.bg,
            colors.text,
            colors.ring
          )}
        >
          <RiSparklingLine className="size-3" />
          {video.outlier_score.toFixed(1)}x
        </Badge>
      </div>

      <CardContent className="flex flex-col gap-2">
        <h3
          className="line-clamp-2 text-sm font-semibold leading-snug"
          title={video.title}
        >
          {video.title}
        </h3>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {onChannelClick ? (
            <button
              type="button"
              onClick={() => onChannelClick(video.channelId)}
              className="truncate hover:text-foreground hover:underline"
              title={`Open channel deep-dive for ${video.channelTitle}`}
            >
              {video.channelTitle}
            </button>
          ) : (
            <span className="truncate">{video.channelTitle}</span>
          )}
          {video.channel_subscribers !== undefined && (
            <span className="shrink-0">
              · {compactNumber(video.channel_subscribers)} subs
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span>{compactNumber(video.views)} views</span>
          <span>·</span>
          <span>{compactNumber(video.likes)} likes</span>
          <span>·</span>
          <span>{compactNumber(video.comments)} comments</span>
          <span>·</span>
          <span title={new Date(video.publishedAt).toLocaleString()}>
            {timeAgo(video.publishedAt)}
          </span>
        </div>

        <div className="text-xs text-muted-foreground">
          <Badge variant="outline" className={cn("h-5", colors.text)}>
            {colors.label}
          </Badge>
          <span className="ml-2">
            ~{compactNumber(Math.round(video.velocity))} views/day
          </span>
        </div>

        <div className="mt-1 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={analyzeHref}>
              <RiPlayCircleLine className="size-4" />
              Analyze
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              <RiExternalLinkLine className="size-4" />
              YouTube
            </a>
          </Button>
        </div>

        <WhyItWorked video={video} />
      </CardContent>
    </Card>
  )
}
