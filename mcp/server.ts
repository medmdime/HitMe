#!/usr/bin/env node
/**
 * HitMe MCP server.
 *
 * Exposes the YouTube research, video teardown, clip transcription, saved-work
 * library, and video-project tooling over stdio so an assistant can run the
 * whole "study what worked -> write my version -> plan the edit" loop.
 *
 * stdout belongs to the JSON-RPC protocol. Every diagnostic goes to stderr.
 */
import "./env"

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerYouTubeTools } from "./tools/youtube"
import { registerAnalyzeTools } from "./tools/analyze"
import { registerLibraryTools } from "./tools/library"
import { registerProjectTools } from "./tools/project"
import { registerCapCutTools } from "./tools/capcut"
import { registerTikTokTools } from "./tools/tiktok"
import { hasEnv } from "./env"

const server = new McpServer(
  { name: "hitme", version: "0.1.0" },
  {
    instructions: [
      "HitMe turns videos that already worked into your next script.",
      "",
      "The loop:",
      "1. RESEARCH — yt_small_breakouts / yt_keyword_outliers / yt_channel_outliers to find videos that beat",
      "   their own channel's median. Outlier score, not raw views, is what makes a lesson replicable.",
      "   For TikTok use tiktok_account_outliers. It needs a named account — TikTok has no free hashtag,",
      "   keyword, or trending search, so platform-wide browsing is not possible there.",
      "2. STUDY — analyze_youtube_video for long-form, transcribe_clip for Instagram reels and TikToks.",
      "   Both return a timestamped bracket script plus a teardown, and both cache to the shared database.",
      "3. REMIX — project_create with the references, project_compare_sources to read them beat by beat,",
      "   then write your own script and save it with project_update.",
      "4. PRODUCE — broll_plan_init to turn the script into a shot list, decide each shot's source,",
      "   broll_plan_set to save. Generate AI b-roll with the Higgsfield tools, then capcut_plan for the edit.",
      "",
      "Check library_list before analyzing anything: the teardown may already exist.",
    ].join("\n"),
  }
)

registerYouTubeTools(server)
registerAnalyzeTools(server)
registerLibraryTools(server)
registerProjectTools(server)
registerCapCutTools(server)
registerTikTokTools(server)

function warnMissingConfig() {
  const missing: string[] = []
  if (!hasEnv("YOUTUBE_API_KEY_1")) missing.push("YOUTUBE_API_KEY_1 (YouTube research tools)")
  if (!hasEnv("GEMINI_API_KEY")) missing.push("GEMINI_API_KEY (video analysis)")
  if (!hasEnv("DATABASE_URL")) missing.push("DATABASE_URL (library + projects)")
  if (missing.length) {
    process.stderr.write(
      `[hitme] Not configured, some tools will fail:\n${missing.map((m) => `  - ${m}`).join("\n")}\n`
    )
  }
}

async function main() {
  warnMissingConfig()
  const transport = new StdioServerTransport()
  await server.connect(transport)
  process.stderr.write("[hitme] MCP server ready\n")
}

main().catch((err) => {
  process.stderr.write(`[hitme] fatal: ${err instanceof Error ? err.stack : String(err)}\n`)
  process.exit(1)
})
