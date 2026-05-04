"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "#self-sufficiency", label: "Self-sufficiency" },
  { href: "#rural-communities", label: "Rural Communities" },
  { href: "#marketplace", label: "Marketplace" },
  { href: "#library", label: "Library" },
  { href: "#news", label: "World News Watch" },
  { href: "#forums", label: "Forums" },
  { href: "#pricing", label: "Pricing" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#d4dce8]" style={{ borderBottomWidth: '0.5px' }}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="flex items-center">
          <Logo className="text-xl" />
        </Link>

        {/* Desktop Navigation */}
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

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-4">
          <Button variant="ghost" className="text-[13px] font-normal text-[#0d1b2a]">
            Sign in
          </Button>
          <Link href="/quiz">
            <Button className="bg-[#009b70] text-white hover:bg-[#008060] font-medium rounded-lg">
              Get your score
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2 text-[#0d1b2a]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
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
              <Button variant="ghost" className="justify-start text-[13px] font-normal text-[#0d1b2a]">
                Sign in
              </Button>
              <Button className="bg-[#009b70] text-white hover:bg-[#008060] font-medium rounded-lg">
                Get your score
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
