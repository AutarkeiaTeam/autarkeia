"use client"

import { useI18n } from "@/components/i18n-provider"
import { toggleSlugList } from "@/lib/profile-about"

type ChipMultiSelectProps = {
  options: readonly string[]
  selected: string[]
  max: number
  labelKeyPrefix: string
  onChange: (selected: string[]) => void
  disabled?: boolean
}

export function ChipMultiSelect({
  options,
  selected,
  max,
  labelKeyPrefix,
  onChange,
  disabled = false,
}: ChipMultiSelectProps) {
  const { t } = useI18n()
  const atLimit = selected.length >= max

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((slug) => {
        const isSelected = selected.includes(slug)
        const isDisabled = disabled || (!isSelected && atLimit)
        return (
          <button
            key={slug}
            type="button"
            disabled={isDisabled}
            onClick={() =>
              onChange(toggleSlugList(selected, slug, !isSelected, max))
            }
            className={`rounded-full px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isSelected
                ? "bg-[#009b70] text-white"
                : "border border-[#d4dce8] bg-white text-[#0d1b2a] hover:border-[#009b70]"
            }`}
          >
            {t(`${labelKeyPrefix}${slug}`)}
          </button>
        )
      })}
    </div>
  )
}
