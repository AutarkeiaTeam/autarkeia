import type { PreferredLocation } from "@/lib/community-interest-location"

const GEOCODE_URL = "https://api.mapbox.com/search/geocode/v6/forward"

type MapboxContextEntry = {
  name?: string
}

type MapboxFeature = {
  geometry: { coordinates: [number, number] }
  properties: {
    name?: string
    full_address?: string
    place_formatted?: string
    coordinates?: { longitude?: number; latitude?: number }
    context?: {
      country?: MapboxContextEntry
      region?: MapboxContextEntry
      district?: MapboxContextEntry
      place?: MapboxContextEntry
    }
  }
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

  const name =
    props.place_formatted?.trim() ||
    props.full_address?.trim() ||
    [props.name, props.context?.region?.name, props.context?.country?.name]
      .filter(Boolean)
      .join(", ")
      .trim() ||
    props.name?.trim()

  if (!name) return null

  return {
    name,
    country: props.context?.country?.name?.trim() ?? "",
    region:
      props.context?.region?.name?.trim() ??
      props.context?.district?.name?.trim() ??
      props.context?.place?.name?.trim() ??
      "",
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

  const params = new URLSearchParams({
    q: query,
    access_token: token,
    types: "region,district,place,locality",
    autocomplete: "true",
    limit: "5",
    language: options?.language ?? "en",
  })

  const response = await fetch(`${GEOCODE_URL}?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Location search failed")
  }

  const data = (await response.json()) as MapboxForwardResponse
  const results: PreferredLocation[] = []

  for (const feature of data.features ?? []) {
    const location = mapboxFeatureToPreferredLocation(feature)
    if (!location) continue
    if (results.some((item) => item.name === location.name)) continue
    results.push(location)
  }

  return results
}
