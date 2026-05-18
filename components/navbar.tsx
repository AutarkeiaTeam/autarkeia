"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "./language-switcher"
import { useI18n } from "@/components/i18n-provider"

const NAV_DEFS = [
  { href: "/quiz/emergency-readiness", key: "nav.emergency" },
  { href: "/quiz/self-sufficiency", key: "nav.self_sufficiency" },
  { href: "/communities", key: "nav.communities" },
  { href: "/marketplace", key: "nav.marketplace" },
  { href: "/library", key: "nav.library" },
  { href: "/news", key: "nav.news" },
  { href: "/forums", key: "nav.forums" },
  { href: "/plans", key: "nav.plans" },
] as const

function useIsAuthed() {
  const [authed, setAuthed] = useState(false)
  useEffect(() => {
    if (typeof document === "undefined") return
    const syncAuthState = () => {
      const has = document.cookie.split("; ").some((row) => row.startsWith("autarkeia-user="))
      setAuthed(has)
    }

    syncAuthState()
    window.addEventListener("autarkeia-auth-change", syncAuthState)
    window.addEventListener("focus", syncAuthState)

    return () => {
      window.removeEventListener("autarkeia-auth-change", syncAuthState)
      window.removeEventListener("focus", syncAuthState)
    }
  }, [])
  return authed
}

const navLinkClass =
  "shrink-0 whitespace-nowrap text-[13px] font-normal text-[#3d5166] transition-colors hover:text-[#009b70] 2xl:text-sm"

export function Navbar() {
  const { t } = useI18n()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const authed = useIsAuthed()

  const navLinks = useMemo(
    () => NAV_DEFS.map((d) => ({ href: d.href, label: t(d.key) })),
    [t]
  )

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#d4dce8]" style={{ borderBottomWidth: "0.5px" }}>
      <nav className="flex w-full flex-nowrap items-center gap-x-6 py-3 pl-4 pr-3 sm:pl-5 lg:py-4 xl:gap-x-8">
        <div className="flex shrink-0 items-center">
          <Link href="/" className="flex items-center">
            <Logo className="gap-2 text-[13px] sm:text-[14px]" />
          </Link>
        </div>

        <div className="hidden min-w-0 flex-1 items-center justify-start pl-10 xl:flex 2xl:pl-14">
          <div className="flex max-w-full flex-nowrap items-center justify-start gap-x-3 2xl:gap-x-5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="ml-auto hidden shrink-0 flex flex-nowrap items-center justify-end gap-x-2 pl-12 xl:flex xl:gap-x-3 xl:pl-16 2xl:pl-20">
          {authed ? (
            <>
              <Button
                className="whitespace-nowrap rounded-lg bg-[#009b70] px-3 text-[12px] font-medium text-white hover:bg-[#008060] xl:text-[13px]"
                asChild
              >
                <Link href="/dashboard">{t("nav.dashboard")}</Link>
              </Button>
              <LanguageSwitcher />
            </>
          ) : (
            <>
              <Button variant="ghost" className="whitespace-nowrap px-2 text-[12px] font-normal text-[#0d1b2a] xl:text-[13px]" asChild>
                <Link href="/login">{t("nav.sign_in")}</Link>
              </Button>
              <Button
                className="whitespace-nowrap rounded-lg bg-[#009b70] px-3 text-[12px] font-medium text-white hover:bg-[#008060] xl:text-[13px]"
                asChild
              >
                <Link href="/quiz">{t("nav.get_score")}</Link>
              </Button>
              <LanguageSwitcher />
            </>
          )}
        </div>

        <button
          type="button"
          className="ml-auto flex shrink-0 p-2 text-[#0d1b2a] xl:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#d4dce8] bg-white" style={{ borderTopWidth: "0.5px" }}>
          <div className="space-y-1 px-8 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-[13px] font-normal text-[#3d5166] hover:text-[#009b70]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-[#d4dce8]" style={{ borderTopWidth: "0.5px" }}>
              {authed ? (
                <>
                  <Button className="bg-[#009b70] text-white hover:bg-[#008060] font-medium rounded-lg" asChild>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      {t("nav.dashboard")}
                    </Link>
                  </Button>
                  <div className="px-1">
                    <LanguageSwitcher />
                  </div>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="justify-start text-[13px] font-normal text-[#0d1b2a]" asChild>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      {t("nav.sign_in")}
                    </Link>
                  </Button>
                  <Button className="bg-[#009b70] text-white hover:bg-[#008060] font-medium rounded-lg" asChild>
                    <Link href="/quiz" onClick={() => setMobileMenuOpen(false)}>
                      {t("nav.get_score")}
                    </Link>
                  </Button>
                  <div className="px-1">
                    <LanguageSwitcher />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
