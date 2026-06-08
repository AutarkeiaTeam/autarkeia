import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { NotificationsPageClient } from "@/components/notifications/notifications-page-client"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"
import { createClient } from "@/lib/supabase/server"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: `${translate(locale, "notifications.page.title")} — Autarkeia`,
  }
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/notifications")
  }

  return (
    <Suspense fallback={<div className="py-10 text-center text-sm text-[#8a9bb0]">…</div>}>
      <NotificationsPageClient />
    </Suspense>
  )
}
