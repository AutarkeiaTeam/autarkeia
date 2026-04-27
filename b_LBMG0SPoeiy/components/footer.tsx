import Link from "next/link"
import { LogoLight } from "./logo"

const footerLinks = {
  platform: {
    title: "Platform",
    links: [
      { label: "AI Planner", href: "#" },
      { label: "Marketplace", href: "#" },
      { label: "Library", href: "#" },
      { label: "App Directory", href: "#" },
      { label: "Forums", href: "#" },
    ],
  },
  community: {
    title: "Community",
    links: [
      { label: "Rural Communities", href: "#" },
      { label: "World News Watch", href: "#" },
      { label: "Success Stories", href: "#" },
      { label: "Expert Network", href: "#" },
      { label: "Events", href: "#" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Getting Started", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Podcast", href: "#" },
      { label: "Newsletter", href: "#" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Partners", href: "#" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Licenses", href: "#" },
    ],
  },
}

export function Footer() {
  return (
    <footer className="bg-[#0d1b2a] py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-6">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <LogoLight className="text-xl" />
            <p className="mt-4 text-sm font-light text-white/60 leading-relaxed">
              Everything you need to need nothing.
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
            <Link href="#" className="text-sm font-light text-white/40 hover:text-[#009b70] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm font-light text-white/40 hover:text-[#009b70] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
