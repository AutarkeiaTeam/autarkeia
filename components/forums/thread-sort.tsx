"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useI18n } from "@/components/i18n-provider"
import { parseForumSortMode, type ForumSortMode } from "@/lib/forums-shared"

const SORT_OPTIONS: { id: ForumSortMode; labelKey: string }[] = [
  { id: "recent", labelKey: "forums.sort.recent" },
  { id: "newest", labelKey: "forums.sort.newest" },
  { id: "popular", labelKey: "forums.sort.popular" },
]

export function ThreadSort() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const active = parseForumSortMode(searchParams.get("sort"))

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-[#8a9bb0]">{t("forums.sort.label")}</span>
      {SORT_OPTIONS.map((option) => {
        const params = new URLSearchParams(searchParams.toString())
        if (option.id === "recent") params.delete("sort")
        else params.set("sort", option.id)
        const query = params.toString()
        const href = query ? `/forums?${query}` : "/forums"
        const isActive = active === option.id

        return (
          <Link
            key={option.id}
            href={href}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? "bg-[#009b70] text-white"
                : "border border-[#d4dce8] bg-white text-[#3d5166] hover:border-[#009b70]"
            }`}
          >
            {t(option.labelKey)}
          </Link>
        )
      })}
    </div>
  )
}
