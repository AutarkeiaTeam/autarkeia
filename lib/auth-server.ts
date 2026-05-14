import { cookies } from "next/headers"

export type Tier = "free" | "pro"

const TIER_COOKIE = "autarkeia-tier"
const USER_COOKIE = "autarkeia-user"

/**
 * Server-side helpers for reading the demo auth cookies. These work
 * standalone (no Supabase required) so the dashboard, forums, and
 * library paywall render correctly in local dev. Once Supabase is
 * configured these helpers should delegate to its session cookies.
 */
export async function getTier(): Promise<Tier> {
  const store = await cookies()
  const value = store.get(TIER_COOKIE)?.value
  return value === "pro" ? "pro" : "free"
}

export async function getUserId(): Promise<string | null> {
  const store = await cookies()
  return store.get(USER_COOKIE)?.value ?? null
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getUserId()) !== null
}
