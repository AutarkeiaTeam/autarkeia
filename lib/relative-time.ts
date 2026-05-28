import type { Locale } from "@/lib/i18n-core"

type RelativeUnit = Intl.RelativeTimeFormatUnit

export function formatRelativeTime(
  dateInput: string | number | Date,
  locale: Locale,
  nowInput: string | number | Date = new Date()
): string {
  const date = new Date(dateInput)
  const now = new Date(nowInput)
  const diffMs = date.getTime() - now.getTime()
  const diffSeconds = Math.round(diffMs / 1000)
  const absSeconds = Math.abs(diffSeconds)

  let value: number
  let unit: RelativeUnit

  if (absSeconds < 60) {
    value = diffSeconds
    unit = "second"
  } else if (absSeconds < 60 * 60) {
    value = Math.round(diffSeconds / 60)
    unit = "minute"
  } else if (absSeconds < 60 * 60 * 24) {
    value = Math.round(diffSeconds / (60 * 60))
    unit = "hour"
  } else if (absSeconds < 60 * 60 * 24 * 7) {
    value = Math.round(diffSeconds / (60 * 60 * 24))
    unit = "day"
  } else if (absSeconds < 60 * 60 * 24 * 30) {
    value = Math.round(diffSeconds / (60 * 60 * 24 * 7))
    unit = "week"
  } else if (absSeconds < 60 * 60 * 24 * 365) {
    value = Math.round(diffSeconds / (60 * 60 * 24 * 30))
    unit = "month"
  } else {
    value = Math.round(diffSeconds / (60 * 60 * 24 * 365))
    unit = "year"
  }

  const formatter = new Intl.RelativeTimeFormat(locale === "en" ? "en-GB" : locale, {
    numeric: "auto",
    style: "short",
  })
  return formatter.format(value, unit)
}
