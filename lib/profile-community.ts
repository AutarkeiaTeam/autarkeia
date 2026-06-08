import { z } from "zod"
import {
  CLIMATE_PREFERENCES,
  COMMUNITY_INTENTS,
  DIETARY_PREFERENCES,
  DISTANCE_FROM_CITY,
  ENERGY_SOURCE_OPTIONS,
  FOOD_FREQUENCIES,
  FOOD_PRODUCT_OPTIONS,
  FOOD_PRODUCTION_OPTIONS,
  INVESTMENT_CAPACITY,
  INVESTOR_TYPES,
  LIVING_MODELS,
  MOVE_TIMELINES,
  OWNERSHIP_MODELS,
  type CommunityInterestInput,
  communityInterestToRow,
} from "@/lib/community-interest"
import {
  preferredLocationSchema,
  type PreferredLocation,
} from "@/lib/community-interest-location"

function parseLocations(value: unknown): PreferredLocation[] {
  if (!Array.isArray(value)) return []
  const result: PreferredLocation[] = []
  for (const item of value) {
    const parsed = preferredLocationSchema.safeParse(item)
    if (parsed.success) result.push(parsed.data)
  }
  return result
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is string => typeof v === "string")
}

export type ProfileCommunityData = {
  interestedInCommunities: boolean
  intent: string | null
  preferredLocations: PreferredLocation[]
  climatePreference: string | null
  distanceFromCity: string | null
  investmentCapacity: string | null
  investorType: string | null
  moveTimeline: string | null
  livingModel: string | null
  energyOwnership: string | null
  energyPreferences: string[]
  foodOwnership: string | null
  foodPreferences: string[]
  dietaryPreference: string | null
  foodProducts: string[]
  foodFrequency: string | null
  notes: string | null
  showIntent: boolean
  showLocations: boolean
  showLivingPref: boolean
  showInvestment: boolean
  showFoodPref: boolean
  showTimeline: boolean
}

export const profileCommunityFieldSchema = z.object({
  interestedInCommunities: z.boolean().optional(),
  communityIntent: z.enum(COMMUNITY_INTENTS).nullable().optional(),
  communityPreferredLocations: z.array(preferredLocationSchema).max(10).optional(),
  communityClimatePreference: z.enum(CLIMATE_PREFERENCES).nullable().optional(),
  communityDistanceFromCity: z.enum(DISTANCE_FROM_CITY).nullable().optional(),
  communityInvestmentCapacity: z.enum(INVESTMENT_CAPACITY).nullable().optional(),
  communityInvestorType: z.enum(INVESTOR_TYPES).nullable().optional(),
  communityMoveTimeline: z.enum(MOVE_TIMELINES).nullable().optional(),
  communityLivingModel: z.enum(LIVING_MODELS).nullable().optional(),
  communityEnergyOwnership: z.enum(OWNERSHIP_MODELS).nullable().optional(),
  communityEnergyPreferences: z.array(z.enum(ENERGY_SOURCE_OPTIONS)).nullable().optional(),
  communityFoodOwnership: z.enum(OWNERSHIP_MODELS).nullable().optional(),
  communityFoodPreferences: z.array(z.enum(FOOD_PRODUCTION_OPTIONS)).nullable().optional(),
  communityDietaryPreference: z.enum(DIETARY_PREFERENCES).nullable().optional(),
  communityFoodProducts: z.array(z.enum(FOOD_PRODUCT_OPTIONS)).nullable().optional(),
  communityFoodFrequency: z.enum(FOOD_FREQUENCIES).nullable().optional(),
  communityNotes: z.string().max(5000).nullable().optional(),
  showCommunityIntent: z.boolean().optional(),
  showCommunityLocations: z.boolean().optional(),
  showCommunityLivingPref: z.boolean().optional(),
  showCommunityInvestment: z.boolean().optional(),
  showCommunityFoodPref: z.boolean().optional(),
  showCommunityTimeline: z.boolean().optional(),
})

export function applyCommunityPreferenceValidation(
  data: {
    interestedInCommunities?: boolean
    communityIntent?: string | null
    communityPreferredLocations?: PreferredLocation[]
    communityClimatePreference?: string | null
    communityDistanceFromCity?: string | null
    communityInvestmentCapacity?: string | null
    communityInvestorType?: string | null
    communityMoveTimeline?: string | null
    communityLivingModel?: string | null
    communityEnergyOwnership?: string | null
    communityEnergyPreferences?: string[] | null
    communityFoodOwnership?: string | null
    communityFoodPreferences?: string[] | null
    communityDietaryPreference?: string | null
    communityFoodProducts?: string[] | null
    communityFoodFrequency?: string | null
  },
  ctx: z.RefinementCtx
) {
  if (data.interestedInCommunities !== true) return

  const intent = data.communityIntent
  if (!intent) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["communityIntent"],
      message: "account.community.validation.intent_required",
    })
    return
  }

  if (!data.communityPreferredLocations?.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["communityPreferredLocations"],
      message: "communities.validation.add_location",
    })
  }

  const requiresLiving = intent === "live" || intent === "both"
  const requiresFoodBuyer = intent === "buy_food" || intent === "both"

  if (requiresLiving) {
    const livingChecks: Array<[string, unknown]> = [
      ["communityClimatePreference", data.communityClimatePreference],
      ["communityDistanceFromCity", data.communityDistanceFromCity],
      ["communityLivingModel", data.communityLivingModel],
      ["communityEnergyOwnership", data.communityEnergyOwnership],
      ["communityFoodOwnership", data.communityFoodOwnership],
      ["communityDietaryPreference", data.communityDietaryPreference],
      ["communityInvestmentCapacity", data.communityInvestmentCapacity],
      ["communityInvestorType", data.communityInvestorType],
      ["communityMoveTimeline", data.communityMoveTimeline],
    ]
    for (const [path, value] of livingChecks) {
      if (!value) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [path],
          message: "account.community.validation.field_required",
        })
      }
    }

    if (
      data.communityEnergyOwnership === "Resident-owned" &&
      !data.communityEnergyPreferences?.length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["communityEnergyPreferences"],
        message: "communities.validation.energy_source_required",
      })
    }

    if (data.communityFoodOwnership === "Resident-owned" && !data.communityFoodPreferences?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["communityFoodPreferences"],
        message: "communities.validation.food_method_required",
      })
    }
  }

  if (requiresFoodBuyer) {
    if (!data.communityFoodProducts?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["communityFoodProducts"],
        message: "communities.validation.food_products_required",
      })
    }
    if (!data.communityFoodFrequency) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["communityFoodFrequency"],
        message: "communities.validation.food_frequency_required",
      })
    }
  }
}

export const profileCommunityUpdateSchema = profileCommunityFieldSchema.superRefine(
  applyCommunityPreferenceValidation
)

export function parseProfileCommunityFromRow(row: Record<string, unknown>): ProfileCommunityData {
  return {
    interestedInCommunities: row.interested_in_communities === true,
    intent: typeof row.community_intent === "string" ? row.community_intent : null,
    preferredLocations: parseLocations(row.community_preferred_locations),
    climatePreference:
      typeof row.community_climate_preference === "string" ? row.community_climate_preference : null,
    distanceFromCity:
      typeof row.community_distance_from_city === "string" ? row.community_distance_from_city : null,
    investmentCapacity:
      typeof row.community_investment_capacity === "string" ? row.community_investment_capacity : null,
    investorType: typeof row.community_investor_type === "string" ? row.community_investor_type : null,
    moveTimeline:
      typeof row.community_move_timeline === "string" ? row.community_move_timeline : null,
    livingModel: typeof row.community_living_model === "string" ? row.community_living_model : null,
    energyOwnership:
      typeof row.community_energy_ownership === "string" ? row.community_energy_ownership : null,
    energyPreferences: parseStringArray(row.community_energy_preferences),
    foodOwnership:
      typeof row.community_food_ownership === "string" ? row.community_food_ownership : null,
    foodPreferences: parseStringArray(row.community_food_preferences),
    dietaryPreference:
      typeof row.community_dietary_preference === "string" ? row.community_dietary_preference : null,
    foodProducts: parseStringArray(row.community_food_products),
    foodFrequency:
      typeof row.community_food_frequency === "string" ? row.community_food_frequency : null,
    notes: typeof row.community_notes === "string" ? row.community_notes : null,
    showIntent: row.show_community_intent === true,
    showLocations: row.show_community_locations === true,
    showLivingPref: row.show_community_living_pref === true,
    showInvestment: row.show_community_investment === true,
    showFoodPref: row.show_community_food_pref === true,
    showTimeline: row.show_community_timeline === true,
  }
}

export function communityInterestInputToProfileFields(
  data: CommunityInterestInput
): Record<string, unknown> {
  const row = communityInterestToRow(data, null)
  return {
    interested_in_communities: true,
    community_intent: row.intent,
    community_preferred_locations: row.preferred_locations,
    community_climate_preference: row.climate_preference,
    community_distance_from_city: row.distance_from_city,
    community_investment_capacity: row.investment_capacity,
    community_investor_type: row.investor_type,
    community_move_timeline: row.move_timeline,
    community_living_model: row.living_model,
    community_energy_ownership: row.energy_ownership,
    community_energy_preferences: row.energy_preferences,
    community_food_ownership: row.food_ownership,
    community_food_preferences: row.food_preferences,
    community_dietary_preference: row.dietary_preference,
    community_food_products: row.food_products,
    community_food_frequency: row.food_frequency,
    community_notes: row.notes,
  }
}

export function profileCommunityToDbUpdates(
  data: z.infer<typeof profileCommunityFieldSchema>
): Record<string, unknown> {
  const updates: Record<string, unknown> = {}

  if (data.interestedInCommunities !== undefined) {
    updates.interested_in_communities = data.interestedInCommunities
  }
  if (data.communityIntent !== undefined) updates.community_intent = data.communityIntent
  if (data.communityPreferredLocations !== undefined) {
    updates.community_preferred_locations = data.communityPreferredLocations.length
      ? data.communityPreferredLocations
      : null
  }
  if (data.communityClimatePreference !== undefined) {
    updates.community_climate_preference = data.communityClimatePreference
  }
  if (data.communityDistanceFromCity !== undefined) {
    updates.community_distance_from_city = data.communityDistanceFromCity
  }
  if (data.communityInvestmentCapacity !== undefined) {
    updates.community_investment_capacity = data.communityInvestmentCapacity
  }
  if (data.communityInvestorType !== undefined) {
    updates.community_investor_type = data.communityInvestorType
  }
  if (data.communityMoveTimeline !== undefined) {
    updates.community_move_timeline = data.communityMoveTimeline
  }
  if (data.communityLivingModel !== undefined) {
    updates.community_living_model = data.communityLivingModel
  }
  if (data.communityEnergyOwnership !== undefined) {
    updates.community_energy_ownership = data.communityEnergyOwnership
  }
  if (data.communityEnergyPreferences !== undefined) {
    updates.community_energy_preferences = data.communityEnergyPreferences?.length
      ? data.communityEnergyPreferences
      : null
  }
  if (data.communityFoodOwnership !== undefined) {
    updates.community_food_ownership = data.communityFoodOwnership
  }
  if (data.communityFoodPreferences !== undefined) {
    updates.community_food_preferences = data.communityFoodPreferences?.length
      ? data.communityFoodPreferences
      : null
  }
  if (data.communityDietaryPreference !== undefined) {
    updates.community_dietary_preference = data.communityDietaryPreference
  }
  if (data.communityFoodProducts !== undefined) {
    updates.community_food_products = data.communityFoodProducts?.length
      ? data.communityFoodProducts
      : null
  }
  if (data.communityFoodFrequency !== undefined) {
    updates.community_food_frequency = data.communityFoodFrequency
  }
  if (data.communityNotes !== undefined) {
    const trimmed = data.communityNotes?.trim()
    updates.community_notes = trimmed || null
  }
  return updates
}

function groupHasData(community: ProfileCommunityData, group: string): boolean {
  switch (group) {
    case "intent":
      return community.intent != null
    case "locations":
      return community.preferredLocations.length > 0
    case "living":
      return (
        community.climatePreference != null ||
        community.distanceFromCity != null ||
        community.livingModel != null ||
        community.energyOwnership != null ||
        community.energyPreferences.length > 0 ||
        community.foodOwnership != null ||
        community.foodPreferences.length > 0 ||
        community.dietaryPreference != null
      )
    case "investment":
      return community.investmentCapacity != null || community.investorType != null
    case "food":
      return community.foodProducts.length > 0 || community.foodFrequency != null
    case "timeline":
      return community.moveTimeline != null || Boolean(community.notes?.trim())
    default:
      return false
  }
}

export function shouldShowCommunityGroup(
  community: ProfileCommunityData,
  group: "intent" | "locations" | "living" | "investment" | "food" | "timeline",
  showKey: keyof Pick<
    ProfileCommunityData,
    | "showIntent"
    | "showLocations"
    | "showLivingPref"
    | "showInvestment"
    | "showFoodPref"
    | "showTimeline"
  >,
  isOwner: boolean,
  profilePublic: boolean
): boolean {
  if (!community.interestedInCommunities) return false
  if (!profilePublic && !isOwner) return false
  if (!groupHasData(community, group)) return false
  return isOwner || community[showKey]
}

export function hasVisibleCommunitySection(
  community: ProfileCommunityData,
  isOwner: boolean,
  profilePublic: boolean
): boolean {
  if (!community.interestedInCommunities) return false
  if (!profilePublic && !isOwner) return false
  const groups: Array<
    ["intent" | "locations" | "living" | "investment" | "food" | "timeline", keyof ProfileCommunityData]
  > = [
    ["intent", "showIntent"],
    ["locations", "showLocations"],
    ["living", "showLivingPref"],
    ["investment", "showInvestment"],
    ["food", "showFoodPref"],
    ["timeline", "showTimeline"],
  ]
  return groups.some(([group, showKey]) =>
    shouldShowCommunityGroup(
      community,
      group,
      showKey as "showIntent" | "showLocations" | "showLivingPref" | "showInvestment" | "showFoodPref" | "showTimeline",
      isOwner,
      profilePublic
    )
  )
}
