"use client"

import * as React from "react"
import { SocialCard, type SocialPostView } from "./social-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RiInformationLine } from "@remixicon/react"

interface SocialGridProps {
  posts: SocialPostView[]
  loading?: boolean
  error?: string | null
  emptyHint?: string
  pageSize?: number
}

export function SocialGrid({
  posts,
  loading,
  error,
  emptyHint,
  pageSize = 24,
}: SocialGridProps) {
  const [visible, setVisible] = React.useState(pageSize)
  const [prevPosts, setPrevPosts] = React.useState(posts)
  if (prevPosts !== posts) {
    setPrevPosts(posts)
    setVisible(pageSize)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-3xl border p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-full" />
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

  if (posts.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-3xl border border-dashed p-6 text-sm text-muted-foreground">
        <RiInformationLine className="size-4" />
        {emptyHint ?? "No results yet — scan an account."}
      </div>
    )
  }

  const shown = posts.slice(0, visible)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((p, i) => (
          <SocialCard key={p.id} post={p} rank={i} />
        ))}
      </div>
      {visible < posts.length && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setVisible((v) => v + pageSize)}>
            Load more ({posts.length - visible} remaining)
          </Button>
        </div>
      )}
    </div>
  )
}
