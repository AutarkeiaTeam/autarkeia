import Link from "next/link"
import { LogoLight } from "./logo"

const footerLinks = {
  platform: {
    title: "Platform",
    links: [
      { label: "Quiz", href: "/quiz" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Library", href: "/library" },
      { label: "World News Watch", href: "/news" },
      { label: "Plans", href: "/plans" },
    ],
  },
  community: {
    title: "Communities",
    links: [
      { label: "Our vision", href: "/communities" },
      { label: "Register interest", href: "/communities#register-interest" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
}

export function Footer() {
  return (
    <footer className="bg-[#0d1b2a] py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <LogoLight className="text-xl" />
            <p className="mt-4 text-sm font-light text-white/60 leading-relaxed">
              Emergency readiness first. Self-sufficiency for life.
            </p>
            <p className="mt-2 text-sm font-light text-white/60 leading-relaxed">
              autarkeia.world
            </p>
          </div>

          {/* Links columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-normal text-white">{section.title}</h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-light text-white/60 hover:text-[#009b70] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm font-light text-white/40">
            © {new Date().getFullYear()} Autarkeia. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm font-light text-white/40 hover:text-[#009b70] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm font-light text-white/40 hover:text-[#009b70] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
