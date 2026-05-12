"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/quiz/emergency-readiness", label: "Emergency Readiness" },
  { href: "/quiz/self-sufficiency", label: "Self-Sufficiency" },
  { href: "/communities", label: "Communities" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/library", label: "Library" },
  { href: "/news", label: "World News Watch" },
  { href: "/plans", label: "Plans" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#d4dce8]" style={{ borderBottomWidth: '0.5px' }}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 lg:px-8 lg:py-6">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <div className="hidden lg:flex lg:items-center lg:gap-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-normal text-[#3d5166] transition-colors hover:text-[#009b70]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-x-4">
          <Button variant="ghost" className="text-[13px] font-normal text-[#0d1b2a]" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button className="bg-[#009b70] text-white hover:bg-[#008060] font-medium rounded-lg" asChild>
            <Link href="/quiz">Get your score</Link>
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 text-[#0d1b2a]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#d4dce8] bg-white" style={{ borderTopWidth: '0.5px' }}>
          <div className="space-y-1 px-4 py-4">
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
