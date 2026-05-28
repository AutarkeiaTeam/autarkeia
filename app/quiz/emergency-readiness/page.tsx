import type { Metadata } from 'next'
import { LocalizedQuizFlow } from '@/components/quiz/localized-quiz-flow'
import { getLocale } from '@/lib/i18n-server'
import { translate } from '@/lib/i18n-core'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: `${translate(locale, 'quiz.emergency-readiness.title')} — Autarkeia`,
    description: translate(locale, 'quiz.page.emergency.metadata_description'),
  }
}

export default function EmergencyReadinessQuizPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <LocalizedQuizFlow quizType="emergency-readiness" />
        </div>
      </div>
    </main>
  )
}
