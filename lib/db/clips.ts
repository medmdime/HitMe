import { desc, eq, ilike, or, sql } from "drizzle-orm"
import { db } from "./client"
import { clips, type ClipInsert, type ClipRow } from "./schema"

export interface ClipPayload {
  id: string
  platform: string
  url?: string | null
  title?: string | null
  author?: string | null
  caption?: string | null
  durationSeconds?: number | null
  localPath?: string | null
  script: string
  analysis: string
  template?: string
  metadata?: unknown
}

export async function upsertClip(payload: ClipPayload): Promise<ClipRow> {
  const insert: ClipInsert = {
    id: payload.id,
    platform: payload.platform,
    url: payload.url ?? null,
    title: payload.title ?? null,
    author: payload.author ?? null,
    caption: payload.caption ?? null,
    // duration_seconds is an integer column, but ffprobe reports a float
    // (76.299365). Postgres rejects that outright, and because the DB write is
    // best effort the whole row would vanish with only a line on stderr.
    durationSeconds: payload.durationSeconds == null ? null : Math.round(payload.durationSeconds),
    localPath: payload.localPath ?? null,
    script: payload.script,
    analysis: payload.analysis,
    template: payload.template ?? "",
    metadata: payload.metadata ?? null,
    analyzedAt: new Date(),
  }
  const rows = await db()
    .insert(clips)
    .values(insert)
    .onConflictDoUpdate({
      target: clips.id,
      set: {
        platform: insert.platform,
        url: insert.url,
        title: insert.title,
        author: insert.author,
        caption: insert.caption,
        durationSeconds: insert.durationSeconds,
        localPath: insert.localPath,
        script: insert.script,
        analysis: insert.analysis,
        template: insert.template,
        metadata: insert.metadata,
        analyzedAt: insert.analyzedAt,
      },
    })
    .returning()
  return rows[0]
}

export async function listClips(limit = 50, platform?: string): Promise<ClipRow[]> {
  const q = db().select().from(clips)
  const rows = platform
    ? await q.where(eq(clips.platform, platform)).orderBy(desc(clips.analyzedAt)).limit(limit)
    : await q.orderBy(desc(clips.analyzedAt)).limit(limit)
  return rows
}

export async function getClip(id: string): Promise<ClipRow | null> {
  const rows = await db().select().from(clips).where(eq(clips.id, id)).limit(1)
  return rows[0] ?? null
}

export async function searchClips(term: string, limit = 25): Promise<ClipRow[]> {
  const needle = `%${term}%`
  return db()
    .select()
    .from(clips)
    .where(
      or(
        ilike(clips.title, needle),
        ilike(clips.caption, needle),
        ilike(clips.script, needle),
        ilike(clips.analysis, needle)
      )
    )
    .orderBy(desc(clips.analyzedAt))
    .limit(limit)
}

export async function deleteClip(id: string): Promise<boolean> {
  const rows = await db().delete(clips).where(eq(clips.id, id)).returning({ id: clips.id })
  return rows.length > 0
}

export async function countClips(): Promise<number> {
  const rows = await db().select({ n: sql<number>`count(*)::int` }).from(clips)
  return Number(rows[0]?.n ?? 0)
}
