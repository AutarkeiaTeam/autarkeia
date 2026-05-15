"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { LOCALES, setLocale, type Locale } from "@/lib/i18n-client"
import { useI18n } from "@/components/i18n-provider"

const FLAG: Record<Locale, string> = {
  en: "🇬🇧",
  es: "🇪🇸",
}

const LABEL: Record<Locale, string> = {
  en: "English",
  es: "Español",
}

export function LanguageSwitcher() {
  const { locale } = useI18n()
  const [open, setOpen] = useState(false)

  const pick = (l: Locale) => {
    setLocale(l)
    setOpen(false)
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
