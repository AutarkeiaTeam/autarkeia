/**
 * Client-safe i18n barrel. For server components use `getLocale` from
 * `@/lib/i18n-server` and `translate` / `getMessages` from `@/lib/i18n-core`.
 */
export {
  LOCALES,
  LOCALE_COOKIE,
  isLocale,
  type Locale,
  getMessages,
  translate,
  parseAcceptLanguage,
} from "@/lib/i18n-core"
export { setLocale, getClientLocale } from "@/lib/i18n-client"
export { getClientLocale as getCurrentLocale } from "@/lib/i18n-client"
