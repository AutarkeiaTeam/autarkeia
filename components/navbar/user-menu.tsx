"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"
import { useI18n } from "@/components/i18n-provider"
import { useAccountNavMeta } from "@/components/navbar/use-account-nav-meta"
import { supabaseClient } from "@/lib/supabase-client"

export function UserMenu() {
  const { t } = useI18n()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const navMeta = useAccountNavMeta()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await supabaseClient.auth.signOut()
      document.cookie = "autarkeia-user=; path=/; max-age=0; SameSite=Lax"
      document.cookie = "autarkeia-email=; path=/; max-age=0; SameSite=Lax"
      document.cookie = "autarkeia-tier=; path=/; max-age=0; SameSite=Lax"
      window.dispatchEvent(new Event("autarkeia-auth-change"))
      setOpen(false)
      router.push("/")
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 rounded-md border border-[#d4dce8] bg-white px-2 py-1.5 text-[12px] font-normal text-[#0d1b2a] hover:bg-[#f5f7fa] 2xl:px-2.5 2xl:text-[13px]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {navMeta?.initials ? (
          <UserAvatar
            src={navMeta.avatarUrl}
            fallbackInitials={navMeta.initials}
            size={32}
          />
        ) : null}
        <span>{t("nav.account_menu")}</span>
        <ChevronDown className="h-3 w-3" />
      </button>
      {open ? (
        <ul
          role="menu"
          className="absolute right-0 z-50 mt-1 w-56 overflow-hidden rounded-lg border border-[#d4dce8] bg-white shadow-lg"
        >
          <li>
            <Link
              href="/account"
              role="menuitem"
              className="block px-3 py-2 text-sm text-[#0d1b2a] hover:bg-[#f5f7fa]"
              onClick={() => setOpen(false)}
            >
              {t("nav.account_settings")}
            </Link>
          </li>
          <li className="border-t border-[#e8edf2]" style={{ borderTopWidth: "0.5px" }}>
            <button
              type="button"
              role="menuitem"
              onClick={() => void handleSignOut()}
              disabled={isSigningOut}
              className="block w-full px-3 py-2 text-left text-sm text-[#9f1d1d] hover:bg-[#fff5f5] disabled:opacity-60"
            >
              {isSigningOut ? t("dashboard.signing_out") : t("dashboard.sign_out")}
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  )
}
