"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  Circle,
  Lock,
  MessageSquare,
  Newspaper,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"
import { useI18n } from "@/components/i18n-provider"
import { openBillingPortal } from "@/lib/stripe-client"
import { supabaseClient } from "@/lib/supabase-client"
import { useTier, type Tier } from "@/lib/use-tier"
import type { QuizType } from "@/lib/quiz-data"
import {
  QUIZ_TYPE_LIST,
  type QuizResultSummary,
} from "@/lib/quiz-results-shared"
import {
  computeDashboardScoreSummary,
  getScoreColor,
  pickMostRecentResult,
} from "@/lib/dashboard-score"
import type { NewsWidgetArticle } from "@/lib/news-widget"

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
  displayName: string
  avatarUrl: string | null
  initials: string
  tier: Tier
  canManageSubscription?: boolean
  quizLatest: Partial<Record<QuizType, QuizResultSummary>>
  quizHistory: QuizResultSummary[]
  newsArticles: NewsWidgetArticle[]
}

export function OwnerOnlySection({
  displayName,
  avatarUrl,
  initials,
  tier: initialTier,
  canManageSubscription,
  quizLatest,
  quizHistory,
  newsArticles,
}: OwnerOnlySectionProps) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tier } = useTier(initialTier)
  const [plan, setPlan] = useState(initialPlan)
  const [isOpeningPortal, setIsOpeningPortal] = useState(false)
  const [portalError, setPortalError] = useState("")
  const [signOutError, setSignOutError] = useState("")
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatLog, setChatLog] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: t("dashboard.chat_greeting") },
  ])

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      const url = new URL(window.location.href)
      url.searchParams.delete("checkout")
      router.replace(url.pathname + url.search)
      router.refresh()
    }
  }, [searchParams, router])

  useEffect(() => {
    setChatLog((prev) => {
      if (!prev.length || prev[0]?.role !== "assistant") return prev
      return [{ ...prev[0], text: t("dashboard.chat_greeting") }, ...prev.slice(1)]
    })
  }, [t])

  const isPro = tier === "pro"
  const scoreSummary = computeDashboardScoreSummary(quizLatest)
  const mostRecentResult = pickMostRecentResult(quizLatest)
  const categoryBreakdown = mostRecentResult
    ? Object.entries(mostRecentResult.category_scores).map(([name, score]) => ({ name, score }))
    : []
  const proHistory = quizHistory.map((row) => ({
    year: new Date(row.taken_at).getFullYear(),
    month: new Date(row.taken_at).getMonth() + 1,
    overall: row.overall_score,
  }))

  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "es-ES", {
        month: "short",
      }),
    [locale]
  )

  const formatMonth = (year: number, month: number) =>
    monthFormatter.format(new Date(Date.UTC(year, month - 1, 1))).replace(".", "")

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
      setPortalError(err instanceof Error ? err.message : t("plans.error.open_billing_portal"))
    } finally {
      setIsOpeningPortal(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      setSignOutError("")
      await supabaseClient.auth.signOut()
      document.cookie = "autarkeia-user=; path=/; max-age=0; SameSite=Lax"
      document.cookie = "autarkeia-email=; path=/; max-age=0; SameSite=Lax"
      document.cookie = "autarkeia-tier=; path=/; max-age=0; SameSite=Lax"
      window.dispatchEvent(new Event("autarkeia-auth-change"))
      router.push("/")
      router.refresh()
    } catch {
      setSignOutError(t("dashboard.error_sign_out"))
    } finally {
      setIsSigningOut(false)
    }
  }

  const sendChat = () => {
    const text = chatInput.trim()
    if (!text) return
    setChatLog((prev) => [...prev, { role: "user", text }])
    setChatInput("")
    setChatLog((prev) => [...prev, { role: "assistant", text: t("dashboard.chat_stub") }])
  }

  const categoryLabel = (name: string) => {
    const key = `quiz.category.${name}`
    const translated = t(key)
    return translated === key ? name : translated
  }

  return (
    <div className="mt-6 space-y-6">
      <section
        className="rounded-2xl border border-[#d4dce8] bg-white p-6"
        style={{ borderWidth: "0.5px" }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8a9bb0]">
              {t("profile.owner_only_heading")}
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#3d5166]">
              <UserAvatar src={avatarUrl} fallbackInitials={initials} size={24} />
              <span>
                {t("dashboard.signed_in_as")}{" "}
                <span className="font-medium text-[#0d1b2a]">{displayName}</span> ·{" "}
                <span className={`font-medium ${isPro ? "text-[#009b70]" : "text-[#3d5166]"}`}>
                  {isPro ? t("dashboard.member_pro") : t("dashboard.member_free")}
                </span>
              </span>
            </p>
            {!isPro ? (
              <Link
                href="/plans"
                className="mt-2 inline-block text-sm font-medium text-[#009b70] hover:underline"
              >
                {t("dashboard.upgrade_pro")}
              </Link>
            ) : null}
            <Link
              href="/account"
              className="mt-1 block text-xs font-medium text-[#009b70] hover:underline"
            >
              {t("dashboard.account_settings_link")}
            </Link>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            {canManageSubscription ? (
              <button
                type="button"
                onClick={() => void handleManageSubscription()}
                disabled={isOpeningPortal}
                className="rounded-lg border border-[#009b70] bg-white px-4 py-2 text-xs font-medium text-[#009b70] hover:bg-[#e8f8f3] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isOpeningPortal ? t("plans.cta.opening") : t("plans.cta.manage_subscription")}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => void handleSignOut()}
              disabled={isSigningOut}
              className="rounded-lg border border-[#d4dce8] bg-white px-4 py-2 text-xs font-medium text-[#9f1d1d] hover:border-[#c43a3a] hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningOut ? t("dashboard.signing_out") : t("dashboard.sign_out")}
            </button>
            {portalError ? <p className="max-w-xs text-right text-xs text-red-600">{portalError}</p> : null}
            {signOutError ? <p className="max-w-xs text-right text-xs text-red-600">{signOutError}</p> : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#d4dce8] bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
              {t("dashboard.quiz_results")}
            </p>
            {scoreSummary.status === "none" ? (
              <p className="mt-1 text-lg font-light text-[#3d5166]">{t("dashboard.score_take_quiz")}</p>
            ) : scoreSummary.status === "single" ? (
              <>
                <p className="mt-1 text-3xl font-light text-[#0d1b2a]">
                  {t("dashboard.score_latest").replace("{score}", String(scoreSummary.score))}
                </p>
                <p className="mt-1 text-sm text-[#3d5166]">
                  {t("dashboard.score_based_on_single").replace(
                    "{quiz}",
                    t(`quiz.${scoreSummary.quizType}.title`)
                  )}
                </p>
                <p className="mt-1 text-xs text-[#8a9bb0]">{t("dashboard.score_take_both_hint")}</p>
              </>
            ) : (
              <>
                <p className="mt-1 text-3xl font-light text-[#0d1b2a]">
                  {t("dashboard.score_overall").replace("{score}", String(scoreSummary.score))}
                </p>
                <p className="mt-1 text-sm text-[#3d5166]">{t("dashboard.score_based_on")}</p>
              </>
            )}
          </div>
          <div className="flex gap-2">
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
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {QUIZ_TYPE_LIST.map((quizType) => {
            const result = quizLatest[quizType]
            return (
              <div
                key={quizType}
                className="rounded-xl border border-[#e8edf2] bg-[#fafbfc] p-4"
                style={{ borderWidth: "0.5px" }}
              >
                <p className="text-sm font-medium text-[#0d1b2a]">{t(`quiz.${quizType}.title`)}</p>
                {result ? (
                  <>
                    <p
                      className="mt-2 text-4xl font-light"
                      style={{ color: getScoreColor(result.overall_score) }}
                    >
                      {result.overall_score}%
                    </p>
                    <p className="mt-1 text-sm text-[#3d5166]">
                      {t(`quiz.${quizType}.verdict.${result.verdict_level}`)}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-[#8a9bb0]">{t("dashboard.quiz_not_taken")}</p>
                )}
              </div>
            )
          })}
        </div>

        {isPro ? (
          categoryBreakdown.length > 0 ? (
            <div className="mt-6">
              <p className="text-sm font-medium text-[#0d1b2a]">{t("dashboard.category_breakdown")}</p>
              <div className="mt-3 space-y-2">
                {categoryBreakdown.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="w-44 shrink-0 text-sm text-[#3d5166]">{categoryLabel(c.name)}</span>
                    <div className="h-2 flex-1 rounded-full bg-[#e8eef5]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${c.score}%`, backgroundColor: getScoreColor(c.score) }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-sm font-medium text-[#0d1b2a]">
                      {c.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-[#d4dce8] bg-[#f9fafc] p-4">
            <p className="text-sm text-[#3d5166]">
              <Lock className="mr-1 inline h-3 w-3" /> {t("dashboard.pro_breakdown_locked")}
            </p>
            <Link href="/plans" className="mt-2 inline-block text-sm font-medium text-[#009b70]">
              {t("dashboard.upgrade_pro")}
            </Link>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#d4dce8] bg-white p-6">
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
      </section>

      {isPro && proHistory.length > 0 ? (
        <section className="rounded-2xl border border-[#d4dce8] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
            <TrendingUp className="mr-1 inline h-3 w-3" /> {t("dashboard.score_history")}
          </p>
          <h2 className="mt-1 text-xl font-medium text-[#0d1b2a]">{t("dashboard.trend_over_time")}</h2>
          <div className="mt-4 flex h-32 items-end gap-2">
            {[...proHistory].reverse().slice(0, 12).map((point, index) => (
              <div
                key={`${point.year}-${point.month}-${index}`}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${point.overall}%`,
                    backgroundColor: getScoreColor(point.overall),
                  }}
                  title={`${formatMonth(point.year, point.month)}: ${point.overall}%`}
                />
                <span className="text-[10px] text-[#8a9bb0]">{formatMonth(point.year, point.month)}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-[#d4dce8] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
            <ShoppingBag className="mr-1 inline h-3 w-3" /> {t("dashboard.marketplace")}
          </p>
          <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">
            {isPro ? t("dashboard.marketplace_pro") : t("dashboard.marketplace_free")}
          </h2>
          <p className="mt-2 text-sm text-[#3d5166]">
            {isPro ? t("dashboard.marketplace_pro_sub") : t("dashboard.marketplace_free_sub")}
          </p>
          <Link href="/marketplace" className="mt-3 inline-block text-sm font-medium text-[#009b70]">
            {t("dashboard.open_marketplace")}
          </Link>
        </section>

        <section className="rounded-2xl border border-[#d4dce8] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
            <Newspaper className="mr-1 inline h-3 w-3" /> {t("dashboard.library")}
          </p>
          <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">
            {isPro ? t("dashboard.library_pro") : t("dashboard.library_free")}
          </h2>
          <p className="mt-2 text-sm text-[#3d5166]">
            {isPro ? t("dashboard.library_pro_sub") : t("dashboard.library_free_sub")}
          </p>
          <Link href="/library" className="mt-3 inline-block text-sm font-medium text-[#009b70]">
            {t("dashboard.open_library")}
          </Link>
        </section>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-[#d4dce8] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
            <Newspaper className="mr-1 inline h-3 w-3" /> {t("dashboard.world_news")}
          </p>
          <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">{t("dashboard.latest_headlines")}</h2>
          <ul className="mt-3 space-y-2">
            {newsArticles.length === 0 ? (
              <li>
                <Link href="/news" className="text-sm text-[#009b70] hover:underline">
                  {t("nav.news")} →
                </Link>
              </li>
            ) : (
              newsArticles.slice(0, isPro ? 5 : 3).map((article) => (
                <li key={article.id}>
                  {article.isExternal ? (
                    <a
                      href={article.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#3d5166] hover:text-[#009b70]"
                    >
                      · {article.title}
                    </a>
                  ) : (
                    <Link href={article.href} className="text-sm text-[#3d5166] hover:text-[#009b70]">
                      · {article.title}
                    </Link>
                  )}
                </li>
              ))
            )}
          </ul>
          <Link href="/news" className="mt-3 inline-block text-sm font-medium text-[#009b70]">
            {t("nav.news")} →
          </Link>
        </section>

        <section className="rounded-2xl border border-[#d4dce8] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
            <Users className="mr-1 inline h-3 w-3" /> {t("dashboard.communities")}
          </p>
          <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">
            {isPro ? t("dashboard.communities_pro") : t("dashboard.communities_free")}
          </h2>
          <p className="mt-2 text-sm text-[#3d5166]">
            {isPro ? t("dashboard.communities_pro_sub") : t("dashboard.communities_free_sub")}
          </p>
          <Link
            href="/communities#register-interest"
            className="mt-3 inline-block text-sm font-medium text-[#009b70]"
          >
            {isPro ? t("dashboard.update_preferences") : t("dashboard.register_interest")}
          </Link>
        </section>
      </div>

      {isPro ? (
        <section className="rounded-2xl border border-[#d4dce8] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
            <MessageSquare className="mr-1 inline h-3 w-3" /> {t("dashboard.ai_chat")}
          </p>
          <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">{t("dashboard.ask_claude")}</h2>
          <p className="mt-2 text-sm text-[#3d5166]">{t("dashboard.ai_chat_sub")}</p>
          <div className="mt-4 space-y-3 rounded-xl bg-[#f5f7fa] p-4">
            {chatLog.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                <span
                  className={`inline-block max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-[#009b70] text-white"
                      : "border border-[#d4dce8] bg-white text-[#3d5166]"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder={t("dashboard.chat_placeholder")}
              className="flex-1 rounded-lg border border-[#d4dce8] px-3 py-2 text-sm outline-none focus:border-[#009b70]"
            />
            <button
              onClick={sendChat}
              className="rounded-lg bg-[#009b70] px-4 py-2 text-sm font-medium text-white hover:bg-[#007a58]"
            >
              {t("common.send")}
            </button>
          </div>
        </section>
      ) : null}
    </div>
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
