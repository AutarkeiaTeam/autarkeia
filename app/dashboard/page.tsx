import { Suspense } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { DashboardView, type DashboardUser } from "@/components/dashboard/dashboard-view"
import { getTier, type Tier } from "@/lib/auth-server"
import { fetchLatestQuizSummariesForUser, fetchQuizResultHistorySummaries } from "@/lib/quiz-results"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"
import { resolveDisplayName } from "@/lib/account"
import { initialsFromDisplayName } from "@/lib/avatar-initials"
import { canManageSubscription, getProfileSubscription } from "@/lib/subscription"
import { createClient } from "@/lib/supabase/server"

function decodeCookieValue(value: string | undefined): string | null {
  if (!value) return null
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function displayNameFromUser(
  user: {
  email?: string | null
  user_metadata?: Record<string, unknown>
  },
  memberFallback: string
): string {
  if (user.email) return user.email
  const first = user.user_metadata?.first_name
  const last = user.user_metadata?.last_name
  if (typeof first === "string" && first) {
    return typeof last === "string" && last ? `${first} ${last}` : first
  }
  return memberFallback
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: `${translate(locale, "dashboard.title")} — Autarkeia`,
    description: translate(locale, "dashboard.meta_description"),
  }
}

export default async function DashboardPage() {
  const locale = await getLocale()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const tier = await getTier()
    const [{ data: supabaseProfile }, subscriptionProfile] = await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, avatar_url, username, subscription_status, subscription_plan")
        .eq("id", user.id)
        .maybeSingle(),
      getProfileSubscription(user.id),
    ])
    const profile = supabaseProfile ?? subscriptionProfile
    const displayName =
      resolveDisplayName(supabaseProfile?.display_name, user.email) ||
      displayNameFromUser(user, translate(locale, "dashboard.member_fallback"))
    const username = supabaseProfile?.username ?? null
    const [latestQuizResults, quizResultHistory] = await Promise.all([
      fetchLatestQuizSummariesForUser(user.id),
      fetchQuizResultHistorySummaries(user.id),
    ])
    const dashboardUser: DashboardUser = {
      id: user.id,
      email: user.email ?? null,
      displayName,
      avatarUrl: supabaseProfile?.avatar_url ?? null,
      initials: initialsFromDisplayName(displayName, username ?? undefined),
      tier,
      isDemo: false,
      canManageSubscription: canManageSubscription(profile?.subscription_status),
    }
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#f5f7fa]" />}>
        <DashboardView
          user={dashboardUser}
          quizData={{ latest: latestQuizResults, history: quizResultHistory }}
        />
      </Suspense>
    )
  }

  const cookieStore = await cookies()
  const demoId = decodeCookieValue(cookieStore.get("autarkeia-user")?.value)

  if (demoId?.startsWith("demo-")) {
    const tier: Tier = demoId === "demo-pro" ? "pro" : "free"
    const demoDisplayName =
      tier === "pro" ? translate(locale, "dashboard.demo_pro") : translate(locale, "dashboard.demo_free")
    const dashboardUser: DashboardUser = {
      id: demoId,
      email: null,
      displayName: demoDisplayName,
      avatarUrl: null,
      initials: initialsFromDisplayName(demoDisplayName),
      tier,
      isDemo: true,
    }
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#f5f7fa]" />}>
        <DashboardView user={dashboardUser} />
      </Suspense>
    )
  }

  redirect("/login")
}
