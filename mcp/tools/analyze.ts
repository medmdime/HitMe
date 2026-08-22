/**
 * Video analysis tools: turn a video into a timestamped bracket script plus a
 * teardown, and file the result where the rest of the pipeline can find it.
 */
import { z } from "zod"
import { existsSync, statSync } from "node:fs"
import { basename, resolve } from "node:path"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { extractVideoId } from "../../lib/youtube-url"
import { getChannelInfo, getVideoStats } from "../../lib/youtube-data"
import { getAnalysis, upsertAnalysis } from "../../lib/db/analyses"
import { getClip, upsertClip } from "../../lib/db/clips"
import {
  SCRIPT_PROMPT,
  SHORT_FORM_PROMPT,
  splitScriptAndAnalysis,
} from "../../lib/prompts"
import { parseScript } from "../../lib/parse-script"
import { analyzeLocalVideo, analyzeYouTubeUrl } from "../lib/gemini"
import {
  downloadClip,
  instagramShortcode,
  isHttpUrl,
  type ClipMetadata,
} from "../lib/media"
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

function renderCached(
  cached: { title: string | null; author: string | null; url: string | null; script: string; analysis: string },
  full: boolean
) {
  return text(
    [
      `## ${cached.title ?? "Cached clip"} (cached)`,
      [cached.author, cached.url].filter(Boolean).join(" · "),
      "",
      full ? cached.script : scriptSummary(cached.script),
      "",
      "### Teardown",
      cached.analysis,
      "",
      full ? "" : "_Pass full=true for the complete script, or force=true to re-analyze._",
    ].join("\n")
  )
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
        force: z
          .boolean()
          .optional()
          .describe("Re-analyze even if a cached teardown exists (default false)"),
        full: z
          .boolean()
          .optional()
          .describe("Return the entire script. Default false returns a summary + the teardown, which is usually what you want for planning."),
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

      // Metadata is best effort — a teardown is still useful without it.
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
          v
            ? `${v.channelTitle} · ${compact(v.views)} views · ${duration(v.duration_seconds)} · ${url}`
            : url,
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
      title: "Transcribe an Instagram reel, TikTok, or local video",
      description:
        "Turn a short-form video into a timestamped bracket script plus a teardown tuned for short-form " +
        "(hook in the first 3 seconds, cuts per second, on-screen text strategy). " +
        "Pass `url` for a public Instagram/TikTok link (downloaded with yt-dlp), or `file` for a video already on disk. " +
        "Downloads are cached in .hitme/media and results are stored in the clips table. " +
        "If Instagram refuses an anonymous fetch, retry with cookiesFromBrowser, or save the file yourself and pass `file`.",
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
        full: z.boolean().optional().describe("Return the complete script (default false: summary + teardown)"),
      },
    },
    guard(async (a) => {
      if (!a.url && !a.file) throw new Error("Pass either `url` or `file`.")
      if (a.url && a.file) throw new Error("Pass `url` or `file`, not both.")

      // An Instagram shortcode and a local filename both yield the row id
      // without a network call, so a cached clip costs nothing to serve.
      const knownId = a.url
        ? instagramShortcode(a.url)
          ? `instagram:${instagramShortcode(a.url)}`
          : null
        : `file:${basename(resolve(a.file!))}`
      if (!a.force && knownId && DB_AVAILABLE()) {
        const cached = await getClip(knownId).catch(() => null)
        if (cached) return renderCached(cached, a.full ?? false)
      }

      let localPath: string
      let meta: ClipMetadata | null = null
      let id: string
      let platform: string
      let sourceUrl: string | null = null

      if (a.url) {
        const url = a.url.trim()
        if (!isHttpUrl(url)) throw new Error(`"${url}" is not an http(s) URL. Use \`file\` for local paths.`)
        const shortcode = instagramShortcode(url)
        const downloaded = await downloadClip(url, a.cookiesFromBrowser)
        localPath = downloaded.path
        meta = downloaded.metadata
        platform = shortcode ? "instagram" : (meta.extractor || "web").toLowerCase()
        id = `${platform}:${shortcode ?? meta.id}`
        sourceUrl = meta.webpageUrl || url
      } else {
        const path = resolve(a.file!)
        if (!existsSync(path)) throw new Error(`No such file: ${path}`)
        localPath = path
        platform = "file"
        id = `file:${basename(path)}`
      }

      // Second look: platforms whose id only emerges after probing.
      if (!a.force && id !== knownId && DB_AVAILABLE()) {
        const cached = await getClip(id).catch(() => null)
        if (cached) return renderCached(cached, a.full ?? false)
      }

      const prompt = a.longForm ? SCRIPT_PROMPT : SHORT_FORM_PROMPT
      const raw = await analyzeLocalVideo(localPath, prompt, undefined, (note) =>
        process.stderr.write(`[hitme] ${note}\n`)
      )
      if (!raw.trim()) throw new Error("Gemini returned an empty response for this clip.")
      const { script, analysis } = splitScriptAndAnalysis(raw)

      if (DB_AVAILABLE()) {
        try {
          await upsertClip({
            id,
            platform,
            url: sourceUrl,
            title: meta?.title || basename(localPath),
            author: meta?.channel || meta?.uploader || null,
            caption: meta?.description ?? null,
            durationSeconds: meta?.durationSeconds ?? null,
            localPath,
            script,
            analysis,
            metadata: meta,
          })
        } catch (err) {
          process.stderr.write(`[hitme] clip DB write failed: ${String(err)}\n`)
        }
      }

      const statLine = meta
        ? [
            meta.channel && `@${meta.channel}`,
            meta.viewCount !== null && `${compact(meta.viewCount)} views`,
            meta.likeCount !== null && `${compact(meta.likeCount)} likes`,
            meta.durationSeconds && duration(meta.durationSeconds),
            meta.width && meta.height && `${meta.width}x${meta.height}`,
          ]
            .filter(Boolean)
            .join(" · ")
        : `${(statSync(localPath).size / 1e6).toFixed(1)} MB local file`

      return text(
        [
          `## ${meta?.title || basename(localPath)}`,
          statLine,
          `id: \`${id}\` · file: ${localPath}`,
          meta?.description ? `\n**Caption**: ${truncate(meta.description, 400)}` : "",
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
