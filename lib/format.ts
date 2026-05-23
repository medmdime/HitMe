export function compactNumber(n: number): string {
  if (!Number.isFinite(n)) return "—"
  if (n < 1000) return String(n)
  const units = [
    { v: 1e9, s: "B" },
    { v: 1e6, s: "M" },
    { v: 1e3, s: "K" },
  ]
  for (const { v, s } of units) {
    if (n >= v) {
      const x = n / v
      return `${x >= 10 ? x.toFixed(0) : x.toFixed(1)}${s}`
    }
  }
  return String(n)
}

export function formatDuration(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "0:00"
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${m}:${String(s).padStart(2, "0")}`
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const sec = Math.max(0, (Date.now() - then) / 1000)
  const units: [number, string][] = [
    [86400 * 365, "y"],
    [86400 * 30, "mo"],
    [86400 * 7, "w"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ]
  for (const [s, label] of units) {
    if (sec >= s) {
      const n = Math.floor(sec / s)
      return `${n}${label} ago`
    }
  }
  return "just now"
}
