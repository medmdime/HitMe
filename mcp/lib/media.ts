/**
 * Local media acquisition via yt-dlp.
 *
 * Instagram has no public API for reading arbitrary third-party posts, so a
 * public reel has to be fetched the same way a browser would. yt-dlp is the
 * maintained tool for that and it also covers TikTok and YouTube, which keeps
 * one code path for every "here is a link, transcribe it" request.
 *
 * Nothing here installs software. If yt-dlp is absent the error names the exact
 * command to run — deciding to install a system tool is the user's call.
 */
import { spawn } from "node:child_process"
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs"
import { join, resolve } from "node:path"
import { MEDIA_DIR } from "../env"

export class YtDlpMissingError extends Error {
  constructor() {
    super(
      [
        "yt-dlp is not installed, so links cannot be downloaded for transcription.",
        "",
        "Install it (pick one), then restart this MCP server:",
        "  winget install yt-dlp.yt-dlp",
        "  pip install -U yt-dlp",
        "",
        "Some clips also need ffmpeg to merge audio and video:",
        "  winget install Gyan.FFmpeg",
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
  const candidates =
    process.platform === "win32" ? ["yt-dlp.exe", "yt-dlp"] : ["yt-dlp"]
  for (const c of candidates) {
    if (which(c)) {
      cachedBin = c
      return c
    }
  }
  const vendored = resolve(
    MEDIA_DIR,
    "..",
    "bin",
    process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp"
  )
  cachedBin = existsSync(vendored) ? vendored : null
  return cachedBin
}

function which(cmd: string): boolean {
  const paths = (process.env.PATH ?? "").split(process.platform === "win32" ? ";" : ":")
  const exts =
    process.platform === "win32"
      ? (process.env.PATHEXT ?? ".EXE;.CMD;.BAT").split(";")
      : [""]
  for (const dir of paths) {
    if (!dir) continue
    for (const ext of exts) {
      const full = join(dir, cmd.endsWith(ext.toLowerCase()) ? cmd : cmd + ext.toLowerCase())
      try {
        if (existsSync(full) && statSync(full).isFile()) return true
      } catch {
        // unreadable PATH entry — keep looking
      }
    }
  }
  return false
}

export function requireYtDlp(): string {
  const bin = findYtDlp()
  if (!bin) throw new YtDlpMissingError()
  return bin
}

interface RunResult {
  code: number
  stdout: string
  stderr: string
}

function run(bin: string, args: string[], timeoutMs = 180_000): Promise<RunResult> {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(bin, args, { windowsHide: true })
    let stdout = ""
    let stderr = ""
    const timer = setTimeout(() => {
      child.kill()
      rejectPromise(new Error(`yt-dlp timed out after ${Math.round(timeoutMs / 1000)}s`))
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
}

/** Cookie args, only when the caller opts in — see the tool description. */
function cookieArgs(browser?: string): string[] {
  return browser ? ["--cookies-from-browser", browser] : []
}

const COMMON_ARGS = ["--no-warnings", "--no-playlist", "--ignore-config"]

export async function probeClip(
  url: string,
  browser?: string
): Promise<ClipMetadata> {
  const bin = requireYtDlp()
  const { code, stdout, stderr } = await run(bin, [
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
export async function downloadClip(
  url: string,
  browser?: string
): Promise<DownloadedClip> {
  const bin = requireYtDlp()
  const metadata = await probeClip(url, browser)
  mkdirSync(MEDIA_DIR, { recursive: true })

  const stem = `${metadata.extractor || "clip"}-${metadata.id || Date.now()}`
    .replace(/[^A-Za-z0-9._-]/g, "_")
    .slice(0, 120)

  const existing = findExisting(stem)
  if (existing) {
    return { path: existing, sizeBytes: statSync(existing).size, metadata }
  }

  const outTemplate = join(MEDIA_DIR, `${stem}.%(ext)s`)
  const { code, stderr } = await run(
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

function findExisting(stem: string): string | null {
  if (!existsSync(MEDIA_DIR)) return null
  const hit = readdirSync(MEDIA_DIR).find(
    (f) => f.startsWith(`${stem}.`) && !f.endsWith(".part")
  )
  return hit ? join(MEDIA_DIR, hit) : null
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
      "  1. Retry with cookiesFromBrowser: \"chrome\" (or firefox/edge) to reuse your logged-in session.",
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

export function isHttpUrl(s: string): boolean {
  return /^https?:\/\//i.test(s.trim())
}
