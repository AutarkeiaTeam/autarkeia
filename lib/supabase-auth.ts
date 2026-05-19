const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function ensureConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }
}

/** OAuth must return here (PKCE ?code=), never /dashboard. */
export function getOAuthCallbackUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback`
  }
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")
  return site ? `${site}/auth/callback` : "https://autarkeia.world/auth/callback"
}

export type SignupMetadata = {
  first_name: string
  last_name: string
  age?: number
  location?: string
}

export async function signUpWithEmail(email: string, password: string, metadata?: SignupMetadata) {
  ensureConfig()
  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey!,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ email, password, data: metadata }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.msg || data.error_description || data.error || "Signup failed")
  }

  return data
}

export async function signInWithEmail(email: string, password: string) {
  ensureConfig()
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey!,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error_description || data.error || "Login failed")
  }

  return data
}

export async function signInWithGoogle() {
  const { createClient } = await import("@/lib/supabase/client")
  const supabase = createClient()
  const redirectTo = getOAuthCallbackUrl()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  })

  if (error) throw error

  if (data?.url) {
    window.location.assign(data.url)
  }
}
