# Locales

Translation source files for Autarkeia. Each `*.json` file is a flat map
of translation keys to strings. The active locale is read from the
`autarkeia-locale` cookie (set by the navbar's language switcher), with
a fallback to the browser's `Accept-Language` / `navigator.language`, then English.

Supported locales:

- `en` — English (canonical source)
- `es` — Spanish

## Adding or updating keys

1. Add the key to `en.json` first; this file is the source of truth.
2. Add the Spanish string to `es.json` with the same key.
3. The `translate()` / `getMessages()` helpers fall back to English when a key
   is missing from Spanish, so partial coverage is safe to ship.

## Translation review

Spanish copy should be reviewed by a native speaker before launch-grade marketing.

## URL-prefixed routing (optional, not yet enabled)

The active locale is stored in a cookie. If you later want URL-prefixed routes
(`/en/...`, `/es/...`), add a Next.js middleware that rewrites or redirects based
on the cookie or the `Accept-Language` header. The locale list is `LOCALES` in
`lib/i18n-core.ts`.
