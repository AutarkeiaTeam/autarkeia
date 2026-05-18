import { NextRequest, NextResponse } from "next/server"

function decodeCookieValue(value: string | undefined) {
  if (!value) return ""
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase admin deletion is not configured." }, { status: 500 })
  }

  const userId = decodeCookieValue(request.cookies.get("autarkeia-user")?.value)
  if (!userId) {
    return NextResponse.json({ error: "No signed-in user found." }, { status: 401 })
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(async () => ({ error: await response.text().catch(() => "") }))
    const message = body?.msg || body?.error_description || body?.error || `Supabase returned ${response.status}.`
    return NextResponse.json({ error: message }, { status: response.status })
  }

  return NextResponse.json({ success: true })
}
