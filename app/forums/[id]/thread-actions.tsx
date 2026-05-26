"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export function ReplyForm({ threadId }: { threadId: string }) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch(`/api/forums/threads/${threadId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not post reply")
      setContent("")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-[#d4dce8] bg-white p-5">
      <p className="text-sm font-medium text-[#0d1b2a]">Reply</p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full rounded-lg border border-[#d4dce8] p-3 text-sm outline-none focus:border-[#009b70]"
        rows={5}
        required
        minLength={2}
        placeholder="Add your reply…"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-[#009b70] px-4 py-2 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
      >
        {submitting ? "Posting…" : "Post reply"}
      </button>
    </form>
  )
}

export function DeletePostButton({ postId, threadId }: { postId: string; threadId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const onDelete = async () => {
    if (!confirm("Delete this reply? This cannot be undone.")) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/forums/posts/${postId}`, { method: "DELETE" })
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
    <button
      type="button"
      onClick={onDelete}
      disabled={deleting}
      className="mt-3 inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
      data-thread={threadId}
    >
      <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {deleting ? "Deleting…" : "Delete"}
    </button>
  )
}

export function DeleteThreadButton({ threadId }: { threadId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const onDelete = async () => {
    if (!confirm("Delete this thread? This cannot be undone.")) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/forums/threads/${threadId}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.error || "Could not delete thread")
        return
      }
      router.push("/forums")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={deleting}
      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
    >
      <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
      {deleting ? "Deleting…" : "Delete thread"}
    </button>
  )
}
