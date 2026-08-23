import { existsSync, statSync } from "node:fs"
import { open } from "node:fs/promises"
import { extname, resolve, sep } from "node:path"
import { workspaceDir } from "@/lib/workspace"

export const runtime = "nodejs"

const MIME: Record<string, string> = {
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".wav": "audio/wav",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
}

const CHUNK = 256 * 1024

/**
 * A pull-based byte stream over one slice of a file.
 *
 * Browsers open a range request per <video preload="metadata"> and abort it as
 * soon as they have the header. A push-based bridge (Readable.toWeb) keeps
 * enqueueing into the closed controller and throws an uncaught exception per
 * abort. Pulling means nothing is read until asked, and cancel simply closes
 * the handle.
 */
async function fileSlice(path: string, start: number, endInclusive: number): Promise<ReadableStream<Uint8Array>> {
  const fh = await open(path, "r")
  let pos = start
  const endExclusive = endInclusive + 1
  let closed = false
  const close = async () => {
    if (closed) return
    closed = true
    await fh.close().catch(() => {})
  }
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (pos >= endExclusive) {
        controller.close()
        await close()
        return
      }
      const len = Math.min(CHUNK, endExclusive - pos)
      const buf = Buffer.allocUnsafe(len)
      const { bytesRead } = await fh.read(buf, 0, len, pos)
      if (bytesRead === 0) {
        controller.close()
        await close()
        return
      }
      pos += bytesRead
      controller.enqueue(new Uint8Array(buf.buffer, buf.byteOffset, bytesRead))
    },
    async cancel() {
      await close()
    },
  })
}

/**
 * Streams a file from inside .hitme/ so the page can play the downloaded
 * source and the cut segments. Anything outside the workspace is refused —
 * this is the only path-based read in the app, so the check is strict.
 */
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("path")
  if (!raw) return new Response("path required", { status: 400 })

  const root = resolve(workspaceDir())
  const target = resolve(raw)
  if (target !== root && !target.startsWith(root + sep)) {
    return new Response("forbidden", { status: 403 })
  }
  if (!existsSync(target) || !statSync(target).isFile()) {
    return new Response("not found", { status: 404 })
  }

  const size = statSync(target).size
  const type = MIME[extname(target).toLowerCase()] ?? "application/octet-stream"
  const common = {
    "Content-Type": type,
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=3600",
  }

  // Range support so <video> can seek and <audio> can scrub.
  const range = req.headers.get("range")
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range)
    const start = m && m[1] ? Number(m[1]) : 0
    const end = m && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1
    if (start >= size || start > end) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } })
    }
    return new Response(await fileSlice(target, start, end), {
      status: 206,
      headers: {
        ...common,
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${size}`,
      },
    })
  }

  return new Response(await fileSlice(target, 0, size - 1), {
    headers: { ...common, "Content-Length": String(size) },
  })
}
