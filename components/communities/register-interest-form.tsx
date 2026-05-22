"use client"

import { FormEvent, useState } from "react"
import {
  AGE_RANGES,
  CLIMATE_PREFERENCES,
  COMMUNITY_TYPES,
  DISTANCE_FROM_CITY,
  ENERGY_PREFERENCES,
  FOOD_INTERESTS,
  HOME_TYPES,
  HOUSEHOLD_TYPES,
  INVESTMENT_CAPACITY,
  INVESTOR_TYPES,
  MOVE_TIMELINES,
  type CommunityInterestInput,
} from "@/lib/community-interest"

const selectClass =
  "w-full rounded-lg border border-[#d4dce8] bg-white p-3 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"
const inputClass =
  "w-full rounded-lg border border-[#d4dce8] bg-white p-3 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"

function toggleValue(list: string[], value: string, checked: boolean): string[] {
  if (checked) return list.includes(value) ? list : [...list, value]
  return list.filter((item) => item !== value)
}

const initialForm: CommunityInterestInput = {
  fullName: "",
  email: "",
  country: "",
  cityRegion: "",
  ageRange: "26-35",
  householdType: "single",
  preferredLocations: [],
  climatePreference: "Temperate",
  distanceFromCity: "30-60min",
  communityTypes: [],
  homeTypes: [],
  investmentCapacity: "€50k-€150k",
  investorType: "Individual/family",
  energyPreferences: [],
  foodInterests: [],
  moveTimeline: "Just exploring",
  notes: "",
}

export function RegisterInterestForm() {
  const [form, setForm] = useState(initialForm)
  const [draftLocation, setDraftLocation] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const addLocation = () => {
    const trimmed = draftLocation.trim()
    if (!trimmed || form.preferredLocations.length >= 10) return
    if (form.preferredLocations.includes(trimmed)) return
    setForm((prev) => ({
      ...prev,
      preferredLocations: [...prev.preferredLocations, trimmed],
    }))
    setDraftLocation("")
  }

  const removeLocation = (index: number) => {
    setForm((prev) => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter((_, idx) => idx !== index),
    }))
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    if (form.preferredLocations.length === 0) {
      setStatus("error")
      setErrorMessage("Add at least one preferred location.")
      return
    }

    try {
      const response = await fetch("/api/community-interest/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = (await response.json().catch(() => null)) as { error?: string; ok?: boolean }

      if (!response.ok) {
        throw new Error(data?.error || "Could not submit your interest.")
      }

      setStatus("success")
      setForm(initialForm)
      setDraftLocation("")
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
        <div className="flex gap-2">
          <input
            value={draftLocation}
            onChange={(e) => setDraftLocation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addLocation()
              }
            }}
            className={inputClass}
            placeholder="Add location"
          />
          <button
            type="button"
            onClick={addLocation}
            disabled={form.preferredLocations.length >= 10}
            className="rounded-lg bg-[#009b70] px-4 text-sm font-medium text-white hover:bg-[#008060] disabled:opacity-60"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.preferredLocations.map((item, idx) => (
            <button
              type="button"
              key={`${item}-${idx}`}
              onClick={() => removeLocation(idx)}
              className="rounded-full bg-[#e8f8f3] px-3 py-1 text-sm text-[#0d1b2a]"
            >
              {item} ×
            </button>
          ))}
        </div>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset className="space-y-2 rounded-xl border border-[#d4dce8] bg-white p-5">
          <p className="font-medium text-[#0d1b2a]">What type of community?</p>
          {COMMUNITY_TYPES.map((option) => (
            <label key={option} className="flex gap-2 text-sm text-[#3d5166]">
              <input
                type="checkbox"
                checked={form.communityTypes.includes(option)}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    communityTypes: toggleValue(prev.communityTypes, option, e.target.checked),
                  }))
                }
              />
              {option}
            </label>
          ))}
        </fieldset>
        <fieldset className="space-y-2 rounded-xl border border-[#d4dce8] bg-white p-5">
          <p className="font-medium text-[#0d1b2a]">Type of home</p>
          {HOME_TYPES.map((option) => (
            <label key={option} className="flex gap-2 text-sm text-[#3d5166]">
              <input
                type="checkbox"
                checked={form.homeTypes.includes(option)}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    homeTypes: toggleValue(prev.homeTypes, option, e.target.checked),
                  }))
                }
              />
              {option}
            </label>
          ))}
        </fieldset>
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
        <fieldset className="space-y-2 rounded-xl border border-[#d4dce8] bg-white p-5">
          <p className="font-medium text-[#0d1b2a]">Energy preference</p>
          {ENERGY_PREFERENCES.map((option) => (
            <label key={option} className="flex gap-2 text-sm text-[#3d5166]">
              <input
                type="checkbox"
                checked={form.energyPreferences.includes(option)}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    energyPreferences: toggleValue(prev.energyPreferences, option, e.target.checked),
                  }))
                }
              />
              {option}
            </label>
          ))}
        </fieldset>
        <fieldset className="space-y-2 rounded-xl border border-[#d4dce8] bg-white p-5">
          <p className="font-medium text-[#0d1b2a]">Food production interest</p>
          {FOOD_INTERESTS.map((option) => (
            <label key={option} className="flex gap-2 text-sm text-[#3d5166]">
              <input
                type="checkbox"
                checked={form.foodInterests.includes(option)}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    foodInterests: toggleValue(prev.foodInterests, option, e.target.checked),
                  }))
                }
              />
              {option}
            </label>
          ))}
        </fieldset>
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
