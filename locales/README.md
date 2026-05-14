# Locales

Translation source files for Autarkeia. Each `*.json` file is a flat map
of translation keys to strings. The active locale is read from the
`autarkeia-locale` cookie (set by the navbar's language switcher), with
a fallback to the browser's `navigator.language`, then English.

Supported locales:

- `en` — English (canonical source)
- `es` — Spanish
- `fr` — French
- `pt` — Portuguese
- `de` — German
- `it` — Italian
- `zh` — Simplified Chinese
- `ja` — Japanese
- `ko` — Korean

## Adding or updating keys

1. Add the key to `en.json` first; this file is the source of truth.
2. Add translations to the other eight files. Keep keys in the same order
   for easy diffing.
3. The `t(key)` helper in `lib/i18n.ts` falls back to English when a key
   is missing from the active locale, so partial coverage is safe to
   ship.

## Translation review

All eight non-English files in this directory were drafted from English
copy and need a native speaker pass before launch. They are good enough
for development and demos, not for production-grade marketing copy.

## URL-prefixed routing (optional, not yet enabled)

`lib/i18n.ts` reads the active locale from a cookie. If you later want
URL-prefixed routes (`/en/...`, `/es/...`, etc.), add a Next.js
middleware that rewrites or redirects based on the cookie or the
`Accept-Language` header. The locale list to iterate is `LOCALES` in
`lib/i18n.ts`.
