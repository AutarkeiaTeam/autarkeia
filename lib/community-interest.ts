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
export const MOVE_TIMELINES = [
  "As soon as possible",
  "1-2 years",
  "3-5 years",
  "5+ years",
  "Just exploring",
] as const
export const COMMUNITY_INTENTS = ["live", "buy_food", "both"] as const
export const FOOD_PRODUCT_OPTIONS = [
  "Vegetables",
  "Fruit",
  "Eggs",
  "Dairy",
  "Honey",
  "Grains & legumes",
  "Herbs",
  "Preserves",
] as const
export const FOOD_FREQUENCIES = ["Weekly", "Monthly", "Yearly"] as const

export const LIVING_MODELS = [
  "Single family plot",
  "Coliving",
  "Communal living",
] as const

export const OWNERSHIP_MODELS = ["Resident-owned", "Autarkeia-managed"] as const

export const ENERGY_SOURCE_OPTIONS = [
  "Solar",
  "Wind",
  "Micro-hydro",
  "Combined off-grid",
  "Combined on-grid",
] as const

export const FOOD_PRODUCTION_OPTIONS = [
  "Permaculture food forest",
  "Annual vegetable gardens",
  "Greenhouses and aquaponics",
  "Livestock and dairy",
  "Foraging and wild edibles",
] as const

export const DIETARY_PREFERENCES = [
  "Omnivore-friendly",
  "Vegetarian-only",
  "Vegan-only",
  "No preference",
] as const

export const LIVING_MODEL_OPTIONS: ReadonlyArray<{
  value: (typeof LIVING_MODELS)[number]
  description: string
}> = [
  {
    value: "Single family plot",
    description: "One house on your own private property.",
  },
  {
    value: "Coliving",
    description:
      "Shared property with a group, either one single house together or multiple separate houses.",
  },
  {
    value: "Communal living",
    description:
      "Shared central building (bunkbeds, hammocks or private rooms), with the option to build your own subplot home together with the community. Lower entry cost, more shared labor.",
  },
]

export const OWNERSHIP_OPTIONS: ReadonlyArray<{
  value: (typeof OWNERSHIP_MODELS)[number]
  energyDescription?: string
  foodDescription?: string
}> = [
  {
    value: "Resident-owned",
    energyDescription: "Autarkeia sets it up, you own and run it.",
    foodDescription: "Autarkeia sets it up, you own and run it.",
  },
  {
    value: "Autarkeia-managed",
    energyDescription:
      "Hybrid renewable system connected to the grid. You pay a monthly or yearly fee.",
    foodDescription:
      "Varied supply of grains, vegetables, fruit and animal products produced by Autarkeia. You pay a monthly or yearly fee.",
  },
]

const nonEmptyString = z.string().trim().min(1).max(500)

export const communityInterestSchema = z
  .object({
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
    investmentCapacity: z.enum(INVESTMENT_CAPACITY),
    investorType: z.enum(INVESTOR_TYPES),
    moveTimeline: z.enum(MOVE_TIMELINES),
    notes: z.string().trim().max(5000).optional().default(""),
    intent: z.enum(COMMUNITY_INTENTS),
    foodProducts: z
      .array(z.enum(FOOD_PRODUCT_OPTIONS))
      .max(FOOD_PRODUCT_OPTIONS.length)
      .nullable()
      .optional(),
    foodFrequency: z.enum(FOOD_FREQUENCIES).nullable().optional(),

    livingModel: z.enum(LIVING_MODELS).nullable().optional(),
    energyOwnership: z.enum(OWNERSHIP_MODELS).nullable().optional(),
    energyPreferences: z
      .array(z.enum(ENERGY_SOURCE_OPTIONS))
      .max(ENERGY_SOURCE_OPTIONS.length)
      .nullable()
      .optional(),
    foodOwnership: z.enum(OWNERSHIP_MODELS).nullable().optional(),
    foodPreferences: z
      .array(z.enum(FOOD_PRODUCTION_OPTIONS))
      .max(FOOD_PRODUCTION_OPTIONS.length)
      .nullable()
      .optional(),
    dietaryPreference: z.enum(DIETARY_PREFERENCES).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const requiresLiving = data.intent === "live" || data.intent === "both"
    const requiresFoodBuyer = data.intent === "buy_food" || data.intent === "both"

    if (requiresLiving) {
      if (!data.livingModel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["livingModel"],
          message: "Select your preferred living model",
        })
      }

      if (!data.energyOwnership) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["energyOwnership"],
          message: "Select your preferred energy ownership setup",
        })
      }

      if (!data.foodOwnership) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["foodOwnership"],
          message: "Select your preferred food ownership setup",
        })
      }

      if (!data.dietaryPreference) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dietaryPreference"],
          message: "Select a dietary preference",
        })
      }

      if (data.energyOwnership === "Resident-owned" && !data.energyPreferences?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["energyPreferences"],
          message: "Select at least one preferred energy source",
        })
      }

      if (data.foodOwnership === "Resident-owned" && !data.foodPreferences?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["foodPreferences"],
          message: "Select at least one preferred food production method",
        })
      }

      if (!data.climatePreference) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["climatePreference"],
          message: "Select a climate preference",
        })
      }

      if (!data.distanceFromCity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["distanceFromCity"],
          message: "Select a preferred distance from city",
        })
      }

      if (!data.investmentCapacity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["investmentCapacity"],
          message: "Select an investment capacity",
        })
      }

      if (!data.investorType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["investorType"],
          message: "Select an investor type",
        })
      }

      if (!data.moveTimeline) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["moveTimeline"],
          message: "Select a move timeline",
        })
      }
    }

    if (requiresFoodBuyer) {
      if (!data.foodProducts?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["foodProducts"],
          message: "Select at least one product",
        })
      }

      if (!data.foodFrequency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["foodFrequency"],
          message: "Select a purchase frequency",
        })
      }
    }

    if (!requiresLiving) {
      if (data.energyPreferences?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["energyPreferences"],
          message: "Energy sources are only applicable for resident-focused submissions",
        })
      }

      if (data.foodPreferences?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["foodPreferences"],
          message: "Food production methods are only applicable for resident-focused submissions",
        })
      }
    }

    if (!requiresFoodBuyer && (data.foodProducts?.length || data.foodFrequency)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["foodProducts"],
        message: "Food buyer fields are only applicable for food-buyer submissions",
      })
    }
  })

export type CommunityInterestInput = z.infer<typeof communityInterestSchema>

export function communityInterestToRow(
  data: CommunityInterestInput,
  userId: string | null
) {
  const requiresLiving = data.intent === "live" || data.intent === "both"
  const requiresFoodBuyer = data.intent === "buy_food" || data.intent === "both"
  const energyPreferences =
    requiresLiving && data.energyOwnership === "Resident-owned" ? (data.energyPreferences ?? []) : null
  const foodPreferences =
    requiresLiving && data.foodOwnership === "Resident-owned" ? (data.foodPreferences ?? []) : null

  return {
    user_id: userId,
    full_name: data.fullName,
    email: data.email.toLowerCase(),
    country: data.country,
    city_region: data.cityRegion,
    age_range: data.ageRange,
    household_type: data.householdType,
    preferred_locations: data.preferredLocations,
    climate_preference: requiresLiving ? data.climatePreference : null,
    distance_from_city: requiresLiving ? data.distanceFromCity : null,
    investment_capacity: requiresLiving ? data.investmentCapacity : null,
    investor_type: requiresLiving ? data.investorType : null,
    move_timeline: requiresLiving ? data.moveTimeline : null,
    notes: data.notes || null,
    intent: data.intent,
    food_products: requiresFoodBuyer ? (data.foodProducts ?? []) : null,
    food_frequency: requiresFoodBuyer ? (data.foodFrequency ?? null) : null,
    living_model: requiresLiving ? data.livingModel : null,
    energy_ownership: requiresLiving ? data.energyOwnership : null,
    energy_preferences: energyPreferences,
    food_ownership: requiresLiving ? data.foodOwnership : null,
    food_preferences: foodPreferences,
    dietary_preference: requiresLiving ? data.dietaryPreference : null,
  }
}
