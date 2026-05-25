"use client"

import { FormEvent, useState } from "react"
import { LocationAutocomplete } from "@/components/communities/location-autocomplete"
import {
  AGE_RANGES,
  CLIMATE_PREFERENCES,
  DIETARY_PREFERENCES,
  DISTANCE_FROM_CITY,
  ENERGY_SOURCE_OPTIONS,
  FOOD_PRODUCTION_OPTIONS,
  HOUSEHOLD_TYPES,
  INVESTMENT_CAPACITY,
  INVESTOR_TYPES,
  LIVING_MODEL_OPTIONS,
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
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const showEnergySources = form.energyOwnership === "Resident-owned"
  const showFoodMethods = form.foodOwnership === "Resident-owned"

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    if (form.preferredLocations.length === 0) {
      setStatus("error")
      setErrorMessage("Add at least one location from the suggestions.")
      return
    }

    const payload: CommunityInterestInput = {
      ...form,
      livingModel: form.livingModel as CommunityInterestInput["livingModel"],
      energyOwnership: form.energyOwnership as CommunityInterestInput["energyOwnership"],
      foodOwnership: form.foodOwnership as CommunityInterestInput["foodOwnership"],
      dietaryPreference: form.dietaryPreference as CommunityInterestInput["dietaryPreference"],
      energyPreferences: showEnergySources ? (form.energyPreferences ?? []) : null,
      foodPreferences: showFoodMethods ? (form.foodPreferences ?? []) : null,
    }

    try {
      const response = await fetch("/api/community-interest/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = (await response.json().catch(() => null)) as { error?: string; ok?: boolean }

      if (!response.ok) {
        throw new Error(data?.error || "Could not submit your interest.")
      }

      setStatus("success")
      setForm(initialForm)
    } catch (err) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "Could not submit your interest.")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className={inputClass}
          placeholder="Full name"
          required
          value={form.fullName}
          onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
        />
        <input
          type="email"
          className={inputClass}
          placeholder="Email address"
          required
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          className={inputClass}
          placeholder="Country of residence"
          required
          value={form.country}
          onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
        />
        <input
          className={inputClass}
          placeholder="City/region of residence"
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
            Age range
          </option>
          {AGE_RANGES.map((option) => (
            <option key={option} value={option}>
              {option}
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
            Household type
          </option>
          {HOUSEHOLD_TYPES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4 rounded-xl border border-[#d4dce8] bg-white p-5">
        <p className="font-medium text-[#0d1b2a]">Where would you like to live? (up to 10 locations)</p>
        <LocationAutocomplete
          locations={form.preferredLocations}
          maxLocations={10}
          disabled={status === "loading" || status === "success"}
          onChange={(preferredLocations) =>
            setForm((prev) => ({ ...prev, preferredLocations }))
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <select
            className={selectClass}
            required
            value={form.climatePreference}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                climatePreference: e.target.value as CommunityInterestInput["climatePreference"],
              }))
            }
          >
            <option value="" disabled>
              Climate preference
            </option>
            {CLIMATE_PREFERENCES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            required
            value={form.distanceFromCity}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                distanceFromCity: e.target.value as CommunityInterestInput["distanceFromCity"],
              }))
            }
          >
            <option value="" disabled>
              How far from a city?
            </option>
            {DISTANCE_FROM_CITY.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        <fieldset className={sectionClass}>
          <legend className="font-medium text-[#0d1b2a]">Preferred living model</legend>
          {LIVING_MODEL_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer gap-3 rounded-lg border border-transparent p-2 hover:border-[#d4dce8]"
            >
              <input
                type="radio"
                name="livingModel"
                className="mt-1 shrink-0"
                required
                value={option.value}
                checked={form.livingModel === option.value}
                onChange={() => setForm((prev) => ({ ...prev, livingModel: option.value }))}
              />
              <span className="text-sm text-[#3d5166]">
                <span className="font-medium text-[#0d1b2a]">{option.value}</span>
                <span className="mt-0.5 block">{option.description}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <fieldset className={sectionClass}>
          <legend className="font-medium text-[#0d1b2a]">Energy ownership</legend>
          {OWNERSHIP_OPTIONS.map((option) => (
            <label
              key={`energy-${option.value}`}
              className="flex cursor-pointer gap-3 rounded-lg border border-transparent p-2 hover:border-[#d4dce8]"
            >
              <input
                type="radio"
                name="energyOwnership"
                className="mt-1 shrink-0"
                required
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
                <span className="font-medium text-[#0d1b2a]">{option.value}</span>
                <span className="mt-0.5 block">{option.energyDescription}</span>
              </span>
            </label>
          ))}
        </fieldset>

        {showEnergySources && (
          <fieldset className={sectionClass}>
            <legend className="font-medium text-[#0d1b2a]">Preferred energy sources</legend>
            <p className="text-xs text-[#8a9bb0]">Select all that apply.</p>
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
                {option}
              </label>
            ))}
          </fieldset>
        )}

        <fieldset className={sectionClass}>
          <legend className="font-medium text-[#0d1b2a]">Food ownership</legend>
          {OWNERSHIP_OPTIONS.map((option) => (
            <label
              key={`food-${option.value}`}
              className="flex cursor-pointer gap-3 rounded-lg border border-transparent p-2 hover:border-[#d4dce8]"
            >
              <input
                type="radio"
                name="foodOwnership"
                className="mt-1 shrink-0"
                required
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
                <span className="font-medium text-[#0d1b2a]">{option.value}</span>
                <span className="mt-0.5 block">{option.foodDescription}</span>
              </span>
            </label>
          ))}
        </fieldset>

        {showFoodMethods && (
          <fieldset className={sectionClass}>
            <legend className="font-medium text-[#0d1b2a]">Preferred food production methods</legend>
            <p className="text-xs text-[#8a9bb0]">Select all that apply.</p>
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
                {option}
              </label>
            ))}
          </fieldset>
        )}

        <fieldset className={sectionClass}>
          <legend className="font-medium text-[#0d1b2a]">Dietary community preference</legend>
          {DIETARY_PREFERENCES.map((option) => (
            <label key={option} className="flex cursor-pointer gap-3 p-2 text-sm text-[#3d5166]">
              <input
                type="radio"
                name="dietaryPreference"
                className="mt-0.5 shrink-0"
                required
                value={option}
                checked={form.dietaryPreference === option}
                onChange={() => setForm((prev) => ({ ...prev, dietaryPreference: option }))}
              />
              {option}
            </label>
          ))}
        </fieldset>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <select
          className={selectClass}
          required
          value={form.investmentCapacity}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              investmentCapacity: e.target.value as CommunityInterestInput["investmentCapacity"],
            }))
          }
        >
          <option value="" disabled>
            Investment capacity
          </option>
          {INVESTMENT_CAPACITY.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          required
          value={form.investorType}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              investorType: e.target.value as CommunityInterestInput["investorType"],
            }))
          }
        >
          <option value="" disabled>
            Investor type
          </option>
          {INVESTOR_TYPES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          className={`${selectClass} sm:col-span-2`}
          required
          value={form.moveTimeline}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              moveTimeline: e.target.value as CommunityInterestInput["moveTimeline"],
            }))
          }
        >
          <option value="" disabled>
            When are you thinking of making this move?
          </option>
          {MOVE_TIMELINES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <textarea
          className={`${inputClass} sm:col-span-2`}
          rows={4}
          placeholder="Additional notes"
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="rounded-lg bg-[#009b70] px-6 py-3 font-medium text-white hover:bg-[#008060] disabled:opacity-60"
      >
        {status === "loading" ? "Submitting…" : "Register my interest →"}
      </button>

      {status === "error" && errorMessage && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>
      )}

      {status === "success" && (
        <p className="rounded-lg border border-[#009b70]/40 bg-[#e8f8f3] p-4 text-sm text-[#0d1b2a]">
          Thank you. We have received your interest and sent a confirmation to your email. We will be in
          touch as we develop communities in your preferred locations. This data helps us demonstrate demand
          to investors and partners.
        </p>
      )}
    </form>
  )
}
