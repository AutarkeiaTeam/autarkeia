"use client"

import { Lock, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { MentionComposerTextarea } from "@/components/forums/mention-composer-textarea"
import { useI18n } from "@/components/i18n-provider"

export function ReplyForm({
  threadId,
  locked = false,
  viewerIsAdmin = false,
}: {
  threadId: string
  locked?: boolean
  viewerIsAdmin?: boolean
}) {
  const { t } = useI18n()
  const router = useRouter()
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const translateError = (message: string) =>
    message.startsWith("forums.") ? t(message) : message

  const disabled = locked && !viewerIsAdmin

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (disabled) return
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch(`/api/forums/threads/${threadId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "forums.error.post_reply_failed")
      setContent("")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? translateError(err.message) : t("forums.error.unknown"))
    } finally {
      setSubmitting(false)
    }
  }

  if (disabled) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-[#d4dce8] bg-[#f9fafc] p-5 text-sm text-[#3d5166]">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#8a9bb0]" aria-hidden />
        <p>{t("forums.thread.locked_banner")}</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-[#d4dce8] bg-white p-5">
      <p className="text-sm font-medium text-[#0d1b2a]">{t("forums.reply.label")}</p>
      <MentionComposerTextarea
        value={content}
        onValueChange={setContent}
        className="w-full rounded-lg border border-[#d4dce8] p-3 text-sm outline-none focus:border-[#009b70]"
        rows={5}
        required
        minLength={2}
        placeholder={t("forums.reply.placeholder")}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-[#009b70] px-4 py-2 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
      >
        {submitting ? t("forums.reply.posting") : t("forums.reply.submit")}
      </button>
    </form>
  )
}

export function DeleteThreadButton({ threadId }: { threadId: string }) {
  const { t } = useI18n()
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const translateError = (message: string) =>
    message.startsWith("forums.") ? t(message) : message

  const onDelete = async () => {
    if (!confirm(t("forums.thread.delete_confirm"))) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/forums/threads/${threadId}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const message = typeof data.error === "string" ? data.error : "forums.error.delete_thread_failed"
        alert(translateError(message))
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
      {deleting ? t("forums.thread.deleting") : t("forums.thread.delete_cta")}
    </button>
  )
}
