import "server-only"

import { createAdminClient } from "@/lib/supabase/admin"
import { profileAuthorLabel } from "@/lib/profiles"

export type UserSearchResult = {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
}

export async function searchUsers(query: string, limit = 10): Promise<UserSearchResult[]> {
  const q = query.trim().toLowerCase()
  if (q.length < 1) return []

  const admin = createAdminClient()
  const pattern = `${q}%`

  const { data, error } = await admin
    .from("profiles")
    .select("id, username, display_name, first_name, last_name, email, avatar_url")
    .or(`username.ilike.${pattern},display_name.ilike.${pattern}`)
    .not("username", "is", null)
    .limit(limit)

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? [])
    .filter((row) => row.username?.trim())
    .map((row) => ({
      id: row.id,
      username: row.username!.trim().toLowerCase(),
      display_name: profileAuthorLabel(row),
      avatar_url: row.avatar_url?.trim() || null,
    }))
}
