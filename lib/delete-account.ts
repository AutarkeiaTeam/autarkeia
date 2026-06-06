import { createAdminClient } from "@/lib/supabase/admin"
import { getStripe } from "@/lib/stripe"

/**
 * Permanently removes a user and associated data.
 *
 * - Stripe: active subscription cancelled before auth deletion.
 * - Forums: explicit cleanup (author_id is text, no FK to auth.users).
 * - profiles, community_interest, contact_messages: ON DELETE CASCADE from auth.users.
 */
export async function deleteUserAccount(userId: string): Promise<void> {
  const admin = createAdminClient()

  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_subscription_id")
    .eq("id", userId)
    .maybeSingle()

  const subscriptionId = profile?.stripe_subscription_id?.trim()
  if (subscriptionId) {
    try {
      const stripe = getStripe()
      await stripe.subscriptions.cancel(subscriptionId)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Stripe cancellation failed"
      throw new Error(message)
    }
  }

  // Forums use text author_id (no FK). community_interest and contact_messages
  // cascade when auth.users row is deleted (see 20250608130000_user_fk_cascade_on_delete.sql).
  const forumCleanup = await Promise.all([
    admin.from("forums_posts").delete().eq("author_id", userId),
    admin.from("forums_threads").delete().eq("author_id", userId),
  ])
  for (const result of forumCleanup) {
    if (result.error) {
      console.warn("forum cleanup during account delete:", result.error.message)
    }
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(userId)
  if (deleteError) {
    throw new Error(deleteError.message)
  }
}
