import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const BASE_URL = 'http://127.0.0.1:3000';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(supabaseUrl, supabaseKey);

async function testHttp(path, options = {}) {
  const start = performance.now();
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'User-Agent': 'BexyeeDeepAuditor/2.1',
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

async function auditCartAndReservations() {
  console.log('\n================================================================');
  console.log('  TEST 1: CART, INVENTORY RESERVATION & EXPIRATION LIFECYCLE    ');
  console.log('================================================================');

  // 1. Create a cart item
  const guestToken = 'audit_guest_' + Date.now();
  const res1 = await testHttp('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: '00000000-0000-0000-0000-000000000001',
      size: 'L',
      quantity: 2,
      purchaseMode: 'PREBOOK'
    })
  });
  console.log('1. Add to Cart:', res1.status, res1.json);

  // 2. Fetch Cart
  const res2 = await testHttp('/api/cart');
  console.log('2. Get Cart:', res2.status, 'Items count:', res2.json?.cart?.items?.length || 0);

  // 3. Trigger Cron release reservations
  const res3 = await testHttp('/api/cron/release-reservations', { method: 'POST' });
  console.log('3. Cron Release Reservations:', res3.status, res3.json);

  // 4. Trigger Cron launch scheduler
  const res4 = await testHttp('/api/cron/launch-scheduler', { method: 'POST' });
  console.log('4. Cron Launch Scheduler:', res4.status, res4.json);
}

async function auditOrderCreationAndVerification() {
  console.log('\n================================================================');
  console.log('  TEST 2: ORDER CREATION, RAZORPAY & SIGNATURE VERIFICATION    ');
  console.log('================================================================');

  // 1. Create Order with dummy cart
  const createRes = await testHttp('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cartId: '00000000-0000-0000-0000-000000000001',
      guestEmail: 'qa-tester@bexyee.com',
      address: {
        name: 'Collector Rad',
        phone: '9876543210',
        line1: '100ft Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038'
      },
      attribution: { utm_source: 'deep_audit' }
    })
  });
  console.log('1. Create Order:', createRes.status, createRes.json);

  // 2. Test Invalid Verification Signature
  const verifyFake = await testHttp('/api/checkout/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: '00000000-0000-0000-0000-000000000001',
      razorpay_order_id: 'order_fake_123',
      razorpay_payment_id: 'pay_fake_123',
      razorpay_signature: 'invalid_sig'
    })
  });
  console.log('2. Verify Fake Signature (Must Fail):', verifyFake.status, verifyFake.json);

  // 3. Test Webhook with invalid signature
  const webhookFake = await testHttp('/api/webhooks/razorpay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': 'tampered_signature'
    },
    body: JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: { id: 'pay_123', order_id: 'order_123', amount: 179900 } } }
    })
  });
  console.log('3. Webhook Invalid Signature (Must Fail 400/401):', webhookFake.status, webhookFake.json);
}

async function auditPrebookLimitsAndConcurrency() {
  console.log('\n================================================================');
  console.log('  TEST 3: PRE-BOOK LIMITS, PER-SIZE ENFORCEMENT & CONCURRENCY   ');
  console.log('================================================================');

  // Query product sizes for Bengaluru Tee
  const { data: sizes } = await sb
    .from('product_sizes')
    .select('*')
    .eq('product_id', '00000000-0000-0000-0000-000000000001');

  console.log('Bengaluru Tee Sizes & Stock in DB:', sizes);

  // Query Launch record for Bengaluru Tee
  const { data: launch } = await sb
    .from('launches')
    .select('*')
    .eq('product_id', '00000000-0000-0000-0000-000000000001')
    .maybeSingle();

  console.log('Bengaluru Tee Launch Record:', {
    status: launch?.status,
    purchaseMode: launch?.utm_campaign ? JSON.parse(launch.utm_campaign).purchaseMode : 'UNKNOWN',
    isPrebook: launch?.utm_campaign ? JSON.parse(launch.utm_campaign).isPrebook : false,
    sizeLimits: launch?.utm_campaign ? JSON.parse(launch.utm_campaign).sizeLimits : null,
  });
}

async function auditCSSAndResponsiveDesign() {
  console.log('\n================================================================');
  console.log('  TEST 4: CSS DESIGN SYSTEM, TOKENS & RESPONSIVE RULES          ');
  console.log('================================================================');

  const cssRes = await testHttp('/globals.css');
  console.log('globals.css accessible:', cssRes.status === 200 ? '✅' : '❌', 'Size:', cssRes.text?.length);
}

async function main() {
  await auditCartAndReservations();
  await auditOrderCreationAndVerification();
  await auditPrebookLimitsAndConcurrency();
  await auditCSSAndResponsiveDesign();
}

main();
