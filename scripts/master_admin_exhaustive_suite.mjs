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

async function runExhaustiveAdminSuite() {
  console.log('================================================================');
  console.log('  BEXYEE MASTER ADMIN EXHAUSTIVE BACKEND & STOREFRONT SUITE     ');
  console.log('================================================================\n');

  // 1. Authenticate with Supabase Auth
  console.log('1. Authenticating as prakashgyr007@gmail.com...');
  const { data: authData, error: authError } = await sbAnon.auth.signInWithPassword({
    email: 'prakashgyr007@gmail.com',
    password: 'Yogaradj@007'
  });

  if (authError || !authData.session) {
    console.error('❌ Supabase Auth failed:', authError?.message);
    return;
  }
  console.log('✅ Supabase Auth Successful! User ID:', authData.user.id);
  const session = authData.session;

  // 2. Generate Supabase SSR cookie
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

  // 3. Launch Puppeteer Browser for Visual Tab Captures
  console.log('\n--- SECTION A: REAL BROWSER TAB CAPTURES ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  for (const [name, value] of cookieEntries) {
    await page.setCookie({
      name,
      value,
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
    });
  }

  // Dashboard Capture
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ADMIN-REAL-DASHBOARD.png') });
  console.log('✅ Captured ADMIN-REAL-DASHBOARD.png');

  // Control Center Navigation
  await page.goto(`${BASE_URL}/admin/products/bengaluru-tee`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ADMIN-REAL-CONTROL-CENTER.png') });
  console.log('✅ Captured ADMIN-REAL-CONTROL-CENTER.png');

  // Capture all tabs in Control Center
  const TABS = [
    'PRODUCT',
    'INVENTORY',
    'ASSETS',
    'BACKGROUND',
    'LAUNCH',
    'PURCHASE MODE',
    'PREVIEW',
    'PERFORMANCE'
  ];

  for (const tab of TABS) {
    try {
      const clicked = await page.evaluate((tabName) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent && b.textContent.trim().toUpperCase().includes(tabName));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      }, tab);

      if (clicked) {
        await new Promise(r => setTimeout(r, 600));
        const filename = `ADMIN-PCC-TAB-${tab.toLowerCase().replace(/\s+/g, '-')}-1920.png`;
        await page.screenshot({ path: path.join(ARTIFACT_DIR, filename) });
        console.log(`✅ Captured Tab: ${filename}`);
      }
    } catch (e) {
      console.error(`Tab error ${tab}:`, e.message);
    }
  }

  await browser.close();

  // 4. API Mutator Helper
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

  console.log('\n--- SECTION B: BACKEND MUTATION & STOREFRONT SYNC PERMUTATIONS ---');

  const { data: prod } = await sbService.from('products').select('*').eq('slug', 'bengaluru-tee').single();
  const productId = prod.id;
  const originalPrice = prod.price_paise ? prod.price_paise / 100 : 1799;
  const originalDesc = prod.description;

  // PERMUTATION 1: Price & Description Mutation -> Storefront Sync
  console.log('\n[Permutation 1: Product Price Mutation]');
  console.log(`Current Price: ₹${originalPrice} -> Mutating to ₹1899`);
  const p1Res = await callAdminApi('/api/admin/products', 'PATCH', {
    id: productId,
    price: 1899,
    description: 'Master Audit Updated Description'
  });
  console.log('PATCH /api/admin/products Status:', p1Res.status, p1Res.json);

  const { data: prodDb1 } = await sbService.from('products').select('price_paise').eq('id', productId).single();
  console.log('DB Price after update:', prodDb1.price_paise, 'paise (₹' + prodDb1.price_paise / 100 + ')');

  const sf1 = await fetch(`${BASE_URL}/product/bengaluru-tee`).then(r => r.text());
  console.log('Storefront reflects new price ₹1,899:', (sf1.includes('1,899') || sf1.includes('1899')) ? '✅ YES' : '❌ NO');

  // Revert price
  await callAdminApi('/api/admin/products', 'PATCH', {
    id: productId,
    price: originalPrice,
    description: originalDesc
  });
  console.log(`Reverted price back to ₹${originalPrice}`);

  // PERMUTATION 2: Purchase Mode State Transition (PREBOOK <-> BUY_NOW)
  console.log('\n[Permutation 2: Purchase Mode Transition]');
  const p2Res = await callAdminApi('/api/admin/products', 'PATCH', {
    id: productId,
    purchaseMode: 'BUY_NOW',
    isPrebook: false
  });
  console.log('Switch to BUY_NOW Status:', p2Res.status, p2Res.json);

  const { data: launchDb1 } = await sbService.from('launches').select('utm_campaign').eq('product_id', productId).single();
  console.log('Launch utm_campaign JSON in DB:', launchDb1?.utm_campaign);

  // Revert to PREBOOK
  await callAdminApi('/api/admin/products', 'PATCH', {
    id: productId,
    purchaseMode: 'PREBOOK',
    isPrebook: true,
    sizePrebookLimits: { S: 25, M: 60, L: 35, XL: 25 }
  });
  console.log('Reverted back to PREBOOK with per-size limits');

  // PERMUTATION 3: Physical Stock Adjustment with Audit Trail
  console.log('\n[Permutation 3: Physical Stock Adjustment]');
  const { data: mBefore } = await sbService.from('product_sizes').select('stock_quantity').eq('product_id', productId).eq('size', 'M').single();
  const currentM = mBefore.stock_quantity;
  console.log(`Current Size M physical stock in DB: ${currentM}`);

  const p3Res = await callAdminApi('/api/admin/inventory', 'POST', {
    productId,
    size: 'M',
    delta: 5,
    reason: 'Master Permutation Batch Audit Verification'
  });
  console.log('POST /api/admin/inventory Status:', p3Res.status, p3Res.json);

  const { data: mAfter } = await sbService.from('product_sizes').select('stock_quantity').eq('product_id', productId).eq('size', 'M').single();
  console.log(`Size M physical stock after +5 delta: ${mAfter.stock_quantity}`);

  // Revert stock with delta -5
  await callAdminApi('/api/admin/inventory', 'POST', {
    productId,
    size: 'M',
    delta: -5,
    reason: 'Reverting test delta'
  });
  console.log(`Reverted Size M stock back to ${currentM}`);

  // PERMUTATION 4: Inventory Matrix & Reservation Math Calculation
  console.log('\n[Permutation 4: Full Inventory Matrix Query]');
  const invMatrixRes = await callAdminApi(`/api/admin/inventory?productId=${productId}`);
  console.log('GET /api/admin/inventory Status:', invMatrixRes.status);
  if (invMatrixRes.json?.products?.[0]) {
    const pInfo = invMatrixRes.json.products[0];
    console.log(`Product: ${pInfo.name} | Total Physical: ${pInfo.totalPhysicalStock} | Total Reserved: ${pInfo.totalReservedStock} | Total Available: ${pInfo.totalAvailableStock}`);
    console.table(pInfo.sizes.map(s => ({
      Size: s.size,
      Physical: s.physicalStock,
      Reserved: s.reservedStock,
      Available: s.availableStock,
      Status: s.isOutOfStock ? 'OUT OF STOCK' : (s.isLowStock ? 'LOW STOCK' : 'IN STOCK')
    })));
  }

  // PERMUTATION 5: Launch Status Mutation (PAUSED <-> LIVE)
  console.log('\n[Permutation 5: Launch Status Mutation]');
  const pauseRes = await callAdminApi('/api/admin/products', 'PATCH', {
    id: productId,
    status: 'PAUSED'
  });
  console.log('Pause status:', pauseRes.status, pauseRes.json);

  const { data: lPaused } = await sbService.from('launches').select('status').eq('product_id', productId).single();
  console.log('Launch status in DB:', lPaused.status);

  // Resume launch
  const resumeRes = await callAdminApi('/api/admin/products', 'PATCH', {
    id: productId,
    status: 'ACTIVE'
  });
  console.log('Resume status:', resumeRes.status, resumeRes.json);

  // PERMUTATION 6: Secondary Admin Operations Check
  console.log('\n[Permutation 6: Secondary Admin Routes Health]');
  const ordersRes = await callAdminApi('/api/admin/orders');
  console.log('GET /api/admin/orders Status:', ordersRes.status, 'Orders count:', Array.isArray(ordersRes.json?.orders) ? ordersRes.json.orders.length : 0);

  const refundsRes = await callAdminApi('/api/admin/refunds');
  console.log('GET /api/admin/refunds Status:', refundsRes.status);

  const campaignsRes = await callAdminApi('/api/admin/campaigns');
  console.log('GET /api/admin/campaigns Status:', campaignsRes.status);

  console.log('\n================================================================');
  console.log('  ALL ADMIN BACKEND PERMUTATIONS & TAB AUDITS COMPLETED!       ');
  console.log('================================================================');
}

runExhaustiveAdminSuite();
