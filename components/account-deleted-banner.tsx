"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useI18n } from "@/components/i18n-provider"

export function AccountDeletedBanner() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (searchParams.get("account_deleted") === "1") {
      setVisible(true)
      const url = new URL(window.location.href)
      url.searchParams.delete("account_deleted")
      window.history.replaceState({}, "", url.pathname + url.search)
    }
  }, [searchParams])

  if (!visible) return null

  return (
    <div className="border-b border-[#b8e6d4] bg-[#e8f8f3] px-4 py-3 text-center text-sm text-[#0d1b2a]">
      {t("account.delete.success")}
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="ml-3 text-xs font-medium text-[#009b70] hover:underline"
      >
        {t("account.delete.dismiss")}
      </button>
    </div>
  )
}
