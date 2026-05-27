import { NextResponse } from "next/server"
import { runMarketplaceSync, verifyCronSecret } from "@/lib/marketplace-sync"

export const dynamic = "force-dynamic"
export const maxDuration = 300

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const summary = await runMarketplaceSync()
    return NextResponse.json(summary)
  } catch (err) {
    console.error("[cron/sync-marketplace]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    )
  }
}
