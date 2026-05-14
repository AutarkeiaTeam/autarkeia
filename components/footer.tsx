"use client"

import Link from "next/link"
import { LogoLight } from "./logo"

export function Footer() {
  return (
    <footer className="bg-[#0d1b2a] border-t border-[#1a2942]">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#71d8be]">About Autarkeia</h3>
          <p className="mt-3 text-sm leading-relaxed text-[#a8b6c9]">
            Autarkeia was born from a clear-eyed reading of the times: supply chains tighten, climate stress is
            no longer abstract, and trust in institutions is thinning. But our deeper conviction is simpler — that
            living closer to land, food, neighbours, and craft is the natural progression of a human life and,
            quite likely, the most beautiful existence available to us regardless of what global conditions bring.
            Preparedness is wise; self-sufficiency is wisdom of a different order. We promote the best, most
            beautiful way humans can live, not the most fearful. Autarkeia is currently based in Spain and is
            building first communities here, with an open door to seeding additional communities anywhere in the
            world where the soil, the climate, and the people line up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center">
              <LogoLight />
            </Link>
            <p className="text-sm text-[#7a8a9e]">
              Emergency readiness first. Self-sufficiency for life.
            </p>
            <p className="text-xs text-[#5a6a7e] mt-4">autarkeia.world · Spain</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/quiz/emergency-readiness" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">Quiz</Link></li>
              <li><Link href="/marketplace" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">Marketplace</Link></li>
              <li><Link href="/library" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">Library</Link></li>
              <li><Link href="/news" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">World News Watch</Link></li>
              <li><Link href="/plans" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">Plans</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Communities</h3>
            <ul className="space-y-2">
              <li><Link href="/communities" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">Our vision</Link></li>
              <li><Link href="/communities#register-interest" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">Register interest</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">About</Link></li>
              <li><Link href="/privacy" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1a2942] pt-8">
          <p className="text-xs text-[#5a6a7e]">© 2026 Autarkeia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
