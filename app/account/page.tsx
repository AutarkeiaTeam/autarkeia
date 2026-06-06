import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AccountSettings } from "@/components/account/account-settings"
import { resolveDisplayName } from "@/lib/account"
import { getTier } from "@/lib/auth-server"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"
import { createClient } from "@/lib/supabase/server"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: `${translate(locale, "account.title")} — Autarkeia`,
    description: translate(locale, "account.meta_description"),
  }
}

export default async function AccountPage() {
  const locale = await getLocale()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/account")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle()

  const tier = await getTier()

  return (
    <AccountSettings
      userId={user.id}
      email={user.email ?? ""}
      displayName={resolveDisplayName(profile?.display_name, user.email)}
      memberSince={user.created_at}
      tier={tier}
    />
  )
}
