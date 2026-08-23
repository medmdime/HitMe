/**
 * Shared analysis prompts.
 *
 * The web route and the MCP server both produce bracket-format scripts. Keeping
 * the prompt in one place means a script pulled through either path parses with
 * the same rules in lib/parse-script.ts.
 */

const BRACKET_FORMAT_RULES = `Rules:
- Use MM:SS timestamps (e.g., [00:00], [01:23], [12:45]).
- Each bracket header describes the SHOT TYPE and what is visible on screen.
  - "Face camera frame" = the host is on camera talking to the viewer.
  - "Broll of X" = b-roll, screen recording, archival footage, graphic, etc. Describe X concretely.
  - "Cutaway to X" = brief insert shot.
  - "Text overlay: \\"…\\"" = on-screen text shown.
- Below each bracket, write the narration EXACTLY as spoken in the video. If a segment has no narration (e.g., music-only b-roll), write "[no narration]".`

export const SCRIPT_PROMPT = `You are reverse-engineering a YouTube video to extract its script in a specific bracket format.

Watch the video carefully and produce a complete, timestamped script in EXACTLY this format:

[MM:SS — Face camera frame]
narration text exactly as spoken

[MM:SS — Broll of <description of what is on screen>]
narration text exactly as spoken

${BRACKET_FORMAT_RULES}
- Start a new bracket every time the shot changes OR every 15-30 seconds of continuous narration, whichever comes first.
- Capture the hook (first 5-15 seconds) with extra granularity — separate brackets for each beat.
- Do NOT add commentary, summary, or analysis. Output ONLY the bracket-format script.

After the script, append a section starting with:

---SCRIPT ANALYSIS---

Then provide a tight (under 250 words) analysis covering:
- Hook structure: what is the opening promise / curiosity gap?
- Pacing: average shot length, where it speeds up / slows down.
- Retention tactics: pattern interrupts, payoffs, callbacks.
- Packaging cues: title-to-content alignment, recurring visual motifs.
- One sentence on what a creator could steal from this format.`

export const ANALYSIS_MARKER = "---SCRIPT ANALYSIS---"
export const TEMPLATE_MARKER = "---FORMAT TEMPLATE---"

/**
 * Short-form is a different animal: 7-90 seconds, cuts every 1-3 seconds, and
 * the first second decides everything. Asking for the long-form granularity
 * here produces a script with two brackets and no usable structure.
 *
 * The output has three parts, split by markers:
 *  1. An annotated bracket script — the same header format as long-form so the
 *     parser and the CapCut timeline still work, plus per-shot annotation lines
 *     (TEXT / SFX / MUSIC / CAM / FX) that the parser lifts out of the narration.
 *  2. A structured teardown: hook, structure, full audio layer, text, edit style.
 *  3. A topic-agnostic FORMAT TEMPLATE you can pour a different subject into.
 *
 * Optional platform context (the sound name from TikTok, the caption) is
 * appended by the caller so the model can reconcile what it hears with what
 * the platform says.
 */
export const SHORT_FORM_PROMPT = `You are reverse-engineering a short-form vertical video (Instagram Reel, TikTok, or YouTube Short) so a creator can make their own video in the same format. Be exhaustive and literal. Watch AND listen to the whole clip, including the last second.

# PART 1 — ANNOTATED SCRIPT

Produce a complete, timestamped script in EXACTLY this bracket format:

[MM:SS — Face camera frame, slow punch-in]
narration text exactly as spoken
TEXT: "exact on-screen text" (position, style)
SFX: whoosh on the cut
MUSIC: beat drops here

[MM:SS — Broll of <precise description of what is on screen>]
narration text exactly as spoken
CAM: handheld push-in
FX: speed ramp to 2x

${BRACKET_FORMAT_RULES}
- Start a NEW bracket on EVERY visual change: every cut, every new b-roll clip, every zoom punch, every text card. A 30-second reel typically yields 10-25 brackets. If the same face-cam shot has a visible zoom punch, that is a new bracket.
- Timestamps to the second. Short-form lives or dies on timing, so be precise.
- Break the first 3 seconds into separate brackets for each beat, even if they are one second apart.
- Under each bracket, after the narration, add annotation lines. Each starts at the beginning of a line with one of these exact labels and a colon:
  - TEXT: every piece of on-screen text, quoted exactly, then its position and style in parentheses (e.g. centre, bold white with black stroke, yellow highlight word "FREE"). One TEXT line per overlay. Include burned-in captions if they differ from the narration (e.g. a highlighted keyword).
  - SFX: each sound effect you hear in this shot — whoosh, riser, pop, ding, click, bass hit, record scratch, vine boom, typing, notification. Name the sound and what it is synced to. If there is no SFX in a shot, omit the line.
  - MUSIC: only when something changes — music starts, drops, stops, swells, switches, or is ducked under speech.
  - CAM: camera movement or framing change — punch-in, zoom-out, whip pan, handheld, static, tracking, POV, top-down.
  - FX: edits and effects — speed ramp, jump cut, flash, shake, glitch, freeze frame, duplicate, green-screen cutout, emoji, arrow, circle highlight, meme insert, split screen.
- Narration is ONLY the spoken words, exactly as spoken, including fillers. Never put annotations inside the narration lines. If there is no speech in a shot write "[no narration]".
- If there is no speech at all in the video (music plus text), still produce one bracket per visual change with "[no narration]" and carry the content in TEXT lines.
- Do NOT add commentary in this part. Output ONLY brackets, narration, and annotation lines.

# PART 2 — TEARDOWN

After the script, write the line:

${ANALYSIS_MARKER}

Then this exact structure with these exact headings:

## Hook (0-3s)
- Spoken hook: the exact words
- Visual hook: what is on screen in the first frame and first second
- Text hook: the first on-screen text, exactly
- Hook type: one of — curiosity gap / bold claim / direct question / "if you X, stop" call-out / in-progress action / pattern interrupt / POV / listicle promise / contrarian take / result-first
- Why a thumb stops: two sentences, specific to this clip

## Structure
A numbered beat list of the whole video with timestamps: hook, setup, each payoff or point, the turn, the ending. Name every open loop and where it closes. Name the pattern interrupts.

## Audio
- Speech: on-camera voice / voiceover / both / none. Tone, pace, energy. Accent if notable.
- Music: present or not. If present — genre, mood, tempo (slow/mid/fast, estimate BPM), instrumentation, vocals or instrumental. When it starts, when it drops, whether it is ducked under speech. Does it sound like a trending/platform sound or licensed music or an original? If platform metadata names the sound, reconcile it with what you hear.
- Sound effects: a timestamped list of EVERY effect in the clip, one per line as [MM:SS] name — what it is synced to. If none, say none.
- Mix: is the voice loud and music quiet, or equal, or music-led?

## On-screen text
- Caption style: font feel (bold sans, handwritten, serif, typewriter), colour, stroke/shadow, size, position, animation (pop, typewriter, bounce, none)
- Highlighting: are keywords coloured/boxed? Which words?
- Does text match the narration word-for-word, paraphrase it, or carry different information?
- Every text card / title card listed with its timestamp.

## B-roll and visuals
- Face-cam vs b-roll ratio (rough seconds each)
- Every b-roll insert listed with timestamp, what it shows, and its likely source (filmed by the creator / stock / screen recording / meme / AI / archival / another creator's clip)
- Framing, lighting, background, wardrobe if face-cam
- Any recurring visual motif

## Edit style
- Cut rate: total cuts, average shot length, where it speeds up
- Zoom punches: how many, on what beats
- Transitions used
- Speed ramps, freeze frames, glitch, shake — where
- Overall editing grammar in one sentence (e.g. "Hormozi-style: punch-in every sentence, keyword captions, SFX on every cut")

## Ending and CTA
- The final beat, exactly what is said and shown
- Explicit CTA (follow / comment X / save / part 2 / link in bio) or implicit loop
- Does the ending loop back to the start for a rewatch?

## What to steal
Three to five bullets: the transferable mechanisms — not the subject. Each one a thing another creator could reuse tomorrow on a different topic.

# PART 3 — FORMAT TEMPLATE

Then write the line:

${TEMPLATE_MARKER}

Then a topic-agnostic blueprint of this video that a creator can fill with a DIFFERENT subject. Replace every subject-specific element with a placeholder in [square brackets]. Keep every timing, shot type, text style, sound and edit decision. Use this structure:

**Format:** one-line name for this format (e.g. "Talking-head myth-bust with keyword captions and punch-ins")
**Length:** total seconds · **Shots:** count · **Cut rate:** shots per 10s · **Speech:** VO / on-cam / none · **Music:** yes/no + mood

**Beats**
| # | Time | Shot | Audio | Text | Edit | Fill with |
|---|---|---|---|---|---|---|
| 1 | 0:00-0:02 | Face cam, punch-in | VO, music ducked | Question hook, centre, bold | SFX whoosh on cut | [your question that implies a common mistake] |
... one row per beat — merge adjacent brackets that serve the same beat, but keep every beat the viewer would notice.

**Hook formula:** the hook as a fill-in sentence, e.g. "Should you be [doing common thing]? (probably…)"
**Caption style to copy:** one line
**Audio bed to copy:** one line (mood/tempo, when it drops, SFX set)
**Keep exactly:** the list of things that must not change for the format to work
**Replace:** the list of things that are subject-specific
**Reproduction checklist:** 5-8 short imperative steps to shoot and edit this format for a new topic`

/**
 * Splits model output into its three parts. The markers are optional — a
 * long-form teardown has no template section and older rows have neither.
 */
export function splitSections(text: string): {
  script: string
  analysis: string
  template: string
} {
  const tIdx = text.indexOf(TEMPLATE_MARKER)
  const beforeTemplate = tIdx === -1 ? text : text.slice(0, tIdx)
  const template = tIdx === -1 ? "" : text.slice(tIdx + TEMPLATE_MARKER.length).trim()
  const { script, analysis } = splitScriptAndAnalysis(beforeTemplate)
  return { script, analysis, template }
}

/** Splits the model output into the script half and the teardown half. */
export function splitScriptAndAnalysis(text: string): {
  script: string
  analysis: string
} {
  const marker = ANALYSIS_MARKER
  const idx = text.indexOf(marker)
  if (idx === -1) return { script: text.trim(), analysis: "" }
  return {
    script: text.slice(0, idx).trim(),
    analysis: text.slice(idx + marker.length).trim(),
  }
}
