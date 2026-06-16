import { z } from "zod"
import { preferredLocationSchema, type PreferredLocation } from "@/lib/community-interest-location"
import {
  applyCommunityPreferenceValidation,
  profileCommunityFieldSchema,
} from "@/lib/profile-community"
import { notificationPreferencesSchema } from "@/lib/profile-notifications"

export const PROFILE_LANGUAGE_SLUGS = [
  "english",
  "spanish",
  "french",
  "german",
  "italian",
  "portuguese",
  "catalan",
  "basque",
  "galician",
  "dutch",
  "russian",
  "polish",
  "romanian",
  "czech",
  "greek",
  "turkish",
  "arabic",
  "hebrew",
  "hindi",
  "bengali",
  "mandarin",
  "cantonese",
  "japanese",
  "korean",
  "vietnamese",
  "thai",
  "indonesian",
  "tagalog",
  "swahili",
  "other",
] as const

export const PROFILE_SKILL_SLUGS = [
  "gardening",
  "permaculture",
  "foraging",
  "hunting",
  "fishing",
  "animal_husbandry",
  "beekeeping",
  "food_preservation",
  "canning",
  "fermentation",
  "cooking",
  "baking",
  "water_collection",
  "off_grid_power",
  "solar",
  "wind",
  "hydro",
  "wood_heating",
  "first_aid",
  "herbal_medicine",
  "mental_health",
  "self_defense",
  "marksmanship",
  "mechanics",
  "carpentry",
  "plumbing",
  "electrical",
  "welding",
  "sewing",
  "leatherwork",
  "ham_radio",
  "off_grid_comms",
  "navigation",
  "survival",
  "bushcraft",
  "homeschooling",
  "childcare",
  "eldercare",
] as const

export const PROFILE_PREP_GOAL_SLUGS = [
  "emergency_ready",
  "self_sufficient",
  "off_grid",
  "community_building",
  "all",
] as const

export const PROFILE_YEARS_PREPARING_SLUGS = [
  "just_starting",
  "lt_1",
  "1_3",
  "3_5",
  "5_10",
  "10_plus",
] as const

export const PROFILE_SPECIAL_NEEDS_SLUGS = [
  "infant",
  "elderly",
  "medical_needs",
  "mobility_impaired",
  "dietary_restrictions",
] as const

export type ProfileLanguageSlug = (typeof PROFILE_LANGUAGE_SLUGS)[number]
export type ProfileSkillSlug = (typeof PROFILE_SKILL_SLUGS)[number]
export type ProfilePrepGoalSlug = (typeof PROFILE_PREP_GOAL_SLUGS)[number]
export type ProfileYearsPreparingSlug = (typeof PROFILE_YEARS_PREPARING_SLUGS)[number]
export type ProfileSpecialNeedsSlug = (typeof PROFILE_SPECIAL_NEEDS_SLUGS)[number]

const slugArray = <T extends readonly string[]>(allowed: T, max?: number) => {
  let schema = z.array(z.string())
  if (max !== undefined) schema = schema.max(max)
  return schema.transform((items) => {
    const seen = new Set<string>()
    const result: string[] = []
    for (const item of items) {
      const slug = item.trim()
      if (!slug || !(allowed as readonly string[]).includes(slug) || seen.has(slug)) continue
      seen.add(slug)
      result.push(slug)
    }
    return result
  })
}

const profileAboutFieldsSchema = z.object({
  displayName: z.string().trim().min(1).max(50).optional(),
  username: z.string().trim().optional(),
  bio: z.string().max(280).optional(),
  avatarUrl: z.union([z.string().url(), z.null()]).optional(),
  profilePublic: z.boolean().optional(),
  showQuizScores: z.boolean().optional(),
  showCountry: z.boolean().optional(),
  hometown: preferredLocationSchema.nullable().optional(),
  currentCity: preferredLocationSchema.nullable().optional(),
  languages: slugArray(PROFILE_LANGUAGE_SLUGS, 10).optional(),
  skills: slugArray(PROFILE_SKILL_SLUGS, 15).optional(),
  prepGoal: z.enum(PROFILE_PREP_GOAL_SLUGS).nullable().optional(),
  yearsPreparing: z.enum(PROFILE_YEARS_PREPARING_SLUGS).nullable().optional(),
  householdAdults: z.number().int().min(1).max(10).nullable().optional(),
  householdChildren: z.number().int().min(0).max(10).nullable().optional(),
  householdPets: z.boolean().nullable().optional(),
  householdSpecialNeeds: slugArray(PROFILE_SPECIAL_NEEDS_SLUGS).optional(),
  showHometown: z.boolean().optional(),
  showCurrentCity: z.boolean().optional(),
  showLanguages: z.boolean().optional(),
  showSkills: z.boolean().optional(),
  showPrepGoal: z.boolean().optional(),
  showYearsPreparing: z.boolean().optional(),
  showHousehold: z.boolean().optional(),
})

export const profileAboutUpdateSchema = profileAboutFieldsSchema
  .merge(profileCommunityFieldSchema)
  .merge(notificationPreferencesSchema)
  .superRefine(applyCommunityPreferenceValidation)
  .refine(
    (data) =>
      data.displayName !== undefined ||
      data.username !== undefined ||
      data.bio !== undefined ||
      data.avatarUrl !== undefined ||
      data.profilePublic !== undefined ||
      data.showQuizScores !== undefined ||
      data.showCountry !== undefined ||
      data.hometown !== undefined ||
      data.currentCity !== undefined ||
      data.languages !== undefined ||
      data.skills !== undefined ||
      data.prepGoal !== undefined ||
      data.yearsPreparing !== undefined ||
      data.householdAdults !== undefined ||
      data.householdChildren !== undefined ||
      data.householdPets !== undefined ||
      data.householdSpecialNeeds !== undefined ||
      data.showHometown !== undefined ||
      data.showCurrentCity !== undefined ||
      data.showLanguages !== undefined ||
      data.showSkills !== undefined ||
      data.showPrepGoal !== undefined ||
      data.showYearsPreparing !== undefined ||
      data.showHousehold !== undefined ||
      data.interestedInCommunities !== undefined ||
      data.communityIntent !== undefined ||
      data.communityPreferredLocations !== undefined ||
      data.communityClimatePreference !== undefined ||
      data.communityDistanceFromCity !== undefined ||
      data.communityInvestmentCapacity !== undefined ||
      data.communityInvestorType !== undefined ||
      data.communityMoveTimeline !== undefined ||
      data.communityLivingModel !== undefined ||
      data.communityEnergyOwnership !== undefined ||
      data.communityEnergyPreferences !== undefined ||
      data.communityFoodOwnership !== undefined ||
      data.communityFoodPreferences !== undefined ||
      data.communityDietaryPreference !== undefined ||
      data.communityFoodProducts !== undefined ||
      data.communityFoodFrequency !== undefined ||
      data.communityNotes !== undefined ||
      data.showCommunityIntent !== undefined ||
      data.showCommunityLocations !== undefined ||
      data.showCommunityLivingPref !== undefined ||
      data.showCommunityInvestment !== undefined ||
      data.showCommunityFoodPref !== undefined ||
      data.showCommunityTimeline !== undefined ||
      data.notifyEmailMode !== undefined ||
      data.notifyInappEnabled !== undefined ||
      data.notifyForumReplies !== undefined ||
      data.notifyForumReactions !== undefined ||
      data.notifyForumMentions !== undefined,
    { message: "account.validation.nothing_to_update" }
  )

export type ProfileAboutData = {
  hometown: PreferredLocation | null
  languages: string[]
  skills: string[]
  prepGoal: string | null
  yearsPreparing: string | null
  householdAdults: number | null
  householdChildren: number | null
  householdPets: boolean | null
  householdSpecialNeeds: string[]
  showHometown: boolean
  showCurrentCity: boolean
  showLanguages: boolean
  showSkills: boolean
  showPrepGoal: boolean
  showYearsPreparing: boolean
  showHousehold: boolean
}

export type ProfileAboutRecord = ProfileAboutData & {
  profile_public: boolean
}

function parsePreferredLocation(value: unknown): PreferredLocation | null {
  if (!value || typeof value !== "object") return null
  const parsed = preferredLocationSchema.safeParse(value)
  return parsed.success ? parsed.data : null
}

export function parseProfileAboutFromRow(row: Record<string, unknown>): ProfileAboutData {
  return {
    hometown: parsePreferredLocation(row.hometown),
    currentCity: parsePreferredLocation(row.current_city),
    languages: Array.isArray(row.languages) ? row.languages.filter((v) => typeof v === "string") : [],
    skills: Array.isArray(row.skills) ? row.skills.filter((v) => typeof v === "string") : [],
    prepGoal: typeof row.prep_goal === "string" ? row.prep_goal : null,
    yearsPreparing: typeof row.years_preparing === "string" ? row.years_preparing : null,
    householdAdults: typeof row.household_adults === "number" ? row.household_adults : null,
    householdChildren: typeof row.household_children === "number" ? row.household_children : null,
    householdPets: typeof row.household_pets === "boolean" ? row.household_pets : null,
    householdSpecialNeeds: Array.isArray(row.household_special_needs)
      ? row.household_special_needs.filter((v) => typeof v === "string")
      : [],
    showHometown: row.show_hometown === true,
    showCurrentCity: row.show_current_city === true,
    showLanguages: row.show_languages === true,
    showSkills: row.show_skills === true,
    showPrepGoal: row.show_prep_goal === true,
    showYearsPreparing: row.show_years_preparing === true,
    showHousehold: row.show_household === true,
  }
}

export function fieldIsFilled(about: ProfileAboutData, field: keyof ProfileAboutData): boolean {
  switch (field) {
    case "hometown":
      return about.hometown != null
    case "currentCity":
      return about.currentCity != null
    case "languages":
      return about.languages.length > 0
    case "skills":
      return about.skills.length > 0
    case "prepGoal":
      return about.prepGoal != null
    case "yearsPreparing":
      return about.yearsPreparing != null
    case "householdAdults":
    case "householdChildren":
    case "householdPets":
    case "householdSpecialNeeds":
      return (
        about.householdAdults != null ||
        about.householdChildren != null ||
        about.householdPets != null ||
        about.householdSpecialNeeds.length > 0
      )
    default:
      return false
  }
}

export function householdIsFilled(about: ProfileAboutData): boolean {
  return fieldIsFilled(about, "householdAdults")
}

export function shouldShowAboutField(
  about: ProfileAboutData,
  showKey: keyof Pick<
    ProfileAboutData,
    | "showHometown"
    | "showCurrentCity"
    | "showLanguages"
    | "showSkills"
    | "showPrepGoal"
    | "showYearsPreparing"
    | "showHousehold"
  >,
  dataKey: keyof ProfileAboutData,
  isOwner: boolean,
  profilePublic: boolean
): boolean {
  if (!profilePublic && !isOwner) return false
  if (dataKey === "householdAdults") {
    if (!householdIsFilled(about)) return false
    return isOwner || about.showHousehold
  }
  if (!fieldIsFilled(about, dataKey)) return false
  return isOwner || about[showKey]
}

export function hasVisibleAboutSection(
  about: ProfileAboutData,
  isOwner: boolean,
  profilePublic: boolean
): boolean {
  if (!profilePublic && !isOwner) return false
  const checks: Array<[keyof ProfileAboutData, keyof ProfileAboutData]> = [
    ["showHometown", "hometown"],
    ["showCurrentCity", "currentCity"],
    ["showLanguages", "languages"],
    ["showSkills", "skills"],
    ["showPrepGoal", "prepGoal"],
    ["showYearsPreparing", "yearsPreparing"],
    ["showHousehold", "householdAdults"],
  ]
  return checks.some(([showKey, dataKey]) =>
    shouldShowAboutField(about, showKey, dataKey, isOwner, profilePublic)
  )
}

export function toggleSlugList(list: string[], slug: string, checked: boolean, max: number): string[] {
  if (checked) {
    if (list.includes(slug) || list.length >= max) return list
    return [...list, slug]
  }
  return list.filter((item) => item !== slug)
}
