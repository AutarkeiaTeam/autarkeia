"use client"

import { Lock, Pin } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useI18n } from "@/components/i18n-provider"

type ThreadAdminActionsProps = {
  threadId: string
  pinned: boolean
  locked: boolean
}

export function ThreadAdminActions({ threadId, pinned, locked }: ThreadAdminActionsProps) {
  const { t } = useI18n()
  const router = useRouter()
  const [isPinning, setIsPinning] = useState(false)
  const [isLocking, setIsLocking] = useState(false)

  const togglePin = async () => {
    setIsPinning(true)
    try {
      await fetch(`/api/forums/threads/${threadId}/pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !pinned }),
      })
      router.refresh()
    } finally {
      setIsPinning(false)
    }
  }

  const toggleLock = async () => {
    setIsLocking(true)
    try {
      await fetch(`/api/forums/threads/${threadId}/lock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locked: !locked }),
      })
      router.refresh()
    } finally {
      setIsLocking(false)
    }
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => void togglePin()}
        disabled={isPinning}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#d4dce8] bg-white px-3 py-1.5 text-xs font-medium text-[#3d5166] hover:border-[#009b70] hover:text-[#009b70] disabled:opacity-60"
      >
        <Pin className="h-3.5 w-3.5" aria-hidden />
        {pinned ? t("forums.actions.unpin") : t("forums.actions.pin")}
      </button>
      <button
        type="button"
        onClick={() => void toggleLock()}
        disabled={isLocking}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#d4dce8] bg-white px-3 py-1.5 text-xs font-medium text-[#3d5166] hover:border-[#009b70] hover:text-[#009b70] disabled:opacity-60"
      >
        <Lock className="h-3.5 w-3.5" aria-hidden />
        {locked ? t("forums.actions.unlock") : t("forums.actions.lock")}
      </button>
    </div>
  )
}
