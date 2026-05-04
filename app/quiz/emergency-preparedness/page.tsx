import { Footer } from '@/components/footer'
import { QuizFlow } from '@/components/quiz/quiz-flow'
import { getQuizConfig } from '@/lib/quiz-data'

export const metadata = {
  title: 'Emergency Preparedness Quiz — Autarkeia',
  description: 'Find out how prepared you are for unexpected disruptions with our 7-question assessment.',
}

export default function EmergencyPreparednessQuizPage() {
  const config = getQuizConfig('emergency-preparedness')

  return (
    <main className="min-h-screen flex flex-col">
      
      <div className="flex-1 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <QuizFlow 
            quizType="emergency-preparedness"
            title={config.title}
            questions={config.questions}
            accentColor={config.accentColor}
          />
        </div>
      </div>

      <Footer />
    </main>
  )
}
