import type { PreferredLocation } from "@/lib/community-interest-location"

const GEOCODE_URL = "https://api.mapbox.com/search/geocode/v6/forward"

/** Prefer cities/towns over states when sorting API results. */
const FEATURE_TYPE_PRIORITY: Record<string, number> = {
  place: 0,
  locality: 1,
  neighborhood: 2,
  district: 3,
  region: 4,
}

const GEOCODE_TYPES = "place,locality,neighborhood,district,region"

type MapboxContextEntry = {
  name?: string
}

type MapboxFeature = {
  geometry: { coordinates: [number, number] }
  properties: {
    name?: string
    full_address?: string
    place_formatted?: string
    feature_type?: string
    coordinates?: { longitude?: number; latitude?: number }
    context?: {
      country?: MapboxContextEntry
      region?: MapboxContextEntry
      district?: MapboxContextEntry
      place?: MapboxContextEntry
    }
  }
}

function sortFeaturesByPlacePriority(features: MapboxFeature[]): MapboxFeature[] {
  return [...features].sort((a, b) => {
    const rankA = FEATURE_TYPE_PRIORITY[a.properties.feature_type ?? ""] ?? 99
    const rankB = FEATURE_TYPE_PRIORITY[b.properties.feature_type ?? ""] ?? 99
    return rankA - rankB
  })
}

type MapboxForwardResponse = {
  features?: MapboxFeature[]
}

export function mapboxFeatureToPreferredLocation(feature: MapboxFeature): PreferredLocation | null {
  const props = feature.properties
  const lng =
    props.coordinates?.longitude ??
    (Array.isArray(feature.geometry?.coordinates) ? feature.geometry.coordinates[0] : null)
  const lat =
    props.coordinates?.latitude ??
    (Array.isArray(feature.geometry?.coordinates) ? feature.geometry.coordinates[1] : null)

  if (lng == null || lat == null || !Number.isFinite(lng) || !Number.isFinite(lat)) {
    return null
  }

  const name = props.name?.trim()
  if (!name) return null

  const placeFormatted =
    props.place_formatted?.trim() || props.full_address?.trim() || ""

  return {
    name,
    placeFormatted,
    country: props.context?.country?.name?.trim() ?? "",
    region: props.context?.region?.name?.trim() ?? "",
    coordinates: [lng, lat],
  }
}

export async function searchMapboxPlaces(
  query: string,
  options?: { language?: string }
): Promise<PreferredLocation[]> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (!token) {
    console.warn("NEXT_PUBLIC_MAPBOX_TOKEN is not set")
    return []
  }

  const trimmedQuery = query.trim()
  const params = new URLSearchParams({
    q: trimmedQuery,
    access_token: token,
    types: GEOCODE_TYPES,
    autocomplete: "true",
    limit: "10",
    language: options?.language ?? "en",
  })

  const response = await fetch(`${GEOCODE_URL}?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Location search failed")
  }

  const data = (await response.json()) as MapboxForwardResponse
  const results: PreferredLocation[] = []

  for (const feature of sortFeaturesByPlacePriority(data.features ?? [])) {
    const location = mapboxFeatureToPreferredLocation(feature)
    if (!location) continue
    if (results.some((item) => locationKey(item) === locationKey(location))) continue
    results.push(location)
  }

  return results
}
