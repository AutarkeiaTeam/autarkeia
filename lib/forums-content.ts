/** Client-safe helpers for forum post content rendering. */

export function preprocessVerifiedMentions(
  content: string,
  verifiedUsernames: ReadonlySet<string>
): string {
  return content.replace(/@([a-z0-9_]{3,30})/gi, (match, rawUsername: string) => {
    const username = rawUsername.toLowerCase()
    if (verifiedUsernames.has(username)) {
      return `[@${rawUsername}](/profile/${username})`
    }
    return match
  })
}
