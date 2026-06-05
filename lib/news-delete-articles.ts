import { createAdminClient } from "@/lib/supabase/admin"

export type DeleteNewsArticlesInput = {
  ids?: string[]
  titles?: string[]
}

export type DeleteNewsArticlesResult = {
  deleted_count: number
  deleted_titles: string[]
}

export async function deleteNewsArticles(
  input: DeleteNewsArticlesInput
): Promise<DeleteNewsArticlesResult> {
  const ids = input.ids?.map((id) => id.trim()).filter(Boolean) ?? []
  const titles = input.titles?.map((t) => t.trim()).filter(Boolean) ?? []

  if (ids.length === 0 && titles.length === 0) {
    throw new Error("Provide at least one id or title to delete.")
  }

  const admin = createAdminClient()
  const idsToDelete = new Set<string>()

  if (ids.length > 0) {
    const { data, error } = await admin
      .from("news_articles")
      .select("id")
      .in("id", ids)

    if (error) throw new Error(error.message)
    for (const row of data ?? []) idsToDelete.add(row.id)
  }

  for (const title of titles) {
    const { data, error } = await admin
      .from("news_articles")
      .select("id, title_en")
      .ilike("title_en", title)

    if (error) throw new Error(error.message)
    for (const row of data ?? []) idsToDelete.add(row.id)
  }

  if (idsToDelete.size === 0) {
    return { deleted_count: 0, deleted_titles: [] }
  }

  const idList = [...idsToDelete]
  const { data: targetRows, error: fetchError } = await admin
    .from("news_articles")
    .select("id, title_en")
    .in("id", idList)

  if (fetchError) throw new Error(fetchError.message)

  const { error: deleteError } = await admin
    .from("news_articles")
    .delete()
    .in("id", idList)

  if (deleteError) throw new Error(deleteError.message)

  const deleted_titles = (targetRows ?? [])
    .map((row) => row.title_en?.trim())
    .filter((title): title is string => Boolean(title))

  return {
    deleted_count: deleted_titles.length,
    deleted_titles,
  }
}
