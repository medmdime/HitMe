import { NextResponse } from "next/server"
import { getQuotaStatus } from "@/lib/youtube-data"

export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json({
    quota: getQuotaStatus(),
    daily_quota_per_project: 10000,
    refreshed_at: new Date().toISOString(),
  })
}
