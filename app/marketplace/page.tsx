import type { Metadata } from "next"
import { MarketplaceView } from "@/components/marketplace/marketplace-view"
import { getProAccess } from "@/lib/subscription"
import { listAwinMarketplaceProducts } from "@/lib/marketplace-db"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Marketplace — Autarkeia",
    description: "Curated affiliate partners and preparedness gear for practical resilience.",
  }
}

export default async function MarketplacePage() {
  const hasPro = await getProAccess()
  const awinProducts = hasPro ? await listAwinMarketplaceProducts() : []

  return <MarketplaceView hasPro={hasPro} awinProducts={awinProducts} />
}
