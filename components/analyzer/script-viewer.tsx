"use client"

import * as React from "react"
import { parseScript } from "@/lib/parse-script"
import { cn } from "@/lib/utils"
import { RiPlayMiniLine } from "@remixicon/react"

interface Props {
  script: string
  onSeek?: (seconds: number) => void
  className?: string
}

export function ScriptViewer({ script, onSeek, className }: Props) {
  const blocks = React.useMemo(() => parseScript(script), [script])
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null)

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
    setActiveIdx(i)
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
                <span className="truncate text-xs text-muted-foreground">
                  {b.shot}
                </span>
              </div>
              {b.narration && b.narration !== "[no narration]" ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {b.narration}
                </p>
              ) : (
                <p className="text-xs italic text-muted-foreground">
                  no narration
                </p>
              )}
            </button>
          </li>
        )
      })}
    </ol>
  )
}
