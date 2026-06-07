import type { QuizType } from "@/lib/quiz-data"
import type { ScoreLevel } from "@/lib/quiz-scoring"

export const QUIZ_TYPE_LIST: QuizType[] = ["emergency-readiness", "self-sufficiency"]

export type QuizResultSummary = {
  quiz_type: QuizType
  overall_score: number
  category_scores: Record<string, number>
  verdict_level: ScoreLevel
  taken_at: string
}

export function toQuizResultSummary(row: {
  quiz_type: QuizType
  overall_score: number
  category_scores: Record<string, number>
  verdict_level: ScoreLevel
  taken_at: string
}): QuizResultSummary {
  return {
    quiz_type: row.quiz_type,
    overall_score: row.overall_score,
    category_scores: row.category_scores,
    verdict_level: row.verdict_level,
    taken_at: row.taken_at,
  }
}
