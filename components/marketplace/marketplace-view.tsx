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
  getAmazonProductCopy,
  getCategorySlug,
  getCuratedProductCount,
  getCuratedProductsForAccess,
  getMarketplaceFilterCategories,
  type MarketplaceCategory,
  type MarketplaceProduct,
} from "@/lib/marketplace-data"
import {
  getBundlesForAccess,
  marketplaceBundlesProDefinitions,
} from "@/lib/marketplace-bundles"
import type { MarketplaceBundle } from "@/lib/marketplace-data"
import { marketplaceBundlesFree } from "@/lib/marketplace-data"
import { BRAND_PLACEHOLDER_COLORS, getBrandInitials } from "@/lib/marketplace-brand-ui"
import {
  getBrandByDisplayName,
  getMarketplaceBrandDescriptionKey,
  getMarketplaceSellerFilterNames,
  resolveAffiliateLink,
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

type MainTab = "products" | "bundles"

type Props = {
  hasPro: boolean
}

export function MarketplaceView({ hasPro }: Props) {
  const { locale, t } = useI18n()
  const [mainTab, setMainTab] = useState<MainTab>("products")
  const [active, setActive] = useState<MarketplaceCategory | "All">("All")
  const [activeSeller, setActiveSeller] = useState<string>("All")
  const [resolvedProBundles, setResolvedProBundles] = useState<MarketplaceBundle[]>([])
  const [proBundlesLoading, setProBundlesLoading] = useState(false)
  const [proBundlesError, setProBundlesError] = useState(false)

  const curatedProducts = useMemo(
    () => getCuratedProductsForAccess(hasPro),
    [hasPro]
  )

  const curatedProductCount = useMemo(() => getCuratedProductCount(hasPro), [hasPro])

  const filterCategories = useMemo(
    () => getMarketplaceFilterCategories(hasPro),
    [hasPro]
  )

  useEffect(() => {
    if (!hasPro || mainTab !== "bundles" || resolvedProBundles.length > 0 || proBundlesLoading) {
      return
    }

    let cancelled = false
    setProBundlesLoading(true)
    setProBundlesError(false)

    fetch("/api/marketplace/pro-bundles")
      .then(async (res) => {
        if (!res.ok) throw new Error(`pro-bundles ${res.status}`)
        return res.json() as Promise<{ bundles?: MarketplaceBundle[] }>
      })
      .then((data) => {
        if (!cancelled) setResolvedProBundles(data.bundles ?? [])
      })
      .catch(() => {
        if (!cancelled) setProBundlesError(true)
      })
      .finally(() => {
        if (!cancelled) setProBundlesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [hasPro, mainTab, resolvedProBundles.length, proBundlesLoading])

  const bundles = useMemo(
    () => getBundlesForAccess(hasPro, resolvedProBundles),
    [hasPro, resolvedProBundles]
  )

  const bundleHeadingCount = hasPro
    ? marketplaceBundlesFree.length + marketplaceBundlesProDefinitions.length
    : marketplaceBundlesFree.length

  const availableCategories = useMemo(
    () =>
      filterCategories.filter((cat) =>
        curatedProducts.some((p) => p.category === cat)
      ),
    [filterCategories, curatedProducts]
  )

  useEffect(() => {
    if (active !== "All" && !availableCategories.includes(active)) {
      setActive("All")
    }
  }, [active, availableCategories])

  const allSellers = useMemo(
    () => getMarketplaceSellerFilterNames(hasPro),
    [hasPro]
  )

  const filteredProducts = useMemo(() => {
    return curatedProducts.filter((p) => {
      const categoryMatch = active === "All" || p.category === active
      const sellerMatch = activeSeller === "All" || p.seller === activeSeller
      return categoryMatch && sellerMatch
    })
  }, [active, activeSeller, curatedProducts])

  const activeBrand = useMemo(() => {
    if (activeSeller === "All" || activeSeller === "Amazon") return null
    return getBrandByDisplayName(activeSeller) ?? null
  }, [activeSeller])

  const brandStoreLink = useMemo(() => {
    if (!activeBrand) return null
    return resolveAffiliateLink(activeBrand, locale.startsWith("es") ? "ES" : "US")
  }, [activeBrand, locale])

  const displayCount =
    active === "All" && activeSeller === "All"
      ? curatedProductCount
      : filteredProducts.length

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
          {formatMessage(t("marketplace.intro"), { count: curatedProductCount }, locale)}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TabButton
            active={mainTab === "products"}
            onClick={() => setMainTab("products")}
            label={formatMessage(
              t("marketplace.all_products_heading"),
              { count: curatedProductCount },
              locale
            )}
          />
          <TabButton
            active={mainTab === "bundles"}
            onClick={() => setMainTab("bundles")}
            label={formatMessage(
              t("marketplace.bundles_heading"),
              { count: bundleHeadingCount },
              locale
            )}
          />
        </div>

        {mainTab === "products" && (
          <>
            <button
              type="button"
              onClick={() => setMainTab("bundles")}
              className="mt-6 w-full rounded-xl border border-[#009b70]/30 bg-[#f5f7fa] px-4 py-3 text-left text-sm text-[#3d5166] transition-colors hover:border-[#009b70]"
            >
              {t("marketplace.bundles_tip")}
            </button>

            <section className="mt-4 rounded-xl border border-[#d4dce8] bg-[#f5f7fa] p-4">
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

            <section className="mt-6">
              <h2 className="text-xl font-light text-[#0d1b2a]">
                {formatMessage(
                  t("marketplace.all_products_heading"),
                  { count: displayCount },
                  locale
                )}
                {categoryLabel}
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeBrand && brandStoreLink && (
                  <BrandStoreCard
                    brandSlug={activeBrand.id}
                    displayName={activeSeller}
                    category={activeBrand.primaryCategory}
                    deepLink={brandStoreLink.url}
                    storeOnly={filteredProducts.length === 0}
                  />
                )}

                {filteredProducts.map((p) => (
                  <CuratedProductCard key={`${p.source}-${p.sku}`} product={p} />
                ))}

                {activeSeller !== "All" &&
                  activeSeller !== "Amazon" &&
                  filteredProducts.length === 0 &&
                  !activeBrand && (
                    <p className="col-span-full py-8 text-center text-sm text-[#8a9bb0]">
                      {t("marketplace.empty.no_match")}
                    </p>
                  )}

                {active === "All" &&
                  activeSeller === "All" &&
                  filteredProducts.length === 0 && (
                    <p className="col-span-full py-8 text-center text-sm text-[#8a9bb0]">
                      {t("marketplace.empty.no_match")}
                    </p>
                  )}
              </div>
            </section>
          </>
        )}

        {mainTab === "bundles" && (
          <section className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {proBundlesLoading && hasPro && (
                <p className="col-span-full text-center text-sm text-[#8a9bb0]">
                  {t("marketplace.bundles_loading")}
                </p>
              )}
              {proBundlesError && hasPro && resolvedProBundles.length === 0 && (
                <p className="col-span-full text-center text-sm text-[#8a9bb0]">
                  {t("marketplace.bundles_load_error")}
                </p>
              )}
              {bundles.map((bundle) => (
                <article
                  key={bundle.name}
                  className="rounded-xl border-2 border-[#009b70]/25 bg-[#f5f7fa] p-5"
                >
                  <h3 className="font-medium text-[#0d1b2a]">
                    {bundleName(bundle.id, bundle.name, t)}
                  </h3>
                  <p className="mt-1 text-sm text-[#3d5166]">
                    {bundleItems(bundle.id, bundle.items, t)}
                  </p>
                  <div className="mt-3 flex items-end gap-3">
                    <span className="text-sm text-[#8a9bb0] line-through">{bundle.original}</span>
                    <span className="text-xl font-semibold text-[#0d1b2a]">{bundle.price}</span>
                    <span className="text-sm font-medium text-[#009b70]">
                      {formatMessage(
                        t("marketplace.bundle_save"),
                        { amount: bundle.savings },
                        locale
                      )}
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
          </section>
        )}

        <p className="mt-10 rounded-xl border border-[#d4dce8] bg-[#f5f7fa] px-4 py-3 text-xs leading-relaxed text-[#3d5166]">
          {t("marketplace.disclosure")}
        </p>
      </div>
    </main>
  )
}

function TabButton({
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
      className={`flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left transition-colors ${
        active
          ? "border-[#009b70] bg-white text-[#0d1b2a]"
          : "border-[#d4dce8] bg-white text-[#3d5166] hover:border-[#009b70]/50"
      }`}
    >
      <span className="text-xl font-light">{label}</span>
      <ChevronDown
        className={`h-5 w-5 transition-transform ${active ? "rotate-180 text-[#009b70]" : ""}`}
      />
    </button>
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

function CuratedProductCard({ product }: { product: MarketplaceProduct }) {
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
      {ratingLabel && <p className="mt-2 text-xs text-[#8a9bb0]">{ratingLabel}</p>}
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
      {product.source === "awin" && (
        <p className="mt-2 text-[10px] uppercase tracking-wide text-[#8a9bb0]">
          {t("marketplace.card.affiliate_partner")}
        </p>
      )}
    </article>
  )
}

function BrandStoreCard({
  brandSlug,
  displayName,
  category,
  deepLink,
  storeOnly,
}: {
  brandSlug: string
  displayName: string
  category: MarketplaceCategory
  deepLink: string
  storeOnly: boolean
}) {
  const { locale, t } = useI18n()
  const color = BRAND_PLACEHOLDER_COLORS[brandSlug] ?? "#009b70"

  return (
    <article
      className={`rounded-xl border p-4 transition-colors hover:border-[#009b70] ${
        storeOnly ? "col-span-full border-2 border-[#009b70]/30 bg-[#f5f7fa] md:col-span-2 lg:col-span-3" : "border-[#d4dce8]"
      }`}
    >
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
          {t(`marketplace.categories.${getCategorySlug(category)}.name`)}
        </span>
      </div>
      <h3 className="mt-2 text-sm font-medium text-[#0d1b2a]">{displayName}</h3>
      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#3d5166]">
        {storeOnly
          ? formatMessage(t("marketplace.brand_store_only"), { brand: displayName }, locale)
          : t(getMarketplaceBrandDescriptionKey(brandSlug))}
      </p>
      <a
        href={deepLink}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="mt-4 inline-block rounded-lg bg-[#009b70] px-4 py-2 text-sm font-medium text-white hover:bg-[#007a58]"
      >
        {formatMessage(t("marketplace.card.visit_brand_store"), { brand: displayName }, locale)}
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
