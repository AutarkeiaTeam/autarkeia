"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import {
  CommunityPreferenceFields,
  communityDataToFormState,
  type CommunityPreferenceFormState,
} from "@/components/communities/community-preference-fields"
import { useI18n } from "@/components/i18n-provider"
import type { ProfileCommunityData } from "@/lib/profile-community"

type CommunityPreferencesFormProps = {
  initial: ProfileCommunityData
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
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-[#3d5166]">
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

function toApiPayload(
  interested: boolean,
  form: CommunityPreferenceFormState,
  privacy: Pick<
    ProfileCommunityData,
    | "showIntent"
    | "showLocations"
    | "showLivingPref"
    | "showInvestment"
    | "showFoodPref"
    | "showTimeline"
  >
) {
  if (!interested) {
    return {
      interestedInCommunities: false,
      showCommunityIntent: privacy.showIntent,
      showCommunityLocations: privacy.showLocations,
      showCommunityLivingPref: privacy.showLivingPref,
      showCommunityInvestment: privacy.showInvestment,
      showCommunityFoodPref: privacy.showFoodPref,
      showCommunityTimeline: privacy.showTimeline,
    }
  }

  const requiresLiving = form.intent === "live" || form.intent === "both"
  const requiresFoodBuyer = form.intent === "buy_food" || form.intent === "both"

  return {
    interestedInCommunities: true,
    communityIntent: form.intent,
    communityPreferredLocations: form.preferredLocations,
    communityClimatePreference: requiresLiving ? form.climatePreference : null,
    communityDistanceFromCity: requiresLiving ? form.distanceFromCity : null,
    communityInvestmentCapacity: requiresLiving ? form.investmentCapacity : null,
    communityInvestorType: requiresLiving ? form.investorType : null,
    communityMoveTimeline: requiresLiving ? form.moveTimeline : null,
    communityLivingModel: requiresLiving ? form.livingModel : null,
    communityEnergyOwnership: requiresLiving ? form.energyOwnership : null,
    communityEnergyPreferences:
      requiresLiving && form.energyOwnership === "Resident-owned" ? form.energyPreferences : null,
    communityFoodOwnership: requiresLiving ? form.foodOwnership : null,
    communityFoodPreferences:
      requiresLiving && form.foodOwnership === "Resident-owned" ? form.foodPreferences : null,
    communityDietaryPreference: requiresLiving ? form.dietaryPreference : null,
    communityFoodProducts: requiresFoodBuyer ? form.foodProducts : null,
    communityFoodFrequency: requiresFoodBuyer ? form.foodFrequency : null,
    communityNotes: form.notes.trim() || null,
    showCommunityIntent: privacy.showIntent,
    showCommunityLocations: privacy.showLocations,
    showCommunityLivingPref: privacy.showLivingPref,
    showCommunityInvestment: privacy.showInvestment,
    showCommunityFoodPref: privacy.showFoodPref,
    showCommunityTimeline: privacy.showTimeline,
  }
}

export function CommunityPreferencesForm({ initial }: CommunityPreferencesFormProps) {
  const { t } = useI18n()
  const router = useRouter()
  const [interested, setInterested] = useState(initial.interestedInCommunities)
  const [form, setForm] = useState<CommunityPreferenceFormState>(() =>
    communityDataToFormState(initial)
  )
  const [privacy, setPrivacy] = useState({
    showIntent: initial.showIntent,
    showLocations: initial.showLocations,
    showLivingPref: initial.showLivingPref,
    showInvestment: initial.showInvestment,
    showFoodPref: initial.showFoodPref,
    showTimeline: initial.showTimeline,
  })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const showOnProfile = t("account.about.show_on_profile")

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    setError("")

    try {
      setIsSaving(true)
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toApiPayload(interested, form, privacy)),
      })
      const data = (await response.json().catch(() => null)) as { error?: string }
      if (!response.ok) {
        throw new Error(data?.error || "account.community.save_error")
      }
      setMessage(t("account.community.save_success"))
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "account.community.save_error"
      setError(msg.startsWith("account.") || msg.startsWith("communities.") ? t(msg) : msg)
    } finally {
      setIsSaving(false)
    }
  }

  const requiresLiving = form.intent === "live" || form.intent === "both"
  const requiresFoodBuyer = form.intent === "buy_food" || form.intent === "both"

  return (
    <details
      className="group rounded-2xl border border-[#d4dce8] bg-white"
      style={{ borderWidth: "0.5px" }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 [&::-webkit-details-marker]:hidden">
        <div>
          <h2 className="text-lg font-medium text-[#0d1b2a]">{t("account.community.heading")}</h2>
          <p className="mt-1 text-sm text-[#3d5166]">{t("account.community.description")}</p>
        </div>
        <ChevronDown className="h-5 w-5 shrink-0 text-[#8a9bb0] transition-transform group-open:rotate-180" />
      </summary>

      <form onSubmit={(e) => void handleSave(e)} className="border-t border-[#e8edf2] px-6 pb-6 pt-5">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={interested}
            onChange={(e) => setInterested(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[#d4dce8] text-[#009b70] focus:ring-[#009b70]"
          />
          <span>
            <span className="block text-sm font-medium text-[#0d1b2a]">
              {t("account.community.interested_label")}
            </span>
            <span className="mt-1 block text-xs text-[#8a9bb0]">
              {t("account.community.interested_helper")}
            </span>
          </span>
        </label>

        {!interested ? (
          <p className="mt-4 rounded-lg border border-dashed border-[#d4dce8] bg-[#f9fafc] p-4 text-sm text-[#8a9bb0]">
            {t("account.community.enable_hint")}
          </p>
        ) : (
          <div className="mt-6 space-y-6">
            <CommunityPreferenceFields form={form} onChange={setForm} disabled={isSaving} />

            <div className="rounded-xl border border-[#e8edf2] bg-[#fafbfc] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8a9bb0]">
                {t("account.community.privacy_heading")}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <ShowToggle
                  id="show-community-intent"
                  checked={privacy.showIntent}
                  onChange={(checked) => setPrivacy((p) => ({ ...p, showIntent: checked }))}
                  label={`${t("account.community.group.intent")} — ${showOnProfile}`}
                />
                <ShowToggle
                  id="show-community-locations"
                  checked={privacy.showLocations}
                  onChange={(checked) => setPrivacy((p) => ({ ...p, showLocations: checked }))}
                  label={`${t("account.community.group.locations")} — ${showOnProfile}`}
                />
                {requiresLiving ? (
                  <ShowToggle
                    id="show-community-living"
                    checked={privacy.showLivingPref}
                    onChange={(checked) => setPrivacy((p) => ({ ...p, showLivingPref: checked }))}
                    label={`${t("account.community.group.living")} — ${showOnProfile}`}
                  />
                ) : null}
                {requiresLiving ? (
                  <ShowToggle
                    id="show-community-investment"
                    checked={privacy.showInvestment}
                    onChange={(checked) => setPrivacy((p) => ({ ...p, showInvestment: checked }))}
                    label={`${t("account.community.group.investment")} — ${showOnProfile}`}
                  />
                ) : null}
                {requiresFoodBuyer ? (
                  <ShowToggle
                    id="show-community-food"
                    checked={privacy.showFoodPref}
                    onChange={(checked) => setPrivacy((p) => ({ ...p, showFoodPref: checked }))}
                    label={`${t("account.community.group.food")} — ${showOnProfile}`}
                  />
                ) : null}
                {requiresLiving ? (
                  <ShowToggle
                    id="show-community-timeline"
                    checked={privacy.showTimeline}
                    onChange={(checked) => setPrivacy((p) => ({ ...p, showTimeline: checked }))}
                    label={`${t("account.community.group.timeline")} — ${showOnProfile}`}
                  />
                ) : null}
              </div>
              <p className="mt-3 text-xs text-[#8a9bb0]">{t("account.community.investment_privacy_note")}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="mt-6 rounded-lg bg-[#009b70] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
        >
          {isSaving ? t("account.community.saving") : t("account.community.save")}
        </button>
        {message ? <p className="mt-3 text-sm text-[#009b70]">{message}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </form>
    </details>
  )
}
