import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

/**
 * Forums data store. Two backends are wired:
 *
 *   1. Supabase (preferred for production)
 *   2. A JSON file at `.data/forums.json` (used when Supabase env vars
 *      are not configured)
 *
 * The exported helpers normalise both into the same shapes so route
 * handlers can stay unchanged when you flip env vars.
 *
 * Supabase schema (matches the JSON shape; create via SQL or migration):
 *
 *   table forums_categories (
 *     id          text primary key,
 *     name        text not null,
 *     description text
 *   );
 *
 *   table forums_threads (
 *     id          uuid primary key default gen_random_uuid(),
 *     title       text not null,
 *     description text,
 *     author_id   text not null,
 *     category    text not null references forums_categories(id),
 *     created_at  timestamptz not null default now(),
 *     updated_at  timestamptz not null default now(),
 *     deleted_at  timestamptz
 *   );
 *
 *   table forums_posts (
 *     id          uuid primary key default gen_random_uuid(),
 *     thread_id   uuid not null references forums_threads(id) on delete cascade,
 *     author_id   text not null,
 *     content     text not null,
 *     created_at  timestamptz not null default now(),
 *     updated_at  timestamptz not null default now(),
 *     deleted_at  timestamptz
 *   );
 */

export type ForumCategory = { id: string; name: string; description: string }
export type ForumThread = {
  id: string
  title: string
  description: string
  author_id: string
  category: string
  created_at: string
  updated_at: string
}
export type ForumPost = {
  id: string
  thread_id: string
  author_id: string
  content: string
  created_at: string
  updated_at: string
}

export const CATEGORIES: ForumCategory[] = [
  { id: "housing-land", name: "Housing & Land", description: "Natural building, plots, and homestead infrastructure." },
  { id: "food-systems", name: "Food Systems", description: "Growing, livestock, preservation, and food security." },
  { id: "energy-water", name: "Energy & Water", description: "Solar, wind, micro-hydro, rainwater, and storage." },
  { id: "governance", name: "Governance", description: "Decision-making, agreements, and community structure." },
  { id: "general", name: "General", description: "Everything else — introductions, regional notes, off-topic." },
]

const DATA_DIR = path.join(process.cwd(), ".data")
const DATA_FILE = path.join(DATA_DIR, "forums.json")

type Store = { threads: ForumThread[]; posts: ForumPost[] }

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

export async function listThreads(category?: string): Promise<ForumThread[]> {
  if (supabaseConfigured()) {
    const query = category
      ? `forums_threads?select=*&category=eq.${category}&order=updated_at.desc`
      : `forums_threads?select=*&order=updated_at.desc`
    return supabaseFetch<ForumThread[]>(query)
  }
  const store = await readStore()
  const threads = category ? store.threads.filter((t) => t.category === category) : store.threads
  return [...threads].sort((a, b) => b.updated_at.localeCompare(a.updated_at))
}

export async function getThread(id: string): Promise<{ thread: ForumThread; posts: ForumPost[] } | null> {
  if (supabaseConfigured()) {
    const threads = await supabaseFetch<ForumThread[]>(`forums_threads?id=eq.${id}&select=*`)
    if (!threads[0]) return null
    const posts = await supabaseFetch<ForumPost[]>(
      `forums_posts?thread_id=eq.${id}&select=*&order=created_at.asc`
    )
    return { thread: threads[0], posts }
  }
  const store = await readStore()
  const thread = store.threads.find((t) => t.id === id)
  if (!thread) return null
  const posts = store.posts
    .filter((p) => p.thread_id === id)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
  return { thread, posts }
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
  const thread: ForumThread = {
    id,
    title: input.title.trim().slice(0, 200),
    description: input.description.trim().slice(0, 500),
    category: input.category,
    author_id: input.author_id,
    created_at: now,
    updated_at: now,
  }
  const firstPost: ForumPost = {
    id: randomUUID(),
    thread_id: id,
    author_id: input.author_id,
    content: input.body.trim(),
    created_at: now,
    updated_at: now,
  }
  if (supabaseConfigured()) {
    await supabaseFetch<unknown>("forums_threads", { method: "POST", body: JSON.stringify(thread) })
    await supabaseFetch<unknown>("forums_posts", { method: "POST", body: JSON.stringify(firstPost) })
    return thread
  }
  const store = await readStore()
  store.threads.push(thread)
  store.posts.push(firstPost)
  await writeStore(store)
  return thread
}

export async function addPost(threadId: string, authorId: string, content: string): Promise<ForumPost> {
  const now = new Date().toISOString()
  const post: ForumPost = {
    id: randomUUID(),
    thread_id: threadId,
    author_id: authorId,
    content: content.trim(),
    created_at: now,
    updated_at: now,
  }
  if (supabaseConfigured()) {
    await supabaseFetch<unknown>("forums_posts", { method: "POST", body: JSON.stringify(post) })
    await supabaseFetch<unknown>(`forums_threads?id=eq.${threadId}`, {
      method: "PATCH",
      body: JSON.stringify({ updated_at: now }),
    })
    return post
  }
  const store = await readStore()
  store.posts.push(post)
  const t = store.threads.find((x) => x.id === threadId)
  if (t) t.updated_at = now
  await writeStore(store)
  return post
}

export async function deleteThread(threadId: string, authorId: string): Promise<boolean> {
  if (supabaseConfigured()) {
    await supabaseFetch<unknown>(`forums_threads?id=eq.${threadId}&author_id=eq.${authorId}`, {
      method: "DELETE",
    })
    return true
  }
  const store = await readStore()
  const before = store.threads.length
  store.threads = store.threads.filter((t) => !(t.id === threadId && t.author_id === authorId))
  store.posts = store.posts.filter((p) => p.thread_id !== threadId)
  await writeStore(store)
  return store.threads.length < before
}

export async function deletePost(postId: string, authorId: string): Promise<boolean> {
  if (supabaseConfigured()) {
    await supabaseFetch<unknown>(`forums_posts?id=eq.${postId}&author_id=eq.${authorId}`, {
      method: "DELETE",
    })
    return true
  }
  const store = await readStore()
  const before = store.posts.length
  store.posts = store.posts.filter((p) => !(p.id === postId && p.author_id === authorId))
  await writeStore(store)
  return store.posts.length < before
}
