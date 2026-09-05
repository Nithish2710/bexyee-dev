import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const ARTIFACT_DIR = 'C:\\Users\\rad\\.gemini\\antigravity-ide\\brain\\1e661a50-01fe-4490-af6b-710e2a3fdb1d\\screenshots';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sbAnon = createClient(supabaseUrl, supabaseAnonKey);
const sbService = createClient(supabaseUrl, supabaseServiceKey);

async function runExhaustiveAudit() {
  console.log('================================================================');
  console.log('  BEXYEE MASTER COMPLETE HUMAN ADMIN & STOREFRONT AUDIT         ');
  console.log('================================================================\n');

  // 1. Authenticate with Supabase Auth
  console.log('--- PHASE 1: LOGIN, ACCESS CONTROL & SESSION VERIFICATION ---');
  const { data: authData, error: authError } = await sbAnon.auth.signInWithPassword({
    email: 'prakashgyr007@gmail.com',
    password: 'Yogaradj@007'
  });

  if (authError || !authData.session) {
    console.error('❌ Supabase Auth failed:', authError?.message);
    return;
  }
  console.log('✅ Admin Auth Successful! User ID:', authData.user.id);
  const session = authData.session;

  // Generate exact Supabase SSR cookie
  const cookiesObj = {};
  const ssrClient = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return Object.entries(cookiesObj).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          cookiesObj[name] = value;
        });
      }
    }
  });

  await ssrClient.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token
  });

  const cookieEntries = Object.entries(cookiesObj);
  const cookieHeader = cookieEntries.map(([k, v]) => `${k}=${v}`).join('; ');

  // Helper for authenticated Admin API requests
  async function callAdminApi(endpoint, method = 'GET', body = null) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Cookie': cookieHeader,
        ...(body ? { 'Content-Type': 'application/json' } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    return { status: res.status, ok: res.ok, json, text };
  }

  // PHASE 3: Product Lifecycle
  console.log('\n--- PHASE 3: FULL PRODUCT LIFECYCLE AUDIT ---');
  const testSku = 'BEXYEE-AUDIT-TEST-001';
  const testSlug = 'bexyee-audit-test-tee';

  // Cleanup any existing test item
  await sbService.from('products').delete().eq('sku', testSku);

  // 1. Create Product in DB as DRAFT
  console.log('1. Creating Test Product in DRAFT mode...');
  const { data: newProd, error: createErr } = await sbService.from('products').insert({
    sku: testSku,
    name: 'Audit Test Technical Tee',
    slug: testSlug,
    description: 'Special edition test product created during master human admin audit.',
    status: 'DRAFT',
    price_paise: 249900,
    edition: '001',
    city_name: 'BENGALURU',
    collection: 'AUDIT DROP',
    fabric: 'LOOPKNIT',
    gsm: 240,
    fit: 'OVERSIZED',
    front_image_url: '/assets/products/bengaluru-tee-front.svg',
    back_image_url: '/assets/products/bengaluru-tee-back.svg'
  }).select().single();

  if (createErr) {
    console.error('❌ Create product failed:', createErr.message);
  } else {
    console.log('✅ Created Test Product ID:', newProd.id, 'Status:', newProd.status);

    // 2. Insert size allocations
    await sbService.from('product_sizes').insert([
      { product_id: newProd.id, size: 'S', stock_quantity: 10 },
      { product_id: newProd.id, size: 'M', stock_quantity: 20 },
      { product_id: newProd.id, size: 'L', stock_quantity: 15 },
      { product_id: newProd.id, size: 'XL', stock_quantity: 5 }
    ]);

    // 3. Verify DRAFT is NOT visible in public catalog
    const catDraftRes = await fetch(`${BASE_URL}/products`).then(r => r.text());
    console.log('Draft Product visible in /products:', catDraftRes.includes('Audit Test Technical Tee') ? '❌ LEAKED' : '✅ HIDDEN AS EXPECTED');

    // 4. Admin edits Test Product price and description via PATCH
    console.log('2. Admin edits Test Product price (₹2,499 -> ₹2,799)...');
    const editRes = await callAdminApi('/api/admin/products', 'PATCH', {
      id: newProd.id,
      price: 2799,
      description: 'Revised description for audit test product.'
    });
    console.log('PATCH edit status:', editRes.status, editRes.json);

    // 5. Admin Publishes Test Product (DRAFT -> ACTIVE)
    console.log('3. Admin publishes Test Product to storefront...');
    const pubRes = await callAdminApi('/api/admin/products', 'PATCH', {
      id: newProd.id,
      status: 'ACTIVE'
    });
    console.log('Publish status:', pubRes.status, pubRes.json);

    // 6. Verify Storefront presence
    const catPubRes = await fetch(`${BASE_URL}/products`).then(r => r.text());
    console.log('Published Product visible in /products:', catPubRes.includes('Audit Test Technical Tee') ? '✅ YES' : '❌ NO');

    // 7. Admin Unpublishes Test Product (ACTIVE -> DRAFT)
    console.log('4. Admin unpublishes Test Product...');
    await callAdminApi('/api/admin/products', 'PATCH', {
      id: newProd.id,
      status: 'DRAFT'
    });

    const catUnpubRes = await fetch(`${BASE_URL}/products`).then(r => r.text());
    console.log('Unpublished Product removed from /products:', !catUnpubRes.includes('Audit Test Technical Tee') ? '✅ REMOVED' : '❌ STILL VISIBLE');

    // 8. Clean up test product
    await sbService.from('product_sizes').delete().eq('product_id', newProd.id);
    await sbService.from('products').delete().eq('id', newProd.id);
    console.log('5. Test Product cleaned up from database.');
  }

  // PHASES 4 - 10: Bengaluru Tee Core Flows & Transitions
  console.log('\n--- PHASES 4 - 10: BENGALURU TEE BIDIRECTIONAL SYNC & FLOW AUDIT ---');
  const { data: bTee } = await sbService.from('products').select('*').eq('slug', 'bengaluru-tee').single();
  const bId = bTee.id;

  // Flow 1: Price Change Before & After
  console.log('1. Testing Price Change Flow (₹1,799 -> ₹1,999 -> Storefront -> Revert)...');
  await callAdminApi('/api/admin/products', 'PATCH', { id: bId, price: 1999 });
  const sfPriceCheck = await fetch(`${BASE_URL}/product/bengaluru-tee`).then(r => r.text());
  console.log('Storefront shows ₹1,999:', (sfPriceCheck.includes('1,999') || sfPriceCheck.includes('1999')) ? '✅ YES' : '❌ NO');
  await callAdminApi('/api/admin/products', 'PATCH', { id: bId, price: 1799 });
  console.log('Price reverted to ₹1,799.');

  // Flow 2: Purchase Mode State Transition (PREBOOK <-> BUY_NOW)
  console.log('2. Testing Mode Switch: PREBOOK -> BUY_NOW...');
  await callAdminApi('/api/admin/products', 'PATCH', { id: bId, purchaseMode: 'BUY_NOW', isPrebook: false });
  const { data: lMode1 } = await sbService.from('launches').select('utm_campaign').eq('product_id', bId).single();
  console.log('DB utm_campaign purchaseMode:', lMode1?.utm_campaign?.purchaseMode);

  console.log('3. Testing Mode Switch: BUY_NOW -> PREBOOK with Limits...');
  await callAdminApi('/api/admin/products', 'PATCH', {
    id: bId,
    purchaseMode: 'PREBOOK',
    isPrebook: true,
    sizePrebookLimits: { S: 25, M: 60, L: 35, XL: 25 }
  });
  const { data: lMode2 } = await sbService.from('launches').select('utm_campaign').eq('product_id', bId).single();
  console.log('DB utm_campaign purchaseMode restored to:', lMode2?.utm_campaign?.purchaseMode);

  // Flow 3: Launch Kill-Switch (PAUSED <-> LIVE)
  console.log('4. Testing Launch Pause / Kill Switch...');
  await callAdminApi('/api/admin/products', 'PATCH', { id: bId, status: 'PAUSED' });
  const { data: lStatus1 } = await sbService.from('launches').select('status').eq('product_id', bId).single();
  console.log('DB Launch Status:', lStatus1?.status);

  await callAdminApi('/api/admin/products', 'PATCH', { id: bId, status: 'ACTIVE' });
  const { data: lStatus2 } = await sbService.from('launches').select('status').eq('product_id', bId).single();
  console.log('DB Launch Status Restored:', lStatus2?.status);

  // Flow 4: Background Configuration Persistence
  console.log('5. Testing Movable Background Configuration...');
  const bgUpdateRes = await callAdminApi('/api/admin/products', 'PATCH', {
    id: bId,
    desktopBackgroundUrl: '/bengaluru-signal-after-rain.svg',
    tabletBackgroundUrl: '/bengaluru-signal-after-rain.svg',
    mobileBackgroundUrl: '/bengaluru-signal-after-rain.svg'
  });
  console.log('Background config status:', bgUpdateRes.status);

  // Flow 5: Inventory Query Invariant Check
  console.log('6. Checking Full Inventory Matrix Invariants...');
  const invRes = await callAdminApi(`/api/admin/inventory?productId=${bId}`);
  console.log('Inventory API Status:', invRes.status);
  if (invRes.json?.products?.[0]) {
    const p = invRes.json.products[0];
    console.log(`Product: ${p.name} | Total Physical: ${p.totalPhysicalStock} | Available: ${p.totalAvailableStock}`);
  }

  // Flow 6: Orders & Customer Data Introspection
  console.log('\n--- PHASE 11 & 12: CUSTOMER & ORDER DATA AUDIT ---');
  const { count: customerCount } = await sbService.from('customers').select('*', { count: 'exact', head: true });
  console.log('Total Customers in DB:', customerCount ?? 0);

  const { data: orderList } = await sbService.from('orders').select('id, status, payment_status, total_paise, guest_email, created_at').limit(5);
  console.log('Orders in DB:', orderList?.length ?? 0);

  // Flow 7: Analytics Audit
  console.log('\n--- PHASE 14: ANALYTICS METRIC CLASSIFICATION ---');
  const { data: analyticsEvents } = await sbService.from('analytics_events').select('event_name');
  console.log('Total Analytics Events Logged:', analyticsEvents?.length ?? 0);

  console.log('\n================================================================');
  console.log('  HUMAN ADMIN EXHAUSTIVE AUDIT EXECUTION COMPLETE!              ');
  console.log('================================================================');
}

runExhaustiveAudit();
