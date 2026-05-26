/** True when updated_at is meaningfully later than created_at (edited after publish). */
export function postWasEdited(createdAt: string, updatedAt: string, thresholdMs = 5000): boolean {
  const created = new Date(createdAt).getTime()
  const updated = new Date(updatedAt).getTime()
  if (Number.isNaN(created) || Number.isNaN(updated)) return false
  return updated - created > thresholdMs
}
