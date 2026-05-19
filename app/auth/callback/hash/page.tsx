"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { setAutarkeiaSessionCookies } from "@/lib/auth-session"
import { createClient } from "@/lib/supabase/client"

/**
 * Fallback for legacy implicit OAuth redirects (#access_token in the hash).
 * PKCE sign-in should use /auth/callback?code=... handled by route.ts.
 */
export default function AuthCallbackHashPage() {
  const router = useRouter()
  const [message, setMessage] = useState("Signing you in…")

  useEffect(() => {
    const completeAuth = async () => {
      const supabase = createClient()
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""))
      const access_token = hashParams.get("access_token")
      const refresh_token = hashParams.get("refresh_token")

      if (!access_token || !refresh_token) {
        router.replace(`/login?error=${encodeURIComponent("Incomplete sign-in response")}`)
        return
      }

      try {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token })
        if (error) throw error

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          throw userError ?? new Error("Could not load user session")
        }

        setAutarkeiaSessionCookies(user)
        router.replace("/dashboard")
      } catch (err) {
        const text = err instanceof Error ? err.message : "Sign-in failed"
        setMessage(text)
        router.replace(`/login?error=${encodeURIComponent(text)}`)
      }
    }

    void completeAuth()
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4">
      <p className="text-sm text-[#3d5166]">{message}</p>
    </main>
  )
}
