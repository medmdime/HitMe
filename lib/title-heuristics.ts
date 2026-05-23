export interface TitleSignals {
  length: number
  has_number: boolean
  has_year: boolean
  has_question: boolean
  starts_with_curiosity: boolean
  has_versus: boolean
  has_personal_pov: boolean
  has_strong_claim: boolean
  patterns: string[]
}

const CURIOSITY_OPENERS = /^(why|how|what|when|where|the truth about|inside|behind)\b/i
const PERSONAL_POV = /\b(i tried|i spent|i built|i made|i bought|i went|i tested)\b/i
const STRONG_CLAIM =
  /\b(nobody|never|always|biggest|worst|best|secret|hidden|truth|exposed|destroyed|insane|crazy)\b/i
const VERSUS = /\b(vs\.?|versus)\b/i

export function analyzeTitle(title: string): TitleSignals {
  const patterns: string[] = []
  const has_number = /\d/.test(title)
  const has_year = /\b(19|20)\d{2}\b/.test(title)
  const has_question = title.includes("?")
  const starts_with_curiosity = CURIOSITY_OPENERS.test(title)
  const has_versus = VERSUS.test(title)
  const has_personal_pov = PERSONAL_POV.test(title)
  const has_strong_claim = STRONG_CLAIM.test(title)

  if (has_number && !has_year) patterns.push("Contains a number")
  if (has_year) patterns.push("References a year")
  if (has_question) patterns.push("Open question")
  if (starts_with_curiosity) patterns.push("Curiosity-gap opener")
  if (has_versus) patterns.push("Comparison / vs format")
  if (has_personal_pov) patterns.push("Personal POV (I tried / I built)")
  if (has_strong_claim) patterns.push("Strong-claim wording")
  if (title.length <= 50) patterns.push("Short title (≤50 chars)")
  else if (title.length >= 80) patterns.push("Long title (≥80 chars)")

  return {
    length: title.length,
    has_number,
    has_year,
    has_question,
    starts_with_curiosity,
    has_versus,
    has_personal_pov,
    has_strong_claim,
    patterns,
  }
}

export function engagementRate(
  likes: number,
  comments: number,
  views: number
): number {
  if (views <= 0) return 0
  return (likes + comments) / views
}

export function lengthSweetSpot(
  durationSeconds: number,
  channelMedianDuration: number | null
): { label: string; color: "ok" | "warn" } {
  if (!channelMedianDuration) {
    if (durationSeconds < 4 * 60) return { label: "Under 4 min", color: "warn" }
    if (durationSeconds > 30 * 60) return { label: "Over 30 min", color: "warn" }
    return { label: "Typical length", color: "ok" }
  }
  const ratio = durationSeconds / channelMedianDuration
  if (ratio < 0.5) return { label: "Much shorter than channel norm", color: "warn" }
  if (ratio > 1.8) return { label: "Much longer than channel norm", color: "warn" }
  return { label: "Within channel norm", color: "ok" }
}

// Simple token-set similarity for pairing outliers with similar-topic flops.
const STOPWORDS = new Set([
  "the","a","an","of","to","in","on","for","and","or","but","with","is","are","was","were",
  "be","been","being","this","that","these","those","i","you","we","they","it","at","by","from",
  "my","your","our","their","its","as","if","so","do","does","did","not","no","yes",
])

export function titleTokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  )
}

export function titleSimilarity(a: string, b: string): number {
  const sa = titleTokens(a)
  const sb = titleTokens(b)
  if (sa.size === 0 || sb.size === 0) return 0
  let overlap = 0
  for (const t of sa) if (sb.has(t)) overlap++
  return overlap / Math.min(sa.size, sb.size)
}
