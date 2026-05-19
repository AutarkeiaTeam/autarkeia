import { getQuizConfig, type QuizType } from "@/lib/quiz-data"

/** Apply locale strings to quiz config; question/option IDs stay stable for scoring. */
export function getLocalizedQuizConfig(type: QuizType, t: (key: string) => string) {
  const config = getQuizConfig(type)
  return {
    ...config,
    title: t(`quiz.${type}.title`),
    description: t(`quiz.${type}.description`),
    categories: config.categories.map((c) => t(`quiz.category.${c}`)),
    questions: config.questions.map((q) => ({
      ...q,
      question: t(`quiz.${q.id}.question`),
      options: q.options.map((o) => ({
        ...o,
        label: t(`quiz.${q.id}.opt.${o.id}`),
      })),
    })),
  }
}
