import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import { getThread } from "@/lib/forums-store"
import { notificationTargetHref } from "@/lib/notification-links"
import { createNotification, type NotificationRow } from "@/lib/notifications"
import {
  parseNotificationRecipientPrefs,
  type NotificationRecipientPrefs,
} from "@/lib/profile-notifications"
import { fetchProfileAuthorInfo } from "@/lib/profiles"
import { sendNotificationEmail } from "@/lib/resend"
import type { Locale } from "@/lib/i18n-core"
import { createAdminClient } from "@/lib/supabase/admin"

const RECIPIENT_SELECT =
  "id, email, display_name, first_name, last_name, notify_email_mode, notify_inapp_enabled, notify_forum_replies, notify_forum_reactions, notify_forum_mentions"

async function fetchRecipientPrefs(
  client: SupabaseClient,
  userIds: string[]
): Promise<Map<string, NotificationRecipientPrefs>> {
  const unique = [...new Set(userIds.filter(Boolean))]
  const map = new Map<string, NotificationRecipientPrefs>()
  if (unique.length === 0) return map

  const { data, error } = await client
    .from("profiles")
    .select(RECIPIENT_SELECT)
    .in("id", unique)

  if (error) {
    throw new Error(error.message)
  }

  for (const row of data ?? []) {
    map.set(row.id, parseNotificationRecipientPrefs(row as Record<string, unknown>))
  }
  return map
}

function snippet(text: string, max = 100): string {
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max)}…`
}

async function deliverNotification(
  client: SupabaseClient,
  recipientId: string,
  prefs: NotificationRecipientPrefs,
  notificationId: string,
  row: NotificationRow,
  locale: Locale
): Promise<void> {
  if (prefs.notifyEmailMode !== "immediate" || !prefs.email?.trim()) return

  const actors = row.actor_id ? await fetchProfileAuthorInfo([row.actor_id]) : new Map()
  const actor = row.actor_id ? actors.get(row.actor_id) : undefined

  void sendNotificationEmail(
    {
      id: notificationId,
      type: row.type,
      actorName: actor?.label ?? null,
      actorAvatarUrl: actor?.avatar_url ?? null,
      metadata: row.metadata,
      href: notificationTargetHref(row),
    },
    prefs.email!.trim(),
    locale
  ).catch((err) => {
    console.error("[notification-dispatch] email failed:", err)
  })
}

async function createAndMaybeEmail(
  client: SupabaseClient,
  input: Parameters<typeof createNotification>[1],
  prefs: NotificationRecipientPrefs,
  locale: Locale
): Promise<void> {
  if (!prefs.notifyInappEnabled) return

  const id = await createNotification(client, input)
  if (!id) return

  const row: NotificationRow = {
    id,
    user_id: input.userId,
    type: input.type,
    actor_id: input.actorId,
    subject_type: input.subjectType,
    subject_id: input.subjectId,
    metadata: input.metadata ?? {},
    read_at: null,
    created_at: new Date().toISOString(),
  }

  await deliverNotification(client, input.userId, prefs, id, row, locale)
}

export async function notifyForumReply(params: {
  threadId: string
  actorId: string
  postId: string
  content: string
  locale?: Locale
}): Promise<void> {
  const locale = params.locale ?? "en"
  const threadData = await getThread(params.threadId)
  if (!threadData) return

  const { thread, posts } = threadData
  const participantIds = new Set<string>([thread.author_id, ...posts.map((p) => p.author_id)])
  participantIds.delete(params.actorId)

  if (participantIds.size === 0) return

  const client = createAdminClient()
  const prefsMap = await fetchRecipientPrefs(client, [...participantIds])

  const metadata = {
    thread_title: thread.title,
    post_id: params.postId,
    snippet: snippet(params.content),
  }

  for (const userId of participantIds) {
    const prefs = prefsMap.get(userId)
    if (!prefs?.notifyForumReplies) continue

    try {
      await createAndMaybeEmail(
        client,
        {
          userId,
          type: "forum_reply",
          actorId: params.actorId,
          subjectType: "forum_thread",
          subjectId: params.threadId,
          metadata,
        },
        prefs,
        locale
      )
    } catch (err) {
      console.error("[notifyForumReply] failed for user", userId, err)
    }
  }
}

export async function notifyForumReaction(params: {
  postId: string
  threadId: string
  threadTitle: string
  postAuthorId: string
  actorId: string
  emoji: string
  locale?: Locale
}): Promise<void> {
  if (params.actorId === params.postAuthorId) return

  const locale = params.locale ?? "en"
  const client = createAdminClient()
  const prefsMap = await fetchRecipientPrefs(client, [params.postAuthorId])
  const prefs = prefsMap.get(params.postAuthorId)
  if (!prefs?.notifyForumReactions) return

  try {
    await createAndMaybeEmail(
      client,
      {
        userId: params.postAuthorId,
        type: "forum_reaction",
        actorId: params.actorId,
        subjectType: "forum_post",
        subjectId: params.postId,
        metadata: {
          emoji: params.emoji,
          thread_id: params.threadId,
          thread_title: params.threadTitle,
        },
      },
      prefs,
      locale
    )
  } catch (err) {
    console.error("[notifyForumReaction] failed:", err)
  }
}

export async function notifyForumMention(params: {
  userId: string
  actorId: string
  postId: string
  threadId: string
  threadTitle: string
  snippet: string
  locale?: Locale
}): Promise<void> {
  if (params.actorId === params.userId) return

  const locale = params.locale ?? "en"
  const client = createAdminClient()
  const prefsMap = await fetchRecipientPrefs(client, [params.userId])
  const prefs = prefsMap.get(params.userId)
  if (!prefs?.notifyForumMentions) return

  try {
    await createAndMaybeEmail(
      client,
      {
        userId: params.userId,
        type: "forum_mention",
        actorId: params.actorId,
        subjectType: "forum_post",
        subjectId: params.postId,
        metadata: {
          thread_id: params.threadId,
          thread_title: params.threadTitle,
          snippet: params.snippet,
        },
      },
      prefs,
      locale
    )
  } catch (err) {
    console.error("[notifyForumMention] failed:", err)
  }
}
