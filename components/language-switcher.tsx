"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { LOCALES, getCurrentLocale, setLocale, type Locale } from "@/lib/i18n"

const FLAG: Record<Locale, string> = {
  en: "🇬🇧",
  es: "🇪🇸",
  fr: "🇫🇷",
  pt: "🇵🇹",
  de: "🇩🇪",
  it: "🇮🇹",
  zh: "🇨🇳",
  ja: "🇯🇵",
  ko: "🇰🇷",
}

const LABEL: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  pt: "Português",
  de: "Deutsch",
  it: "Italiano",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
}

/**
 * Lightweight language switcher backed by a cookie that the `useT` hook
 * reads on the client. URL prefix routing (`/en/...`, `/es/...`) is
 * documented in the i18n setup and can be enabled with a Next.js
 * middleware once translations are reviewed.
 */
export function LanguageSwitcher() {
  const [locale, setLocaleState] = useState<Locale>("en")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setLocaleState(getCurrentLocale())
  }, [])

  const pick = (l: Locale) => {
    setLocale(l)
    setLocaleState(l)
    setOpen(false)
    // Reload so server-rendered translations pick up immediately.
    if (typeof window !== "undefined") window.location.reload()
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-normal text-[#0d1b2a] hover:bg-[#f5f7fa] xl:text-[13px]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span aria-hidden>{FLAG[locale]}</span>
        <span>{locale.toUpperCase()}</span>
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-lg border border-[#d4dce8] bg-white shadow-lg"
        >
          {LOCALES.map((l) => (
            <li key={l}>
              <button
                type="button"
                onClick={() => pick(l)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#f5f7fa] ${
                  l === locale ? "text-[#009b70]" : "text-[#0d1b2a]"
                }`}
              >
                <span aria-hidden>{FLAG[l]}</span>
                <span>{LABEL[l]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
