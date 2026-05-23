import { pgTable, text, jsonb, timestamp, index } from "drizzle-orm/pg-core"

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
