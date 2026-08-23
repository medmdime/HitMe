import {
  pgTable,
  text,
  jsonb,
  timestamp,
  index,
  integer,
} from "drizzle-orm/pg-core"

export const analyses = pgTable(
  "analyses",
  {
    // YouTube videoId is naturally unique — use it as the PK.
    videoId: text("video_id").primaryKey(),
    url: text("url").notNull(),
    title: text("title"),
    channelId: text("channel_id"),
    channelTitle: text("channel_title"),
    thumbnail: text("thumbnail"),
    script: text("script").notNull(),
    analysis: text("analysis").notNull(),
    // Full VideoStats + ChannelInfo blob so the UI can rehydrate without
    // round-tripping to YouTube.
    metadata: jsonb("metadata"),
    // Tracks when this row was last (re)analyzed. Upserts bump this.
    analyzedAt: timestamp("analyzed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("analyses_analyzed_at_idx").on(t.analyzedAt)]
)

export type AnalysisRow = typeof analyses.$inferSelect
export type AnalysisInsert = typeof analyses.$inferInsert

/**
 * Non-YouTube reference clips: Instagram reels, TikToks, local files.
 *
 * Kept separate from `analyses` because that table is keyed on an 11-char
 * YouTube video id and the web analyzer renders a YouTube player for every row
 * in it. A reel dropped into that table would break the player.
 */
export const clips = pgTable(
  "clips",
  {
    // "instagram:Dbs_Jp7xLFt", "tiktok:7123…", "file:my-clip.mp4"
    id: text("id").primaryKey(),
    platform: text("platform").notNull(),
    url: text("url"),
    title: text("title"),
    author: text("author"),
    caption: text("caption"),
    durationSeconds: integer("duration_seconds"),
    // Where the downloaded file sits locally, so b-roll cutting can reuse it.
    localPath: text("local_path"),
    script: text("script").notNull(),
    analysis: text("analysis").notNull(),
    // Topic-agnostic blueprint of the format, for remaking the video on a
    // different subject. Empty for rows analyzed before templates existed.
    template: text("template").notNull().default(""),
    metadata: jsonb("metadata"),
    analyzedAt: timestamp("analyzed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("clips_analyzed_at_idx").on(t.analyzedAt)]
)

export type ClipRow = typeof clips.$inferSelect
export type ClipInsert = typeof clips.$inferInsert

/**
 * A video being built: the brief, which references feed it, the working script,
 * and the b-roll plan. This is what makes the workflow resumable — close the
 * session, come back, and the draft is still there.
 */
export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(), // slug, e.g. "morning-routine-remix"
    title: text("title").notNull(),
    // The angle: what MY version is about, for whom, and why it is different.
    brief: text("brief"),
    status: text("status").notNull().default("draft"),
    // [{ ref, kind, note }] — the reference videos this remix draws from.
    sources: jsonb("sources"),
    // Bracket-format script, same shape lib/parse-script.ts expects.
    script: text("script"),
    // [{ index, timestamp, shot, source, prompt, status, assetPath }]
    brollPlan: jsonb("broll_plan"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("projects_updated_at_idx").on(t.updatedAt)]
)

export type ProjectRow = typeof projects.$inferSelect
export type ProjectInsert = typeof projects.$inferInsert
