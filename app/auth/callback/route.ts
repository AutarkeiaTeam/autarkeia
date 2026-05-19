import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const SESSION_MAX_AGE = 60 * 60 * 24 * 30

function applyAutarkeiaCookies(
  response: NextResponse,
  userId: string,
  tier: "free" | "pro" = "free"
) {
  response.cookies.set("autarkeia-user", encodeURIComponent(userId), {
    path: "/",
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax",
  })
  response.cookies.set("autarkeia-tier", tier, {
    path: "/",
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax",
  })
  return response
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const errorDescription = searchParams.get("error_description")

  if (errorDescription) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription)}`
    )
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Missing auth code")}`)
  }

  const cookieStore = await cookies()
  const response = NextResponse.redirect(`${origin}/dashboard`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Could not load user session")}`
    )
  }

  const userId = user.email ?? user.id
  const tier =
    user.user_metadata?.tier === "pro" || user.app_metadata?.tier === "pro" ? "pro" : "free"

  applyAutarkeiaCookies(response, userId, tier)

  return response
}
