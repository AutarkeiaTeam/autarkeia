import { isAdmin } from "@/lib/profiles"

export function canDeleteForumContent(
  requesterId: string | null,
  authorId: string,
  requesterIsAdmin: boolean
): boolean {
  return !!requesterId && (requesterId === authorId || requesterIsAdmin)
}

export async function getForumDeleteAccess(requesterId: string | null): Promise<{
  requesterId: string | null
  isAdmin: boolean
}> {
  if (!requesterId) return { requesterId: null, isAdmin: false }
  const admin = await isAdmin(requesterId)
  return { requesterId, isAdmin: admin }
}
