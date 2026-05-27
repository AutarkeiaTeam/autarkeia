"use client"

import { ExternalLink } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import {
  BRAND_PLACEHOLDER_COLORS,
  MARKETPLACE_CATEGORY_LABELS,
  MARKETPLACE_CATEGORY_ORDER,
  type Brand,
  type BrandCategory,
  countBrandsByCategory,
  countryDisplayLabel,
  countryFlagEmoji,
  getBrandInitials,
  marketplaceBrands,
  resolveAffiliateLink,
} from "@/lib/marketplace-brands"
import { guessCountryFromLocale } from "@/lib/geo-country"

type Props = {
  initialCountry: string | null
}

export function AffiliateMarketplaceView({ initialCountry }: Props) {
  const [userCountry, setUserCountry] = useState<string | null>(initialCountry)
  const [activeCategory, setActiveCategory] = useState<BrandCategory | "all">("all")

  useEffect(() => {
    if (!userCountry) {
      const guessed = guessCountryFromLocale()
      if (guessed) setUserCountry(guessed)
    }
  }, [userCountry])

  const filteredBrands = useMemo(() => {
    if (activeCategory === "all") return marketplaceBrands
    return marketplaceBrands.filter((b) => b.category === activeCategory)
  }, [activeCategory])

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <h1 className="text-3xl font-light text-[#0d1b2a]">Marketplace</h1>
        <p className="mt-3 max-w-2xl text-sm text-[#3d5166]">
          Curated partners for self-sufficiency and resilience — portable power, water filtration,
          outdoor gear, gardening, air quality, and preparedness. Links route to the best storefront
          for your region.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <CategoryPill
            label="All"
            count={countBrandsByCategory(marketplaceBrands, "all")}
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          {MARKETPLACE_CATEGORY_ORDER.map((cat) => (
            <CategoryPill
              key={cat}
              label={MARKETPLACE_CATEGORY_LABELS[cat]}
              count={countBrandsByCategory(marketplaceBrands, cat)}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} userCountry={userCountry} />
          ))}
        </div>

        {filteredBrands.length === 0 && (
          <p className="mt-10 text-center text-sm text-[#8a9bb0]">No brands in this category yet.</p>
        )}

        <p className="mt-12 rounded-xl border border-[#d4dce8] bg-[#f5f7fa] px-4 py-3 text-xs leading-relaxed text-[#3d5166]">
          Autarkeia earns commission from purchases made through these links. This helps fund the
          platform. We only feature brands we believe serve our community.
        </p>
      </div>
    </main>
  )
}

function CategoryPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-[#009b70] bg-[#e8f8f3] text-[#009b70]"
          : "border-[#d4dce8] bg-white text-[#3d5166] hover:border-[#009b70]/50"
      }`}
    >
      {label} ({count})
    </button>
  )
}

function BrandCard({ brand, userCountry }: { brand: Brand; userCountry: string | null }) {
  const resolved = resolveAffiliateLink(brand, userCountry)
  const color = BRAND_PLACEHOLDER_COLORS[brand.id] ?? "#009b70"

  return (
    <article className="flex flex-col rounded-2xl border border-[#d4dce8] bg-white p-5 shadow-sm">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: color }}
        aria-hidden
      >
        {getBrandInitials(brand.name)}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#009b70]">
        {MARKETPLACE_CATEGORY_LABELS[brand.category]}
      </p>
      <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">{brand.name}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#3d5166]">{brand.description}</p>

      <p className="mt-3 text-[11px] text-[#8a9bb0]">
        {countryFlagEmoji(resolved.country)} Storefront: {countryDisplayLabel(resolved.country)}
      </p>

      <a
        href={resolved.url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#009b70] px-4 py-2 text-sm font-medium text-white hover:bg-[#007a58]"
      >
        Visit store
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      </a>

      <p className="mt-3 text-[10px] uppercase tracking-wide text-[#8a9bb0]">Affiliate partner</p>
    </article>
  )
}
