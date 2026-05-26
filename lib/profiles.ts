import type { User } from "@supabase/supabase-js"
import { createAdminClient } from "@/lib/supabase/admin"
import { getStripe } from "@/lib/stripe"

export type ProfileAuthorFields = {
  id: string
  email: string | null
  display_name: string | null
}

/** Display name for forums: display_name, else email, else fallback. */
export function profileAuthorLabel(
  profile: Pick<ProfileAuthorFields, "email" | "display_name"> | null | undefined,
  fallback = "Member"
): string {
  const displayName = profile?.display_name?.trim()
  if (displayName) return displayName
  const email = profile?.email?.trim()
  if (email) return email
  return fallback
}

export async function fetchProfileAuthorLabels(
  userIds: string[]
): Promise<Map<string, string>> {
  const unique = [...new Set(userIds.filter(Boolean))]
  const map = new Map<string, string>()
  if (unique.length === 0) return map

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("profiles")
    .select("id, email, display_name")
    .in("id", unique)

  if (error) {
    console.error("fetchProfileAuthorLabels failed:", error.message)
    return map
  }

  for (const row of data ?? []) {
    map.set(row.id, profileAuthorLabel(row))
  }
  return map
}

export async function syncProfileEmail(user: User): Promise<void> {
  if (!user.email) return
  const admin = createAdminClient()
  await admin.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  )
}

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
      email: user.email,
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
