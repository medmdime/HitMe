/**
 * Boots the HitMe MCP server over stdio, lists its tools, and calls a couple of
 * cheap ones. Run after changing anything under mcp/:
 *
 *   bun run mcp:smoke
 *
 * Pass tool names as args to call them with no arguments, e.g.
 *   bun run mcp:smoke library_stats
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..")

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [resolve(REPO, "node_modules/tsx/dist/cli.mjs"), resolve(REPO, "mcp/server.ts")],
  cwd: REPO,
  stderr: "pipe",
})

const client = new Client({ name: "hitme-smoke", version: "1.0.0" })

const timer = setTimeout(() => {
  console.error("TIMEOUT: server did not respond within 90s")
  process.exit(1)
}, 90_000)

await client.connect(transport)
transport.stderr?.on("data", (d) => process.stderr.write(`[server] ${d}`))

const { tools } = await client.listTools()
console.log(`\n=== ${tools.length} tools registered ===\n`)
for (const t of tools) {
  const schema = t.inputSchema as
    | { properties?: Record<string, unknown>; required?: string[] }
    | undefined
  const required = schema?.required ?? []
  const params = Object.keys(schema?.properties ?? {})
    .map((k) => (required.includes(k) ? `${k}*` : k))
    .join(", ")
  console.log(`  ${t.name.padEnd(26)} ${params || "(no params)"}`)
}

// Accepts a bare tool name, or `name={"arg":"value"}` to pass arguments.
const toCall = process.argv.slice(2)
if (toCall.length === 0) toCall.push("yt_quota")

for (const spec of toCall) {
  const eq = spec.indexOf("=")
  const name = eq === -1 ? spec : spec.slice(0, eq)
  let args: Record<string, unknown> = {}
  if (eq !== -1) {
    try {
      args = JSON.parse(spec.slice(eq + 1)) as Record<string, unknown>
    } catch (err) {
      console.error(`bad JSON args for ${name}: ${err instanceof Error ? err.message : err}`)
      continue
    }
  }
  console.log(`\n=== ${name} ${eq === -1 ? "" : JSON.stringify(args)} ===`)
  try {
    const res = await client.callTool({ name, arguments: args })
    const content = res.content as { type: string; text?: string }[]
    console.log(content.map((c) => c.text ?? `<${c.type}>`).join("\n"))
    if (res.isError) console.log("(returned isError=true)")
  } catch (err) {
    console.error(`call failed: ${err instanceof Error ? err.message : String(err)}`)
  }
}

clearTimeout(timer)
await client.close()
process.exit(0)
