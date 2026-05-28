import type { Metadata } from "next"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: translate(locale, "contact.meta_title"),
    description: translate(locale, "contact.meta_description"),
  }
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
