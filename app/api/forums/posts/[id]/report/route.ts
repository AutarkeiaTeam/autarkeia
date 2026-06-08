import { NextRequest, NextResponse } from "next/server"
import { getUserId } from "@/lib/auth-server"
import { getPost, getThread } from "@/lib/forums-store"
import { createForumReport, isForumReportReason } from "@/lib/forums-reports"
import { sendForumReportNotification } from "@/lib/resend"
import { createAdminClient } from "@/lib/supabase/admin"
import { profileAuthorLabel } from "@/lib/profiles"

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: "forums.error.auth_required" }, { status: 401 })
  }

  const { id } = await ctx.params
  const post = await getPost(id)
  if (!post) {
    return NextResponse.json({ error: "forums.error.not_found" }, { status: 404 })
  }

  if (post.author_id === userId) {
    return NextResponse.json({ error: "forums.report.own_post" }, { status: 400 })
  }

  let body: { reason?: string; note?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "forums.error.invalid_json" }, { status: 400 })
  }

  const reason = (body.reason ?? "").trim()
  if (!isForumReportReason(reason)) {
    return NextResponse.json({ error: "forums.report.invalid_reason" }, { status: 400 })
  }

  try {
    const report = await createForumReport({
      postId: id,
      reporterId: userId,
      reason,
      note: body.note,
    })

    const threadData = await getThread(post.thread_id)
    const admin = createAdminClient()
    const { data: reporterProfile } = await admin
      .from("profiles")
      .select("email, display_name, first_name, last_name")
      .eq("id", userId)
      .maybeSingle()

    const reporterEmail = reporterProfile?.email ?? "unknown"
    const reporterName = profileAuthorLabel(reporterProfile, "Member")

    const appUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://autarkeia.world").replace(
      /\/$/,
      ""
    )

    void sendForumReportNotification({
      reportId: report.id,
      reason,
      note: report.note,
      reporterName,
      reporterEmail,
      postSnippet: post.content.trim().slice(0, 300),
      postUrl: `${appUrl}/forums/${post.thread_id}`,
      threadTitle: threadData?.thread.title ?? "",
    }).catch((err) => {
      console.error("[POST /api/forums/posts/[id]/report] email failed:", err)
    })

    return NextResponse.json({ ok: true, reportId: report.id }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "forums.report.submit_error"
    if (message === "forums.report.already_reported") {
      return NextResponse.json({ error: message }, { status: 409 })
    }
    console.error("[POST /api/forums/posts/[id]/report]", err)
    return NextResponse.json({ error: "forums.report.submit_error" }, { status: 500 })
  }
}
