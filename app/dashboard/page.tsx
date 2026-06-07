import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"
import { resolveAuthenticatedProfileRedirect } from "@/lib/profile-path-server"

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: `${translate(locale, "dashboard.title")} — Autarkeia`,
    description: translate(locale, "dashboard.meta_description"),
  }
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  redirect(await resolveAuthenticatedProfileRedirect(params))
}
