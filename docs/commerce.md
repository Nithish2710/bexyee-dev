# BEXYEE commerce setup

## Database

Apply `supabase/migrations/0001_commerce.sql` to the project linked to the deployment. Campaigns and active products are public through RLS. Checkout, stock reservation, orders, and analytics use the server-only service-role client.

## Environment

```text
NEXT_PUBLIC_SITE_URL=https://bexyee.example
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=
META_PIXEL_ID=
META_ACCESS_TOKEN=
META_API_VERSION=v20.0
```

Never expose `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, or `META_ACCESS_TOKEN` to client code.

## Data flow

1. The active campaign and active product populate the existing hero.
2. Cart mutations use a guest token cookie and validate product, size, status, and stock.
3. `/api/create-order` recalculates totals from database prices before creating Razorpay's order.
4. `/api/checkout/verify` validates the Razorpay HMAC, reserves stock, marks the order paid, records a purchase event, and queues a payment confirmation email event.
5. `analytics_events` retains UTM attribution and event IDs for funnel reporting and browser/server ad deduplication.

Supabase Auth can link signed-in customers to `customers.id`; guest orders remain supported through `guest_email`. `email_events` is intentionally a queue, allowing a worker or provider integration to send only transactional and explicitly triggered retention messages. Product and campaign edits can be performed through Supabase Studio or a protected admin service built on the existing tables.