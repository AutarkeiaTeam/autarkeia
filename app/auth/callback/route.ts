import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { applyAutarkeiaSessionCookies } from "@/lib/auth-session-server"
import { getLocale } from "@/lib/i18n-server"
import { upsertProfileFromAuthUser } from "@/lib/profiles"
import { maybeSendWelcomeEmail } from "@/lib/welcome-email"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const errorDescription = searchParams.get("error_description") ?? searchParams.get("error")

  if (errorDescription) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription)}`)
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Missing auth code")}`
    )
  }

  const cookieStore = await cookies()
  const response = NextResponse.redirect(`${origin}/dashboard`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: "pkce",
      },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Could not load user session")}`
    )
  }

  applyAutarkeiaSessionCookies(response, user)

  try {
    await upsertProfileFromAuthUser(user)
  } catch (syncError) {
    console.error("profile upsert from auth callback failed:", syncError)
  }

  try {
    const locale = await getLocale()
    await maybeSendWelcomeEmail(user, locale)
  } catch (welcomeError) {
    console.error("welcome email from auth callback failed:", welcomeError)
  }

  return response
}
