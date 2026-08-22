---
name: video
description: End-to-end video production — research what worked on YouTube/Instagram, tear down references into scripts, remix them into an original script, plan and generate b-roll, and assemble a CapCut draft. Use when the user wants to plan, write, research, or produce a video; find video ideas; study a creator's hits; transcribe a reel; blend two videos into their own version; build a b-roll shot list; or hand an edit to CapCut.
---

# Making a video with HitMe

The premise: videos that already beat their own channel's average are a data set. Study
several, take the mechanism rather than the content, and write your own.

The `hitme` MCP server does the research, teardown, and bookkeeping. Higgsfield generates
b-roll. CapCut assembles. Your job is the judgment in between.

## The loop

```
research → study → remix → produce → edit
```

Do not skip ahead. A shot list before a script produces a slideshow; a script before
research produces a video nobody searched for.

---

## 1. Research — find what overperformed

Rank by **outlier score** (views ÷ that channel's own median), never raw views. A 500k-view
video from a 5M-sub channel is a bad Tuesday. A 500k-view video from a 20k-sub channel is a
lesson.

| Tool | Use it for |
|---|---|
| `yt_small_breakouts` | **Start here for a new topic.** Small channel + big hit = the idea and packaging did the work, not the audience. |
| `yt_keyword_outliers` | Broad sweep of a topic, ranked by outlier rather than views. |
| `yt_channel_outliers` | Which of a specific creator's videos beat their own baseline. |
| `yt_hit_vs_flop` | Same creator, same production, opposite outcomes. The cleanest way to isolate what script and packaging actually did. |
| `yt_trending` | What is hot right now in a category. |
| `yt_video_info` | Vet one candidate before spending a slow teardown on it. |

Searches cost 100 quota units each out of 10,000/day. Check `yt_quota` if calls start
failing. Prefer narrowing an existing result set over re-searching.

### Short-form: TikTok and Instagram

| Tool | Use it for |
|---|---|
| `tiktok_account_outliers` | Which of a TikTok creator's posts broke out against their own median. |
| `tiktok_account_summary` | Is this account worth studying? Cadence, consistency, breakout count. |
| `instagram_account_outliers` | Same, for Instagram. Ranks on likes by default; `metric: "views"` for reels. |
| `instagram_account_summary` | Format mix (reels vs photos), cadence, engagement. |

**The hard limit, and it shapes the whole workflow: there is no free platform-wide search
on TikTok or Instagram.** No hashtag feed, no keyword search, no trending list, no For You.
Those endpoints are signed and return nothing without credentials, and the TikTok Research
API excludes creators by policy. Only per-account reading is open.

So you cannot ask "what's trending on TikTok right now." You *can* ask "which of these ten
creators in my niche just had a breakout, and why." Keep a seed list of accounts worth
watching and sweep it — that is the workflow, and it is a better question anyway, because a
breakout in your niche is a signal you can act on where a global trend usually isn't.

If the user asks for trending TikToks, say plainly that it isn't available for free and
offer the account sweep instead. Do not fake it with a guess.

Two data caveats that matter when you report numbers:

- **Counts are rounded**, and the step jumps to 100,000 above a million. A post just over
  1M can be off by 5%. The tool marks these with `~`. Never present close scores as a
  meaningful ranking, and never quote a score to two decimals.
- **Scores depend on the lookback window.** The median moves as you read deeper, so the
  same post can be 198x or 111x depending on sample depth. Keep `lookback` fixed when
  comparing, and say which window a number came from.

**Instagram has one extra quirk.** It publishes a view count only for videos and reels —
photos and carousels carry likes and comments and nothing else. So `metric: "likes"`
(the default) ranks the whole grid, and `metric: "views"` silently drops every photo. Use
views when you care about reels reach, likes when you want the account's full picture, and
say which one a number came from.

Instagram also throttles far sooner than TikTok. A `lookback` of 12 is a single clean
request; deeper scans may come back short, and the tool flags it when that happens. Prefer
12 unless you specifically need more history.

Pick 2–4 references. More than that and the remix turns to mush.

## 2. Study — turn references into scripts

- `analyze_youtube_video` — long-form. Slow (1–3 min for a 10-minute video). Cached forever after.
- `transcribe_clip` — Instagram reels, TikToks, or any local file. Uses the short-form prompt
  by default: beat-by-beat on the first 3 seconds, on-screen text tracked separately from speech.

Always run `library_list` first. The teardown may already exist, and a cache hit is instant.

Both return a bracket script:

```
[00:00 — Face camera frame]
narration exactly as spoken

[00:04 — Broll of a city street at dawn]
narration exactly as spoken
```

That format is load-bearing. Timestamps become the CapCut timeline later, so keep it intact.

**When Instagram refuses.** Anonymous fetches get rate-limited. In order: retry once, then
`cookiesFromBrowser: "chrome"` to reuse a logged-in session, then ask the user to save the
video and pass `file`. Do not hammer it — repeated anonymous hits get the IP throttled harder.

## 3. Remix — write your version

```
project_create → project_compare_sources → write → project_update(script=...)
```

`project_compare_sources` lays every reference out beat by beat with its teardown. Read it
before writing a word.

**How to actually blend two videos.** Take *mechanisms*, not sentences:

- **Hook** — from whichever source opens hardest. Copy the *structure* (open loop? cold
  claim? in-progress moment?), never the words.
- **Act structure** — from whichever sustains longest. Where does it place its first payoff?
  How long until the first pattern interrupt?
- **Pacing** — count shots per minute in each and pick a target.
- **Subject, voice, examples, opinions** — always yours. This is what makes it a new video
  rather than a reupload.

If the draft could be mistaken for either source, it has not been remixed enough.

Save with `project_update(script=...)` in bracket format. The tool warns if it fails to parse.

## 4. Produce — fill the shot list

```
broll_plan_init → decide each shot → broll_plan_set
```

`broll_plan_init` parses the script into numbered shots and pre-marks the obvious ones.
You decide the rest.

### Generate or source?

| Situation | Choose |
|---|---|
| Real place, real product, recognisable person, documentary proof | **stock / real footage** |
| Abstract, atmospheric, stylised, impossible, or a metaphor | **generate** |
| Anything where a viewer would ask "is that real?" and the answer matters | **stock** |
| A UI, an app, a spreadsheet, your own work | **screen-record** |
| Talking to the viewer | **face-cam** |

AI b-roll is convincing for texture, motion, mood, scale, and the impossible. It is still
weak on: hands doing fine tasks, crowds, readable text, specific real people or places, and
anything the viewer will freeze-frame. Uncanny b-roll is worse than no b-roll — a plain
title card beats a melting hand.

Real-footage sources with licences that actually permit reuse: Pexels, Pixabay, Videvo,
archive.org public domain, NASA and other government footage, and YouTube filtered to
Creative Commons. Check each clip's licence rather than assuming.

**Using other people's footage.** Short, clearly-attributed excerpts used to comment on or
critique the original is the strongest position. Understand what actually happens in
practice: Content ID matches audio and video automatically, and a match can place ads on
your video or block it regardless of whether your use would hold up. Reaction and commentary
channels get claims constantly. Reduce exposure by keeping excerpts short, cutting the
original audio under your own voiceover, and never using a clip as decoration where any
footage would do. If a clip is doing real argumentative work, it is defensible; if it is
just filling ten seconds, generate or source it instead. This is not legal advice.

### Generating with Higgsfield

Cost discipline matters more than model choice:

1. **Still first.** Generate the frame with `generate_image` (~1–2 credits), approve the
   composition, *then* animate it as `start_image`. Animating a bad frame is how you burn
   50 credits on a shot you delete. This is the single biggest lever on the platform.
2. **Route by importance.** Bulk inserts → Kling 3.0 Turbo / Seedance 2.0 Mini / Veo 3.1
   Lite. Save Veo 3 and Seedance standard for the two or three hero shots. Veo-grade b-roll
   across a whole shot list can cost more than a month's subscription.
3. **Overgenerate.** Usable-take rates run 30–80%. Plan 2–3 attempts per shot that matters.
4. **Batch.** `generate_video_batch` + `jobs_wait` — the account runs 6–8 concurrent jobs.
   A 20-shot list is 20–40 minutes of wall clock, so fire it all at once and review together.
5. **Silence it.** B-roll lives under a voiceover. Disable generated audio; it is cheaper
   and you would mute it anyway.
6. **One clip, one idea.** Clips cap at 5–15s, which is one camera move and one beat. Do not
   write a prompt that needs a cut inside it.

Prompt shape that works: *subject → action → camera move → lighting/lens → mood*. Higgsfield's
edge is its named camera moves (dolly in, crash zoom, 360 orbit, whip pan, FPV drone,
bullet time, hyperlapse) — name the move instead of describing it in prose.

Record each finished file on its shot via `broll_plan_set` (`assetPath`, `status`).

## 5. Edit — hand it to CapCut

```
capcut_plan → run the emitted calls → open CapCut
```

`capcut_plan` converts bracket timestamps into timed CapCut calls and writes an SRT.

**Read `capcut_reference` before hand-writing any CapCut call.** Several of that server's
tool schemas are wrong or incomplete, and two omissions fail silently:

- `save_draft` needs `draft_folder`. Without it the saved draft has blank media paths and
  opens with no footage.
- `add_subtitle` throws unless `font` is passed.
- Draft ids are in-memory only — run create → save in one unbroken session.

Local file paths work everywhere CapCut asks for a `*_url`. Nothing needs uploading.

If CapCut will not open the draft, fall back to `export_project_files`: script, narration,
shot CSV, and SRT, assembled by hand. The SRT imports directly.

---

## Working notes

- **Check the library before analyzing.** Teardowns are slow and permanent; re-running one
  wastes minutes for an identical result.
- **Keep results narrow.** Discovery tools default to 25 rows. Ask for more only when
  genuinely scanning.
- **Projects are the memory.** Anything worth keeping between sessions belongs in the
  project, not in the conversation.
- **Report honestly.** If a reel would not download, a generation looks bad, or a shot has
  no asset, say so plainly. `capcut_plan` lists shots it had to skip — do not paper over them.
