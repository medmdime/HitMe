export type AnnotationKind = "TEXT" | "SFX" | "MUSIC" | "CAM" | "FX"

export interface Annotation {
  kind: AnnotationKind
  value: string
}

export interface ScriptBlock {
  start_sec: number
  timestamp: string
  shot: string
  /** Spoken words only. Annotation lines are lifted out into `annotations`. */
  narration: string
  /** Per-shot production notes: on-screen text, sound effects, camera, edits. */
  annotations: Annotation[]
}

// Headers look like "[MM:SS — Face camera frame]" or "[H:MM:SS — Broll of X]".
const HEADER_RE = /^\s*\[\s*(\d{1,2}(?::\d{2}){1,2})\s*[—–-]\s*([^\]]+?)\s*\]\s*$/

// Short-form scripts carry production notes under each bracket, one per line:
// "TEXT: ...", "SFX: ...". They are not narration and must not reach the SRT.
const ANNOTATION_RE = /^\s*(TEXT|SFX|MUSIC|CAM|FX)\s*:\s*(.+?)\s*$/i

function parseTimestamp(ts: string): number {
  const parts = ts.split(":").map((p) => Number(p))
  if (parts.some((n) => Number.isNaN(n))) return 0
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return 0
}

export function parseScript(text: string): ScriptBlock[] {
  const blocks: ScriptBlock[] = []
  if (!text) return blocks

  const lines = text.split(/\r?\n/)
  let current: ScriptBlock | null = null
  const narrationBuf: string[] = []

  function flush() {
    if (!current) return
    current.narration = narrationBuf.join("\n").trim()
    blocks.push(current)
    current = null
    narrationBuf.length = 0
  }

  for (const line of lines) {
    const m = HEADER_RE.exec(line)
    if (m) {
      flush()
      const [, ts, shot] = m
      current = {
        start_sec: parseTimestamp(ts),
        timestamp: ts,
        shot: shot.trim(),
        narration: "",
        annotations: [],
      }
      continue
    }
    if (!current) continue // lines before the first header are dropped

    const a = ANNOTATION_RE.exec(line)
    if (a) {
      current.annotations.push({
        kind: a[1].toUpperCase() as AnnotationKind,
        value: a[2],
      })
    } else {
      narrationBuf.push(line)
    }
  }
  flush()

  return blocks
}

/** All annotations of one kind across the script, with the shot they belong to. */
export function collectAnnotations(
  blocks: ScriptBlock[],
  kind: AnnotationKind
): { timestamp: string; start_sec: number; shot: string; value: string }[] {
  const out: { timestamp: string; start_sec: number; shot: string; value: string }[] = []
  for (const b of blocks) {
    for (const a of b.annotations) {
      if (a.kind === kind) {
        out.push({ timestamp: b.timestamp, start_sec: b.start_sec, shot: b.shot, value: a.value })
      }
    }
  }
  return out
}

/** Heuristic: is this shot b-roll rather than the host on camera? */
export function isBrollShot(shot: string): boolean {
  const s = shot.toLowerCase()
  if (/face cam|face camera|talking head|host on camera|piece to camera|to camera/.test(s)) {
    return false
  }
  return /broll|b-roll|cutaway|footage|screen record|screen recording|clip of|shot of|graphic|meme|stock|archival|montage|insert/.test(
    s
  )
}
