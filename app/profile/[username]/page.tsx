import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PublicProfileView } from "@/components/profile/public-profile-view"
import {
  buildPublicProfileView,
  fetchProfileByUsername,
  resolvePublicDisplayName,
} from "@/lib/public-profile"
import { fetchPublicProfileQuizScores } from "@/lib/quiz-results"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"

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

  if (!profile) {
    return {
      title: translate(locale, "profile.meta.not_found_title"),
      robots: { index: false, follow: false },
    }
  }

  if (!profile.profile_public) {
    return {
      title: translate(locale, "profile.meta.private_title"),
      description: translate(locale, "profile.meta.private_description"),
      robots: { index: false, follow: false },
    }
  }

  const displayName = resolvePublicDisplayName(profile)

  return {
    title: translate(locale, "profile.meta.title")
      .replace("{display_name}", displayName)
      .replace("{username}", profile.username),
    description: translate(locale, "profile.meta.description").replace(
      "{display_name}",
      displayName
    ),
  }
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params
  const locale = await getLocale()
  const profile = await fetchProfileByUsername(username)

  if (!profile?.username) {
    notFound()
  }

  if (!profile.profile_public) {
    return (
      <PublicProfileView
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
      />
    )
  }

  const view = await buildPublicProfileView(profile)
  const memberSinceLabel = formatMemberSince(view.memberSince, locale)
  const quizScores = view.showQuizScoresSection
    ? await fetchPublicProfileQuizScores(profile.id)
    : null

  return (
    <PublicProfileView
      username={view.username}
      displayName={view.displayName}
      memberSinceLabel={memberSinceLabel}
      isPro={view.isPro}
      country={view.country}
      showQuizScoresSection={view.showQuizScoresSection}
      quizScores={quizScores}
      bio={view.bio}
      avatarUrl={view.avatarUrl}
      initials={view.initials}
      isPrivate={false}
    />
  )
}
