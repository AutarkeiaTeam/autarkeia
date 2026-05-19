"use client"

import { useEffect, useState } from "react"

export type Tier = "free" | "pro"

const COOKIE_NAME = "autarkeia-tier"

function readCookie(): Tier {
  if (typeof document === "undefined") return "free"
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${COOKIE_NAME}=`))
  const value = match?.split("=")[1]
  return value === "pro" ? "pro" : "free"
}

export function writeCookie(tier: Tier) {
  if (typeof document === "undefined") return
  const maxAge = 60 * 60 * 24 * 365
  document.cookie = `${COOKIE_NAME}=${tier}; path=/; max-age=${maxAge}; SameSite=Lax`
}

/**
 * Client-side membership tier hook. Reads from a `autarkeia-tier` cookie
 * so the same value is visible to server components via `cookies()` once
 * we wire up the real auth flow. Until Supabase is configured this is
 * also how the demo dashboard toggles between Free and Pro views.
 */
export function useTier(initialTier?: Tier): { tier: Tier; setTier: (t: Tier) => void } {
  const [tier, setTierState] = useState<Tier>(initialTier ?? "free")

  useEffect(() => {
    if (initialTier === undefined) {
      setTierState(readCookie())
    }
  }, [initialTier])

  const setTier = (t: Tier) => {
    writeCookie(t)
    setTierState(t)
  }

  return { tier, setTier }
}
