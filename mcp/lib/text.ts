/**
 * Output helpers.
 *
 * MCP tool results land straight in a model's context, so raw JSON dumps of
 * 50 videos (descriptions included) are the fastest way to burn a window for
 * nothing. Everything here trades completeness for signal density: compact
 * tables for scanning, full detail only when a tool is about one item.
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js"
import type { OutlierVideo, VideoStats } from "../../lib/youtube-data.types"
import { classifyOutlier } from "../../lib/outlier"

export function text(body: string): CallToolResult {
  return { content: [{ type: "text", text: body }] }
}

export function fail(message: string): CallToolResult {
  return { content: [{ type: "text", text: message }], isError: true }
}

/** Wraps a tool handler so thrown errors become readable isError results. */
export function guard<A extends unknown[]>(
  fn: (...args: A) => Promise<CallToolResult>
): (...args: A) => Promise<CallToolResult> {
  return async (...args: A) => {
    try {
      return await fn(...args)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return fail(`Error: ${message}`)
    }
  }
}

export function compact(n: number): string {
  if (!Number.isFinite(n)) return "-"
  if (n < 1000) return String(Math.round(n))
  for (const [v, s] of [
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"],
  ] as const) {
    if (n >= v) {
      const x = n / v
      return `${x >= 10 ? x.toFixed(0) : x.toFixed(1)}${s}`
    }
  }
  return String(Math.round(n))
}

export function duration(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "0:00"
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  const pad = (n: number) => String(n).padStart(2, "0")
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

export function age(iso: string): string {
  const sec = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  for (const [s, label] of [
    [86400 * 365, "y"],
    [86400 * 30, "mo"],
    [86400 * 7, "w"],
    [86400, "d"],
    [3600, "h"],
  ] as const) {
    if (sec >= s) return `${Math.floor(sec / s)}${label}`
  }
  return "new"
}

/**
 * One video per row. Deliberately no description — at 50 rows that alone is
 * tens of thousands of tokens, and the title plus score is what you rank on.
 */
export function videoTable(videos: OutlierVideo[]): string {
  if (videos.length === 0) return "_No videos matched._"
  const rows = videos.map((v) => {
    const tier = classifyOutlier(v.outlier_score)
    return [
      `${v.outlier_score.toFixed(1)}x`,
      tier,
      compact(v.views),
      v.channel_subscribers === undefined ? "?" : compact(v.channel_subscribers),
      duration(v.duration_seconds),
      age(v.publishedAt),
      escapePipes(truncate(v.title, 70)),
      escapePipes(truncate(v.channelTitle, 24)),
      v.videoId,
    ].join(" | ")
  })
  return [
    "score | tier | views | subs | len | age | title | channel | videoId",
    "---|---|---|---|---|---|---|---|---",
    ...rows,
  ].join("\n")
}

export function videoDetail(v: VideoStats): string {
  return [
    `**${v.title}**`,
    `- channel: ${v.channelTitle} (${v.channelId})`,
    `- videoId: ${v.videoId}`,
    `- url: ${v.url}`,
    `- published: ${v.publishedAt} (${age(v.publishedAt)} ago)`,
    `- duration: ${duration(v.duration_seconds)}`,
    `- views: ${v.views.toLocaleString()} | likes: ${v.likes.toLocaleString()} | comments: ${v.comments.toLocaleString()}`,
    v.defaultAudioLanguage ? `- audio language: ${v.defaultAudioLanguage}` : null,
  ]
    .filter(Boolean)
    .join("\n")
}

export function truncate(s: string, max: number): string {
  const clean = s.replace(/\s+/g, " ").trim()
  return clean.length <= max ? clean : `${clean.slice(0, max - 1)}…`
}

function escapePipes(s: string): string {
  return s.replace(/\|/g, "/")
}

/** Clamp a number into a range, with a default for undefined. */
export function clamp(v: number | undefined, min: number, max: number, dflt: number): number {
  if (v === undefined || !Number.isFinite(v)) return dflt
  return Math.min(Math.max(v, min), max)
}
