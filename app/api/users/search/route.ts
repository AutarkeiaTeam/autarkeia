import { NextRequest, NextResponse } from "next/server"
import { getUserId } from "@/lib/auth-server"
import { searchUsers } from "@/lib/user-search"

export async function GET(request: NextRequest) {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: "account.validation.unauthorized" }, { status: 401 })
  }

  const q = request.nextUrl.searchParams.get("q") ?? ""
  if (!q.trim()) {
    return NextResponse.json({ users: [] })
  }

  try {
    const users = await searchUsers(q, 10)
    return NextResponse.json({ users })
  } catch (err) {
    console.error("GET /api/users/search error:", err)
    return NextResponse.json({ error: "forums.mention.search_failed" }, { status: 500 })
  }
}
