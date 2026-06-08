"use client"

import { MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ForumAuthor } from "@/components/forums/forum-author"
import { ForumPostContent } from "@/components/forums/forum-post-content"
import { MentionComposerTextarea } from "@/components/forums/mention-composer-textarea"
import { PostReactions } from "@/components/forums/post-reactions"
import { ReportPostModal } from "@/components/forums/report-post-modal"
import { useI18n } from "@/components/i18n-provider"
import type { ForumPost, PostReactionsData } from "@/lib/forums-shared"
import { canModerateForumContent } from "@/lib/forum-permissions"
import { postWasEdited } from "@/lib/forums-post"
import { formatRelativeTime } from "@/lib/relative-time"

type PostCardProps = {
  post: ForumPost
  reactions: PostReactionsData
  verifiedMentions: ReadonlySet<string>
  viewerId: string | null
  viewerIsAdmin: boolean
}

export function PostCard({
  post: initialPost,
  reactions,
  verifiedMentions,
  viewerId,
  viewerIsAdmin,
}: PostCardProps) {
  const { locale, t } = useI18n()
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const [post, setPost] = useState(initialPost)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(initialPost.content)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canModerate = canModerateForumContent(viewerId, post.author_id, viewerIsAdmin)
  const canReport = !!viewerId && viewerId !== post.author_id
  const showMenu = canModerate || canReport
  const edited = postWasEdited(post.created_at, post.updated_at)
  const translateError = (message: string) =>
    message.startsWith("forums.") ? t(message) : message

  useEffect(() => {
    setPost(initialPost)
    if (!editing) setDraft(initialPost.content)
  }, [initialPost, editing])

  useEffect(() => {
    if (!menuOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [menuOpen])

  const startEdit = () => {
    setDraft(post.content)
    setEditing(true)
    setMenuOpen(false)
    setError(null)
  }

  const cancelEdit = () => {
    setDraft(post.content)
    setEditing(false)
    setError(null)
  }

  const saveEdit = async () => {
    setError(null)
    setSaving(true)
    try {
      const res = await fetch(`/api/forums/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "forums.error.save_reply_failed")
      if (data.post) setPost(data.post)
      setEditing(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? translateError(err.message) : t("forums.error.save_reply_failed"))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    setMenuOpen(false)
    if (!confirm(t("forums.post.delete_confirm"))) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/forums/posts/${post.id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const message = typeof data.error === "string" ? data.error : "forums.error.delete_reply_failed"
        alert(translateError(message))
        return
      }
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  const openReport = () => {
    setMenuOpen(false)
    setReportOpen(true)
  }

  return (
    <li className="relative rounded-2xl border border-[#d4dce8] bg-white p-5 pr-12">
      {showMenu && (
        <div ref={menuRef} className="absolute right-3 top-3">
          <button
            type="button"
            aria-label={t("forums.post.options")}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-md p-1 text-[#8a9bb0] hover:bg-[#f5f7fa] hover:text-[#3d5166]"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-8 z-10 min-w-[9rem] rounded-lg border border-[#d4dce8] bg-white py-1 shadow-md"
            >
              {canModerate && (
                <>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={startEdit}
                    className="block w-full px-3 py-1.5 text-left text-sm text-[#3d5166] hover:bg-[#f5f7fa]"
                  >
                    {t("forums.post.edit")}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={onDelete}
                    disabled={deleting}
                    className="block w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {deleting ? t("forums.post.deleting") : t("forums.post.delete")}
                  </button>
                </>
              )}
              {canReport && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={openReport}
                  className="block w-full px-3 py-1.5 text-left text-sm text-[#3d5166] hover:bg-[#f5f7fa]"
                >
                  {t("forums.report.menu")}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pr-2">
        <ForumAuthor author={post} size={36} />
        <p className="shrink-0 text-[11px] text-[#8a9bb0]">
          {formatRelativeTime(post.created_at, locale)}
          {edited && <span className="ml-1 text-[#8a9bb0]">{t("forums.post.edited")}</span>}
        </p>
      </div>

      {editing ? (
        <div className="mt-3 space-y-2">
          <MentionComposerTextarea
            value={draft}
            onValueChange={setDraft}
            className="w-full rounded-lg border border-[#d4dce8] p-3 text-sm outline-none focus:border-[#009b70]"
            rows={5}
            minLength={2}
            autoFocus
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveEdit}
              disabled={saving || draft.trim().length < 2}
              className="rounded-lg bg-[#009b70] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
            >
              {saving ? t("forums.post.saving") : t("forums.post.save")}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              className="rounded-lg border border-[#d4dce8] px-3 py-1.5 text-sm text-[#3d5166] hover:bg-[#f5f7fa] disabled:opacity-60"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      ) : (
        <>
          <ForumPostContent
            content={post.content}
            verifiedMentions={verifiedMentions}
            className="mt-3"
          />
          <PostReactions postId={post.id} initialReactions={reactions} viewerId={viewerId} />
        </>
      )}

      {canReport && (
        <ReportPostModal postId={post.id} open={reportOpen} onOpenChange={setReportOpen} />
      )}
    </li>
  )
}
