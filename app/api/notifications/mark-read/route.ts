import { NextResponse } from "next/server"
import { z } from "zod"
import { markRead } from "@/lib/notifications"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

const bodySchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "account.validation.unauthorized" }, { status: 401 })
    }

    const json = await request.json().catch(() => null)
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "notifications.error.invalid_request" }, { status: 400 })
    }

    const admin = createAdminClient()
    const updated = await markRead(admin, parsed.data.ids, user.id)
    return NextResponse.json({ ok: true, updated })
  } catch (err) {
    console.error("POST /api/notifications/mark-read error:", err)
    return NextResponse.json({ error: "notifications.error.update_failed" }, { status: 500 })
  }
}
