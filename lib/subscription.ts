import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import type { Tier } from "@/lib/auth-server"
import {
  hasActiveProSubscription,
  hasProSubscriptionStatus,
  PRO_SUBSCRIPTION_STATUSES,
  type ProSubscriptionStatus,
} from "@/lib/subscription-shared"

export {
  canManageSubscription,
  hasActiveProSubscription,
  hasProSubscriptionStatus,
  PRO_SUBSCRIPTION_STATUSES,
  type ProSubscriptionStatus,
} from "@/lib/subscription-shared"

export type ProfileSubscription = {
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: string
  subscription_plan: string | null
  subscription_trial_end: string | null
  subscription_current_period_end: string | null
}

function decodeCookieValue(value: string | undefined): string | null {
  if (!value) return null
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export async function getProfileSubscription(
  userId: string
): Promise<ProfileSubscription | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "stripe_customer_id, stripe_subscription_id, subscription_status, subscription_plan, subscription_trial_end, subscription_current_period_end"
    )
    .eq("id", userId)
    .maybeSingle()

  if (error || !data) return null
  return data as ProfileSubscription
}

export async function getProAccess(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const profile = await getProfileSubscription(user.id)
    if (hasActiveProSubscription(profile)) {
      return true
    }

    if (
      user.app_metadata?.tier === "pro" ||
      user.user_metadata?.tier === "pro"
    ) {
      return true
    }
  }

  const store = await cookies()
  const demoId = decodeCookieValue(store.get("autarkeia-user")?.value)
  if (demoId === "demo-pro") return true

  return store.get("autarkeia-tier")?.value === "pro"
}

export async function getTier(): Promise<Tier> {
  return (await getProAccess()) ? "pro" : "free"
}
