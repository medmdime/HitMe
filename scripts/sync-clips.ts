/**
 * Push every local clip sidecar into the shared clips table.
 *
 * Transcription writes the sidecar unconditionally and the DB best effort, so
 * the two drift whenever a row is rejected — which is silent, because the write
 * only logs to stderr. Run this after a batch of teardowns, or any time
 * `/clips` and `library_list` disagree about what exists.
 *
 * Also repairs sidecars whose durationSeconds is missing or zero: early
 * versions stored the metadata duration, which Instagram does not report.
 *
 *   npx tsx scripts/sync-clips.ts          # sync
 *   npx tsx scripts/sync-clips.ts --dry    # report only
 */
import "../mcp/env"
import { listLocalClips, saveLocalClip } from "../lib/clip-store"
import { probeDuration } from "../lib/segments"
import { splitSections } from "../lib/prompts"
import { upsertClip, listClips } from "../lib/db/clips"

const dry = process.argv.includes("--dry")

const local = listLocalClips()
console.log(`${local.length} local sidecar${local.length === 1 ? "" : "s"}`)

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set — nothing to sync into.")
  process.exit(1)
}

const inDb = new Set((await listClips(500)).map((r) => r.id))
console.log(`${inDb.size} row${inDb.size === 1 ? "" : "s"} already in the database\n`)

let repaired = 0
let recovered = 0
let written = 0
let failed = 0

for (const clip of local) {
  let patched = false

  // Repair a missing duration before the row goes anywhere.
  if (!clip.durationSeconds && clip.localPath) {
    const probed = await probeDuration(clip.localPath).catch(() => null)
    if (probed) {
      clip.durationSeconds = probed
      patched = true
      repaired++
      console.log(`  duration   ${clip.id} -> ${Math.round(probed)}s`)
    }
  }

  // Recover a template the old exact-match splitter left buried at the end of
  // the teardown when the model decorated the marker differently.
  if (!clip.template?.trim() && clip.analysis) {
    const { analysis, template } = splitSections(clip.analysis)
    if (template) {
      clip.analysis = analysis
      clip.template = template
      patched = true
      recovered++
      console.log(`  template   ${clip.id} -> ${template.length} chars`)
    }
  }

  if (patched) saveLocalClip(clip)

  const verb = inDb.has(clip.id) ? "updated" : "inserted"
  if (dry) {
    console.log(`  would ${verb.replace(/e?d$/, "")}  ${clip.id}`)
    continue
  }
  try {
    await upsertClip(clip)
    written++
    console.log(`  ${verb.padEnd(9)}  ${clip.id}`)
  } catch (err) {
    failed++
    console.error(`  FAILED           ${clip.id}: ${err instanceof Error ? err.message : String(err)}`)
  }
}

console.log(
  `\n${dry ? "dry run — " : ""}${written} written, ${repaired} duration${repaired === 1 ? "" : "s"} repaired, ${recovered} template${recovered === 1 ? "" : "s"} recovered, ${failed} failed`
)
process.exit(failed > 0 ? 1 : 0)
