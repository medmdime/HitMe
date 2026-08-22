# HitMe

A YouTube script reverse-engineering tool with two halves:

1. **Discover** — find outlier videos in any channel or niche, ranked by `views ÷ channel median`.
2. **Analyze** — feed a video to Gemini and get a timestamped script in bracket format + a teardown.

End-to-end workflow:

```
Discovery (find hits) → Analysis (extract script) → Adapt to my topic → Export script
```

## Quick start

```bash
bun install   # or: npm install
cp .env.example .env.local   # then edit
bun run dev   # or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

```
# Required — Gemini handles the video analysis
GEMINI_API_KEY=...

# Required — at least key #1
YOUTUBE_API_KEY_1=...

# Optional — adding more keys raises the daily quota linearly
YOUTUBE_API_KEY_2=...
YOUTUBE_API_KEY_3=...
YOUTUBE_API_KEY_4=...
YOUTUBE_API_KEY_5=...

# Required — Neon Postgres (shared analysis store)
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
```

### Setting up the Neon database

1. Create a Neon project at [console.neon.tech](https://console.neon.tech).
2. Copy the **pooled** connection string from **Connection Details**.
3. Put it in `.env.local` as `DATABASE_URL`.
4. Run `bun run db:push` (or `npm run db:push`) — this creates the `analyses` table in your Neon db.
5. (Optional) Run `bun run db:studio` to browse rows in a local web UI.

Everything you analyze is upserted into Neon, so anyone with the same `DATABASE_URL` sees the same recent-analyses list and benefits from each other's cache hits.

### Getting a Gemini API key

1. Go to [aistudio.google.com](https://aistudio.google.com/).
2. Click **Get API key** → **Create API key**.

### Getting YouTube Data API keys

1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Create a new project.
3. **APIs & Services → Library → YouTube Data API v3 → Enable**.
4. **APIs & Services → Credentials → Create credentials → API key**.
5. Paste the key into `YOUTUBE_API_KEY_1`.

**Recommended:** create 2–3 *separate Google Cloud projects* (one key each) instead of multiple keys in one project. The 10,000-unit daily quota is per-project, so multiple keys in the same project share the same bucket — it doesn't actually raise your ceiling.

When key #1 hits its quota, the app automatically rotates to key #2, then #3, etc. You can watch usage in the quota meter on the right side of `/discover`.

## How outliers are scored

```
outlier_score = video_views / channel_median_recent_views
```

Where `channel_median_recent_views` is the median view count of the **bottom 80%** of the channel's last 20–50 long-form videos. The top 20% is excluded so a creator's own outliers don't anchor their baseline upward. Shorts (< 60s) are filtered out — they have totally different performance dynamics.

| Score    | Tier   |
| -------- | ------ |
| 1–2×     | Normal |
| 3–5×     | Solid  |
| 5–10×    | Strong |
| 10–20×   | Banger |
| 20×+     | Freak  |

## Discovery modes

- **Channel deep-dive** — rank a single channel's recent videos by outlier score.
- **Keyword search** — search YouTube and rank results by outlier score (not raw views).
- **Small-channel breakouts** — videos in a niche where a small channel had a hit. Most replicable lessons live here.
- **Hit vs flop compare** — pair a channel's outliers with its flops so you can diff script + packaging on identical production.

Each result has a **Why it might have worked** panel with cheap heuristics (title patterns, engagement rate, velocity, length sweet spot) so you can pick the few worth a full Gemini analysis.

## Project structure

```
app/
  page.tsx                        # Analyzer (reads ?url=&autorun=true)
  discover/page.tsx               # Discovery workspace
  api/
    analyze/route.ts              # Gemini video → bracket script
    discover/
      channel/route.ts
      keyword/route.ts
      small-breakouts/route.ts
      compare/route.ts
      quota/route.ts
components/
  analyzer/analyzer-workspace.tsx
  discover/
    channel-deep-dive.tsx
    keyword-search.tsx
    small-breakouts.tsx
    hit-vs-flop.tsx
    result-card.tsx
    why-it-worked.tsx
    quota-meter.tsx
    results-grid.tsx
  app-nav.tsx
lib/
  youtube-data.ts                 # Multi-key YouTube API client
  youtube-data.types.ts
  youtube-url.ts
  outlier.ts                      # Baseline + scoring + tier classification
  title-heuristics.ts             # "Why it worked" pattern detection
  cache.ts                        # TTL in-memory cache
  format.ts                       # Number/duration/time formatting
```

## Notes

- No scraping. Official YouTube Data API v3 only.
- API keys are server-side only — never sent to the client.
- The cache is in-memory per process; serverless cold starts reset it (fine for single-user use).
- Quota counters are estimated based on documented unit costs and also reset on cold start.

---

# MCP server

Everything above is also available to an AI assistant over MCP, plus clip transcription,
a saved-work library, and video projects. Claude Code picks it up automatically from
`.mcp.json` when this folder is the working directory.

```bash
bun run mcp:smoke     # boot it, list tools, sanity-check
bun run mcp           # run it directly (stdio; ^C to stop)
```

## One-time setup

The library and project tools need two new tables:

```bash
bun run db:push
```

Everything else works without it — the YouTube research tools need only
`YOUTUBE_API_KEY_1`, and teardowns need `GEMINI_API_KEY`.

For Instagram/TikTok transcription, yt-dlp must be on PATH:

```bash
pip install -U "yt-dlp[default]" curl_cffi
```

`curl_cffi` is load-bearing for Instagram: it only answers logged-out requests from clients
whose TLS fingerprint looks like a real browser, and yt-dlp needs curl_cffi to impersonate
one. The `[default]` extras do **not** include it. Installing via
`winget install yt-dlp.yt-dlp` works for TikTok and YouTube but ships no impersonation
support, so Instagram links will be refused.

ffmpeg is optional — clips download as single muxed MP4s, so no merge step is needed.

The TikTok *research* tools need none of this; they use plain `fetch` and no credentials.

## The tools

**Research** — the `/discover` scoring, callable directly.

| Tool | Purpose |
| --- | --- |
| `yt_small_breakouts` | Small channel, big hit. The most replicable lessons. |
| `yt_keyword_outliers` | Topic search ranked by outlier score, not views. |
| `yt_channel_outliers` | One channel's uploads ranked against its own median. |
| `yt_hit_vs_flop` | Pair a channel's hits with topic-similar flops. |
| `yt_trending` | Trending chart, annotated with outlier scores. |
| `yt_video_info` | One video: stats, outlier score, title signals. |
| `yt_quota` | Estimated API quota left per key. |

**Short-form research (TikTok + Instagram)** — no API key, no cookies, works logged out.

| Tool | Purpose |
| --- | --- |
| `tiktok_account_outliers` | Rank a TikTok account's posts against its own median. |
| `tiktok_account_summary` | Cadence, consistency, and breakout count. |
| `instagram_account_outliers` | Same for Instagram; ranks on likes or reel views. |
| `instagram_account_summary` | Format mix, cadence, engagement. |

Also available in the web UI as **TikTok** and **Instagram** tabs on `/discover`.

There is **no free platform-wide search on either platform** — no hashtag, keyword,
trending, or For You feed. Those endpoints require request signing, and TikTok's Research
API excludes creators by policy. Only per-account reading is open, so research starts from
a list of accounts you name rather than from a trending page.

Per-platform caveats worth knowing:

- **TikTok rounds its public counts**, and the step jumps to 100k above a million, so a
  post just over 1M can be off by 5%. Those are marked `~`, and ties are broken on
  engagement rather than left to arbitrary order.
- **Instagram publishes views only for videos and reels.** Photos carry likes and comments
  and nothing else, so likes is the only metric that ranks a whole grid; `views` restricts
  to reels and reports how many posts it had to exclude. Instagram also throttles quickly —
  12 posts is one clean request, deeper scans may return short and say so.
- **Scores move with the scan depth** on both, because the median shifts as you read more
  history. Keep the lookback fixed when comparing accounts.

**Analysis**

| Tool | Purpose |
| --- | --- |
| `analyze_youtube_video` | Gemini teardown → bracket script + analysis. Cached in `analyses`. |
| `transcribe_clip` | Instagram reel, TikTok, or local file → short-form bracket script. Cached in `clips`. |

**Library** — `library_list`, `library_get`, `library_search`, `library_stats` read across
both tables, so "what have I already studied" is one question.

**Projects** — `project_create`, `project_list`, `project_get`, `project_update`,
`project_delete`, and `project_compare_sources`, which lays every reference script out beat
by beat for writing a remix.

**Production** — `broll_plan_init` turns a script into a numbered shot list,
`broll_plan_set` saves the filled-in plan, `capcut_plan` converts bracket timestamps into
timed CapCut calls plus an SRT, `capcut_reference` documents that server's undocumented
requirements, and `export_project_files` writes script / SRT / voiceover / shot CSV.

## Layout

```
mcp/
  server.ts              # entry: registers everything, stdio transport
  env.ts                 # loads .env.local (Next does this automatically; plain Node does not)
  lib/
    gemini.ts            # YouTube-URL and local-file video analysis
    media.ts             # yt-dlp wrapper: probe, download, cache
    text.ts              # compact output — MCP results land in a context window
  tools/
    youtube.ts  analyze.ts  library.ts  project.ts  capcut.ts
```

`.hitme/media` holds downloaded clips, `.hitme/exports` holds generated scripts and SRTs.
Both are gitignored.

## Notes

- The bracket script format is the spine of the whole pipeline. `lib/prompts.ts` is the
  single source of truth, shared with the web analyzer, and `lib/parse-script.ts` turns it
  back into shots with timestamps — which is what makes the CapCut timeline math work.
- Tool output is deliberately compact. Discovery returns a table capped at 25 rows by
  default rather than raw JSON for 50 videos.
- Built on `@modelcontextprotocol/sdk` v1. A v2 line (`@modelcontextprotocol/server`)
  shipped in July 2026; v1 is not deprecated and is what this runs on.
