import { NextResponse } from "next/server"
import { getUserId } from "@/lib/auth-server"
import { runMarketplaceSync } from "@/lib/marketplace-sync"
import { isAdmin } from "@/lib/profiles"

export const dynamic = "force-dynamic"
export const maxDuration = 300

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  if (!(await isAdmin(userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: { advertiserIds?: number[] } = {}
  try {
    body = await request.json()
  } catch {
    // empty body is fine
  }

  try {
    const summary = await runMarketplaceSync({
      advertiserIds: body.advertiserIds,
    })
    return NextResponse.json(summary)
  } catch (err) {
    console.error("[admin/sync-marketplace-now]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    )
  }
}
