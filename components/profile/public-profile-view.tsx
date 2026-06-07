"use client"

import Image from "next/image"
import { UserAvatar } from "@/components/user-avatar"
import { useI18n } from "@/components/i18n-provider"
import type { QuizType } from "@/lib/quiz-data"
import { QUIZ_TYPE_LIST, type QuizResultSummary } from "@/lib/quiz-results-shared"

type PublicProfileViewProps = {
  username: string
  displayName: string
  memberSinceLabel: string
  isPro: boolean
  country: string | null
  showQuizScoresSection: boolean
  quizScores: Partial<Record<QuizType, QuizResultSummary>> | null
  bio: string | null
  avatarUrl: string | null
  initials: string
  isPrivate: boolean
}

function formatRelativeTaken(takenAt: string, locale: "en" | "es"): string {
  const diffMs = Date.now() - new Date(takenAt).getTime()
  const rtf = new Intl.RelativeTimeFormat(locale === "es" ? "es" : "en", { numeric: "auto" })
  const diffSec = Math.round(diffMs / 1000)
  if (Math.abs(diffSec) < 60) return rtf.format(-diffSec, "second")
  const diffMin = Math.round(diffSec / 60)
  if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, "minute")
  const diffHour = Math.round(diffMin / 60)
  if (Math.abs(diffHour) < 24) return rtf.format(-diffHour, "hour")
  const diffDay = Math.round(diffHour / 24)
  if (Math.abs(diffDay) < 30) return rtf.format(-diffDay, "day")
  const diffMonth = Math.round(diffDay / 30)
  return rtf.format(-diffMonth, "month")
}

export function PublicProfileView({
  username,
  displayName,
  memberSinceLabel,
  isPro,
  country,
  showQuizScoresSection,
  quizScores,
  initials,
  isPrivate,
}: PublicProfileViewProps) {
  const { t, locale } = useI18n()

  if (isPrivate) {
    return (
      <main className="min-h-screen bg-[#f5f7fa]">
        <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center lg:px-8">
          <Image
            src="/icon.png"
            alt=""
            width={72}
            height={72}
            className="h-[72px] w-[72px] object-contain"
            aria-hidden
          />
          <p className="mt-6 text-lg font-medium text-[#0d1b2a]">{t("profile.private.heading")}</p>
          <p className="mt-2 text-sm text-[#3d5166]">{t("profile.private.body")}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-2xl px-4 py-12 lg:px-8">
        <section
          className="rounded-2xl border border-[#d4dce8] bg-white p-6 sm:p-8"
          style={{ borderWidth: "0.5px" }}
        >
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
            <UserAvatar src={avatarUrl} fallbackInitials={initials} size={80} />
            <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-1">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-light text-[#0d1b2a]">{displayName}</h1>
                {isPro ? (
                  <span className="rounded-full bg-[#e8f8f3] px-2.5 py-0.5 text-xs font-medium text-[#009b70]">
                    {t("profile.badge.pro")}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-[#8a9bb0]">@{username}</p>
              <p className="mt-3 text-sm text-[#3d5166]">
                {t("profile.member_since").replace("{date}", memberSinceLabel)}
              </p>
              {country ? (
                <p className="mt-1 text-sm text-[#3d5166]">
                  {t("profile.country").replace("{country}", country)}
                </p>
              ) : null}
              {bio ? (
                <p className="mt-3 whitespace-pre-wrap text-sm text-[#3d5166]">{bio}</p>
              ) : null}
            </div>
          </div>

          {showQuizScoresSection ? (
            <div className="mt-8 border-t border-[#e8edf2] pt-8" style={{ borderTopWidth: "0.5px" }}>
              <h2 className="text-lg font-medium text-[#0d1b2a]">{t("profile.quiz_scores.heading")}</h2>
              <div className="mt-4 space-y-4">
                {QUIZ_TYPE_LIST.map((quizType) => {
                  const result = quizScores?.[quizType]
                  return (
                    <div
                      key={quizType}
                      className={`rounded-xl border border-[#e8edf2] p-4 ${result ? "bg-white" : "bg-[#fafbfc] opacity-80"}`}
                      style={{ borderWidth: "0.5px" }}
                    >
                      <p className="text-sm font-medium text-[#0d1b2a]">{t(`quiz.${quizType}.title`)}</p>
                      {result ? (
                        <>
                          <p className="mt-2 text-4xl font-light text-[#009b70]">{result.overall_score}%</p>
                          <p className="mt-1 text-sm text-[#3d5166]">
                            {t(`quiz.${quizType}.verdict.${result.verdict_level}`)}
                          </p>
                          <p className="mt-2 text-xs text-[#8a9bb0]">
                            {t("profile.quiz_scores.last_taken").replace(
                              "{when}",
                              formatRelativeTaken(result.taken_at, locale)
                            )}
                          </p>
                        </>
                      ) : (
                        <p className="mt-2 text-sm text-[#8a9bb0]">{t("profile.quiz_scores.not_taken")}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col items-center gap-3 sm:items-start">
            <button
              type="button"
              disabled
              title={t("profile.send_message.tooltip")}
              className="cursor-not-allowed rounded-lg border border-[#d4dce8] bg-[#f9fafc] px-5 py-2.5 text-sm font-medium text-[#8a9bb0]"
            >
              {t("profile.send_message.button")}
            </button>
            <a
              href={`mailto:hello@autarkeia.world?subject=${encodeURIComponent(`Profile report - ${username}`)}`}
              className="text-xs text-[#c5ced8] hover:text-[#8a9bb0]"
            >
              {t("profile.report")}
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}
