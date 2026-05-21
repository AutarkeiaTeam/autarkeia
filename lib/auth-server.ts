import { cookies } from "next/headers"
import { getProAccess, getTier as getTierFromSubscription } from "@/lib/subscription"

export type Tier = "free" | "pro"

const TIER_COOKIE = "autarkeia-tier"
const USER_COOKIE = "autarkeia-user"

export { getProAccess } from "@/lib/subscription"
export { hasProSubscriptionStatus } from "@/lib/subscription-shared"

export async function getTier(): Promise<Tier> {
  return getTierFromSubscription()
}

export async function getUserId(): Promise<string | null> {
  const store = await cookies()
  return store.get(USER_COOKIE)?.value ?? null
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getUserId()) !== null
}
