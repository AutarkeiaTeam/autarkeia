import "server-only"

import { hasActiveProSubscription } from "@/lib/subscription-shared"
import { createAdminClient } from "@/lib/supabase/admin"

export type PublicProfileRecord = {
  id: string
  username: string
  display_name: string | null
  first_name: string | null
  last_name: string | null
  created_at: string
  profile_public: boolean
  show_quiz_scores: boolean
  show_country: boolean
  subscription_status: string | null
  subscription_plan: string | null
}

export type PublicProfileView = {
  username: string
  displayName: string
  memberSince: string
  isPro: boolean
  country: string | null
  showQuizScoresSection: boolean
  initials: string
}

export async function fetchProfileByUsername(
  username: string
): Promise<PublicProfileRecord | null> {
  const normalized = username.trim().toLowerCase()
  if (!normalized) return null

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("profiles")
    .select(
      "id, username, display_name, first_name, last_name, created_at, profile_public, show_quiz_scores, show_country, subscription_status, subscription_plan"
    )
    .ilike("username", normalized)
    .maybeSingle()

  if (error) {
    console.error("fetchProfileByUsername failed:", error.message)
    return null
  }

  return data as PublicProfileRecord | null
}

export async function fetchCommunityInterestCountry(userId: string): Promise<string | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("community_interest")
    .select("country")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("fetchCommunityInterestCountry failed:", error.message)
    return null
  }

  const country = data?.country?.trim()
  return country || null
}

export function resolvePublicDisplayName(profile: PublicProfileRecord): string {
  const displayName = profile.display_name?.trim()
  if (displayName) return displayName

  const first = profile.first_name?.trim()
  const last = profile.last_name?.trim()
  if (first && last) return `${first} ${last}`
  if (first) return first

  return `@${profile.username}`
}

export function profileInitials(profile: PublicProfileRecord): string {
  const displayName = resolvePublicDisplayName(profile)
  if (displayName.startsWith("@")) {
    return profile.username.slice(0, 2).toUpperCase()
  }

  const parts = displayName.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
  }

  return displayName.slice(0, 2).toUpperCase()
}

export async function buildPublicProfileView(
  profile: PublicProfileRecord
): Promise<PublicProfileView> {
  const country =
    profile.show_country && profile.profile_public
      ? await fetchCommunityInterestCountry(profile.id)
      : null

  return {
    username: profile.username,
    displayName: resolvePublicDisplayName(profile),
    memberSince: profile.created_at,
    isPro: hasActiveProSubscription(profile),
    country,
    showQuizScoresSection: profile.profile_public && profile.show_quiz_scores,
    initials: profileInitials(profile),
  }
}
