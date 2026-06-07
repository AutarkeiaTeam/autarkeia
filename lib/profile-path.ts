export function profilePath(username: string): string {
  return `/profile/${username.trim().toLowerCase()}`
}
