export const FORUM_REPORT_REASONS = [
  "spam",
  "harassment",
  "off_topic",
  "misinformation",
  "other",
] as const

export type ForumReportReason = (typeof FORUM_REPORT_REASONS)[number]

export function isForumReportReason(value: string): value is ForumReportReason {
  return (FORUM_REPORT_REASONS as readonly string[]).includes(value)
}
