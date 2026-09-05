import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:3000';
const ARTIFACT_DIR = 'C:\\Users\\rad\\.gemini\\antigravity-ide\\brain\\1e661a50-01fe-4490-af6b-710e2a3fdb1d\\screenshots';
const LOCAL_DIR = path.resolve('screenshots');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sbService = createClient(supabaseUrl, supabaseServiceKey);
const sbAnon = createClient(supabaseUrl, supabaseAnonKey);

async function masterAdminAudit() {
  console.log('================================================================');
  console.log('  BEXYEE MASTER ADMIN BACKEND & STOREFRONT SYNC AUDIT           ');
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

  // Generate exact base64 cookie
  const session = authData.session;
  const cookiePayload = JSON.stringify({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    user: authData.user
  });
  const base64CookieValue = 'base64-' + Buffer.from(cookiePayload).toString('base64');
  const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
  const cookieName = `sb-${projectRef}-auth-token`;

  // 2. Launch Real Browser
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Set cookies for both 127.0.0.1 and localhost
  for (const domain of ['127.0.0.1', 'localhost']) {
    await page.setCookie({
      name: cookieName,
      value: base64CookieValue,
      domain,
      path: '/',
      httpOnly: false,
      secure: false,
    });
  }

  // 3. Navigate to /admin
  console.log('2. Navigating to /admin with authenticated session...');
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
  console.log('URL after navigation:', page.url());

  const dashPath = path.join(ARTIFACT_DIR, 'ADMIN-AUTHENTICATED-DASHBOARD.png');
  await page.screenshot({ path: dashPath });
  console.log('✅ Captured ADMIN-AUTHENTICATED-DASHBOARD.png');

  // 4. Navigate to Product Control Center
  console.log('3. Navigating to /admin/products/bengaluru-tee...');
  await page.goto(`${BASE_URL}/admin/products/bengaluru-tee`, { waitUntil: 'networkidle0' });
  console.log('URL after PCC navigation:', page.url());

  const pccPath = path.join(ARTIFACT_DIR, 'ADMIN-AUTHENTICATED-CONTROL-CENTER.png');
  await page.screenshot({ path: pccPath });
  console.log('✅ Captured ADMIN-AUTHENTICATED-CONTROL-CENTER.png');

  // 5. Capture All 8 Tabs in the Control Center
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

  // 6. Test Live Backend Mutations with Authenticated Cookie Header
  const cookieHeader = `${cookieName}=${base64CookieValue}`;

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

  console.log('\n--- PHASE 2: Live Backend Mutation & Synchronization Permutations ---');

  // Fetch product ID for Bengaluru Tee
  const { data: prod } = await sbService.from('products').select('*').eq('slug', 'bengaluru-tee').single();
  const productId = prod.id;
  const originalPricePaise = prod.price_paise || 179900;
  const originalDesc = prod.description;

  // PERMUTATION 1: Product Price Mutation & Storefront Sync
  console.log('\n[Permutation 1] Admin edits Product Price (₹1,799 -> ₹1,899)');
  const patchPriceRes = await callAdminApi('/api/admin/products', 'PATCH', {
    id: productId,
    price: 1899,
    description: 'Updated description during master backend audit.'
  });
  console.log('PATCH /api/admin/products Status:', patchPriceRes.status, patchPriceRes.json);

  // Check Database
  const { data: prodDb1 } = await sbService.from('products').select('price_paise, description').eq('id', productId).single();
  console.log('DB Price after update:', prodDb1.price_paise, 'paise (₹' + prodDb1.price_paise / 100 + ')');

  // Check Storefront
  const sf1 = await fetch(`${BASE_URL}/product/bengaluru-tee`).then(r => r.text());
  const sfPriceMatch = sf1.includes('1,899') || sf1.includes('1899');
  console.log('Storefront reflects new price ₹1,899:', sfPriceMatch ? '✅ YES' : '❌ NO');

  // Revert Price
  await callAdminApi('/api/admin/products', 'PATCH', {
    id: productId,
    price: originalPricePaise / 100,
    description: originalDesc
  });
  console.log('Reverted price back to ₹' + originalPricePaise / 100);

  // PERMUTATION 2: Purchase Mode State Transition (PREBOOK <-> BUY_NOW)
  console.log('\n[Permutation 2] Admin toggles Purchase Mode: PREBOOK -> BUY_NOW');
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
  console.log('\n[Permutation 3] Admin adjusts Stock for Size M (+5 units)');
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
  console.log('\n[Permutation 4] Admin pauses drop launch (PAUSED)');
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

  console.log('\n================================================================');
  console.log('  MASTER ADMIN AUDIT VERIFICATION COMPLETE                      ');
  console.log('================================================================');
}

masterAdminAudit();
