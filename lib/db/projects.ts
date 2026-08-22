import { desc, eq, sql } from "drizzle-orm"
import { db } from "./client"
import { projects, type ProjectInsert, type ProjectRow } from "./schema"

/** A reference video feeding the remix. */
export interface ProjectSource {
  /** "yt:VIDEOID" for rows in `analyses`, "instagram:SHORTCODE" etc. for `clips`. */
  ref: string
  title?: string
  /** What this source contributes: hook, structure, a specific segment, tone. */
  note?: string
}

export interface BrollShot {
  index: number
  timestamp: string
  shot: string
  narration?: string
  /** How this shot gets filled. */
  source: "face-cam" | "generate" | "stock" | "screen-record" | "clip" | "unset"
  /** Generation prompt, stock search query, or source clip reference. */
  prompt?: string
  status?: "planned" | "generated" | "sourced" | "done"
  assetPath?: string
  notes?: string
}

export interface ProjectPayload {
  id: string
  title: string
  brief?: string | null
  status?: string
  sources?: ProjectSource[] | null
  script?: string | null
  brollPlan?: BrollShot[] | null
  notes?: string | null
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "project"
  )
}

export async function upsertProject(payload: ProjectPayload): Promise<ProjectRow> {
  const insert: ProjectInsert = {
    id: payload.id,
    title: payload.title,
    brief: payload.brief ?? null,
    status: payload.status ?? "draft",
    sources: payload.sources ?? null,
    script: payload.script ?? null,
    brollPlan: payload.brollPlan ?? null,
    notes: payload.notes ?? null,
    updatedAt: new Date(),
  }
  const rows = await db()
    .insert(projects)
    .values(insert)
    .onConflictDoUpdate({
      target: projects.id,
      set: {
        title: insert.title,
        brief: insert.brief,
        status: insert.status,
        sources: insert.sources,
        script: insert.script,
        brollPlan: insert.brollPlan,
        notes: insert.notes,
        updatedAt: insert.updatedAt,
      },
    })
    .returning()
  return rows[0]
}

/**
 * Partial update — only the fields present are written, so a tool that just
 * sets the script cannot blank out the b-roll plan.
 */
export async function patchProject(
  id: string,
  patch: Partial<Omit<ProjectPayload, "id">>
): Promise<ProjectRow | null> {
  const existing = await getProject(id)
  if (!existing) return null
  return upsertProject({
    id,
    title: patch.title ?? existing.title,
    brief: patch.brief !== undefined ? patch.brief : existing.brief,
    status: patch.status ?? existing.status,
    sources:
      patch.sources !== undefined
        ? patch.sources
        : (existing.sources as ProjectSource[] | null),
    script: patch.script !== undefined ? patch.script : existing.script,
    brollPlan:
      patch.brollPlan !== undefined
        ? patch.brollPlan
        : (existing.brollPlan as BrollShot[] | null),
    notes: patch.notes !== undefined ? patch.notes : existing.notes,
  })
}

export async function getProject(id: string): Promise<ProjectRow | null> {
  const rows = await db().select().from(projects).where(eq(projects.id, id)).limit(1)
  return rows[0] ?? null
}

export async function listProjects(limit = 50): Promise<ProjectRow[]> {
  return db().select().from(projects).orderBy(desc(projects.updatedAt)).limit(limit)
}

export async function deleteProject(id: string): Promise<boolean> {
  const rows = await db()
    .delete(projects)
    .where(eq(projects.id, id))
    .returning({ id: projects.id })
  return rows.length > 0
}

export async function countProjects(): Promise<number> {
  const rows = await db().select({ n: sql<number>`count(*)::int` }).from(projects)
  return Number(rows[0]?.n ?? 0)
}
