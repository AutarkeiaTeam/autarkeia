"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/components/i18n-provider"
import {
  isEmailNotificationsEnabled,
  type NotificationPreferencesData,
} from "@/lib/profile-notifications"

type NotificationPreferencesFormProps = {
  initial: NotificationPreferencesData
}

function fieldClassName() {
  return "h-4 w-4 border-[#d4dce8] text-[#009b70] focus:ring-[#009b70]"
}

export function NotificationPreferencesForm({ initial }: NotificationPreferencesFormProps) {
  const { t } = useI18n()
  const router = useRouter()
  const [prefs, setPrefs] = useState(initial)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    setError("")
    setIsSaving(true)
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notifyEmailMode: prefs.notifyEmailMode,
          notifyInappEnabled: prefs.notifyInappEnabled,
          notifyForumReplies: prefs.notifyForumReplies,
          notifyForumReactions: prefs.notifyForumReactions,
          notifyForumMentions: prefs.notifyForumMentions,
        }),
      })
      const data = (await response.json().catch(() => null)) as { error?: string }
      if (!response.ok) {
        throw new Error(data?.error || "account.notifications.save_error")
      }
      setMessage(t("account.notifications.save_success"))
      router.refresh()
    } catch (err) {
      setError(t(err instanceof Error ? err.message : "account.notifications.save_error"))
    } finally {
      setIsSaving(false)
    }
  }

  const emailEnabled = isEmailNotificationsEnabled(prefs.notifyEmailMode)

  return (
    <section
      className="rounded-2xl border border-[#d4dce8] bg-white p-6"
      style={{ borderWidth: "0.5px" }}
    >
      <h2 className="text-lg font-medium text-[#0d1b2a]">
        {t("account.notifications.heading")}
      </h2>

      <form onSubmit={handleSave} className="mt-5 space-y-6">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={emailEnabled}
            onChange={(e) =>
              setPrefs((p) => ({
                ...p,
                notifyEmailMode: e.target.checked ? "immediate" : "off",
              }))
            }
            className={`mt-1 ${fieldClassName()}`}
          />
          <span className="text-sm text-[#0d1b2a]">{t("notify.email_enabled.label")}</span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={prefs.notifyInappEnabled}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, notifyInappEnabled: e.target.checked }))
            }
            className={`mt-1 ${fieldClassName()}`}
          />
          <span className="text-sm text-[#0d1b2a]">
            {t("account.notifications.inapp_toggle")}
          </span>
        </label>

        <div>
          <p className="mb-3 text-sm font-medium text-[#0d1b2a]">
            {t("account.notifications.types_heading")}
          </p>
          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={prefs.notifyForumReplies}
                onChange={(e) =>
                  setPrefs((p) => ({ ...p, notifyForumReplies: e.target.checked }))
                }
                className={`mt-1 ${fieldClassName()}`}
              />
              <span className="text-sm text-[#3d5166]">
                {t("account.notifications.reply_toggle")}
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={prefs.notifyForumReactions}
                onChange={(e) =>
                  setPrefs((p) => ({ ...p, notifyForumReactions: e.target.checked }))
                }
                className={`mt-1 ${fieldClassName()}`}
              />
              <span className="text-sm text-[#3d5166]">
                {t("account.notifications.reaction_toggle")}
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={prefs.notifyForumMentions}
                onChange={(e) =>
                  setPrefs((p) => ({ ...p, notifyForumMentions: e.target.checked }))
                }
                className={`mt-1 ${fieldClassName()}`}
              />
              <span className="text-sm text-[#3d5166]">
                {t("account.notifications.mention_toggle")}
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-[#009b70] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
        >
          {isSaving ? t("account.notifications.saving") : t("account.notifications.save")}
        </button>
        {message && <p className="text-sm text-[#009b70]">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </section>
  )
}
