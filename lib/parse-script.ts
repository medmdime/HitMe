export interface ScriptBlock {
  start_sec: number
  timestamp: string
  shot: string
  narration: string
}

// Headers look like "[MM:SS — Face camera frame]" or "[H:MM:SS — Broll of X]".
const HEADER_RE = /^\s*\[\s*(\d{1,2}(?::\d{2}){1,2})\s*[—–-]\s*([^\]]+?)\s*\]\s*$/

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
      }
    } else if (current) {
      narrationBuf.push(line)
    }
    // lines before the first header are dropped
  }
  flush()

  return blocks
}
