import { NextResponse } from "next/server"
import { listAwinMarketplaceProducts } from "@/lib/marketplace-db"
import { resolveProMarketplaceBundles } from "@/lib/marketplace-bundles"
import { getProAccess } from "@/lib/subscription"

/** Lazy-load Pro bundle affiliate links against the live Awin SKU feed. */
export async function GET() {
  const hasPro = await getProAccess()
  if (!hasPro) {
    return NextResponse.json({ error: "Pro required" }, { status: 403 })
  }

  const awinProducts = await listAwinMarketplaceProducts()
  const bundles = resolveProMarketplaceBundles({ awinProducts })

  return NextResponse.json({ bundles })
}
