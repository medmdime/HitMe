/**
 * Local sidecar copies of clip teardowns.
 *
 * The database is the shared library, but the downloaded video already lives
 * on this disk, and a teardown is worth keeping next to it. Writing a JSON
 * sidecar means: no DATABASE_URL still works, a DB outage loses nothing, and
 * `clip_cut_segments` can always find the script for a file it has.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { workspaceDir } from "./workspace"

export interface StoredClip {
  id: string
  platform: string
  url: string | null
  title: string
  author: string | null
  caption: string | null
  durationSeconds: number | null
  localPath: string | null
  script: string
  analysis: string
  template: string
  metadata: unknown
  analyzedAt: string
}

function libraryDir(): string {
  return resolve(workspaceDir(), "library")
}

function fileFor(id: string): string {
  return join(libraryDir(), `${id.replace(/[^A-Za-z0-9._-]/g, "_")}.json`)
}

export function saveLocalClip(clip: StoredClip): string {
  mkdirSync(libraryDir(), { recursive: true })
  const path = fileFor(clip.id)
  writeFileSync(path, JSON.stringify(clip, null, 2), "utf8")
  return path
}

export function loadLocalClip(id: string): StoredClip | null {
  const path = fileFor(id)
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, "utf8")) as StoredClip
  } catch {
    return null
  }
}

export function listLocalClips(): StoredClip[] {
  const dir = libraryDir()
  if (!existsSync(dir)) return []
  const out: StoredClip[] = []
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".json")) continue
    try {
      out.push(JSON.parse(readFileSync(join(dir, f), "utf8")) as StoredClip)
    } catch {
      // a half-written file is not worth failing the listing over
    }
  }
  return out.sort((a, b) => b.analyzedAt.localeCompare(a.analyzedAt))
}
