import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AccountSettings } from "@/components/account/account-settings"
import { getPrimaryAuthMethod } from "@/lib/account-auth"
import { resolveDisplayName } from "@/lib/account"
import { getTier } from "@/lib/auth-server"
import { ensureProfileUsername } from "@/lib/username"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"
import { parseProfileAboutFromRow } from "@/lib/profile-about"
import { createClient } from "@/lib/supabase/server"

const PROFILE_SELECT =
  "display_name, username, bio, avatar_url, profile_public, show_quiz_scores, show_country, hometown, languages, skills, prep_goal, years_preparing, household_adults, household_children, household_pets, household_special_needs, show_hometown, show_languages, show_skills, show_prep_goal, show_years_preparing, show_household"

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

  let { data: profile } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", user.id)
    .maybeSingle()

  if (!profile?.username && user.email) {
    try {
      await ensureProfileUsername(user.id, user.email)
    } catch (err) {
      console.error("ensureProfileUsername on account page failed:", err)
    }
    const refetch = await supabase
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("id", user.id)
      .maybeSingle()
    profile = refetch.data
  }

  const tier = await getTier()
  const authMethod = getPrimaryAuthMethod(user)
  const siteHost = (process.env.NEXT_PUBLIC_SITE_URL || "https://autarkeia.world")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")

  return (
    <AccountSettings
      userId={user.id}
      email={user.email ?? ""}
      displayName={resolveDisplayName(profile?.display_name, user.email)}
      username={profile?.username ?? ""}
      bio={profile?.bio ?? ""}
      avatarUrl={profile?.avatar_url ?? null}
      siteHost={siteHost}
      profilePublic={profile?.profile_public === true}
      showQuizScores={profile?.show_quiz_scores === true}
      showCountry={profile?.show_country === true}
      memberSince={user.created_at}
      tier={tier}
      authMethod={authMethod}
      aboutMe={parseProfileAboutFromRow((profile ?? {}) as Record<string, unknown>)}
    />
  )
}
