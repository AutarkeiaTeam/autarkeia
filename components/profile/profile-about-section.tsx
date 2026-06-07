"use client"

import { useState } from "react"
import { useI18n } from "@/components/i18n-provider"
import { preferredLocationDisplayLabel } from "@/lib/community-interest-location"
import {
  hasVisibleAboutSection,
  householdIsFilled,
  shouldShowAboutField,
  type ProfileAboutData,
} from "@/lib/profile-about"

const SKILLS_PREVIEW_COUNT = 5

type ProfileAboutSectionProps = {
  about: ProfileAboutData
  isOwner: boolean
  profilePublic: boolean
}

function PrivateBadge({ show }: { show: boolean }) {
  const { t } = useI18n()
  if (show) return null
  return (
    <span className="ml-2 rounded-full bg-[#f5f7fa] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#8a9bb0]">
      {t("profile.about.private_badge")}
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
      {isPrivate ? <PrivateBadge show={false} /> : null}
    </div>
  )
}

export function ProfileAboutSection({ about, isOwner, profilePublic }: ProfileAboutSectionProps) {
  const { t } = useI18n()
  const [skillsExpanded, setSkillsExpanded] = useState(false)

  if (!hasVisibleAboutSection(about, isOwner, profilePublic)) {
    return null
  }

  const showHometown = shouldShowAboutField(
    about,
    "showHometown",
    "hometown",
    isOwner,
    profilePublic
  )
  const showLanguages = shouldShowAboutField(
    about,
    "showLanguages",
    "languages",
    isOwner,
    profilePublic
  )
  const showSkills = shouldShowAboutField(about, "showSkills", "skills", isOwner, profilePublic)
  const showPrepGoal = shouldShowAboutField(
    about,
    "showPrepGoal",
    "prepGoal",
    isOwner,
    profilePublic
  )
  const showYears = shouldShowAboutField(
    about,
    "showYearsPreparing",
    "yearsPreparing",
    isOwner,
    profilePublic
  )
  const showHousehold = shouldShowAboutField(
    about,
    "showHousehold",
    "householdAdults",
    isOwner,
    profilePublic
  )

  const skillsToShow = skillsExpanded
    ? about.skills
    : about.skills.slice(0, SKILLS_PREVIEW_COUNT)
  const hiddenSkillCount = Math.max(0, about.skills.length - SKILLS_PREVIEW_COUNT)

  const householdParts: string[] = []
  if (about.householdAdults != null) {
    householdParts.push(
      t("profile.about.household_adults")
        .replace("{count}", String(about.householdAdults))
        .replace(
          "{label}",
          about.householdAdults === 1
            ? t("profile.about.household_adult_one")
            : t("profile.about.household_adult_many")
        )
    )
  }
  if (about.householdChildren != null && about.householdChildren > 0) {
    householdParts.push(
      t("profile.about.household_children")
        .replace("{count}", String(about.householdChildren))
        .replace(
          "{label}",
          about.householdChildren === 1
            ? t("profile.about.household_child_one")
            : t("profile.about.household_child_many")
        )
    )
  }
  if (about.householdPets === true) {
    householdParts.push(t("profile.about.household_with_pets"))
  }
  if (about.householdSpecialNeeds.length > 0) {
    const needs = about.householdSpecialNeeds
      .map((slug) => t(`profile.about.special_needs.${slug}`))
      .join(", ")
    householdParts.push(t("profile.about.household_including").replace("{needs}", needs))
  }

  return (
    <div className="mt-8 border-t border-[#e8edf2] pt-8" style={{ borderTopWidth: "0.5px" }}>
      <h2 className="text-lg font-medium text-[#0d1b2a]">{t("profile.about.heading")}</h2>
      <div className="mt-4 space-y-3">
        {showHometown && about.hometown ? (
          <AboutRow
            label={t("profile.about.field_labels.hometown")}
            value={preferredLocationDisplayLabel(about.hometown)}
            isPrivate={isOwner && !about.showHometown}
          />
        ) : null}

        {showLanguages && about.languages.length > 0 ? (
          <AboutRow
            label={t("profile.about.field_labels.languages")}
            value={about.languages.map((slug) => t(`profile.about.languages.${slug}`)).join(", ")}
            isPrivate={isOwner && !about.showLanguages}
          />
        ) : null}

        {showPrepGoal && about.prepGoal ? (
          <AboutRow
            label={t("profile.about.field_labels.goal")}
            value={t(`profile.about.prep_goal.${about.prepGoal}`)}
            isPrivate={isOwner && !about.showPrepGoal}
          />
        ) : null}

        {showYears && about.yearsPreparing ? (
          <AboutRow
            label={t("profile.about.field_labels.years_preparing")}
            value={t(`profile.about.years_preparing.${about.yearsPreparing}`)}
            isPrivate={isOwner && !about.showYearsPreparing}
          />
        ) : null}

        {showHousehold && householdIsFilled(about) ? (
          <AboutRow
            label={t("profile.about.field_labels.household")}
            value={householdParts.join(", ")}
            isPrivate={isOwner && !about.showHousehold}
          />
        ) : null}

        {showSkills && about.skills.length > 0 ? (
          <div className="text-sm text-[#3d5166]">
            <span className="font-medium text-[#0d1b2a]">
              {t("profile.about.field_labels.skills")}:{" "}
            </span>
            <span>
              {skillsToShow.map((slug) => t(`profile.about.skills.${slug}`)).join(", ")}
              {!skillsExpanded && hiddenSkillCount > 0 ? (
                <>
                  {", "}
                  <button
                    type="button"
                    onClick={() => setSkillsExpanded(true)}
                    className="font-medium text-[#009b70] hover:underline"
                  >
                    {t("profile.about.skills_more").replace("{count}", String(hiddenSkillCount))}
                  </button>
                </>
              ) : null}
            </span>
            {isOwner && !about.showSkills ? <PrivateBadge show={false} /> : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
