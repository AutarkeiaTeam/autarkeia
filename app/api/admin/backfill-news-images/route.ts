import { NextResponse } from "next/server"
import { getUserId } from "@/lib/auth-server"
import { parseAcceptLanguage, translate } from "@/lib/i18n-core"
import { runNewsImageUrlBackfill } from "@/lib/news-image-backfill"
import { isAdmin } from "@/lib/profiles"

export const dynamic = "force-dynamic"
export const maxDuration = 300

function localizedError(request: Request, key: string, status: number) {
  const locale = parseAcceptLanguage(request.headers.get("accept-language"))
  return NextResponse.json({ errorKey: key, error: translate(locale, key) }, { status })
}

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) {
    return localizedError(request, "admin.news_sync.error.auth_required", 401)
  }

  if (!(await isAdmin(userId))) {
    return localizedError(request, "admin.news_sync.error.forbidden", 403)
  }

  try {
    const summary = await runNewsImageUrlBackfill()
    return NextResponse.json(summary)
  } catch (err) {
    console.error("[admin/backfill-news-images]", err)
    if (err instanceof Error) {
      return NextResponse.json(
        { errorKey: "admin.news_sync.error.sync_failed", error: err.message },
        { status: 500 }
      )
    }
    return localizedError(request, "admin.news_sync.error.sync_failed", 500)
  }
}
