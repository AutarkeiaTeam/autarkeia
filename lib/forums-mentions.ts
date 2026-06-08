import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import { USERNAME_REGEX } from "@/lib/username"
import { createAdminClient } from "@/lib/supabase/admin"
import { notifyForumMention } from "@/lib/notification-dispatch"
import type { Locale } from "@/lib/i18n-core"

export const MENTION_USERNAME_PATTERN = /[a-z0-9_]{3,30}/

export const MENTION_REGEX = /@([a-z0-9_]{3,30})/gi

export function extractMentionUsernames(content: string): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const match of content.matchAll(MENTION_REGEX)) {
    const username = match[1]?.toLowerCase()
    if (!username || !USERNAME_REGEX.test(username) || seen.has(username)) continue
    seen.add(username)
    result.push(username)
  }
  return result
}

export async function resolveMentionUserIds(
  usernames: string[]
): Promise<Map<string, string>> {
  const unique = [...new Set(usernames.map((u) => u.toLowerCase()))]
  const map = new Map<string, string>()
  if (unique.length === 0) return map

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("profiles")
    .select("id, username")
    .in("username", unique)

  if (error) {
    throw new Error(error.message)
  }

  for (const row of data ?? []) {
    const username = row.username?.trim().toLowerCase()
    if (username) map.set(username, row.id)
  }
  return map
}

export async function fetchMentionUsernamesForPosts(
  postIds: string[]
): Promise<Map<string, Set<string>>> {
  const unique = [...new Set(postIds.filter(Boolean))]
  const map = new Map<string, Set<string>>()
  if (unique.length === 0) return map

  const admin = createAdminClient()
  const { data: mentionRows, error: mentionError } = await admin
    .from("forums_mentions")
    .select("post_id, mentioned_user_id")
    .in("post_id", unique)

  if (mentionError) {
    console.error("fetchMentionUsernamesForPosts mentions failed:", mentionError.message)
    return map
  }

  const userIds = [...new Set((mentionRows ?? []).map((r) => r.mentioned_user_id))]
  if (userIds.length === 0) return map

  const { data: profiles, error: profileError } = await admin
    .from("profiles")
    .select("id, username")
    .in("id", userIds)

  if (profileError) {
    console.error("fetchMentionUsernamesForPosts profiles failed:", profileError.message)
    return map
  }

  const usernameById = new Map<string, string>()
  for (const row of profiles ?? []) {
    const username = row.username?.trim().toLowerCase()
    if (username) usernameById.set(row.id, username)
  }

  for (const row of mentionRows ?? []) {
    const username = usernameById.get(row.mentioned_user_id)
    if (!username) continue
    const set = map.get(row.post_id) ?? new Set<string>()
    set.add(username)
    map.set(row.post_id, set)
  }

  return map
}

async function fetchExistingMentionedUserIds(
  client: SupabaseClient,
  postId: string
): Promise<Set<string>> {
  const { data, error } = await client
    .from("forums_mentions")
    .select("mentioned_user_id")
    .eq("post_id", postId)

  if (error) throw new Error(error.message)
  return new Set((data ?? []).map((r) => r.mentioned_user_id))
}

export async function processPostMentions(params: {
  postId: string
  content: string
  authorId: string
  threadId: string
  threadTitle: string
  locale?: Locale
}): Promise<void> {
  const usernames = extractMentionUsernames(params.content)
  if (usernames.length === 0) return

  const resolved = await resolveMentionUserIds(usernames)
  if (resolved.size === 0) return

  const client = createAdminClient()
  const existing = await fetchExistingMentionedUserIds(client, params.postId)
  const newlyMentioned: string[] = []

  for (const [, userId] of resolved) {
    if (userId === params.authorId) continue

    const { error } = await client.from("forums_mentions").insert({
      post_id: params.postId,
      mentioned_user_id: userId,
    })

    if (error) {
      if (error.code === "23505") continue
      console.error("[processPostMentions] insert failed:", error.message)
      continue
    }

    if (!existing.has(userId)) {
      newlyMentioned.push(userId)
    }
  }

  if (newlyMentioned.length === 0) return

  const locale = params.locale ?? "en"
  const snippet = params.content.trim().slice(0, 100)

  for (const userId of newlyMentioned) {
    try {
      await notifyForumMention({
        userId,
        actorId: params.authorId,
        postId: params.postId,
        threadId: params.threadId,
        threadTitle: params.threadTitle,
        snippet,
        locale,
      })
    } catch (err) {
      console.error("[processPostMentions] notification failed for", userId, err)
    }
  }
}
