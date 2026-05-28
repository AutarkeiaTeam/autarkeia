/** Client-safe brand placeholder styling (no server imports). */

export const BRAND_PLACEHOLDER_COLORS: Record<string, string> = {
  allpowers: "#d97706",
  bluetti: "#2563eb",
  alorair: "#0891b2",
  "alorair-crawlspace": "#0e7490",
  "brisks-outdoors": "#15803d",
  "decathlon-ireland": "#4f46e5",
  "gardening-naturally": "#65a30d",
  "survival-frog": "#b45309",
  "water-to-go": "#0284c7",
}

export function getBrandInitials(name: string): string {
  const words = name.replace(/[^a-zA-Z0-9\s]/g, "").trim().split(/\s+/)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}
