/**
 * The saved-work library.
 *
 * Everything ever analyzed lives in two tables: `analyses` (YouTube, shared
 * with the web app) and `clips` (reels, TikToks, local files). These tools read
 * across both so "what have I already studied about X" is one question, not two.
 */
import { z } from "zod"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { getAnalysis, listAnalyses } from "../../lib/db/analyses"
import { getClip, listClips, searchClips } from "../../lib/db/clips"
import { collectAnnotations, parseScript } from "../../lib/parse-script"
import { requireEnv } from "../env"
import { age, compact, guard, text, truncate } from "../lib/text"

/**
 * Accepts "yt:ID", a YouTube URL, a bare 11-char id, or a clip id like
 * "instagram:Dbs_Jp7xLFt". Returns which table to look in.
 */
function parseRef(ref: string): { kind: "youtube" | "clip"; id: string } {
  const raw = ref.trim()
  if (/^yt:/i.test(raw)) return { kind: "youtube", id: raw.slice(3) }
  if (/^(instagram|tiktok|file|web|twitter|facebook):/i.test(raw)) {
    return { kind: "clip", id: raw }
  }
  const m = raw.match(/(?:v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/)
  if (m) return { kind: "youtube", id: m[1] }
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return { kind: "youtube", id: raw }
  return { kind: "clip", id: raw }
}

function requireDb() {
  requireEnv("DATABASE_URL")
}

export function registerLibraryTools(server: McpServer) {
  server.registerTool(
    "library_list",
    {
      title: "List saved teardowns",
      description:
        "Everything already analyzed — YouTube teardowns and short-form clips — newest first. " +
        "Start here before analyzing anything new: the work may already be done, and this is the " +
        "raw material for a remix.",
      inputSchema: {
        kind: z
          .enum(["all", "youtube", "clips"])
          .optional()
          .describe("Which library to list (default all)"),
        limit: z.number().optional().describe("Max rows per library (default 30)"),
      },
    },
    guard(async (a) => {
      requireDb()
      const kind = a.kind ?? "all"
      const limit = Math.min(Math.max(a.limit ?? 30, 1), 200)
      const out: string[] = []

      if (kind === "all" || kind === "youtube") {
        const rows = await listAnalyses(limit)
        out.push(`## YouTube teardowns (${rows.length})`)
        out.push(
          rows.length
            ? [
                "ref | title | channel | analyzed",
                "---|---|---|---",
                ...rows.map(
                  (r) =>
                    `yt:${r.videoId} | ${truncate(r.title ?? r.videoId, 60)} | ${truncate(r.channelTitle ?? "?", 24)} | ${age(r.analyzed_at)} ago`
                ),
              ].join("\n")
            : "_Nothing analyzed yet._"
        )
      }

      if (kind === "all" || kind === "clips") {
        const rows = await listClips(limit)
        out.push("")
        out.push(`## Short-form clips (${rows.length})`)
        out.push(
          rows.length
            ? [
                "ref | title | author | analyzed",
                "---|---|---|---",
                ...rows.map(
                  (r) =>
                    `${r.id} | ${truncate(r.title ?? r.id, 60)} | ${truncate(r.author ?? "?", 24)} | ${age(r.analyzedAt.toISOString())} ago`
                ),
              ].join("\n")
            : "_No clips transcribed yet._"
        )
      }

      return text(out.join("\n"))
    })
  )

  server.registerTool(
    "library_get",
    {
      title: "Read one saved teardown in full",
      description:
        "Fetch the complete bracket script and teardown for something already analyzed. " +
        "Accepts yt:VIDEOID, a YouTube URL or id, or a clip id like instagram:SHORTCODE. " +
        "This is how you load a reference before writing a remix.",
      inputSchema: {
        ref: z.string().describe("yt:VIDEOID, a YouTube URL/id, or a clip id"),
        section: z
          .enum(["all", "script", "teardown", "shots", "template", "audio"])
          .optional()
          .describe(
            "all (default), script, teardown, shots (shot list without narration), template (the format blueprint, clips only), or audio (music + SFX timeline, clips only)"
          ),
      },
    },
    guard(async (a) => {
      requireDb()
      const { kind, id } = parseRef(a.ref)
      const section = a.section ?? "all"

      let title: string
      let subtitle: string
      let script: string
      let analysis: string
      let template = ""

      if (kind === "youtube") {
        const row = await getAnalysis(id)
        if (!row) {
          throw new Error(
            `No saved teardown for yt:${id}. Run analyze_youtube_video first.`
          )
        }
        title = row.title ?? id
        subtitle = [row.channelTitle, row.url].filter(Boolean).join(" · ")
        script = row.script
        analysis = row.analysis
      } else {
        const row = await getClip(id)
        if (!row) {
          throw new Error(`No saved clip "${id}". Run transcribe_clip first.`)
        }
        title = row.title ?? id
        subtitle = [row.author, row.url, row.localPath].filter(Boolean).join(" · ")
        script = row.script
        analysis = row.analysis
        template = row.template ?? ""
      }

      const parts: string[] = [`## ${title}`, subtitle, ""]
      if (section === "shots") {
        const blocks = parseScript(script)
        parts.push(
          blocks.length
            ? blocks
                .map((b, i) => {
                  const tags = b.annotations.map((a) => a.kind).join(",")
                  return `${i + 1}. [${b.timestamp}] ${b.shot}${tags ? `  ⟨${tags}⟩` : ""}`
                })
                .join("\n")
            : "_Script did not parse into bracket blocks._"
        )
      } else if (section === "template") {
        parts.push(
          template ||
            "_No format template stored for this entry (YouTube teardowns and older clips have none)._"
        )
      } else if (section === "audio") {
        const blocks = parseScript(script)
        const music = collectAnnotations(blocks, "MUSIC")
        const sfx = collectAnnotations(blocks, "SFX")
        parts.push(
          "**Music changes**",
          music.length ? music.map((m) => `- [${m.timestamp}] ${m.value}`).join("\n") : "_none annotated_",
          "",
          `**Sound effects (${sfx.length})**`,
          sfx.length
            ? sfx.map((x) => `- [${x.timestamp}] ${x.value} — during: ${x.shot}`).join("\n")
            : "_none annotated_"
        )
      } else {
        if (section === "all" || section === "script") parts.push(script)
        if (section === "all") parts.push("", "### Teardown")
        if (section === "all" || section === "teardown") parts.push(analysis)
        if (section === "all" && template) parts.push("", "### Format template", template)
      }
      return text(parts.join("\n"))
    })
  )

  server.registerTool(
    "library_search",
    {
      title: "Search saved scripts and teardowns",
      description:
        "Full-text search across every saved script and teardown. Use it to find how you (or others) " +
        "already handled a hook, a topic, or a structure before writing a new one.",
      inputSchema: {
        query: z.string().describe("Search term"),
        limit: z.number().optional().describe("Max matches per library (default 15)"),
      },
    },
    guard(async (a) => {
      requireDb()
      const limit = Math.min(Math.max(a.limit ?? 15, 1), 50)
      const needle = a.query.toLowerCase()

      // `analyses` has no search helper, so filter the recent window in memory.
      // At single-user scale that window is the whole table.
      const ytRows = (await listAnalyses(500)).filter((r) =>
        [r.title, r.channelTitle, r.script, r.analysis]
          .filter(Boolean)
          .some((f) => f!.toLowerCase().includes(needle))
      )
      const clipRows = await searchClips(a.query, limit)

      const lines: string[] = [`## Matches for "${a.query}"`, ""]
      lines.push(`**YouTube** — ${ytRows.length} match${ytRows.length === 1 ? "" : "es"}`)
      lines.push(
        ytRows.length
          ? ytRows
              .slice(0, limit)
              .map((r) => `- yt:${r.videoId} — ${truncate(r.title ?? r.videoId, 70)} (${truncate(r.channelTitle ?? "?", 20)})\n  ${excerpt(r.script + " " + r.analysis, needle)}`)
              .join("\n")
          : "_none_"
      )
      lines.push("")
      lines.push(`**Clips** — ${clipRows.length} match${clipRows.length === 1 ? "" : "es"}`)
      lines.push(
        clipRows.length
          ? clipRows
              .map((r) => `- ${r.id} — ${truncate(r.title ?? r.id, 70)}\n  ${excerpt(r.script + " " + r.analysis, needle)}`)
              .join("\n")
          : "_none_"
      )
      return text(lines.join("\n"))
    })
  )

  server.registerTool(
    "library_stats",
    {
      title: "Library size and coverage",
      description: "How much material is banked: teardown counts, clip counts, and what platforms are represented.",
      inputSchema: {},
    },
    guard(async () => {
      requireDb()
      const [yt, clips] = await Promise.all([listAnalyses(1000), listClips(1000)])
      const byPlatform = new Map<string, number>()
      for (const c of clips) {
        byPlatform.set(c.platform, (byPlatform.get(c.platform) ?? 0) + 1)
      }
      const channels = new Map<string, number>()
      for (const r of yt) {
        const k = r.channelTitle ?? "unknown"
        channels.set(k, (channels.get(k) ?? 0) + 1)
      }
      const topChannels = [...channels.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, n]) => `${name} (${n})`)

      return text(
        [
          `## Library`,
          `- YouTube teardowns: **${yt.length}**`,
          `- Short-form clips: **${clips.length}** ${
            byPlatform.size
              ? `(${[...byPlatform.entries()].map(([p, n]) => `${p}: ${n}`).join(", ")})`
              : ""
          }`,
          `- Total banked scripts: **${yt.length + clips.length}**`,
          "",
          topChannels.length ? `Most-studied channels: ${topChannels.join(", ")}` : "",
          yt.length
            ? `Total views represented: ${compact(
                yt.reduce((s, r) => {
                  const m = r.metadata as { video?: { views?: number } } | null
                  return s + (m?.video?.views ?? 0)
                }, 0)
              )}`
            : "",
        ]
          .filter(Boolean)
          .join("\n")
      )
    })
  )
}

/** A short window of text around the first hit, for scannable search results. */
function excerpt(haystack: string, needle: string): string {
  const i = haystack.toLowerCase().indexOf(needle)
  if (i === -1) return ""
  const start = Math.max(0, i - 60)
  return `…${truncate(haystack.slice(start, start + 180), 180)}…`
}
