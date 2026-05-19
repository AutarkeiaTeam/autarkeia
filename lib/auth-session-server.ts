import type { NextResponse } from "next/server"

const SESSION_MAX_AGE = 60 * 60 * 24 * 30

type SessionUser = {
  id: string
  email?: string | null
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}

export function applyAutarkeiaSessionCookies(response: NextResponse, user: SessionUser) {
  const tier =
    user.user_metadata?.tier === "pro" || user.app_metadata?.tier === "pro" ? "pro" : "free"

  response.cookies.set("autarkeia-user", encodeURIComponent(user.id), {
    path: "/",
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax",
  })

  if (user.email) {
    response.cookies.set("autarkeia-email", encodeURIComponent(user.email), {
      path: "/",
      maxAge: SESSION_MAX_AGE,
      sameSite: "lax",
    })
  }

  response.cookies.set("autarkeia-tier", tier, {
    path: "/",
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax",
  })

  return response
}
