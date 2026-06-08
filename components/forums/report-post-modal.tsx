"use client"

import { FormEvent, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useI18n } from "@/components/i18n-provider"
import { FORUM_REPORT_REASONS, type ForumReportReason } from "@/lib/forums-reports-shared"

type ReportPostModalProps = {
  postId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportPostModal({ postId, open, onOpenChange }: ReportPostModalProps) {
  const { t } = useI18n()
  const [reason, setReason] = useState<ForumReportReason>("spam")
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const translateError = (message: string) =>
    message.startsWith("forums.") ? t(message) : message

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch(`/api/forums/posts/${postId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, note: note.trim() || undefined }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        throw new Error(data.error || "forums.report.submit_error")
      }
      setSuccess(true)
      setNote("")
    } catch (err) {
      setError(
        err instanceof Error ? translateError(err.message) : t("forums.report.submit_error")
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSuccess(false)
      setError(null)
      setReason("spam")
      setNote("")
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("forums.report.success_title")}</DialogTitle>
              <DialogDescription>{t("forums.report.success_body")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="rounded-lg bg-[#009b70] px-4 py-2 text-sm font-medium text-white hover:bg-[#007a58]"
              >
                {t("forums.report.done")}
              </button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{t("forums.report.title")}</DialogTitle>
              <DialogDescription>{t("forums.report.description")}</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="report-reason" className="mb-1.5 block text-xs font-medium text-[#3d5166]">
                  {t("forums.report.reason_label")}
                </label>
                <select
                  id="report-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ForumReportReason)}
                  className="w-full rounded-lg border border-[#d4dce8] bg-white p-2.5 text-sm outline-none focus:border-[#009b70]"
                >
                  {FORUM_REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {t(`forums.report.reason.${r}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="report-note" className="mb-1.5 block text-xs font-medium text-[#3d5166]">
                  {t("forums.report.note_label")}
                </label>
                <textarea
                  id="report-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder={t("forums.report.note_placeholder")}
                  className="w-full rounded-lg border border-[#d4dce8] p-2.5 text-sm outline-none focus:border-[#009b70]"
                />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>
            <DialogFooter className="mt-6 gap-2 sm:gap-0">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="rounded-lg border border-[#d4dce8] px-4 py-2 text-sm text-[#3d5166] hover:bg-[#f5f7fa]"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-[#009b70] px-4 py-2 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
              >
                {submitting ? t("forums.report.submitting") : t("forums.report.submit")}
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
