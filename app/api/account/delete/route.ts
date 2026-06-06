import { NextResponse } from "next/server"
import { deleteUserAccount } from "@/lib/delete-account"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 })
    }

    await deleteUserAccount(user.id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Account deletion failed"
    console.error("[account/delete]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
