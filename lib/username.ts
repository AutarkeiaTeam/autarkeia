import { createAdminClient } from "@/lib/supabase/admin"

export const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/

export function sanitizeUsernameInput(value: string): string {
  return value.trim().toLowerCase()
}

export function isValidUsername(value: string): boolean {
  return USERNAME_REGEX.test(value)
}

export function baseUsernameFromEmail(email: string): string {
  const prefix = email.split("@")[0] ?? ""
  const sanitized = prefix.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 30)
  if (sanitized.length >= 3) return sanitized
  return "user"
}

function randomFourDigits(): string {
  return String(Math.floor(1000 + Math.random() * 9000))
}

export async function isUsernameTaken(
  username: string,
  excludeUserId?: string
): Promise<boolean> {
  const admin = createAdminClient()
  let query = admin.from("profiles").select("id").ilike("username", username).limit(1)

  if (excludeUserId) {
    query = query.neq("id", excludeUserId)
  }

  const { data, error } = await query

  if (error) {
    console.error("isUsernameTaken lookup failed:", error.message)
    throw new Error(error.message)
  }

  return (data?.length ?? 0) > 0
}

export async function generateAvailableUsername(
  email: string,
  userId: string
): Promise<string> {
  const base = baseUsernameFromEmail(email)
  const candidates: string[] = [base]

  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = randomFourDigits()
    const trimmedBase = base.slice(0, Math.max(3, 30 - 1 - suffix.length))
    candidates.push(`${trimmedBase}_${suffix}`)
  }

  const uuidSuffix = userId.replace(/-/g, "").slice(0, 10)
  candidates.push(`${base.slice(0, Math.max(3, 30 - 1 - uuidSuffix.length))}_${uuidSuffix}`)

  for (const candidate of candidates) {
    const normalized = candidate.slice(0, 30)
    if (!isValidUsername(normalized)) continue
    if (!(await isUsernameTaken(normalized, userId))) {
      return normalized
    }
  }

  const fallback = `user_${uuidSuffix}`.slice(0, 30)
  return isValidUsername(fallback) ? fallback : `user_${userId.replace(/-/g, "").slice(0, 25)}`
}

export async function ensureProfileUsername(userId: string, email: string | null): Promise<void> {
  const admin = createAdminClient()
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle()

  if (profileError) {
    throw new Error(profileError.message)
  }

  if (profile?.username) return

  const sourceEmail = email?.trim()
  if (!sourceEmail) return

  const username = await generateAvailableUsername(sourceEmail, userId)
  const { error: updateError } = await admin
    .from("profiles")
    .update({ username, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .is("username", null)

  if (updateError) {
    throw new Error(updateError.message)
  }
}
