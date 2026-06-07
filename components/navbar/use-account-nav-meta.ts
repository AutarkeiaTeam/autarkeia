"use client"

import { useEffect, useState } from "react"

export type AccountNavMeta = {
  username: string | null
  profilePublic: boolean
  displayName: string | null
  avatarUrl: string | null
  initials: string | null
}

export function useAccountNavMeta(): AccountNavMeta | null {
  const [navMeta, setNavMeta] = useState<AccountNavMeta | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadNavMeta = async () => {
      try {
        const response = await fetch("/api/account/nav-meta")
        if (!response.ok) return
        const data = (await response.json()) as AccountNavMeta
        if (!cancelled) setNavMeta(data)
      } catch {
        // ignore
      }
    }

    void loadNavMeta()
    window.addEventListener("autarkeia-auth-change", loadNavMeta)

    return () => {
      cancelled = true
      window.removeEventListener("autarkeia-auth-change", loadNavMeta)
    }
  }, [])

  return navMeta
}
