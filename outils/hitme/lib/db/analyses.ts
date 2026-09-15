import { desc, eq, sql } from "drizzle-orm"
import { db } from "./client"
import { analyses, type AnalysisInsert, type AnalysisRow } from "./schema"
import type {
  ChannelInfo,
  VideoStats,
} from "@/lib/youtube-data.types"

export interface AnalyzePayload {
  videoId: string
  url: string
  script: string
  analysis: string
  metadata: { video: VideoStats; channel: ChannelInfo | null } | null
}

export interface RecentRow {
  videoId: string
  url: string
  title: string | null
  channelId: string | null
  channelTitle: string | null
  thumbnail: string | null
  script: string
  analysis: string
  metadata: { video: VideoStats; channel: ChannelInfo | null } | null
  analyzed_at: string
  created_at: string
}

function rowToDto(row: AnalysisRow): RecentRow {
  return {
    videoId: row.videoId,
    url: row.url,
    title: row.title,
    channelId: row.channelId,
    channelTitle: row.channelTitle,
    thumbnail: row.thumbnail,
    script: row.script,
    analysis: row.analysis,
    metadata: (row.metadata as RecentRow["metadata"]) ?? null,
    analyzed_at: row.analyzedAt.toISOString(),
    created_at: row.createdAt.toISOString(),
  }
}

export async function listAnalyses(limit = 200): Promise<RecentRow[]> {
  const rows = await db()
    .select()
    .from(analyses)
    .orderBy(desc(analyses.analyzedAt))
    .limit(limit)
  return rows.map(rowToDto)
}

export async function getAnalysis(videoId: string): Promise<RecentRow | null> {
  const rows = await db()
    .select()
    .from(analyses)
    .where(eq(analyses.videoId, videoId))
    .limit(1)
  const row = rows[0]
  return row ? rowToDto(row) : null
}

export async function upsertAnalysis(payload: AnalyzePayload): Promise<RecentRow> {
  const video = payload.metadata?.video
  const insert: AnalysisInsert = {
    videoId: payload.videoId,
    url: payload.url,
    title: video?.title ?? null,
    channelId: video?.channelId ?? null,
    channelTitle: video?.channelTitle ?? null,
    thumbnail: video?.thumbnail ?? null,
    script: payload.script,
    analysis: payload.analysis,
    metadata: payload.metadata,
    analyzedAt: new Date(),
  }
  const rows = await db()
    .insert(analyses)
    .values(insert)
    .onConflictDoUpdate({
      target: analyses.videoId,
      set: {
        url: insert.url,
        title: insert.title,
        channelId: insert.channelId,
        channelTitle: insert.channelTitle,
        thumbnail: insert.thumbnail,
        script: insert.script,
        analysis: insert.analysis,
        metadata: insert.metadata,
        analyzedAt: insert.analyzedAt,
      },
    })
    .returning()
  return rowToDto(rows[0])
}

export async function deleteAnalysis(videoId: string): Promise<boolean> {
  const result = await db()
    .delete(analyses)
    .where(eq(analyses.videoId, videoId))
    .returning({ videoId: analyses.videoId })
  return result.length > 0
}

export async function deleteAllAnalyses(): Promise<number> {
  const result = await db()
    .delete(analyses)
    .returning({ videoId: analyses.videoId })
  return result.length
}

export async function countAnalyses(): Promise<number> {
  const result = await db()
    .select({ n: sql<number>`count(*)::int` })
    .from(analyses)
  return Number(result[0]?.n ?? 0)
}
