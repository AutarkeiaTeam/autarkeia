"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useI18n } from "@/components/i18n-provider"
import { canManageSubscription } from "@/lib/subscription-shared"
import { startCheckout, openBillingPortal } from "@/lib/stripe-client"

const freeFeatures = [
  "Both quizzes (Emergency Readiness + Self-Sufficiency)",
  "Basic score — overall percentage only",
  "3 action items for this week only",
  "Limited Marketplace access (only Amazon)",
  "Limited library access",
  "World News Watch headlines",
  "Autarkeia Communities access — register interest, get updates on community development",
]

const proFeatures = [
  "Everything in Free",
  "Full score breakdown across all 5 categories",
  "Complete action plan — this week, 30 days, 1 year",
  "Plan saved to account and updated as you progress",
  "Score history — track improvement over time",
  "Full Marketplace access (all sellers)",
  "Full library — all guides, books, films, courses, apps",
  "World News Watch weekly email briefing every Monday",
  "AI chat — ask Claude about your specific situation, location and household",
  "Priority Autarkeia Communities access",
  "Monthly Global Report & Newsletter",
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

  const hasManageableSubscription = canManageSubscription(subscriptionStatus)
  const checkoutCancelled = searchParams.get("checkout") === "cancelled"

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
      setError(err instanceof Error ? err.message : "Checkout failed")
      setLoadingPlan(null)
    }
  }

  const handleManage = async () => {
    try {
      setLoadingPlan("portal")
      setError("")
      await openBillingPortal()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open billing portal")
      setLoadingPlan(null)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8">
        <h1 className="text-3xl font-light text-[#0d1b2a]">{t("plans.title")}</h1>
        <p className="mt-3 text-sm text-[#3d5166]">{t("plans.sub")}</p>

        {checkoutCancelled && (
          <p className="mt-4 rounded-lg border border-[#d4dce8] bg-white px-4 py-3 text-sm text-[#3d5166]">
            Checkout cancelled. You can start a free trial whenever you&apos;re ready.
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
              {freeFeatures.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-6 inline-block rounded-lg bg-[#0d1b2a] px-5 py-2.5 text-sm font-medium text-white"
            >
              Start free
            </Link>
          </section>

          <section
            className={cardClass("pro")}
            onMouseEnter={() => setActive("pro")}
            onFocus={() => setActive("pro")}
          >
            <h2 className="text-xl font-medium text-[#0d1b2a]">{t("plans.pro")}</h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#009b70]">
              3-day free trial · card required
            </p>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-[#d4dce8] bg-[#f9fafc] p-4">
                <p className="text-2xl font-semibold text-[#0d1b2a]">
                  €7<span className="text-base font-normal text-[#3d5166]">/month</span>
                </p>
                <p className="mt-1 text-xs text-[#8a9bb0]">Billed monthly after trial</p>
                {hasManageableSubscription ? (
                  <button
                    type="button"
                    onClick={handleManage}
                    disabled={loadingPlan !== null}
                    className="mt-4 w-full rounded-lg border border-[#009b70] bg-white px-4 py-2.5 text-sm font-medium text-[#009b70] hover:bg-[#e8f8f3] disabled:opacity-60"
                  >
                    {loadingPlan === "portal" ? "Opening…" : "Manage subscription"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStartTrial("monthly")}
                    disabled={loadingPlan !== null}
                    className="mt-4 w-full rounded-lg bg-[#009b70] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
                  >
                    {loadingPlan === "monthly" ? "Redirecting…" : "Start free trial"}
                  </button>
                )}
              </div>

              <div className="rounded-xl border border-[#009b70]/30 bg-[#e8f8f3] p-4">
                <p className="text-2xl font-semibold text-[#0d1b2a]">
                  €69<span className="text-base font-normal text-[#3d5166]">/year</span>
                </p>
                <p className="mt-1 text-sm font-medium text-[#009b70]">Save €15 vs monthly</p>
                <p className="mt-1 text-xs text-[#8a9bb0]">Billed annually after trial</p>
                {!hasManageableSubscription && (
                  <button
                    type="button"
                    onClick={() => handleStartTrial("annual")}
                    disabled={loadingPlan !== null}
                    className="mt-4 w-full rounded-lg bg-[#0d1b2a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0d1b2a]/90 disabled:opacity-60"
                  >
                    {loadingPlan === "annual" ? "Redirecting…" : "Start free trial"}
                  </button>
                )}
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-[#3d5166]">
              {proFeatures.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
