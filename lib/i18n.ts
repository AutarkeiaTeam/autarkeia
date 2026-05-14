"use client"

import en from "@/locales/en.json"
import es from "@/locales/es.json"
import fr from "@/locales/fr.json"
import pt from "@/locales/pt.json"
import de from "@/locales/de.json"
import it from "@/locales/it.json"
import zh from "@/locales/zh.json"
import ja from "@/locales/ja.json"
import ko from "@/locales/ko.json"
import { useEffect, useState } from "react"

export const LOCALES = ["en", "es", "fr", "pt", "de", "it", "zh", "ja", "ko"] as const
export type Locale = (typeof LOCALES)[number]

const DICT: Record<Locale, Record<string, string>> = { en, es, fr, pt, de, it, zh, ja, ko }
const COOKIE = "autarkeia-locale"

function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "en"
  const lang = navigator.language.slice(0, 2).toLowerCase()
  return (LOCALES as readonly string[]).includes(lang) ? (lang as Locale) : "en"
}

export function getCurrentLocale(): Locale {
  if (typeof document === "undefined") return "en"
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${COOKIE}=`))
  const value = match?.split("=")[1] as Locale | undefined
  if (value && (LOCALES as readonly string[]).includes(value)) return value
  return detectBrowserLocale()
}

export function setLocale(locale: Locale) {
  if (typeof document === "undefined") return
  const maxAge = 60 * 60 * 24 * 365
  document.cookie = `${COOKIE}=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`
}

/**
 * Lookup a translation key. Falls back to English when the active locale
 * is missing the key. Locales beyond English/Spanish are currently
 * inheriting English copy and are marked for professional translation —
 * see the README in `/locales`.
 */
export function t(key: string, locale?: Locale): string {
  const active = locale ?? getCurrentLocale()
  return DICT[active]?.[key] ?? DICT.en[key] ?? key
}

export function useT(): { t: (key: string) => string; locale: Locale } {
  const [locale, setLocaleState] = useState<Locale>("en")
  useEffect(() => {
    setLocaleState(getCurrentLocale())
  }, [])
  return { t: (k: string) => t(k, locale), locale }
}
