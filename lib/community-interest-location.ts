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

/** Chip / summary label: full_address, or "name, place_formatted", or name alone. */
export function preferredLocationDisplayLabel(location: PreferredLocation): string {
  const fullAddress = location.fullAddress?.trim()
  if (fullAddress) return fullAddress

  const placeFormatted = location.placeFormatted?.trim()
  if (placeFormatted) return `${location.name}, ${placeFormatted}`

  return location.name
}

export function formatPreferredLocationsForDisplay(locations: PreferredLocation[]): string {
  return locations.map(preferredLocationDisplayLabel).join(", ")
}

export function locationKey(location: PreferredLocation): string {
  return `${location.name}|${location.coordinates[0]}|${location.coordinates[1]}`
}
