import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { QuizAnswers, QuizType } from "@/lib/quiz-data"
import {
  type QuizResultSummary,
  toQuizResultSummary,
} from "@/lib/quiz-results-shared"
import type { QuizScoringResult, ScoreLevel } from "@/lib/quiz-scoring"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export type QuizResultRow = {
  id: string
  user_id: string
  quiz_type: QuizType
  overall_score: number
  category_scores: Record<string, number>
  answers: QuizAnswers
  verdict_level: ScoreLevel
  taken_at: string
}

type QuizResultDbRow = {
  id: string
  user_id: string
  quiz_type: string
  overall_score: number
  category_scores: Record<string, number> | null
  answers: QuizAnswers | null
  verdict_level: string
  taken_at: string
}

function mapQuizResultRow(row: QuizResultDbRow): QuizResultRow {
  return {
    id: row.id,
    user_id: row.user_id,
    quiz_type: row.quiz_type as QuizType,
    overall_score: row.overall_score,
    category_scores: row.category_scores ?? {},
    answers: row.answers ?? {},
    verdict_level: row.verdict_level as ScoreLevel,
    taken_at: row.taken_at,
  }
}

function latestPerQuizType(rows: QuizResultRow[]): Partial<Record<QuizType, QuizResultRow>> {
  const latest: Partial<Record<QuizType, QuizResultRow>> = {}
  for (const row of rows) {
    if (!latest[row.quiz_type]) {
      latest[row.quiz_type] = row
    }
  }
  return latest
}

export async function persistQuizResult(
  supabase: SupabaseClient,
  userId: string,
  quizType: QuizType,
  answers: QuizAnswers,
  scoring: QuizScoringResult
): Promise<void> {
  const { error } = await supabase.from("quiz_results").insert({
    user_id: userId,
    quiz_type: quizType,
    overall_score: scoring.overall_score,
    category_scores: scoring.category_scores,
    answers,
    verdict_level: scoring.score_label,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function fetchQuizResultsForUser(userId: string): Promise<QuizResultRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("quiz_results")
    .select("id, user_id, quiz_type, overall_score, category_scores, answers, verdict_level, taken_at")
    .eq("user_id", userId)
    .order("taken_at", { ascending: false })

  if (error) {
    console.error("fetchQuizResultsForUser failed:", error.message)
    return []
  }

  return (data ?? []).map((row) => mapQuizResultRow(row as QuizResultDbRow))
}

export async function fetchLatestQuizResultsForUser(
  userId: string
): Promise<Partial<Record<QuizType, QuizResultRow>>> {
  const rows = await fetchQuizResultsForUser(userId)
  return latestPerQuizType(rows)
}

export async function fetchLatestQuizSummariesForUser(
  userId: string
): Promise<Partial<Record<QuizType, QuizResultSummary>>> {
  const latest = await fetchLatestQuizResultsForUser(userId)
  const summaries: Partial<Record<QuizType, QuizResultSummary>> = {}
  for (const [quizType, row] of Object.entries(latest)) {
    if (row) summaries[quizType as QuizType] = toQuizResultSummary(row)
  }
  return summaries
}

export async function fetchQuizResultHistorySummaries(
  userId: string
): Promise<QuizResultSummary[]> {
  const rows = await fetchQuizResultsForUser(userId)
  return rows.map(toQuizResultSummary)
}

export async function fetchPublicProfileQuizScores(
  userId: string
): Promise<Partial<Record<QuizType, QuizResultSummary>>> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("quiz_results")
    .select("id, user_id, quiz_type, overall_score, category_scores, answers, verdict_level, taken_at")
    .eq("user_id", userId)
    .order("taken_at", { ascending: false })

  if (error) {
    console.error("fetchPublicProfileQuizScores failed:", error.message)
    return {}
  }

  const latest = latestPerQuizType((data ?? []).map((row) => mapQuizResultRow(row as QuizResultDbRow)))
  const summaries: Partial<Record<QuizType, QuizResultSummary>> = {}
  for (const [quizType, row] of Object.entries(latest)) {
    if (row) summaries[quizType as QuizType] = toQuizResultSummary(row)
  }
  return summaries
}
