"use client"

import * as React from "react"

export interface YouTubePlayerHandle {
  seekTo: (seconds: number, play?: boolean) => void
}

interface Props {
  videoId: string
  className?: string
}

// Minimal typings for the bits of the IFrame Player API we use.
interface YTPlayer {
  seekTo(seconds: number, allowSeekAhead: boolean): void
  playVideo(): void
  pauseVideo(): void
  destroy(): void
}

interface YTPlayerOptions {
  videoId: string
  playerVars?: Record<string, string | number>
  events?: { onReady?: (event: { target: YTPlayer }) => void }
}

interface YTGlobal {
  Player: new (el: HTMLElement, opts: YTPlayerOptions) => YTPlayer
}

declare global {
  interface Window {
    YT?: YTGlobal
    onYouTubeIframeAPIReady?: () => void
  }
}

const SCRIPT_SRC = "https://www.youtube.com/iframe_api"
let apiReadyPromise: Promise<void> | null = null

function loadIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()
  if (window.YT?.Player) return Promise.resolve()
  if (apiReadyPromise) return apiReadyPromise

  apiReadyPromise = new Promise<void>((resolve) => {
    const existing = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      existing?.()
      resolve()
    }
    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const s = document.createElement("script")
      s.src = SCRIPT_SRC
      s.async = true
      document.head.appendChild(s)
    }
  })
  return apiReadyPromise
}

export const YouTubePlayer = React.forwardRef<YouTubePlayerHandle, Props>(
  function YouTubePlayer({ videoId, className }, ref) {
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const playerRef = React.useRef<YTPlayer | null>(null)
    const readyRef = React.useRef(false)
    const pendingSeek = React.useRef<{ s: number; play: boolean } | null>(null)

    React.useImperativeHandle(
      ref,
      () => ({
        seekTo(seconds, play = true) {
          if (playerRef.current && readyRef.current) {
            playerRef.current.seekTo(seconds, true)
            if (play) playerRef.current.playVideo()
          } else {
            pendingSeek.current = { s: seconds, play }
          }
        },
      }),
      []
    )

    React.useEffect(() => {
      let cancelled = false
      readyRef.current = false

      void loadIframeApi().then(() => {
        if (cancelled || !containerRef.current || !window.YT) return
        // Tear down a previous instance (e.g., videoId changed)
        if (playerRef.current) {
          try {
            playerRef.current.destroy()
          } catch {
            // ignore
          }
          playerRef.current = null
        }
        // Recreate a fresh mount target — destroy() removes the iframe.
        const mount = document.createElement("div")
        containerRef.current.innerHTML = ""
        containerRef.current.appendChild(mount)

        playerRef.current = new window.YT.Player(mount, {
          videoId,
          playerVars: {
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady({ target }) {
              if (cancelled) return
              readyRef.current = true
              if (pendingSeek.current) {
                target.seekTo(pendingSeek.current.s, true)
                if (pendingSeek.current.play) target.playVideo()
                pendingSeek.current = null
              }
            },
          },
        })
      })

      return () => {
        cancelled = true
        if (playerRef.current) {
          try {
            playerRef.current.destroy()
          } catch {
            // ignore
          }
          playerRef.current = null
        }
      }
    }, [videoId])

    return (
      <div className={className}>
        <div
          ref={containerRef}
          className="aspect-video w-full overflow-hidden rounded-3xl bg-black [&>iframe]:h-full [&>iframe]:w-full"
        />
      </div>
    )
  }
)
