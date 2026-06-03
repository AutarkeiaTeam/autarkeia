const LOCALE_MAP: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
}

export function formatNewsRelativeTime(locale: string, iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""

  const intlLocale = LOCALE_MAP[locale] ?? locale
  const rtf = new Intl.RelativeTimeFormat(intlLocale, { numeric: "auto" })
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000)
  const abs = Math.abs(diffSec)

  if (abs < 60) return rtf.format(diffSec, "second")
  const diffMin = Math.round(diffSec / 60)
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute")
  const diffHr = Math.round(diffMin / 60)
  if (Math.abs(diffHr) < 24) return rtf.format(diffHr, "hour")
  const diffDay = Math.round(diffHr / 24)
  if (Math.abs(diffDay) < 30) return rtf.format(diffDay, "day")
  const diffMonth = Math.round(diffDay / 30)
  if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, "month")
  const diffYear = Math.round(diffMonth / 12)
  return rtf.format(diffYear, "year")
}
