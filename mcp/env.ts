/**
 * Env loading for the standalone MCP process.
 *
 * Next.js loads .env.local automatically; a plain Node process does not.
 * Import this module for its side effect BEFORE anything that reads
 * process.env (the YouTube client, the Gemini client, the Neon client).
 */
import { config } from "dotenv"
import { existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
export const REPO_ROOT = resolve(here, "..")

// .env.local wins over .env, matching Next.js precedence.
for (const file of [".env.local", ".env"]) {
  const path = resolve(REPO_ROOT, file)
  if (existsSync(path)) config({ path, quiet: true })
}

export function requireEnv(name: string): string {
  const v = process.env[name]?.trim()
  if (!v) {
    throw new Error(
      `${name} is not set. Add it to ${resolve(REPO_ROOT, ".env.local")} and restart the MCP server.`
    )
  }
  return v
}

export function hasEnv(name: string): boolean {
  return Boolean(process.env[name]?.trim())
}

/** Where downloaded clips, generated b-roll and exports live. */
export const WORKSPACE = resolve(REPO_ROOT, ".hitme")
export const MEDIA_DIR = resolve(WORKSPACE, "media")
export const EXPORT_DIR = resolve(WORKSPACE, "exports")
