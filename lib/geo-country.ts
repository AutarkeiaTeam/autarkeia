import { headers } from "next/headers"

/** Normalize ISO / vendor codes to keys used in marketplace affiliate links. */
export function normalizeCountryCode(code: string | null | undefined): string | null {
  if (!code) return null
  const upper = code.trim().toUpperCase()
  if (!upper) return null
  if (upper === "GB") return "UK"
  if (upper === "GLOBAL") return "Global"
  return upper
}

/** Server-side country from Vercel / CDN headers. */
export async function getRequestCountry(): Promise<string | null> {
  const h = await headers()
  return normalizeCountryCode(
    h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry") ?? h.get("x-country-code")
  )
}

/** Client fallback from navigator.language (e.g. en-US → US). */
export function guessCountryFromLocale(): string | null {
  if (typeof navigator === "undefined") return null
  const tag = navigator.language || ""
  const region = tag.split("-")[1]
  return normalizeCountryCode(region)
}
