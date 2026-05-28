import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "dashboard.error.not_authenticated" }, { status: 401 })
    }

    const admin = createAdminClient()
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)

    if (deleteError) {
      return NextResponse.json({ error: "dashboard.error.delete_account_failed" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : ""
    if (message.includes("not configured")) {
      return NextResponse.json({ error: "dashboard.error.delete_not_configured" }, { status: 500 })
    }
    return NextResponse.json({ error: "dashboard.error.delete_account_failed" }, { status: 500 })
  }
}
