/**
 * Video analysis tools: turn a video into a timestamped bracket script plus a
 * teardown, and file the result where the rest of the pipeline can find it.
 */
import { z } from "zod"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { extractVideoId } from "../../lib/youtube-url"
import { getChannelInfo, getVideoStats } from "../../lib/youtube-data"
import { getAnalysis, upsertAnalysis } from "../../lib/db/analyses"
import { SCRIPT_PROMPT, splitScriptAndAnalysis } from "../../lib/prompts"
import { collectAnnotations, isBrollShot, parseScript, type ScriptBlock } from "../../lib/parse-script"
import { analyzeYouTubeUrl } from "../../lib/gemini"
import { findStoredClip, transcribeClip, type ClipResult } from "../../lib/clip-pipeline"
import { cutSegments, findFfmpeg } from "../../lib/segments"
import { hasEnv } from "../env"
import { compact, duration, guard, text, truncate } from "../lib/text"

const DB_AVAILABLE = () => hasEnv("DATABASE_URL")

function scriptSummary(script: string): string {
  const blocks = parseScript(script)
  if (blocks.length === 0) return "_Script did not parse into bracket blocks._"
  const brollCount = blocks.filter((b) => /broll|cutaway/i.test(b.shot)).length
  const last = blocks[blocks.length - 1]
  return [
    `${blocks.length} shots · ${brollCount} b-roll / cutaway · runs to ${last.timestamp}`,
    "",
    "First beats:",
    ...blocks.slice(0, 4).map((b) => `- [${b.timestamp} — ${b.shot}] ${truncate(b.narration, 90)}`),
  ].join("\n")
}

/**
 * The short-form view: every shot with its annotations, then the audio layer
 * pulled out on its own, because "what sounds did they use" is the question
 * that gets asked most.
 */
function renderClip(r: ClipResult, full: boolean): string {
  const blocks = r.blocks
  const sfx = collectAnnotations(blocks, "SFX")
  const music = collectAnnotations(blocks, "MUSIC")
  const texts = collectAnnotations(blocks, "TEXT")
  const broll = blocks.filter((b) => isBrollShot(b.shot))

  const statLine = r.metadata
    ? [
        r.author && `@${r.author}`,
        r.metadata.viewCount !== null && `${compact(r.metadata.viewCount)} views`,
        r.metadata.likeCount !== null && `${compact(r.metadata.likeCount)} likes`,
        r.durationSeconds && duration(r.durationSeconds),
        r.metadata.width && r.metadata.height && `${r.metadata.width}x${r.metadata.height}`,
      ]
        .filter(Boolean)
        .join(" · ")
    : r.localPath ?? ""

  const shotLines = (full ? blocks : blocks.slice(0, 6)).map((b: ScriptBlock) => {
    const ann = b.annotations.map((a) => `    ${a.kind}: ${a.value}`).join("\n")
    const narr = b.narration && b.narration !== "[no narration]" ? b.narration : "_[no narration]_"
    return `**[${b.timestamp} — ${b.shot}]**\n${narr}${ann ? `\n${ann}` : ""}`
  })

  return [
    `## ${r.title}${r.cached ? " (cached)" : ""}`,
    statLine,
    `id: \`${r.id}\`${r.url ? ` · ${r.url}` : ""}${r.localPath ? `\nfile: ${r.localPath}` : ""}`,
    r.caption ? `\n**Caption**: ${truncate(r.caption, 300)}` : "",
    "",
    `### Sound`,
    r.sound
      ? `Platform says: **${r.sound.track}**${r.sound.artist ? ` — ${r.sound.artist}` : ""}`
      : r.platform === "instagram"
        ? "_Instagram hides the sound name from logged-out readers; see the Audio section of the teardown for what it sounds like._"
        : "_No sound metadata from the platform._",
    music.length ? music.map((m) => `- [${m.timestamp}] ${m.value}`).join("\n") : "",
    sfx.length ? `\n**Sound effects (${sfx.length})**\n${sfx.map((s) => `- [${s.timestamp}] ${s.value}`).join("\n")}` : "\n_No sound effects annotated._",
    "",
    `### Shots — ${blocks.length} total, ${broll.length} b-roll, ${texts.length} text overlays`,
    ...shotLines,
    !full && blocks.length > 6 ? `\n_…${blocks.length - 6} more shots. Pass full=true for all of them._` : "",
    "",
    "### Teardown",
    r.analysis || "_none_",
    "",
    r.template ? `### Format template\n${r.template}` : "_No template section returned._",
    "",
    `_Next: \`clip_cut_segments\` with id \`${r.id}\` to extract every shot as its own file._`,
  ]
    .filter((l) => l !== "")
    .join("\n")
}

export function registerAnalyzeTools(server: McpServer) {
  server.registerTool(
    "analyze_youtube_video",
    {
      title: "Tear down a YouTube video into a bracket script",
      description:
        "Watch a YouTube video with Gemini and return a full timestamped script in bracket format " +
        "([MM:SS — shot type] + narration) plus a teardown of hook, pacing, and retention tactics. " +
        "Results are cached in the shared database and reused unless force=true. " +
        "SLOW: a 10-minute video takes 1-3 minutes to analyze.",
      inputSchema: {
        video: z.string().describe("YouTube URL or 11-char video id"),
        force: z.boolean().optional().describe("Re-analyze even if a cached teardown exists (default false)"),
        full: z
          .boolean()
          .optional()
          .describe(
            "Return the entire script. Default false returns a summary + the teardown, which is usually what you want for planning."
          ),
      },
    },
    guard(async (a) => {
      const videoId = extractVideoId(a.video)
      if (!videoId) throw new Error(`Could not parse a YouTube video id from "${a.video}"`)
      const url = `https://www.youtube.com/watch?v=${videoId}`

      if (!a.force && DB_AVAILABLE()) {
        const cached = await getAnalysis(videoId).catch(() => null)
        if (cached) {
          return text(
            [
              `## ${cached.title ?? videoId} (cached)`,
              cached.channelTitle ? `${cached.channelTitle} · ${url}` : url,
              "",
              a.full ? cached.script : scriptSummary(cached.script),
              "",
              "### Teardown",
              cached.analysis,
              "",
              a.full ? "" : "_Pass full=true for the complete script, or force=true to re-analyze._",
            ].join("\n")
          )
        }
      }

      const raw = await analyzeYouTubeUrl(url, SCRIPT_PROMPT)
      if (!raw.trim()) throw new Error("Gemini returned an empty response for this video.")
      const { script, analysis } = splitScriptAndAnalysis(raw)

      let metadata: Awaited<ReturnType<typeof fetchMeta>> = null
      try {
        metadata = await fetchMeta(videoId)
      } catch {
        metadata = null
      }

      if (DB_AVAILABLE()) {
        try {
          await upsertAnalysis({ videoId, url, script, analysis, metadata })
        } catch (err) {
          process.stderr.write(`[hitme] analysis DB write failed: ${String(err)}\n`)
        }
      }

      const v = metadata?.video
      return text(
        [
          `## ${v?.title ?? videoId}`,
          v ? `${v.channelTitle} · ${compact(v.views)} views · ${duration(v.duration_seconds)} · ${url}` : url,
          "",
          a.full ? script : scriptSummary(script),
          "",
          "### Teardown",
          analysis,
          "",
          a.full ? "" : "_Pass full=true for the complete script._",
        ].join("\n")
      )
    })
  )

  server.registerTool(
    "transcribe_clip",
    {
      title: "Tear down an Instagram reel, TikTok, or local video",
      description:
        "Turn a short-form video into a complete production breakdown: an annotated shot-by-shot script " +
        "(exact narration, every on-screen TEXT, every SFX, MUSIC changes, CAM moves, FX), a structured teardown " +
        "(hook, structure, audio layer incl. music and sound effects, captions, b-roll sources, edit style, CTA), " +
        "and a topic-agnostic FORMAT TEMPLATE for remaking the video on a different subject. " +
        "Pass `url` for a public Instagram/TikTok link, or `file` for a video on disk. " +
        "TikTok's sound name comes from the platform; Instagram hides it, so music there is described by ear. " +
        "Cached in the clips table; follow with clip_cut_segments to extract the shots as files.",
      inputSchema: {
        url: z.string().optional().describe("Public Instagram / TikTok / other yt-dlp-supported URL"),
        file: z.string().optional().describe("Path to a local video file (absolute, or relative to the repo root)"),
        cookiesFromBrowser: z
          .enum(["chrome", "firefox", "edge", "brave", "chromium", "opera", "vivaldi", "safari"])
          .optional()
          .describe("Reuse a logged-in browser session when the link needs authentication"),
        longForm: z
          .boolean()
          .optional()
          .describe("Use the long-form prompt instead of the short-form one (for clips over ~3 minutes)"),
        force: z.boolean().optional().describe("Re-analyze even if cached (default false)"),
        full: z.boolean().optional().describe("Return every shot (default false shows the first 6 plus the full teardown and template)"),
      },
    },
    guard(async (a) => {
      const result = await transcribeClip({
        url: a.url,
        file: a.file,
        cookiesFromBrowser: a.cookiesFromBrowser,
        longForm: a.longForm,
        force: a.force,
        onProgress: (note) => process.stderr.write(`[hitme] ${note}\n`),
      })
      return text(renderClip(result, a.full ?? false))
    })
  )

  server.registerTool(
    "clip_cut_segments",
    {
      title: "Cut a transcribed clip into one file per shot",
      description:
        "Use ffmpeg to split a clip from the library into its shots, using the cut points in its bracket script. " +
        "Produces one mp4 per shot in .hitme/segments/<id>/ (numbered, named after the shot), and optionally the " +
        "full audio track as mp3 for identifying the music. Frame-accurate (re-encoded), since short-form cuts " +
        "every second or two. Run transcribe_clip first.",
      inputSchema: {
        id: z.string().describe("Clip id from transcribe_clip, e.g. instagram:DcL_FY6O--p"),
        only: z.enum(["all", "broll"]).optional().describe("all shots (default) or just the b-roll inserts"),
        audio: z.boolean().optional().describe("Also extract the full audio track as audio.mp3 (default true)"),
      },
    },
    guard(async (a) => {
      const row = await findStoredClip(a.id)
      if (!row) throw new Error(`No clip "${a.id}" in the library. Run transcribe_clip first.`)
      if (!row.localPath) throw new Error(`Clip "${a.id}" has no local file recorded. Re-run transcribe_clip with force=true.`)
      if (!findFfmpeg()) {
        throw new Error("ffmpeg not found on PATH or in CapCut's folder. Install it with: winget install Gyan.FFmpeg")
      }
      const blocks = parseScript(row.script)
      if (blocks.length === 0) throw new Error("The stored script has no bracket blocks to cut on.")

      const result = await cutSegments({
        clipId: a.id,
        sourcePath: row.localPath,
        blocks,
        only: a.only ?? "all",
        audio: a.audio ?? true,
        onProgress: (note) => process.stderr.write(`[hitme] ${note}\n`),
      })

      const rows = result.segments.map((s) =>
        [
          s.index,
          `${s.start.toFixed(1)}-${s.end.toFixed(1)}s`,
          `${(s.end - s.start).toFixed(1)}s`,
          s.broll ? "b-roll" : "face",
          truncate(s.shot, 48).replace(/\|/g, "/"),
          s.path.replace(result.dir, "…"),
        ].join(" | ")
      )
      return text(
        [
          `## ${row.title ?? a.id} — ${result.segments.length} segments`,
          `Folder: \`${result.dir}\` · source ${duration(result.totalSeconds)}`,
          result.audioPath ? `Audio track: \`${result.audioPath}\`` : "",
          "",
          "# | time | len | kind | shot | file",
          "---|---|---|---|---|---",
          ...rows,
          "",
          "These are the reference's actual shots. Use them to study the cut rhythm, to drop a segment into a CapCut " +
            "draft as a placeholder, or to hand the audio to a music-recognition app. Reusing another creator's footage " +
            "in a published video is their call, not the tool's — prefer remaking the shot.",
        ]
          .filter(Boolean)
          .join("\n")
      )
    })
  )
}

async function fetchMeta(videoId: string) {
  const [video] = await getVideoStats([videoId])
  if (!video) return null
  let channel = null
  try {
    channel = await getChannelInfo(video.channelId)
  } catch {
    // channel lookup is optional
  }
  return { video, channel }
}
