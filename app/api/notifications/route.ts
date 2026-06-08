import { NextRequest, NextResponse } from "next/server"
import { getNotifications, isNotificationType, type NotificationFilter } from "@/lib/notifications"
import { enrichNotifications } from "@/lib/notification-enrich"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

function parseFilter(value: string | null): NotificationFilter {
  if (value === "unread") return "unread"
  if (value && isNotificationType(value)) return value
  return "all"
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "account.validation.unauthorized" }, { status: 401 })
    }

    const params = request.nextUrl.searchParams
    const limit = Math.min(Math.max(parseInt(params.get("limit") ?? "20", 10) || 20, 1), 50)
    const offset = Math.max(parseInt(params.get("offset") ?? "0", 10) || 0, 0)
    const filter = parseFilter(params.get("filter"))

    const admin = createAdminClient()
    const rows = await getNotifications(admin, user.id, { limit, offset, filter })
    const notifications = await enrichNotifications(rows)

    return NextResponse.json({ notifications, limit, offset, filter })
  } catch (err) {
    console.error("GET /api/notifications error:", err)
    return NextResponse.json({ error: "notifications.error.load_failed" }, { status: 500 })
  }
}
