import { defineConfig } from "drizzle-kit"
import { config } from "dotenv"

// drizzle-kit doesn't auto-load .env.local — do it explicitly.
config({ path: ".env.local" })
config({ path: ".env" })

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set — add it to .env.local")
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
})
