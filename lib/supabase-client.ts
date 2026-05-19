const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function getStoredAccessToken() {
  if (typeof window === "undefined") return null

  const directToken = window.localStorage.getItem("supabase.auth.token")
  if (directToken) return directToken

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (!key?.startsWith("sb-") || !key.endsWith("-auth-token")) continue

    const raw = window.localStorage.getItem(key)
    if (!raw) continue

    try {
      const parsed = JSON.parse(raw) as { access_token?: string; currentSession?: { access_token?: string } }
      const token = parsed.access_token ?? parsed.currentSession?.access_token
      if (token) return token
    } catch {
      // Ignore malformed storage entries and keep looking.
    }
  }

  return null
}

function readCookie(name: string) {
  if (typeof document === "undefined") return null
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))
  const value = match?.split("=")[1]
  if (!value) return null
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function decodeJwtPayload(token: string) {
  try {
    const payload = token.split(".")[1]
    if (!payload) return null
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/")
    const decoded = window.atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="))
    return JSON.parse(decoded) as {
      sub?: string
      email?: string
      user_metadata?: Record<string, unknown>
      app_metadata?: Record<string, unknown>
    }
  } catch {
    return null
  }
}

function storeAccessTokenFromUrl() {
  if (typeof window === "undefined") return null

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""))
  const queryParams = new URLSearchParams(window.location.search)
  const accessToken = hashParams.get("access_token") ?? queryParams.get("access_token")
  if (!accessToken) return null

  window.localStorage.setItem("supabase.auth.token", accessToken)
  return accessToken
}

function ensureConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }
}

function clearStoredAuth() {
  if (typeof window === "undefined") return

  window.localStorage.removeItem("supabase.auth.token")
  for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
    const key = window.localStorage.key(index)
    if (key?.startsWith("sb-") && key.endsWith("-auth-token")) {
      window.localStorage.removeItem(key)
    }
  }
}

export const supabaseClient = {
  auth: {
    user() {
      if (typeof window === "undefined") return null

      const accessToken = getStoredAccessToken()
      const tokenPayload = accessToken ? decodeJwtPayload(accessToken) : null
      const cookieUser = readCookie("autarkeia-user")
      const tier = readCookie("autarkeia-tier")
      const userId = tokenPayload?.sub ?? cookieUser

      if (!userId) return null

      return {
        id: userId,
        email: tokenPayload?.email ?? (cookieUser?.includes("@") ? cookieUser : undefined),
        user_metadata: {
          ...(tokenPayload?.user_metadata || {}),
          ...(tier ? { tier } : {}),
        },
        app_metadata: tokenPayload?.app_metadata || {},
      }
    },
    admin: {
      async deleteUser(userId: string): Promise<{ error: Error | null }> {
        try {
          const response = await fetch("/api/delete-account", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          })

          const data = await response.json().catch(() => null)
          if (!response.ok) {
            return { error: new Error(data?.error || "Account deletion failed") }
          }

          return { error: null }
        } catch (err) {
          return { error: err instanceof Error ? err : new Error("Account deletion failed") }
        }
      },
    },
    async resetPasswordForEmail(email: string): Promise<{ error: Error | null }> {
      try {
        ensureConfig()
        const redirectTo =
          typeof window !== "undefined"
            ? `${window.location.origin}/reset-password`
            : `${process.env.NEXT_PUBLIC_SITE_URL || "https://autarkeia.world"}/reset-password`

        const response = await fetch(`${supabaseUrl}/auth/v1/recover`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseAnonKey!,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ email, redirect_to: redirectTo }),
        })

        const data = await response.json().catch(() => null)
        if (!response.ok) {
          return { error: new Error(data?.msg || data?.error_description || data?.error || "Password reset failed") }
        }

        return { error: null }
      } catch (err) {
        return { error: err instanceof Error ? err : new Error("Password reset failed") }
      }
    },
    async updateUser({ password }: { password: string }): Promise<{ error: Error | null }> {
      try {
        ensureConfig()
        const accessToken = storeAccessTokenFromUrl() ?? getStoredAccessToken()
        if (!accessToken) {
          return { error: new Error("Password reset session is missing or expired. Please request a new reset link.") }
        }

        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseAnonKey!,
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ password }),
        })

        const data = await response.json().catch(() => null)
        if (!response.ok) {
          return { error: new Error(data?.msg || data?.error_description || data?.error || "Password update failed") }
        }

        return { error: null }
      } catch (err) {
        return { error: err instanceof Error ? err : new Error("Password update failed") }
      }
    },
    async signOut() {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const { error } = await supabase.auth.signOut()
        if (error) throw error
      } catch {
        const accessToken = getStoredAccessToken()
        if (supabaseUrl && supabaseAnonKey && accessToken) {
          const response = await fetch(`${supabaseUrl}/auth/v1/logout`, {
            method: "POST",
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${accessToken}`,
            },
          })

          if (!response.ok) {
            const data = await response.json().catch(() => null)
            throw new Error(data?.msg || data?.error_description || data?.error || "Sign out failed")
          }
        }
      }

      clearStoredAuth()
    },
  },
}
