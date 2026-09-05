# BEXYEE — Premium Streetwear E-Commerce Platform

BEXYEE is an enterprise-grade, city-drop streetwear e-commerce platform built with **Next.js 16 (Turbopack)**, **TypeScript**, **PostgreSQL / Supabase**, **Razorpay**, and **React Three Fiber**.

---

## 1. Architecture Overview

```
                             BEXYEE BACKEND
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       ↓                           ↓                           ↓
   COMMERCE                    CAMPAIGNS                   MARKETING
       │                           │                           │
   Products                    Assets                      Meta / Google Ads
   • products                  • product_assets (Slots)    • Meta Pixel + CAPI
   • product_sizes             • campaign_assets           • Google Ads / GA4
   • available_product_sizes                               • Deduplicated Events
                               Themes                      
   Cart                        • Accent, Copy, Specs       Analytics
   • carts                     • Mobile/Desktop Art        • analytics_events
   • cart_items                                            • Funnel Telemetry
                               Drafts                      
   Orders                      • campaign_drafts           Heatmaps & Behavior
   • orders                    • In-Admin Live Preview     • Clarity / PostHog
   • order_items               • Multi-Device Viewports    • Scroll & Rage Clicks
   • order_status_history                                  
                               Publish                     Attribution Engine
   Payments                    • Zero-Downtime Releases    • Persistent UTM Capture
   • payments (Ledger)         • Atomic Switchover         • Landing → Cart → Buy
   • webhook_events (Idempotency)
                               
   Inventory Engine            
   • stock_reservations        
   • AVAILABLE → RESERVED → PAYMENT → SOLD
   • Deterministic Row Locking & TTL Auto-Expiry
   • inventory_adjustments (Audit Trail)
       │
       ↓
   OPERATIONS
       │
   Shipping • Email • Refunds • Tracking
   • Shipping: shipments, Multi-Carrier Adapter (Shiprocket/Delhivery), AWB, Tracking
   • Email: email_events, Non-Blocking Transactional Queue Worker (OTP, Orders, Refunds)
   • Refunds: refunds, Server-Side Razorpay Execution, Balance Guard & Restock Trigger
   • Tracking: /api/orders/[id], Rate-Limited Public Timeline, Sanitized Status History
```

---

## 2. Core Technical Invariants

1. **Server as Single Source of Truth**: Browser prices and stock quantities are never trusted. All calculations, discounts, and inventory allocations occur atomically on the server.
2. **Atomic Inventory Reservation**:
   $$\text{AVAILABLE} \;\longrightarrow\; \text{RESERVED (15m TTL)} \;\longrightarrow\; \text{PAYMENT} \;\longrightarrow\; \text{SOLD}$$
   * Checkout acquires row locks in deterministic SKU order to eliminate deadlocks.
   * Expired reservations automatically return to the available inventory pool.
3. **Zero-Slowness Image-First Product Presentation**:
   * **0ms**: Layer 1 (photographic studio rendering) paints immediately on first HTML/CSS frame with zero layout shift (CLS = 0.00).
   * **Deferred**: Layer 2 (3D GLB canvas) loads in the background via idle callbacks and crossfades smoothly when ready.
   * **Adaptive GPU Tiering**: Weak GPUs or `Save-Data` modes remain in crisp 2D photo mode with 0% WebGL overhead.
4. **Idempotency & Replay Protection**:
   * All Razorpay webhooks require timing-safe HMAC SHA-256 verification and are deduplicated via unique `(provider, event_id)` constraints.
   * Duplicate client payment verifications or parallel webhooks never double-charge or double-deduct stock.

---

## 3. Getting Started

### Prerequisites
* Node.js $\ge 18.18.0$
* PostgreSQL / Supabase project

### Installation
```bash
git clone <repo-url>
cd bexyee-store
npm install
```

### Environment Variables
Copy `.env.example` to `.env.local` and populate:

```env
# Database & Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Razorpay Payments
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Public Store Configuration
NEXT_PUBLIC_SITE_URL=https://bexyee.com
NEXT_PUBLIC_MODEL_URL=/assets/models/bengaluru-garment.glb

# Marketing & Analytics (Optional)
NEXT_PUBLIC_META_PIXEL_ID=
META_CAPI_ACCESS_TOKEN=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_CLARITY_ID=
```

---

## 4. Verification Suite

Run all test suites, type-checks, and builds:

```bash
# Run all 55 integration, concurrency, benchmark, and real-world tests
npm test

# Run ESLint across entire codebase
npm run lint

# Run strict TypeScript type check
npx tsc --noEmit

# Production Next.js Turbopack build (compiles all 37 routes)
npm run build
```

---

## 5. Documentation Links

* [Production Launch & Operations Manual](file:///c:/Users/rad/Desktop/bexyee%20project%20-%20Copy/bexyee-store/production-launch.md)
* Database Migrations: `supabase/migrations/`
