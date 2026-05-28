import { QuizResults } from '@/components/quiz/quiz-results'
import type { Metadata } from 'next'
import { getLocale } from '@/lib/i18n-server'
import { translate } from '@/lib/i18n-core'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: `${translate(locale, 'quiz.results.meta_title_prefix')} ${translate(locale, 'quiz.self-sufficiency.title')} — Autarkeia`,
    description: translate(locale, 'quiz.results.meta_description'),
  }
}

export default function SelfSufficiencyResultsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <QuizResults quizType="self-sufficiency" />
        </div>
      </div>
    </main>
  )
}
