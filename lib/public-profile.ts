import "server-only"

import { initialsFromDisplayName } from "@/lib/avatar-initials"
import { parseProfileAboutFromRow, type ProfileAboutData } from "@/lib/profile-about"
import { parseProfileCommunityFromRow, type ProfileCommunityData } from "@/lib/profile-community"
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
  bio: string | null
  avatar_url: string | null
  hometown: unknown
  languages: string[] | null
  skills: string[] | null
  prep_goal: string | null
  years_preparing: string | null
  household_adults: number | null
  household_children: number | null
  household_pets: boolean | null
  household_special_needs: string[] | null
  show_hometown: boolean
  show_languages: boolean
  show_skills: boolean
  show_prep_goal: boolean
  show_years_preparing: boolean
  show_household: boolean
  interested_in_communities: boolean
  community_intent: string | null
  community_preferred_locations: unknown
  community_climate_preference: string | null
  community_distance_from_city: string | null
  community_investment_capacity: string | null
  community_investor_type: string | null
  community_move_timeline: string | null
  community_living_model: string | null
  community_energy_ownership: string | null
  community_energy_preferences: unknown
  community_food_ownership: string | null
  community_food_preferences: unknown
  community_dietary_preference: string | null
  community_food_products: unknown
  community_food_frequency: string | null
  community_notes: string | null
  show_community_intent: boolean
  show_community_locations: boolean
  show_community_living_pref: boolean
  show_community_investment: boolean
  show_community_food_pref: boolean
  show_community_timeline: boolean
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
  bio: string | null
  avatarUrl: string | null
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
      "id, username, display_name, first_name, last_name, created_at, profile_public, show_quiz_scores, show_country, bio, avatar_url, hometown, languages, skills, prep_goal, years_preparing, household_adults, household_children, household_pets, household_special_needs, show_hometown, show_languages, show_skills, show_prep_goal, show_years_preparing, show_household, interested_in_communities, community_intent, community_preferred_locations, community_climate_preference, community_distance_from_city, community_investment_capacity, community_investor_type, community_move_timeline, community_living_model, community_energy_ownership, community_energy_preferences, community_food_ownership, community_food_preferences, community_dietary_preference, community_food_products, community_food_frequency, community_notes, show_community_intent, show_community_locations, show_community_living_pref, show_community_investment, show_community_food_pref, show_community_timeline, subscription_status, subscription_plan"
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
  return initialsFromDisplayName(resolvePublicDisplayName(profile), profile.username)
}

export function profileAboutFromRecord(profile: PublicProfileRecord): ProfileAboutData {
  return parseProfileAboutFromRow(profile as unknown as Record<string, unknown>)
}

export function profileCommunityFromRecord(profile: PublicProfileRecord): ProfileCommunityData {
  return parseProfileCommunityFromRow(profile as unknown as Record<string, unknown>)
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
    bio: profile.bio?.trim() || null,
    avatarUrl: profile.avatar_url?.trim() || null,
    initials: profileInitials(profile),
  }
}
