import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import {
  getChannelInfo,
  getChannelUploads,
  getVideoStats,
  QuotaExhaustedError,
  searchVideos,
} from "@/lib/youtube-data"
import {
  computeChannelBaseline,
  computeOutlier,
  isLongForm,
} from "@/lib/outlier"
import type { OutlierVideo } from "@/lib/youtube-data.types"

export const runtime = "nodejs"
export const maxDuration = 120

const QUERY_MODEL = "gemini-3.5-flash"

const STOPWORDS = new Set([
  "the","a","an","of","to","in","on","for","and","or","but","with","is","are","was","were",
  "be","been","being","this","that","these","those","i","you","we","they","it","at","by","from",
  "my","your","our","their","its","as","if","so","do","does","did","not","no","yes","how","why",
  "what","when","where","who","new","most","very","just","than","then","into","over","under","about",
])

function fallbackKeywords(title: string, limit = 4): string[] {
  const cleaned = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  const seen = new Set<string>()
  const out: string[] = []
  for (const w of cleaned) {
    if (seen.has(w)) continue
    seen.add(w)
    out.push(w)
    if (out.length >= limit) break
  }
  return out
}

interface RewrittenQueries {
  subject: string
  entities: string[]
  format: string
  intent: string
  queries: string[]
}

async function rewriteQueries(input: {
  title: string
  channelTitle: string
  script: string
  analysis: string
}): Promise<RewrittenQueries | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null
  try {
    const ai = new GoogleGenAI({ apiKey })
    const prompt = `You're generating YouTube search queries to find videos that cover the SAME SPECIFIC SUBJECT as a reference video.

Reference video:
Title: ${input.title}
Channel: ${input.channelTitle}

Script (excerpt — read carefully, it names the actual subject):
${input.script.slice(0, 5000)}

Teardown:
${input.analysis.slice(0, 1500)}

CRITICAL RULES:

1. The script names the SPECIFIC thing the video is about — a person, an event, a product, a place, a date, a record, a game, a film, a court case, a company. Extract those concrete named entities and ground every query in them. Do NOT produce abstract format-only queries like "elite athletic performance breakdown" — those will return generic videos in the wrong subject.

2. Every query MUST include at least one specific named entity from the script (a person's name, an event name, a product name, a year, a record, etc.). Generic queries are forbidden.

3. Combine the named entity with a format/intent marker when it helps narrow the format ("explained", "breakdown", "analysis", "reaction", "what happened", "behind the scenes", "documentary"). Format is secondary to subject; subject is non-negotiable.

4. Produce 4-6 queries that cover the subject from different angles. Examples of GOOD vs BAD for a video about Sebastian Sawe breaking sub-2-hour marathon in London:
   GOOD: "Sebastian Sawe sub 2 marathon", "first sub 2 hour marathon London", "Sawe marathon world record breakdown", "sub 2 marathon explained 2025"
   BAD: "elite athletic performance breakdown", "how hard is elite pace", "historic athletic achievement analysis"

5. Each query is 3-8 words a real YouTube user would type. No quotes, no operators, just plain words.

Output JSON only — no prose, no markdown fences — with this exact shape:

{
  "subject": "one sentence concretely describing what the video is specifically about, including the key named entities",
  "entities": ["named entity 1", "named entity 2", "..."],
  "format": "short noun phrase for the format (e.g. 'race breakdown', 'product review', 'video essay')",
  "intent": "short noun phrase for what the viewer comes for",
  "queries": ["query1", "query2", "query3", "query4"]
}`

    const result = await ai.models.generateContent({
      model: QUERY_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    })
    const text = (result.text ?? "").trim()
    const json = extractJson(text)
    if (!json) return null
    const parsed = JSON.parse(json) as Partial<RewrittenQueries>
    if (!Array.isArray(parsed.queries) || parsed.queries.length === 0) return null
    return {
      subject: parsed.subject ?? "",
      entities: Array.isArray(parsed.entities)
        ? parsed.entities.filter((e): e is string => typeof e === "string")
        : [],
      format: parsed.format ?? "",
      intent: parsed.intent ?? "",
      queries: parsed.queries
        .filter((q): q is string => typeof q === "string" && q.trim().length > 0)
        .slice(0, 6),
    }
  } catch {
    return null
  }
}

function extractJson(text: string): string | null {
  // Tolerate ```json ... ``` fences and surrounding prose.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const body = fenced ? fenced[1] : text
  const start = body.indexOf("{")
  const end = body.lastIndexOf("}")
  if (start === -1 || end === -1 || end <= start) return null
  return body.slice(start, end + 1)
}

function normalizeLang(code: string | undefined | null): string | undefined {
  if (!code) return undefined
  const lower = code.toLowerCase().trim()
  if (!lower) return undefined
  // Strip region: "en-US" -> "en"
  return lower.split(/[-_]/)[0]
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      videoId?: string
      script?: string
      analysis?: string
      language?: string | null // 2-letter BCP47 code, "any" to disable, or unset for auto
      minSubs?: number
      maxSubs?: number
    }
    const videoId = body.videoId?.trim()
    if (!videoId) {
      return NextResponse.json({ error: "videoId required" }, { status: 400 })
    }

    const [sourceVideo] = await getVideoStats([videoId])
    if (!sourceVideo) {
      return NextResponse.json({ error: "Source video not found" }, { status: 404 })
    }

    // Source channel baseline + outlier (for the comparison view)
    let sourceOutlier: OutlierVideo | null = null
    try {
      const sourceChannel = await getChannelInfo(sourceVideo.channelId)
      const sourceUploads = await getChannelUploads(sourceVideo.channelId, 30)
      const sourceBaseline = computeChannelBaseline(sourceUploads)
      sourceOutlier = computeOutlier(
        sourceVideo,
        sourceBaseline.median,
        sourceChannel.subscriberCount
      )
    } catch {
      // proceed without source outlier context
    }

    // Try Gemini-powered subject-aware queries; fall back to title keywords.
    let queries: string[] = []
    let subject = ""
    let entities: string[] = []
    let format = ""
    let intent = ""
    if (body.script && body.analysis) {
      const rewritten = await rewriteQueries({
        title: sourceVideo.title,
        channelTitle: sourceVideo.channelTitle,
        script: body.script,
        analysis: body.analysis,
      })
      if (rewritten) {
        queries = rewritten.queries
        subject = rewritten.subject
        entities = rewritten.entities
        format = rewritten.format
        intent = rewritten.intent
      }
    }
    if (queries.length === 0) {
      const kws = fallbackKeywords(sourceVideo.title)
      if (kws.length > 0) queries = [kws.join(" ")]
    }

    if (queries.length === 0) {
      return NextResponse.json({
        source: sourceOutlier ?? sourceVideo,
        subject,
        entities,
        queries: [],
        format,
        intent,
        alternatives: [],
      })
    }

    // Time window: ±4 weeks of source.publishedAt. Keeps event-coverage on the
    // event, keeps evergreen videos in their own era, and drops drift.
    const WINDOW_MS = 4 * 7 * 24 * 60 * 60 * 1000
    const sourcePublished = new Date(sourceVideo.publishedAt).getTime()
    const publishedAfterIso = new Date(sourcePublished - WINDOW_MS).toISOString()
    const publishedBeforeIso = new Date(sourcePublished + WINDOW_MS).toISOString()

    // Language: explicit override > source video metadata > undefined.
    const sourceLang =
      normalizeLang(sourceVideo.defaultAudioLanguage) ??
      normalizeLang(sourceVideo.defaultLanguage)
    const requestedLang =
      body.language === undefined || body.language === null
        ? sourceLang // auto-detect
        : body.language === "any"
        ? undefined
        : normalizeLang(body.language)

    // For event-driven / subject-specific content, `relevance` surfaces fresh
    // matches that `viewCount` misses (viewCount is biased toward older evergreen).
    // Run each query twice and merge.
    const orderPasses: Array<"viewCount" | "relevance"> = ["viewCount", "relevance"]
    const searchResults = await Promise.all(
      queries.flatMap((q) =>
        orderPasses.map((order) =>
          searchVideos({
            query: q,
            maxResults: 20,
            videoDuration: "medium",
            order,
            publishedAfter: publishedAfterIso,
            publishedBefore: publishedBeforeIso,
            relevanceLanguage: requestedLang,
          }).catch(() => ({ videoIds: [] as string[], channelIds: [] as string[] }))
        )
      )
    )
    const allVideoIds = Array.from(
      new Set(searchResults.flatMap((r) => r.videoIds))
    ).filter((id) => id !== videoId)

    // Safety net: re-apply the window after fetching stats, in case
    // YouTube's publishedAfter/Before is fuzzy or any cache served stale rows.
    const windowStart = sourcePublished - WINDOW_MS
    const windowEnd = sourcePublished + WINDOW_MS
    const stats = (await getVideoStats(allVideoIds))
      .filter(isLongForm)
      .filter((v) => {
        const t = new Date(v.publishedAt).getTime()
        return t >= windowStart && t <= windowEnd
      })
      .filter((v) => {
        // Hard language filter when both the requested and the video have a
        // language tag. Videos with no language tag get the benefit of the doubt
        // (otherwise we lose half the catalog — many creators don't set it).
        if (!requestedLang) return true
        const vLang =
          normalizeLang(v.defaultAudioLanguage) ??
          normalizeLang(v.defaultLanguage)
        if (!vLang) return true
        return vLang === requestedLang
      })
    const uniqueChannels = Array.from(new Set(stats.map((s) => s.channelId)))

    const channelData = await Promise.all(
      uniqueChannels.map(async (cid) => {
        try {
          const [info, uploads] = await Promise.all([
            getChannelInfo(cid),
            getChannelUploads(cid, 30),
          ])
          return {
            cid,
            subs: info.subscriberCount,
            median: computeChannelBaseline(uploads).median,
          }
        } catch {
          return { cid, subs: 0, median: 0 }
        }
      })
    )
    const map = new Map(channelData.map((c) => [c.cid, c]))

    const enriched: OutlierVideo[] = stats.map((v) => {
      const ch = map.get(v.channelId)
      return computeOutlier(v, ch?.median ?? 0, ch?.subs)
    })

    const sourceScore = sourceOutlier?.outlier_score ?? 1
    const sourceViews = sourceVideo.views
    const minSubs = typeof body.minSubs === "number" ? body.minSubs : undefined
    const maxSubs = typeof body.maxSubs === "number" ? body.maxSubs : undefined

    // Keep anything that's at least a decent hit (>=2x its channel median)
    // OR beat the source on either outlier score or raw views. This widens
    // the funnel for niche subjects where the canonical analysis is itself
    // the top outlier — we still want to show other in-subject contenders.
    const ranked = enriched
      .filter(
        (v) =>
          v.outlier_score >= 2 ||
          v.outlier_score > sourceScore ||
          v.views > sourceViews
      )
      .filter((v) => {
        const subs = v.channel_subscribers ?? 0
        if (minSubs !== undefined && subs < minSubs) return false
        if (maxSubs !== undefined && subs > maxSubs) return false
        return true
      })
      .map((v) => {
        const subs = v.channel_subscribers ?? 1
        const smallBonus = Math.max(0, 6 - Math.log10(Math.max(1000, subs)))
        const score = v.outlier_score * (1 + smallBonus * 0.25)
        return { v, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((r) => r.v)

    return NextResponse.json({
      source: sourceOutlier ?? sourceVideo,
      subject,
      entities,
      queries,
      format,
      intent,
      window: {
        from: publishedAfterIso,
        to: publishedBeforeIso,
        weeks: 4,
      },
      filters: {
        language: requestedLang ?? null,
        sourceLanguage: sourceLang ?? null,
        minSubs: minSubs ?? null,
        maxSubs: maxSubs ?? null,
      },
      alternatives: ranked,
    })
  } catch (err) {
    if (err instanceof QuotaExhaustedError) {
      return NextResponse.json(
        { error: err.message, code: "QUOTA_EXHAUSTED" },
        { status: 429 }
      )
    }
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
