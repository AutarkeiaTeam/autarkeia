"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import {
  locationKey,
  preferredLocationDisplayLabel,
  type PreferredLocation,
} from "@/lib/community-interest-location"
import {
  mapboxFeatureToPreferredLocation,
  searchMapboxPlaceFeatures,
  type MapboxFeature,
} from "@/lib/mapbox-geocoding"

const inputClass =
  "w-full rounded-lg border border-[#d4dce8] bg-white p-3 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"

type Props = {
  locations: PreferredLocation[]
  maxLocations?: number
  onChange: (locations: PreferredLocation[]) => void
  disabled?: boolean
}

export function LocationAutocomplete({
  locations,
  maxLocations = 10,
  onChange,
  disabled = false,
}: Props) {
  const listboxId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")

  const atLimit = locations.length >= maxLocations

  const addLocation = useCallback(
    (location: PreferredLocation) => {
      if (locations.length >= maxLocations) return
      if (locations.some((item) => locationKey(item) === locationKey(location))) return
      onChange([...locations, location])
      setQuery("")
      setSuggestions([])
      setIsOpen(false)
      setSearchError("")
    },
    [locations, maxLocations, onChange]
  )

  const selectLocation = useCallback(
    (feature: MapboxFeature) => {
      const location = mapboxFeatureToPreferredLocation(feature)
      if (!location) return
      console.log("[location-autocomplete] adding location:", location)
      addLocation(location)
    },
    [addLocation]
  )

  const removeLocation = (index: number) => {
    onChange(locations.filter((_, idx) => idx !== index))
  }

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([])
      setIsSearching(false)
      setSearchError("")
      return
    }

    const handle = window.setTimeout(async () => {
      setIsSearching(true)
      setSearchError("")
      try {
        const features = await searchMapboxPlaceFeatures(query.trim())
        const selectedKeys = new Set(locations.map(locationKey))
        setSuggestions(
          features.filter((feature) => {
            const mapped = mapboxFeatureToPreferredLocation(feature)
            return mapped != null && !selectedKeys.has(locationKey(mapped))
          })
        )
        setIsOpen(true)
      } catch (err) {
        console.error("[location-autocomplete] search failed:", err)
        setSuggestions([])
        setSearchError("Could not load suggestions. Try again.")
      } finally {
        setIsSearching(false)
      }
    }, 250)

    return () => window.clearTimeout(handle)
  }, [query, locations])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [])

  return (
    <div ref={containerRef} className="space-y-3">
      <div className="relative">
        <input
          type="text"
          className={inputClass}
          placeholder={
            atLimit
              ? "Maximum locations selected"
              : "Search for a city, region, or country…"
          }
          value={query}
          disabled={disabled || atLimit}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen && suggestions.length > 0}
          aria-controls={listboxId}
          aria-autocomplete="list"
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true)
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
            }
            if (event.key === "Escape") {
              setIsOpen(false)
            }
          }}
        />
        {isSearching && (
          <p className="pointer-events-none absolute right-3 top-3 text-xs text-[#8a9bb0]">
            Searching…
          </p>
        )}
        {isOpen && !atLimit && (suggestions.length > 0 || searchError) && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-[#d4dce8] bg-white py-1 shadow-lg"
          >
            {searchError && (
              <li className="px-3 py-2 text-sm text-red-600">{searchError}</li>
            )}
            {suggestions.map((feature) => {
              const preview = mapboxFeatureToPreferredLocation(feature)
              if (!preview) return null
              return (
                <li key={locationKey(preview)} role="option">
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left hover:bg-[#e8f8f3]"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectLocation(feature)}
                  >
                  <span className="block text-sm font-medium text-[#0d1b2a]">{preview.name}</span>
                  {preview.placeFormatted &&
                    preview.placeFormatted.toLowerCase() !== preview.name.toLowerCase() && (
                      <span className="mt-0.5 block text-xs text-[#8a9bb0]">
                        {preview.placeFormatted}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <p className="text-xs text-[#8a9bb0]">
        Pick locations from the suggestions (at least 2 characters). Free-text entries are not
        saved.
      </p>

      <div className="flex flex-wrap gap-2">
        {locations.map((location, idx) => (
          <button
            type="button"
            key={locationKey(location)}
            onClick={() => removeLocation(idx)}
            disabled={disabled}
            className="rounded-full bg-[#e8f8f3] px-3 py-1 text-sm text-[#0d1b2a] hover:bg-[#d4dce8] disabled:opacity-60"
          >
            {preferredLocationDisplayLabel(location)} ×
          </button>
        ))}
      </div>
    </div>
  )
}
