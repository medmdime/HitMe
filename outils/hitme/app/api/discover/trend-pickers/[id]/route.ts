import { NextResponse } from "next/server"
import { getSavedSearch } from "@/lib/trend-pickers"

export const runtime = "nodejs"

/** One saved search with its picks. Reads the disk only: nothing is billed. */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const search = getSavedSearch(id)
  if (!search) {
    return NextResponse.json({ error: `No saved search "${id}".` }, { status: 404 })
  }
  return NextResponse.json(search)
}
