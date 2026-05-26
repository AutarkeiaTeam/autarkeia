import { cookies } from "next/headers"
import { getProAccess, getTier as getTierFromSubscription } from "@/lib/subscription"
import { createClient } from "@/lib/supabase/server"

export type Tier = "free" | "pro"

const TIER_COOKIE = "autarkeia-tier"
const USER_COOKIE = "autarkeia-user"

export { getProAccess } from "@/lib/subscription"
export { hasProSubscriptionStatus } from "@/lib/subscription-shared"

function decodeCookieValue(value: string | undefined): string | null {
  if (!value) return null
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export async function getTier(): Promise<Tier> {
  return getTierFromSubscription()
}

/** Supabase session user id, else decoded autarkeia-user cookie. */
export async function getUserId(): Promise<string | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user?.id) return user.id
  } catch {
    // Supabase not configured or cookies unavailable
  }

  const store = await cookies()
  return decodeCookieValue(store.get(USER_COOKIE)?.value)
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getUserId()) !== null
}
