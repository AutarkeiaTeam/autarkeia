"use client"

import { MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import type { ForumPost } from "@/lib/forums-store"
import { canModerateForumContent } from "@/lib/forum-permissions"
import { postWasEdited } from "@/lib/forums-post"

type PostCardProps = {
  post: ForumPost
  viewerId: string | null
  viewerIsAdmin: boolean
}

export function PostCard({ post: initialPost, viewerId, viewerIsAdmin }: PostCardProps) {
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const [post, setPost] = useState(initialPost)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(initialPost.content)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canModerate = canModerateForumContent(viewerId, post.author_id, viewerIsAdmin)
  const edited = postWasEdited(post.created_at, post.updated_at)

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
      if (!res.ok) throw new Error(data.error || "Could not save reply")
      if (data.post) setPost(data.post)
      setEditing(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save reply")
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    setMenuOpen(false)
    if (!confirm("Delete this reply? This cannot be undone.")) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/forums/posts/${post.id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.error || "Could not delete reply")
        return
      }
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <li className="relative rounded-2xl border border-[#d4dce8] bg-white p-5 pr-12">
      {canModerate && (
        <div ref={menuRef} className="absolute right-3 top-3">
          <button
            type="button"
            aria-label="Post options"
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
              className="absolute right-0 top-8 z-10 min-w-[7rem] rounded-lg border border-[#d4dce8] bg-white py-1 shadow-md"
            >
              <button
                type="button"
                role="menuitem"
                onClick={startEdit}
                className="block w-full px-3 py-1.5 text-left text-sm text-[#3d5166] hover:bg-[#f5f7fa]"
              >
                Edit
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={onDelete}
                disabled={deleting}
                className="block w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pr-2">
        <p className="text-xs font-medium text-[#0d1b2a]">{post.author_name}</p>
        <p className="shrink-0 text-[11px] text-[#8a9bb0]">
          {new Date(post.created_at).toLocaleString()}
          {edited && <span className="ml-1 text-[#8a9bb0]">(edited)</span>}
        </p>
      </div>

      {editing ? (
        <div className="mt-3 space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
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
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              className="rounded-lg border border-[#d4dce8] px-3 py-1.5 text-sm text-[#3d5166] hover:bg-[#f5f7fa] disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#3d5166]">{post.content}</p>
      )}
    </li>
  )
}
