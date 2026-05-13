"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"

/** Desktop center column — evenly spaced, visually centered in the bar. */
const centerNavLinks = [
  { href: "/quiz/emergency-readiness", label: "Emergency Readiness" },
  { href: "/plans#pricing", label: "Pricing" },
  { href: "/plans", label: "Plans" },
]

/** Mobile drawer keeps full site navigation. */
const mobileNavLinks = [
  { href: "/quiz/emergency-readiness", label: "Emergency Readiness" },
  { href: "/quiz/self-sufficiency", label: "Self-Sufficiency" },
  { href: "/communities", label: "Communities" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/library", label: "Library" },
  { href: "/news", label: "World News Watch" },
  { href: "/plans", label: "Plans" },
]

const navLinkClass =
  "shrink-0 whitespace-nowrap text-[12px] font-normal text-[#3d5166] transition-colors hover:text-[#009b70] xl:text-[13px]"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#d4dce8]" style={{ borderBottomWidth: '0.5px' }}>
      <nav className="mx-auto flex max-w-7xl flex-nowrap items-center gap-4 px-3 py-3 pr-4 lg:gap-8 lg:px-5 lg:py-4 lg:pr-8">
        <div className="flex shrink-0 items-center">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
        </div>

        <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          <div className="flex flex-nowrap items-center justify-center gap-x-6 xl:gap-x-10">
            {centerNavLinks.map((link) => (
              <Link key={link.href + link.label} href={link.href} className={navLinkClass}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden shrink-0 items-center lg:flex">
          <Button variant="ghost" className="whitespace-nowrap px-2 text-[12px] font-normal text-[#0d1b2a] xl:text-[13px]" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>

        <button
          type="button"
          className="ml-auto flex shrink-0 p-2 text-[#0d1b2a] lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#d4dce8] bg-white" style={{ borderTopWidth: '0.5px' }}>
          <div className="space-y-1 px-4 py-4">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-[13px] font-normal text-[#3d5166] hover:text-[#009b70]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-[#d4dce8]" style={{ borderTopWidth: '0.5px' }}>
              <Button variant="ghost" className="justify-start text-[13px] font-normal text-[#0d1b2a]" asChild>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
              </Button>
              <Button className="bg-[#009b70] text-white hover:bg-[#008060] font-medium rounded-lg" asChild>
                <Link href="/quiz" onClick={() => setMobileMenuOpen(false)}>Get your score</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
