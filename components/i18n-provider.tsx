"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import type { Locale } from "@/lib/i18n-core"

type I18nContextValue = {
  locale: Locale
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale
  messages: Record<string, string>
  children: ReactNode
}) {
  const t = useMemo(
    () => (key: string) => messages[key] ?? key,
    [messages]
  )
  const value = useMemo(() => ({ locale, t }), [locale, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return ctx
}
