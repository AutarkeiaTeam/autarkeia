/** Client-safe forum types and category list (no Node.js APIs). */

export type ForumCategory = { id: string }

export type ForumAuthorDisplay = {
  author_name: string
  author_username: string | null
  author_avatar_url: string | null
}

export type ForumThread = {
  id: string
  title: string
  description: string
  author_id: string
  category: string
  created_at: string
  updated_at: string
  pinned: boolean
  locked: boolean
  pinned_at: string | null
  locked_at: string | null
} & ForumAuthorDisplay

export type ForumPost = {
  id: string
  thread_id: string
  author_id: string
  content: string
  created_at: string
  updated_at: string
} & ForumAuthorDisplay

export const CATEGORIES: ForumCategory[] = [
  { id: "housing-land" },
  { id: "food-systems" },
  { id: "energy-water" },
  { id: "governance" },
  { id: "general" },
]

export const FORUM_CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id))

export function isForumCategoryId(id: string): boolean {
  return FORUM_CATEGORY_IDS.has(id)
}

export const FORUM_REACTION_EMOJIS = ["👍", "❤️", "🙏", "💡", "🔥"] as const

export type ForumReactionEmoji = (typeof FORUM_REACTION_EMOJIS)[number]

export type ForumSortMode = "recent" | "newest" | "popular"

export type PostReactionsData = {
  counts: Partial<Record<ForumReactionEmoji, number>>
  userEmojis: ForumReactionEmoji[]
}

export type ForumThreadListItem = ForumThread & {
  reply_count: number
  is_unread: boolean
}

export function isForumReactionEmoji(value: string): value is ForumReactionEmoji {
  return (FORUM_REACTION_EMOJIS as readonly string[]).includes(value)
}

export function parseForumSortMode(value: string | null | undefined): ForumSortMode {
  if (value === "newest" || value === "popular") return value
  return "recent"
}

export function emptyPostReactions(): PostReactionsData {
  return { counts: {}, userEmojis: [] }
}
