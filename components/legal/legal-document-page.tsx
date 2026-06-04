"use client"

import Link from "next/link"
import { useI18n } from "@/components/i18n-provider"
import { LegalBody } from "@/components/legal/legal-body"
import {
  LEGAL_DOCUMENTS,
  sectionBodyKey,
  sectionTitleKey,
  type LegalDocId,
} from "@/lib/legal-documents"

type Props = {
  documentId: LegalDocId
}

function TermsRefundsSection() {
  const { t } = useI18n()
  const link = (
    <Link href="/refund-policy" className="text-[#009b70] hover:underline">
      {t("terms.section_refunds.link")}
    </Link>
  )

  return (
    <section className="mt-8">
      <h2 className="text-xl font-medium text-[#0d1b2a]">{t("terms.section_refunds.title")}</h2>
      <p className="my-3 text-[#3d5166] leading-relaxed">
        {t("terms.section_refunds.body_before")}
        {link}
        {t("terms.section_refunds.body_middle")}
        {link}
        {t("terms.section_refunds.body_after")}
      </p>
    </section>
  )
}

function RefundQuestionsSection() {
  const { t } = useI18n()

  return (
    <section className="mt-8">
      <h2 className="text-xl font-medium text-[#0d1b2a]">{t("refund_policy.section_questions.title")}</h2>
      <LegalBody text={t("refund_policy.section_questions.body")} />
      <p className="my-3 text-[#3d5166] leading-relaxed">
        {t("refund_policy.section_questions.terms_before")}
        <Link href="/terms-of-service" className="text-[#009b70] hover:underline">
          {t("refund_policy.section_questions.terms_link")}
        </Link>
        {t("refund_policy.section_questions.terms_after")}
      </p>
    </section>
  )
}

export function LegalDocumentPage({ documentId }: Props) {
  const { t } = useI18n()
  const doc = LEGAL_DOCUMENTS[documentId]

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
        <h1 className="text-3xl font-light text-[#0d1b2a]">{t(doc.titleKey)}</h1>
        <p className="mt-2 text-sm text-[#8a9bb0]">{t(doc.effectiveKey)}</p>
        {doc.lastUpdatedKey && (
          <p className="text-sm text-[#8a9bb0]">{t(doc.lastUpdatedKey)}</p>
        )}
        {doc.versionKey && (
          <p className="text-sm text-[#8a9bb0]">{t(doc.versionKey)}</p>
        )}
        {doc.controllerKey && (
          <p className="mt-4 text-sm text-[#3d5166]">{t(doc.controllerKey)}</p>
        )}
        {doc.introKey && (
          <div className="mt-6">
            <LegalBody text={t(doc.introKey)} />
          </div>
        )}

        {doc.sections.map((sectionId) => {
          if (documentId === "terms" && sectionId === "refunds") {
            return <TermsRefundsSection key={sectionId} />
          }
          if (documentId === "refund_policy" && sectionId === "questions") {
            return <RefundQuestionsSection key={sectionId} />
          }

          const titleKey = sectionTitleKey(documentId, sectionId)
          const bodyKey = sectionBodyKey(documentId, sectionId)

          return (
            <section key={sectionId} className="mt-8">
              <h2 className="text-xl font-medium text-[#0d1b2a]">{t(titleKey)}</h2>
              <LegalBody text={t(bodyKey)} />
            </section>
          )
        })}
      </div>
    </main>
  )
}
