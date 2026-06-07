import "server-only"

import { profilePath } from "@/lib/profile-path"
import { createClient } from "@/lib/supabase/server"

export async function resolveAuthenticatedProfileRedirect(
  searchParams?: Record<string, string | string[] | undefined>
): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return "/login"
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle()

  const base = profile?.username ? profilePath(profile.username) : "/account"
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (typeof value === "string") query.set(key, value)
    else if (Array.isArray(value) && value[0]) query.set(key, value[0])
  }

  const qs = query.toString()
  return qs ? `${base}?${qs}` : base
}
