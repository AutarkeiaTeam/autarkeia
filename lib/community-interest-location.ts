import { z } from "zod"

export const preferredLocationSchema = z.object({
  /** City/town name from Mapbox properties.name */
  name: z.string().trim().min(1).max(500),
  /** Mapbox properties.place_formatted */
  placeFormatted: z.string().trim().max(500).optional().default(""),
  /** Mapbox properties.full_address */
  fullAddress: z.string().trim().max(500).optional().default(""),
  country: z.string().trim().max(200),
  region: z.string().trim().max(200),
  coordinates: z.tuple([
    z.number().min(-180).max(180),
    z.number().min(-90).max(90),
  ]),
})

export type PreferredLocation = z.infer<typeof preferredLocationSchema>

function uniqueLabelParts(parts: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const key = trimmed.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(trimmed)
  }
  return result
}

/** Chip / summary label: full_address, or "name, place_formatted", or name alone for countries. */
export function preferredLocationDisplayLabel(location: PreferredLocation): string {
  const name = location.name.trim()
  const fullAddress = location.fullAddress?.trim()
  if (fullAddress) {
    if (fullAddress.toLowerCase() === name.toLowerCase()) return name
    return fullAddress
  }

  const placeFormatted = location.placeFormatted?.trim()
  if (placeFormatted && placeFormatted.toLowerCase() !== name.toLowerCase()) {
    return `${name}, ${placeFormatted}`
  }

  const parts = uniqueLabelParts([
    name,
    location.region?.trim() ?? "",
    location.country?.trim() ?? "",
  ])
  return parts.length === 1 ? parts[0] : parts.join(", ")
}

export function formatPreferredLocationsForDisplay(locations: PreferredLocation[]): string {
  return locations.map(preferredLocationDisplayLabel).join(", ")
}

export function locationKey(location: PreferredLocation): string {
  return `${location.name}|${location.coordinates[0]}|${location.coordinates[1]}`
}
