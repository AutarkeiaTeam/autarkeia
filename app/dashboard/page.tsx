import { Suspense } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { DashboardView, type DashboardUser } from "@/components/dashboard/dashboard-view"
import { getTier, type Tier } from "@/lib/auth-server"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"
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
    const profile = await getProfileSubscription(user.id)
    const dashboardUser: DashboardUser = {
      id: user.id,
      email: user.email ?? null,
      displayName: displayNameFromUser(user, translate(locale, "dashboard.member_fallback")),
      tier,
      isDemo: false,
      canManageSubscription: canManageSubscription(profile?.subscription_status),
    }
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#f5f7fa]" />}>
        <DashboardView user={dashboardUser} />
      </Suspense>
    )
  }

  const cookieStore = await cookies()
  const demoId = decodeCookieValue(cookieStore.get("autarkeia-user")?.value)

  if (demoId?.startsWith("demo-")) {
    const tier: Tier = demoId === "demo-pro" ? "pro" : "free"
    const dashboardUser: DashboardUser = {
      id: demoId,
      email: null,
      displayName: tier === "pro" ? translate(locale, "dashboard.demo_pro") : translate(locale, "dashboard.demo_free"),
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
