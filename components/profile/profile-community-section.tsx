"use client"

import { useI18n } from "@/components/i18n-provider"
import {
  CLIMATE_LABEL_KEYS,
  DIETARY_LABEL_KEYS,
  DISTANCE_LABEL_KEYS,
  ENERGY_SOURCE_LABEL_KEYS,
  FOOD_PRODUCTION_LABEL_KEYS,
  INVESTMENT_LABEL_KEYS,
  INVESTOR_TYPE_LABEL_KEYS,
  MOVE_TIMELINE_LABEL_KEYS,
  LIVING_MODEL_OPTIONS,
  OWNERSHIP_OPTIONS,
  type CLIMATE_PREFERENCES,
  type DIETARY_PREFERENCES,
  type DISTANCE_FROM_CITY,
  type INVESTMENT_CAPACITY,
  type INVESTOR_TYPES,
  type MOVE_TIMELINES,
} from "@/lib/community-interest"
import { formatPreferredLocationsForDisplay } from "@/lib/community-interest-location"
import {
  hasVisibleCommunitySection,
  shouldShowCommunityGroup,
  type ProfileCommunityData,
} from "@/lib/profile-community"

type ProfileCommunitySectionProps = {
  community: ProfileCommunityData
  isOwner: boolean
  profilePublic: boolean
}

function PrivateBadge() {
  const { t } = useI18n()
  return (
    <span className="ml-2 rounded-full bg-[#f5f7fa] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#8a9bb0]">
      {t("profile.community.private_badge")}
    </span>
  )
}

function AboutRow({
  label,
  value,
  isPrivate,
}: {
  label: string
  value: string
  isPrivate: boolean
}) {
  return (
    <div className="text-sm text-[#3d5166]">
      <span className="font-medium text-[#0d1b2a]">{label}: </span>
      <span>{value}</span>
      {isPrivate ? <PrivateBadge /> : null}
    </div>
  )
}

function livingModelLabel(value: string, t: (key: string) => string): string {
  const option = LIVING_MODEL_OPTIONS.find((o) => o.value === value)
  return option ? t(option.labelKey) : value
}

function ownershipLabel(value: string, t: (key: string) => string): string {
  const option = OWNERSHIP_OPTIONS.find((o) => o.value === value)
  return option ? t(option.labelKey) : value
}

export function ProfileCommunitySection({
  community,
  isOwner,
  profilePublic,
}: ProfileCommunitySectionProps) {
  const { t } = useI18n()

  if (!hasVisibleCommunitySection(community, isOwner, profilePublic)) {
    return null
  }

  const showIntent = shouldShowCommunityGroup(community, "intent", "showIntent", isOwner, profilePublic)
  const showLocations = shouldShowCommunityGroup(
    community,
    "locations",
    "showLocations",
    isOwner,
    profilePublic
  )
  const showLiving = shouldShowCommunityGroup(
    community,
    "living",
    "showLivingPref",
    isOwner,
    profilePublic
  )
  const showInvestment = shouldShowCommunityGroup(
    community,
    "investment",
    "showInvestment",
    isOwner,
    profilePublic
  )
  const showFood = shouldShowCommunityGroup(community, "food", "showFoodPref", isOwner, profilePublic)
  const showTimeline = shouldShowCommunityGroup(
    community,
    "timeline",
    "showTimeline",
    isOwner,
    profilePublic
  )

  const livingParts: string[] = []
  if (community.livingModel) {
    livingParts.push(livingModelLabel(community.livingModel, t))
  }
  if (community.climatePreference) {
    livingParts.push(
      t(CLIMATE_LABEL_KEYS[community.climatePreference as (typeof CLIMATE_PREFERENCES)[number]])
    )
  }
  if (community.distanceFromCity) {
    livingParts.push(
      t(DISTANCE_LABEL_KEYS[community.distanceFromCity as (typeof DISTANCE_FROM_CITY)[number]])
    )
  }
  if (community.energyOwnership) {
    livingParts.push(community.energyOwnership)
  }
  if (community.energyPreferences.length > 0) {
    livingParts.push(
      community.energyPreferences
        .map((s) => t(ENERGY_SOURCE_LABEL_KEYS[s as keyof typeof ENERGY_SOURCE_LABEL_KEYS]))
        .join(", ")
    )
  }
  if (community.foodOwnership) {
    livingParts.push(ownershipLabel(community.foodOwnership, t))
  }
  if (community.foodPreferences.length > 0) {
    livingParts.push(
      community.foodPreferences
        .map((s) => t(FOOD_PRODUCTION_LABEL_KEYS[s as keyof typeof FOOD_PRODUCTION_LABEL_KEYS]))
        .join(", ")
    )
  }
  if (community.dietaryPreference) {
    livingParts.push(
      t(DIETARY_LABEL_KEYS[community.dietaryPreference as (typeof DIETARY_PREFERENCES)[number]])
    )
  }

  const foodBuyerParts: string[] = []
  if (community.foodProducts.length > 0) {
    foodBuyerParts.push(
      community.foodProducts.map((p) => t(`communities.form.food_product_option.${p}`)).join(", ")
    )
  }
  if (community.foodFrequency) {
    foodBuyerParts.push(t(`communities.form.food_frequency_option.${community.foodFrequency}`))
  }

  const investmentParts: string[] = []
  if (community.investmentCapacity) {
    investmentParts.push(
      t(INVESTMENT_LABEL_KEYS[community.investmentCapacity as (typeof INVESTMENT_CAPACITY)[number]])
    )
  }
  if (community.investorType) {
    investmentParts.push(
      t(INVESTOR_TYPE_LABEL_KEYS[community.investorType as (typeof INVESTOR_TYPES)[number]])
    )
  }

  const timelineParts: string[] = []
  if (community.moveTimeline) {
    timelineParts.push(
      t(MOVE_TIMELINE_LABEL_KEYS[community.moveTimeline as (typeof MOVE_TIMELINES)[number]])
    )
  }
  if (community.notes?.trim()) {
    timelineParts.push(community.notes.trim())
  }

  const locationLabels =
    community.preferredLocations.length > 0
      ? formatPreferredLocationsForDisplay(community.preferredLocations)
      : ""

  return (
    <div className="mt-8 border-t border-[#e8edf2] pt-8" style={{ borderTopWidth: "0.5px" }}>
      <h2 className="text-lg font-medium text-[#0d1b2a]">{t("profile.community.heading")}</h2>
      <div className="mt-4 space-y-3">
        {showIntent && community.intent ? (
          <AboutRow
            label={t("profile.community.field_labels.intent")}
            value={t(`communities.form.intent_option.${community.intent}`)}
            isPrivate={isOwner && !community.showIntent}
          />
        ) : null}

        {showLocations && locationLabels ? (
          <AboutRow
            label={t("profile.community.field_labels.locations")}
            value={locationLabels}
            isPrivate={isOwner && !community.showLocations}
          />
        ) : null}

        {showLiving && livingParts.length > 0 ? (
          <AboutRow
            label={t("profile.community.field_labels.living")}
            value={livingParts.join(" · ")}
            isPrivate={isOwner && !community.showLivingPref}
          />
        ) : null}

        {showFood && foodBuyerParts.length > 0 ? (
          <AboutRow
            label={t("profile.community.field_labels.food")}
            value={foodBuyerParts.join(" · ")}
            isPrivate={isOwner && !community.showFoodPref}
          />
        ) : null}

        {showInvestment && investmentParts.length > 0 ? (
          <AboutRow
            label={t("profile.community.field_labels.investment")}
            value={investmentParts.join(" · ")}
            isPrivate={isOwner && !community.showInvestment}
          />
        ) : null}

        {showTimeline && timelineParts.length > 0 ? (
          <AboutRow
            label={t("profile.community.field_labels.timeline")}
            value={timelineParts.join(" · ")}
            isPrivate={isOwner && !community.showTimeline}
          />
        ) : null}
      </div>
    </div>
  )
}
