export function initialsFromDisplayName(
  displayName: string,
  username?: string
): string {
  const trimmed = displayName.trim()
  if (!trimmed || trimmed.startsWith("@")) {
    const handle = username?.trim()
    return handle ? handle.slice(0, 2).toUpperCase() : "??"
  }

  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
  }

  return trimmed.slice(0, 2).toUpperCase()
}
