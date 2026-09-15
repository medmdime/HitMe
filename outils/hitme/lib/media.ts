/**
 * Local media acquisition via yt-dlp.
 *
 * Instagram and TikTok have no public API for reading arbitrary third-party
 * posts, so a public reel has to be fetched the same way a browser would.
 * yt-dlp is the maintained tool for that and it also covers YouTube, which
 * keeps one code path for every "here is a link, transcribe it" request.
 *
 * Nothing here installs software. If yt-dlp is absent the error names the exact
 * command to run — deciding to install a system tool is the user's call.
 */
import { spawn } from "node:child_process"
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs"
import { join, resolve } from "node:path"
import { binDir, mediaDir } from "./workspace"

export class YtDlpMissingError extends Error {
  constructor() {
    super(
      [
        "yt-dlp is not installed, so links cannot be downloaded for transcription.",
        "",
        "Install it, then restart this MCP server:",
        '  pip install -U "yt-dlp[default]" curl_cffi',
        "",
        "curl_cffi matters: Instagram only answers logged-out requests that look",
        "like a real browser, and yt-dlp needs it to impersonate one. The",
        "yt-dlp[default] extras do NOT include it. Without curl_cffi, TikTok and",
        "YouTube links still work but Instagram will refuse.",
        "",
        "winget install yt-dlp.yt-dlp also works, but ships no impersonation support.",
        "",
        "Alternative with no install: save the video yourself and pass its path as `file`.",
      ].join("\n")
    )
    this.name = "YtDlpMissingError"
  }
}

let cachedBin: string | null | undefined

/** Looks for yt-dlp on PATH, then in the workspace bin dir. */
export function findYtDlp(): string | null {
  if (cachedBin !== undefined) return cachedBin
  const candidates = process.platform === "win32" ? ["yt-dlp.exe", "yt-dlp"] : ["yt-dlp"]
  for (const c of candidates) {
    if (which(c)) {
      cachedBin = c
      return c
    }
  }
  const vendored = resolve(binDir(), process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp")
  cachedBin = existsSync(vendored) ? vendored : null
  return cachedBin
}

export function which(cmd: string): string | null {
  const paths = (process.env.PATH ?? "").split(process.platform === "win32" ? ";" : ":")
  const exts =
    process.platform === "win32" ? (process.env.PATHEXT ?? ".EXE;.CMD;.BAT").split(";") : [""]
  for (const dir of paths) {
    if (!dir) continue
    for (const ext of exts) {
      const name = cmd.toLowerCase().endsWith(ext.toLowerCase()) ? cmd : cmd + ext.toLowerCase()
      const full = join(dir, name)
      try {
        if (existsSync(full) && statSync(full).isFile()) return full
      } catch {
        // unreadable PATH entry — keep looking
      }
    }
  }
  return null
}

export function requireYtDlp(): string {
  const bin = findYtDlp()
  if (!bin) throw new YtDlpMissingError()
  return bin
}

export interface RunResult {
  code: number
  stdout: string
  stderr: string
}

export function run(bin: string, args: string[], timeoutMs = 180_000): Promise<RunResult> {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(bin, args, { windowsHide: true })
    let stdout = ""
    let stderr = ""
    const timer = setTimeout(() => {
      child.kill()
      rejectPromise(new Error(`${bin} timed out after ${Math.round(timeoutMs / 1000)}s`))
    }, timeoutMs)
    child.stdout.on("data", (d) => (stdout += d.toString()))
    child.stderr.on("data", (d) => (stderr += d.toString()))
    child.on("error", (err) => {
      clearTimeout(timer)
      rejectPromise(err)
    })
    child.on("close", (code) => {
      clearTimeout(timer)
      resolvePromise({ code: code ?? -1, stdout, stderr })
    })
  })
}

export interface ClipMetadata {
  id: string
  title: string
  description: string
  /** Display name. On Instagram this is the profile's full name, not the handle. */
  uploader: string
  /** The @handle. Instagram puts the username here, not in `uploader`. */
  channel: string
  uploaderUrl: string
  durationSeconds: number
  viewCount: number | null
  likeCount: number | null
  commentCount: number | null
  uploadDate: string | null
  webpageUrl: string
  extractor: string
  width: number | null
  height: number | null
  /**
   * The sound attached to the post, when the platform exposes it. TikTok does
   * ("suara asli - name" means an original sound by that user); Instagram does
   * not for logged-out readers, so there it is always null.
   */
  track: string | null
  artist: string | null
}

/** Cookie args, only when the caller opts in — see the tool description. */
function cookieArgs(browser?: string): string[] {
  return browser ? ["--cookies-from-browser", browser] : []
}

const COMMON_ARGS = ["--no-warnings", "--no-playlist", "--ignore-config"]

/**
 * Instagram serves logged-out requests only to clients whose TLS fingerprint
 * looks like a real browser, so single-post extraction needs impersonation.
 * It requires curl_cffi alongside yt-dlp; when that is missing yt-dlp exits
 * complaining about the target rather than falling back, so callers retry
 * without it. See `impersonationUnavailable`.
 */
const IMPERSONATE_ARGS = ["--impersonate", "chrome"]

function impersonationUnavailable(stderr: string): boolean {
  const s = stderr.toLowerCase()
  return (
    s.includes("impersonate target") ||
    s.includes("no impersonate") ||
    (s.includes("not available") && s.includes("impersonat"))
  )
}

/**
 * Runs yt-dlp with browser impersonation, retrying without it if this install
 * lacks curl_cffi. Sites that gate on TLS fingerprint (Instagram) only work
 * with it; everything else is unaffected by its presence.
 */
async function runImpersonating(bin: string, args: string[], timeoutMs?: number): Promise<RunResult> {
  const first = await run(bin, [...IMPERSONATE_ARGS, ...args], timeoutMs)
  if (first.code === 0 || !impersonationUnavailable(first.stderr)) return first
  process.stderr.write(
    "[hitme] yt-dlp has no impersonation target (curl_cffi not installed); retrying without it. " +
      'Instagram may refuse. Fix with: pip install -U "yt-dlp[default]" curl_cffi\n'
  )
  return run(bin, args, timeoutMs)
}

export async function probeClip(url: string, browser?: string): Promise<ClipMetadata> {
  const bin = requireYtDlp()
  const { code, stdout, stderr } = await runImpersonating(bin, [
    ...COMMON_ARGS,
    ...cookieArgs(browser),
    "--dump-single-json",
    "--skip-download",
    url,
  ])
  if (code !== 0) throw new Error(explainFailure(stderr, url))

  let j: Record<string, unknown>
  try {
    j = JSON.parse(stdout) as Record<string, unknown>
  } catch {
    throw new Error(`yt-dlp returned unparseable metadata for ${url}`)
  }
  const num = (k: string): number | null => {
    const v = j[k]
    return typeof v === "number" ? v : null
  }
  const str = (k: string): string => {
    const v = j[k]
    return typeof v === "string" ? v : ""
  }
  const artists = Array.isArray(j.artists)
    ? (j.artists as unknown[]).filter((a): a is string => typeof a === "string")
    : []
  return {
    id: str("id"),
    title: str("title") || str("fulltitle"),
    description: str("description"),
    uploader: str("uploader") || str("channel"),
    channel: str("channel") || str("uploader"),
    uploaderUrl: str("uploader_url") || str("channel_url"),
    durationSeconds: num("duration") ?? 0,
    viewCount: num("view_count"),
    likeCount: num("like_count"),
    commentCount: num("comment_count"),
    uploadDate: str("upload_date") || null,
    webpageUrl: str("webpage_url") || url,
    extractor: str("extractor_key") || str("extractor"),
    width: num("width"),
    height: num("height"),
    track: str("track") || null,
    artist: str("artist") || artists.join(", ") || null,
  }
}

export interface DownloadedClip {
  path: string
  sizeBytes: number
  metadata: ClipMetadata
}

/**
 * Downloads to .hitme/media/<extractor>-<id>.<ext> and returns the file.
 * Re-downloading the same URL reuses the file already on disk.
 */
export async function downloadClip(url: string, browser?: string): Promise<DownloadedClip> {
  const bin = requireYtDlp()
  const metadata = await probeClip(url, browser)
  const dir = mediaDir()
  mkdirSync(dir, { recursive: true })

  const stem = clipStem(metadata)
  const existing = findExisting(stem)
  if (existing) {
    return { path: existing, sizeBytes: statSync(existing).size, metadata }
  }

  const outTemplate = join(dir, `${stem}.%(ext)s`)
  const { code, stderr } = await runImpersonating(
    bin,
    [
      ...COMMON_ARGS,
      ...cookieArgs(browser),
      // `b` only ever picks an already-muxed stream, so no merge step and no
      // ffmpeg dependency. Anything that would need merging is not worth the
      // extra install for reference footage.
      "-f",
      "b[ext=mp4]/b",
      "-o",
      outTemplate,
      url,
    ],
    600_000
  )
  if (code !== 0) throw new Error(explainFailure(stderr, url))

  const path = findExisting(stem)
  if (!path) {
    throw new Error(`yt-dlp reported success but no file appeared for ${url}`)
  }
  return { path, sizeBytes: statSync(path).size, metadata }
}

export function clipStem(metadata: ClipMetadata): string {
  return `${metadata.extractor || "clip"}-${metadata.id || Date.now()}`
    .replace(/[^A-Za-z0-9._-]/g, "_")
    .slice(0, 120)
}

function findExisting(stem: string): string | null {
  const dir = mediaDir()
  if (!existsSync(dir)) return null
  const hit = readdirSync(dir).find((f) => f.startsWith(`${stem}.`) && !f.endsWith(".part"))
  return hit ? join(dir, hit) : null
}

/**
 * Turns yt-dlp's stderr into something actionable.
 *
 * The matched strings track yt-dlp's reworked Instagram extractor — the older
 * "requested content is not available" wording it used to emit is gone.
 */
function explainFailure(stderr: string, url: string): string {
  const s = stderr.toLowerCase()
  const needsAuth = [
    "redirected to the login page",
    "exceeded the rate-limit",
    "rate-limit",
    "csrf token",
    "not granting access",
    "only available for registered users",
    "empty media response",
    "login required",
    "private",
  ].some((needle) => s.includes(needle))
  if (needsAuth) {
    return [
      `yt-dlp could not fetch ${url} without being signed in.`,
      "",
      "Instagram gates a lot of content behind a session. Options:",
      '  1. Retry with cookiesFromBrowser: "chrome" (or firefox/edge) to reuse your logged-in session.',
      "  2. Save the reel to disk yourself and pass its path as `file` instead.",
      "",
      `yt-dlp said: ${stderr.trim().split("\n").slice(-3).join(" | ")}`,
    ].join("\n")
  }
  if (s.includes("ffmpeg")) {
    return [
      `This clip needs ffmpeg to merge its audio and video streams.`,
      "Install it with: winget install Gyan.FFmpeg",
      "",
      `yt-dlp said: ${stderr.trim().split("\n").slice(-3).join(" | ")}`,
    ].join("\n")
  }
  return `yt-dlp failed for ${url}: ${stderr.trim().split("\n").slice(-4).join(" | ")}`
}

/** Extracts an Instagram shortcode, for stable library ids. */
export function instagramShortcode(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:[^/]+\/)?(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i)
  return m ? m[1] : null
}

/** Extracts a TikTok video id from a canonical URL (short vm.tiktok links need a probe). */
export function tiktokVideoId(url: string): string | null {
  const m = url.match(/tiktok\.com\/(?:@[\w.-]+\/video|embed(?:\/v2)?|v)\/(\d{10,})/i)
  return m ? m[1] : null
}

export function isHttpUrl(s: string): boolean {
  return /^https?:\/\//i.test(s.trim())
}

/** Which platform a clip URL belongs to, for ids and for prompt context. */
export function platformOf(url: string): "instagram" | "tiktok" | "youtube" | "web" {
  const u = url.toLowerCase()
  if (u.includes("instagram.com")) return "instagram"
  if (u.includes("tiktok.com")) return "tiktok"
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube"
  return "web"
}
