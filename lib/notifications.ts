import type { SupabaseClient } from "@supabase/supabase-js"

export const NOTIFICATION_TYPES = [
  "forum_reply",
  "forum_reaction",
  "forum_mention",
] as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[number]

export const NOTIFICATION_SUBJECT_TYPES = ["forum_thread", "forum_post"] as const

export type NotificationSubjectType = (typeof NOTIFICATION_SUBJECT_TYPES)[number]

export type NotificationRow = {
  id: string
  user_id: string
  type: NotificationType
  actor_id: string | null
  subject_type: NotificationSubjectType | null
  subject_id: string | null
  metadata: Record<string, unknown>
  read_at: string | null
  created_at: string
}

export type CreateNotificationInput = {
  userId: string
  type: NotificationType
  actorId: string | null
  subjectType: NotificationSubjectType
  subjectId: string
  metadata?: Record<string, unknown>
}

export function isNotificationType(value: string): value is NotificationType {
  return (NOTIFICATION_TYPES as readonly string[]).includes(value)
}

export async function createNotification(
  client: SupabaseClient,
  input: CreateNotificationInput
): Promise<string | null> {
  if (input.actorId && input.actorId === input.userId) {
    return null
  }

  const { data, error } = await client
    .from("notifications")
    .insert({
      user_id: input.userId,
      type: input.type,
      actor_id: input.actorId,
      subject_type: input.subjectType,
      subject_id: input.subjectId,
      metadata: input.metadata ?? {},
    })
    .select("id")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data?.id ?? null
}

export type NotificationFilter = "all" | "unread" | NotificationType

export async function getNotifications(
  client: SupabaseClient,
  userId: string,
  options?: { limit?: number; offset?: number; filter?: NotificationFilter }
): Promise<NotificationRow[]> {
  const limit = options?.limit ?? 20
  const offset = options?.offset ?? 0
  const filter = options?.filter ?? "all"

  let query = client
    .from("notifications")
    .select(
      "id, user_id, type, actor_id, subject_type, subject_id, metadata, read_at, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (filter === "unread") {
    query = query.is("read_at", null)
  } else if (filter !== "all" && isNotificationType(filter)) {
    query = query.eq("type", filter)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({
    ...row,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
  })) as NotificationRow[]
}

export async function markRead(
  client: SupabaseClient,
  notificationIds: string[],
  userId: string
): Promise<number> {
  const ids = [...new Set(notificationIds.filter(Boolean))]
  if (ids.length === 0) return 0

  const now = new Date().toISOString()
  const { data, error } = await client
    .from("notifications")
    .update({ read_at: now })
    .eq("user_id", userId)
    .in("id", ids)
    .is("read_at", null)
    .select("id")

  if (error) throw new Error(error.message)
  return data?.length ?? 0
}

export async function markAllRead(client: SupabaseClient, userId: string): Promise<number> {
  const now = new Date().toISOString()
  const { data, error } = await client
    .from("notifications")
    .update({ read_at: now })
    .eq("user_id", userId)
    .is("read_at", null)
    .select("id")

  if (error) throw new Error(error.message)
  return data?.length ?? 0
}

export async function getUnreadCount(client: SupabaseClient, userId: string): Promise<number> {
  const { count, error } = await client
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null)

  if (error) throw new Error(error.message)
  return count ?? 0
}
