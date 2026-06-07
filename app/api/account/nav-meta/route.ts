import { NextResponse } from "next/server"
import { resolveDisplayName } from "@/lib/account"
import { initialsFromDisplayName } from "@/lib/avatar-initials"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({
        username: null,
        profilePublic: false,
        displayName: null,
        avatarUrl: null,
        initials: null,
      })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username, profile_public, display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle()

    const displayName = resolveDisplayName(profile?.display_name, user.email)
    const username = profile?.username ?? null

    return NextResponse.json({
      username,
      profilePublic: profile?.profile_public === true,
      displayName,
      avatarUrl: profile?.avatar_url ?? null,
      initials: initialsFromDisplayName(displayName, username ?? undefined),
    })
  } catch (err) {
    console.error("account nav-meta error:", err)
    return NextResponse.json({
      username: null,
      profilePublic: false,
      displayName: null,
      avatarUrl: null,
      initials: null,
    })
  }
}
