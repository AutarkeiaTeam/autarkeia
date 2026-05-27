import type { Metadata } from "next"
import { AffiliateMarketplaceView } from "@/components/marketplace/affiliate-marketplace-view"
import { MarketplacePaywall } from "@/components/marketplace/marketplace-paywall"
import { getRequestCountry } from "@/lib/geo-country"
import { getMarketplaceAccess } from "@/lib/marketplace-access"

export async function generateMetadata(): Promise<Metadata> {
  const hasPro = await getMarketplaceAccess()
  return {
    title: "Marketplace — Autarkeia",
    description: "Curated affiliate partners for self-sufficiency and resilience.",
    ...(hasPro ? {} : { robots: { index: false, follow: false } }),
  }
}

export default async function MarketplacePage() {
  const [hasPro, country] = await Promise.all([getMarketplaceAccess(), getRequestCountry()])

  if (!hasPro) {
    return <MarketplacePaywall />
  }

  return <AffiliateMarketplaceView initialCountry={country} />
}
