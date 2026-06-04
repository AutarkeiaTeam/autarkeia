import type { Metadata } from "next"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: translate(locale, "privacy.meta_title"),
    description: translate(locale, "privacy.meta_description"),
  }
}

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children
}
