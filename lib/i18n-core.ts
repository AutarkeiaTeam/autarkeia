import en from "@/locales/en.json"
import es from "@/locales/es.json"

export const LOCALES = ["en", "es"] as const
export type Locale = (typeof LOCALES)[number]

export const LOCALE_COOKIE = "autarkeia-locale"

const DICT: Record<Locale, Record<string, string>> = {
  en: en as Record<string, string>,
  es: es as Record<string, string>,
}

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value)
}

/** Merge active locale over English so missing keys fall back to English copy. */
export function getMessages(locale: Locale): Record<string, string> {
  return { ...DICT.en, ...DICT[locale] }
}

export function translate(locale: Locale, key: string): string {
  const fromLocale = DICT[locale]?.[key]
  if (fromLocale !== undefined && fromLocale !== "") return fromLocale
  return DICT.en[key] ?? key
}

export function parseAcceptLanguage(accept: string | null): Locale {
  if (!accept) return "en"
  for (const part of accept.split(",")) {
    const tag = part.trim().split(";")[0]?.trim()
    if (!tag) continue
    const primary = tag.split("-")[0]?.toLowerCase()
    if (primary && isLocale(primary)) return primary
  }
  return "en"
}
