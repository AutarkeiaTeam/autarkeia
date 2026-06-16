import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProfileView } from "@/components/profile/profile-view"
import { getTier } from "@/lib/auth-server"
import {
  buildPublicProfileView,
  fetchCommunityInterestCountry,
  fetchProfileByUsername,
  profileAboutFromRecord,
  profileCommunityFromRecord,
  profileInitials,
  resolvePublicDisplayName,
} from "@/lib/public-profile"
import {
  fetchLatestQuizSummariesForUser,
  fetchPublicProfileQuizScores,
  fetchQuizResultHistorySummaries,
} from "@/lib/quiz-results"
import { canManageSubscription, getProfileSubscription } from "@/lib/subscription"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"
import { listNewsArticles } from "@/lib/news-db"
import { buildNewsWidgetArticles } from "@/lib/news-widget"
import { parseProfileCommunityFromRow } from "@/lib/profile-community"
import { parseProfileAboutFromRow } from "@/lib/profile-about"
import { createClient } from "@/lib/supabase/server"

type PageProps = {
  params: Promise<{ username: string }>
}

function formatMemberSince(dateIso: string, locale: "en" | "es"): string {
  const formatter = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", {
    month: "long",
    year: "numeric",
  })
  return formatter.format(new Date(dateIso))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const locale = await getLocale()
  const profile = await fetchProfileByUsername(username)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isOwner = Boolean(user && profile && user.id === profile.id)

  if (!profile) {
    return {
      title: translate(locale, "profile.meta.not_found_title"),
      robots: { index: false, follow: false },
    }
  }

  const displayName = resolvePublicDisplayName(profile)

  if (!profile.profile_public && !isOwner) {
    return {
      title: translate(locale, "profile.meta.private_title"),
      description: translate(locale, "profile.meta.private_description"),
      robots: { index: false, follow: false },
    }
  }

  const bio = profile.bio?.trim()
  const description =
    profile.profile_public && bio
      ? bio.length > 160
        ? `${bio.slice(0, 157)}…`
        : bio
      : translate(locale, "profile.meta.description").replace("{display_name}", displayName)

  return {
    title: translate(locale, "profile.meta.title")
      .replace("{display_name}", displayName)
      .replace("{username}", profile.username),
    description,
    robots: profile.profile_public ? { index: true, follow: true } : { index: false, follow: false },
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params
  const locale = await getLocale()
  const profile = await fetchProfileByUsername(username)

  if (!profile?.username) {
    notFound()
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isOwner = Boolean(user && user.id === profile.id)
  const isPrivate = !profile.profile_public && !isOwner

  if (isPrivate) {
    return (
      <ProfileView
        username={profile.username}
        displayName=""
        memberSinceLabel=""
        isPro={false}
        country={null}
        showQuizScoresSection={false}
        quizScores={null}
        bio={null}
        avatarUrl={null}
        initials=""
        isPrivate
        isOwner={false}
        profilePublic={false}
        about={parseProfileAboutFromRow({})}
        community={parseProfileCommunityFromRow({})}
      />
    )
  }

  const view = await buildPublicProfileView(profile)
  const memberSinceLabel = formatMemberSince(view.memberSince, locale)

  const showQuizScoresSection = isOwner || view.showQuizScoresSection
  const quizScores = showQuizScoresSection
    ? isOwner
      ? await fetchLatestQuizSummariesForUser(profile.id)
      : await fetchPublicProfileQuizScores(profile.id)
    : null

  const country =
    profile.show_country && (profile.profile_public || isOwner)
      ? await fetchCommunityInterestCountry(profile.id)
      : null

  const bio = profile.bio?.trim() || null
  const avatarUrl = profile.avatar_url?.trim() || null
  const displayName = resolvePublicDisplayName(profile)
  const initials = profileInitials(profile)

  let ownerTier
  let canManageSubscriptionFlag
  let quizHistory
  let ownerNewsArticles = buildNewsWidgetArticles([], locale)
  if (isOwner) {
    ownerTier = await getTier()
    const subscriptionProfile = await getProfileSubscription(profile.id)
    canManageSubscriptionFlag = canManageSubscription(subscriptionProfile?.subscription_status)
    quizHistory = await fetchQuizResultHistorySummaries(profile.id)
    ownerNewsArticles = buildNewsWidgetArticles(await listNewsArticles(5), locale, 5)
  }

  return (
    <ProfileView
      username={view.username}
      displayName={displayName}
      memberSinceLabel={memberSinceLabel}
      isPro={view.isPro}
      country={country}
      showQuizScoresSection={showQuizScoresSection}
      quizScores={quizScores}
      bio={isOwner || profile.profile_public ? bio : null}
      avatarUrl={avatarUrl}
      initials={initials}
      isPrivate={false}
      isOwner={isOwner}
      profilePublic={profile.profile_public}
      about={profileAboutFromRecord(profile)}
      community={profileCommunityFromRecord(profile)}
      ownerTier={ownerTier}
      canManageSubscription={canManageSubscriptionFlag}
      quizHistory={quizHistory}
      ownerNewsArticles={ownerNewsArticles}
    />
  )
}
