import { Suspense } from "react"
import { AnalyzerWorkspace } from "@/components/analyzer/analyzer-workspace"

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}
    >
      <AnalyzerWorkspace />
    </Suspense>
  )
}
