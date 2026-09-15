"use client"

import * as React from "react"
import { collectAnnotations } from "@/lib/parse-script"
import { TeardownMarkdown } from "@/components/analyzer/teardown-markdown"
import type { ClipView } from "./types"
import { RiMusic2Line, RiVolumeUpLine, RiInformationLine } from "@remixicon/react"

/**
 * The audio layer on its own: what the platform says the sound is, every
 * music change, and every sound effect with the shot it lands on. Clicking a
 * timestamp seeks the player.
 */
export function AudioPanel({ clip, onSeek }: { clip: ClipView; onSeek?: (sec: number) => void }) {
  const music = React.useMemo(() => collectAnnotations(clip.blocks, "MUSIC"), [clip.blocks])
  const sfx = React.useMemo(() => collectAnnotations(clip.blocks, "SFX"), [clip.blocks])
  const audioSection = React.useMemo(() => extractSection(clip.analysis, "Audio"), [clip.analysis])

  return (
    <div className="space-y-5 text-sm">
      <section className="rounded-2xl border p-4">
        <h3 className="mb-2 flex items-center gap-2 font-semibold">
          <RiMusic2Line className="size-4" />
          Sound
        </h3>
        {clip.sound ? (
          <p>
            The platform lists this post&apos;s sound as{" "}
            <span className="font-medium">{clip.sound.track}</span>
            {clip.sound.artist ? <> — {clip.sound.artist}</> : null}.
            {/^(suara asli|original sound|son original|sonido original|originalton)/i.test(clip.sound.track) && (
              <span className="text-muted-foreground">
                {" "}
                That is an original sound — audio the creator uploaded with the video, not a licensed track.
              </span>
            )}
          </p>
        ) : clip.platform === "instagram" ? (
          <p className="flex items-start gap-2 text-muted-foreground">
            <RiInformationLine className="mt-0.5 size-4 shrink-0" />
            Instagram does not expose the sound name to logged-out readers, so the music below is
            described by ear. To name the track, cut the segments and run the audio file through a
            music-recognition app.
          </p>
        ) : (
          <p className="text-muted-foreground">No sound metadata from the platform.</p>
        )}
        {audioSection && (
          <div className="mt-3 rounded-xl bg-muted/40 p-3">
            <TeardownMarkdown text={audioSection} />
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-2 font-semibold">Music changes ({music.length})</h3>
        {music.length === 0 ? (
          <p className="text-muted-foreground">None annotated.</p>
        ) : (
          <ul className="space-y-1">
            {music.map((m, i) => (
              <li key={i}>
                <TimeButton ts={m.timestamp} sec={m.start_sec} onSeek={onSeek} /> {m.value}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="mb-2 flex items-center gap-2 font-semibold">
          <RiVolumeUpLine className="size-4" />
          Sound effects ({sfx.length})
        </h3>
        {sfx.length === 0 ? (
          <p className="text-muted-foreground">None annotated.</p>
        ) : (
          <ul className="space-y-1.5">
            {sfx.map((s, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                <TimeButton ts={s.timestamp} sec={s.start_sec} onSeek={onSeek} />
                <span>{s.value}</span>
                <span className="text-xs text-muted-foreground">during: {s.shot}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function TimeButton({ ts, sec, onSeek }: { ts: string; sec: number; onSeek?: (s: number) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSeek?.(sec)}
      className="rounded-full bg-background px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground ring-1 ring-border hover:text-foreground"
      title={`Seek to ${ts}`}
    >
      {ts}
    </button>
  )
}

/** Pulls one `## Heading` section out of the teardown markdown. */
function extractSection(markdown: string, heading: string): string | null {
  const lines = markdown.split(/\r?\n/)
  const start = lines.findIndex((l) => new RegExp(`^##\\s+${heading}\\b`, "i").test(l))
  if (start === -1) return null
  const body: string[] = []
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) break
    body.push(lines[i])
  }
  const text = body.join("\n").trim()
  return text || null
}
