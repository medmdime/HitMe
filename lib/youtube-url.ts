export function extractVideoId(input: string): string | null {
  const raw = input.trim()
  if (!raw) return null
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw

  try {
    const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`)
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1)
      return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v")
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v
      // /shorts/<id> /embed/<id> /live/<id>
      const m = u.pathname.match(/^\/(?:shorts|embed|live)\/([A-Za-z0-9_-]{11})/)
      if (m) return m[1]
    }
  } catch {
    return null
  }
  return null
}
