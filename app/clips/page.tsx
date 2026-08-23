import { Suspense } from "react"
import { ClipsWorkspace } from "@/components/clips/clips-workspace"

export default function ClipsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}>
      <ClipsWorkspace />
    </Suspense>
  )
}
