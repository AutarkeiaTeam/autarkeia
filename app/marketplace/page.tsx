import type { Metadata } from "next"
import { MarketplaceView } from "@/components/marketplace/marketplace-view"
import { getProAccess } from "@/lib/subscription"
import { countAwinMarketplaceProducts, listAwinMarketplaceProducts } from "@/lib/marketplace-db"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Marketplace — Autarkeia",
    description: "Curated affiliate partners and preparedness gear for practical resilience.",
  }
}

export default async function MarketplacePage() {
  const hasPro = await getProAccess()
  const [awinProductCount, awinProducts] = await Promise.all([
    countAwinMarketplaceProducts(),
    hasPro ? listAwinMarketplaceProducts() : Promise.resolve([]),
  ])

  return (
    <MarketplaceView
      hasPro={hasPro}
      awinProducts={awinProducts}
      awinProductCount={awinProductCount}
    />
  )
}
