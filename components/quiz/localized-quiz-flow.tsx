"use client"

import { useI18n } from "@/components/i18n-provider"
import { getLocalizedQuizConfig } from "@/lib/quiz-i18n"
import type { QuizType } from "@/lib/quiz-data"
import { QuizFlow } from "./quiz-flow"

export function LocalizedQuizFlow({ quizType }: { quizType: QuizType }) {
  const { t } = useI18n()
  const config = getLocalizedQuizConfig(quizType, t)

  return (
    <QuizFlow
      quizType={quizType}
      title={config.title}
      questions={config.questions}
      accentColor={config.accentColor}
    />
  )
}
