import type Stripe from "stripe"

export const BLOCKED_CHECKOUT_STATUSES = ["trialing", "active", "past_due"] as const

export function findBlockingSubscription(
  subscriptions: Stripe.Subscription[]
): Stripe.Subscription | undefined {
  return subscriptions.find((subscription) =>
    BLOCKED_CHECKOUT_STATUSES.includes(
      subscription.status as (typeof BLOCKED_CHECKOUT_STATUSES)[number]
    )
  )
}
