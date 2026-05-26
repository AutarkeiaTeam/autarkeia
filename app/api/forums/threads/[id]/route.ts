import { NextRequest, NextResponse } from "next/server"
import { deleteThread, getThread } from "@/lib/forums-store"
import { getUserId } from "@/lib/auth-server"
import { canModerateForumContent, getForumDeleteAccess } from "@/lib/forum-permissions"

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const result = await getThread(id)
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(result)
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  const { id } = await ctx.params
  const result = await getThread(id)
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { isAdmin: requesterIsAdmin } = await getForumDeleteAccess(userId)
  if (!canModerateForumContent(userId, result.thread.author_id, requesterIsAdmin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const ok = await deleteThread(id, userId, requesterIsAdmin)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ ok: true })
}
