export const PRO_SUBSCRIPTION_STATUSES = ["trialing", "active"] as const
export type ProSubscriptionStatus = (typeof PRO_SUBSCRIPTION_STATUSES)[number]

export function hasProSubscriptionStatus(status: string | null | undefined): boolean {
  return (
    status != null &&
    PRO_SUBSCRIPTION_STATUSES.includes(status as ProSubscriptionStatus)
  )
}

export function canManageSubscription(status: string | null | undefined): boolean {
  return status != null && ["trialing", "active", "past_due"].includes(status)
}
