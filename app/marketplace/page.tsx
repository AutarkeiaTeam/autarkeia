import type { Metadata } from "next"
import { MarketplaceView } from "@/components/marketplace/marketplace-view"
import { translate } from "@/lib/i18n-core"
import { getLocale } from "@/lib/i18n-server"
import { getProAccess } from "@/lib/subscription"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: translate(locale, "marketplace.meta_title"),
    description: translate(locale, "marketplace.meta_description"),
  }
}

export default async function MarketplacePage() {
  const hasPro = await getProAccess()

  return <MarketplaceView hasPro={hasPro} />
}
