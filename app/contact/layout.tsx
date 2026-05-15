import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact — Autarkeia",
  description: "Get in touch with Autarkeia.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
