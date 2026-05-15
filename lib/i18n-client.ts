"use client"

import { LOCALES, LOCALE_COOKIE, isLocale, type Locale } from "@/lib/i18n-core"

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  const raw = match?.[1]?.trim()
  if (!raw) return undefined
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

export function getClientLocale(): Locale {
  const fromCookie = readCookie(LOCALE_COOKIE)
  if (isLocale(fromCookie)) return fromCookie
  if (typeof navigator === "undefined") return "en"
  const lang = navigator.language.slice(0, 2).toLowerCase()
  return isLocale(lang) ? lang : "en"
}

export function setLocale(locale: Locale) {
  if (typeof document === "undefined") return
  const maxAge = 60 * 60 * 24 * 365
  document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(locale)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export { LOCALES, type Locale }
