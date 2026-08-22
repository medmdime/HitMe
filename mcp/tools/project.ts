/**
 * Video projects: the working state of a video being built.
 *
 * The flow these tools support is: pick references -> read them side by side ->
 * write your own script -> turn it into a shot list -> fill the shots with
 * generated or sourced footage -> hand an assembly plan to CapCut.
 *
 * The creative decisions stay with the model. These tools do the deterministic
 * parts: parsing, alignment, persistence, and turning a plan into call order.
 */
import { z } from "zod"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { getAnalysis } from "../../lib/db/analyses"
import { getClip } from "../../lib/db/clips"
import {
  deleteProject,
  getProject,
  listProjects,
  patchProject,
  slugify,
  upsertProject,
  type BrollShot,
  type ProjectSource,
} from "../../lib/db/projects"
import { parseScript, type ScriptBlock } from "../../lib/parse-script"
import { requireEnv } from "../env"
import { age, guard, text, truncate } from "../lib/text"

function requireDb() {
  requireEnv("DATABASE_URL")
}

/** Loads a reference from whichever library holds it. */
async function loadRef(
  ref: string
): Promise<{ title: string; script: string; analysis: string; meta: string } | null> {
  const raw = ref.trim()
  const ytId = /^yt:/i.test(raw)
    ? raw.slice(3)
    : raw.match(/(?:v=|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{11})/)?.[1] ??
      (/^[A-Za-z0-9_-]{11}$/.test(raw) ? raw : null)

  if (ytId) {
    const row = await getAnalysis(ytId)
    if (!row) return null
    return {
      title: row.title ?? ytId,
      script: row.script,
      analysis: row.analysis,
      meta: [row.channelTitle, row.url].filter(Boolean).join(" · "),
    }
  }
  const clip = await getClip(raw)
  if (!clip) return null
  return {
    title: clip.title ?? clip.id,
    script: clip.script,
    analysis: clip.analysis,
    meta: [clip.author, clip.url].filter(Boolean).join(" · "),
  }
}

/** Face-cam vs b-roll is mechanical; everything finer is a judgment call. */
function classifyShot(shot: string): BrollShot["source"] {
  const s = shot.toLowerCase()
  if (/face camera|talking head|host on camera|piece to camera/.test(s)) return "face-cam"
  if (/screen ?record|screen ?capture|ui |app |website|dashboard|code/.test(s)) return "screen-record"
  if (/broll|b-roll|cutaway|archival|footage|stock/.test(s)) return "unset"
  if (/text overlay|title card|graphic|chart|diagram/.test(s)) return "generate"
  return "unset"
}

function shotsFromScript(script: string): BrollShot[] {
  return parseScript(script).map((b: ScriptBlock, i: number) => ({
    index: i + 1,
    timestamp: b.timestamp,
    shot: b.shot,
    narration: b.narration,
    source: classifyShot(b.shot),
    status: "planned" as const,
  }))
}

function planTable(shots: BrollShot[]): string {
  return [
    "# | time | source | status | shot | prompt / query",
    "---|---|---|---|---|---",
    ...shots.map((s) =>
      [
        s.index,
        s.timestamp,
        s.source,
        s.status ?? "planned",
        truncate(s.shot, 50),
        s.prompt ? truncate(s.prompt, 60) : "—",
      ].join(" | ")
    ),
  ].join("\n")
}

const SHOT_SCHEMA = z.object({
  index: z.number(),
  timestamp: z.string(),
  shot: z.string(),
  narration: z.string().optional(),
  source: z.enum(["face-cam", "generate", "stock", "screen-record", "clip", "unset"]),
  prompt: z.string().optional(),
  status: z.enum(["planned", "generated", "sourced", "done"]).optional(),
  assetPath: z.string().optional(),
  notes: z.string().optional(),
})

export function registerProjectTools(server: McpServer) {
  server.registerTool(
    "project_create",
    {
      title: "Start a video project",
      description:
        "Create a project to build a video in. Holds the brief, the reference videos it borrows from, " +
        "the working script, and the b-roll plan — so work survives across sessions.",
      inputSchema: {
        title: z.string().describe("Working title of YOUR video"),
        brief: z
          .string()
          .optional()
          .describe("The angle: what this video is about, for whom, and why it is different from the references"),
        sources: z
          .array(
            z.object({
              ref: z.string().describe("yt:VIDEOID or a clip id like instagram:SHORTCODE"),
              note: z.string().optional().describe("What this reference contributes: hook, structure, tone, a specific segment"),
            })
          )
          .optional()
          .describe("Reference videos to remix from"),
        id: z.string().optional().describe("Explicit slug id (default: derived from the title)"),
      },
    },
    guard(async (a) => {
      requireDb()
      const id = slugify(a.id ?? a.title)
      const existing = await getProject(id)
      if (existing) {
        throw new Error(
          `Project "${id}" already exists. Use project_update, or pass a different id.`
        )
      }
      const sources: ProjectSource[] = []
      const missing: string[] = []
      for (const s of a.sources ?? []) {
        const loaded = await loadRef(s.ref)
        if (!loaded) missing.push(s.ref)
        sources.push({ ref: s.ref, title: loaded?.title, note: s.note })
      }
      await upsertProject({ id, title: a.title, brief: a.brief, sources, status: "draft" })
      return text(
        [
          `Created project **${id}** — ${a.title}`,
          a.brief ? `\nBrief: ${a.brief}` : "",
          sources.length ? `\nSources:\n${sources.map((s) => `- ${s.ref}${s.title ? ` — ${s.title}` : ""}${s.note ? ` (${s.note})` : ""}`).join("\n")}` : "",
          missing.length
            ? `\n⚠ Not in the library yet: ${missing.join(", ")} — analyze them first so their scripts can be read.`
            : "",
          `\nNext: project_compare_sources to read the references side by side.`,
        ]
          .filter(Boolean)
          .join("\n")
      )
    })
  )

  server.registerTool(
    "project_list",
    {
      title: "List video projects",
      description: "All projects, most recently touched first.",
      inputSchema: { limit: z.number().optional().describe("Max rows (default 30)") },
    },
    guard(async (a) => {
      requireDb()
      const rows = await listProjects(Math.min(Math.max(a.limit ?? 30, 1), 100))
      if (rows.length === 0) return text("_No projects yet. Create one with project_create._")
      return text(
        [
          "id | title | status | script | shots | updated",
          "---|---|---|---|---|---",
          ...rows.map((r) => {
            const shots = (r.brollPlan as BrollShot[] | null)?.length ?? 0
            return [
              r.id,
              truncate(r.title, 40),
              r.status,
              r.script ? `${parseScript(r.script).length} blocks` : "—",
              shots || "—",
              `${age(r.updatedAt.toISOString())} ago`,
            ].join(" | ")
          }),
        ].join("\n")
      )
    })
  )

  server.registerTool(
    "project_get",
    {
      title: "Read a project",
      description: "The brief, sources, script, and b-roll plan for one project.",
      inputSchema: {
        id: z.string().describe("Project id"),
        section: z
          .enum(["all", "brief", "script", "broll"])
          .optional()
          .describe("Which part to return (default all)"),
      },
    },
    guard(async (a) => {
      requireDb()
      const p = await getProject(a.id)
      if (!p) throw new Error(`No project "${a.id}". List them with project_list.`)
      const section = a.section ?? "all"
      const sources = (p.sources as ProjectSource[] | null) ?? []
      const shots = (p.brollPlan as BrollShot[] | null) ?? []
      const parts: string[] = [`## ${p.title} (\`${p.id}\`) — ${p.status}`]

      if (section === "all" || section === "brief") {
        parts.push("", p.brief ? `**Brief**: ${p.brief}` : "_No brief set._")
        if (sources.length) {
          parts.push(
            "",
            "**Sources**",
            ...sources.map((s) => `- ${s.ref}${s.title ? ` — ${s.title}` : ""}${s.note ? ` (${s.note})` : ""}`)
          )
        }
        if (p.notes) parts.push("", `**Notes**: ${p.notes}`)
      }
      if (section === "all" || section === "script") {
        parts.push("", "### Script", p.script || "_No script written yet._")
      }
      if (section === "all" || section === "broll") {
        parts.push("", "### B-roll plan", shots.length ? planTable(shots) : "_No plan yet — run broll_plan_init._")
      }
      return text(parts.join("\n"))
    })
  )

  server.registerTool(
    "project_update",
    {
      title: "Update a project",
      description:
        "Patch any part of a project. Only the fields you pass are written, so setting the script " +
        "cannot wipe the b-roll plan. This is where you save a script you have written.",
      inputSchema: {
        id: z.string().describe("Project id"),
        title: z.string().optional(),
        brief: z.string().optional(),
        status: z
          .enum(["draft", "scripted", "broll", "editing", "done"])
          .optional()
          .describe("Where the project is in the pipeline"),
        script: z
          .string()
          .optional()
          .describe("Your bracket-format script: [MM:SS — shot] then narration"),
        notes: z.string().optional(),
        sources: z
          .array(z.object({ ref: z.string(), title: z.string().optional(), note: z.string().optional() }))
          .optional(),
      },
    },
    guard(async (a) => {
      requireDb()
      const { id, ...patch } = a
      const updated = await patchProject(id, patch)
      if (!updated) throw new Error(`No project "${id}".`)
      const changed = Object.keys(patch).filter((k) => patch[k as keyof typeof patch] !== undefined)
      const blocks = updated.script ? parseScript(updated.script).length : 0
      return text(
        [
          `Updated **${id}** (${changed.join(", ") || "no fields"}).`,
          updated.script ? `Script parses into ${blocks} bracket blocks.` : "",
          patch.script && blocks === 0
            ? "⚠ The script did not parse into any brackets. Headers must look like `[01:23 — Broll of X]`."
            : "",
        ]
          .filter(Boolean)
          .join("\n")
      )
    })
  )

  server.registerTool(
    "project_delete",
    {
      title: "Delete a project",
      description: "Permanently remove a project. The analyzed sources it referenced are not touched.",
      inputSchema: { id: z.string().describe("Project id") },
    },
    guard(async (a) => {
      requireDb()
      const ok = await deleteProject(a.id)
      return text(ok ? `Deleted project "${a.id}".` : `No project "${a.id}" to delete.`)
    })
  )

  server.registerTool(
    "project_compare_sources",
    {
      title: "Read reference scripts side by side",
      description:
        "Load every reference script for a project and lay them out beat by beat, with each teardown. " +
        "This is the input for writing a remix: you can see how source A opens against how source B opens, " +
        "where each one places its payoff, and how long their acts run.",
      inputSchema: {
        id: z.string().describe("Project id"),
        refs: z
          .array(z.string())
          .optional()
          .describe("Override: compare these refs instead of the project's saved sources"),
        beats: z
          .number()
          .optional()
          .describe("How many opening beats to show per source (default 8; 0 for all)"),
        includeTeardowns: z.boolean().optional().describe("Include each source's teardown (default true)"),
      },
    },
    guard(async (a) => {
      requireDb()
      const p = await getProject(a.id)
      if (!p) throw new Error(`No project "${a.id}".`)
      const refs = a.refs ?? ((p.sources as ProjectSource[] | null) ?? []).map((s) => s.ref)
      if (refs.length === 0) {
        throw new Error("This project has no sources. Add them with project_update, or pass refs.")
      }
      const beats = a.beats ?? 8
      const includeTeardowns = a.includeTeardowns ?? true

      const out: string[] = [`# Sources for "${p.title}"`]
      if (p.brief) out.push(`\n**The angle we are writing toward**: ${p.brief}`)

      const loaded: { ref: string; title: string; blocks: ScriptBlock[] }[] = []
      for (const ref of refs) {
        const r = await loadRef(ref)
        if (!r) {
          out.push(`\n## ${ref}\n_Not in the library. Analyze it first._`)
          continue
        }
        const blocks = parseScript(r.script)
        loaded.push({ ref, title: r.title, blocks })
        const shown = beats === 0 ? blocks : blocks.slice(0, beats)
        out.push(
          "",
          `## ${r.title}`,
          `\`${ref}\` · ${r.meta}`,
          `${blocks.length} shots, runs to ${blocks[blocks.length - 1]?.timestamp ?? "?"}`,
          "",
          shown.length
            ? shown
                .map((b) => `**[${b.timestamp} — ${b.shot}]**\n${truncate(b.narration, 400)}`)
                .join("\n\n")
            : "_Script did not parse into brackets._",
          beats > 0 && blocks.length > beats
            ? `\n_…${blocks.length - beats} more shots. Use library_get with section=script for the full text._`
            : "",
          includeTeardowns ? `\n### Teardown\n${r.analysis}` : ""
        )
      }

      if (loaded.length > 1) {
        out.push("", "## Structure at a glance", "")
        out.push(
          [
            "source | shots | ends at | opening shot",
            "---|---|---|---",
            ...loaded.map(
              (l) =>
                `${truncate(l.title, 32)} | ${l.blocks.length} | ${l.blocks[l.blocks.length - 1]?.timestamp ?? "?"} | ${truncate(l.blocks[0]?.shot ?? "?", 40)}`
            ),
          ].join("\n")
        )
        out.push(
          "",
          "_Now write the remix: take the hook mechanism from whichever source opens hardest, the act " +
            "structure from whichever sustains longest, and keep the subject and voice yours. Save it with " +
            "project_update(script=...)._"
        )
      }
      return text(out.filter(Boolean).join("\n"))
    })
  )

  server.registerTool(
    "broll_plan_init",
    {
      title: "Turn a script into a shot list",
      description:
        "Parse the project's script into a numbered shot list and pre-classify each shot as face-cam, " +
        "screen-record, or unset (needing footage). Returns the table to fill in — decide per shot whether " +
        "it is generated b-roll, stock, or a clip, then save with broll_plan_set.",
      inputSchema: { id: z.string().describe("Project id") },
    },
    guard(async (a) => {
      requireDb()
      const p = await getProject(a.id)
      if (!p) throw new Error(`No project "${a.id}".`)
      if (!p.script?.trim()) {
        throw new Error(`Project "${a.id}" has no script yet. Save one with project_update(script=...).`)
      }
      const shots = shotsFromScript(p.script)
      if (shots.length === 0) {
        throw new Error(
          "The script did not parse into bracket blocks. Headers must look like `[01:23 — Broll of X]`."
        )
      }
      await patchProject(a.id, { brollPlan: shots, status: "broll" })
      const needs = shots.filter((s) => s.source === "unset").length
      return text(
        [
          `## Shot list for ${p.title} — ${shots.length} shots`,
          `${needs} need a footage decision.`,
          "",
          planTable(shots),
          "",
          "For each unset shot decide the source:",
          "- **generate** — AI b-roll (Higgsfield). Best for abstract, atmospheric, impossible, or stylised shots.",
          "- **stock** — real footage from a stock library. Best for real places, people, and everyday objects.",
          "- **clip** — a segment from a reference video you already have on disk. Use sparingly and transformatively.",
          "- **screen-record** — you capture a UI or app.",
          "- **face-cam** — you on camera.",
          "",
          "Then call broll_plan_set with the filled-in shots, giving each one a `prompt` (generation prompt or stock search query).",
        ].join("\n")
      )
    })
  )

  server.registerTool(
    "broll_plan_set",
    {
      title: "Save the filled-in shot list",
      description:
        "Persist the b-roll plan after deciding each shot's source and prompt. Pass the full array of shots; " +
        "it replaces the stored plan.",
      inputSchema: {
        id: z.string().describe("Project id"),
        shots: z.array(SHOT_SCHEMA).describe("The complete shot list"),
      },
    },
    guard(async (a) => {
      requireDb()
      const updated = await patchProject(a.id, { brollPlan: a.shots as BrollShot[] })
      if (!updated) throw new Error(`No project "${a.id}".`)
      const bySource = new Map<string, number>()
      for (const s of a.shots) bySource.set(s.source, (bySource.get(s.source) ?? 0) + 1)
      const unset = bySource.get("unset") ?? 0
      return text(
        [
          `Saved ${a.shots.length} shots for **${a.id}**.`,
          [...bySource.entries()].map(([k, v]) => `${k}: ${v}`).join(" · "),
          unset ? `\n⚠ ${unset} shots are still \`unset\` — they have no footage plan.` : "",
          `\nNext: generate the \`generate\` shots (Higgsfield generate_video), find the \`stock\` ones, then run capcut_plan.`,
        ]
          .filter(Boolean)
          .join("\n")
      )
    })
  )
}
