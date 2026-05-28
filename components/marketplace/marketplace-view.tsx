"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
  BatteryCharging,
  ChevronDown,
  Compass,
  Droplets,
  HeartPulse,
  Home,
  Leaf,
  Radio,
  Shield,
  Shirt,
  Wind,
  Wrench,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  MARKETPLACE_FILTER_CATEGORIES,
  buildMarketplaceSellers,
  marketplaceBundles,
  marketplaceProducts,
  type MarketplaceCategory,
  type MarketplaceProduct,
} from "@/lib/marketplace-data"
import { formatAwinPrice, type AwinMarketplaceProduct } from "@/lib/marketplace-awin"
import { BRAND_PLACEHOLDER_COLORS, getBrandInitials } from "@/lib/marketplace-brand-ui"
import {
  getAwinSellerDisplayNames,
  resolveAdvertiserDisplayName,
} from "@/lib/marketplace-brands"
import { useI18n } from "@/components/i18n-provider"

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
  "Air Quality": { icon: Wind, bg: "bg-sky-50", color: "text-sky-700" },
}

type Props = {
  hasPro: boolean
  awinProducts: AwinMarketplaceProduct[]
}

export function MarketplaceView({ hasPro, awinProducts }: Props) {
  const { t } = useI18n()
  const [active, setActive] = useState<MarketplaceCategory | "All">("All")
  const [activeSeller, setActiveSeller] = useState<string>("All")
  const [productsOpen, setProductsOpen] = useState(true)
  const [bundlesOpen, setBundlesOpen] = useState(false)

  const allSellers = useMemo(
    () => (hasPro ? buildMarketplaceSellers(getAwinSellerDisplayNames()) : ["Amazon"]),
    [hasPro]
  )

  const filteredAmazon = useMemo(() => {
    return marketplaceProducts.filter((p) => {
      const categoryMatch = active === "All" || p.category === active
      const sellerMatch = activeSeller === "All" || p.seller === activeSeller
      return categoryMatch && sellerMatch
    })
  }, [active, activeSeller])

  const filteredAwin = useMemo(() => {
    if (!hasPro) return []
    return awinProducts.filter((p) => {
      const categoryMatch = active === "All" || p.category === active
      const sellerMatch =
        activeSeller === "All" ||
        resolveAdvertiserDisplayName(p.brand_slug, p.advertiser_name) === activeSeller
      return categoryMatch && sellerMatch
    })
  }, [active, activeSeller, awinProducts, hasPro])

  const totalCount = filteredAmazon.length + filteredAwin.length

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <h1 className="text-3xl font-light text-[#0d1b2a]">{t("marketplace.title")}</h1>
        <p className="mt-3 max-w-2xl text-sm text-[#3d5166]">{t("marketplace.intro")}</p>

        <section className="mt-8 rounded-xl border border-[#d4dce8] bg-[#f5f7fa] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8a9bb0]">
            Browse by category
          </p>
          <div className="flex flex-wrap gap-2">
            <CategoryPill label="All" active={active === "All"} onClick={() => setActive("All")} />
            {MARKETPLACE_FILTER_CATEGORIES.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                active={active === cat}
                onClick={() => setActive(cat)}
              />
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-[#d4dce8] bg-[#f5f7fa] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8a9bb0]">
            Browse by seller
          </p>
          <div className="flex flex-wrap gap-2">
            <CategoryPill
              label="All"
              active={activeSeller === "All"}
              onClick={() => setActiveSeller("All")}
            />
            {allSellers.map((seller) => (
              <CategoryPill
                key={seller}
                label={seller}
                active={activeSeller === seller}
                onClick={() => setActiveSeller(seller)}
              />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <button
            type="button"
            onClick={() => setProductsOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-xl border border-[#d4dce8] bg-white px-5 py-4 text-left transition-colors hover:border-[#009b70]"
            aria-expanded={productsOpen}
          >
            <span className="text-2xl font-light text-[#0d1b2a]">
              All Products ({totalCount}
              {active !== "All" ? ` in ${active}` : ""})
            </span>
            <ChevronDown
              className={`h-5 w-5 text-[#3d5166] transition-transform ${productsOpen ? "rotate-180" : ""}`}
            />
          </button>
          {productsOpen && (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAmazon.map((p) => (
                <AmazonProductCard key={`amazon-${p.id}`} product={p} />
              ))}
              {filteredAwin.map((p) => (
                <AwinProductCard key={p.id} product={p} />
              ))}
              {totalCount === 0 && (
                <p className="col-span-full py-8 text-center text-sm text-[#8a9bb0]">
                  No products match these filters.
                  {awinProducts.length === 0 && hasPro && (
                    <>
                      {" "}
                      Awin catalog is empty — run a feed sync from the admin panel.
                    </>
                  )}
                </p>
              )}
            </div>
          )}
        </section>

        <section className="mt-4">
          <button
            type="button"
            onClick={() => setBundlesOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-xl border border-[#d4dce8] bg-white px-5 py-4 text-left transition-colors hover:border-[#009b70]"
            aria-expanded={bundlesOpen}
          >
            <span className="text-2xl font-light text-[#0d1b2a]">
              Bundles ({marketplaceBundles.length})
            </span>
            <ChevronDown
              className={`h-5 w-5 text-[#3d5166] transition-transform ${bundlesOpen ? "rotate-180" : ""}`}
            />
          </button>
          {bundlesOpen && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {marketplaceBundles.map((bundle) => (
                <article
                  key={bundle.name}
                  className="rounded-xl border-2 border-[#009b70]/25 bg-[#f5f7fa] p-5"
                >
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
          )}
        </section>

        <p className="mt-10 rounded-xl border border-[#d4dce8] bg-[#f5f7fa] px-4 py-3 text-xs leading-relaxed text-[#3d5166]">
          Autarkeia earns commission from purchases made through affiliate links on this page. This
          helps fund the platform. We only feature brands and products we believe serve our
          community.
        </p>
      </div>
    </main>
  )
}

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-[#009b70] bg-white text-[#009b70]"
          : "border-[#d4dce8] bg-white text-[#3d5166] hover:border-[#009b70]/50"
      }`}
    >
      {label}
    </button>
  )
}

function AmazonProductCard({ product }: { product: MarketplaceProduct }) {
  const meta = categoryMeta[product.category]
  const Icon = meta.icon
  return (
    <article className="rounded-xl border border-[#d4dce8] p-4 transition-colors hover:border-[#009b70]">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${meta.bg}`}>
        <Icon className={`h-5 w-5 ${meta.color}`} />
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#8a9bb0]">
        {product.category}
      </p>
      <h3 className="mt-1 text-sm font-medium text-[#0d1b2a]">{product.name}</h3>
      <p className="mt-1 text-[11px] font-medium text-[#8a9bb0]">{product.seller}</p>
      <p className="mt-2 line-clamp-3 text-xs text-[#3d5166]">{product.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-semibold text-[#0d1b2a]">{product.price}</span>
        <a
          href={product.affiliate}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-[#009b70] px-3 py-1.5 text-xs text-white hover:bg-[#007a58]"
        >
          Buy →
        </a>
      </div>
    </article>
  )
}

function AwinProductCard({ product }: { product: AwinMarketplaceProduct }) {
  if (product.is_store_card) {
    return <AwinStoreCard product={product} />
  }

  const meta = categoryMeta[product.category] ?? categoryMeta.Tools
  const Icon = meta.icon
  const priceLabel = formatAwinPrice(product.price, product.currency)

  return (
    <article className="rounded-xl border border-[#d4dce8] p-4 transition-colors hover:border-[#009b70]">
      {product.image_url ? (
        <div className="relative h-32 w-full overflow-hidden rounded-lg bg-[#f5f7fa]">
          <Image
            src={product.image_url}
            alt=""
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        </div>
      ) : (
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${meta.bg}`}>
          <Icon className={`h-5 w-5 ${meta.color}`} />
        </div>
      )}
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#8a9bb0]">
        {product.category}
      </p>
      <h3 className="mt-1 line-clamp-2 text-sm font-medium text-[#0d1b2a]">{product.product_name}</h3>
      <p className="mt-1 text-[11px] font-medium text-[#8a9bb0]">
        {resolveAdvertiserDisplayName(product.brand_slug, product.advertiser_name)}
      </p>
      {product.description && (
        <p className="mt-2 line-clamp-2 text-xs text-[#3d5166]">{product.description}</p>
      )}
      <div className="mt-3 flex items-center justify-between gap-2">
        {priceLabel ? (
          <span className="font-semibold text-[#0d1b2a]">{priceLabel}</span>
        ) : (
          <span className="text-xs text-[#8a9bb0]">See store</span>
        )}
        <a
          href={product.deep_link}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="shrink-0 rounded-lg bg-[#009b70] px-3 py-1.5 text-xs text-white hover:bg-[#007a58]"
        >
          Buy →
        </a>
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-wide text-[#8a9bb0]">Affiliate partner</p>
    </article>
  )
}

function AwinStoreCard({ product }: { product: AwinMarketplaceProduct }) {
  const displayName = resolveAdvertiserDisplayName(product.brand_slug, product.advertiser_name)
  const color = BRAND_PLACEHOLDER_COLORS[product.brand_slug] ?? "#009b70"

  return (
    <article className="rounded-xl border border-[#d4dce8] p-4 transition-colors hover:border-[#009b70]">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: color }}
        aria-hidden
      >
        {getBrandInitials(displayName)}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#f5f7fa] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#3d5166]">
          Store
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-[#8a9bb0]">
          {product.category}
        </span>
      </div>
      <h3 className="mt-2 text-sm font-medium text-[#0d1b2a]">{displayName}</h3>
      {product.description && (
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#3d5166]">{product.description}</p>
      )}
      <a
        href={product.deep_link}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="mt-4 inline-block rounded-lg bg-[#009b70] px-4 py-2 text-sm font-medium text-white hover:bg-[#007a58]"
      >
        Visit store
      </a>
      <p className="mt-2 text-[10px] uppercase tracking-wide text-[#8a9bb0]">Affiliate partner</p>
    </article>
  )
}
