import { NextResponse } from "next/server"
import { getUserId } from "@/lib/auth-server"
import { parseAcceptLanguage, translate } from "@/lib/i18n-core"
import { getAwinMarketplaceProductStats } from "@/lib/marketplace-db"
import { runMarketplaceSync } from "@/lib/marketplace-sync"
import { isAdmin } from "@/lib/profiles"

export const dynamic = "force-dynamic"
export const maxDuration = 300

function localizedError(request: Request, key: string, status: number) {
  const locale = parseAcceptLanguage(request.headers.get("accept-language"))
  return NextResponse.json({ errorKey: key, error: translate(locale, key) }, { status })
}

export async function GET(request: Request) {
  const userId = await getUserId()
  if (!userId) {
    return localizedError(request, "admin.marketplace_sync.error.auth_required", 401)
  }
  if (!(await isAdmin(userId))) {
    return localizedError(request, "admin.marketplace_sync.error.forbidden", 403)
  }

  const stats = await getAwinMarketplaceProductStats()
  const byAdvertiser = new Map<string, number>()
  for (const row of stats) {
    byAdvertiser.set(row.advertiser_name, (byAdvertiser.get(row.advertiser_name) ?? 0) + row.count)
  }

  return NextResponse.json({
    total: stats.reduce((n, r) => n + r.count, 0),
    byAdvertiser: Object.fromEntries(byAdvertiser),
    byAdvertiserAndCategory: stats,
  })
}

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) {
    return localizedError(request, "admin.marketplace_sync.error.auth_required", 401)
  }

  if (!(await isAdmin(userId))) {
    return localizedError(request, "admin.marketplace_sync.error.forbidden", 403)
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
    if (err instanceof Error) {
      return NextResponse.json({ errorKey: "admin.marketplace_sync.error.sync_failed", error: err.message }, { status: 500 })
    }
    return localizedError(request, "admin.marketplace_sync.error.sync_failed", 500)
  }
}
