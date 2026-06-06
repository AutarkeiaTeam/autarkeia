import type { QuizAnswers, QuizType } from "@/lib/quiz-data"
import { getQuizConfig } from "@/lib/quiz-data"

type CategoryScores = Record<string, number>
type CategoryPoints = Record<string, number>
type OptionWeights = Record<string, CategoryPoints>
type QuestionWeights = Record<string, OptionWeights>
type QuizWeights = Record<QuizType, QuestionWeights>

const SCORING_WEIGHTS: QuizWeights = {
  "self-sufficiency": {
    // Capability-only scoring questions
    "ss-q2": {
      none: { Food: 0 },
      small: { Food: 1 },
      meaningful: { Food: 2 },
      significant: { Food: 3 },
    },
    "ss-q3": {
      mains: { Water: 0 },
      stored: { Water: 1 },
      rainwater: { Water: 2 },
      multiple: { Water: 3 },
    },
    "ss-q4": {
      grid: { Energy: 0 },
      backup: { Energy: 1 },
      partial: { Energy: 2 },
      offgrid: { Energy: 3 },
    },
    "ss-q5": {
      renting: { Shelter: 0 },
      owning: { Shelter: 1 },
      modified: { Shelter: 2 },
      selfbuilt: { Shelter: 3 },
    },
    "ss-q6": {
      gardening: { Skills: 1, Food: 1 },
      preserving: { Skills: 1, Food: 1 },
      plumbing: { Skills: 1, Water: 1 },
      electrical: { Skills: 1, Energy: 1 },
      carpentry: { Skills: 1, Shelter: 1 },
      firstaid: { Skills: 1 },
      none: {},
    },
  },
  "emergency-readiness": {
    // Capability-only scoring questions
    "ep-q3": {
      none: { Water: 0 },
      few: { Water: 1 },
      week: { Water: 2 },
      weeks: { Water: 3 },
    },
    "ep-q4": {
      "less-3": { Food: 0 },
      "3-7": { Food: 1 },
      "1-4-weeks": { Food: 2 },
      month: { Food: 3 },
    },
    "ep-q5": {
      none: { Medical: 0 },
      basic: { Medical: 1 },
      full: { Medical: 2 },
      trained: { Medical: 3 },
    },
    "ep-q6": {
      torches: { Power: 1 },
      powerbank: { Power: 1 },
      generator: { Power: 2 },
      radio: { Communication: 1 },
      walkie: { Communication: 2 },
      plan: { Communication: 1 },
      none: {},
    },
  },
}

export type ScoreLevel = "beginner" | "intermediate" | "advanced" | "expert"

export type QuizScoringResult = {
  overall_score: number
  category_scores: CategoryScores
  score_label: ScoreLevel
}

function emptyScores(categories: string[]): CategoryScores {
  return Object.fromEntries(categories.map((category) => [category, 0]))
}

function computeMaxPossible(quizType: QuizType, categories: string[]): CategoryScores {
  const perQuestion = SCORING_WEIGHTS[quizType]
  const questions = getQuizConfig(quizType).questions
  const maxes = emptyScores(categories)

  for (const question of questions) {
    const optionsById = perQuestion[question.id]
    if (!optionsById) continue

    if (question.type === "single") {
      const bestPerCategory = emptyScores(categories)
      for (const points of Object.values(optionsById)) {
        for (const [category, value] of Object.entries(points)) {
          bestPerCategory[category] = Math.max(bestPerCategory[category] ?? 0, value)
        }
      }
      for (const category of categories) {
        maxes[category] += bestPerCategory[category] ?? 0
      }
      continue
    }

    // Multi-select: max assumes selecting all non-"none" positive options.
    for (const option of question.options) {
      if (option.isNoneOption) continue
      const points = optionsById[option.id]
      if (!points) continue
      for (const [category, value] of Object.entries(points)) {
        if (value > 0) {
          maxes[category] += value
        }
      }
    }
  }

  return maxes
}

function applyOptionScores(scores: CategoryScores, points: CategoryPoints | undefined): void {
  if (!points) return
  for (const [category, value] of Object.entries(points)) {
    scores[category] = (scores[category] ?? 0) + value
  }
}

export function scoreLevelFromOverall(overall: number): ScoreLevel {
  if (overall < 30) return "beginner"
  if (overall < 50) return "intermediate"
  if (overall < 70) return "advanced"
  return "expert"
}

export function scoreQuiz(quizType: QuizType, answers: QuizAnswers): QuizScoringResult {
  const config = getQuizConfig(quizType)
  const categories = config.categories
  const earned = emptyScores(categories)
  const weights = SCORING_WEIGHTS[quizType]
  const maxPossible = computeMaxPossible(quizType, categories)

  for (const [questionId, selected] of Object.entries(answers)) {
    const questionWeights = weights[questionId]
    if (!questionWeights) continue

    if (Array.isArray(selected)) {
      for (const optionId of selected) {
        applyOptionScores(earned, questionWeights[optionId])
      }
      continue
    }

    if (typeof selected === "string") {
      applyOptionScores(earned, questionWeights[selected])
    }
  }

  const category_scores = Object.fromEntries(
    categories.map((category) => {
      const max = maxPossible[category] ?? 0
      const value = max <= 0 ? 0 : Math.round(((earned[category] ?? 0) / max) * 100)
      return [category, Math.max(0, Math.min(100, value))]
    })
  )

  const overall_score = Math.round(
    categories.reduce((sum, category) => sum + (category_scores[category] ?? 0), 0) / categories.length
  )

  return {
    overall_score,
    category_scores,
    score_label: scoreLevelFromOverall(overall_score),
  }
}
