import { z } from "zod"

export const preferredLocationSchema = z.object({
  /** Primary label: city/town name from Mapbox properties.name */
  name: z.string().trim().min(1).max(500),
  /** Secondary label for UI, e.g. "Granada, Andalusia, Spain" */
  placeFormatted: z.string().trim().max(500).optional().default(""),
  country: z.string().trim().max(200),
  /** Administrative region from context — not used as the display name */
  region: z.string().trim().max(200),
  coordinates: z.tuple([
    z.number().min(-180).max(180),
    z.number().min(-90).max(90),
  ]),
})

export type PreferredLocation = z.infer<typeof preferredLocationSchema>

export function formatPreferredLocationsForDisplay(locations: PreferredLocation[]): string {
  return locations
    .map((loc) => loc.placeFormatted || loc.name)
    .join(", ")
}

export function locationKey(location: PreferredLocation): string {
  return `${location.name}|${location.coordinates[0]}|${location.coordinates[1]}`
}
