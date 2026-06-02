"use client"

import Link from "next/link"
import { useI18n } from "@/components/i18n-provider"

export function MarketplacePaywall() {
  const { t } = useI18n()
  const teaserCategories = [
    t("marketplace.paywall.teaser.power"),
    t("marketplace.paywall.teaser.outdoor"),
    t("marketplace.paywall.teaser.gardening"),
    t("marketplace.paywall.teaser.water"),
    t("marketplace.paywall.teaser.air_quality"),
    t("marketplace.paywall.teaser.preparedness"),
  ]

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
          {t("marketplace.paywall.badge")}
        </p>
        <h1 className="mt-3 text-3xl font-light text-[#0d1b2a]">{t("marketplace.paywall.title")}</h1>
        <p className="mt-4 text-sm leading-relaxed text-[#3d5166]">
          {t("marketplace.paywall.description")}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {teaserCategories.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-[#d4dce8] bg-[#f5f7fa] px-3 py-1 text-xs text-[#3d5166]"
            >
              {cat}
            </span>
          ))}
        </div>

        <Link
          href="/plans?from=marketplace"
          className="mt-8 inline-block rounded-lg bg-[#009b70] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#007a58]"
        >
          {t("marketplace.paywall.cta")}
        </Link>
        <p className="mt-4 text-xs text-[#8a9bb0]">
          {t("marketplace.paywall.already_subscribed")}{" "}
          <Link href="/login" className="text-[#009b70] hover:underline">
            {t("marketplace.paywall.sign_in")}
          </Link>
        </p>
      </div>
    </main>
  )
}
