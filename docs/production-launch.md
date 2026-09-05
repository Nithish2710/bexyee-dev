# BEXYEE production launch checklist

## Repository complete

- Customer flow: cart, customer details, address, order review, Razorpay handoff, signed verification, success, tracking.
- Admin auth: Supabase Auth, OTP setup, password reset, role authorization, CRUD APIs, audit history.
- Payment: server-side pricing, stock validation, HMAC verification, duplicate-payment guard, Razorpay webhook.
- Shipping: provider interface, serviceability, quote, shipment adapter boundary, server-side fee calculation.
- Email: transactional provider adapter and queued lifecycle events.
- Analytics: GA4/Meta browser events, UTM retention, server-side purchase event ID deduplication.
- Legal: privacy, terms, shipping, refund/cancellation, and contact routes.

## Required provider configuration

1. Apply migrations `0001_commerce.sql`, `0002_admin_security.sql`, `0003_admin_auth_setup.sql`, and `0004_production_hardening.sql` in order.
2. Create the first Supabase Auth user and insert its UUID into `admin_users` with `must_change_password = true`.
3. Configure Supabase email templates and redirect URLs for `/admin/change-password` and `/admin/reset-password`.
4. Add live Razorpay keys and `RAZORPAY_WEBHOOK_SECRET`; configure the `payment.captured` and `payment.failed` webhook URL.
5. Configure a shipping provider using `SHIPPING_SERVICEABILITY_URL`, `SHIPPING_QUOTE_URL`, `SHIPPING_API_KEY`, and shipment creation integration before dispatching real orders.
6. Configure `EMAIL_PROVIDER_URL`, `EMAIL_PROVIDER_API_KEY`, and `EMAIL_FROM`; run a worker for `email_events` before launch.
7. Configure `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `META_PIXEL_ID`, `META_ACCESS_TOKEN`, and `NEXT_PUBLIC_SITE_URL`.
8. Replace legal placeholders with registered business details and have policies reviewed for the operating jurisdiction.

## QA matrix

Run on iPhone Safari, Android Chrome, iPad/tablet Safari, desktop Chrome/Safari/Firefox, and a slow network:

- Fresh guest cart, quantity changes, removal, and cart persistence.
- Missing/invalid size, unavailable stock, and concurrent stock changes.
- Customer details, address validation, serviceability, shipping quote, and order review.
- Razorpay success, failure, dismissal, webhook replay, duplicate callback, and refund paths.
- Order state transitions and tracking number visibility.
- Admin unauthenticated redirect, non-admin denial, CRUD authorization, price tampering, negative stock, and customer-data access.
- GA4/Meta browser events, server Purchase event, event ID deduplication, and UTM attribution.
- Email queue creation and provider delivery for payment, shipping, delivery, and recovery messages.

## Monitoring

Forward structured `logServerEvent` / `logServerError` output to the hosting log sink or Sentry, alert on payment verification failures, webhook signature failures, stock conflicts, 5xx responses, and elevated checkout abandonment. Add uptime monitoring for `/`, `/api/create-order`, `/api/checkout/verify`, and `/api/webhooks/razorpay`.
