"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  Circle,
  Lock,
  Mail,
  MessageSquare,
  Newspaper,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react"
import { supabaseClient } from "@/lib/supabase-client"
import { openBillingPortal } from "@/lib/stripe-client"
import { useTier, type Tier } from "@/lib/use-tier"
import { useI18n } from "@/components/i18n-provider"
import type { QuizType } from "@/lib/quiz-data"
import {
  QUIZ_TYPE_LIST,
  type QuizResultSummary,
} from "@/lib/quiz-results-shared"

export type DashboardUser = {
  id: string
  email: string | null
  displayName: string
  tier: Tier
  isDemo: boolean
  canManageSubscription?: boolean
}

export type DashboardQuizData = {
  latest: Partial<Record<QuizType, QuizResultSummary>>
  history: QuizResultSummary[]
}

type DashboardScoreSummary =
  | { status: "none" }
  | { status: "single"; score: number; quizType: QuizType }
  | { status: "both"; score: number }

function computeDashboardScoreSummary(
  latest: Partial<Record<QuizType, QuizResultSummary>>
): DashboardScoreSummary {
  const taken = QUIZ_TYPE_LIST.map((quizType) => latest[quizType]).filter(
    (row): row is QuizResultSummary => Boolean(row)
  )
  if (taken.length === 0) return { status: "none" }
  if (taken.length === 1) {
    return { status: "single", score: taken[0].overall_score, quizType: taken[0].quiz_type }
  }
  const average = Math.round(
    taken.reduce((sum, row) => sum + row.overall_score, 0) / taken.length
  )
  return { status: "both", score: average }
}

function pickMostRecentResult(
  latest: Partial<Record<QuizType, QuizResultSummary>>
): QuizResultSummary | null {
  return (
    QUIZ_TYPE_LIST.map((quizType) => latest[quizType])
      .filter((row): row is QuizResultSummary => Boolean(row))
      .sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())[0] ?? null
  )
}

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

const scoreHistory = [
  { year: 2026, month: 1, overall: 38 },
  { year: 2026, month: 2, overall: 44 },
  { year: 2026, month: 3, overall: 49 },
  { year: 2026, month: 4, overall: 55 },
  { year: 2026, month: 5, overall: 61 },
  { year: 2026, month: 6, overall: 65 },
  { year: 2026, month: 7, overall: 68 },
]

const categoryScores = [
  { nameKey: "dashboard.cat.water", score: 72 },
  { nameKey: "dashboard.cat.food", score: 65 },
  { nameKey: "dashboard.cat.shelter", score: 58 },
  { nameKey: "dashboard.cat.medical", score: 60 },
  { nameKey: "dashboard.cat.community", score: 80 },
]

const newsHeadlines = [
  { titleKey: "dashboard.news.1", href: "/news" },
  { titleKey: "dashboard.news.2", href: "/news" },
  { titleKey: "dashboard.news.3", href: "/news" },
  { titleKey: "dashboard.news.4", href: "/news" },
  { titleKey: "dashboard.news.5", href: "/news" },
]

const monthlyReports = [
  { year: 2026, month: 5, titleKey: "dashboard.report.2026_05" },
  { year: 2026, month: 4, titleKey: "dashboard.report.2026_04" },
  { year: 2026, month: 3, titleKey: "dashboard.report.2026_03" },
  { year: 2026, month: 2, titleKey: "dashboard.report.2026_02" },
  { year: 2026, month: 1, titleKey: "dashboard.report.2026_01" },
]

function asErrorKey(value: unknown): string | null {
  if (typeof value !== "string") return null
  return /^[a-z0-9_.-]+\.[a-z0-9_.-]+$/i.test(value) ? value : null
}

function withError(message: string, error: string): string {
  return message.replace("{error}", error)
}

export function DashboardView({
  user,
  quizData,
}: {
  user: DashboardUser
  quizData?: DashboardQuizData
}) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tier, setTier } = useTier(user.tier)
  const [plan, setPlan] = useState(initialPlan)
  const [chatInput, setChatInput] = useState("")
  const [signOutError, setSignOutError] = useState("")
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [isOpeningPortal, setIsOpeningPortal] = useState(false)
  const [portalError, setPortalError] = useState("")
  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      router.replace("/dashboard")
      router.refresh()
    }
  }, [searchParams, router])

  const dbLatest = quizData?.latest ?? {}
  const scoreSummary = user.isDemo
    ? ({ status: "both", score: scoreHistory[scoreHistory.length - 1]?.overall ?? 0 } as const)
    : computeDashboardScoreSummary(dbLatest)
  const mostRecentResult = user.isDemo ? null : pickMostRecentResult(dbLatest)
  const categoryBreakdown = mostRecentResult
    ? Object.entries(mostRecentResult.category_scores).map(([name, score]) => ({ name, score }))
    : categoryScores.map((c) => ({ name: t(c.nameKey), score: c.score }))
  const proHistory = user.isDemo
    ? scoreHistory
    : (quizData?.history ?? []).map((row) => ({
        year: new Date(row.taken_at).getFullYear(),
        month: new Date(row.taken_at).getMonth() + 1,
        overall: row.overall_score,
      }))

  const [chatLog, setChatLog] = useState<{ role: "user" | "assistant"; text: string }[]>([
    {
      role: "assistant",
      text: t("dashboard.chat_greeting"),
    },
  ])

  useEffect(() => {
    setChatLog((prev) => {
      if (!prev.length || prev[0]?.role !== "assistant") return prev
      return [{ ...prev[0], text: t("dashboard.chat_greeting") }, ...prev.slice(1)]
    })
  }, [t])

  const monthFormatter = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "es-ES", {
    month: "short",
  })

  const formatMonth = (year: number, month: number) =>
    monthFormatter
      .format(new Date(Date.UTC(year, month - 1, 1)))
      .replace(".", "")

  const togglePlanItem = (bucket: keyof typeof plan, id: string) => {
    setPlan((prev) => ({
      ...prev,
      [bucket]: prev[bucket].map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    }))
  }

  const handleManageSubscription = async () => {
    try {
      setIsOpeningPortal(true)
      setPortalError("")
      await openBillingPortal()
    } catch (err) {
      const key = asErrorKey(err instanceof Error ? err.message : null)
      setPortalError(key ? t(key) : t("plans.error.open_billing_portal"))
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
    } catch (err) {
      const key = asErrorKey(err instanceof Error ? err.message : null)
      setSignOutError(key ? t(key) : t("dashboard.error_sign_out"))
    } finally {
      setIsSigningOut(false)
    }
  }

  const deleteAccount = async () => {
    try {
      setIsDeletingAccount(true)
      setDeleteError("")
      setDeleteMessage("")

      const res = await fetch("/api/delete-account", { method: "POST" })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const key = asErrorKey(data?.error)
        setDeleteError(
          key
            ? t(key)
            : withError(t("dashboard.delete_failed"), String(data?.error ?? t("forums.error.unknown")))
        )
        return
      }

      setDeleteMessage(t("dashboard.delete_success"))
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await supabaseClient.auth.signOut().catch(() => undefined)
      document.cookie = "autarkeia-user=; path=/; max-age=0; SameSite=Lax"
      document.cookie = "autarkeia-email=; path=/; max-age=0; SameSite=Lax"
      document.cookie = "autarkeia-tier=; path=/; max-age=0; SameSite=Lax"
      window.dispatchEvent(new Event("autarkeia-auth-change"))
      router.push("/")
      router.refresh()
    } catch (err) {
      const key = asErrorKey(err instanceof Error ? err.message : null)
      setDeleteError(key ? t(key) : withError(t("dashboard.delete_failed"), t("forums.error.unknown")))
    } finally {
      setIsDeletingAccount(false)
    }
  }

  const sendChat = async () => {
    const text = chatInput.trim()
    if (!text) return
    setChatLog((prev) => [...prev, { role: "user", text }])
    setChatInput("")
    // Demo stub — when CLAUDE/Anthropic API is wired this will hit a route
    setChatLog((prev) => [
      ...prev,
      {
        role: "assistant",
        text: t("dashboard.chat_stub"),
      },
    ])
  }

  const isPro = tier === "pro"

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light text-[#0d1b2a]">{t("dashboard.title")}</h1>
            <p className="mt-1 text-sm text-[#3d5166]">
              {t("dashboard.signed_in_as")} <span className="font-medium text-[#0d1b2a]">{user.displayName}</span> ·{" "}
              <span className={`font-medium ${isPro ? "text-[#009b70]" : "text-[#3d5166]"}`}>
                {isPro ? t("dashboard.member_pro") : t("dashboard.member_free")}
              </span>
            </p>
            {!user.isDemo ? (
              <Link
                href="/account"
                className="mt-1 inline-block text-xs font-medium text-[#009b70] hover:underline"
              >
                {t("dashboard.account_settings_link")}
              </Link>
            ) : null}
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            {user.canManageSubscription && (
              <button
                type="button"
                onClick={handleManageSubscription}
                disabled={isOpeningPortal}
                className="rounded-lg border border-[#009b70] bg-white px-4 py-2 text-xs font-medium text-[#009b70] hover:bg-[#e8f8f3] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isOpeningPortal ? t("plans.cta.opening") : t("plans.cta.manage_subscription")}
              </button>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="rounded-lg border border-[#d4dce8] bg-white px-4 py-2 text-xs font-medium text-[#9f1d1d] hover:border-[#c43a3a] hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningOut ? t("dashboard.signing_out") : t("dashboard.sign_out")}
            </button>
            {portalError && <p className="max-w-xs text-right text-xs text-red-600">{portalError}</p>}
            {signOutError && <p className="max-w-xs text-right text-xs text-red-600">{signOutError}</p>}
            {user.isDemo && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8a9bb0]">{t("dashboard.switch_tier")}</span>
                <button
                  type="button"
                  onClick={() => setTier("free")}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    tier === "free" ? "bg-[#0d1b2a] text-white" : "bg-white text-[#3d5166] border border-[#d4dce8]"
                  }`}
                >
                  {t("plans.free")}
                </button>
                <button
                  type="button"
                  onClick={() => setTier("pro")}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    tier === "pro" ? "bg-[#009b70] text-white" : "bg-white text-[#3d5166] border border-[#d4dce8]"
                  }`}
                >
                  Pro
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Score card */}
        <section className="mt-8 rounded-2xl border border-[#d4dce8] bg-white p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">{t("dashboard.quiz_results")}</p>
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
              const result = user.isDemo ? null : dbLatest[quizType]
              return (
                <div
                  key={quizType}
                  className="rounded-xl border border-[#e8edf2] bg-[#fafbfc] p-4"
                  style={{ borderWidth: "0.5px" }}
                >
                  <p className="text-sm font-medium text-[#0d1b2a]">{t(`quiz.${quizType}.title`)}</p>
                  {result ? (
                    <>
                      <p className="mt-2 text-4xl font-light text-[#0d1b2a]">{result.overall_score}%</p>
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
            <div className="mt-6">
              <p className="text-sm font-medium text-[#0d1b2a]">{t("dashboard.category_breakdown")}</p>
              <div className="mt-3 space-y-2">
                {categoryBreakdown.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="w-44 text-sm text-[#3d5166]">{c.name}</span>
                    <div className="h-2 flex-1 rounded-full bg-[#e8eef5]">
                      <div className="h-full rounded-full bg-[#009b70]" style={{ width: `${c.score}%` }} />
                    </div>
                    <span className="w-10 text-right text-sm font-medium text-[#0d1b2a]">{c.score}%</span>
                  </div>
                ))}
              </div>
            </div>
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

        {/* Action plan */}
        <section className="mt-6 rounded-2xl border border-[#d4dce8] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">{t("dashboard.action_plan")}</p>
          <h2 className="mt-1 text-xl font-medium text-[#0d1b2a]">
            {isPro ? t("dashboard.plan_horizons_pro") : t("dashboard.plan_horizons_free")}
          </h2>

          <div className="mt-4 grid gap-6 md:grid-cols-3">
            <PlanColumn
              title={t("dashboard.this_week")}
              items={plan.week}
              onToggle={(id) => togglePlanItem("week", id)}
              isPro={true}
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

          {!isPro && (
            <p className="mt-4 text-xs text-[#8a9bb0]">
              {t("dashboard.free_plan_note")}
            </p>
          )}
        </section>

        {/* Pro: Score history */}
        {isPro && proHistory.length > 0 && (
          <section className="mt-6 rounded-2xl border border-[#d4dce8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
              <TrendingUp className="mr-1 inline h-3 w-3" /> {t("dashboard.score_history")}
            </p>
            <h2 className="mt-1 text-xl font-medium text-[#0d1b2a]">{t("dashboard.trend_over_time")}</h2>
            <div className="mt-4 flex h-32 items-end gap-2">
              {proHistory.map((point) => (
                <div key={`${point.year}-${point.month}`} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-[#009b70]"
                    style={{ height: `${point.overall}%` }}
                    title={`${formatMonth(point.year, point.month)}: ${point.overall}%`}
                  />
                  <span className="text-[10px] text-[#8a9bb0]">{formatMonth(point.year, point.month)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two-column grid: marketplace + library */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-[#d4dce8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
              <ShoppingBag className="mr-1 inline h-3 w-3" /> {t("dashboard.marketplace")}
            </p>
            <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">
              {isPro ? t("dashboard.marketplace_pro") : t("dashboard.marketplace_free")}
            </h2>
            <p className="mt-2 text-sm text-[#3d5166]">
              {isPro
                ? t("dashboard.marketplace_pro_sub")
                : t("dashboard.marketplace_free_sub")}
            </p>
            <Link
              href="/marketplace"
              className="mt-3 inline-block text-sm font-medium text-[#009b70]"
            >
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
              {isPro
                ? t("dashboard.library_pro_sub")
                : t("dashboard.library_free_sub")}
            </p>
            <Link
              href="/library"
              className="mt-3 inline-block text-sm font-medium text-[#009b70]"
            >
              {t("dashboard.open_library")}
            </Link>
          </section>
        </div>

        {/* World News + Communities */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-[#d4dce8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
              <Newspaper className="mr-1 inline h-3 w-3" /> {t("dashboard.world_news")}
            </p>
            <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">{t("dashboard.latest_headlines")}</h2>
            <ul className="mt-3 space-y-2">
              {newsHeadlines.slice(0, isPro ? 5 : 3).map((h) => (
                <li key={h.titleKey}>
                  <Link href={h.href} className="text-sm text-[#3d5166] hover:text-[#009b70]">
                    · {t(h.titleKey)}
                  </Link>
                </li>
              ))}
            </ul>
            {isPro && (
              <div className="mt-4 rounded-lg border border-[#d4dce8] bg-[#f5f7fa] p-3">
                <p className="text-xs font-medium text-[#0d1b2a]">
                  <Mail className="mr-1 inline h-3 w-3" /> {t("dashboard.weekly_briefing")}
                </p>
                <label className="mt-2 flex items-center gap-2 text-xs text-[#3d5166]">
                  <input type="checkbox" defaultChecked /> {t("dashboard.briefing_checkbox")}
                </label>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[#d4dce8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
              <Users className="mr-1 inline h-3 w-3" /> {t("dashboard.communities")}
            </p>
            <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">
              {isPro ? t("dashboard.communities_pro") : t("dashboard.communities_free")}
            </h2>
            <p className="mt-2 text-sm text-[#3d5166]">
              {isPro
                ? t("dashboard.communities_pro_sub")
                : t("dashboard.communities_free_sub")}
            </p>
            <Link
              href="/communities#register-interest"
              className="mt-3 inline-block text-sm font-medium text-[#009b70]"
            >
              {isPro ? t("dashboard.update_preferences") : t("dashboard.register_interest")}
            </Link>
          </section>
        </div>

        {/* Pro: AI chat */}
        {isPro && (
          <section className="mt-6 rounded-2xl border border-[#d4dce8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
              <MessageSquare className="mr-1 inline h-3 w-3" /> {t("dashboard.ai_chat")}
            </p>
            <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">{t("dashboard.ask_claude")}</h2>
            <p className="mt-2 text-sm text-[#3d5166]">
              {t("dashboard.ai_chat_sub")}
            </p>
            <div className="mt-4 space-y-3 rounded-xl bg-[#f5f7fa] p-4">
              {chatLog.map((msg, i) => (
                <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                  <span
                    className={`inline-block max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-[#009b70] text-white"
                        : "bg-white text-[#3d5166] border border-[#d4dce8]"
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
        )}

        {/* Pro: Monthly Global Report */}
        {isPro && (
          <section className="mt-6 rounded-2xl border border-[#d4dce8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
              <Sparkles className="mr-1 inline h-3 w-3" /> {t("dashboard.monthly_report")}
            </p>
            <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">{t("dashboard.newsletter_archive")}</h2>
            <ul className="mt-3 space-y-2 text-sm text-[#3d5166]">
              {monthlyReports.map((report) => (
                <li key={report.titleKey}>
                  · {formatMonth(report.year, report.month)} {report.year} — {t(report.titleKey)}
                </li>
              ))}
            </ul>
          </section>
        )}

        {!user.isDemo && (
        <section className="mt-6 rounded-2xl border border-[#f0c6c6] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9f1d1d]">{t("dashboard.danger_zone")}</p>
              <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">{t("dashboard.delete_account")}</h2>
              <p className="mt-1 max-w-2xl text-sm text-[#3d5166]">
                {t("dashboard.delete_account_desc")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDeleteDialogOpen(true)
                setDeleteError("")
                setDeleteMessage("")
              }}
              className="rounded-lg border border-[#e5a5a5] px-4 py-2 text-sm font-medium text-[#9f1d1d] hover:border-[#c43a3a] hover:bg-[#fff5f5]"
            >
              {t("dashboard.delete_account_btn")}
            </button>
          </div>
        </section>
        )}
      </div>

      {deleteDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d1b2a]/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#d4dce8] bg-white p-6 shadow-xl">
            <h2 className="text-xl font-medium text-[#0d1b2a]">{t("dashboard.delete_confirm_title")}</h2>
            <p className="mt-2 text-sm text-[#3d5166]">
              {t("dashboard.delete_confirm_sub")}
            </p>
            {deleteMessage && <p className="mt-3 text-sm font-medium text-[#009b70]">{deleteMessage}</p>}
            {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeletingAccount || !!deleteMessage}
                className="rounded-lg border border-[#d4dce8] px-4 py-2 text-sm text-[#3d5166] hover:bg-[#f5f7fa] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={deleteAccount}
                disabled={isDeletingAccount || !!deleteMessage}
                className="rounded-lg bg-[#9f1d1d] px-4 py-2 text-sm font-medium text-white hover:bg-[#7f1717] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeletingAccount ? t("dashboard.deleting") : t("dashboard.delete_account_btn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
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
