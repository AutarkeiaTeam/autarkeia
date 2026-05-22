import { z } from "zod"

export const preferredLocationSchema = z.object({
  name: z.string().trim().min(1).max(500),
  country: z.string().trim().max(200),
  region: z.string().trim().max(200),
  coordinates: z.tuple([
    z.number().min(-180).max(180),
    z.number().min(-90).max(90),
  ]),
})

export type PreferredLocation = z.infer<typeof preferredLocationSchema>

export function formatPreferredLocationsForDisplay(locations: PreferredLocation[]): string {
  return locations.map((loc) => loc.name).join(", ")
}

export function locationKey(location: PreferredLocation): string {
  return `${location.name}|${location.coordinates[0]}|${location.coordinates[1]}`
}
