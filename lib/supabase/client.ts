import { createBrowserClient } from "@supabase/ssr"

function parseDocumentCookies() {
  if (typeof document === "undefined") return []

  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const separator = part.indexOf("=")
      if (separator === -1) return { name: part, value: "" }
      const name = part.slice(0, separator)
      const value = part.slice(separator + 1)
      try {
        return { name, value: decodeURIComponent(value) }
      } catch {
        return { name, value }
      }
    })
}

function writeDocumentCookie(
  name: string,
  value: string,
  options?: {
    path?: string
    maxAge?: number
    domain?: string
    sameSite?: "lax" | "strict" | "none"
    secure?: boolean
  }
) {
  const segments = [`${name}=${encodeURIComponent(value)}`]
  segments.push(`Path=${options?.path ?? "/"}`)
  if (options?.maxAge !== undefined) segments.push(`Max-Age=${options.maxAge}`)
  if (options?.domain) segments.push(`Domain=${options.domain}`)
  if (options?.sameSite) {
    const sameSite = options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)
    segments.push(`SameSite=${sameSite}`)
  }
  if (options?.secure) segments.push("Secure")
  document.cookie = segments.join("; ")
}

/**
 * Browser Supabase client. PKCE verifiers are stored in document cookies (not
 * localStorage) so they are available to @supabase/ssr on the server and in
 * new tabs. Password recovery uses hash tokens on /reset-password instead of PKCE.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: "pkce",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
      cookies: {
        getAll() {
          return parseDocumentCookies()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            writeDocumentCookie(name, value, options)
          })
        },
      },
    }
  )
}
