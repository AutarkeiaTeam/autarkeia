export type LegalDocId = "terms" | "refund_policy" | "privacy"

export type LegalSectionId = string

export type LegalDocumentConfig = {
  id: LegalDocId
  titleKey: string
  metaTitleKey: string
  metaDescriptionKey: string
  effectiveKey: string
  lastUpdatedKey?: string
  versionKey?: string
  introKey?: string
  controllerKey?: string
  sections: LegalSectionId[]
}

export const TERMS_SECTIONS = [
  "acceptance",
  "service",
  "accounts",
  "subscription",
  "cancellation",
  "refunds",
  "affiliates",
  "conduct",
  "ip",
  "disclaimers",
  "liability",
  "termination",
  "modifications",
  "governing_law",
  "disputes",
  "contact",
] as const

export const REFUND_POLICY_SECTIONS = [
  "guarantee",
  "after_14_days",
  "annual",
  "how_to_request",
  "goodwill",
  "questions",
] as const

export const PRIVACY_SECTIONS = [
  "collect",
  "use",
  "share",
  "transfers",
  "cookies",
  "retention",
  "rights",
  "children",
  "changes",
  "contact",
] as const

export const LEGAL_DOCUMENTS: Record<LegalDocId, LegalDocumentConfig> = {
  terms: {
    id: "terms",
    titleKey: "terms.title",
    metaTitleKey: "terms.meta_title",
    metaDescriptionKey: "terms.meta_description",
    effectiveKey: "terms.effective",
    introKey: "terms.intro",
    sections: [...TERMS_SECTIONS],
  },
  refund_policy: {
    id: "refund_policy",
    titleKey: "refund_policy.title",
    metaTitleKey: "refund_policy.meta_title",
    metaDescriptionKey: "refund_policy.meta_description",
    effectiveKey: "refund_policy.effective",
    lastUpdatedKey: "refund_policy.last_updated",
    introKey: "refund_policy.intro",
    sections: [...REFUND_POLICY_SECTIONS],
  },
  privacy: {
    id: "privacy",
    titleKey: "privacy.title",
    metaTitleKey: "privacy.meta_title",
    metaDescriptionKey: "privacy.meta_description",
    effectiveKey: "privacy.effective",
    versionKey: "privacy.version",
    introKey: "privacy.intro",
    controllerKey: "privacy.controller",
    sections: [...PRIVACY_SECTIONS],
  },
}

export function sectionTitleKey(doc: LegalDocId, section: LegalSectionId): string {
  return `${doc}.section_${section}.title`
}

export function sectionBodyKey(doc: LegalDocId, section: LegalSectionId): string {
  return `${doc}.section_${section}.body`
}
