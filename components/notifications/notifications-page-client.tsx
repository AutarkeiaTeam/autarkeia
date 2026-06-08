"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useI18n } from "@/components/i18n-provider"
import { NotificationItem } from "@/components/notifications/notification-item"
import type { EnrichedNotification } from "@/lib/notification-enrich"
import type { NotificationFilter } from "@/lib/notifications"

const PAGE_SIZE = 20

const FILTERS: { value: NotificationFilter; labelKey: string }[] = [
  { value: "all", labelKey: "notifications.page.filter_all" },
  { value: "unread", labelKey: "notifications.page.filter_unread" },
  { value: "forum_reply", labelKey: "notifications.page.filter_replies" },
  { value: "forum_reaction", labelKey: "notifications.page.filter_reactions" },
]

function parseFilterParam(value: string | null): NotificationFilter {
  if (value === "unread" || value === "forum_reply" || value === "forum_reaction") {
    return value
  }
  return "all"
}

export function NotificationsPageClient() {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const filter = parseFilterParam(searchParams.get("filter"))
  const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10) || 1, 1)

  const [notifications, setNotifications] = useState<EnrichedNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [markingAll, setMarkingAll] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const offset = (page - 1) * PAGE_SIZE
      const res = await fetch(
        `/api/notifications?limit=${PAGE_SIZE}&offset=${offset}&filter=${filter}`
      )
      if (!res.ok) return
      const data = (await res.json()) as { notifications?: EnrichedNotification[] }
      const rows = data.notifications ?? []
      setNotifications(rows)
      setHasMore(rows.length === PAGE_SIZE)
    } finally {
      setLoading(false)
    }
  }, [filter, page])

  useEffect(() => {
    void load()
  }, [load])

  const setFilter = (next: NotificationFilter) => {
    const params = new URLSearchParams(searchParams.toString())
    if (next === "all") params.delete("filter")
    else params.set("filter", next)
    params.delete("page")
    const qs = params.toString()
    router.push(qs ? `/notifications?${qs}` : "/notifications")
  }

  const handleMarkAllRead = async () => {
    setMarkingAll(true)
    try {
      await fetch("/api/notifications/mark-all-read", { method: "POST" })
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() }))
      )
    } finally {
      setMarkingAll(false)
    }
  }

  const handleItemNavigate = async (notification: EnrichedNotification) => {
    if (!notification.read_at) {
      try {
        await fetch("/api/notifications/mark-read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [notification.id] }),
        })
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id
              ? { ...n, read_at: new Date().toISOString() }
              : n
          )
        )
      } catch {
        /* ignore */
      }
    }
    router.push(notification.href)
  }

  const pillClass = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
      active
        ? "bg-[#009b70] text-white"
        : "border border-[#d4dce8] bg-white text-[#3d5166] hover:border-[#009b70] hover:text-[#009b70]"
    }`

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-medium text-[#0d1b2a]">
          {t("notifications.page.title")}
        </h1>
        <button
          type="button"
          onClick={() => void handleMarkAllRead()}
          disabled={markingAll}
          className="text-sm font-medium text-[#009b70] hover:underline disabled:opacity-60"
        >
          {t("notifications.mark_all_read")}
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={pillClass(filter === f.value)}
          >
            {t(f.labelKey)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-sm text-[#8a9bb0] py-12">…</p>
      ) : notifications.length === 0 ? (
        <p className="rounded-xl border border-[#d4dce8] bg-white py-16 text-center text-sm text-[#8a9bb0]">
          {t("notifications.empty")}
        </p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onNavigate={handleItemNavigate}
            />
          ))}
        </div>
      )}

      {(page > 1 || hasMore) && (
        <div className="mt-8 flex items-center justify-between text-sm">
          {page > 1 ? (
            <Link
              href={`/notifications?${new URLSearchParams({
                ...(filter !== "all" ? { filter } : {}),
                page: String(page - 1),
              }).toString()}`}
              className="font-medium text-[#009b70] hover:underline"
            >
              ←
            </Link>
          ) : (
            <span />
          )}
          {hasMore && (
            <Link
              href={`/notifications?${new URLSearchParams({
                ...(filter !== "all" ? { filter } : {}),
                page: String(page + 1),
              }).toString()}`}
              className="font-medium text-[#009b70] hover:underline"
            >
              →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
