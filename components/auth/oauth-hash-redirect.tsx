"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * If Supabase returns implicit-flow tokens in the hash on a non-callback route
 * (e.g. /dashboard#access_token=...), forward to /auth/callback before paint.
 */
export function OAuthHashRedirect() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === "undefined") return
    if (pathname === "/auth/callback" || pathname.startsWith("/auth/callback/")) return
    if (!window.location.hash.includes("access_token")) return

    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""))
    const isRecovery = hashParams.get("type") === "recovery"

    if (isRecovery) {
      if (pathname !== "/reset-password") {
        window.location.replace(`/reset-password${window.location.search}${window.location.hash}`)
      }
      return
    }

    const target = `/auth/callback/hash${window.location.search}${window.location.hash}`
    window.location.replace(target)
  }, [pathname])

  return null
}
