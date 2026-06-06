import { z } from "zod"
import { LOCALES } from "@/lib/i18n-core"
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

export const AGE_RANGE_LABEL_KEYS: Record<(typeof AGE_RANGES)[number], string> = {
  "18-25": "communities.form.option.age.18-25",
  "26-35": "communities.form.option.age.26-35",
  "36-45": "communities.form.option.age.36-45",
  "46-55": "communities.form.option.age.46-55",
  "55+": "communities.form.option.age.55+",
}

export const HOUSEHOLD_TYPE_LABEL_KEYS: Record<(typeof HOUSEHOLD_TYPES)[number], string> = {
  single: "communities.form.option.household.single",
  couple: "communities.form.option.household.couple",
  "family with children": "communities.form.option.household.family_with_children",
  "group of friends": "communities.form.option.household.group_of_friends",
  other: "communities.form.option.household.other",
}

export const CLIMATE_LABEL_KEYS: Record<(typeof CLIMATE_PREFERENCES)[number], string> = {
  Mediterranean: "communities.form.option.climate.mediterranean",
  Temperate: "communities.form.option.climate.temperate",
  Tropical: "communities.form.option.climate.tropical",
  Cold: "communities.form.option.climate.cold",
  Any: "communities.form.option.climate.any",
}

export const DISTANCE_LABEL_KEYS: Record<(typeof DISTANCE_FROM_CITY)[number], string> = {
  "Within 30min": "communities.form.option.distance.within_30",
  "30-60min": "communities.form.option.distance.30_60",
  "1-2 hours": "communities.form.option.distance.1_2_hours",
  "Remote is fine": "communities.form.option.distance.remote_ok",
}

export const INVESTMENT_LABEL_KEYS: Record<(typeof INVESTMENT_CAPACITY)[number], string> = {
  "Under €50k": "communities.form.option.investment.under_50k",
  "€50k-€150k": "communities.form.option.investment.50k_150k",
  "€150k-€500k": "communities.form.option.investment.150k_500k",
  "€500k-€1M": "communities.form.option.investment.500k_1m",
  "Over €1M": "communities.form.option.investment.over_1m",
  "I want to rent not buy": "communities.form.option.investment.rent_not_buy",
}

export const INVESTOR_TYPE_LABEL_KEYS: Record<(typeof INVESTOR_TYPES)[number], string> = {
  "Individual/family": "communities.form.option.investor.individual_family",
  "Group of friends": "communities.form.option.investor.group_of_friends",
  "Small investor group": "communities.form.option.investor.small_group",
  "Institutional/fund": "communities.form.option.investor.institutional_fund",
  "Not sure yet": "communities.form.option.investor.not_sure",
}

export const MOVE_TIMELINE_LABEL_KEYS: Record<(typeof MOVE_TIMELINES)[number], string> = {
  "As soon as possible": "communities.form.option.timeline.asap",
  "1-2 years": "communities.form.option.timeline.1_2",
  "3-5 years": "communities.form.option.timeline.3_5",
  "5+ years": "communities.form.option.timeline.5_plus",
  "Just exploring": "communities.form.option.timeline.exploring",
}

export const ENERGY_SOURCE_LABEL_KEYS: Record<(typeof ENERGY_SOURCE_OPTIONS)[number], string> = {
  Solar: "communities.form.option.energy_source.solar",
  Wind: "communities.form.option.energy_source.wind",
  "Micro-hydro": "communities.form.option.energy_source.micro_hydro",
  "Combined off-grid": "communities.form.option.energy_source.combined_off_grid",
  "Combined on-grid": "communities.form.option.energy_source.combined_on_grid",
}

export const FOOD_PRODUCTION_LABEL_KEYS: Record<(typeof FOOD_PRODUCTION_OPTIONS)[number], string> = {
  "Permaculture food forest": "communities.form.option.food_production.permaculture_forest",
  "Annual vegetable gardens": "communities.form.option.food_production.annual_gardens",
  "Greenhouses and aquaponics": "communities.form.option.food_production.greenhouses_aquaponics",
  "Livestock and dairy": "communities.form.option.food_production.livestock_dairy",
  "Foraging and wild edibles": "communities.form.option.food_production.foraging_wild",
}

export const DIETARY_LABEL_KEYS: Record<(typeof DIETARY_PREFERENCES)[number], string> = {
  "Omnivore-friendly": "communities.form.option.dietary.omnivore",
  "Vegetarian-only": "communities.form.option.dietary.vegetarian",
  "Vegan-only": "communities.form.option.dietary.vegan",
  "No preference": "communities.form.option.dietary.none",
}

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
  labelKey: string
  descriptionKey: string
}> = [
  {
    value: "Single family plot",
    labelKey: "communities.form.option.living_model.single_family_plot.label",
    descriptionKey: "communities.form.option.living_model.single_family_plot.description",
  },
  {
    value: "Coliving",
    labelKey: "communities.form.option.living_model.coliving.label",
    descriptionKey: "communities.form.option.living_model.coliving.description",
  },
  {
    value: "Communal living",
    labelKey: "communities.form.option.living_model.communal_living.label",
    descriptionKey: "communities.form.option.living_model.communal_living.description",
  },
]

export const OWNERSHIP_OPTIONS: ReadonlyArray<{
  value: (typeof OWNERSHIP_MODELS)[number]
  labelKey: string
  energyDescriptionKey?: string
  foodDescriptionKey?: string
}> = [
  {
    value: "Resident-owned",
    labelKey: "communities.form.option.ownership.resident_owned.label",
    energyDescriptionKey: "communities.form.option.ownership.resident_owned.energy_description",
    foodDescriptionKey: "communities.form.option.ownership.resident_owned.food_description",
  },
  {
    value: "Autarkeia-managed",
    labelKey: "communities.form.option.ownership.autarkeia_managed.label",
    energyDescriptionKey: "communities.form.option.ownership.autarkeia_managed.energy_description",
    foodDescriptionKey: "communities.form.option.ownership.autarkeia_managed.food_description",
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
      .min(1, "communities.validation.add_location")
      .max(10),
    climatePreference: z.enum(CLIMATE_PREFERENCES).nullable().optional(),
    distanceFromCity: z.enum(DISTANCE_FROM_CITY).nullable().optional(),
    investmentCapacity: z.enum(INVESTMENT_CAPACITY).nullable().optional(),
    investorType: z.enum(INVESTOR_TYPES).nullable().optional(),
    moveTimeline: z.enum(MOVE_TIMELINES).nullable().optional(),
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
    locale: z.enum(LOCALES).optional().default("en"),
  })
  .superRefine((data, ctx) => {
    const requiresLiving = data.intent === "live" || data.intent === "both"
    const requiresFoodBuyer = data.intent === "buy_food" || data.intent === "both"
    if (requiresLiving) {
      if (!data.dietaryPreference) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dietaryPreference"],
          message: "communities.validation.dietary_required",
        })
      }
      if (!data.livingModel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["livingModel"],
          message: "communities.validation.living_model_required",
        })
      }

      if (!data.energyOwnership) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["energyOwnership"],
          message: "communities.validation.energy_ownership_required",
        })
      }

      if (!data.foodOwnership) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["foodOwnership"],
          message: "communities.validation.food_ownership_required",
        })
      }

      if (data.energyOwnership === "Resident-owned" && !data.energyPreferences?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["energyPreferences"],
          message: "communities.validation.energy_source_required",
        })
      }

      if (data.foodOwnership === "Resident-owned" && !data.foodPreferences?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["foodPreferences"],
          message: "communities.validation.food_method_required",
        })
      }

      if (!data.climatePreference) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["climatePreference"],
          message: "communities.validation.climate_required",
        })
      }

      if (!data.distanceFromCity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["distanceFromCity"],
          message: "communities.validation.distance_required",
        })
      }

      if (!data.investmentCapacity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["investmentCapacity"],
          message: "communities.validation.investment_required",
        })
      }

      if (!data.investorType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["investorType"],
          message: "communities.validation.investor_required",
        })
      }

      if (!data.moveTimeline) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["moveTimeline"],
          message: "communities.validation.timeline_required",
        })
      }
    }

    if (requiresFoodBuyer) {
      if (!data.foodProducts?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["foodProducts"],
          message: "communities.validation.food_products_required",
        })
      }

      if (!data.foodFrequency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["foodFrequency"],
          message: "communities.validation.food_frequency_required",
        })
      }
    }

    if (!requiresLiving) {
      if (data.energyPreferences?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["energyPreferences"],
          message: "communities.validation.energy_sources_not_applicable",
        })
      }

      if (data.foodPreferences?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["foodPreferences"],
          message: "communities.validation.food_methods_not_applicable",
        })
      }
    }

    if (!requiresFoodBuyer && (data.foodProducts?.length || data.foodFrequency)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["foodProducts"],
        message: "communities.validation.food_fields_not_applicable",
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
