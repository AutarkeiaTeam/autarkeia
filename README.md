# Autarkeia

Emergency readiness and self-sufficiency platform.

## Environment variables

Copy `.env.example` to `.env.local` and fill in values. Mirror the same keys in Vercel for production.

## Mapbox location autocomplete

The Communities “Register interest” form uses the [Mapbox Geocoding API v6](https://docs.mapbox.com/api/search/geocoding/) (forward geocoding) with `NEXT_PUBLIC_MAPBOX_TOKEN`.

**Security:** In the [Mapbox account dashboard](https://account.mapbox.com/access-tokens/), restrict the public token (`pk.*`) to your domains, for example:

- `https://autarkeia.world`
- `http://localhost:3000` (local development)

This limits use of the token to your site even though it is exposed in client-side code.

## Supabase migrations

Run SQL files under `supabase/migrations/` in the Supabase SQL Editor (in order). See `docs/STRIPE.md` and migration comments for feature-specific setup.
