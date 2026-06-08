import { NextResponse } from "next/server"
import { getUnreadCount } from "@/lib/notifications"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "account.validation.unauthorized" }, { status: 401 })
    }

    const admin = createAdminClient()
    const count = await getUnreadCount(admin, user.id)
    return NextResponse.json({ count })
  } catch (err) {
    console.error("GET /api/notifications/unread-count error:", err)
    return NextResponse.json({ error: "notifications.error.load_failed" }, { status: 500 })
  }
}
