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

async function runFullInspection() {
  console.log('================================================================');
  console.log('  BEXYEE MASTER ADMIN & BACKEND PERMUTATION AUDIT              ');
  console.log('================================================================\n');

  // 1. Authenticate with Supabase Auth using the user provided credentials
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

  // 2. Generate exact Supabase SSR cookie
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
  console.log(`Generated ${cookieEntries.length} SSR cookies:`, Object.keys(cookiesObj));

  // 3. Launch Puppeteer Browser
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Set cookies in browser
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

  // 4. Navigate to /admin
  console.log('\n--- VISUAL TAB AUDIT: ADMIN DASHBOARD & CONTROL CENTER ---');
  console.log('2. Navigating to /admin...');
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
  console.log('URL after /admin:', page.url());

  const dashPath = path.join(ARTIFACT_DIR, 'ADMIN-REAL-DASHBOARD.png');
  await page.screenshot({ path: dashPath });
  console.log('✅ Captured ADMIN-REAL-DASHBOARD.png');

  // 5. Navigate to Product Control Center
  console.log('3. Navigating to /admin/products/bengaluru-tee...');
  await page.goto(`${BASE_URL}/admin/products/bengaluru-tee`, { waitUntil: 'networkidle0' });
  console.log('URL after Control Center:', page.url());

  const pccPath = path.join(ARTIFACT_DIR, 'ADMIN-REAL-CONTROL-CENTER.png');
  await page.screenshot({ path: pccPath });
  console.log('✅ Captured ADMIN-REAL-CONTROL-CENTER.png');

  // 6. Inspect & Capture all 8 tabs
  const TABS = ['PRODUCT', 'INVENTORY', 'ASSETS', 'BACKGROUND', 'LAUNCH', 'PREVIEW', 'PERFORMANCE'];
  for (const tab of TABS) {
    try {
      const clicked = await page.evaluate((tabName) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent && b.textContent.trim().toUpperCase() === tabName);
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      }, tab);

      if (clicked) {
        await new Promise(r => setTimeout(r, 600));
        const filename = `ADMIN-PCC-TAB-${tab.toLowerCase()}-1920.png`;
        await page.screenshot({ path: path.join(ARTIFACT_DIR, filename) });
        console.log(`✅ Captured Tab Screenshot: ${filename}`);
      }
    } catch (e) {
      console.error(`Tab error ${tab}:`, e.message);
    }
  }

  await browser.close();

  // 7. API Mutator Helper
  const cookieHeader = cookieEntries.map(([k, v]) => `${k}=${v}`).join('; ');

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

  console.log('\n--- LIVE BACKEND PERMUTATION, COMBINATION & SYNC AUDIT ---');

  // Fetch initial product
  const { data: prod } = await sbService.from('products').select('*').eq('slug', 'bengaluru-tee').single();
  const productId = prod.id;
  const originalPrice = prod.price_paise ? prod.price_paise / 100 : 1799;
  const originalDesc = prod.description;

  // PERMUTATION 1: Product Price & Description Mutation -> DB -> Storefront
  console.log('\n[Permutation 1: Price & Description Mutation]');
  console.log(`Current Price: ₹${originalPrice} -> Mutating to ₹1899`);
  const patchRes1 = await callAdminApi('/api/admin/products', 'PATCH', {
    id: productId,
    price: 1899,
    description: 'Updated description during master backend audit.'
  });
  console.log('PATCH /api/admin/products Status:', patchRes1.status, patchRes1.json);

  const { data: prodDb1 } = await sbService.from('products').select('price_paise, description').eq('id', productId).single();
  console.log(`DB Price after update: ₹${prodDb1.price_paise / 100} (${prodDb1.price_paise} paise)`);

  const sf1 = await fetch(`${BASE_URL}/product/bengaluru-tee`).then(r => r.text());
  console.log('Storefront reflects new price ₹1,899:', (sf1.includes('1,899') || sf1.includes('1899')) ? '✅ YES' : '❌ NO');

  // Revert Price
  await callAdminApi('/api/admin/products', 'PATCH', {
    id: productId,
    price: originalPrice,
    description: originalDesc
  });
  console.log(`Reverted price back to ₹${originalPrice}`);

  // PERMUTATION 2: Purchase Mode State Transition (PREBOOK -> BUY_NOW -> PREBOOK)
  console.log('\n[Permutation 2: Purchase Mode State Transition]');
  const patchModeRes = await callAdminApi('/api/admin/products', 'PATCH', {
    id: productId,
    purchaseMode: 'BUY_NOW',
    isPrebook: false
  });
  console.log('PATCH Purchase Mode to BUY_NOW Status:', patchModeRes.status, patchModeRes.json);

  const { data: launchDb1 } = await sbService.from('launches').select('utm_campaign').eq('product_id', productId).single();
  console.log('Launch utm_campaign JSON in DB:', launchDb1?.utm_campaign);

  // Revert back to PREBOOK
  await callAdminApi('/api/admin/products', 'PATCH', {
    id: productId,
    purchaseMode: 'PREBOOK',
    isPrebook: true,
    sizePrebookLimits: { S: 25, M: 60, L: 35, XL: 25 }
  });
  console.log('Reverted back to PREBOOK with size limits');

  // PERMUTATION 3: Inventory Matrix Adjustment & Stress Check
  console.log('\n[Permutation 3: Inventory Matrix Adjustment (Size M)]');
  const invBefore = await sbService.from('product_sizes').select('stock_quantity').eq('product_id', productId).eq('size', 'M').single();
  const currentM = invBefore.data?.stock_quantity ?? 15;

  const invAdjRes = await callAdminApi('/api/admin/inventory', 'POST', {
    productId,
    size: 'M',
    mode: 'ADD',
    amount: 5,
    reason: 'Master audit batch check'
  });
  console.log('POST /api/admin/inventory Status:', invAdjRes.status, invAdjRes.json);

  const { data: invAfter } = await sbService.from('product_sizes').select('stock_quantity').eq('product_id', productId).eq('size', 'M').single();
  console.log(`Stock for Size M: was ${currentM} -> now ${invAfter?.stock_quantity}`);

  // Revert stock
  await callAdminApi('/api/admin/inventory', 'POST', {
    productId,
    size: 'M',
    mode: 'SET',
    amount: currentM,
    reason: 'Reverting test stock'
  });
  console.log(`Reverted Size M stock back to ${currentM}`);

  // PERMUTATION 4: Launch State Pause & Resume
  console.log('\n[Permutation 4: Launch State Pause & Resume]');
  const pauseRes = await callAdminApi('/api/admin/products', 'PATCH', {
    id: productId,
    status: 'PAUSED'
  });
  console.log('Pause status:', pauseRes.status, pauseRes.json);

  const { data: launchDb2 } = await sbService.from('launches').select('status').eq('product_id', productId).single();
  console.log('Launch status in DB:', launchDb2?.status);

  // Resume launch
  const resumeRes = await callAdminApi('/api/admin/products', 'PATCH', {
    id: productId,
    status: 'ACTIVE'
  });
  console.log('Resume status:', resumeRes.status, resumeRes.json);

  // PERMUTATION 5: Secondary Admin Endpoints Audit
  console.log('\n[Permutation 5: Secondary Admin Endpoints Readability]');
  const ordersRes = await callAdminApi('/api/admin/orders');
  console.log('GET /api/admin/orders Status:', ordersRes.status, 'Total orders:', Array.isArray(ordersRes.json?.orders) ? ordersRes.json.orders.length : ordersRes.json);

  const refundsRes = await callAdminApi('/api/admin/refunds');
  console.log('GET /api/admin/refunds Status:', refundsRes.status);

  const campaignsRes = await callAdminApi('/api/admin/campaigns');
  console.log('GET /api/admin/campaigns Status:', campaignsRes.status);

  console.log('\n================================================================');
  console.log('  MASTER ADMIN AUDIT VERIFICATION COMPLETE                      ');
  console.log('================================================================');
}

runFullInspection();
