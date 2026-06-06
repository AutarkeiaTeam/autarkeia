"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { LocationAutocomplete } from "@/components/communities/location-autocomplete"
import { useI18n } from "@/components/i18n-provider"
import {
  AGE_RANGES,
  AGE_RANGE_LABEL_KEYS,
  CLIMATE_LABEL_KEYS,
  COMMUNITY_INTENTS,
  CLIMATE_PREFERENCES,
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
  HOUSEHOLD_TYPE_LABEL_KEYS,
  HOUSEHOLD_TYPES,
  INVESTMENT_LABEL_KEYS,
  INVESTMENT_CAPACITY,
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

type RegisterFormState = Omit<
  CommunityInterestInput,
  "livingModel" | "energyOwnership" | "foodOwnership" | "dietaryPreference"
> & {
  livingModel: CommunityInterestInput["livingModel"] | ""
  energyOwnership: CommunityInterestInput["energyOwnership"] | ""
  foodOwnership: CommunityInterestInput["foodOwnership"] | ""
  dietaryPreference: CommunityInterestInput["dietaryPreference"] | ""
}

function toggleValue(list: string[], value: string, checked: boolean): string[] {
  if (checked) return list.includes(value) ? list : [...list, value]
  return list.filter((item) => item !== value)
}

const initialForm: RegisterFormState = {
  fullName: "",
  email: "",
  country: "",
  cityRegion: "",
  ageRange: "26-35",
  householdType: "single",
  preferredLocations: [],
  climatePreference: "Temperate",
  distanceFromCity: "30-60min",
  investmentCapacity: "€50k-€150k",
  investorType: "Individual/family",
  intent: "live",
  foodProducts: null,
  foodFrequency: null,
  livingModel: "",
  energyOwnership: "",
  energyPreferences: [],
  foodOwnership: "",
  foodPreferences: [],
  dietaryPreference: "",
  moveTimeline: "Just exploring",
  notes: "",
}

export function RegisterInterestForm() {
  const { t, locale } = useI18n()
  const searchParams = useSearchParams()
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const intentOverriddenRef = useRef(false)

  useEffect(() => {
    if (intentOverriddenRef.current) return
    const preset = searchParams.get("intent")
    if (preset !== "live" && preset !== "buy_food" && preset !== "both") return
    setForm((prev) => ({
      ...prev,
      intent: preset,
      foodProducts: preset === "live" ? null : (prev.foodProducts ?? []),
      foodFrequency: preset === "live" ? null : (prev.foodFrequency ?? null),
    }))
  }, [searchParams])

  const requiresLiving = form.intent === "live" || form.intent === "both"
  const requiresFoodBuyer = form.intent === "buy_food" || form.intent === "both"
  const showEnergySources = form.energyOwnership === "Resident-owned"
  const showFoodMethods = form.foodOwnership === "Resident-owned"
  const translateError = (message: string) =>
    message.startsWith("communities.") ? t(message) : message

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    if (form.preferredLocations.length === 0) {
      setStatus("error")
      setErrorMessage(t("communities.form.error_add_location"))
      return
    }

    const livingModel = requiresLiving ? form.livingModel : null
    const energyOwnership = requiresLiving ? form.energyOwnership : null
    const foodOwnership = requiresLiving ? form.foodOwnership : null
    const dietaryPreference = requiresLiving ? form.dietaryPreference : null
    const foodProducts = requiresFoodBuyer ? (form.foodProducts ?? []) : null
    const foodFrequency = requiresFoodBuyer ? form.foodFrequency : null

    const payload: CommunityInterestInput = {
      ...form,
      locale,
      livingModel: livingModel as CommunityInterestInput["livingModel"],
      energyOwnership: energyOwnership as CommunityInterestInput["energyOwnership"],
      foodOwnership: foodOwnership as CommunityInterestInput["foodOwnership"],
      dietaryPreference: dietaryPreference as CommunityInterestInput["dietaryPreference"],
      climatePreference: requiresLiving ? form.climatePreference : null,
      distanceFromCity: requiresLiving ? form.distanceFromCity : null,
      investmentCapacity: requiresLiving ? form.investmentCapacity : null,
      investorType: requiresLiving ? form.investorType : null,
      moveTimeline: requiresLiving ? form.moveTimeline : null,
      energyPreferences: requiresLiving && showEnergySources ? (form.energyPreferences ?? []) : null,
      foodPreferences: requiresLiving && showFoodMethods ? (form.foodPreferences ?? []) : null,
      foodProducts,
      foodFrequency,
    }

    try {
      const response = await fetch("/api/community-interest/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = (await response.json().catch(() => null)) as { error?: string; ok?: boolean }

      if (!response.ok) {
        const message = data?.error ? translateError(data.error) : t("communities.form.error_submit")
        throw new Error(message)
      }

      setStatus("success")
      setForm(initialForm)
    } catch (err) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : t("communities.form.error_submit"))
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className={inputClass}
          placeholder={t("communities.form.full_name")}
          required
          value={form.fullName}
          onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
        />
        <input
          type="email"
          className={inputClass}
          placeholder={t("communities.form.email")}
          required
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          className={inputClass}
          placeholder={t("communities.form.country")}
          required
          value={form.country}
          onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
        />
        <input
          className={inputClass}
          placeholder={t("communities.form.city")}
          required
          value={form.cityRegion}
          onChange={(e) => setForm((prev) => ({ ...prev, cityRegion: e.target.value }))}
        />
        <select
          className={selectClass}
          required
          value={form.ageRange}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, ageRange: e.target.value as CommunityInterestInput["ageRange"] }))
          }
        >
          <option value="" disabled>
            {t("communities.form.age_range")}
          </option>
          {AGE_RANGES.map((option) => (
            <option key={option} value={option}>
              {t(AGE_RANGE_LABEL_KEYS[option])}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          required
          value={form.householdType}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              householdType: e.target.value as CommunityInterestInput["householdType"],
            }))
          }
        >
          <option value="" disabled>
            {t("communities.form.household")}
          </option>
          {HOUSEHOLD_TYPES.map((option) => (
            <option key={option} value={option}>
              {t(HOUSEHOLD_TYPE_LABEL_KEYS[option])}
            </option>
          ))}
        </select>
      </div>

      <fieldset className={sectionClass}>
        <legend className="font-medium text-[#0d1b2a]">{t("communities.form.intent")}</legend>
        {COMMUNITY_INTENTS.map((intent) => (
          <label key={intent} className="flex cursor-pointer gap-3 rounded-lg border border-transparent p-2 hover:border-[#d4dce8]">
            <input
              type="radio"
              name="intent"
              className="mt-1 shrink-0"
              value={intent}
              checked={form.intent === intent}
              onChange={() => {
                intentOverriddenRef.current = true
                setForm((prev) => ({
                  ...prev,
                  intent,
                  foodProducts: intent === "live" ? null : (prev.foodProducts ?? []),
                  foodFrequency: intent === "live" ? null : (prev.foodFrequency ?? null),
                }))
              }}
            />
            <span className="text-sm text-[#3d5166]">{t(`communities.form.intent_option.${intent}`)}</span>
          </label>
        ))}
      </fieldset>

      <div className="space-y-4 rounded-xl border border-[#d4dce8] bg-white p-5">
        <p className="font-medium text-[#0d1b2a]">
          {requiresLiving
            ? t("communities.form.where_live")
            : t("communities.form.food_location")}
        </p>
        <LocationAutocomplete
          locations={form.preferredLocations}
          maxLocations={10}
          disabled={status === "loading" || status === "success"}
          onChange={(preferredLocations) =>
            setForm((prev) => ({ ...prev, preferredLocations }))
          }
        />
      </div>

      {requiresLiving && (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <select
            className={selectClass}
            required={requiresLiving}
            value={form.climatePreference ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                climatePreference: e.target.value as CommunityInterestInput["climatePreference"],
              }))
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
              setForm((prev) => ({
                ...prev,
                distanceFromCity: e.target.value as CommunityInterestInput["distanceFromCity"],
              }))
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
                required={requiresLiving}
                value={option.value}
                checked={form.livingModel === option.value}
                onChange={() => setForm((prev) => ({ ...prev, livingModel: option.value }))}
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
                required={requiresLiving}
                value={option.value}
                checked={form.energyOwnership === option.value}
                onChange={() =>
                  setForm((prev) => ({
                    ...prev,
                    energyOwnership: option.value,
                    energyPreferences:
                      option.value === "Resident-owned" ? prev.energyPreferences : [],
                  }))
                }
              />
              <span className="text-sm text-[#3d5166]">
                <span className="font-medium text-[#0d1b2a]">{t(option.labelKey)}</span>
                <span className="mt-0.5 block">{option.energyDescriptionKey ? t(option.energyDescriptionKey) : ""}</span>
              </span>
            </label>
          ))}
        </fieldset>

        {showEnergySources && (
          <fieldset className={sectionClass}>
            <legend className="font-medium text-[#0d1b2a]">{t("communities.form.energy_sources")}</legend>
            <p className="text-xs text-[#8a9bb0]">{t("communities.form.select_all")}</p>
            {ENERGY_SOURCE_OPTIONS.map((option) => (
              <label key={option} className="flex gap-2 text-sm text-[#3d5166]">
                <input
                  type="checkbox"
                  checked={(form.energyPreferences ?? []).includes(option)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      energyPreferences: toggleValue(
                        prev.energyPreferences ?? [],
                        option,
                        e.target.checked
                      ) as NonNullable<CommunityInterestInput["energyPreferences"]>,
                    }))
                  }
                />
                {t(ENERGY_SOURCE_LABEL_KEYS[option])}
              </label>
            ))}
          </fieldset>
        )}

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
                required={requiresLiving}
                value={option.value}
                checked={form.foodOwnership === option.value}
                onChange={() =>
                  setForm((prev) => ({
                    ...prev,
                    foodOwnership: option.value,
                    foodPreferences:
                      option.value === "Resident-owned" ? prev.foodPreferences ?? [] : null,
                  }))
                }
              />
              <span className="text-sm text-[#3d5166]">
                <span className="font-medium text-[#0d1b2a]">{t(option.labelKey)}</span>
                <span className="mt-0.5 block">{option.foodDescriptionKey ? t(option.foodDescriptionKey) : ""}</span>
              </span>
            </label>
          ))}
        </fieldset>

        {showFoodMethods && (
          <fieldset className={sectionClass}>
            <legend className="font-medium text-[#0d1b2a]">{t("communities.form.food_methods")}</legend>
            <p className="text-xs text-[#8a9bb0]">{t("communities.form.select_all")}</p>
            {FOOD_PRODUCTION_OPTIONS.map((option) => (
              <label key={option} className="flex gap-2 text-sm text-[#3d5166]">
                <input
                  type="checkbox"
                  checked={(form.foodPreferences ?? []).includes(option)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      foodPreferences: toggleValue(
                        prev.foodPreferences ?? [],
                        option,
                        e.target.checked
                      ) as NonNullable<CommunityInterestInput["foodPreferences"]>,
                    }))
                  }
                />
                {t(FOOD_PRODUCTION_LABEL_KEYS[option])}
              </label>
            ))}
          </fieldset>
        )}

        <fieldset className={sectionClass}>
          <legend className="font-medium text-[#0d1b2a]">{t("communities.form.dietary")}</legend>
          {DIETARY_PREFERENCES.map((option) => (
            <label key={option} className="flex cursor-pointer gap-3 p-2 text-sm text-[#3d5166]">
              <input
                type="radio"
                name="dietaryPreference"
                className="mt-0.5 shrink-0"
                required={requiresLiving}
                value={option}
                checked={form.dietaryPreference === option}
                onChange={() => setForm((prev) => ({ ...prev, dietaryPreference: option }))}
              />
              {t(DIETARY_LABEL_KEYS[option])}
            </label>
          ))}
        </fieldset>
      </div>
      )}

      {requiresFoodBuyer && (
        <fieldset className={sectionClass}>
          <legend className="font-medium text-[#0d1b2a]">{t("communities.form.food_buyer_section")}</legend>
          <p className="text-sm text-[#3d5166]">{t("communities.form.food_products")}</p>
          {FOOD_PRODUCT_OPTIONS.map((option) => (
            <label key={option} className="flex gap-2 text-sm text-[#3d5166]">
              <input
                type="checkbox"
                checked={(form.foodProducts ?? []).includes(option)}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    foodProducts: toggleValue(prev.foodProducts ?? [], option, e.target.checked) as NonNullable<
                      CommunityInterestInput["foodProducts"]
                    >,
                  }))
                }
              />
              {t(`communities.form.food_product_option.${option}`)}
            </label>
          ))}
          <select
            className={selectClass}
            required={requiresFoodBuyer}
            value={form.foodFrequency ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                foodFrequency: e.target.value as CommunityInterestInput["foodFrequency"],
              }))
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
      )}

      {requiresLiving && (
      <div className="grid gap-4 sm:grid-cols-2">
        <select
          className={selectClass}
          required={requiresLiving}
          value={form.investmentCapacity ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              investmentCapacity: e.target.value as CommunityInterestInput["investmentCapacity"],
            }))
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
          required={requiresLiving}
          value={form.investorType ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              investorType: e.target.value as CommunityInterestInput["investorType"],
            }))
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
          required={requiresLiving}
          value={form.moveTimeline ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              moveTimeline: e.target.value as CommunityInterestInput["moveTimeline"],
            }))
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
      )}

      <textarea
        className={inputClass}
        rows={4}
        placeholder={t("communities.form.notes")}
        value={form.notes}
        onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
      />

      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="rounded-lg bg-[#009b70] px-6 py-3 font-medium text-white hover:bg-[#008060] disabled:opacity-60"
      >
        {status === "loading" ? t("communities.form.submitting") : t("communities.form.submit")}
      </button>

      {status === "error" && errorMessage && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>
      )}

      {status === "success" && (
        <p className="rounded-lg border border-[#009b70]/40 bg-[#e8f8f3] p-4 text-sm text-[#0d1b2a]">
          {t("communities.form.success_email")}
        </p>
      )}
    </form>
  )
}
