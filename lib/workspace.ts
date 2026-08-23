/**
 * Where downloaded clips, cut segments and exports live on disk.
 *
 * Both the MCP server and the Next dev server run with the repo as their
 * working directory, so `.hitme/` under cwd is the default. The MCP entry sets
 * HITME_WORKSPACE explicitly from its own location, so it does not depend on
 * how it was launched.
 */
import { resolve } from "node:path"

export function workspaceDir(): string {
  return process.env.HITME_WORKSPACE?.trim() || resolve(process.cwd(), ".hitme")
}

export function mediaDir(): string {
  return resolve(workspaceDir(), "media")
}

export function segmentsDir(): string {
  return resolve(workspaceDir(), "segments")
}

export function exportDir(): string {
  return resolve(workspaceDir(), "exports")
}

export function binDir(): string {
  return resolve(workspaceDir(), "bin")
}
