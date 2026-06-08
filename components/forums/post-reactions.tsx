"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useI18n } from "@/components/i18n-provider"
import {
  FORUM_REACTION_EMOJIS,
  emptyPostReactions,
  type ForumReactionEmoji,
  type PostReactionsData,
} from "@/lib/forums-shared"

type PostReactionsProps = {
  postId: string
  initialReactions: PostReactionsData
  viewerId: string | null
}

export function PostReactions({ postId, initialReactions, viewerId }: PostReactionsProps) {
  const { t } = useI18n()
  const pathname = usePathname()
  const [reactions, setReactions] = useState(initialReactions)
  const [pending, setPending] = useState<ForumReactionEmoji | null>(null)

  useEffect(() => {
    setReactions(initialReactions)
  }, [initialReactions])

  const loginHref = `/login?next=${encodeURIComponent(pathname)}`

  const toggle = async (emoji: ForumReactionEmoji) => {
    if (!viewerId) return
    const previous = reactions
    const optimistic = applyOptimisticToggle(reactions, emoji)
    setReactions(optimistic)
    setPending(emoji)
    try {
      const res = await fetch(`/api/forums/posts/${postId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "forums.error.unknown")
      if (data.reactions) setReactions(data.reactions as PostReactionsData)
    } catch {
      setReactions(previous)
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {FORUM_REACTION_EMOJIS.map((emoji) => {
        const count = reactions.counts[emoji] ?? 0
        const active = reactions.userEmojis.includes(emoji)
        const label = count > 0 ? `${emoji} ${count}` : emoji

        if (!viewerId) {
          return (
            <Link
              key={emoji}
              href={loginHref}
              className="inline-flex min-h-7 items-center rounded-full border border-[#d4dce8] bg-white px-2.5 py-0.5 text-xs text-[#3d5166] hover:border-[#009b70]"
              aria-label={emoji}
            >
              {label}
            </Link>
          )
        }

        return (
          <button
            key={emoji}
            type="button"
            disabled={pending === emoji}
            onClick={() => toggle(emoji)}
            className={`inline-flex min-h-7 items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors disabled:opacity-60 ${
              active
                ? "border-[#009b70] bg-[#009b70] text-white"
                : "border-[#d4dce8] bg-white text-[#3d5166] hover:border-[#009b70]"
            }`}
            aria-pressed={active}
            aria-label={emoji}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

function applyOptimisticToggle(
  current: PostReactionsData,
  emoji: ForumReactionEmoji
): PostReactionsData {
  const active = current.userEmojis.includes(emoji)
  const nextCounts = { ...current.counts }
  const currentCount = nextCounts[emoji] ?? 0

  if (active) {
    const nextCount = Math.max(0, currentCount - 1)
    if (nextCount === 0) delete nextCounts[emoji]
    else nextCounts[emoji] = nextCount
    return {
      counts: nextCounts,
      userEmojis: current.userEmojis.filter((e) => e !== emoji),
    }
  }

  nextCounts[emoji] = currentCount + 1
  return {
    counts: nextCounts,
    userEmojis: [...current.userEmojis, emoji],
  }
}

export function reactionsFromMap(
  map: Map<string, PostReactionsData>,
  postId: string
): PostReactionsData {
  return map.get(postId) ?? emptyPostReactions()
}
