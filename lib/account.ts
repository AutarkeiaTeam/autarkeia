export function emailPrefix(email: string | null | undefined): string {
  if (!email) return ""
  const prefix = email.split("@")[0] ?? ""
  return prefix.slice(0, 50)
}

export function resolveDisplayName(
  displayName: string | null | undefined,
  email: string | null | undefined
): string {
  const trimmed = displayName?.trim()
  if (trimmed) return trimmed.slice(0, 50)
  return emailPrefix(email)
}
