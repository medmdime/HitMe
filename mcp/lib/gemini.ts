/**
 * Gemini access for the MCP server.
 *
 * Two input paths, same prompt contract:
 *  - a public YouTube URL, handed to the model as a fileData part (no download)
 *  - a local video file, pushed through the Files API first (Instagram, TikTok,
 *    anything already on disk)
 */
import { GoogleGenAI } from "@google/genai"
import { statSync } from "node:fs"
import { basename, extname } from "node:path"
import { requireEnv } from "../env"

/** Matches the model the web analyzer uses; override to experiment. */
export const DEFAULT_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash"

let client: GoogleGenAI | null = null

function getClient(): GoogleGenAI {
  if (!client) client = new GoogleGenAI({ apiKey: requireEnv("GEMINI_API_KEY") })
  return client
}

/**
 * Only the types Gemini actually accepts for video input. Note `video/mov`,
 * not the more common `video/quicktime` — the API rejects the latter. Formats
 * absent from this map (.mkv among them) are unsupported and must be
 * remuxed to mp4 before upload.
 */
const MIME_BY_EXT: Record<string, string> = {
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".mov": "video/mov",
  ".mpeg": "video/mpeg",
  ".mpg": "video/mpg",
  ".avi": "video/avi",
  ".flv": "video/x-flv",
  ".webm": "video/webm",
  ".wmv": "video/wmv",
  ".3gp": "video/3gpp",
}

export function mimeForPath(path: string): string {
  const ext = extname(path).toLowerCase()
  const mime = MIME_BY_EXT[ext]
  if (!mime) {
    throw new Error(
      `Gemini does not accept "${ext}" video. Supported: ${Object.keys(MIME_BY_EXT).join(", ")}. ` +
        `Convert it first, e.g. ffmpeg -i "${path}" -c copy out.mp4`
    )
  }
  return mime
}

/** Analyze a public YouTube video without downloading it. */
export async function analyzeYouTubeUrl(
  url: string,
  prompt: string,
  model = DEFAULT_MODEL
): Promise<string> {
  const result = await getClient().models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          { fileData: { fileUri: url, mimeType: "video/*" } },
          { text: prompt },
        ],
      },
    ],
  })
  return result.text ?? ""
}

/**
 * Upload a local video, wait for the service to finish processing it, then
 * analyze it. Uploaded files are retained on Google's side for ~48h; we do not
 * reuse them across calls because the local file is the durable copy.
 */
export async function analyzeLocalVideo(
  path: string,
  prompt: string,
  model = DEFAULT_MODEL,
  onProgress?: (note: string) => void
): Promise<string> {
  const ai = getClient()
  const size = statSync(path).size
  onProgress?.(`uploading ${basename(path)} (${(size / 1e6).toFixed(1)} MB)`)

  const mimeType = mimeForPath(path)
  let file = await ai.files.upload({ file: path, config: { mimeType } })
  const name = file.name
  if (!name) throw new Error("Files API did not return a file name")

  // PROCESSING -> ACTIVE usually takes a few seconds for short clips.
  const deadline = Date.now() + 5 * 60_000
  while (file.state === "PROCESSING") {
    if (Date.now() > deadline) {
      throw new Error(
        `Gemini is still processing ${basename(path)} after 5 minutes. Try a shorter or smaller clip.`
      )
    }
    await new Promise((r) => setTimeout(r, 2000))
    file = await ai.files.get({ name })
  }
  if (file.state === "FAILED") {
    throw new Error(
      `Gemini could not process ${basename(path)}: ${JSON.stringify(file.error ?? {})}`
    )
  }
  if (!file.uri) throw new Error("Files API returned no URI for the upload")

  onProgress?.("analyzing")
  const result = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          { fileData: { fileUri: file.uri, mimeType: file.mimeType ?? mimeType } },
          { text: prompt },
        ],
      },
    ],
  })
  return result.text ?? ""
}

/** Plain text generation, for the writing and planning tools. */
export async function generateText(
  prompt: string,
  model = DEFAULT_MODEL
): Promise<string> {
  const result = await getClient().models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  })
  return result.text ?? ""
}
