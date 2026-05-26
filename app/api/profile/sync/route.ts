import { NextResponse } from "next/server"
import { upsertProfileFromAuthUser } from "@/lib/profiles"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await upsertProfileFromAuthUser(user)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("profile sync error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Profile sync failed" },
      { status: 500 }
    )
  }
}
