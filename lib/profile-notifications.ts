import { z } from "zod"

export const NOTIFY_EMAIL_MODES = ["immediate", "daily", "off"] as const

export type NotifyEmailMode = (typeof NOTIFY_EMAIL_MODES)[number]

export const notificationPreferencesSchema = z.object({
  notifyEmailMode: z.enum(NOTIFY_EMAIL_MODES).optional(),
  notifyInappEnabled: z.boolean().optional(),
  notifyForumReplies: z.boolean().optional(),
  notifyForumReactions: z.boolean().optional(),
  notifyForumMentions: z.boolean().optional(),
})

export type NotificationPreferencesData = {
  notifyEmailMode: NotifyEmailMode
  notifyInappEnabled: boolean
  notifyForumReplies: boolean
  notifyForumReactions: boolean
  notifyForumMentions: boolean
}

export function parseNotificationPreferencesFromRow(
  row: Record<string, unknown> | null | undefined
): NotificationPreferencesData {
  const mode = row?.notify_email_mode
  return {
    notifyEmailMode:
      mode === "daily" || mode === "off" ? mode : "immediate",
    notifyInappEnabled: row?.notify_inapp_enabled !== false,
    notifyForumReplies: row?.notify_forum_replies !== false,
    notifyForumReactions: row?.notify_forum_reactions !== false,
    notifyForumMentions: row?.notify_forum_mentions !== false,
  }
}

export function notificationPreferencesToDbUpdates(
  data: z.infer<typeof notificationPreferencesSchema>
): Record<string, unknown> {
  const updates: Record<string, unknown> = {}
  if (data.notifyEmailMode !== undefined) {
    updates.notify_email_mode = data.notifyEmailMode
  }
  if (data.notifyInappEnabled !== undefined) {
    updates.notify_inapp_enabled = data.notifyInappEnabled
  }
  if (data.notifyForumReplies !== undefined) {
    updates.notify_forum_replies = data.notifyForumReplies
  }
  if (data.notifyForumReactions !== undefined) {
    updates.notify_forum_reactions = data.notifyForumReactions
  }
  if (data.notifyForumMentions !== undefined) {
    updates.notify_forum_mentions = data.notifyForumMentions
  }
  return updates
}

export type NotificationRecipientPrefs = NotificationPreferencesData & {
  email: string | null
  display_name: string | null
  first_name: string | null
  last_name: string | null
}

export function parseNotificationRecipientPrefs(
  row: Record<string, unknown> | null | undefined
): NotificationRecipientPrefs {
  const base = parseNotificationPreferencesFromRow(row)
  return {
    ...base,
    email: typeof row?.email === "string" ? row.email : null,
    display_name: typeof row?.display_name === "string" ? row.display_name : null,
    first_name: typeof row?.first_name === "string" ? row.first_name : null,
    last_name: typeof row?.last_name === "string" ? row.last_name : null,
  }
}
