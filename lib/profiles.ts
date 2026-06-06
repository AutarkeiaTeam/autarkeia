import type { User } from "@supabase/supabase-js"
import { createAdminClient } from "@/lib/supabase/admin"
import { getStripe } from "@/lib/stripe"
import { ensureProfileUsername } from "@/lib/username"

export type ProfileAuthorFields = {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  display_name: string | null
}

export type ProfileSignupFields = {
  first_name?: string | null
  last_name?: string | null
  age?: number | null
  location?: string | null
}

/** True when profiles.is_admin is set (service role read). */
export async function isAdmin(userId: string): Promise<boolean> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle()

  if (error) {
    console.error("isAdmin lookup failed:", error.message)
    return false
  }

  return data?.is_admin === true
}

/** Display name for forums: "First Last", display_name, email, or fallback. */
export function profileAuthorLabel(
  profile: Pick<ProfileAuthorFields, "first_name" | "last_name" | "email" | "display_name"> | null | undefined,
  fallback = "Member"
): string {
  const first = profile?.first_name?.trim()
  const last = profile?.last_name?.trim()
  if (first && last) return `${first} ${last}`

  const displayName = profile?.display_name?.trim()
  if (displayName) return displayName

  const email = profile?.email?.trim()
  if (email) return email

  return fallback
}

export function parseNameFromUserMetadata(
  metadata: Record<string, unknown> | undefined
): { first_name: string | null; last_name: string | null } {
  if (!metadata) return { first_name: null, last_name: null }

  const directFirst =
    typeof metadata.first_name === "string" ? metadata.first_name.trim() : ""
  const directLast = typeof metadata.last_name === "string" ? metadata.last_name.trim() : ""
  if (directFirst || directLast) {
    return {
      first_name: directFirst || null,
      last_name: directLast || null,
    }
  }

  const given = typeof metadata.given_name === "string" ? metadata.given_name.trim() : ""
  const family = typeof metadata.family_name === "string" ? metadata.family_name.trim() : ""
  if (given || family) {
    return {
      first_name: given || null,
      last_name: family || null,
    }
  }

  const full =
    (typeof metadata.full_name === "string" ? metadata.full_name.trim() : "") ||
    (typeof metadata.name === "string" ? metadata.name.trim() : "")

  if (!full) return { first_name: null, last_name: null }

  const space = full.indexOf(" ")
  if (space === -1) return { first_name: full, last_name: null }

  return {
    first_name: full.slice(0, space),
    last_name: full.slice(space + 1).trim() || null,
  }
}

export function profileSignupFieldsFromUserMetadata(
  metadata: Record<string, unknown> | undefined
): ProfileSignupFields {
  const { first_name, last_name } = parseNameFromUserMetadata(metadata)

  let age: number | null = null
  const rawAge = metadata?.age
  if (typeof rawAge === "number" && Number.isFinite(rawAge) && rawAge >= 0) {
    age = Math.floor(rawAge)
  } else if (typeof rawAge === "string" && /^[0-9]+$/.test(rawAge.trim())) {
    age = parseInt(rawAge.trim(), 10)
  }

  const location =
    typeof metadata?.location === "string" && metadata.location.trim()
      ? metadata.location.trim()
      : null

  return { first_name, last_name, age, location }
}

export async function upsertProfileFromAuthUser(user: User): Promise<void> {
  const admin = createAdminClient()
  const metaFields = profileSignupFieldsFromUserMetadata(user.user_metadata)

  const row = {
    id: user.id,
    email: user.email ?? null,
    ...metaFields,
    updated_at: new Date().toISOString(),
  }

  const { error } = await admin.from("profiles").upsert(row, { onConflict: "id" })

  if (error) {
    throw new Error(error.message)
  }

  try {
    await ensureProfileUsername(user.id, user.email ?? null)
  } catch (usernameError) {
    console.error("ensureProfileUsername failed:", usernameError)
  }
}

/** @deprecated Use upsertProfileFromAuthUser */
export async function syncProfileEmail(user: User): Promise<void> {
  return upsertProfileFromAuthUser(user)
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
    .select("id, email, first_name, last_name, display_name")
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

  const metaFields = profileSignupFieldsFromUserMetadata(user.user_metadata)

  const { error } = await admin.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      ...metaFields,
      stripe_customer_id: customer.id,
      subscription_status: "free",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  )

  if (error) {
    throw new Error(error.message)
  }

  try {
    await ensureProfileUsername(user.id, user.email)
  } catch (usernameError) {
    console.error("ensureProfileUsername failed:", usernameError)
  }

  return customer.id
}
