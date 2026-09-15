import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

const url = process.env.DATABASE_URL
if (!url) {
  // Throw at first use rather than at module load — keeps next build green
  // when env isn't present yet.
}

let _db: ReturnType<typeof drizzle> | null = null

export function db() {
  if (_db) return _db
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not set — add it to .env.local")
  }
  const sql = neon(process.env.DATABASE_URL)
  _db = drizzle(sql, { schema })
  return _db
}

export { schema }
