# Stripe Pro subscriptions

## Environment variables

Set in `.env.local` and Vercel → **Settings** → **Environment Variables** (never commit secrets):

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_…` or `sk_live_…`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key (`pk_test_…`) |
| `STRIPE_PRICE_MONTHLY` | `price_1TZdE7Lbszdp98VAHdPyhx57` (€7/month) |
| `STRIPE_PRICE_ANNUAL` | `price_1TZdIeLbszdp98VAyXIQyf56` (€69/year) |
| `STRIPE_WEBHOOK_SECRET` | From Stripe → Developers → Webhooks |
| `SUPABASE_SERVICE_ROLE_KEY` | Required for webhook profile updates |

See `.env.example` for a template.

## Database

Run `supabase/migrations/20250519000000_profiles_stripe.sql` in the Supabase SQL editor (or via CLI).

## Webhook (after deploy)

1. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://autarkeia.world/api/stripe/webhook`
3. Events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the signing secret into `STRIPE_WEBHOOK_SECRET` on Vercel and redeploy.

## Checkout flow

- **Plans** (`/plans`): Monthly €7 or Annual €69, 3-day trial, card required upfront.
- **API**: `POST /api/stripe/create-checkout-session` with `{ priceId: "monthly" | "annual" }`.
- **Success**: `/dashboard?checkout=success`
- **Cancel**: `/plans?checkout=cancelled`

## Pro access

`profiles.subscription_status` must be `trialing` or `active` for Pro features (library, marketplace sellers, dashboard Pro UI, AI chat).

## Test card

`4242 4242 4242 4242`, any future expiry, any CVC. Use a Spanish billing address to verify Stripe Tax in test mode.
