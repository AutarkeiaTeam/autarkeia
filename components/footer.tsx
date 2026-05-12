"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#0d1b2a] border-t border-[#1a2942]">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Link
                href="/"
                className="flex w-full max-w-[14rem] items-center justify-between gap-3 sm:max-w-xs"
              >
                <img
                  src="/FAVICON10.png"
                  alt=""
                  width={36}
                  height={36}
                  className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
                  aria-hidden
                />
                <span className="text-sm font-light lowercase tracking-[0.25em] text-white/90 sm:text-base">
                  autarkeia
                </span>
              </Link>
            </div>
            <p className="text-sm text-[#7a8a9e]">
              Emergency readiness first. Self-sufficiency for life.
            </p>
            <p className="text-xs text-[#5a6a7e] mt-4">autarkeia.world</p>
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
