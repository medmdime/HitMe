"use client"

import * as React from "react"
import { parseScript, type Annotation } from "@/lib/parse-script"
import { cn } from "@/lib/utils"
import {
  RiPlayMiniLine,
  RiText,
  RiVolumeUpLine,
  RiMusic2Line,
  RiCameraLine,
  RiMagicLine,
} from "@remixicon/react"

interface Props {
  script: string
  onSeek?: (seconds: number) => void
  className?: string
  /** Highlights the block containing this time, e.g. from a playing video. */
  currentTime?: number
}

const ANNOTATION_STYLE: Record<
  Annotation["kind"],
  { icon: React.ComponentType<{ className?: string }>; className: string; label: string }
> = {
  TEXT: { icon: RiText, className: "bg-sky-500/10 text-sky-600 dark:text-sky-400", label: "text" },
  SFX: { icon: RiVolumeUpLine, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400", label: "sfx" },
  MUSIC: { icon: RiMusic2Line, className: "bg-violet-500/10 text-violet-600 dark:text-violet-400", label: "music" },
  CAM: { icon: RiCameraLine, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", label: "cam" },
  FX: { icon: RiMagicLine, className: "bg-rose-500/10 text-rose-600 dark:text-rose-400", label: "fx" },
}

export function ScriptViewer({ script, onSeek, className, currentTime }: Props) {
  const blocks = React.useMemo(() => parseScript(script), [script])
  const [clickedIdx, setClickedIdx] = React.useState<number | null>(null)

  // When a player reports time, the active block follows it.
  const playingIdx = React.useMemo(() => {
    if (currentTime === undefined) return null
    let idx: number | null = null
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].start_sec <= currentTime) idx = i
      else break
    }
    return idx
  }, [blocks, currentTime])

  const activeIdx = playingIdx ?? clickedIdx

  if (blocks.length === 0) {
    return (
      <pre
        className={cn(
          "rounded-2xl bg-muted/30 p-3 font-mono text-xs whitespace-pre-wrap",
          className
        )}
      >
        {script || "No script returned."}
      </pre>
    )
  }

  function handleClick(i: number) {
    setClickedIdx(i)
    onSeek?.(blocks[i].start_sec)
  }

  return (
    <ol className={cn("flex flex-col gap-2", className)}>
      {blocks.map((b, i) => {
        const active = activeIdx === i
        return (
          <li key={`${b.timestamp}-${i}`}>
            <button
              type="button"
              onClick={() => handleClick(i)}
              className={cn(
                "group/block w-full rounded-2xl border border-transparent bg-muted/30 p-3 text-left transition-all",
                "hover:border-border hover:bg-muted/60",
                active && "border-primary/40 bg-primary/5"
              )}
              title={`Seek to ${b.timestamp}`}
            >
              <div className="mb-1 flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full bg-background px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground ring-1 ring-border transition-colors group-hover/block:text-foreground",
                    active && "text-primary ring-primary/30"
                  )}
                >
                  <RiPlayMiniLine className="size-3" />
                  {b.timestamp}
                </span>
                <span className="truncate text-xs text-muted-foreground">{b.shot}</span>
              </div>
              {b.narration && b.narration !== "[no narration]" ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{b.narration}</p>
              ) : (
                <p className="text-xs italic text-muted-foreground">no narration</p>
              )}
              {b.annotations.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1">
                  {b.annotations.map((a, j) => {
                    const style = ANNOTATION_STYLE[a.kind]
                    const Icon = style.icon
                    return (
                      <li
                        key={j}
                        className={cn(
                          "flex items-start gap-1.5 rounded-lg px-2 py-1 text-xs leading-snug",
                          style.className
                        )}
                      >
                        <Icon className="mt-0.5 size-3.5 shrink-0" />
                        <span className="min-w-0 break-words">
                          <span className="font-semibold uppercase tracking-wide">{style.label}</span>{" "}
                          <span className="text-foreground/80">{a.value}</span>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </button>
          </li>
        )
      })}
    </ol>
  )
}
