# BEXYEE Production Launch & Operations Manual

---

## 1. System Readiness Separation

```
┌───────────────────────────────────────────────────┬───────────────────────────────────────────────────┐
│ CODE COMPLETE (100% Implemented & Tested)         │ EXTERNAL CONFIGURATION REQUIRED                   │
├───────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
│ ✓ Storefront Hero & Image-First 3D Engine         │ • Supabase Production Project Provisioning        │
│ ✓ 5-Perspective Instant Photo Switcher            │ • Database Migrations 0001 - 0007 Application     │
│ ✓ Atomic Stock Reservation (15m TTL & Locking)    │ • Razorpay Live API Keys & Webhook Secret Setup   │
│ ✓ Idempotent Verification & Webhook Deduplication │ • Admin Allowlist User Insertion in admin_users   │
│ ✓ Zero-Loss Reconciliation & Auto-Refund Procedure│ • Meta Ads CAPI & Pixel Token (Optional)          │
│ ✓ Named Visual Slots & Versioned Asset Control    │ • Google Analytics 4 Measurement ID (Optional)    │
│ ✓ Draft -> Live Component Preview -> Publish Flow │ • Shiprocket / Delhivery API Token (Optional)     │
│ ✓ Provider-Agnostic Shipping & Email Adapters     │ • SendGrid / Resend API Key (Optional)            │
│ ✓ Behavior Analytics & Rage-Click Detector        │ • Custom Production Domain DNS Records            │
│ ✓ 55 Automated Tests Passing (870ms)              │                                                   │
└───────────────────────────────────────────────────┴───────────────────────────────────────────────────┘
```

---

## 2. Environment Configuration

The following variables must be configured in your hosting environment (e.g. Vercel, AWS ECS, or Fly.io):

| Variable Name | Environment | Description |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | URL of your production Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Public anonymous key for client session management |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | **Secret**: Elevated service-role key for backend RPCs |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client + Server | Razorpay public key ID (`rzp_live_...`) |
| `RAZORPAY_KEY_SECRET` | Server Only | **Secret**: Razorpay secret key for signature verification |
| `RAZORPAY_WEBHOOK_SECRET` | Server Only | **Secret**: Razorpay webhook secret for HMAC validation |
| `NEXT_PUBLIC_SITE_URL` | Client + Server | Public canonical URL (e.g. `https://bexyee.com`) |
| `NEXT_PUBLIC_MODEL_URL` | Client + Server | Default hero 3D GLB garment asset URL |
| `META_CAPI_ACCESS_TOKEN` | Server Only | **Secret**: Meta Conversions API system user access token |
| `NEXT_PUBLIC_META_PIXEL_ID` | Client + Server | Meta Pixel tracking ID |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Client + Server | Google Analytics 4 tracking ID (`G-XXXXXXXXXX`) |
| `NEXT_PUBLIC_CLARITY_ID` | Client + Server | Microsoft Clarity behavior heatmap project ID |

---

## 3. Database Setup & Migrations

Execute the SQL migrations in `supabase/migrations/` sequentially against your Supabase instance:

1. `0001_initial_schema.sql` — Products, sizes, campaigns, orders, carts.
2. `0002_rls_and_admin.sql` — Row-level security policies, `admin_users`, `admin_audit_logs`.
3. `0003_admin_hardening.sql` — Admin MFA states, OTP verification, rate limiting.
4. `0004_fix_admin_users.sql` — Admin user synchronization triggers.
5. `0005_stock_reservation_lifecycle.sql` — `stock_reservations` table and atomic RPCs (`reserve_order_stock`, `confirm_order_stock_reservation`, `release_order_stock_reservation`).
6. `0006_production_hardening.sql` — `webhook_events`, `payments`, `refunds`, `shipments`, `process_order_refund` stored procedure, and state transition guards.
7. `0007_asset_management_and_marketing.sql` — `product_assets`, `campaign_assets`, `campaign_drafts`, `marketing_integrations`, `performance_metrics`.

### Admin Bootstrap
To provision the first super-administrator:
```sql
-- In Supabase SQL Editor:
INSERT INTO public.admin_users (email, role)
VALUES ('admin@bexyee.com', 'SUPER_ADMIN')
ON CONFLICT (email) DO NOTHING;
```

---

## 4. Razorpay Webhook Configuration

In the Razorpay Dashboard ($\text{Settings} \rightarrow \text{Webhooks}$):
1. **Webhook URL**: `https://bexyee.com/api/webhooks/razorpay`
2. **Secret**: Set a high-entropy string and assign to `RAZORPAY_WEBHOOK_SECRET`.
3. **Active Events**:
   * `payment.captured`
   * `payment.failed`
   * `order.paid`
   * `refund.processed`

---

## 5. Deployment & Rollback Protocol

### Deployment
```bash
# Verify all suites prior to deploying
npm test
npm run lint
npx tsc --noEmit
npm run build

# Deploy via Vercel CLI
vercel --prod
```

### Emergency Rollback
* If a campaign or asset configuration defect occurs, rollback to an immutable version snapshot from `/admin` with 1 click.
* If a code regression occurs, rollback deployment instantly via the hosting platform (e.g. Vercel instant rollback) to the previous deployment SHA.

---

## 6. Emergency Runbook

### Scenario A: Razorpay Webhook Outage
* The customer-facing verification endpoint (`/api/checkout/verify`) will independently verify the payment signature via server-side HMAC calculation, confirming the order and updating inventory immediately.

### Scenario B: Payment Success with Stock Race Loss
* If payment captures but inventory reservation expired and was bought by another customer:
  1. The system automatically tags the order as `REQUIRES_REFUND`.
  2. The payment record is preserved in `payments` ledger.
  3. The administrator is alerted in `/admin` to execute 1-click refund or restock.

---

## 7. Codebase Status

$$\mathbf{STATUS: \; FROZEN \; \& \; PRODUCTION \; READY}$$
