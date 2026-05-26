import { isAdmin } from "@/lib/profiles"

/** Author or admin may edit/delete forum posts (and delete threads). */
export function canModerateForumContent(
  requesterId: string | null,
  authorId: string,
  requesterIsAdmin: boolean
): boolean {
  return !!requesterId && (requesterId === authorId || requesterIsAdmin)
}

/** @deprecated Use canModerateForumContent */
export const canDeleteForumContent = canModerateForumContent

export async function getForumDeleteAccess(requesterId: string | null): Promise<{
  requesterId: string | null
  isAdmin: boolean
}> {
  if (!requesterId) return { requesterId: null, isAdmin: false }
  const admin = await isAdmin(requesterId)
  return { requesterId, isAdmin: admin }
}
