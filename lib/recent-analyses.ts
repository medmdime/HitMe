import type { ChannelInfo, VideoStats } from "./youtube-data.types"

export interface AnalyzeResult {
  videoId: string
  url: string
  script: string
  analysis: string
  metadata: { video: VideoStats; channel: ChannelInfo | null } | null
}

export interface RecentAnalysis extends AnalyzeResult {
  analyzed_at: string
}

const CHANGE_EVENT = "hitme:recent-analyses-changed"

function notifyChanged() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

interface RowFromApi {
  videoId: string
  url: string
  script: string
  analysis: string
  metadata: RecentAnalysis["metadata"]
  analyzed_at: string
}

function rowToRecent(r: RowFromApi): RecentAnalysis {
  return {
    videoId: r.videoId,
    url: r.url,
    script: r.script,
    analysis: r.analysis,
    metadata: r.metadata,
    analyzed_at: r.analyzed_at,
  }
}

export async function listRecent(): Promise<RecentAnalysis[]> {
  if (typeof window === "undefined") return []
  const res = await fetch("/api/recent", { cache: "no-store" })
  if (!res.ok) throw new Error(`Failed to load recent (HTTP ${res.status})`)
  const json = (await res.json()) as { entries: RowFromApi[] }
  return (json.entries ?? []).map(rowToRecent)
}

export async function getRecent(videoId: string): Promise<RecentAnalysis | null> {
  if (typeof window === "undefined") return null
  const res = await fetch(`/api/recent/${encodeURIComponent(videoId)}`, {
    cache: "no-store",
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed (HTTP ${res.status})`)
  const json = (await res.json()) as { entry: RowFromApi | null }
  return json.entry ? rowToRecent(json.entry) : null
}

export async function saveRecent(
  result: AnalyzeResult
): Promise<RecentAnalysis> {
  const res = await fetch("/api/recent", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(result),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Save failed (HTTP ${res.status}): ${body}`)
  }
  const json = (await res.json()) as { entry: RowFromApi }
  notifyChanged()
  return rowToRecent(json.entry)
}

export async function deleteRecent(videoId: string): Promise<void> {
  const res = await fetch(`/api/recent/${encodeURIComponent(videoId)}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error(`Delete failed (HTTP ${res.status})`)
  notifyChanged()
}

export async function clearRecent(): Promise<void> {
  const res = await fetch("/api/recent", { method: "DELETE" })
  if (!res.ok) throw new Error(`Clear failed (HTTP ${res.status})`)
  notifyChanged()
}

/**
 * Subscribe to changes. Fires on:
 * - This-tab mutations (custom event)
 * - Cross-tab mutations (BroadcastChannel)
 * - Window refocus (server may have changed via collaborator)
 *
 * NOTE: this only signals "something changed" — the consumer is responsible
 * for re-fetching via listRecent().
 */
export function subscribeRecent(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  const channel =
    typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel(CHANGE_EVENT)
      : null

  const onLocal = () => {
    listener()
    channel?.postMessage("ping")
  }
  const onRemote = () => listener()
  const onFocus = () => listener()

  window.addEventListener(CHANGE_EVENT, onLocal)
  window.addEventListener("focus", onFocus)
  if (channel) channel.addEventListener("message", onRemote)

  return () => {
    window.removeEventListener(CHANGE_EVENT, onLocal)
    window.removeEventListener("focus", onFocus)
    if (channel) {
      channel.removeEventListener("message", onRemote)
      channel.close()
    }
  }
}

/**
 * One-time migration from old localStorage cache. Runs at most once per
 * browser. If the user had analyses cached before we moved to the DB,
 * upload them now and clear the local copy.
 */
const LEGACY_KEY = "hitme:recent-analyses"
const MIGRATED_FLAG = "hitme:legacy-migrated"

export async function migrateLegacyLocalStorage(): Promise<number> {
  if (typeof window === "undefined") return 0
  if (window.localStorage.getItem(MIGRATED_FLAG)) return 0
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(LEGACY_KEY)
  } catch {
    return 0
  }
  if (!raw) {
    window.localStorage.setItem(MIGRATED_FLAG, "1")
    return 0
  }

  let entries: RecentAnalysis[] = []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      entries = parsed.filter(
        (e): e is RecentAnalysis =>
          !!e &&
          typeof e === "object" &&
          typeof (e as RecentAnalysis).videoId === "string"
      )
    }
  } catch {
    window.localStorage.setItem(MIGRATED_FLAG, "1")
    return 0
  }

  let uploaded = 0
  for (const entry of entries) {
    try {
      await saveRecent(entry)
      uploaded++
    } catch {
      // skip failures — they'll re-appear via dev tools if the user wants to retry
    }
  }

  try {
    window.localStorage.removeItem(LEGACY_KEY)
  } catch {
    // ignore
  }
  window.localStorage.setItem(MIGRATED_FLAG, "1")
  return uploaded
}
