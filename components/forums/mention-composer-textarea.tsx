"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type TextareaHTMLAttributes,
} from "react"
import { UserAvatar } from "@/components/user-avatar"
import { useI18n } from "@/components/i18n-provider"
import { initialsFromDisplayName } from "@/lib/avatar-initials"

type MentionUser = {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
}

type MentionComposerTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
> & {
  value: string
  onValueChange: (value: string) => void
  showMarkdownHint?: boolean
}

export function MentionComposerTextarea({
  value,
  onValueChange,
  showMarkdownHint = true,
  className = "",
  onKeyDown,
  ...props
}: MentionComposerTextareaProps) {
  const { t } = useI18n()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [mentionQuery, setMentionQuery] = useState<string | null>(null)
  const [mentionStart, setMentionStart] = useState(0)
  const [results, setResults] = useState<MentionUser[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  const detectMention = useCallback((text: string, cursor: number) => {
    const before = text.slice(0, cursor)
    const match = before.match(/@([a-z0-9_]*)$/i)
    if (!match) {
      setMentionQuery(null)
      return
    }
    setMentionQuery(match[1].toLowerCase())
    setMentionStart(cursor - match[0].length)
    setActiveIndex(0)
  }, [])

  useEffect(() => {
    if (mentionQuery === null) {
      setResults([])
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/users/search?q=${encodeURIComponent(mentionQuery)}`,
          { signal: controller.signal }
        )
        if (!res.ok) return
        const data = (await res.json()) as { users?: MentionUser[] }
        setResults(data.users ?? [])
        setActiveIndex(0)
      } catch {
        /* ignore aborted */
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [mentionQuery])

  const selectMention = (user: MentionUser) => {
    const textarea = textareaRef.current
    const cursor = textarea?.selectionStart ?? value.length
    const before = value.slice(0, mentionStart)
    const after = value.slice(cursor)
    const insertion = `@${user.username} `
    const next = `${before}${insertion}${after}`
    onValueChange(next)
    setMentionQuery(null)
    setResults([])
    requestAnimationFrame(() => {
      const pos = before.length + insertion.length
      textarea?.focus()
      textarea?.setSelectionRange(pos, pos)
    })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionQuery !== null && results.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault()
        setActiveIndex((i) => (i + 1) % results.length)
        return
      }
      if (event.key === "ArrowUp") {
        event.preventDefault()
        setActiveIndex((i) => (i - 1 + results.length) % results.length)
        return
      }
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault()
        selectMention(results[activeIndex])
        return
      }
      if (event.key === "Escape") {
        event.preventDefault()
        setMentionQuery(null)
        return
      }
    }
    onKeyDown?.(event)
  }

  return (
    <div className="relative">
      <textarea
        {...props}
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onValueChange(e.target.value)
          detectMention(e.target.value, e.target.selectionStart)
        }}
        onKeyDown={handleKeyDown}
        onClick={(e) =>
          detectMention(e.currentTarget.value, e.currentTarget.selectionStart)
        }
        onKeyUp={(e) =>
          detectMention(e.currentTarget.value, e.currentTarget.selectionStart)
        }
        className={className}
      />
      {mentionQuery !== null && (results.length > 0 || loading) && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-[#d4dce8] bg-white py-1 shadow-md"
        >
          {loading && results.length === 0 ? (
            <p className="px-3 py-2 text-xs text-[#8a9bb0]">…</p>
          ) : (
            results.map((user, index) => (
              <button
                key={user.id}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectMention(user)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f7fa] ${
                  index === activeIndex ? "bg-[#f0faf6]" : ""
                }`}
              >
                <UserAvatar
                  src={user.avatar_url}
                  fallbackInitials={initialsFromDisplayName(
                    user.display_name,
                    user.username
                  )}
                  size={28}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-[#0d1b2a]">
                    {user.display_name}
                  </span>
                  <span className="block truncate text-xs text-[#8a9bb0]">
                    @{user.username}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
      {showMarkdownHint && (
        <p className="mt-1.5 text-[11px] text-[#8a9bb0]">{t("forums.markdown.hint")}</p>
      )}
    </div>
  )
}
