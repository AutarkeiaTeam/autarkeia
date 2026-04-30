import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { QuizResults } from '@/components/quiz/quiz-results'

export const metadata = {
  title: 'Your Emergency Preparedness Score — Autarkeia',
  description: 'View your personalised emergency preparedness assessment results and action plan.',
}

export default function EmergencyPreparednessResultsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <QuizResults quizType="emergency-preparedness" />
        </div>
      </div>

      <Footer />
    </main>
  )
}
