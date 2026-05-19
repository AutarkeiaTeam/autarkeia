"use client"

import Link from "next/link"
import { Leaf, Shield, ArrowRight } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"

export default function QuizSelectorPage() {
  const { t } = useI18n()

  return (
    <main className="min-h-screen flex flex-col">
      <motion className="flex-1 bg-white py-16 sm:py-24">
        <motion className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-light tracking-tight text-[#0d1b2a] sm:text-4xl lg:text-5xl text-balance">
              {t("quiz.selector.title")}
            </h1>
            <p className="mt-4 text-lg font-light text-[#3d5166] max-w-2xl mx-auto">
              {t("quiz.selector.sub")}
            </p>
          </motion>

          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/quiz/self-sufficiency"
              className="group relative rounded-2xl border border-[#d4dce8] bg-white p-8 transition-all hover:border-[#009b70] hover:shadow-lg"
              style={{ borderWidth: "0.5px" }}
            >
              <motion
                className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl"
                style={{ backgroundColor: "rgba(0, 155, 112, 0.1)" }}
              >
                <Leaf className="h-7 w-7 text-[#009b70]" />
              </motion>
              <h2 className="text-xl font-medium text-[#0d1b2a] mb-3">
                {t("quiz.self-sufficiency.card_title")}
              </h2>
              <p className="text-[#3d5166] font-light mb-6 leading-relaxed">
                {t("quiz.self-sufficiency.card_desc")}
              </p>
              <motion className="flex items-center gap-2 text-[#009b70] font-medium">
                <span>{t("quiz.start")}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion>
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-[#009b70] opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>

            <Link
              href="/quiz/emergency-readiness"
              className="group relative rounded-2xl border border-[#d4dce8] bg-white p-8 transition-all hover:border-[#5c4a2a] hover:shadow-lg"
              style={{ borderWidth: "0.5px" }}
            >
              <motion
                className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl"
                style={{ backgroundColor: "rgba(92, 74, 42, 0.1)" }}
              >
                <Shield className="h-7 w-7 text-[#5c4a2a]" />
              </motion>
              <h2 className="text-xl font-medium text-[#0d1b2a] mb-3">
                {t("quiz.emergency-readiness.card_title")}
              </h2>
              <p className="text-[#3d5166] font-light mb-6 leading-relaxed">
                {t("quiz.emergency-readiness.card_desc")}
              </p>
              <motion className="flex items-center gap-2 text-[#5c4a2a] font-medium">
                <span>{t("quiz.start")}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion>
              <motion className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-[#5c4a2a] opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#8a9bb0] font-light">
              {t("quiz.take_both_prefix")}{" "}
              <Link href="/quiz/self-sufficiency" className="text-[#009b70] hover:underline">
                {t("quiz.take_both_link")}
              </Link>{" "}
              {t("quiz.take_both_suffix")}
            </p>
          </div>
        </motion>
      </motion>
    </main>
  )
}
