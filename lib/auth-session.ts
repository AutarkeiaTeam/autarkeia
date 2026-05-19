const SESSION_MAX_AGE = 60 * 60 * 24 * 30

type SessionUser = {
  id: string
  email?: string | null
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}

export function setAutarkeiaSessionCookies(user: SessionUser) {
  if (typeof document === "undefined") return

  const tier =
    user.user_metadata?.tier === "pro" || user.app_metadata?.tier === "pro" ? "pro" : "free"

  document.cookie = `autarkeia-user=${encodeURIComponent(user.id)}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`
  if (user.email) {
    document.cookie = `autarkeia-email=${encodeURIComponent(user.email)}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`
  }
  document.cookie = `autarkeia-tier=${tier}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`
  window.dispatchEvent(new Event("autarkeia-auth-change"))
}
