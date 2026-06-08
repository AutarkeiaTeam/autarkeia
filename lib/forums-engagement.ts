import "server-only"

import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"
import {
  emptyPostReactions,
  FORUM_REACTION_EMOJIS,
  isForumReactionEmoji,
  type ForumReactionEmoji,
  type ForumSortMode,
  type ForumThread,
  type PostReactionsData,
} from "@/lib/forums-shared"

type ReactionRow = {
  id: string
  post_id: string
  user_id: string
  emoji: string
  created_at: string
}

type ThreadViewRow = {
  user_id: string
  thread_id: string
  last_viewed_at: string
}

const DATA_DIR = path.join(process.cwd(), ".data")
const DATA_FILE = path.join(DATA_DIR, "forums.json")

type EngagementStore = {
  reactions?: ReactionRow[]
  thread_views?: ThreadViewRow[]
}

function supabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

async function supabaseFetch<T>(apiPath: string, init: RequestInit = {}): Promise<T> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${apiPath}`
  const res = await fetch(url, {
    ...init,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Supabase ${res.status}: ${body}`)
  }
  if (res.status === 204) return [] as T
  return res.json() as Promise<T>
}

async function readEngagementStore(): Promise<Required<EngagementStore>> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(raw) as EngagementStore
    return {
      reactions: parsed.reactions ?? [],
      thread_views: parsed.thread_views ?? [],
    }
  } catch {
    return { reactions: [], thread_views: [] }
  }
}

async function writeEngagementStore(partial: Required<EngagementStore>): Promise<void> {
  let base: Record<string, unknown> = {}
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8")
    base = JSON.parse(raw) as Record<string, unknown>
  } catch {
    base = { threads: [], posts: [] }
  }
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(
    DATA_FILE,
    JSON.stringify({ ...base, reactions: partial.reactions, thread_views: partial.thread_views }, null, 2)
  )
}

function buildReactionsMap(
  rows: { post_id: string; emoji: string; user_id: string }[],
  viewerId: string | null | undefined
): Map<string, PostReactionsData> {
  const map = new Map<string, PostReactionsData>()
  for (const row of rows) {
    if (!isForumReactionEmoji(row.emoji)) continue
    const existing = map.get(row.post_id) ?? emptyPostReactions()
    existing.counts[row.emoji] = (existing.counts[row.emoji] ?? 0) + 1
    if (viewerId && row.user_id === viewerId && !existing.userEmojis.includes(row.emoji)) {
      existing.userEmojis.push(row.emoji)
    }
    map.set(row.post_id, existing)
  }
  return map
}

export async function fetchReactionsForPosts(
  postIds: string[],
  viewerId?: string | null
): Promise<Map<string, PostReactionsData>> {
  const unique = [...new Set(postIds.filter(Boolean))]
  if (unique.length === 0) return new Map()

  if (supabaseConfigured()) {
    const inFilter = `(${unique.join(",")})`
    const rows = await supabaseFetch<{ post_id: string; emoji: string; user_id: string }[]>(
      `forums_reactions?select=post_id,emoji,user_id&post_id=in.${inFilter}`
    )
    return buildReactionsMap(rows, viewerId)
  }

  const store = await readEngagementStore()
  const rows = store.reactions.filter((r) => unique.includes(r.post_id))
  return buildReactionsMap(rows, viewerId)
}

export type TogglePostReactionResult = {
  reactions: PostReactionsData
  added: boolean
}

export async function togglePostReaction(
  postId: string,
  userId: string,
  emoji: ForumReactionEmoji
): Promise<TogglePostReactionResult> {
  if (!isForumReactionEmoji(emoji)) {
    throw new Error("forums.error.invalid_reaction")
  }

  if (supabaseConfigured()) {
    const emojiFilter = encodeURIComponent(emoji)
    const existing = await supabaseFetch<{ id: string }[]>(
      `forums_reactions?post_id=eq.${postId}&user_id=eq.${userId}&emoji=eq.${emojiFilter}&select=id`
    )
    let added = false
    if (existing[0]) {
      await supabaseFetch<unknown>(
        `forums_reactions?post_id=eq.${postId}&user_id=eq.${userId}&emoji=eq.${emojiFilter}`,
        { method: "DELETE", headers: { Prefer: "return=minimal" } }
      )
    } else {
      await supabaseFetch<unknown>("forums_reactions", {
        method: "POST",
        body: JSON.stringify({ post_id: postId, user_id: userId, emoji }),
      })
      added = true
    }
    const map = await fetchReactionsForPosts([postId], userId)
    return { reactions: map.get(postId) ?? emptyPostReactions(), added }
  }

  const store = await readEngagementStore()
  const index = store.reactions.findIndex(
    (r) => r.post_id === postId && r.user_id === userId && r.emoji === emoji
  )
  let added = false
  if (index >= 0) {
    store.reactions.splice(index, 1)
  } else {
    store.reactions.push({
      id: randomUUID(),
      post_id: postId,
      user_id: userId,
      emoji,
      created_at: new Date().toISOString(),
    })
    added = true
  }
  await writeEngagementStore(store)
  const map = buildReactionsMap(
    store.reactions.filter((r) => r.post_id === postId),
    userId
  )
  return { reactions: map.get(postId) ?? emptyPostReactions(), added }
}

export async function fetchReplyCounts(threadIds: string[]): Promise<Map<string, number>> {
  const unique = [...new Set(threadIds.filter(Boolean))]
  const counts = new Map<string, number>()
  if (unique.length === 0) return counts

  if (supabaseConfigured()) {
    const inFilter = `(${unique.join(",")})`
    const rows = await supabaseFetch<{ thread_id: string }[]>(
      `forums_posts?select=thread_id&thread_id=in.${inFilter}`
    )
    const totals = new Map<string, number>()
    for (const row of rows) {
      totals.set(row.thread_id, (totals.get(row.thread_id) ?? 0) + 1)
    }
    for (const threadId of unique) {
      const total = totals.get(threadId) ?? 0
      counts.set(threadId, Math.max(0, total - 1))
    }
    return counts
  }

  try {
    const raw = await fs.readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(raw) as { posts?: { thread_id: string }[] }
    const totals = new Map<string, number>()
    for (const post of parsed.posts ?? []) {
      if (!unique.includes(post.thread_id)) continue
      totals.set(post.thread_id, (totals.get(post.thread_id) ?? 0) + 1)
    }
    for (const threadId of unique) {
      const total = totals.get(threadId) ?? 0
      counts.set(threadId, Math.max(0, total - 1))
    }
  } catch {
    for (const threadId of unique) counts.set(threadId, 0)
  }
  return counts
}

export async function fetchThreadViews(
  userId: string,
  threadIds: string[]
): Promise<Map<string, string>> {
  const unique = [...new Set(threadIds.filter(Boolean))]
  const map = new Map<string, string>()
  if (!userId || unique.length === 0) return map

  if (supabaseConfigured()) {
    const inFilter = `(${unique.join(",")})`
    const rows = await supabaseFetch<ThreadViewRow[]>(
      `forums_thread_views?user_id=eq.${userId}&thread_id=in.${inFilter}&select=thread_id,last_viewed_at`
    )
    for (const row of rows) map.set(row.thread_id, row.last_viewed_at)
    return map
  }

  const store = await readEngagementStore()
  for (const row of store.thread_views) {
    if (row.user_id === userId && unique.includes(row.thread_id)) {
      map.set(row.thread_id, row.last_viewed_at)
    }
  }
  return map
}

export function isThreadUnread(options: {
  thread: Pick<ForumThread, "id" | "author_id" | "updated_at">
  viewerId: string | null | undefined
  lastViewedAt: string | null | undefined
}): boolean {
  const { thread, viewerId, lastViewedAt } = options
  if (!viewerId || viewerId === thread.author_id) return false
  if (!lastViewedAt) return true
  return new Date(thread.updated_at).getTime() > new Date(lastViewedAt).getTime()
}

export async function recordThreadView(userId: string, threadId: string): Promise<void> {
  if (!userId || !threadId) return
  const now = new Date().toISOString()

  if (supabaseConfigured()) {
    const updated = await supabaseFetch<ThreadViewRow[]>(
      `forums_thread_views?user_id=eq.${userId}&thread_id=eq.${threadId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ last_viewed_at: now }),
      }
    )
    if (!updated.length) {
      await supabaseFetch<unknown>("forums_thread_views", {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          thread_id: threadId,
          last_viewed_at: now,
        }),
      })
    }
    return
  }

  const store = await readEngagementStore()
  const index = store.thread_views.findIndex(
    (v) => v.user_id === userId && v.thread_id === threadId
  )
  if (index >= 0) {
    store.thread_views[index] = { ...store.thread_views[index], last_viewed_at: now }
  } else {
    store.thread_views.push({ user_id: userId, thread_id: threadId, last_viewed_at: now })
  }
  await writeEngagementStore(store)
}

export function sortThreads<T extends ForumThread>(
  threads: T[],
  sort: ForumSortMode,
  replyCounts: Map<string, number>
): T[] {
  const sorted = [...threads]
  if (sort === "newest") {
    sorted.sort((a, b) => b.created_at.localeCompare(a.created_at))
    return sorted
  }
  if (sort === "popular") {
    sorted.sort((a, b) => {
      const diff = (replyCounts.get(b.id) ?? 0) - (replyCounts.get(a.id) ?? 0)
      if (diff !== 0) return diff
      return b.updated_at.localeCompare(a.updated_at)
    })
    return sorted
  }
  sorted.sort((a, b) => b.updated_at.localeCompare(a.updated_at))
  return sorted
}

export { FORUM_REACTION_EMOJIS }
