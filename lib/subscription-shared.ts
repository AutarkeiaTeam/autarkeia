export const PRO_SUBSCRIPTION_STATUSES = ["trialing", "active"] as const
export type ProSubscriptionStatus = (typeof PRO_SUBSCRIPTION_STATUSES)[number]

export function hasProSubscriptionStatus(status: string | null | undefined): boolean {
  return (
    status != null &&
    PRO_SUBSCRIPTION_STATUSES.includes(status as ProSubscriptionStatus)
  )
}

/** Stripe Pro: trialing/active status with a subscription_plan set. */
export function hasActiveProSubscription(
  profile:
    | {
        subscription_status?: string | null
        subscription_plan?: string | null
      }
    | null
    | undefined
): boolean {
  if (!profile) return false
  return (
    hasProSubscriptionStatus(profile.subscription_status) &&
    Boolean(profile.subscription_plan?.trim())
  )
}

export function canManageSubscription(status: string | null | undefined): boolean {
  return status != null && ["trialing", "active", "past_due"].includes(status)
}
