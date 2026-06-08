"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { NotificationItem } from "@/components/notifications/notification-item"
import type { EnrichedNotification } from "@/lib/notification-enrich"

const POLL_MS = 60_000

function formatBadge(count: number, overflowLabel: string): string {
  if (count > 9) return overflowLabel
  return String(count)
}

export function NotificationBell() {
  const { t } = useI18n()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<EnrichedNotification[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/unread-count")
      if (!res.ok) return
      const data = (await res.json()) as { count?: number }
      setUnreadCount(typeof data.count === "number" ? data.count : 0)
    } catch {
      /* ignore polling errors */
    }
  }, [])

  const fetchRecent = useCallback(async () => {
    setLoadingList(true)
    try {
      const res = await fetch("/api/notifications?limit=10")
      if (!res.ok) return
      const data = (await res.json()) as { notifications?: EnrichedNotification[] }
      setNotifications(data.notifications ?? [])
    } catch {
      /* ignore */
    } finally {
      setLoadingList(false)
    }
  }, [])

  useEffect(() => {
    void fetchUnreadCount()
    const id = window.setInterval(() => void fetchUnreadCount(), POLL_MS)
    return () => window.clearInterval(id)
  }, [fetchUnreadCount])

  useEffect(() => {
    if (open) void fetchRecent()
  }, [open, fetchRecent])

  useEffect(() => {
    if (!open) return
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        panelRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [open])

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", { method: "POST" })
      setUnreadCount(0)
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() }))
      )
    } catch {
      /* ignore */
    }
  }

  const handleItemNavigate = async (notification: EnrichedNotification) => {
    setOpen(false)
    if (!notification.read_at) {
      try {
        await fetch("/api/notifications/mark-read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [notification.id] }),
        })
        setUnreadCount((c) => Math.max(0, c - 1))
      } catch {
        /* ignore */
      }
    }
    router.push(notification.href)
  }

  const badgeLabel = formatBadge(unreadCount, t("notifications.unread_badge_overflow"))

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg p-2 text-[#3d5166] transition-colors hover:bg-[#f5f7fa] hover:text-[#009b70]"
        aria-label={t("notifications.bell.label")}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className="h-5 w-5" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white"
            aria-label={t("notifications.bell.unread_aria").replace("{count}", String(unreadCount))}
          >
            {badgeLabel}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-[#d4dce8] bg-white shadow-lg"
          style={{ borderWidth: "0.5px" }}
        >
          <div className="max-h-[min(24rem,70vh)] overflow-y-auto">
            {loadingList && notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-[#8a9bb0]">…</p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-[#8a9bb0]">
                {t("notifications.empty")}
              </p>
            ) : (
              <div className="divide-y divide-[#eef2f6]">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    compact
                    onNavigate={handleItemNavigate}
                  />
                ))}
              </div>
            )}
          </div>
          <div
            className="flex items-center justify-between border-t border-[#eef2f6] px-3 py-2 text-xs"
            style={{ borderTopWidth: "0.5px" }}
          >
            <button
              type="button"
              onClick={() => void handleMarkAllRead()}
              className="font-medium text-[#009b70] hover:underline"
            >
              {t("notifications.mark_all_read")}
            </button>
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="font-medium text-[#3d5166] hover:text-[#009b70]"
            >
              {t("notifications.see_all")}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
