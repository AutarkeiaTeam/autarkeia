import { cookies, headers } from "next/headers"
import { isLocale, parseAcceptLanguage, type Locale, LOCALE_COOKIE } from "@/lib/i18n-core"

/**
 * Active locale for the current request: cookie first, then Accept-Language,
 * then English.
 */
export async function getLocale(): Promise<Locale> {
  const jar = await cookies()
  const raw = jar.get(LOCALE_COOKIE)?.value
  if (isLocale(raw)) return raw
  const h = await headers()
  return parseAcceptLanguage(h.get("accept-language"))
}

export { LOCALE_COOKIE }
