/**
 * The "link in, annotated script out" pipeline for short-form clips.
 *
 * One implementation, used by the MCP tool and the web route, so the two
 * cannot drift: download (or take a local file), send to Gemini with the
 * short-form prompt plus whatever the platform told us, split the answer into
 * script / teardown / template, and file it in the clips table.
 */
import { existsSync, statSync } from "node:fs"
import { basename, resolve } from "node:path"
import { getClip, upsertClip } from "./db/clips"
import { loadLocalClip, saveLocalClip, type StoredClip } from "./clip-store"
import { analyzeLocalVideo } from "./gemini"
import {
  downloadClip,
  instagramShortcode,
  isHttpUrl,
  platformOf,
  tiktokVideoId,
  type ClipMetadata,
} from "./media"
import { parseScript, type ScriptBlock } from "./parse-script"
import { SCRIPT_PROMPT, SHORT_FORM_PROMPT, splitSections } from "./prompts"
import { probeDuration } from "./segments"

export interface ClipResult {
  id: string
  platform: string
  cached: boolean
  url: string | null
  title: string
  author: string | null
  caption: string | null
  durationSeconds: number | null
  localPath: string | null
  metadata: ClipMetadata | null
  script: string
  analysis: string
  template: string
  blocks: ScriptBlock[]
  /** What the platform says the sound is. Null on Instagram, which hides it. */
  sound: { track: string; artist: string | null } | null
}

export interface TranscribeOptions {
  url?: string
  file?: string
  cookiesFromBrowser?: string
  /** Use the long-form prompt (for clips over a few minutes). */
  longForm?: boolean
  force?: boolean
  onProgress?: (note: string) => void
}

function dbAvailable(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim())
}

/** An id we can derive from the input alone, so a cache hit costs no network. */
export function knownClipId(input: { url?: string; file?: string }): string | null {
  if (input.url) {
    const sc = instagramShortcode(input.url)
    if (sc) return `instagram:${sc}`
    const tt = tiktokVideoId(input.url)
    if (tt) return `tiktok:${tt}`
    return null
  }
  if (input.file) return `file:${basename(resolve(input.file))}`
  return null
}

/** DB first, then the local sidecar — whichever has it. */
export async function findStoredClip(id: string): Promise<StoredClip | null> {
  if (dbAvailable()) {
    const row = await getClip(id).catch(() => null)
    if (row) {
      return {
        id: row.id,
        platform: row.platform,
        url: row.url,
        title: row.title ?? row.id,
        author: row.author,
        caption: row.caption,
        durationSeconds: row.durationSeconds,
        localPath: row.localPath,
        script: row.script,
        analysis: row.analysis,
        template: row.template ?? "",
        metadata: row.metadata,
        analyzedAt: row.analyzedAt.toISOString(),
      }
    }
  }
  return loadLocalClip(id)
}

function rowToResult(row: StoredClip): ClipResult {
  const meta = (row.metadata as ClipMetadata | null) ?? null
  return {
    id: row.id,
    platform: row.platform,
    cached: true,
    url: row.url,
    title: row.title,
    author: row.author,
    caption: row.caption,
    durationSeconds: row.durationSeconds,
    localPath: row.localPath,
    metadata: meta,
    script: row.script,
    analysis: row.analysis,
    template: row.template,
    blocks: parseScript(row.script),
    sound: meta?.track ? { track: meta.track, artist: meta.artist } : null,
  }
}

/**
 * What the platform knows that the model cannot see: the caption, the handle,
 * and on TikTok the name of the sound. Appended to the prompt so the teardown
 * can say "original sound by X" instead of guessing.
 */
function platformContext(platform: string, meta: ClipMetadata | null): string {
  if (!meta) return ""
  const lines = [
    "",
    "# PLATFORM CONTEXT",
    "From the post's metadata. Reconcile it with what you see and hear; it is not a substitute for watching.",
    `- Platform: ${platform}`,
    meta.channel ? `- Account: @${meta.channel}${meta.uploader && meta.uploader !== meta.channel ? ` (${meta.uploader})` : ""}` : null,
    meta.durationSeconds ? `- Duration: ${Math.round(meta.durationSeconds)}s` : null,
    meta.description ? `- Caption: ${JSON.stringify(meta.description.slice(0, 600))}` : null,
    meta.track
      ? `- Sound named by the platform: ${JSON.stringify(meta.track)}${meta.artist ? ` by ${meta.artist}` : ""}. ` +
        `On TikTok, "original sound"/"suara asli"/"son original" means audio the creator uploaded with the video, not a licensed track.`
      : platform === "instagram"
        ? "- Sound: Instagram does not expose the sound name to logged-out readers. Identify the music by ear and say if it sounds like a known track."
        : null,
  ]
  return lines.filter(Boolean).join("\n")
}

export async function transcribeClip(opts: TranscribeOptions): Promise<ClipResult> {
  if (!opts.url && !opts.file) throw new Error("Pass either `url` or `file`.")
  if (opts.url && opts.file) throw new Error("Pass `url` or `file`, not both.")

  const known = knownClipId(opts)
  if (!opts.force && known) {
    const cached = await findStoredClip(known)
    if (cached) return rowToResult(cached)
  }

  let localPath: string
  let meta: ClipMetadata | null = null
  let id: string
  let platform: string
  let sourceUrl: string | null = null

  if (opts.url) {
    const url = opts.url.trim()
    if (!isHttpUrl(url)) throw new Error(`"${url}" is not an http(s) URL. Use \`file\` for local paths.`)
    opts.onProgress?.("downloading")
    const downloaded = await downloadClip(url, opts.cookiesFromBrowser)
    localPath = downloaded.path
    meta = downloaded.metadata
    platform = platformOf(url) === "web" ? (meta.extractor || "web").toLowerCase() : platformOf(url)
    const shortcode = instagramShortcode(url)
    id = `${platform}:${shortcode ?? meta.id}`
    sourceUrl = meta.webpageUrl || url
  } else {
    const path = resolve(opts.file!)
    if (!existsSync(path)) throw new Error(`No such file: ${path}`)
    localPath = path
    platform = "file"
    id = `file:${basename(path)}`
  }

  // Second look for platforms whose id only emerges after probing.
  if (!opts.force && id !== known) {
    const cached = await findStoredClip(id)
    if (cached) return rowToResult(cached)
  }

  // Instagram's metadata carries no duration; the file itself always does.
  // Resolved before the prompt so the model is told how long the clip is.
  const durationSeconds =
    meta?.durationSeconds && meta.durationSeconds > 0
      ? meta.durationSeconds
      : await probeDuration(localPath)
  if (meta && durationSeconds && !meta.durationSeconds) meta.durationSeconds = durationSeconds

  const prompt = (opts.longForm ? SCRIPT_PROMPT : SHORT_FORM_PROMPT) + platformContext(platform, meta)
  const raw = await analyzeLocalVideo(localPath, prompt, undefined, opts.onProgress)
  if (!raw.trim()) throw new Error("Gemini returned an empty response for this clip.")
  const { script, analysis, template } = splitSections(raw)

  const title = meta?.title || basename(localPath)
  const author = meta?.channel || meta?.uploader || null

  const stored: StoredClip = {
    id,
    platform,
    url: sourceUrl,
    title,
    author,
    caption: meta?.description ?? null,
    durationSeconds,
    localPath,
    script,
    analysis,
    template,
    metadata: meta,
    analyzedAt: new Date().toISOString(),
  }
  // The sidecar always gets written; the DB is best effort.
  try {
    saveLocalClip(stored)
  } catch (err) {
    process.stderr.write(`[hitme] sidecar write failed: ${String(err)}\n`)
  }
  if (dbAvailable()) {
    try {
      await upsertClip(stored)
    } catch (err) {
      process.stderr.write(`[hitme] clip DB write failed: ${String(err)}\n`)
    }
  }

  return {
    id,
    platform,
    cached: false,
    url: sourceUrl,
    title,
    author,
    caption: meta?.description ?? null,
    durationSeconds,
    localPath,
    metadata: meta,
    script,
    analysis,
    template,
    blocks: parseScript(script),
    sound: meta?.track ? { track: meta.track, artist: meta.artist } : null,
  }
}

export function fileSizeMb(path: string): number {
  try {
    return statSync(path).size / 1e6
  } catch {
    return 0
  }
}
