"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { LocationAutocomplete } from "@/components/communities/location-autocomplete"
import { ChipMultiSelect } from "@/components/account/chip-multi-select"
import { useI18n } from "@/components/i18n-provider"
import type { PreferredLocation } from "@/lib/community-interest-location"
import {
  PROFILE_LANGUAGE_SLUGS,
  PROFILE_PREP_GOAL_SLUGS,
  PROFILE_SKILL_SLUGS,
  PROFILE_SPECIAL_NEEDS_SLUGS,
  PROFILE_YEARS_PREPARING_SLUGS,
  type ProfileAboutData,
} from "@/lib/profile-about"

type AboutMeFormProps = {
  initial: ProfileAboutData
}

function fieldClassName() {
  return "w-full rounded-lg border border-[#d4dce8] px-4 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"
}

function labelClassName() {
  return "mb-1.5 block text-xs font-medium text-[#3d5166]"
}

function ShowToggle({
  id,
  checked,
  onChange,
  label,
}: {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <label htmlFor={id} className="flex shrink-0 items-center gap-2 text-xs text-[#3d5166]">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-[#d4dce8] text-[#009b70] focus:ring-[#009b70]"
      />
      <span>{label}</span>
    </label>
  )
}

export function AboutMeForm({ initial }: AboutMeFormProps) {
  const { t } = useI18n()
  const router = useRouter()
  const [about, setAbout] = useState(initial)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const showLabel = t("account.about.show_on_profile")

  const patchAbout = async (body: Record<string, unknown>) => {
    const response = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = (await response.json().catch(() => null)) as { error?: string }
    if (!response.ok) {
      throw new Error(data?.error || "account.about.save_error")
    }
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    setError("")
    try {
      setIsSaving(true)
      await patchAbout({
        hometown: about.hometown,
        languages: about.languages,
        skills: about.skills,
        prepGoal: about.prepGoal,
        yearsPreparing: about.yearsPreparing,
        householdAdults: about.householdAdults,
        householdChildren: about.householdChildren,
        householdPets: about.householdPets,
        householdSpecialNeeds: about.householdSpecialNeeds,
        showHometown: about.showHometown,
        showLanguages: about.showLanguages,
        showSkills: about.showSkills,
        showPrepGoal: about.showPrepGoal,
        showYearsPreparing: about.showYearsPreparing,
        showHousehold: about.showHousehold,
      })
      setMessage(t("account.about.save_success"))
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "account.about.save_error"
      setError(msg.startsWith("account.") ? t(msg) : msg)
    } finally {
      setIsSaving(false)
    }
  }

  const setHometown = (locations: PreferredLocation[]) => {
    setAbout((prev) => ({ ...prev, hometown: locations[0] ?? null }))
  }

  return (
    <section
      className="rounded-2xl border border-[#d4dce8] bg-white p-6"
      style={{ borderWidth: "0.5px" }}
    >
      <h2 className="text-lg font-medium text-[#0d1b2a]">{t("account.about.heading")}</h2>
      <p className="mt-1 text-sm text-[#3d5166]">{t("account.about.description")}</p>

      <form onSubmit={(e) => void handleSave(e)} className="mt-5 space-y-6">
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <p className={labelClassName()}>{t("account.about.hometown_label")}</p>
            <ShowToggle
              id="show-hometown"
              checked={about.showHometown}
              onChange={(checked) => setAbout((prev) => ({ ...prev, showHometown: checked }))}
              label={showLabel}
            />
          </div>
          <LocationAutocomplete
            locations={about.hometown ? [about.hometown] : []}
            maxLocations={1}
            onChange={setHometown}
          />
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <p className={labelClassName()}>{t("account.about.languages_label")}</p>
            <ShowToggle
              id="show-languages"
              checked={about.showLanguages}
              onChange={(checked) => setAbout((prev) => ({ ...prev, showLanguages: checked }))}
              label={showLabel}
            />
          </div>
          <ChipMultiSelect
            options={PROFILE_LANGUAGE_SLUGS}
            selected={about.languages}
            max={10}
            labelKeyPrefix="profile.about.languages."
            onChange={(languages) => setAbout((prev) => ({ ...prev, languages }))}
          />
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <p className={labelClassName()}>{t("account.about.skills_label")}</p>
            <ShowToggle
              id="show-skills"
              checked={about.showSkills}
              onChange={(checked) => setAbout((prev) => ({ ...prev, showSkills: checked }))}
              label={showLabel}
            />
          </div>
          <p className="mb-2 text-xs text-[#8a9bb0]">{t("account.about.skills_helper")}</p>
          <ChipMultiSelect
            options={PROFILE_SKILL_SLUGS}
            selected={about.skills}
            max={15}
            labelKeyPrefix="profile.about.skills."
            onChange={(skills) => setAbout((prev) => ({ ...prev, skills }))}
          />
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <label htmlFor="prep-goal" className={labelClassName()}>
              {t("account.about.prep_goal_label")}
            </label>
            <ShowToggle
              id="show-prep-goal"
              checked={about.showPrepGoal}
              onChange={(checked) => setAbout((prev) => ({ ...prev, showPrepGoal: checked }))}
              label={showLabel}
            />
          </div>
          <select
            id="prep-goal"
            value={about.prepGoal ?? ""}
            onChange={(e) =>
              setAbout((prev) => ({
                ...prev,
                prepGoal: e.target.value || null,
              }))
            }
            className={fieldClassName()}
          >
            <option value="">{t("account.about.select_placeholder")}</option>
            {PROFILE_PREP_GOAL_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {t(`profile.about.prep_goal.${slug}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <label htmlFor="years-preparing" className={labelClassName()}>
              {t("account.about.years_preparing_label")}
            </label>
            <ShowToggle
              id="show-years-preparing"
              checked={about.showYearsPreparing}
              onChange={(checked) =>
                setAbout((prev) => ({ ...prev, showYearsPreparing: checked }))
              }
              label={showLabel}
            />
          </div>
          <select
            id="years-preparing"
            value={about.yearsPreparing ?? ""}
            onChange={(e) =>
              setAbout((prev) => ({
                ...prev,
                yearsPreparing: e.target.value || null,
              }))
            }
            className={fieldClassName()}
          >
            <option value="">{t("account.about.select_placeholder")}</option>
            {PROFILE_YEARS_PREPARING_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {t(`profile.about.years_preparing.${slug}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-[#0d1b2a]">{t("account.about.household_heading")}</p>
            <ShowToggle
              id="show-household"
              checked={about.showHousehold}
              onChange={(checked) => setAbout((prev) => ({ ...prev, showHousehold: checked }))}
              label={t("account.about.show_household")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="household-adults" className={labelClassName()}>
                {t("account.about.household_adults")}
              </label>
              <input
                id="household-adults"
                type="number"
                min={1}
                max={10}
                value={about.householdAdults ?? ""}
                onChange={(e) =>
                  setAbout((prev) => ({
                    ...prev,
                    householdAdults: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                className={fieldClassName()}
              />
            </div>
            <div>
              <label htmlFor="household-children" className={labelClassName()}>
                {t("account.about.household_children")}
              </label>
              <input
                id="household-children"
                type="number"
                min={0}
                max={10}
                value={about.householdChildren ?? ""}
                onChange={(e) =>
                  setAbout((prev) => ({
                    ...prev,
                    householdChildren: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                className={fieldClassName()}
              />
            </div>
          </div>
          <div className="mt-4">
            <p className={labelClassName()}>{t("account.about.household_pets")}</p>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-sm text-[#3d5166]">
                <input
                  type="radio"
                  name="household-pets"
                  checked={about.householdPets === true}
                  onChange={() => setAbout((prev) => ({ ...prev, householdPets: true }))}
                />
                {t("account.about.household_pets_yes")}
              </label>
              <label className="flex items-center gap-2 text-sm text-[#3d5166]">
                <input
                  type="radio"
                  name="household-pets"
                  checked={about.householdPets === false}
                  onChange={() => setAbout((prev) => ({ ...prev, householdPets: false }))}
                />
                {t("account.about.household_pets_no")}
              </label>
              <button
                type="button"
                onClick={() => setAbout((prev) => ({ ...prev, householdPets: null }))}
                className="text-xs text-[#8a9bb0] hover:text-[#3d5166]"
              >
                {t("account.about.clear")}
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className={labelClassName()}>{t("account.about.household_special_needs")}</p>
            <ChipMultiSelect
              options={PROFILE_SPECIAL_NEEDS_SLUGS}
              selected={about.householdSpecialNeeds}
              max={5}
              labelKeyPrefix="profile.about.special_needs."
              onChange={(householdSpecialNeeds) =>
                setAbout((prev) => ({ ...prev, householdSpecialNeeds }))
              }
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-[#009b70] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
        >
          {isSaving ? t("account.about.saving") : t("account.about.save")}
        </button>
        {message ? <p className="text-sm text-[#009b70]">{message}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>
    </section>
  )
}
