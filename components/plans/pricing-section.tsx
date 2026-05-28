"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useI18n } from "@/components/i18n-provider"
import { canManageSubscription, hasProSubscriptionStatus } from "@/lib/subscription-shared"
import { startCheckout, openBillingPortal } from "@/lib/stripe-client"

const freeFeatureKeys = [
  "plans.features.free.1",
  "plans.features.free.2",
  "plans.features.free.3",
  "plans.features.free.4",
  "plans.features.free.5",
  "plans.features.free.6",
  "plans.features.free.7",
]

const proFeatureKeys = [
  "plans.features.pro.1",
  "plans.features.pro.2",
  "plans.features.pro.3",
  "plans.features.pro.4",
  "plans.features.pro.5",
  "plans.features.pro.6",
  "plans.features.pro.7",
  "plans.features.pro.8",
  "plans.features.pro.9",
  "plans.features.pro.10",
  "plans.features.pro.11",
]

type Props = {
  isLoggedIn: boolean
  subscriptionStatus: string
}

export function PricingSection({ isLoggedIn, subscriptionStatus }: Props) {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [active, setActive] = useState<"free" | "pro">("pro")
  const [loadingPlan, setLoadingPlan] = useState<"monthly" | "annual" | "portal" | null>(null)
  const [error, setError] = useState("")

  const hasActivePro = hasProSubscriptionStatus(subscriptionStatus)
  const hasManageableSubscription = canManageSubscription(subscriptionStatus)
  const showManageOnly = hasManageableSubscription
  const checkoutCancelled = searchParams.get("checkout") === "cancelled"
  const fromMarketplace = searchParams.get("from") === "marketplace"
  const translateError = (message: string) =>
    message.startsWith("plans.") ? t(message) : message

  const cardClass = (tier: "free" | "pro") =>
    `rounded-2xl bg-white p-6 transition-all duration-200 ${
      active === tier
        ? "border-2 border-[#009b70] shadow-lg"
        : "border border-[#d4dce8] shadow-none"
    }`

  const handleStartTrial = async (plan: "monthly" | "annual") => {
    if (!isLoggedIn) {
      router.push("/login?next=/plans")
      return
    }

    try {
      setLoadingPlan(plan)
      setError("")
      await startCheckout(plan)
    } catch (err) {
      const message = err instanceof Error ? err.message : "plans.error.checkout_failed"
      setError(translateError(message))
      setLoadingPlan(null)
    }
  }

  const handleManage = async () => {
    try {
      setLoadingPlan("portal")
      setError("")
      await openBillingPortal()
    } catch (err) {
      const message = err instanceof Error ? err.message : "plans.error.open_billing_portal"
      setError(translateError(message))
      setLoadingPlan(null)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8">
        <h1 className="text-3xl font-light text-[#0d1b2a]">{t("plans.title")}</h1>
        <p className="mt-3 text-sm text-[#3d5166]">{t("plans.sub")}</p>

        {fromMarketplace && !hasActivePro && (
          <p className="mt-4 rounded-lg border border-[#009b70] bg-[#e8f8f3] px-4 py-3 text-sm text-[#0d1b2a]">
            {t("plans.banner.marketplace")}
          </p>
        )}
        {checkoutCancelled && (
          <p className="mt-4 rounded-lg border border-[#d4dce8] bg-white px-4 py-3 text-sm text-[#3d5166]">
            {t("plans.banner.checkout_cancelled")}
          </p>
        )}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div id="pricing" className="mt-10 grid gap-6 md:grid-cols-2">
          <section
            className={cardClass("free")}
            onMouseEnter={() => setActive("free")}
            onFocus={() => setActive("free")}
          >
            <h2 className="text-xl font-medium text-[#0d1b2a]">{t("plans.free")}</h2>
            <p className="mt-2 text-3xl font-semibold text-[#0d1b2a]">€0</p>
            <ul className="mt-4 space-y-2 text-sm text-[#3d5166]">
              {freeFeatureKeys.map((featureKey) => (
                <li key={featureKey}>• {t(featureKey)}</li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-6 inline-block rounded-lg bg-[#0d1b2a] px-5 py-2.5 text-sm font-medium text-white"
            >
              {t("plans.cta.start_free")}
            </Link>
          </section>

          <section
            className={cardClass("pro")}
            onMouseEnter={() => setActive("pro")}
            onFocus={() => setActive("pro")}
          >
            <h2 className="text-xl font-medium text-[#0d1b2a]">{t("plans.pro")}</h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#009b70]">
              {hasActivePro ? t("plans.pro_status.member") : t("plans.pro_status.trial")}
            </p>

            {showManageOnly ? (
              <div className="mt-4 rounded-xl border border-[#009b70]/30 bg-[#e8f8f3] p-4">
                <p className="text-sm text-[#3d5166]">
                  {t("plans.manage_block.copy")}
                </p>
                <button
                  type="button"
                  onClick={handleManage}
                  disabled={loadingPlan !== null}
                  className="mt-4 w-full rounded-lg bg-[#009b70] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
                >
                  {loadingPlan === "portal" ? t("plans.cta.opening") : t("plans.cta.manage_subscription")}
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-[#d4dce8] bg-[#f9fafc] p-4">
                  <p className="text-2xl font-semibold text-[#0d1b2a]">
                    €7<span className="text-base font-normal text-[#3d5166]">{t("plans.pricing.per_month")}</span>
                  </p>
                  <p className="mt-1 text-xs text-[#8a9bb0]">{t("plans.pricing.monthly_after_trial")}</p>
                  <button
                    type="button"
                    onClick={() => handleStartTrial("monthly")}
                    disabled={loadingPlan !== null}
                    className="mt-4 w-full rounded-lg bg-[#009b70] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
                  >
                    {loadingPlan === "monthly" ? t("plans.cta.redirecting") : t("plans.cta.start_trial")}
                  </button>
                </div>

                <div className="rounded-xl border border-[#009b70]/30 bg-[#e8f8f3] p-4">
                  <p className="text-2xl font-semibold text-[#0d1b2a]">
                    €69<span className="text-base font-normal text-[#3d5166]">{t("plans.pricing.per_year")}</span>
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#009b70]">{t("plans.pricing.save_vs_monthly")}</p>
                  <p className="mt-1 text-xs text-[#8a9bb0]">{t("plans.pricing.annual_after_trial")}</p>
                  <button
                    type="button"
                    onClick={() => handleStartTrial("annual")}
                    disabled={loadingPlan !== null}
                    className="mt-4 w-full rounded-lg bg-[#0d1b2a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0d1b2a]/90 disabled:opacity-60"
                  >
                    {loadingPlan === "annual" ? t("plans.cta.redirecting") : t("plans.cta.start_trial")}
                  </button>
                </div>
              </div>
            )}

            <ul className="mt-4 space-y-2 text-sm text-[#3d5166]">
              {proFeatureKeys.map((featureKey) => (
                <li key={featureKey}>• {t(featureKey)}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
