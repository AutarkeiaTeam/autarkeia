import type Stripe from "stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import { planFromStripePriceId } from "@/lib/stripe"

export type SubscriptionProfileUpdate = {
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  subscription_status: string
  subscription_plan?: string | null
  subscription_trial_end?: string | null
  subscription_current_period_end?: string | null
}

function timestampToIso(seconds: number | null | undefined): string | null {
  if (seconds == null) return null
  return new Date(seconds * 1000).toISOString()
}

export function profileUpdateFromSubscription(
  subscription: Stripe.Subscription,
  fallbackPlan?: string | null
): SubscriptionProfileUpdate {
  const priceId = subscription.items.data[0]?.price?.id
  const plan =
    fallbackPlan ?? planFromStripePriceId(priceId) ?? subscription.metadata?.plan ?? null

  let status: string = subscription.status
  if (status === "canceled" || status === "unpaid" || status === "incomplete_expired") {
    status = "cancelled"
  }

  return {
    stripe_customer_id:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id ?? null,
    stripe_subscription_id: subscription.id,
    subscription_status: status,
    subscription_plan: plan,
    subscription_trial_end: timestampToIso(subscription.trial_end),
    subscription_current_period_end: timestampToIso(subscription.current_period_end),
  }
}

export async function applySubscriptionProfileUpdate(
  userId: string,
  update: SubscriptionProfileUpdate
): Promise<void> {
  const admin = createAdminClient()

  const { error } = await admin.from("profiles").upsert(
    {
      id: userId,
      ...update,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  )

  if (error) {
    throw new Error(error.message)
  }

  const isPro = update.subscription_status === "trialing" || update.subscription_status === "active"

  await admin.auth.admin.updateUserById(userId, {
    app_metadata: { tier: isPro ? "pro" : "free" },
  })
}

export async function revokeProAccess(userId: string, customerId?: string | null): Promise<void> {
  await applySubscriptionProfileUpdate(userId, {
    stripe_customer_id: customerId ?? undefined,
    stripe_subscription_id: null,
    subscription_status: "cancelled",
    subscription_plan: null,
    subscription_trial_end: null,
    subscription_current_period_end: null,
  })
}
