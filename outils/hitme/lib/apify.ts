/**
 * Apify client.
 *
 * TikTok and Instagram answer keyword and hashtag searches only to a signed-in
 * session, so the logged-out readers in tiktok.ts and instagram.ts can study an
 * account you name but cannot find one. Apify runs that search for us.
 *
 * This is the one metered dependency in the research stack: every item an Actor
 * returns is billed. So each run carries a spending cap and a time limit, and
 * callers are expected to keep what they fetched instead of fetching it twice.
 */

const API = "https://api.apify.com/v2"

/** Floor of the per-run spending cap; see spendingCap for how it grows with the request. */
const DEFAULT_MAX_USD_PER_RUN = 1

/** Apify stops the run itself after this long, so nothing keeps billing unattended. */
const RUN_TIMEOUT_SECONDS = 600

export class MissingApifyTokenError extends Error {
  constructor() {
    super(
      "No Apify token configured. Create a free account on apify.com, copy the API token from " +
        "Settings → API & Integrations, and set APIFY_TOKEN in .env.local."
    )
    this.name = "MissingApifyTokenError"
  }
}

export class ApifyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ApifyError"
  }
}

export function hasApifyToken(): boolean {
  return Boolean(process.env.APIFY_TOKEN?.trim())
}

/**
 * What one run may bill at most. APIFY_MAX_USD_PER_RUN, when set, is final.
 * Otherwise the cap is twice the expected price (list prices move, and filters
 * are billed on top), never under a dollar: tight enough to stop a runaway run,
 * loose enough that a large scan is not cut short without saying so.
 */
function spendingCap(expectedUsd: number): number {
  const fixed = Number(process.env.APIFY_MAX_USD_PER_RUN)
  if (Number.isFinite(fixed) && fixed > 0) return fixed
  return Math.max(DEFAULT_MAX_USD_PER_RUN, Math.ceil(expectedUsd * 200) / 100)
}

interface RunEnvelope {
  data?: {
    id?: string
    status?: string
    statusMessage?: string
    defaultDatasetId?: string
  }
  error?: { type?: string; message?: string }
}

async function request<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  const token = process.env.APIFY_TOKEN?.trim()
  if (!token) throw new MissingApifyTokenError()

  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await res.text()
  if (!res.ok) {
    let detail = text.slice(0, 300)
    try {
      detail = (JSON.parse(text) as RunEnvelope).error?.message ?? detail
    } catch {
      // non-JSON error body
    }
    if (res.status === 401) {
      throw new ApifyError(`Apify rejected the token in APIFY_TOKEN: ${detail}`)
    }
    throw new ApifyError(`Apify ${res.status}: ${detail}`)
  }
  try {
    return JSON.parse(text) as T
  } catch {
    throw new ApifyError(`Apify returned unparseable data for ${path.split("?")[0]}.`)
  }
}

/**
 * Runs an Actor to completion and returns its dataset.
 *
 * `actor` is `username~actor-name`. A run that hits the time limit still
 * returns what it collected: those items were billed, so they are worth keeping.
 */
export async function runActor<T>(
  actor: string,
  input: Record<string, unknown>,
  opts: { maxItems?: number; expectedUsd?: number } = {}
): Promise<T[]> {
  const qs = new URLSearchParams({
    waitForFinish: "60",
    timeout: String(RUN_TIMEOUT_SECONDS),
    maxTotalChargeUsd: String(spendingCap(opts.expectedUsd ?? 0)),
  })
  if (opts.maxItems) qs.set("maxItems", String(opts.maxItems))

  let run = (await request<RunEnvelope>("POST", `/acts/${actor}/runs?${qs}`, input)).data
  if (!run?.id) throw new ApifyError(`Apify did not start ${actor}.`)

  // The server holds each poll open for up to a minute; the extra margin covers
  // the time Apify needs to wind a run down after its own timeout fires.
  const deadline = Date.now() + (RUN_TIMEOUT_SECONDS + 120) * 1000
  while (run.status === "READY" || run.status === "RUNNING" || run.status === "TIMING-OUT") {
    if (Date.now() > deadline) {
      throw new ApifyError(`${actor} is still running after ${RUN_TIMEOUT_SECONDS}s (run ${run.id}).`)
    }
    const next = (await request<RunEnvelope>("GET", `/actor-runs/${run.id}?waitForFinish=60`)).data
    if (!next?.id) throw new ApifyError(`Apify lost track of run ${run.id}.`)
    run = next
  }

  if (run.status !== "SUCCEEDED" && run.status !== "TIMED-OUT") {
    throw new ApifyError(
      `${actor} ended as ${run.status}${run.statusMessage ? `: ${run.statusMessage}` : ""} (run ${run.id}).`
    )
  }
  if (!run.defaultDatasetId) throw new ApifyError(`${actor} finished without a dataset (run ${run.id}).`)

  const items = await request<unknown>("GET", `/datasets/${run.defaultDatasetId}/items?clean=true&format=json`)
  if (!Array.isArray(items)) throw new ApifyError(`${actor} returned a dataset that is not a list.`)
  return items as T[]
}
