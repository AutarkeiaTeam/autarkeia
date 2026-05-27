import Link from "next/link"
import { MARKETPLACE_CATEGORY_LABELS, marketplaceBrands } from "@/lib/marketplace-brands"

export function MarketplacePaywall() {
  const teaserCategories = [...new Set(marketplaceBrands.map((b) => b.category))]

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">Pro members only</p>
        <h1 className="mt-3 text-3xl font-light text-[#0d1b2a]">Marketplace</h1>
        <p className="mt-4 text-sm leading-relaxed text-[#3d5166]">
          Upgrade to Pro to access curated affiliate partners for power, water, outdoor gear, gardening,
          air quality, and preparedness — with geo-aware storefront links.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {teaserCategories.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-[#d4dce8] bg-[#f5f7fa] px-3 py-1 text-xs text-[#3d5166]"
            >
              {MARKETPLACE_CATEGORY_LABELS[cat]}
            </span>
          ))}
        </div>

        <Link
          href="/plans?from=marketplace"
          className="mt-8 inline-block rounded-lg bg-[#009b70] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#007a58]"
        >
          Upgrade to Pro to access the marketplace
        </Link>
        <p className="mt-4 text-xs text-[#8a9bb0]">
          Already subscribed?{" "}
          <Link href="/login" className="text-[#009b70] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
