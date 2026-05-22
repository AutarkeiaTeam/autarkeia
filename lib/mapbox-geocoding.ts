import { locationKey, type PreferredLocation } from "@/lib/community-interest-location"

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

export type MapboxFeature = {
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

/** Map a Mapbox Geocoding v6 feature to a PreferredLocation (call on select). */
export function mapboxFeatureToPreferredLocation(feature: MapboxFeature): PreferredLocation | null {
  const props = feature.properties
  const name = props.name?.trim()
  if (!name) return null

  const coords = feature.geometry?.coordinates
  if (!Array.isArray(coords) || coords.length < 2) return null
  const lng = coords[0]
  const lat = coords[1]
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null

  const country = props.context?.country?.name?.trim() ?? ""
  const region = props.context?.region?.name?.trim() ?? ""
  const placeFormatted =
    props.place_formatted?.trim() ||
    [region, country].filter(Boolean).join(", ")
  const fullAddress =
    props.full_address?.trim() ||
    (placeFormatted ? `${name}, ${placeFormatted}` : [name, region, country].filter(Boolean).join(", "))

  return {
    name,
    fullAddress,
    placeFormatted,
    region,
    country,
    coordinates: [lng, lat],
  }
}

export async function searchMapboxPlaceFeatures(
  query: string,
  options?: { language?: string }
): Promise<MapboxFeature[]> {
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
  const features = sortFeaturesByPlacePriority(data.features ?? [])
  const seen = new Set<string>()
  const results: MapboxFeature[] = []

  for (const feature of features) {
    const location = mapboxFeatureToPreferredLocation(feature)
    if (!location) continue
    const key = locationKey(location)
    if (seen.has(key)) continue
    seen.add(key)
    results.push(feature)
  }

  return results
}

/** @deprecated Prefer searchMapboxPlaceFeatures + mapboxFeatureToPreferredLocation on select */
export async function searchMapboxPlaces(
  query: string,
  options?: { language?: string }
): Promise<PreferredLocation[]> {
  const features = await searchMapboxPlaceFeatures(query, options)
  return features
    .map(mapboxFeatureToPreferredLocation)
    .filter((location): location is PreferredLocation => location != null)
}
