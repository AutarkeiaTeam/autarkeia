import type { User } from "@supabase/supabase-js"
import { createAdminClient } from "@/lib/supabase/admin"
import { getStripe } from "@/lib/stripe"

export async function getOrCreateStripeCustomer(user: User): Promise<string> {
  if (!user.email) {
    throw new Error("A verified email is required before checkout")
  }

  const admin = createAdminClient()
  const { data: existing } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle()

  if (existing?.stripe_customer_id) {
    return existing.stripe_customer_id
  }

  const stripe = getStripe()
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { supabase_user_id: user.id },
  })

  const { error } = await admin.from("profiles").upsert(
    {
      id: user.id,
      stripe_customer_id: customer.id,
      subscription_status: "free",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  )

  if (error) {
    throw new Error(error.message)
  }

  return customer.id
}
