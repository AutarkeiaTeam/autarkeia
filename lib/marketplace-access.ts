import { getProAccess } from "@/lib/subscription"

/** Marketplace is Pro-only; uses the same Stripe subscription check as library and dashboard. */
export async function getMarketplaceAccess(): Promise<boolean> {
  return getProAccess()
}
