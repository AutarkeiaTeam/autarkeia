import type { NotificationRow } from "@/lib/notifications"

export function notificationTargetHref(notification: NotificationRow): string {
  if (notification.subject_type === "forum_thread" && notification.subject_id) {
    return `/forums/${notification.subject_id}`
  }
  if (notification.subject_type === "forum_post") {
    const threadId = notification.metadata.thread_id
    if (typeof threadId === "string" && threadId) {
      return `/forums/${threadId}`
    }
  }
  return "/notifications"
}
