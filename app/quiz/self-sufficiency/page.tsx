import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { QuizFlow } from '@/components/quiz/quiz-flow'
import { getQuizConfig } from '@/lib/quiz-data'

export const metadata = {
  title: 'Self-Sufficiency Quiz — Autarkeia',
  description: 'Discover how self-sufficient your household truly is with our 7-question assessment.',
}

export default function SelfSufficiencyQuizPage() {
  const config = getQuizConfig('self-sufficiency')

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <QuizFlow 
            quizType="self-sufficiency"
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
