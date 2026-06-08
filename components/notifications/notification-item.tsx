"use client"

import Link from "next/link"
import { UserAvatar } from "@/components/user-avatar"
import { useI18n } from "@/components/i18n-provider"
import { formatRelativeTime } from "@/lib/format-relative-time"
import { initialsFromDisplayName } from "@/lib/avatar-initials"
import type { EnrichedNotification } from "@/lib/notification-enrich"

type NotificationItemProps = {
  notification: EnrichedNotification
  onNavigate?: (notification: EnrichedNotification) => void
  compact?: boolean
}

export function NotificationItem({
  notification,
  onNavigate,
  compact = false,
}: NotificationItemProps) {
  const { t, locale } = useI18n()

  const actorName =
    notification.actor?.name?.trim() || t("notifications.actor_fallback")
  const emoji =
    notification.type === "forum_reaction" &&
    typeof notification.metadata.emoji === "string"
      ? notification.metadata.emoji
      : ""

  const actionKey =
    notification.type === "forum_reply"
      ? "notifications.types.forum_reply"
      : "notifications.types.forum_reaction"

  const actionSuffix = t(actionKey)
    .replace("{actor}", "")
    .replace("{emoji}", emoji)
    .trim()

  const snippet =
    typeof notification.metadata.snippet === "string"
      ? notification.metadata.snippet
      : null

  const isUnread = !notification.read_at
  const timeLabel = formatRelativeTime(notification.created_at, locale)

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onNavigate) return
    event.preventDefault()
    onNavigate(notification)
  }

  return (
    <Link
      href={notification.href}
      onClick={handleClick}
      className={`block transition-colors hover:bg-[#f5f7fa] ${
        compact ? "px-3 py-2.5" : "rounded-xl border border-[#d4dce8] p-4"
      } ${isUnread ? (compact ? "bg-[#f0faf6]" : "bg-[#f0faf6]") : "bg-white"}`}
      style={compact ? undefined : { borderWidth: "0.5px" }}
    >
      <div className="flex gap-3">
        {isUnread && compact && (
          <span
            className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#009b70]"
            aria-hidden
          />
        )}
        <UserAvatar
          src={notification.actor?.avatar_url}
          fallbackInitials={initialsFromDisplayName(
            actorName,
            notification.actor?.username ?? undefined
          )}
          size={compact ? 32 : 40}
        />
        <div className="min-w-0 flex-1">
          <p className={`text-[#3d5166] ${compact ? "text-xs leading-snug" : "text-sm"}`}>
            <span className="font-medium text-[#0d1b2a]">{actorName}</span> {actionSuffix}
          </p>
          {snippet && (
            <p
              className={`mt-1 truncate text-[#8a9bb0] ${
                compact ? "text-[11px]" : "text-xs"
              }`}
            >
              {snippet}
            </p>
          )}
          <p className={`mt-1 text-[#8a9bb0] ${compact ? "text-[10px]" : "text-xs"}`}>
            {timeLabel}
          </p>
        </div>
        {isUnread && !compact && (
          <span
            className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#009b70]"
            aria-hidden
          />
        )}
      </div>
    </Link>
  )
}
