import { NextResponse } from "next/server"
import { getUserId } from "@/lib/auth-server"
import { recordThreadView } from "@/lib/forums-engagement"
import { getThread } from "@/lib/forums-store"

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: "forums.error.auth_required" }, { status: 401 })
  }

  const { id } = await ctx.params
  const result = await getThread(id)
  if (!result) {
    return NextResponse.json({ error: "forums.error.not_found" }, { status: 404 })
  }

  try {
    await recordThreadView(userId, id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[POST /api/forums/threads/[id]/view]", err)
    return NextResponse.json({ error: "forums.error.unknown" }, { status: 500 })
  }
}
