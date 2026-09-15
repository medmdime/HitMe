type Entry<T> = { value: T; expiresAt: number }

const store = new Map<string, Entry<unknown>>()

export function cacheGet<T>(key: string): T | undefined {
  const hit = store.get(key) as Entry<T> | undefined
  if (!hit) return undefined
  if (Date.now() > hit.expiresAt) {
    store.delete(key)
    return undefined
  }
  return hit.value
}

export function cacheSet<T>(key: string, value: T, ttlMs: number): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs })
}

export async function cached<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const hit = cacheGet<T>(key)
  if (hit !== undefined) return hit
  const value = await fetcher()
  cacheSet(key, value, ttlMs)
  return value
}

export const TTL = {
  channelUploads: 6 * 60 * 60 * 1000,
  videoStats: 60 * 60 * 1000,
  search: 30 * 60 * 1000,
  channelInfo: 6 * 60 * 60 * 1000,
} as const
