"use client"

import { useMemo, useState } from "react"
import {
  BatteryCharging,
  Compass,
  Droplets,
  HeartPulse,
  Home,
  Leaf,
  Radio,
  Shield,
  Shirt,
  Wrench,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  MARKETPLACE_FILTER_CATEGORIES,
  MARKETPLACE_SELLERS,
  marketplaceBundles,
  marketplaceProducts,
  type MarketplaceCategory,
  type MarketplaceProduct,
  type MarketplaceSeller,
} from "@/lib/marketplace-data"
import { useI18n } from "@/components/i18n-provider"
import { useTier } from "@/lib/use-tier"

const categoryMeta: Record<
  MarketplaceCategory,
  { icon: LucideIcon; bg: string; color: string }
> = {
  Water: { icon: Droplets, bg: "bg-blue-50", color: "text-blue-600" },
  Food: { icon: Leaf, bg: "bg-amber-50", color: "text-amber-700" },
  Shelter: { icon: Home, bg: "bg-stone-100", color: "text-stone-700" },
  Energy: { icon: BatteryCharging, bg: "bg-yellow-50", color: "text-yellow-700" },
  Medical: { icon: HeartPulse, bg: "bg-red-50", color: "text-red-600" },
  Tools: { icon: Wrench, bg: "bg-slate-100", color: "text-slate-700" },
  Clothing: { icon: Shirt, bg: "bg-rose-50", color: "text-rose-700" },
  Security: { icon: Shield, bg: "bg-orange-50", color: "text-orange-700" },
  Communications: { icon: Radio, bg: "bg-violet-50", color: "text-violet-700" },
  Navigation: { icon: Compass, bg: "bg-cyan-50", color: "text-cyan-700" },
}

export default function Marketplace() {
  const { t } = useI18n()
  const { tier } = useTier()
  const [active, setActive] = useState<MarketplaceCategory | "All">("All")
  const [activeSeller, setActiveSeller] = useState<MarketplaceSeller | "All">("All")

  const visibleSellers = tier === "pro" ? MARKETPLACE_SELLERS : MARKETPLACE_SELLERS.filter((seller) => seller === "Amazon")

  const filteredProducts = useMemo(() => {
    return marketplaceProducts.filter((p) => {
      const categoryMatch = active === "All" || p.category === active
      const sellerMatch = activeSeller === "All" || p.seller === activeSeller
      return categoryMatch && sellerMatch
    })
  }, [active, activeSeller])

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-3xl font-light text-[#0d1b2a]">{t("marketplace.title")}</h1>
        <p className="mt-3 text-sm text-[#3d5166] max-w-2xl">{t("marketplace.intro")}</p>

        <section className="mt-8 rounded-xl border border-[#d4dce8] bg-[#f5f7fa] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8a9bb0] mb-3">Browse by category</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActive("All")}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active === "All"
                  ? "border-[#009b70] bg-white text-[#009b70]"
                  : "border-[#d4dce8] bg-white text-[#3d5166] hover:border-[#009b70]/50"
              }`}
            >
              All
            </button>
            {MARKETPLACE_FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active === cat
                  ? "border-[#009b70] bg-white text-[#009b70]"
                  : "border-[#d4dce8] bg-white text-[#3d5166] hover:border-[#009b70]/50"
              }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-[#d4dce8] bg-[#f5f7fa] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8a9bb0]">Browse by seller</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveSeller("All")}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                activeSeller === "All"
                  ? "border-[#009b70] bg-white text-[#009b70]"
                  : "border-[#d4dce8] bg-white text-[#3d5166] hover:border-[#009b70]/50"
              }`}
            >
              All
            </button>
            {visibleSellers.map((seller) => (
              <button
                key={seller}
                type="button"
                onClick={() => setActiveSeller(seller)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeSeller === seller
                    ? "border-[#009b70] bg-white text-[#009b70]"
                    : "border-[#d4dce8] bg-white text-[#3d5166] hover:border-[#009b70]/50"
                }`}
              >
                {seller}
              </button>
            ))}
          </div>
          {tier !== "pro" && (
            <p className="mt-3 text-xs text-[#8a9bb0]">Unlock more sellers by upgrading to Pro.</p>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-light text-[#0d1b2a] mb-4">Bundles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {marketplaceBundles.map((bundle) => (
              <article key={bundle.name} className="rounded-xl border-2 border-[#009b70]/25 bg-[#f5f7fa] p-5">
                <h3 className="font-medium text-[#0d1b2a]">{bundle.name}</h3>
                <p className="mt-1 text-sm text-[#3d5166]">{bundle.items}</p>
                <div className="mt-3 flex items-end gap-3">
                  <span className="text-sm text-[#8a9bb0] line-through">{bundle.original}</span>
                  <span className="text-xl font-semibold text-[#0d1b2a]">{bundle.price}</span>
                  <span className="text-sm font-medium text-[#009b70]">Save {bundle.savings}</span>
                </div>
                <a
                  href={bundle.affiliate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-lg bg-[#009b70] px-4 py-2 text-sm font-medium text-white hover:bg-[#007a58]"
                >
                  View bundle →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-light text-[#0d1b2a] mb-4">
            All products ({filteredProducts.length}
            {active !== "All" ? ` in ${active}` : ""})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p: MarketplaceProduct) => {
              const meta = categoryMeta[p.category]
              const Icon = meta.icon
              return (
                <article
                  key={p.id}
                  className="rounded-xl border border-[#d4dce8] p-4 hover:border-[#009b70] transition-colors"
                >
                  <div className={`h-12 w-12 rounded-lg ${meta.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${meta.color}`} />
                  </div>
                  <p className="mt-3 text-xs font-semibold tracking-wide text-[#8a9bb0] uppercase">{p.category}</p>
                  <h3 className="mt-1 text-sm font-medium text-[#0d1b2a]">{p.name}</h3>
                  <p className="mt-1 text-[11px] font-medium text-[#8a9bb0]">{p.seller}</p>
                  <p className="mt-2 text-xs text-[#3d5166]">{p.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-semibold text-[#0d1b2a]">{p.price}</span>
                    <a
                      href={p.affiliate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-[#009b70] px-3 py-1.5 text-xs text-white hover:bg-[#007a58]"
                    >
                      Buy →
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
