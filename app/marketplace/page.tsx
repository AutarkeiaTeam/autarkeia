import type { Metadata } from "next"
import { MarketplacePaywall } from "@/components/marketplace/marketplace-paywall"
import { MarketplaceView } from "@/components/marketplace/marketplace-view"
import { getMarketplaceAccess } from "@/lib/marketplace-access"
import { listAwinMarketplaceProducts } from "@/lib/marketplace-db"

export async function generateMetadata(): Promise<Metadata> {
  const hasPro = await getMarketplaceAccess()
  return {
    title: "Marketplace — Autarkeia",
    description: "Curated affiliate partners and preparedness gear for practical resilience.",
    ...(hasPro ? {} : { robots: { index: false, follow: false } }),
  }
}

export default async function MarketplacePage() {
  const hasPro = await getMarketplaceAccess()

  if (!hasPro) {
    return <MarketplacePaywall />
  }

  const awinProducts = await listAwinMarketplaceProducts()

  return <MarketplaceView hasPro awinProducts={awinProducts} />
}
