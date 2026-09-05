import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const BASE_URL = 'http://127.0.0.1:3000';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const sb = createClient(supabaseUrl, supabaseKey);

const auditReport = {
  timestamp: new Date().toISOString(),
  sections: {},
  issues: [],
};

function addIssue({ id, section, page, device, userType, severity, whatIDid, whatIExpected, whatActuallyHappened, backendResult, dbResult, rootCause, exactDisconnected }) {
  auditReport.issues.push({
    id, section, page, device, userType, severity,
    whatIDid, whatIExpected, whatActuallyHappened,
    backendResult, dbResult, rootCause, exactDisconnected
  });
}

async function testHttp(path, options = {}) {
  const start = performance.now();
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'User-Agent': 'BexyeeMasterAuditor/2.1',
        ...(options.headers || {}),
      },
    });
    const durationMs = Math.round(performance.now() - start);
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    return { ok: res.ok, status: res.status, headers: res.headers, text, json, durationMs };
  } catch (err) {
    return { ok: false, status: 0, error: err.message, durationMs: Math.round(performance.now() - start) };
  }
}

async function runSection1_RouteDiscovery() {
  console.log('\n--- [SECTION 1 & 2] AUDITING CUSTOMER & ADMIN SSR ROUTES ---');
  const routes = [
    { path: '/', name: 'Homepage', type: 'CUSTOMER' },
    { path: '/bengaluru', name: 'Bengaluru Drop Experience', type: 'CUSTOMER' },
    { path: '/products', name: 'Products Catalog', type: 'CUSTOMER' },
    { path: '/products/bengaluru-tee', name: 'Product Detail /products', type: 'CUSTOMER' },
    { path: '/product/bengaluru-tee', name: 'Product Detail /product', type: 'CUSTOMER' },
    { path: '/collections', name: 'Collections Index', type: 'CUSTOMER' },
    { path: '/collections/monsoon-2026', name: 'Collections Detail', type: 'CUSTOMER' },
    { path: '/search', name: 'Search Page', type: 'CUSTOMER' },
    { path: '/cart', name: 'Cart Page', type: 'CUSTOMER' },
    { path: '/checkout', name: 'Checkout Page', type: 'CUSTOMER' },
    { path: '/order/success', name: 'Order Success Page', type: 'CUSTOMER' },
    { path: '/track', name: 'Order Tracking Page', type: 'CUSTOMER' },
    { path: '/account', name: 'Customer Account Page', type: 'CUSTOMER' },
    { path: '/account/orders', name: 'Customer Orders', type: 'CUSTOMER' },
    { path: '/account/addresses', name: 'Customer Addresses', type: 'CUSTOMER' },
    { path: '/account/profile', name: 'Customer Profile', type: 'CUSTOMER' },
    { path: '/account/wishlist', name: 'Customer Wishlist', type: 'CUSTOMER' },
    { path: '/account/security', name: 'Customer Security', type: 'CUSTOMER' },
    { path: '/about', name: 'About Page', type: 'CUSTOMER' },
    { path: '/lookbook', name: 'Lookbook Page', type: 'CUSTOMER' },
    { path: '/stories', name: 'Stories Index', type: 'CUSTOMER' },
    { path: '/stories/rain-and-signals', name: 'Story Detail', type: 'CUSTOMER' },
    { path: '/blog', name: 'Blog Index', type: 'CUSTOMER' },
    { path: '/blog/crafting-the-240gsm-loopknit', name: 'Blog Detail', type: 'CUSTOMER' },
    { path: '/size-guide', name: 'Size Guide Page', type: 'CUSTOMER' },
    { path: '/faq', name: 'FAQ Page', type: 'CUSTOMER' },
    { path: '/contact', name: 'Contact Page', type: 'CUSTOMER' },
    { path: '/legal/terms', name: 'Legal Terms', type: 'CUSTOMER' },
    { path: '/legal/privacy', name: 'Legal Privacy', type: 'CUSTOMER' },
    { path: '/legal/shipping-returns', name: 'Legal Shipping & Returns', type: 'CUSTOMER' },
    { path: '/cities', name: 'Cities Index', type: 'CUSTOMER' },
    { path: '/cities/bengaluru', name: 'City Detail', type: 'CUSTOMER' },
    { path: '/achievements', name: 'Achievements Page', type: 'CUSTOMER' },
    { path: '/admin/login', name: 'Admin Login', type: 'ADMIN' },
    { path: '/admin/reset-password', name: 'Admin Reset Password', type: 'ADMIN' },
    { path: '/admin/change-password', name: 'Admin Change Password', type: 'ADMIN' },
    { path: '/admin', name: 'Admin Dashboard (Unauthenticated)', type: 'ADMIN' },
    { path: '/admin/settings/security', name: 'Admin Security (Unauthenticated)', type: 'ADMIN' },
  ];

  const results = [];
  for (const r of routes) {
    const res = await testHttp(r.path);
    results.push({ ...r, ...res });
    const mark = res.status === 200 || (r.type === 'ADMIN' && r.path === '/admin' && (res.status === 307 || res.status === 308 || res.status === 302)) ? '✅' : '❌';
    console.log(`  ${mark} [${res.status}] ${r.name.padEnd(35)} (${res.durationMs}ms)`);

    // Check for broken HTML / exceptions
    if (res.text && (res.text.includes('Application error') || res.text.includes('Unhandled Runtime Error'))) {
      addIssue({
        id: `PAGE-ERR-${r.name.toUpperCase().replace(/\s+/g, '-')}`,
        section: 'SECTION 2 — VISUAL AUDIT',
        page: r.path,
        device: 'ALL',
        userType: r.type,
        severity: '🔴 CRITICAL',
        whatIDid: `Requested GET ${r.path}`,
        whatIExpected: 'Valid 200 HTML without Next.js runtime exceptions',
        whatActuallyHappened: 'Application error in rendered HTML markup',
        backendResult: `HTTP ${res.status}`,
        dbResult: 'N/A',
        rootCause: 'Server-side rendering exception during page compilation',
        exactDisconnected: 'Component SSR rendering path',
      });
    }
  }
  auditReport.sections.routes = results;
}

async function runSection4_ApiEndpoints() {
  console.log('\n--- [SECTION 4 & 11] AUDITING ALL API ENDPOINTS ---');
  const endpoints = [
    // Public APIs
    { method: 'GET', path: '/api/cart', name: 'Get Cart' },
    { method: 'POST', path: '/api/cart', name: 'Add to Cart', body: { productId: '00000000-0000-0000-0000-000000000001', size: 'M', quantity: 1 } },
    { method: 'POST', path: '/api/cart/release', name: 'Release Cart Reservation', body: { cartId: 'test-cart' } },
    { method: 'POST', path: '/api/create-order', name: 'Create Order (Paise/Razorpay)', body: { cartId: 'dummy', guestEmail: 'qa@bexyee.com', address: { name: 'QA Tester', phone: '9876543210', line1: 'MG Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' } } },
    { method: 'POST', path: '/api/checkout/verify', name: 'Verify Checkout Signature (Invalid payload)', body: { razorpay_order_id: 'fake', razorpay_payment_id: 'fake', razorpay_signature: 'fake' } },
    { method: 'GET', path: '/api/orders/track?orderId=BEX-00000000-0000', name: 'Track Order' },
    { method: 'GET', path: '/api/search?q=bengaluru', name: 'Search API' },
    { method: 'POST', path: '/api/events', name: 'Analytics Events Ingestion', body: { eventName: 'product_view', eventId: crypto.randomUUID(), sessionId: 'test-session', productId: '00000000-0000-0000-0000-000000000001' } },
    { method: 'POST', path: '/api/analytics/events', name: 'Analytics Events Alternate Path (Found in ProductPageRenderer)', body: { event: 'product_view' } },
    { method: 'POST', path: '/api/cron/release-reservations', name: 'Cron: Release Expired Reservations' },
    { method: 'POST', path: '/api/cron/launch-scheduler', name: 'Cron: Launch Scheduler' },
    { method: 'POST', path: '/api/webhooks/razorpay', name: 'Razorpay Webhook (Unsigned test)', body: { event: 'payment.captured' } },

    // Admin APIs (Unauthenticated security check)
    { method: 'GET', path: '/api/admin/products', name: 'Admin Products List (Unauth)' },
    { method: 'POST', path: '/api/admin/products', name: 'Admin Product Create (Unauth)', body: { name: 'Hacked Product' } },
    { method: 'GET', path: '/api/admin/inventory', name: 'Admin Inventory List (Unauth)' },
    { method: 'POST', path: '/api/admin/inventory', name: 'Admin Inventory Adjust (Unauth)', body: { productId: '00000000-0000-0000-0000-000000000001', size: 'M', delta: 10, reason: 'TEST' } },
    { method: 'GET', path: '/api/admin/launches', name: 'Admin Launches List (Unauth)' },
    { method: 'POST', path: '/api/admin/launches', name: 'Admin Launch Update (Unauth)', body: { launchId: 'test' } },
    { method: 'GET', path: '/api/admin/orders', name: 'Admin Orders List (Unauth)' },
    { method: 'POST', path: '/api/admin/orders/refund', name: 'Admin Order Refund (Unauth)', body: { orderId: 'test' } },
    { method: 'GET', path: '/api/admin/assets', name: 'Admin Assets List (Unauth)' },
    { method: 'GET', path: '/api/admin/brand-assets', name: 'Admin Brand Assets List (Unauth)' },
    { method: 'GET', path: '/api/admin/campaigns', name: 'Admin Campaigns List (Unauth)' },
    { method: 'GET', path: '/api/admin/refunds', name: 'Admin Refunds List (Unauth)' },
    { method: 'GET', path: '/api/admin/size-charts', name: 'Admin Size Charts List (Unauth)' },
    { method: 'GET', path: '/api/admin/themes', name: 'Admin Themes List (Unauth)' },
    { method: 'GET', path: '/api/admin/auth/state', name: 'Admin Auth State Check' },
    { method: 'POST', path: '/api/admin/auth/audit', name: 'Admin Auth Audit Log', body: { eventType: 'TEST_AUDIT' } },
  ];

  const apiResults = [];
  for (const ep of endpoints) {
    const opts = { method: ep.method };
    if (ep.body) {
      opts.body = JSON.stringify(ep.body);
      opts.headers = { 'Content-Type': 'application/json' };
    }
    const res = await testHttp(ep.path, opts);
    apiResults.push({ ...ep, ...res });
    const mark = res.status === 200 || res.status === 201 || res.status === 400 || res.status === 401 || res.status === 403 || res.status === 404 ? '✅' : '❌';
    console.log(`  ${mark} [${res.status}] ${ep.method} ${ep.path.padEnd(35)} (${res.durationMs}ms)`);

    // Specific route checks
    if (ep.path === '/api/analytics/events' && res.status === 404) {
      addIssue({
        id: 'API-404-ANALYTICS-EVENTS',
        section: 'SECTION 16 — ANALYTICS & BUSINESS CONTROL',
        page: '/api/analytics/events',
        device: 'ALL',
        userType: 'CUSTOMER',
        severity: '🟠 HIGH',
        whatIDid: 'Client component ProductPageRenderer.tsx calls fetch("/api/analytics/events")',
        whatIExpected: 'API route exists and receives telemetry events',
        whatActuallyHappened: 'HTTP 404 Not Found because endpoint is located at /api/events',
        backendResult: 'HTTP 404',
        dbResult: 'No analytics row inserted in events table',
        rootCause: 'URL path mismatch in ProductPageRenderer.tsx (calls /api/analytics/events instead of /api/events)',
        exactDisconnected: 'Client product experience telemetry dispatch is completely disconnected',
      });
    }

    if (ep.path.startsWith('/api/admin/') && !['/api/admin/auth/state', '/api/admin/auth/audit'].includes(ep.path)) {
      if (res.status === 200 && ep.method === 'POST') {
        addIssue({
          id: `SEC-ADMIN-UNAUTH-POST-${ep.path.replace(/\//g, '-')}`,
          section: 'SECTION 14 — SECURITY AUDIT',
          page: ep.path,
          device: 'ALL',
          userType: 'ATTACKER',
          severity: '🔴 CRITICAL',
          whatIDid: `Executed unauthenticated POST to ${ep.path}`,
          whatIExpected: 'HTTP 401 Unauthorized or 403 Forbidden',
          whatActuallyHappened: `HTTP ${res.status} Success without valid admin token`,
          backendResult: `HTTP ${res.status}`,
          dbResult: 'Unauthorized mutation possible',
          rootCause: 'Missing requireAdminAuth middleware/check inside route handler',
          exactDisconnected: 'Admin route authorization barrier',
        });
      }
    }
  }
  auditReport.sections.apis = apiResults;
}

async function runSection5_CustomerJourneyTrace() {
  console.log('\n--- [SECTION 5 & 6] AUDITING COMPLETE CUSTOMER PURCHASE LIFECYCLE ---');

  // 1. Get Product Bengaluru Tee
  const { data: product, error: prodErr } = await sb
    .from('products')
    .select('*, product_sizes(*)')
    .eq('slug', 'bengaluru-tee')
    .single();

  console.log('  1. Product Fetch:', product ? `✅ ${product.name} (Price: ₹${product.price_paise/100})` : `❌ ${prodErr?.message}`);

  // 2. Add to Cart API
  const cartRes = await testHttp('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: product?.id || '00000000-0000-0000-0000-000000000001',
      size: 'M',
      quantity: 1,
      purchaseMode: 'PREBOOK'
    })
  });
  console.log('  2. Cart API Response:', cartRes.status, cartRes.json);

  // 3. Create Order API with GST and shipping
  const createOrderRes = await testHttp('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cartId: cartRes.json?.id || 'test-cart-id',
      guestEmail: 'auditor@bexyee.com',
      address: {
        name: 'BEXYEE Auditor',
        phone: '9876543210',
        line1: '100ft Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
      },
      attribution: { utm_source: 'qa_audit' }
    })
  });
  console.log('  3. Create Order API Response:', createOrderRes.status, createOrderRes.json);

  // 4. Test Webhook with forged signature vs valid signature
  const webhookFakeRes = await testHttp('/api/webhooks/razorpay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': 'fake_forged_signature_123'
    },
    body: JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: { id: 'pay_test123', order_id: 'order_test123', amount: 179900 } } }
    })
  });
  console.log('  4. Razorpay Webhook Invalid Sig Rejection:', webhookFakeRes.status === 400 || webhookFakeRes.status === 401 ? '✅ BLOCKED' : `❌ ALLOWED (${webhookFakeRes.status})`);

  // 5. Test Pincode Validation
  const pinValidRes = await testHttp('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cartId: 'dummy',
      guestEmail: 'test@bexyee.com',
      address: { name: 'Test', phone: '9876543210', line1: 'Test', city: 'Test', state: 'Test', pincode: '000000' } // Invalid Indian PIN
    })
  });
  console.log('  5. Invalid PIN Code Rejection:', pinValidRes.status === 400 ? '✅ REJECTED 400' : `⚠️ Status: ${pinValidRes.status}`);
}

async function runSection8_ProductControlCenterTrace() {
  console.log('\n--- [SECTION 8 & 12] AUDITING PRODUCT CONTROL CENTER & STOREFRONT SYNC ---');

  // Query sample active product and verify all fields needed by storefront
  const { data: prods } = await sb.from('products').select('*').limit(3);
  for (const p of prods || []) {
    const hasSlug = !!p.slug;
    const hasPrice = typeof p.price_paise === 'number';
    const hasEdition = !!p.edition;
    const hasStatus = !!p.status;
    console.log(`  Product [${p.name}]: Slug=${hasSlug ? '✅' : '❌'}, Price=${hasPrice ? '✅' : '❌'}, Status=${p.status}`);
  }
}

async function runSection13_Performance() {
  console.log('\n--- [SECTION 13] BENCHMARKING CRITICAL PATH LATENCIES ---');
  const latencies = [];
  for (let i = 0; i < 3; i++) {
    const res = await testHttp('/products');
    latencies.push(res.durationMs);
  }
  const avg = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
  console.log(`  Catalog Latency (Avg over 3 runs): ${avg}ms`);

  const cartBench = [];
  for (let i = 0; i < 3; i++) {
    const res = await testHttp('/api/cart');
    cartBench.push(res.durationMs);
  }
  const cartAvg = Math.round(cartBench.reduce((a, b) => a + b, 0) / cartBench.length);
  console.log(`  Cart API Latency (Avg over 3 runs): ${cartAvg}ms`);
}

async function main() {
  await runSection1_RouteDiscovery();
  await runSection4_ApiEndpoints();
  await runSection5_CustomerJourneyTrace();
  await runSection8_ProductControlCenterTrace();
  await runSection13_Performance();

  console.log('\n================================================================');
  console.log(`TOTAL ISSUES IDENTIFIED: ${auditReport.issues.length}`);
  console.log('================================================================');
}

main();
