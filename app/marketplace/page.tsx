import { MarketplaceView } from "@/components/marketplace/marketplace-view"
import { getProAccess } from "@/lib/subscription"

export default async function MarketplacePage() {
  const hasPro = await getProAccess()
  return <MarketplaceView hasPro={hasPro} />
}
