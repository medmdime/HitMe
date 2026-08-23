import type { ScriptBlock } from "@/lib/parse-script"

/** Mirrors lib/clip-pipeline's ClipResult, as it arrives over JSON. */
export interface ClipView {
  id: string
  platform: string
  cached: boolean
  url: string | null
  title: string
  author: string | null
  caption: string | null
  durationSeconds: number | null
  localPath: string | null
  metadata: {
    viewCount: number | null
    likeCount: number | null
    commentCount: number | null
    width: number | null
    height: number | null
    track: string | null
    artist: string | null
    uploadDate: string | null
  } | null
  script: string
  analysis: string
  template: string
  blocks: ScriptBlock[]
  sound: { track: string; artist: string | null } | null
}

export interface ClipListItem {
  id: string
  platform: string
  url: string | null
  title: string | null
  author: string | null
  durationSeconds: number | null
  analyzedAt: string
  hasTemplate: boolean
}

export interface SegmentPlanItem {
  index: number
  timestamp: string
  shot: string
  start: number
  end: number
  broll: boolean
}

export interface SegmentsState {
  id: string
  totalSeconds: number
  plan: SegmentPlanItem[]
  dir: string | null
  segments: { file: string; path: string; sizeBytes: number }[]
  audioPath: string | null
  sourceAvailable: boolean
  ffmpegAvailable: boolean
}

/** URL the browser can load a workspace file from. */
export function fileUrl(path: string): string {
  return `/api/clip/file?path=${encodeURIComponent(path)}`
}
