import "server-only"

import type { User } from "@supabase/supabase-js"
import { sendWelcomeEmail } from "@/lib/resend"
import type { Locale } from "@/lib/i18n-core"
import { profileSignupFieldsFromUserMetadata } from "@/lib/profiles"
import { createAdminClient } from "@/lib/supabase/admin"

function hasEmailPasswordIdentity(user: User): boolean {
  return (user.identities ?? []).some((identity) => identity.provider === "email")
}

function resolveWelcomeDisplayName(
  displayName: string | null | undefined,
  user: User
): string | null {
  const trimmed = displayName?.trim()
  if (trimmed) return trimmed

  const { first_name } = profileSignupFieldsFromUserMetadata(user.user_metadata)
  return first_name?.trim() || null
}

/**
 * Sends the branded welcome email once per user when eligibility is met.
 * Never throws — logs errors only.
 */
export async function maybeSendWelcomeEmail(user: User, locale: Locale): Promise<void> {
  if (!user.email) return

  if (hasEmailPasswordIdentity(user) && !user.email_confirmed_at) {
    return
  }

  const admin = createAdminClient()

  try {
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("welcome_email_sent_at, display_name")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.error("[welcome-email] profile lookup failed:", profileError.message)
      return
    }

    if (!profile || profile.welcome_email_sent_at) {
      return
    }

    const displayName = resolveWelcomeDisplayName(profile.display_name, user)

    await sendWelcomeEmail(user.email, displayName, locale)

    const { error: updateError } = await admin
      .from("profiles")
      .update({
        welcome_email_sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .is("welcome_email_sent_at", null)

    if (updateError) {
      console.error("[welcome-email] failed to mark sent:", updateError.message)
    }
  } catch (err) {
    console.error(
      "[welcome-email] send failed:",
      err instanceof Error ? err.message : err
    )
  }
}
