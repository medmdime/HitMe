/**
 * The edit handoff.
 *
 * A bracket script already carries the timeline: every `[MM:SS — shot]` header
 * is a cut point, and the next header is where that shot ends. That is exactly
 * what CapCut needs, so this converts the script into ordered, timed calls
 * against the CapCut MCP server, and writes an SRT of the narration.
 *
 * These tools produce the plan and the files. The CapCut MCP tools execute it —
 * that separation keeps the timing math reviewable before anything is written
 * into a draft.
 *
 * The constraints encoded below were established by reading and live-testing
 * the installed VectCutAPI server; several are undocumented in its tool schemas
 * and silently corrupt the draft when missed. See `capcut_reference`.
 */
import { z } from "zod"
import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { homedir } from "node:os"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { getProject } from "../../lib/db/projects"
import type { BrollShot } from "../../lib/db/projects"
import { parseScript, type ScriptBlock } from "../../lib/parse-script"
import { EXPORT_DIR, requireEnv } from "../env"
import { duration, guard, text, truncate } from "../lib/text"

const FORMATS = {
  landscape: { width: 1920, height: 1080, label: "16:9 YouTube" },
  vertical: { width: 1080, height: 1920, label: "9:16 Shorts / Reels / TikTok" },
  square: { width: 1080, height: 1080, label: "1:1" },
} as const

/** Where the desktop app looks for projects. */
const CAPCUT_DRAFTS_DIR = join(
  homedir(),
  "AppData",
  "Local",
  "CapCut",
  "User Data",
  "Projects",
  "com.lveditor.draft"
)

/** A safe, known-good default — add_subtitle throws when `font` is omitted. */
const DEFAULT_FONT = "Inter_Black"

/** Each block runs until the next one starts; the last gets a default tail. */
function withDurations(
  blocks: ScriptBlock[],
  tailSeconds: number
): { block: ScriptBlock; start: number; end: number }[] {
  return blocks.map((b, i) => {
    const start = b.start_sec
    const next = blocks[i + 1]
    const end = next ? next.start_sec : start + tailSeconds
    return { block: b, start, end: Math.max(end, start + 0.5) }
  })
}

function srtTime(sec: number): string {
  const ms = Math.round((sec % 1) * 1000)
  const s = Math.floor(sec) % 60
  const m = Math.floor(sec / 60) % 60
  const h = Math.floor(sec / 3600)
  const p = (n: number, w = 2) => String(n).padStart(w, "0")
  return `${p(h)}:${p(m)}:${p(s)},${p(ms, 3)}`
}

function buildSrt(timed: { block: ScriptBlock; start: number; end: number }[]): string {
  const cues: string[] = []
  let n = 1
  for (const t of timed) {
    const line = t.block.narration.replace(/\[no narration\]/gi, "").trim()
    if (!line) continue
    cues.push(`${n++}\n${srtTime(t.start)} --> ${srtTime(t.end)}\n${line}\n`)
  }
  return cues.join("\n")
}

export function registerCapCutTools(server: McpServer) {
  server.registerTool(
    "capcut_plan",
    {
      title: "Build the CapCut assembly plan",
      description:
        "Convert a project's script and b-roll plan into the exact ordered sequence of CapCut MCP calls, " +
        "with every clip's timeline position computed from the bracket timestamps. Also writes an SRT of " +
        "the narration. Run this once the shot list has assets attached, then execute the emitted calls " +
        "with the CapCut tools. The plan encodes several undocumented CapCut requirements — follow it literally.",
      inputSchema: {
        id: z.string().describe("Project id"),
        format: z
          .enum(["landscape", "vertical", "square"])
          .optional()
          .describe("Canvas: landscape 1920x1080 (default), vertical 1080x1920, or square"),
        voiceoverPath: z
          .string()
          .optional()
          .describe("Path to the voiceover / main audio track. Local paths work; use .mp3 or .mp4."),
        tailSeconds: z
          .number()
          .optional()
          .describe("How long the final shot runs, since nothing follows it (default 5)"),
        transition: z
          .string()
          .optional()
          .describe(
            "CapCut transition between clips, case-sensitive: Dissolve, Black_Fade, White_Flash, Mix, RGB_Glitch. Omit for hard cuts."
          ),
        draftFolder: z
          .string()
          .optional()
          .describe(
            "Where save_draft writes the project. Defaults to the CapCut drafts directory. Never omit this at call time — see the plan output."
          ),
        font: z.string().optional().describe(`Subtitle font (default ${DEFAULT_FONT})`),
        fontSize: z
          .number()
          .optional()
          .describe("Subtitle size in CapCut's relative unit, sane range 6-12 (default 8)"),
      },
    },
    guard(async (a) => {
      requireEnv("DATABASE_URL")
      const p = await getProject(a.id)
      if (!p) throw new Error(`No project "${a.id}".`)
      if (!p.script?.trim()) throw new Error(`Project "${a.id}" has no script.`)

      const blocks = parseScript(p.script)
      if (blocks.length === 0) {
        throw new Error("The script did not parse into bracket blocks, so there is no timeline to build.")
      }
      const fmt = FORMATS[a.format ?? "landscape"]
      const timed = withDurations(blocks, a.tailSeconds ?? 5)
      const plan = (p.brollPlan as BrollShot[] | null) ?? []
      const byIndex = new Map(plan.map((s) => [s.index, s]))
      const totalRuntime = timed[timed.length - 1].end
      const draftFolder = a.draftFolder ?? CAPCUT_DRAFTS_DIR
      const font = a.font ?? DEFAULT_FONT
      const fontSize = a.fontSize ?? 8

      mkdirSync(EXPORT_DIR, { recursive: true })
      const srtPath = join(EXPORT_DIR, `${a.id}.srt`)
      writeFileSync(srtPath, buildSrt(timed), "utf8")

      const calls: string[] = []
      calls.push(`create_draft(width=${fmt.width}, height=${fmt.height})`)
      calls.push(`  -> keep the returned draft_id; pass it to EVERY call below`)
      calls.push("")

      const missing: string[] = []
      const tooShort: string[] = []
      for (const [i, t] of timed.entries()) {
        const shot = byIndex.get(i + 1)
        const asset = shot?.assetPath
        const clipLen = +(t.end - t.start).toFixed(2)
        if (!asset) {
          missing.push(
            `#${i + 1} [${t.block.timestamp}] ${truncate(t.block.shot, 55)}${shot?.source ? ` (${shot.source})` : ""}`
          )
          continue
        }
        if (asset && !existsSync(asset) && !/^https?:\/\//i.test(asset)) {
          tooShort.push(`#${i + 1} asset not found on disk: ${asset}`)
        }
        const args = [
          `video_url="${asset}"`,
          `draft_id=<id>`,
          `start=0`,
          `end=${clipLen}`,
          `target_start=${+t.start.toFixed(2)}`,
          `track_name="main"`,
          a.transition ? `transition="${a.transition}"` : null,
        ]
          .filter(Boolean)
          .join(", ")
        calls.push(`add_video(${args})`)
        calls.push(`  # ${t.block.timestamp} ${truncate(t.block.shot, 60)}`)
      }

      calls.push("")
      if (a.voiceoverPath) {
        calls.push(
          `add_audio(audio_url="${a.voiceoverPath}", draft_id=<id>, target_start=0, track_name="audio_main")`
        )
      }
      calls.push(
        `add_subtitle(srt_path="${srtPath}", draft_id=<id>, font="${font}", font_size=${fontSize})`
      )
      calls.push("")
      calls.push(`save_draft(draft_id=<id>, draft_folder="${draftFolder}")`)

      return text(
        [
          `## Assembly plan — ${p.title}`,
          `${fmt.label} · ${fmt.width}x${fmt.height} · ${blocks.length} shots · runtime ${duration(totalRuntime)}`,
          `Subtitles: \`${srtPath}\``,
          "",
          missing.length
            ? `⚠ **${missing.length} shots have no asset and are omitted below:**\n${missing.map((m) => `- ${m}`).join("\n")}\n\nAttach files via broll_plan_set (set \`assetPath\`), then re-run.\n`
            : "All shots have assets attached.",
          tooShort.length ? `\n⚠ Paths that do not exist yet:\n${tooShort.map((m) => `- ${m}`).join("\n")}\n` : "",
          "",
          "### Call sequence",
          "```",
          ...calls,
          "```",
          "",
          "### Rules this plan depends on",
          "These are verified behaviours of the installed CapCut server, not guesses. Breaking one",
          "produces either an exception or a draft that opens empty.",
          "",
          `1. **Pass \`draft_folder\` to \`save_draft\`.** It is missing from the tool's schema but is accepted,`,
          `   and without it every media path in the saved draft is written blank — the project opens with`,
          `   no footage. Default used here: \`${draftFolder}\``,
          `2. **Pass \`font\` to \`add_subtitle\`.** Omitting it raises a free-variable error inside the server.`,
          `3. **\`font_size\` is a relative unit, not pixels.** 6-12 is normal; the schema's default of 24 is oversized.`,
          `4. **Enum names are case-sensitive** and the server's error messages list the wrong set.`,
          `   \`Dissolve\` works, \`dissolve\` does not.`,
          `5. **Local file paths work everywhere** a \`*_url\` argument appears — no hosting or upload needed.`,
          `6. **Draft ids are in-memory only.** They vanish if the CapCut MCP server restarts, so run`,
          `   create_draft through save_draft in one unbroken session.`,
          `7. **A failed call still leaves an empty track behind.** If one errors, retry on a new \`track_name\`.`,
          `8. Ignore any \`draft_url\` the server returns — it points at a vendor preview service that does not have your draft.`,
          "",
          "### After saving",
          `Open CapCut and look for the draft in \`${draftFolder}\`. If it does not appear or opens broken,`,
          "see `capcut_reference` for the draft-profile mismatch on this machine and how to work around it.",
        ]
          .filter(Boolean)
          .join("\n")
      )
    })
  )

  server.registerTool(
    "capcut_reference",
    {
      title: "CapCut server quirks and valid value names",
      description:
        "The undocumented constraints, known bugs, and valid enum names for the installed CapCut MCP server. " +
        "Read this before hand-writing CapCut calls — several of its tool schemas are wrong or incomplete.",
      inputSchema: {},
    },
    guard(async () => {
      return text(
        [
          "## CapCut MCP — what the schemas do not tell you",
          "",
          "### Bugs that will bite",
          "- `add_subtitle` **throws** unless `font` is passed. Use `Inter_Black` if you have no preference.",
          "- `add_effect` needs two arguments absent from its schema: `effect_category` (`\"scene\"` or",
          "  `\"character\"`) and `params` (pass `[]`). Without both it raises.",
          "- `save_draft` accepts an undeclared `draft_folder`. **Without it the saved draft has blank media",
          "  paths and opens with no footage.**",
          "- A call that fails on a bad enum name still creates its track, leaving empty tracks behind.",
          "- Omitting `end` on `add_video` creates a zero-length segment. It is repaired at save time from the",
          "  file's real duration, but `target_start` is not — so back-to-back layout needs explicit values.",
          "  Call `get_video_duration` first.",
          "",
          "### Units",
          "- Time is **seconds** (float) everywhere.",
          "- `transform_x` / `transform_y` are **normalized**: 0 is centre, ±1 is the canvas edge.",
          "  Not pixels. Subtitles default to `-0.8` (lower third).",
          "- `font_size` is relative: **6-12 is normal**, despite the schema advertising 24.",
          "- Mask geometry (`mask_center_x/y`, `mask_size`, `mask_feather`) is 0-1; `background_blur` is 1-4.",
          "- Keyframe values are passed as **strings**, and batch mode zips",
          "  `property_types` / `times` / `values` — all three must be the same length.",
          "",
          "### Valid names (case-sensitive)",
          "- transitions: `Dissolve`, `Black_Fade`, `White_Flash`, `Mix`, `RGB_Glitch` (116 total)",
          "- masks: `Circle`, `Rectangle`, `Heart`, `Stars`, `Filmstrip`, `Brush`, `Pen`, `Split`, `Text`",
          "- intro animations: `Fade_In`, `Mini_Zoom`, `Rotate`, `Blinds` (43 total)",
          "- outro animations: `Fade_Out`, `Blurred_Fadein` (23 total)",
          "- scene effects: `Blur`, `Black_Flash`, `Blinds` (341 total)",
          "- fonts: `Inter_Black`, `HarmonyOS_Sans_SC_Bold` (335 total)",
          "",
          "The server exposes no tool to list these. To dump a full set, run the installed server's Python:",
          "```",
          "python -c \"import pyJianYingDraft as d; print([a for a in dir(d.CapCut_Transition_type) if not a.startswith('_')])\"",
          "```",
          "",
          "### The draft-profile caveat on this machine",
          `CapCut is installed and its drafts live in:`,
          `  \`${CAPCUT_DRAFTS_DIR}\``,
          "",
          "The CapCut server is configured with the `capcut_legacy` draft profile, which writes the format used",
          "by **macOS CapCut 6.5** (`draft_info.json`, no `Timelines/`). Existing drafts written by the",
          "Windows CapCut installed here use the newer layout instead. If a saved draft does not show up in the",
          "app or opens broken, that mismatch is the first thing to check — the server's `jianying_pro_10`",
          "profile matches the newer layout, but switching also changes effect and transition names to a",
          "different namespace, so it is a trade, not a free fix.",
          "",
          "Fallback that always works: export the script, SRT, and shot CSV with `export_project_files` and",
          "assemble by hand in CapCut. The SRT imports directly.",
        ].join("\n")
      )
    })
  )

  server.registerTool(
    "export_project_files",
    {
      title: "Export script, shot list, and subtitles",
      description:
        "Write a project's script, shot list (CSV), narration text, and SRT into .hitme/exports so they can " +
        "be used in a teleprompter, a spreadsheet, or any editor. Returns the paths written.",
      inputSchema: {
        id: z.string().describe("Project id"),
        tailSeconds: z.number().optional().describe("Duration of the final shot (default 5)"),
      },
    },
    guard(async (a) => {
      requireEnv("DATABASE_URL")
      const p = await getProject(a.id)
      if (!p) throw new Error(`No project "${a.id}".`)
      if (!p.script?.trim()) throw new Error(`Project "${a.id}" has no script.`)

      const blocks = parseScript(p.script)
      const timed = withDurations(blocks, a.tailSeconds ?? 5)
      const plan = (p.brollPlan as BrollShot[] | null) ?? []
      const byIndex = new Map(plan.map((s) => [s.index, s]))

      mkdirSync(EXPORT_DIR, { recursive: true })
      const written: string[] = []

      const scriptPath = join(EXPORT_DIR, `${a.id}.script.md`)
      writeFileSync(scriptPath, `# ${p.title}\n\n${p.brief ? `> ${p.brief}\n\n` : ""}${p.script}\n`, "utf8")
      written.push(scriptPath)

      const srtPath = join(EXPORT_DIR, `${a.id}.srt`)
      writeFileSync(srtPath, buildSrt(timed), "utf8")
      written.push(srtPath)

      const voPath = join(EXPORT_DIR, `${a.id}.voiceover.txt`)
      writeFileSync(
        voPath,
        timed
          .map((t) => t.block.narration.replace(/\[no narration\]/gi, "").trim())
          .filter(Boolean)
          .join("\n\n"),
        "utf8"
      )
      written.push(voPath)

      const csvPath = join(EXPORT_DIR, `${a.id}.shots.csv`)
      const esc = (s: string) => `"${String(s ?? "").replace(/"/g, '""')}"`
      writeFileSync(
        csvPath,
        [
          "index,timestamp,start_sec,end_sec,duration_sec,shot,source,prompt,status,asset_path,narration",
          ...timed.map((t, i) => {
            const s = byIndex.get(i + 1)
            return [
              i + 1,
              esc(t.block.timestamp),
              t.start.toFixed(2),
              t.end.toFixed(2),
              (t.end - t.start).toFixed(2),
              esc(t.block.shot),
              esc(s?.source ?? "unset"),
              esc(s?.prompt ?? ""),
              esc(s?.status ?? "planned"),
              esc(s?.assetPath ?? ""),
              esc(t.block.narration),
            ].join(",")
          }),
        ].join("\n"),
        "utf8"
      )
      written.push(csvPath)

      return text(
        [
          `Exported **${p.title}** (${blocks.length} shots, ${duration(timed[timed.length - 1]?.end ?? 0)}):`,
          ...written.map((w) => `- ${w}`),
        ].join("\n")
      )
    })
  )
}
