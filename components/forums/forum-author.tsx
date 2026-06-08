"use client"

import Link from "next/link"
import { UserAvatar } from "@/components/user-avatar"
import { useI18n } from "@/components/i18n-provider"
import { initialsFromDisplayName } from "@/lib/avatar-initials"
import type { ForumAuthorDisplay } from "@/lib/forums-shared"

type ForumAuthorProps = {
  author: ForumAuthorDisplay
  size?: number
  className?: string
  linkClassName?: string
  plainClassName?: string
}

export function ForumAuthor({
  author,
  size = 36,
  className = "",
  linkClassName = "text-xs font-medium text-[#0d1b2a] hover:text-[#009b70]",
  plainClassName = "text-xs font-medium text-[#0d1b2a]",
}: ForumAuthorProps) {
  const { t } = useI18n()
  const displayName =
    author.author_name === "forums.member_fallback"
      ? t("forums.member_fallback")
      : author.author_name
  const initials = initialsFromDisplayName(
    displayName,
    author.author_username ?? undefined
  )

  const nameContent = author.author_username ? (
    <Link href={`/profile/${author.author_username}`} className={linkClassName}>
      {displayName}
    </Link>
  ) : (
    <span className={plainClassName}>{displayName}</span>
  )

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <UserAvatar
        src={author.author_avatar_url}
        fallbackInitials={initials}
        size={size}
      />
      {nameContent}
    </div>
  )
}
