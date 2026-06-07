import type { QuizType } from "@/lib/quiz-data"
import { QUIZ_TYPE_LIST, type QuizResultSummary } from "@/lib/quiz-results-shared"

export function getScoreColor(score: number): string {
  if (score >= 70) return "#009b70"
  if (score >= 40) return "#f59e0b"
  return "#ef4444"
}

export type DashboardScoreSummary =
  | { status: "none" }
  | { status: "single"; score: number; quizType: QuizType }
  | { status: "both"; score: number }

export function computeDashboardScoreSummary(
  latest: Partial<Record<QuizType, QuizResultSummary>>
): DashboardScoreSummary {
  const taken = QUIZ_TYPE_LIST.map((quizType) => latest[quizType]).filter(
    (row): row is QuizResultSummary => Boolean(row)
  )
  if (taken.length === 0) return { status: "none" }
  if (taken.length === 1) {
    return { status: "single", score: taken[0].overall_score, quizType: taken[0].quiz_type }
  }
  const average = Math.round(
    taken.reduce((sum, row) => sum + row.overall_score, 0) / taken.length
  )
  return { status: "both", score: average }
}

export function pickMostRecentResult(
  latest: Partial<Record<QuizType, QuizResultSummary>>
): QuizResultSummary | null {
  return (
    QUIZ_TYPE_LIST.map((quizType) => latest[quizType])
      .filter((row): row is QuizResultSummary => Boolean(row))
      .sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())[0] ?? null
  )
}
