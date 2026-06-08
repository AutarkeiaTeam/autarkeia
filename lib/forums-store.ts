import "server-only"

import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"
import { fetchProfileAuthorInfo } from "@/lib/profiles"
import {
  fetchReplyCounts,
  fetchReactionsForPosts,
  fetchThreadViews,
  isThreadUnread,
  sortThreads,
} from "@/lib/forums-engagement"
import {
  CATEGORIES,
  type ForumCategory,
  type ForumPost,
  type ForumSortMode,
  type ForumThread,
  type ForumThreadListItem,
  type PostReactionsData,
} from "@/lib/forums-shared"

export type { ForumCategory, ForumThread, ForumPost } from "@/lib/forums-shared"
export { CATEGORIES } from "@/lib/forums-shared"

/**
 * Forums data store. Two backends are wired:
 *
 *   1. Supabase (preferred for production) — see
 *      supabase/migrations/20250615120000_forums_schema_rls.sql
 *   2. A JSON file at `.data/forums.json` (used when Supabase env vars
 *      are not configured)
 *
 * Categories are code constants in lib/forums-shared.ts (no DB table).
 */

type ForumAuthorFields = Pick<
  ForumThread,
  "author_name" | "author_username" | "author_avatar_url"
>

type ForumThreadRow = Omit<ForumThread, keyof ForumAuthorFields>
type ForumPostRow = Omit<ForumPost, keyof ForumAuthorFields>

function authorFieldsForUser(
  authorId: string,
  authors: Awaited<ReturnType<typeof fetchProfileAuthorInfo>>
): ForumAuthorFields {
  const author = authors.get(authorId)
  if (!author) {
    return {
      author_name: "forums.member_fallback",
      author_username: null,
      author_avatar_url: null,
    }
  }
  return {
    author_name: author.label,
    author_username: author.username,
    author_avatar_url: author.avatar_url,
  }
}

async function enrichThreads(threads: ForumThreadRow[]): Promise<ForumThread[]> {
  const authors = await fetchProfileAuthorInfo(threads.map((t) => t.author_id))
  return threads.map((t) => ({
    ...t,
    ...authorFieldsForUser(t.author_id, authors),
  }))
}

async function enrichPosts(posts: ForumPostRow[]): Promise<ForumPost[]> {
  const authors = await fetchProfileAuthorInfo(posts.map((p) => p.author_id))
  return posts.map((p) => ({
    ...p,
    ...authorFieldsForUser(p.author_id, authors),
  }))
}

const DATA_DIR = path.join(process.cwd(), ".data")
const DATA_FILE = path.join(DATA_DIR, "forums.json")

type Store = { threads: ForumThreadRow[]; posts: ForumPostRow[] }

async function ensureFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const seed: Store = { threads: [], posts: [] }
    await fs.writeFile(DATA_FILE, JSON.stringify(seed, null, 2))
  }
}

async function readStore(): Promise<Store> {
  await ensureFile()
  const raw = await fs.readFile(DATA_FILE, "utf8")
  try {
    return JSON.parse(raw) as Store
  } catch {
    return { threads: [], posts: [] }
  }
}

async function writeStore(store: Store): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2))
}

function supabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

async function supabaseFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${path}`
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
  return res.json() as Promise<T>
}

export async function listCategories(): Promise<ForumCategory[]> {
  return CATEGORIES
}

export async function listThreads(options?: {
  category?: string
  sort?: ForumSortMode
  viewerId?: string | null
}): Promise<ForumThreadListItem[]> {
  const category = options?.category
  const sort = options?.sort ?? "recent"
  const viewerId = options?.viewerId ?? null

  let rows: ForumThreadRow[]
  if (supabaseConfigured()) {
    const query = category
      ? `forums_threads?select=*&category=eq.${category}`
      : `forums_threads?select=*`
    rows = await supabaseFetch<ForumThreadRow[]>(query)
  } else {
    const store = await readStore()
    rows = category ? store.threads.filter((t) => t.category === category) : [...store.threads]
  }

  const threadIds = rows.map((t) => t.id)
  const [enriched, replyCounts, views] = await Promise.all([
    enrichThreads(rows),
    fetchReplyCounts(threadIds),
    viewerId ? fetchThreadViews(viewerId, threadIds) : Promise.resolve(new Map<string, string>()),
  ])

  const sorted = sortThreads(enriched, sort, replyCounts)
  return sorted.map((thread) => ({
    ...thread,
    reply_count: replyCounts.get(thread.id) ?? 0,
    is_unread: isThreadUnread({
      thread,
      viewerId,
      lastViewedAt: views.get(thread.id),
    }),
  }))
}

export async function getThread(
  id: string,
  viewerId?: string | null
): Promise<{
  thread: ForumThread
  posts: ForumPost[]
  reactionsByPostId: Map<string, PostReactionsData>
} | null> {
  if (supabaseConfigured()) {
    const threads = await supabaseFetch<ForumThreadRow[]>(`forums_threads?id=eq.${id}&select=*`)
    if (!threads[0]) return null
    const postRows = await supabaseFetch<ForumPostRow[]>(
      `forums_posts?thread_id=eq.${id}&select=*&order=created_at.asc`
    )
    const [thread] = await enrichThreads([threads[0]])
    const posts = await enrichPosts(postRows)
    const reactionsByPostId = await fetchReactionsForPosts(
      posts.map((p) => p.id),
      viewerId
    )
    return { thread, posts, reactionsByPostId }
  }
  const store = await readStore()
  const thread = store.threads.find((t) => t.id === id)
  if (!thread) return null
  const posts = store.posts
    .filter((p) => p.thread_id === id)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
  const [enrichedThread] = await enrichThreads([thread])
  const enrichedPosts = await enrichPosts(posts)
  const reactionsByPostId = await fetchReactionsForPosts(
    enrichedPosts.map((p) => p.id),
    viewerId
  )
  return { thread: enrichedThread, posts: enrichedPosts, reactionsByPostId }
}

export async function createThread(input: {
  title: string
  description: string
  category: string
  author_id: string
  body: string
}): Promise<ForumThread> {
  const now = new Date().toISOString()
  const id = randomUUID()
  const threadRow: ForumThreadRow = {
    id,
    title: input.title.trim().slice(0, 200),
    description: input.description.trim().slice(0, 500),
    category: input.category,
    author_id: input.author_id,
    created_at: now,
    updated_at: now,
  }
  const firstPostRow: ForumPostRow = {
    id: randomUUID(),
    thread_id: id,
    author_id: input.author_id,
    content: input.body.trim(),
    created_at: now,
    updated_at: now,
  }
  if (supabaseConfigured()) {
    await supabaseFetch<unknown>("forums_threads", { method: "POST", body: JSON.stringify(threadRow) })
    await supabaseFetch<unknown>("forums_posts", { method: "POST", body: JSON.stringify(firstPostRow) })
    const [thread] = await enrichThreads([threadRow])
    return thread
  }
  const store = await readStore()
  const [thread] = await enrichThreads([threadRow])
  const [firstPost] = await enrichPosts([firstPostRow])
  store.threads.push(thread)
  store.posts.push(firstPost)
  await writeStore(store)
  return thread
}

export async function addPost(threadId: string, authorId: string, content: string): Promise<ForumPost> {
  const now = new Date().toISOString()
  const postRow: ForumPostRow = {
    id: randomUUID(),
    thread_id: threadId,
    author_id: authorId,
    content: content.trim(),
    created_at: now,
    updated_at: now,
  }
  if (supabaseConfigured()) {
    await supabaseFetch<unknown>("forums_posts", { method: "POST", body: JSON.stringify(postRow) })
    await supabaseFetch<unknown>(`forums_threads?id=eq.${threadId}`, {
      method: "PATCH",
      body: JSON.stringify({ updated_at: now }),
    })
    const [post] = await enrichPosts([postRow])
    return post
  }
  const store = await readStore()
  const [post] = await enrichPosts([postRow])
  store.posts.push(post)
  const t = store.threads.find((x) => x.id === threadId)
  if (t) t.updated_at = now
  await writeStore(store)
  return post
}

export async function getPost(postId: string): Promise<ForumPostRow | null> {
  if (supabaseConfigured()) {
    const rows = await supabaseFetch<ForumPostRow[]>(`forums_posts?id=eq.${postId}&select=*`)
    return rows[0] ?? null
  }
  const store = await readStore()
  return store.posts.find((p) => p.id === postId) ?? null
}

export async function deleteThread(
  threadId: string,
  requesterId: string,
  asAdmin = false
): Promise<boolean> {
  if (supabaseConfigured()) {
    const filter = asAdmin
      ? `forums_threads?id=eq.${threadId}`
      : `forums_threads?id=eq.${threadId}&author_id=eq.${requesterId}`
    const rows = await supabaseFetch<ForumThreadRow[]>(filter, { method: "DELETE" })
    return rows.length > 0
  }
  const store = await readStore()
  const before = store.threads.length
  store.threads = store.threads.filter(
    (t) => !(t.id === threadId && (asAdmin || t.author_id === requesterId))
  )
  store.posts = store.posts.filter((p) => p.thread_id !== threadId)
  await writeStore(store)
  return store.threads.length < before
}

export async function updatePost(
  postId: string,
  content: string,
  requesterId: string,
  asAdmin = false
): Promise<ForumPost | null> {
  const trimmed = content.trim()
  if (trimmed.length < 2) return null

  const now = new Date().toISOString()

  if (supabaseConfigured()) {
    const filter = asAdmin
      ? `forums_posts?id=eq.${postId}`
      : `forums_posts?id=eq.${postId}&author_id=eq.${requesterId}`
    const rows = await supabaseFetch<ForumPostRow[]>(filter, {
      method: "PATCH",
      body: JSON.stringify({ content: trimmed, updated_at: now }),
    })
    if (!rows[0]) return null
    await supabaseFetch<unknown>(`forums_threads?id=eq.${rows[0].thread_id}`, {
      method: "PATCH",
      body: JSON.stringify({ updated_at: now }),
    })
    const [post] = await enrichPosts([rows[0]])
    return post
  }

  const store = await readStore()
  const index = store.posts.findIndex(
    (p) => p.id === postId && (asAdmin || p.author_id === requesterId)
  )
  if (index === -1) return null

  store.posts[index] = {
    ...store.posts[index],
    content: trimmed,
    updated_at: now,
  }
  const thread = store.threads.find((t) => t.id === store.posts[index].thread_id)
  if (thread) thread.updated_at = now
  await writeStore(store)
  const [post] = await enrichPosts([store.posts[index]])
  return post
}

export async function deletePost(
  postId: string,
  requesterId: string,
  asAdmin = false
): Promise<boolean> {
  if (supabaseConfigured()) {
    const filter = asAdmin
      ? `forums_posts?id=eq.${postId}`
      : `forums_posts?id=eq.${postId}&author_id=eq.${requesterId}`
    const rows = await supabaseFetch<ForumPostRow[]>(filter, { method: "DELETE" })
    return rows.length > 0
  }
  const store = await readStore()
  const before = store.posts.length
  store.posts = store.posts.filter(
    (p) => !(p.id === postId && (asAdmin || p.author_id === requesterId))
  )
  await writeStore(store)
  return store.posts.length < before
}
