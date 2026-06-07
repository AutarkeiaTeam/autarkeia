"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Circle, Lock } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { openBillingPortal } from "@/lib/stripe-client"
import { useTier, type Tier } from "@/lib/use-tier"

type ActionItem = { id: string; labelKey: string; done: boolean }

const initialPlan: { week: ActionItem[]; month: ActionItem[]; year: ActionItem[] } = {
  week: [
    { id: "w1", labelKey: "dashboard.plan.w1", done: false },
    { id: "w2", labelKey: "dashboard.plan.w2", done: false },
    { id: "w3", labelKey: "dashboard.plan.w3", done: false },
  ],
  month: [
    { id: "m1", labelKey: "dashboard.plan.m1", done: false },
    { id: "m2", labelKey: "dashboard.plan.m2", done: false },
    { id: "m3", labelKey: "dashboard.plan.m3", done: false },
    { id: "m4", labelKey: "dashboard.plan.m4", done: false },
  ],
  year: [
    { id: "y1", labelKey: "dashboard.plan.y1", done: false },
    { id: "y2", labelKey: "dashboard.plan.y2", done: false },
    { id: "y3", labelKey: "dashboard.plan.y3", done: false },
    { id: "y4", labelKey: "dashboard.plan.y4", done: false },
  ],
}

type OwnerOnlySectionProps = {
  tier: Tier
  canManageSubscription?: boolean
}

export function OwnerOnlySection({ tier: initialTier, canManageSubscription }: OwnerOnlySectionProps) {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tier } = useTier(initialTier)
  const [plan, setPlan] = useState(initialPlan)
  const [isOpeningPortal, setIsOpeningPortal] = useState(false)
  const [portalError, setPortalError] = useState("")

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      const url = new URL(window.location.href)
      url.searchParams.delete("checkout")
      router.replace(url.pathname + url.search)
      router.refresh()
    }
  }, [searchParams, router])

  const isPro = tier === "pro"

  const togglePlanItem = (horizon: "week" | "month" | "year", id: string) => {
    setPlan((prev) => ({
      ...prev,
      [horizon]: prev[horizon].map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      ),
    }))
  }

  const handleManageSubscription = async () => {
    try {
      setIsOpeningPortal(true)
      setPortalError("")
      await openBillingPortal()
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : t("plans.cta.opening"))
    } finally {
      setIsOpeningPortal(false)
    }
  }

  return (
    <section
      className="mt-6 rounded-2xl border border-[#d4dce8] bg-white p-6 sm:p-8"
      style={{ borderWidth: "0.5px" }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[#8a9bb0]">
        {t("profile.owner_only_heading")}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm text-[#3d5166]">{t("profile.owner_plan_label")}</span>
        <span className={`text-sm font-medium ${isPro ? "text-[#009b70]" : "text-[#0d1b2a]"}`}>
          {isPro ? t("dashboard.member_pro") : t("dashboard.member_free")}
        </span>
        {!isPro ? (
          <Link href="/plans" className="text-sm font-medium text-[#009b70] hover:underline">
            {t("dashboard.upgrade_pro")}
          </Link>
        ) : null}
        {canManageSubscription ? (
          <button
            type="button"
            onClick={() => void handleManageSubscription()}
            disabled={isOpeningPortal}
            className="rounded-lg border border-[#009b70] bg-white px-3 py-1.5 text-xs font-medium text-[#009b70] hover:bg-[#e8f8f3] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isOpeningPortal ? t("plans.cta.opening") : t("plans.cta.manage_subscription")}
          </button>
        ) : null}
      </div>
      {portalError ? <p className="mt-2 text-xs text-red-600">{portalError}</p> : null}

      <div className="mt-8 border-t border-[#e8edf2] pt-8" style={{ borderTopWidth: "0.5px" }}>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
          {t("dashboard.action_plan")}
        </p>
        <h2 className="mt-1 text-xl font-medium text-[#0d1b2a]">
          {isPro ? t("dashboard.plan_horizons_pro") : t("dashboard.plan_horizons_free")}
        </h2>

        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <PlanColumn
            title={t("dashboard.this_week")}
            items={plan.week}
            onToggle={(id) => togglePlanItem("week", id)}
            isPro
          />
          <PlanColumn
            title={t("dashboard.30_days")}
            items={plan.month}
            onToggle={(id) => togglePlanItem("month", id)}
            isPro={isPro}
          />
          <PlanColumn
            title={t("dashboard.1_year")}
            items={plan.year}
            onToggle={(id) => togglePlanItem("year", id)}
            isPro={isPro}
          />
        </div>

        {!isPro ? (
          <p className="mt-4 text-xs text-[#8a9bb0]">{t("dashboard.free_plan_note")}</p>
        ) : null}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/quiz/emergency-readiness"
          className="rounded-lg border border-[#d4dce8] px-4 py-2 text-xs font-medium text-[#0d1b2a] hover:border-[#009b70]"
        >
          {t("dashboard.retake_emergency")}
        </Link>
        <Link
          href="/quiz/self-sufficiency"
          className="rounded-lg border border-[#d4dce8] px-4 py-2 text-xs font-medium text-[#0d1b2a] hover:border-[#009b70]"
        >
          {t("dashboard.retake_self")}
        </Link>
      </div>

      <Link
        href="/account"
        className="mt-6 inline-block text-sm font-medium text-[#009b70] hover:underline"
      >
        {t("dashboard.account_settings_link")}
      </Link>
    </section>
  )
}

function PlanColumn({
  title,
  items,
  onToggle,
  isPro,
}: {
  title: string
  items: ActionItem[]
  onToggle: (id: string) => void
  isPro: boolean
}) {
  const { t } = useI18n()
  if (!isPro) {
    return (
      <div className="rounded-xl border border-dashed border-[#d4dce8] bg-[#f9fafc] p-4">
        <p className="text-sm font-medium text-[#0d1b2a]">{title}</p>
        <p className="mt-2 text-xs text-[#3d5166]">
          <Lock className="mr-1 inline h-3 w-3" /> {t("dashboard.plan_locked")}
        </p>
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-[#d4dce8] bg-[#f5f7fa] p-4">
      <p className="text-sm font-medium text-[#0d1b2a]">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onToggle(item.id)}
              className="flex w-full items-start gap-2 text-left text-sm text-[#3d5166] hover:text-[#0d1b2a]"
            >
              {item.done ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#009b70]" />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 text-[#8a9bb0]" />
              )}
              <span className={item.done ? "line-through opacity-60" : ""}>{t(item.labelKey)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
