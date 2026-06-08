import { NextRequest, NextResponse } from "next/server"
import { getUserId } from "@/lib/auth-server"
import { setThreadPinned } from "@/lib/forums-store"
import { isAdmin } from "@/lib/profiles"

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: "forums.error.auth_required" }, { status: 401 })
  }

  if (!(await isAdmin(userId))) {
    return NextResponse.json({ error: "forums.error.forbidden" }, { status: 403 })
  }

  const { id } = await ctx.params
  let body: { pinned?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "forums.error.invalid_json" }, { status: 400 })
  }

  if (typeof body.pinned !== "boolean") {
    return NextResponse.json({ error: "forums.error.invalid_json" }, { status: 400 })
  }

  const thread = await setThreadPinned(id, body.pinned)
  if (!thread) {
    return NextResponse.json({ error: "forums.error.thread_not_found" }, { status: 404 })
  }

  return NextResponse.json({ thread })
}
