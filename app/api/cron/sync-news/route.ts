import { NextResponse } from "next/server"
import { runNewsSync, verifyNewsCron } from "@/lib/news-sync"

export const dynamic = "force-dynamic"
export const maxDuration = 300

export async function GET(request: Request) {
  if (!verifyNewsCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const summary = await runNewsSync()
    return NextResponse.json(summary)
  } catch (err) {
    console.error("[cron/sync-news]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    )
  }
}
