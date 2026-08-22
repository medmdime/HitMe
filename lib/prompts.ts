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

/**
 * Short-form is a different animal: 7-90 seconds, cuts every 1-3 seconds, and
 * the first second decides everything. Asking for the long-form granularity
 * here produces a script with two brackets and no usable structure.
 */
export const SHORT_FORM_PROMPT = `You are reverse-engineering a short-form vertical video (Instagram Reel, TikTok, or YouTube Short) to extract its script in a specific bracket format.

Watch it carefully and produce a complete, timestamped script in EXACTLY this format:

[MM:SS — Face camera frame]
narration text exactly as spoken

[MM:SS — Broll of <description of what is on screen>]
narration text exactly as spoken

${BRACKET_FORMAT_RULES}
- Short-form cuts fast. Start a NEW bracket on every visual change, even if it is only 1-2 seconds long. A 30-second reel typically yields 10-20 brackets, not 3.
- Break the first 3 seconds down beat by beat — that is the whole ballgame in short-form.
- Transcribe on-screen text separately from spoken narration. Short-form often carries its real message in burned-in captions, hook text, and lower thirds, not in the audio.
- If there is no speech at all (music-only with text overlays), still produce the brackets and use the text overlays as the content.
- Do NOT add commentary. Output ONLY the bracket-format script.

After the script, append a section starting with:

---SCRIPT ANALYSIS---

Then provide a tight (under 300 words) analysis covering:
- The hook: exactly what happens in second 0-3, and why a thumb stops.
- Loop / retention structure: open loops, pattern interrupts, the payoff moment.
- Pacing: cuts per second, where it accelerates.
- On-screen text strategy: how captions carry the message.
- The call to action or ending beat, and how it drives a rewatch, save, or comment.
- One sentence on the single transferable idea a creator could steal.`

/** Splits the model output into the script half and the teardown half. */
export function splitScriptAndAnalysis(text: string): {
  script: string
  analysis: string
} {
  const marker = "---SCRIPT ANALYSIS---"
  const idx = text.indexOf(marker)
  if (idx === -1) return { script: text.trim(), analysis: "" }
  return {
    script: text.slice(0, idx).trim(),
    analysis: text.slice(idx + marker.length).trim(),
  }
}
