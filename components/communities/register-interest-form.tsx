"use client"

import { FormEvent, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  CommunityPreferenceFields,
  emptyCommunityPreferenceForm,
  type CommunityPreferenceFormState,
} from "@/components/communities/community-preference-fields"
import { useI18n } from "@/components/i18n-provider"
import {
  AGE_RANGES,
  AGE_RANGE_LABEL_KEYS,
  HOUSEHOLD_TYPE_LABEL_KEYS,
  HOUSEHOLD_TYPES,
  type CommunityInterestInput,
} from "@/lib/community-interest"

const selectClass =
  "w-full rounded-lg border border-[#d4dce8] bg-white p-3 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"
const inputClass =
  "w-full rounded-lg border border-[#d4dce8] bg-white p-3 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"

type ContactFormState = Pick<
  CommunityInterestInput,
  "fullName" | "email" | "country" | "cityRegion" | "ageRange" | "householdType"
>

const initialContact: ContactFormState = {
  fullName: "",
  email: "",
  country: "",
  cityRegion: "",
  ageRange: "26-35",
  householdType: "single",
}

const initialPrefs: CommunityPreferenceFormState = {
  ...emptyCommunityPreferenceForm(),
  climatePreference: "Temperate",
  distanceFromCity: "30-60min",
  investmentCapacity: "€50k-€150k",
  investorType: "Individual/family",
  moveTimeline: "Just exploring",
}

function buildPayload(
  contact: ContactFormState,
  prefs: CommunityPreferenceFormState,
  locale: "en" | "es"
): CommunityInterestInput {
  const requiresLiving = prefs.intent === "live" || prefs.intent === "both"
  const requiresFoodBuyer = prefs.intent === "buy_food" || prefs.intent === "both"
  const showEnergySources = prefs.energyOwnership === "Resident-owned"
  const showFoodMethods = prefs.foodOwnership === "Resident-owned"

  return {
    ...contact,
    locale,
    intent: prefs.intent,
    preferredLocations: prefs.preferredLocations,
    climatePreference: requiresLiving ? prefs.climatePreference : null,
    distanceFromCity: requiresLiving ? prefs.distanceFromCity : null,
    investmentCapacity: requiresLiving ? prefs.investmentCapacity : null,
    investorType: requiresLiving ? prefs.investorType : null,
    moveTimeline: requiresLiving ? prefs.moveTimeline : null,
    livingModel: requiresLiving ? prefs.livingModel : null,
    energyOwnership: requiresLiving ? prefs.energyOwnership : null,
    foodOwnership: requiresLiving ? prefs.foodOwnership : null,
    dietaryPreference: requiresLiving ? prefs.dietaryPreference : null,
    energyPreferences:
      requiresLiving && showEnergySources ? prefs.energyPreferences : null,
    foodPreferences: requiresLiving && showFoodMethods ? prefs.foodPreferences : null,
    foodProducts: requiresFoodBuyer ? prefs.foodProducts : null,
    foodFrequency: requiresFoodBuyer ? prefs.foodFrequency : null,
    notes: prefs.notes.trim(),
  }
}

export function RegisterInterestForm() {
  const { t, locale } = useI18n()
  const searchParams = useSearchParams()
  const [contact, setContact] = useState(initialContact)
  const [prefs, setPrefs] = useState(initialPrefs)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const preset = searchParams.get("intent")
    if (preset !== "live" && preset !== "buy_food" && preset !== "both") return
    setPrefs((prev) => ({
      ...prev,
      intent: preset,
      foodProducts: preset === "live" ? [] : prev.foodProducts,
      foodFrequency: preset === "live" ? null : prev.foodFrequency,
    }))
  }, [searchParams])

  const translateError = (message: string) =>
    message.startsWith("communities.") || message.startsWith("account.")
      ? t(message)
      : message

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    if (prefs.preferredLocations.length === 0) {
      setStatus("error")
      setErrorMessage(t("communities.form.error_add_location"))
      return
    }

    const payload = buildPayload(contact, prefs, locale)

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
      setContact(initialContact)
      setPrefs(initialPrefs)
    } catch (err) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : t("communities.form.error_submit"))
    }
  }

  const fieldsDisabled = status === "loading" || status === "success"

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className={inputClass}
          placeholder={t("communities.form.full_name")}
          required
          value={contact.fullName}
          onChange={(e) => setContact((prev) => ({ ...prev, fullName: e.target.value }))}
        />
        <input
          type="email"
          className={inputClass}
          placeholder={t("communities.form.email")}
          required
          value={contact.email}
          onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          className={inputClass}
          placeholder={t("communities.form.country")}
          required
          value={contact.country}
          onChange={(e) => setContact((prev) => ({ ...prev, country: e.target.value }))}
        />
        <input
          className={inputClass}
          placeholder={t("communities.form.city")}
          required
          value={contact.cityRegion}
          onChange={(e) => setContact((prev) => ({ ...prev, cityRegion: e.target.value }))}
        />
        <select
          className={selectClass}
          required
          value={contact.ageRange}
          onChange={(e) =>
            setContact((prev) => ({
              ...prev,
              ageRange: e.target.value as CommunityInterestInput["ageRange"],
            }))
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
          value={contact.householdType}
          onChange={(e) =>
            setContact((prev) => ({
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

      <CommunityPreferenceFields form={prefs} onChange={setPrefs} disabled={fieldsDisabled} />

      <button
        type="submit"
        disabled={fieldsDisabled}
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
