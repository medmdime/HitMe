"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { compactNumber } from "@/lib/format"
import { RiVerifiedBadgeFill, RiAlertLine } from "@remixicon/react"

export interface AccountSummary {
  handle: string
  name: string
  verified: boolean
  followers: number
  totalPosts: number
  /** What the baseline number counts, e.g. "median views" or "median likes". */
  baselineLabel: string
  baseline: number
  scanned: number
  truncated: boolean
  /** Set when the platform cut the scan short. */
  rateLimited?: boolean
  /** Extra caveat shown under the stats, e.g. Instagram's photo/view gap. */
  note?: string
}

export function AccountHeader({ summary }: { summary: AccountSummary }) {
  return (
    <div className="rounded-3xl border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-heading text-lg font-semibold">@{summary.handle}</span>
        {summary.verified && (
          <RiVerifiedBadgeFill className="size-4 text-blue-500" aria-label="verified" />
        )}
        {summary.name && (
          <span className="text-sm text-muted-foreground">{summary.name}</span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">
            {compactNumber(summary.followers)}
          </span>{" "}
          followers
        </span>
        <span>
          <span className="font-medium text-foreground">
            {summary.totalPosts.toLocaleString()}
          </span>{" "}
          posts
        </span>
        <span>
          baseline{" "}
          <span className="font-medium text-foreground">
            {compactNumber(summary.baseline)}
          </span>{" "}
          {summary.baselineLabel}
        </span>
        <Badge variant="secondary">
          scanned {summary.scanned}
          {summary.truncated ? ` of ${summary.totalPosts.toLocaleString()}` : ""}
        </Badge>
      </div>

      {summary.rateLimited && (
        <p className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
          <RiAlertLine className="mt-0.5 size-4 shrink-0" />
          The platform throttled this scan partway, so it covers fewer posts than
          requested. Results are cached for 6 hours — retry later, or lower the scan depth.
        </p>
      )}

      {summary.note && (
        <p className="mt-3 text-xs text-muted-foreground">{summary.note}</p>
      )}
    </div>
  )
}
