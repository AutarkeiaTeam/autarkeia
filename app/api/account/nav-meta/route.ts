import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ username: null, profilePublic: false })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username, profile_public")
      .eq("id", user.id)
      .maybeSingle()

    return NextResponse.json({
      username: profile?.username ?? null,
      profilePublic: profile?.profile_public === true,
    })
  } catch (err) {
    console.error("account nav-meta error:", err)
    return NextResponse.json({ username: null, profilePublic: false })
  }
}
