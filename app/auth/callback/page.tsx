"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { setAutarkeiaSessionCookies } from "@/lib/auth-session"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [message, setMessage] = useState("Signing you in…")

  useEffect(() => {
    const completeAuth = async () => {
      const supabase = createClient()
      const params = new URLSearchParams(window.location.search)
      const code = params.get("code")
      const oauthError = params.get("error_description") ?? params.get("error")
      const hashHasToken = window.location.hash.includes("access_token")

      if (oauthError) {
        router.replace(`/login?error=${encodeURIComponent(oauthError)}`)
        return
      }

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        } else if (hashHasToken) {
          // Legacy implicit redirect (hash tokens) — exchange hash for a session.
          const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""))
          const access_token = hashParams.get("access_token")
          const refresh_token = hashParams.get("refresh_token")
          if (!access_token || !refresh_token) {
            throw new Error("Incomplete sign-in response")
          }
          const { error } = await supabase.auth.setSession({ access_token, refresh_token })
          if (error) throw error
        } else {
          router.replace(`/login?error=${encodeURIComponent("Missing auth code")}`)
          return
        }

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
