import { NextResponse } from "next/server"
import {
  getChannelInfo,
  getChannelUploads,
  resolveChannelId,
  QuotaExhaustedError,
} from "@/lib/youtube-data"
import {
  computeChannelBaseline,
  computeOutlier,
  isLongForm,
} from "@/lib/outlier"
import { titleSimilarity } from "@/lib/title-heuristics"
import type { OutlierVideo } from "@/lib/youtube-data.types"

export const runtime = "nodejs"

interface PairedSuggestion {
  outlier: OutlierVideo
  flop: OutlierVideo
  similarity_note: string
  similarity: number
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      channelUrlOrId?: string
      minOutlier?: number
      lookbackVideos?: number
    }
    const input = body.channelUrlOrId?.trim()
    if (!input) {
      return NextResponse.json({ error: "channelUrlOrId required" }, { status: 400 })
    }
    const minOutlier = body.minOutlier ?? 3
    const lookback = Math.min(Math.max(body.lookbackVideos ?? 40, 10), 50)

    const channelId = await resolveChannelId(input)
    const [channel, uploads] = await Promise.all([
      getChannelInfo(channelId),
      getChannelUploads(channelId, lookback),
    ])

    const longForm = uploads.filter(isLongForm)
    const baseline = computeChannelBaseline(longForm)
    const scored = longForm
      .map((v) => computeOutlier(v, baseline.median, channel.subscriberCount))
      .sort((a, b) => b.outlier_score - a.outlier_score)

    const outliers = scored.filter((v) => v.outlier_score >= minOutlier)
    // Flops = bottom by outlier score (≈ < 1x median), exclude top half
    const flops = [...scored]
      .filter((v) => v.outlier_score < 1)
      .sort((a, b) => a.outlier_score - b.outlier_score)
      .slice(0, Math.min(10, scored.length))

    const paired: PairedSuggestion[] = []
    const usedFlopIds = new Set<string>()
    for (const o of outliers) {
      let best: { f: OutlierVideo; sim: number } | null = null
      for (const f of flops) {
        if (usedFlopIds.has(f.videoId)) continue
        const sim = titleSimilarity(o.title, f.title)
        if (!best || sim > best.sim) best = { f, sim }
      }
      if (best && best.sim > 0) {
        usedFlopIds.add(best.f.videoId)
        const overlap = sharedKeywords(o.title, best.f.title)
        paired.push({
          outlier: o,
          flop: best.f,
          similarity: best.sim,
          similarity_note: overlap.length
            ? `Shared topic keywords: ${overlap.join(", ")}`
            : "Closest available match (low keyword overlap)",
        })
      }
    }

    return NextResponse.json({
      channel,
      baseline,
      outliers,
      flops,
      paired_suggestions: paired,
    })
  } catch (err) {
    return errorResponse(err)
  }
}

function sharedKeywords(a: string, b: string): string[] {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
  const sa = new Set(norm(a))
  const out: string[] = []
  for (const w of norm(b)) if (sa.has(w)) out.push(w)
  return Array.from(new Set(out)).slice(0, 5)
}

function errorResponse(err: unknown) {
  if (err instanceof QuotaExhaustedError) {
    return NextResponse.json(
      { error: err.message, code: "QUOTA_EXHAUSTED" },
      { status: 429 }
    )
  }
  const message = err instanceof Error ? err.message : String(err)
  return NextResponse.json({ error: message }, { status: 500 })
}
