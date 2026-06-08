export function formatRelativeTime(iso: string, locale: string): string {
  const date = new Date(iso)
  const now = Date.now()
  const diffSec = Math.round((date.getTime() - now) / 1000)
  const abs = Math.abs(diffSec)
  const rtf = new Intl.RelativeTimeFormat(locale === "es" ? "es" : "en", { numeric: "auto" })

  if (abs < 60) return rtf.format(diffSec, "second")
  const diffMin = Math.round(diffSec / 60)
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute")
  const diffHour = Math.round(diffMin / 60)
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, "hour")
  const diffDay = Math.round(diffHour / 24)
  if (Math.abs(diffDay) < 30) return rtf.format(diffDay, "day")
  const diffMonth = Math.round(diffDay / 30)
  if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, "month")
  const diffYear = Math.round(diffMonth / 12)
  return rtf.format(diffYear, "year")
}
