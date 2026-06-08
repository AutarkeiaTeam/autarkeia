import type { NotificationRow } from "@/lib/notifications"
import { notificationTargetHref } from "@/lib/notification-links"
import { fetchProfileAuthorInfo } from "@/lib/profiles"

export type EnrichedNotification = NotificationRow & {
  href: string
  actor: {
    id: string
    name: string
    username: string | null
    avatar_url: string | null
  } | null
}

export async function enrichNotifications(
  rows: NotificationRow[]
): Promise<EnrichedNotification[]> {
  const actorIds = rows.map((r) => r.actor_id).filter((id): id is string => !!id)
  const actors = await fetchProfileAuthorInfo(actorIds)

  return rows.map((row) => {
    const actorInfo = row.actor_id ? actors.get(row.actor_id) : undefined
    return {
      ...row,
      href: notificationTargetHref(row),
      actor: row.actor_id
        ? {
            id: row.actor_id,
            name: actorInfo?.label ?? "",
            username: actorInfo?.username ?? null,
            avatar_url: actorInfo?.avatar_url ?? null,
          }
        : null,
    }
  })
}
