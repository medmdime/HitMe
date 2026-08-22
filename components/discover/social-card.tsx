"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { classifySocial } from "@/lib/social-outlier"
import { compactNumber, timeAgo } from "@/lib/format"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  RiExternalLinkLine,
  RiFileCopyLine,
  RiHeart3Line,
  RiChat3Line,
  RiShareForwardLine,
  RiBookmarkLine,
  RiEyeLine,
  RiSparklingLine,
} from "@remixicon/react"

/**
 * One post from a short-form platform, normalized so TikTok and Instagram
 * render through the same card.
 *
 * `views` is nullable on purpose: Instagram publishes no view count for photos
 * or carousels, and showing a fabricated zero there would be worse than an
 * honest dash.
 */
export interface SocialPostView {
  id: string
  url: string
  caption: string
  createdAt: string
  outlier_score: number
  engagement_rate: number
  views: number | null
  likes: number
  comments: number
  shares?: number
  saves?: number
  kind: string
  /** Platform rounds this number enough that the score is approximate. */
  coarse?: boolean
}

function tierClasses(score: number): { bg: string; text: string; ring: string } {
  switch (classifySocial(score)) {
    case "freak":
      return { bg: "bg-red-500/15", text: "text-red-500", ring: "ring-red-500/30" }
    case "banger":
      return { bg: "bg-orange-500/15", text: "text-orange-500", ring: "ring-orange-500/30" }
    case "strong":
      return { bg: "bg-yellow-500/15", text: "text-yellow-500", ring: "ring-yellow-500/30" }
    case "solid":
      return { bg: "bg-emerald-500/15", text: "text-emerald-500", ring: "ring-emerald-500/30" }
    default:
      return { bg: "bg-muted", text: "text-muted-foreground", ring: "ring-border" }
  }
}

function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: number | null | undefined
  label: string
}) {
  if (value === null || value === undefined) return null
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground" title={`${label}: ${value.toLocaleString()}`}>
      <Icon className="size-3.5" />
      {compactNumber(value)}
    </span>
  )
}

export function SocialCard({ post, rank }: { post: SocialPostView; rank?: number }) {
  const colors = tierClasses(post.outlier_score)

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(post.url)
      toast.success("Post URL copied — paste it into transcribe_clip")
    } catch {
      toast.error("Could not copy to clipboard")
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1">
            <Badge className={cn("ring-1 tabular-nums", colors.bg, colors.text, colors.ring)}>
              <RiSparklingLine className="size-3" />
              {post.outlier_score.toFixed(1)}x{post.coarse ? "~" : ""}
            </Badge>
            {typeof rank === "number" && (
              <span className="text-xs text-muted-foreground">#{rank + 1}</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="line-clamp-3 text-sm leading-snug">
              {post.caption.trim() || (
                <span className="text-muted-foreground italic">no caption</span>
              )}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium">{post.kind}</span>
              <span>{timeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3">
          <Metric icon={RiEyeLine} value={post.views} label="views" />
          <Metric icon={RiHeart3Line} value={post.likes} label="likes" />
          <Metric icon={RiChat3Line} value={post.comments} label="comments" />
          <Metric icon={RiShareForwardLine} value={post.shares} label="shares" />
          <Metric icon={RiBookmarkLine} value={post.saves} label="saves" />
          <span
            className="ml-auto text-xs font-medium tabular-nums"
            title="Engagement relative to reach"
          >
            {(post.engagement_rate * 100).toFixed(1)}%
          </span>
        </div>

        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="flex-1">
            <a href={post.url} target="_blank" rel="noopener noreferrer">
              <RiExternalLinkLine className="size-4" />
              Open
            </a>
          </Button>
          <Button size="sm" variant="ghost" onClick={copyUrl} title="Copy URL for transcription">
            <RiFileCopyLine className="size-4" />
            Copy
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
