"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  Baby,
  BatteryCharging,
  Car,
  ChevronDown,
  Coins,
  Compass,
  Dog,
  Droplets,
  FileText,
  Flame,
  HeartPulse,
  Home,
  Leaf,
  Lightbulb,
  Radio,
  Shield,
  Shirt,
  ShowerHead,
  Sprout,
  Wind,
  Wrench,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  getAmazonProductCount,
  getAmazonProductCopy,
  getAmazonProductsForAccess,
  getCategorySlug,
  getMarketplaceFilterCategories,
  buildMarketplaceSellers,
  type MarketplaceCategory,
  type MarketplaceProduct,
} from "@/lib/marketplace-data"
import {
  getBundlesForAccess,
  resolveProMarketplaceBundles,
} from "@/lib/marketplace-bundles"
import { formatAwinPrice, type AwinMarketplaceProduct } from "@/lib/marketplace-awin"
import { BRAND_PLACEHOLDER_COLORS, getBrandInitials } from "@/lib/marketplace-brand-ui"
import {
  getMarketplaceBrandDescriptionKey,
  getAwinSellerDisplayNames,
  resolveAdvertiserDisplayName,
} from "@/lib/marketplace-brands"
import { useI18n } from "@/components/i18n-provider"
import { formatMessage } from "@/lib/i18n-format"

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
  Security: { icon: Shield, bg: "bg-orange-50", color: "text-orange-700" },
  Communications: { icon: Radio, bg: "bg-violet-50", color: "text-violet-700" },
  "Garden & Harvest": { icon: Sprout, bg: "bg-green-50", color: "text-green-700" },
  "Fire & Cooking": { icon: Flame, bg: "bg-orange-50", color: "text-orange-700" },
  "Air Quality": { icon: Wind, bg: "bg-sky-50", color: "text-sky-700" },
  "Sanitation & Hygiene": { icon: ShowerHead, bg: "bg-teal-50", color: "text-teal-700" },
  Lighting: { icon: Lightbulb, bg: "bg-yellow-50", color: "text-yellow-700" },
  Navigation: { icon: Compass, bg: "bg-cyan-50", color: "text-cyan-700" },
  "Transportation & Vehicle": { icon: Car, bg: "bg-slate-100", color: "text-slate-700" },
  "Pet Preparedness": { icon: Dog, bg: "bg-amber-50", color: "text-amber-700" },
  "Children & Family": { icon: Baby, bg: "bg-pink-50", color: "text-pink-700" },
  "Documents & Finance": { icon: FileText, bg: "bg-stone-100", color: "text-stone-700" },
  Clothing: { icon: Shirt, bg: "bg-rose-50", color: "text-rose-700" },
  "Bartering & Currency": { icon: Coins, bg: "bg-amber-50", color: "text-amber-800" },
}

type Props = {
  hasPro: boolean
  awinProducts: AwinMarketplaceProduct[]
  awinProductCount: number
}

export function MarketplaceView({
  hasPro,
  awinProducts,
  awinProductCount,
}: Props) {
  const { locale, t } = useI18n()
  const [active, setActive] = useState<MarketplaceCategory | "All">("All")
  const [activeSeller, setActiveSeller] = useState<string>("All")
  const [productsOpen, setProductsOpen] = useState(true)
  const [bundlesOpen, setBundlesOpen] = useState(false)

  const amazonProducts = useMemo(
    () => getAmazonProductsForAccess(hasPro),
    [hasPro]
  )

  const awinCatalogProducts = useMemo(
    () => awinProducts.filter((p) => !p.is_store_card),
    [awinProducts]
  )

  const partnerStoreCards = useMemo(
    () => (hasPro ? awinProducts.filter((p) => p.is_store_card) : []),
    [hasPro, awinProducts]
  )

  const visibleProducts = useMemo(
    () => (hasPro ? [...amazonProducts, ...awinCatalogProducts] : amazonProducts),
    [hasPro, amazonProducts, awinCatalogProducts]
  )

  const filterCategories = useMemo(
    () => getMarketplaceFilterCategories(hasPro),
    [hasPro]
  )

  const bundles = useMemo(() => {
    const resolvedPro = hasPro
      ? resolveProMarketplaceBundles({ awinProducts })
      : []
    return getBundlesForAccess(hasPro, resolvedPro)
  }, [hasPro, awinProducts])

  const availableCategories = useMemo(
    () =>
      filterCategories.filter((cat) =>
        visibleProducts.some((p) => p.category === cat)
      ),
    [filterCategories, visibleProducts]
  )

  useEffect(() => {
    if (active !== "All" && !availableCategories.includes(active)) {
      setActive("All")
    }
  }, [active, availableCategories])

  const allSellers = useMemo(
    () => (hasPro ? buildMarketplaceSellers(getAwinSellerDisplayNames()) : ["Amazon"]),
    [hasPro]
  )

  const filteredAmazon = useMemo(() => {
    return amazonProducts.filter((p) => {
      const categoryMatch = active === "All" || p.category === active
      const sellerMatch = activeSeller === "All" || p.seller === activeSeller
      return categoryMatch && sellerMatch
    })
  }, [active, activeSeller, amazonProducts])

  const filteredAwin = useMemo(() => {
    if (!hasPro) return []
    return awinCatalogProducts.filter((p) => {
      const categoryMatch = active === "All" || p.category === active
      const sellerMatch =
        activeSeller === "All" ||
        resolveAdvertiserDisplayName(p.brand_slug, p.advertiser_name) === activeSeller
      return categoryMatch && sellerMatch
    })
  }, [active, activeSeller, awinCatalogProducts, hasPro])

  const totalCount = filteredAmazon.length + filteredAwin.length

  const unfilteredCount = hasPro
    ? getAmazonProductCount(true) + awinProductCount
    : getAmazonProductCount(false)

  const displayCount =
    active === "All" && activeSeller === "All" ? unfilteredCount : totalCount

  const categoryLabel =
    active !== "All"
      ? formatMessage(t("marketplace.in_category"), {
          category: t(`marketplace.categories.${getCategorySlug(active)}.name`),
        })
      : ""

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <h1 className="text-3xl font-light text-[#0d1b2a]">{t("marketplace.title")}</h1>
        <p className="mt-3 max-w-2xl text-sm text-[#3d5166]">
          {formatMessage(t("marketplace.intro"), { count: awinProductCount }, locale)}
        </p>

        <section className="mt-8 rounded-xl border border-[#d4dce8] bg-[#f5f7fa] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8a9bb0]">
            {t("marketplace.browse_category")}
          </p>
          <div className="flex flex-wrap gap-2">
            <CategoryPill
              label={t("common.all")}
              active={active === "All"}
              onClick={() => setActive("All")}
            />
            {availableCategories.map((cat) => (
              <CategoryPill
                key={cat}
                label={t(`marketplace.categories.${getCategorySlug(cat)}.name`)}
                active={active === cat}
                onClick={() => setActive(cat)}
              />
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-[#d4dce8] bg-[#f5f7fa] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8a9bb0]">
            {t("marketplace.browse_seller")}
          </p>
          <div className="flex flex-wrap gap-2">
            <CategoryPill
              label={t("common.all")}
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
          {!hasPro && (
            <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <p className="text-xs text-[#8a9bb0]">{t("marketplace.sellers.pro_unlock")}</p>
              <Link
                href="/plans?from=marketplace"
                className="text-xs font-medium text-[#009b70] hover:underline"
              >
                {t("marketplace.go_pro_cta")}
              </Link>
            </div>
          )}
        </section>

        <section className="mt-10">
          <button
            type="button"
            onClick={() => setProductsOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-xl border border-[#d4dce8] bg-white px-5 py-4 text-left transition-colors hover:border-[#009b70]"
            aria-expanded={productsOpen}
          >
            <span className="text-2xl font-light text-[#0d1b2a]">
              {formatMessage(
                t("marketplace.all_products_heading"),
                { count: displayCount },
                locale
              )}
              {categoryLabel}
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
                  {t("marketplace.empty.no_match")}
                  {awinProducts.length === 0 && hasPro && (
                    <>
                      {" "}
                      {t("marketplace.empty.awin_catalog")}
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
              {formatMessage(
                t("marketplace.bundles_heading"),
                { count: bundles.length },
                locale
              )}
            </span>
            <ChevronDown
              className={`h-5 w-5 text-[#3d5166] transition-transform ${bundlesOpen ? "rotate-180" : ""}`}
            />
          </button>
          {bundlesOpen && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {bundles.map((bundle) => (
                <article
                  key={bundle.name}
                  className="rounded-xl border-2 border-[#009b70]/25 bg-[#f5f7fa] p-5"
                >
                  <h3 className="font-medium text-[#0d1b2a]">{bundleName(bundle.id, bundle.name, t)}</h3>
                  <p className="mt-1 text-sm text-[#3d5166]">{bundleItems(bundle.id, bundle.items, t)}</p>
                  <div className="mt-3 flex items-end gap-3">
                    <span className="text-sm text-[#8a9bb0] line-through">{bundle.original}</span>
                    <span className="text-xl font-semibold text-[#0d1b2a]">{bundle.price}</span>
                    <span className="text-sm font-medium text-[#009b70]">
                      {formatMessage(t("marketplace.bundle_save"), { amount: bundle.savings }, locale)}
                    </span>
                  </div>
                  <a
                    href={bundle.affiliate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block rounded-lg bg-[#009b70] px-4 py-2 text-sm font-medium text-white hover:bg-[#007a58]"
                  >
                    {t("marketplace.view_bundle")}
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>

        {hasPro && partnerStoreCards.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-light text-[#0d1b2a]">
              {t("marketplace.partners_heading")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#3d5166]">
              {t("marketplace.partners_intro")}
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {partnerStoreCards.map((p) => (
                <AwinStoreCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        <p className="mt-10 rounded-xl border border-[#d4dce8] bg-[#f5f7fa] px-4 py-3 text-xs leading-relaxed text-[#3d5166]">
          {t("marketplace.disclosure")}
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
  const { locale, t } = useI18n()
  const meta = categoryMeta[product.category]
  const Icon = meta.icon
  const categoryName = t(`marketplace.categories.${getCategorySlug(product.category)}.name`)
  const copy = getAmazonProductCopy(product, locale)
  const ratingLabel =
    product.rating != null
      ? formatMessage(
          t("marketplace.card.rating"),
          { rating: product.rating, count: product.review_count ?? 0 },
          locale
        )
      : null

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
        {categoryName}
      </p>
      <h3 className="mt-1 text-sm font-medium text-[#0d1b2a]">{copy.name}</h3>
      <p className="mt-1 text-[11px] font-medium text-[#8a9bb0]">{product.seller}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#0d1b2a]">{copy.rationale}</p>
      {ratingLabel && (
        <p className="mt-2 text-xs text-[#8a9bb0]">{ratingLabel}</p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className="font-semibold text-[#0d1b2a]">{product.price}</span>
        <a
          href={product.affiliate}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="rounded-lg bg-[#009b70] px-3 py-1.5 text-xs text-white hover:bg-[#007a58]"
        >
          {t("common.buy")}
        </a>
      </div>
    </article>
  )
}

function AwinProductCard({ product }: { product: AwinMarketplaceProduct }) {
  const { t } = useI18n()
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
        {t(`marketplace.categories.${getCategorySlug(product.category)}.name`)}
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
          <span className="text-xs text-[#8a9bb0]">{t("marketplace.card.see_store")}</span>
        )}
        <a
          href={product.deep_link}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="shrink-0 rounded-lg bg-[#009b70] px-3 py-1.5 text-xs text-white hover:bg-[#007a58]"
        >
          {t("common.buy")}
        </a>
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-wide text-[#8a9bb0]">
        {t("marketplace.card.affiliate_partner")}
      </p>
    </article>
  )
}

function AwinStoreCard({ product }: { product: AwinMarketplaceProduct }) {
  const { t } = useI18n()
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
          {t("marketplace.card.store_badge")}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-[#8a9bb0]">
          {t(`marketplace.categories.${getCategorySlug(product.category)}.name`)}
        </span>
      </div>
      <h3 className="mt-2 text-sm font-medium text-[#0d1b2a]">{displayName}</h3>
      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#3d5166]">
        {t(getMarketplaceBrandDescriptionKey(product.brand_slug))}
      </p>
      <a
        href={product.deep_link}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="mt-4 inline-block rounded-lg bg-[#009b70] px-4 py-2 text-sm font-medium text-white hover:bg-[#007a58]"
      >
        {t("marketplace.card.visit_store")}
      </a>
      <p className="mt-2 text-[10px] uppercase tracking-wide text-[#8a9bb0]">
        {t("marketplace.card.affiliate_partner")}
      </p>
    </article>
  )
}

function bundleName(id: string | undefined, fallback: string, t: (key: string) => string): string {
  if (!id) return fallback
  return t(`marketplace.bundles.${id.startsWith("pro-") ? "pro" : "free"}.${id}.name`)
}

function bundleItems(id: string | undefined, fallback: string, t: (key: string) => string): string {
  if (!id) return fallback
  return t(`marketplace.bundles.${id.startsWith("pro-") ? "pro" : "free"}.${id}.items`)
}

