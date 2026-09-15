/**
 * Cutting a clip into its shots with ffmpeg.
 *
 * A parsed bracket script already says where every cut is. This turns that into
 * one file per shot, so a reference video becomes a folder of reusable pieces:
 * the b-roll inserts to study or re-use, the hook on its own, and the audio
 * track on its own for identifying the music by ear.
 *
 * Cuts are re-encoded rather than stream-copied. Stream copy can only cut on
 * keyframes, and short-form has a cut every second or two — snapping to the
 * nearest keyframe would make half the segments the wrong shot.
 */
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs"
import { homedir } from "node:os"
import { join, resolve } from "node:path"
import { isBrollShot, type ScriptBlock } from "./parse-script"
import { run, which } from "./media"
import { segmentsDir } from "./workspace"

export class FfmpegMissingError extends Error {
  constructor() {
    super(
      [
        "ffmpeg is not installed, so the clip cannot be cut into segments.",
        "Install it with:  winget install Gyan.FFmpeg",
        "then restart this MCP server.",
      ].join("\n")
    )
    this.name = "FfmpegMissingError"
  }
}

let cachedFfmpeg: string | null | undefined

/**
 * ffmpeg on PATH, else the copy CapCut ships — every CapCut install on Windows
 * carries one, which makes it a zero-install fallback on an editor's machine.
 */
export function findFfmpeg(): string | null {
  if (cachedFfmpeg !== undefined) return cachedFfmpeg
  const onPath = which(process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg")
  if (onPath) {
    cachedFfmpeg = onPath
    return onPath
  }
  if (process.platform === "win32") {
    const apps = resolve(homedir(), "AppData", "Local", "CapCut", "Apps")
    if (existsSync(apps)) {
      const versions = readdirSync(apps).sort().reverse()
      for (const v of versions) {
        const candidate = join(apps, v, "ffmpeg.exe")
        if (existsSync(candidate)) {
          cachedFfmpeg = candidate
          return candidate
        }
      }
    }
  }
  cachedFfmpeg = null
  return null
}

export function requireFfmpeg(): string {
  const bin = findFfmpeg()
  if (!bin) throw new FfmpegMissingError()
  return bin
}

/** Media duration in seconds via ffprobe (sibling of ffmpeg), or null. */
export async function probeDuration(path: string): Promise<number | null> {
  const ffmpeg = findFfmpeg()
  if (!ffmpeg) return null
  const ffprobe = ffmpeg.replace(/ffmpeg(\.exe)?$/i, (m) => m.replace(/ffmpeg/i, "ffprobe"))
  if (!existsSync(ffprobe) && !which("ffprobe")) return null
  const { code, stdout } = await run(
    existsSync(ffprobe) ? ffprobe : "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
    30_000
  )
  if (code !== 0) return null
  const n = Number(stdout.trim())
  return Number.isFinite(n) && n > 0 ? n : null
}

export interface TimedShot {
  index: number
  block: ScriptBlock
  start: number
  end: number
  broll: boolean
}

/**
 * Each shot runs until the next one starts; the last runs to the end of the
 * media. Shots shorter than a quarter second are merged forward — they are
 * timestamp rounding, not real cuts.
 */
export function timeShots(blocks: ScriptBlock[], totalSeconds: number): TimedShot[] {
  const out: TimedShot[] = []
  for (let i = 0; i < blocks.length; i++) {
    const start = blocks[i].start_sec
    const next = blocks[i + 1]
    const end = Math.min(next ? next.start_sec : totalSeconds, totalSeconds)
    if (end - start < 0.25 && next) continue
    out.push({
      index: i + 1,
      block: blocks[i],
      start,
      end: Math.max(end, start + 0.25),
      broll: isBrollShot(blocks[i].shot),
    })
  }
  return out
}

function slug(s: string, max = 40): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, max) || "shot"
  )
}

export interface CutSegment {
  index: number
  timestamp: string
  shot: string
  start: number
  end: number
  broll: boolean
  path: string
}

export interface CutResult {
  dir: string
  segments: CutSegment[]
  audioPath: string | null
  totalSeconds: number
}

/**
 * Writes one mp4 per shot into .hitme/segments/<clipId>/, plus optionally the
 * full audio track as mp3. Re-running replaces the folder, so edits to the
 * script produce a clean set rather than stale leftovers.
 */
export async function cutSegments(opts: {
  clipId: string
  sourcePath: string
  blocks: ScriptBlock[]
  only?: "all" | "broll"
  audio?: boolean
  onProgress?: (note: string) => void
}): Promise<CutResult> {
  const ffmpeg = requireFfmpeg()
  if (!existsSync(opts.sourcePath)) {
    throw new Error(`Source file is missing: ${opts.sourcePath}. Re-run transcribe_clip to download it again.`)
  }
  const totalSeconds = (await probeDuration(opts.sourcePath)) ?? (opts.blocks.at(-1)?.start_sec ?? 0) + 5
  const shots = timeShots(opts.blocks, totalSeconds).filter((s) => opts.only !== "broll" || s.broll)

  const dir = join(segmentsDir(), slug(opts.clipId, 80))
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })

  const segments: CutSegment[] = []
  for (const s of shots) {
    const name = `${String(s.index).padStart(2, "0")}-${s.block.timestamp.replace(":", "m")}s-${slug(s.block.shot)}.mp4`
    const out = join(dir, name)
    opts.onProgress?.(`cutting ${name}`)
    // -ss before -i seeks fast; re-encode keeps the cut frame-accurate.
    const { code, stderr } = await run(
      ffmpeg,
      [
        "-y", "-hide_banner", "-loglevel", "error",
        "-ss", s.start.toFixed(3),
        "-i", opts.sourcePath,
        "-t", (s.end - s.start).toFixed(3),
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
        "-c:a", "aac", "-b:a", "160k",
        "-movflags", "+faststart",
        out,
      ],
      120_000
    )
    if (code !== 0) {
      throw new Error(`ffmpeg failed on shot ${s.index}: ${stderr.trim().split("\n").slice(-2).join(" | ")}`)
    }
    segments.push({
      index: s.index,
      timestamp: s.block.timestamp,
      shot: s.block.shot,
      start: s.start,
      end: s.end,
      broll: s.broll,
      path: out,
    })
  }

  let audioPath: string | null = null
  if (opts.audio) {
    audioPath = join(dir, "audio.mp3")
    opts.onProgress?.("extracting audio")
    const { code, stderr } = await run(
      ffmpeg,
      ["-y", "-hide_banner", "-loglevel", "error", "-i", opts.sourcePath, "-vn", "-c:a", "libmp3lame", "-q:a", "2", audioPath],
      120_000
    )
    if (code !== 0) {
      audioPath = null
      process.stderr.write(`[hitme] audio extraction failed: ${stderr.trim().slice(-200)}\n`)
    }
  }

  return { dir, segments, audioPath, totalSeconds }
}
