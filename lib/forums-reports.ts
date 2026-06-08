import "server-only"

import { createAdminClient } from "@/lib/supabase/admin"
import type { ForumReportReason } from "@/lib/forums-reports-shared"

export type { ForumReportReason } from "@/lib/forums-reports-shared"
export { FORUM_REPORT_REASONS, isForumReportReason } from "@/lib/forums-reports-shared"

export type ForumReportRow = {
  id: string
  post_id: string
  reporter_id: string
  reason: ForumReportReason
  note: string | null
  created_at: string
}

export async function createForumReport(input: {
  postId: string
  reporterId: string
  reason: ForumReportReason
  note?: string | null
}): Promise<ForumReportRow> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("forums_reports")
    .insert({
      post_id: input.postId,
      reporter_id: input.reporterId,
      reason: input.reason,
      note: input.note?.trim() || null,
    })
    .select("id, post_id, reporter_id, reason, note, created_at")
    .single()

  if (error) {
    if (error.code === "23505") {
      throw new Error("forums.report.already_reported")
    }
    throw new Error(error.message)
  }

  return data as ForumReportRow
}

export async function fetchForumReportById(reportId: string): Promise<ForumReportRow | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("forums_reports")
    .select("id, post_id, reporter_id, reason, note, created_at")
    .eq("id", reportId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return (data as ForumReportRow | null) ?? null
}
