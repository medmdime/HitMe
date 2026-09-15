"use client"

import * as React from "react"
import {
  listRecent,
  migrateLegacyLocalStorage,
  subscribeRecent,
  type RecentAnalysis,
} from "./recent-analyses"

interface State {
  entries: RecentAnalysis[]
  loading: boolean
  error: string | null
}

const initial: State = { entries: [], loading: true, error: null }

export function useRecentAnalyses(): State {
  const [state, setState] = React.useState<State>(initial)

  const refresh = React.useCallback(async () => {
    try {
      const entries = await listRecent()
      setState({ entries, loading: false, error: null })
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e.message : String(e),
      }))
    }
  }, [])

  React.useEffect(() => {
    let cancelled = false
    void (async () => {
      // First: migrate any old localStorage entries, then fetch fresh list.
      try {
        await migrateLegacyLocalStorage()
      } catch {
        // not fatal
      }
      if (cancelled) return
      await refresh()
    })()
    const unsub = subscribeRecent(() => {
      void refresh()
    })
    return () => {
      cancelled = true
      unsub()
    }
  }, [refresh])

  return state
}
