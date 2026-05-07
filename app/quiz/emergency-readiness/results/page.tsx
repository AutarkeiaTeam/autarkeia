import { Footer } from '@/components/footer'
import { QuizResults } from '@/components/quiz/quiz-results'

export const metadata = {
  title: 'Your Emergency Readiness Score — Autarkeia',
  description: 'View your personalised emergency readiness assessment results and action plan.',
}

export default function EmergencyReadinessResultsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <QuizResults quizType="emergency-readiness" />
        </div>
      </div>

      <Footer />
    </main>
  )
}
