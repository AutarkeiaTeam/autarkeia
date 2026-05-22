import { z } from "zod"
import {
  preferredLocationSchema,
  type PreferredLocation,
} from "@/lib/community-interest-location"

export type { PreferredLocation }
export {
  preferredLocationSchema,
  formatPreferredLocationsForDisplay,
  preferredLocationDisplayLabel,
} from "@/lib/community-interest-location"

export const AGE_RANGES = ["18-25", "26-35", "36-45", "46-55", "55+"] as const
export const HOUSEHOLD_TYPES = [
  "single",
  "couple",
  "family with children",
  "group of friends",
  "other",
] as const
export const CLIMATE_PREFERENCES = [
  "Mediterranean",
  "Temperate",
  "Tropical",
  "Cold",
  "Any",
] as const
export const DISTANCE_FROM_CITY = [
  "Within 30min",
  "30-60min",
  "1-2 hours",
  "Remote is fine",
] as const
export const COMMUNITY_TYPES = [
  "Independent family plot",
  "Co-living with friends",
  "Small village 10-30 people",
  "Larger community 30-100 people",
  "Flexible/open",
] as const
export const HOME_TYPES = [
  "Self-built natural home",
  "Prefab eco home",
  "Renovated existing building",
  "Flexible",
] as const
export const INVESTMENT_CAPACITY = [
  "Under €50k",
  "€50k-€150k",
  "€150k-€500k",
  "€500k-€1M",
  "Over €1M",
  "I want to rent not buy",
] as const
export const INVESTOR_TYPES = [
  "Individual/family",
  "Group of friends",
  "Small investor group",
  "Institutional/fund",
  "Not sure yet",
] as const
export const ENERGY_PREFERENCES = [
  "Solar",
  "Wind",
  "Micro-hydro",
  "Combined off-grid",
  "Connected to grid as backup",
  "Not sure",
] as const
export const FOOD_INTERESTS = [
  "Grow all my own food",
  "Most of my food",
  "Some of my food",
  "Buy from the community farm",
  "Not important",
] as const
export const MOVE_TIMELINES = [
  "As soon as possible",
  "1-2 years",
  "3-5 years",
  "5+ years",
  "Just exploring",
] as const

const nonEmptyString = z.string().trim().min(1).max(500)

export const communityInterestSchema = z.object({
  fullName: nonEmptyString.max(200),
  email: z.string().trim().email().max(320),
  country: nonEmptyString.max(120),
  cityRegion: nonEmptyString.max(120),
  ageRange: z.enum(AGE_RANGES),
  householdType: z.enum(HOUSEHOLD_TYPES),
  preferredLocations: z
    .array(preferredLocationSchema)
    .min(1, "Add at least one preferred location from the suggestions")
    .max(10),
  climatePreference: z.enum(CLIMATE_PREFERENCES),
  distanceFromCity: z.enum(DISTANCE_FROM_CITY),
  communityTypes: z.array(z.enum(COMMUNITY_TYPES)).min(1),
  homeTypes: z.array(z.enum(HOME_TYPES)).min(1),
  investmentCapacity: z.enum(INVESTMENT_CAPACITY),
  investorType: z.enum(INVESTOR_TYPES),
  energyPreferences: z.array(z.enum(ENERGY_PREFERENCES)).min(1),
  foodInterests: z.array(z.enum(FOOD_INTERESTS)).min(1),
  moveTimeline: z.enum(MOVE_TIMELINES),
  notes: z.string().trim().max(5000).optional().default(""),
})

export type CommunityInterestInput = z.infer<typeof communityInterestSchema>

export function communityInterestToRow(
  data: CommunityInterestInput,
  userId: string | null
) {
  return {
    user_id: userId,
    full_name: data.fullName,
    email: data.email.toLowerCase(),
    country: data.country,
    city_region: data.cityRegion,
    age_range: data.ageRange,
    household_type: data.householdType,
    preferred_locations: data.preferredLocations,
    climate_preference: data.climatePreference,
    distance_from_city: data.distanceFromCity,
    community_types: data.communityTypes,
    home_types: data.homeTypes,
    investment_capacity: data.investmentCapacity,
    investor_type: data.investorType,
    energy_preferences: data.energyPreferences,
    food_interests: data.foodInterests,
    move_timeline: data.moveTimeline,
    notes: data.notes || null,
  }
}
