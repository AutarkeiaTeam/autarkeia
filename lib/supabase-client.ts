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
    async signOut() {
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

      clearStoredAuth()
    },
  },
}
