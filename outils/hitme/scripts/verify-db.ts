import { config } from "dotenv"
config({ path: ".env.local" })

import { countAnalyses } from "../lib/db/analyses"

;(async () => {
  const n = await countAnalyses()
  console.log(`analyses table reachable, row count = ${n}`)
})().catch((err) => {
  console.error("DB check failed:", err)
  process.exit(1)
})
