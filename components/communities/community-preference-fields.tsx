"use client"

import { LocationAutocomplete } from "@/components/communities/location-autocomplete"
import { useI18n } from "@/components/i18n-provider"
import type { PreferredLocation } from "@/lib/community-interest-location"
import {
  CLIMATE_LABEL_KEYS,
  CLIMATE_PREFERENCES,
  COMMUNITY_INTENTS,
  DIETARY_LABEL_KEYS,
  DIETARY_PREFERENCES,
  DISTANCE_LABEL_KEYS,
  DISTANCE_FROM_CITY,
  ENERGY_SOURCE_LABEL_KEYS,
  ENERGY_SOURCE_OPTIONS,
  FOOD_FREQUENCIES,
  FOOD_PRODUCT_OPTIONS,
  FOOD_PRODUCTION_LABEL_KEYS,
  FOOD_PRODUCTION_OPTIONS,
  INVESTMENT_CAPACITY,
  INVESTMENT_LABEL_KEYS,
  INVESTOR_TYPE_LABEL_KEYS,
  INVESTOR_TYPES,
  LIVING_MODEL_OPTIONS,
  MOVE_TIMELINE_LABEL_KEYS,
  MOVE_TIMELINES,
  OWNERSHIP_OPTIONS,
  type CommunityInterestInput,
} from "@/lib/community-interest"

const selectClass =
  "w-full rounded-lg border border-[#d4dce8] bg-white p-3 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"
const inputClass =
  "w-full rounded-lg border border-[#d4dce8] bg-white p-3 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"
const sectionClass = "space-y-3 rounded-xl border border-[#d4dce8] bg-white p-5"

export type CommunityPreferenceFormState = {
  intent: CommunityInterestInput["intent"]
  preferredLocations: PreferredLocation[]
  climatePreference: CommunityInterestInput["climatePreference"] | null
  distanceFromCity: CommunityInterestInput["distanceFromCity"] | null
  investmentCapacity: CommunityInterestInput["investmentCapacity"] | null
  investorType: CommunityInterestInput["investorType"] | null
  moveTimeline: CommunityInterestInput["moveTimeline"] | null
  livingModel: CommunityInterestInput["livingModel"] | null
  energyOwnership: CommunityInterestInput["energyOwnership"] | null
  energyPreferences: NonNullable<CommunityInterestInput["energyPreferences"]>
  foodOwnership: CommunityInterestInput["foodOwnership"] | null
  foodPreferences: NonNullable<CommunityInterestInput["foodPreferences"]>
  dietaryPreference: CommunityInterestInput["dietaryPreference"] | null
  foodProducts: NonNullable<CommunityInterestInput["foodProducts"]>
  foodFrequency: CommunityInterestInput["foodFrequency"] | null
  notes: string
}

function toggleValue(list: string[], value: string, checked: boolean): string[] {
  if (checked) return list.includes(value) ? list : [...list, value]
  return list.filter((item) => item !== value)
}

type CommunityPreferenceFieldsProps = {
  form: CommunityPreferenceFormState
  onChange: (next: CommunityPreferenceFormState) => void
  disabled?: boolean
}

export function CommunityPreferenceFields({
  form,
  onChange,
  disabled = false,
}: CommunityPreferenceFieldsProps) {
  const { t } = useI18n()

  const requiresLiving = form.intent === "live" || form.intent === "both"
  const requiresFoodBuyer = form.intent === "buy_food" || form.intent === "both"
  const showEnergySources = form.energyOwnership === "Resident-owned"
  const showFoodMethods = form.foodOwnership === "Resident-owned"

  const set = (patch: Partial<CommunityPreferenceFormState>) =>
    onChange({ ...form, ...patch })

  return (
    <div className="space-y-6">
      <fieldset className={sectionClass} disabled={disabled}>
        <legend className="font-medium text-[#0d1b2a]">{t("communities.form.intent")}</legend>
        {COMMUNITY_INTENTS.map((intent) => (
          <label
            key={intent}
            className="flex cursor-pointer gap-3 rounded-lg border border-transparent p-2 hover:border-[#d4dce8]"
          >
            <input
              type="radio"
              name="community-intent"
              className="mt-1 shrink-0"
              value={intent}
              checked={form.intent === intent}
              onChange={() =>
                set({
                  intent,
                  foodProducts: intent === "live" ? [] : form.foodProducts,
                  foodFrequency: intent === "live" ? null : form.foodFrequency,
                })
              }
            />
            <span className="text-sm text-[#3d5166]">
              {t(`communities.form.intent_option.${intent}`)}
            </span>
          </label>
        ))}
      </fieldset>

      <div className="space-y-4 rounded-xl border border-[#d4dce8] bg-white p-5">
        <p className="font-medium text-[#0d1b2a]">
          {requiresLiving ? t("communities.form.where_live") : t("communities.form.food_location")}
        </p>
        <LocationAutocomplete
          locations={form.preferredLocations}
          maxLocations={10}
          disabled={disabled}
          onChange={(preferredLocations) => set({ preferredLocations })}
        />
      </div>

      {requiresLiving ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              className={selectClass}
              required={requiresLiving}
              value={form.climatePreference ?? ""}
              onChange={(e) =>
                set({
                  climatePreference: e.target.value as CommunityInterestInput["climatePreference"],
                })
              }
            >
              <option value="" disabled>
                {t("communities.form.climate")}
              </option>
              {CLIMATE_PREFERENCES.map((option) => (
                <option key={option} value={option}>
                  {t(CLIMATE_LABEL_KEYS[option])}
                </option>
              ))}
            </select>
            <select
              className={selectClass}
              required={requiresLiving}
              value={form.distanceFromCity ?? ""}
              onChange={(e) =>
                set({
                  distanceFromCity: e.target.value as CommunityInterestInput["distanceFromCity"],
                })
              }
            >
              <option value="" disabled>
                {t("communities.form.distance_city")}
              </option>
              {DISTANCE_FROM_CITY.map((option) => (
                <option key={option} value={option}>
                  {t(DISTANCE_LABEL_KEYS[option])}
                </option>
              ))}
            </select>
          </div>

          <fieldset className={sectionClass}>
            <legend className="font-medium text-[#0d1b2a]">{t("communities.form.living_model")}</legend>
            {LIVING_MODEL_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer gap-3 rounded-lg border border-transparent p-2 hover:border-[#d4dce8]"
              >
                <input
                  type="radio"
                  name="livingModel"
                  className="mt-1 shrink-0"
                  value={option.value}
                  checked={form.livingModel === option.value}
                  onChange={() => set({ livingModel: option.value })}
                />
                <span className="text-sm text-[#3d5166]">
                  <span className="font-medium text-[#0d1b2a]">{t(option.labelKey)}</span>
                  <span className="mt-0.5 block">{t(option.descriptionKey)}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <fieldset className={sectionClass}>
            <legend className="font-medium text-[#0d1b2a]">{t("communities.form.energy_ownership")}</legend>
            {OWNERSHIP_OPTIONS.map((option) => (
              <label
                key={`energy-${option.value}`}
                className="flex cursor-pointer gap-3 rounded-lg border border-transparent p-2 hover:border-[#d4dce8]"
              >
                <input
                  type="radio"
                  name="energyOwnership"
                  className="mt-1 shrink-0"
                  value={option.value}
                  checked={form.energyOwnership === option.value}
                  onChange={() =>
                    set({
                      energyOwnership: option.value,
                      energyPreferences:
                        option.value === "Resident-owned" ? form.energyPreferences : [],
                    })
                  }
                />
                <span className="text-sm text-[#3d5166]">
                  <span className="font-medium text-[#0d1b2a]">{t(option.labelKey)}</span>
                  {option.energyDescriptionKey ? (
                    <span className="mt-0.5 block">{t(option.energyDescriptionKey)}</span>
                  ) : null}
                </span>
              </label>
            ))}
          </fieldset>

          {showEnergySources ? (
            <fieldset className={sectionClass}>
              <legend className="font-medium text-[#0d1b2a]">{t("communities.form.energy_sources")}</legend>
              <p className="text-xs text-[#8a9bb0]">{t("communities.form.select_all")}</p>
              {ENERGY_SOURCE_OPTIONS.map((option) => (
                <label key={option} className="flex gap-2 text-sm text-[#3d5166]">
                  <input
                    type="checkbox"
                    checked={form.energyPreferences.includes(option)}
                    onChange={(e) =>
                      set({
                        energyPreferences: toggleValue(
                          form.energyPreferences,
                          option,
                          e.target.checked
                        ) as NonNullable<CommunityInterestInput["energyPreferences"]>,
                      })
                    }
                  />
                  {t(ENERGY_SOURCE_LABEL_KEYS[option])}
                </label>
              ))}
            </fieldset>
          ) : null}

          <fieldset className={sectionClass}>
            <legend className="font-medium text-[#0d1b2a]">{t("communities.form.food_ownership")}</legend>
            {OWNERSHIP_OPTIONS.map((option) => (
              <label
                key={`food-${option.value}`}
                className="flex cursor-pointer gap-3 rounded-lg border border-transparent p-2 hover:border-[#d4dce8]"
              >
                <input
                  type="radio"
                  name="foodOwnership"
                  className="mt-1 shrink-0"
                  value={option.value}
                  checked={form.foodOwnership === option.value}
                  onChange={() =>
                    set({
                      foodOwnership: option.value,
                      foodPreferences:
                        option.value === "Resident-owned" ? form.foodPreferences : [],
                    })
                  }
                />
                <span className="text-sm text-[#3d5166]">
                  <span className="font-medium text-[#0d1b2a]">{t(option.labelKey)}</span>
                  {option.foodDescriptionKey ? (
                    <span className="mt-0.5 block">{t(option.foodDescriptionKey)}</span>
                  ) : null}
                </span>
              </label>
            ))}
          </fieldset>

          {showFoodMethods ? (
            <fieldset className={sectionClass}>
              <legend className="font-medium text-[#0d1b2a]">{t("communities.form.food_methods")}</legend>
              <p className="text-xs text-[#8a9bb0]">{t("communities.form.select_all")}</p>
              {FOOD_PRODUCTION_OPTIONS.map((option) => (
                <label key={option} className="flex gap-2 text-sm text-[#3d5166]">
                  <input
                    type="checkbox"
                    checked={form.foodPreferences.includes(option)}
                    onChange={(e) =>
                      set({
                        foodPreferences: toggleValue(
                          form.foodPreferences,
                          option,
                          e.target.checked
                        ) as NonNullable<CommunityInterestInput["foodPreferences"]>,
                      })
                    }
                  />
                  {t(FOOD_PRODUCTION_LABEL_KEYS[option])}
                </label>
              ))}
            </fieldset>
          ) : null}

          <fieldset className={sectionClass}>
            <legend className="font-medium text-[#0d1b2a]">{t("communities.form.dietary")}</legend>
            {DIETARY_PREFERENCES.map((option) => (
              <label key={option} className="flex cursor-pointer gap-3 p-2 text-sm text-[#3d5166]">
                <input
                  type="radio"
                  name="dietaryPreference"
                  className="mt-0.5 shrink-0"
                  value={option}
                  checked={form.dietaryPreference === option}
                  onChange={() => set({ dietaryPreference: option })}
                />
                {t(DIETARY_LABEL_KEYS[option])}
              </label>
            ))}
          </fieldset>
        </div>
      ) : null}

      {requiresFoodBuyer ? (
        <fieldset className={sectionClass}>
          <legend className="font-medium text-[#0d1b2a]">{t("communities.form.food_buyer_section")}</legend>
          <p className="text-sm text-[#3d5166]">{t("communities.form.food_products")}</p>
          {FOOD_PRODUCT_OPTIONS.map((option) => (
            <label key={option} className="flex gap-2 text-sm text-[#3d5166]">
              <input
                type="checkbox"
                checked={form.foodProducts.includes(option)}
                onChange={(e) =>
                  set({
                    foodProducts: toggleValue(
                      form.foodProducts,
                      option,
                      e.target.checked
                    ) as NonNullable<CommunityInterestInput["foodProducts"]>,
                  })
                }
              />
              {t(`communities.form.food_product_option.${option}`)}
            </label>
          ))}
          <select
            className={selectClass}
            value={form.foodFrequency ?? ""}
            onChange={(e) =>
              set({
                foodFrequency: e.target.value as CommunityInterestInput["foodFrequency"],
              })
            }
          >
            <option value="" disabled>
              {t("communities.form.food_frequency")}
            </option>
            {FOOD_FREQUENCIES.map((option) => (
              <option key={option} value={option}>
                {t(`communities.form.food_frequency_option.${option}`)}
              </option>
            ))}
          </select>
        </fieldset>
      ) : null}

      {requiresLiving ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <select
            className={selectClass}
            value={form.investmentCapacity ?? ""}
            onChange={(e) =>
              set({
                investmentCapacity: e.target.value as CommunityInterestInput["investmentCapacity"],
              })
            }
          >
            <option value="" disabled>
              {t("communities.form.investment")}
            </option>
            {INVESTMENT_CAPACITY.map((option) => (
              <option key={option} value={option}>
                {t(INVESTMENT_LABEL_KEYS[option])}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={form.investorType ?? ""}
            onChange={(e) =>
              set({
                investorType: e.target.value as CommunityInterestInput["investorType"],
              })
            }
          >
            <option value="" disabled>
              {t("communities.form.investor_type")}
            </option>
            {INVESTOR_TYPES.map((option) => (
              <option key={option} value={option}>
                {t(INVESTOR_TYPE_LABEL_KEYS[option])}
              </option>
            ))}
          </select>
          <select
            className={`${selectClass} sm:col-span-2`}
            value={form.moveTimeline ?? ""}
            onChange={(e) =>
              set({
                moveTimeline: e.target.value as CommunityInterestInput["moveTimeline"],
              })
            }
          >
            <option value="" disabled>
              {t("communities.form.timeline")}
            </option>
            {MOVE_TIMELINES.map((option) => (
              <option key={option} value={option}>
                {t(MOVE_TIMELINE_LABEL_KEYS[option])}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <textarea
        className={inputClass}
        rows={4}
        placeholder={t("communities.form.notes")}
        value={form.notes}
        onChange={(e) => set({ notes: e.target.value })}
      />
    </div>
  )
}

export function emptyCommunityPreferenceForm(): CommunityPreferenceFormState {
  return {
    intent: "live",
    preferredLocations: [],
    climatePreference: null,
    distanceFromCity: null,
    investmentCapacity: null,
    investorType: null,
    moveTimeline: null,
    livingModel: null,
    energyOwnership: null,
    energyPreferences: [],
    foodOwnership: null,
    foodPreferences: [],
    dietaryPreference: null,
    foodProducts: [],
    foodFrequency: null,
    notes: "",
  }
}

export function communityDataToFormState(
  data: import("@/lib/profile-community").ProfileCommunityData
): CommunityPreferenceFormState {
  return {
    intent: (data.intent as CommunityPreferenceFormState["intent"]) ?? "live",
    preferredLocations: data.preferredLocations,
    climatePreference: data.climatePreference as CommunityPreferenceFormState["climatePreference"],
    distanceFromCity: data.distanceFromCity as CommunityPreferenceFormState["distanceFromCity"],
    investmentCapacity: data.investmentCapacity as CommunityPreferenceFormState["investmentCapacity"],
    investorType: data.investorType as CommunityPreferenceFormState["investorType"],
    moveTimeline: data.moveTimeline as CommunityPreferenceFormState["moveTimeline"],
    livingModel: data.livingModel as CommunityPreferenceFormState["livingModel"],
    energyOwnership: data.energyOwnership as CommunityPreferenceFormState["energyOwnership"],
    energyPreferences: data.energyPreferences as CommunityPreferenceFormState["energyPreferences"],
    foodOwnership: data.foodOwnership as CommunityPreferenceFormState["foodOwnership"],
    foodPreferences: data.foodPreferences as CommunityPreferenceFormState["foodPreferences"],
    dietaryPreference: data.dietaryPreference as CommunityPreferenceFormState["dietaryPreference"],
    foodProducts: data.foodProducts as CommunityPreferenceFormState["foodProducts"],
    foodFrequency: data.foodFrequency as CommunityPreferenceFormState["foodFrequency"],
    notes: data.notes ?? "",
  }
}
