import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { DashboardView, type DashboardUser } from "@/components/dashboard/dashboard-view"
import { getTier, type Tier } from "@/lib/auth-server"
import { createClient } from "@/lib/supabase/server"

function decodeCookieValue(value: string | undefined): string | null {
  if (!value) return null
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function displayNameFromUser(user: {
  email?: string | null
  user_metadata?: Record<string, unknown>
}): string {
  if (user.email) return user.email
  const first = user.user_metadata?.first_name
  const last = user.user_metadata?.last_name
  if (typeof first === "string" && first) {
    return typeof last === "string" && last ? `${first} ${last}` : first
  }
  return "Member"
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const tier = await getTier()
    const dashboardUser: DashboardUser = {
      id: user.id,
      email: user.email ?? null,
      displayName: displayNameFromUser(user),
      tier,
      isDemo: false,
    }
    return <DashboardView user={dashboardUser} />
  }

  const cookieStore = await cookies()
  const demoId = decodeCookieValue(cookieStore.get("autarkeia-user")?.value)

  if (demoId?.startsWith("demo-")) {
    const tier: Tier = demoId === "demo-pro" ? "pro" : "free"
    const dashboardUser: DashboardUser = {
      id: demoId,
      email: null,
      displayName: tier === "pro" ? "Demo (Pro)" : "Demo (Free)",
      tier,
      isDemo: true,
    }
    return <DashboardView user={dashboardUser} />
  }

  redirect("/login")
}
