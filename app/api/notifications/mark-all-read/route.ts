import { NextResponse } from "next/server"
import { markAllRead } from "@/lib/notifications"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "account.validation.unauthorized" }, { status: 401 })
    }

    const admin = createAdminClient()
    const updated = await markAllRead(admin, user.id)
    return NextResponse.json({ ok: true, updated })
  } catch (err) {
    console.error("POST /api/notifications/mark-all-read error:", err)
    return NextResponse.json({ error: "notifications.error.update_failed" }, { status: 500 })
  }
}
