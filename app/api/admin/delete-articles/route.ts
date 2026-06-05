import { NextResponse } from "next/server"
import { getUserId } from "@/lib/auth-server"
import { parseAcceptLanguage, translate } from "@/lib/i18n-core"
import { deleteNewsArticles } from "@/lib/news-delete-articles"
import { isAdmin } from "@/lib/profiles"

export const dynamic = "force-dynamic"

const RBI_DUPLICATE_TITLES = [
  "RBI lowers India's FY27 GDP forecast to 6.6%, inflation seen rising to 5.1% amid oil shock",
  "India's RBI projects 5.1% inflation for FY27 amid high global crude prices",
  "RBI forecasts 6.6% GDP growth for FY27, inflation at 5.1% amid global disruptions",
  "India's central bank cuts growth outlook, raises inflation forecast while holding rates at 5.25%",
]

function localizedError(request: Request, key: string, status: number) {
  const locale = parseAcceptLanguage(request.headers.get("accept-language"))
  return NextResponse.json({ errorKey: key, error: translate(locale, key) }, { status })
}

export async function GET(request: Request) {
  const userId = await getUserId()
  if (!userId) {
    return localizedError(request, "admin.news_sync.error.auth_required", 401)
  }

  if (!(await isAdmin(userId))) {
    return localizedError(request, "admin.news_sync.error.forbidden", 403)
  }

  try {
    const result = await deleteNewsArticles({ titles: RBI_DUPLICATE_TITLES })
    return NextResponse.json(result)
  } catch (err) {
    console.error("[admin/delete-articles]", err)
    if (err instanceof Error) {
      return NextResponse.json(
        { errorKey: "admin.news_sync.error.sync_failed", error: err.message },
        { status: 500 }
      )
    }
    return localizedError(request, "admin.news_sync.error.sync_failed", 500)
  }
}
