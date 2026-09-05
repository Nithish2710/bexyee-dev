import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:3000';
const ARTIFACT_DIR = 'C:\\Users\\rad\\.gemini\\antigravity-ide\\brain\\1e661a50-01fe-4490-af6b-710e2a3fdb1d\\screenshots';
const LOCAL_DIR = path.resolve('screenshots');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(supabaseUrl, supabaseKey);

async function runAdminAudit() {
  console.log('================================================================');
  console.log('  BEXYEE MASTER ADMIN BACKEND PERMUTATION & SYNC AUDIT          ');
  console.log('================================================================\n');

  // 1. Browser Login & Tab Visual Inspection
  console.log('--- PHASE 1: Real Browser Admin Authentication & Tab Inspection ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Navigate to login
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle0' });
  await page.type('input[type="email"]', 'prakashgyr007@gmail.com');
  await page.type('input[type="password"]', 'Yogaradj@007');
  
  // Submit login
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);

  console.log('Current URL after login attempt:', page.url());

  // Capture Admin Shell / Dashboard
  await page.screenshot({ path: path.join(LOCAL_DIR, 'ADMIN-01-dashboard-1920.png') });
  fs.copyFileSync(path.join(LOCAL_DIR, 'ADMIN-01-dashboard-1920.png'), path.join(ARTIFACT_DIR, 'ADMIN-01-dashboard-1920.png'));
  console.log('✅ Captured ADMIN-01-dashboard-1920.png');

  // Navigate to Product Control Center
  await page.goto(`${BASE_URL}/admin/products/bengaluru-tee`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  const TABS = ['PRODUCT', 'INVENTORY', 'ASSETS', 'BACKGROUND', 'LAUNCH', 'PREVIEW', 'PERFORMANCE'];
  for (const tab of TABS) {
    try {
      // Find button matching tab text
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await (await btn.getProperty('textContent')).jsonValue();
        if (text && text.trim().toUpperCase().includes(tab)) {
          await btn.click();
          await new Promise(r => setTimeout(r, 600));
          break;
        }
      }
      const filename = `ADMIN-02-control-center-${tab.toLowerCase()}-1920.png`;
      await page.screenshot({ path: path.join(LOCAL_DIR, filename) });
      fs.copyFileSync(path.join(LOCAL_DIR, filename), path.join(ARTIFACT_DIR, filename));
      console.log(`✅ Captured Tab: ${filename}`);
    } catch (e) {
      console.error(`Error on tab ${tab}:`, e.message);
    }
  }

  // Extract cookies for API requests
  const cookies = await page.cookies();
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

  await browser.close();

  // Helper for Admin API requests
  async function adminApi(path, method = 'GET', body = null) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Cookie': cookieHeader,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    return { status: res.status, ok: res.ok, json, text };
  }

  console.log('\n--- PHASE 2: Live Backend Mutation & Synchronization Permutations ---');

  // PERMUTATION 1: Product Price & Metadata Mutation
  console.log('\n[Permutation 1] Admin edits Product Price & Description');
  const initialProduct = await sb.from('products').select('*').eq('slug', 'bengaluru-tee').single();
  const originalPrice = initialProduct.data?.price_paise ? initialProduct.data.price_paise / 100 : 1799;
  const testPrice = 1899;

  console.log(`Original Price: ₹${originalPrice} -> Mutating to ₹${testPrice}`);
  const patchRes = await adminApi('/api/admin/products', 'PATCH', {
    id: initialProduct.data.id,
    price: testPrice,
    description: 'Updated description by Master Permutation Auditor.'
  });
  console.log('PATCH /api/admin/products status:', patchRes.status, patchRes.json);

  // Verify Database
  const dbAfterPrice = await sb.from('products').select('price_paise, description').eq('slug', 'bengaluru-tee').single();
  console.log('Database verification:', dbAfterPrice.data);

  // Verify Storefront Response
  const storefrontRes = await fetch(`${BASE_URL}/product/bengaluru-tee`);
  const storefrontText = await storefrontRes.text();
  const priceInStorefront = storefrontText.includes('1,899') || storefrontText.includes('1899');
  console.log('Storefront reflects new price ₹1,899:', priceInStorefront ? '✅ YES' : '❌ NO (Cached or Mismatch)');

  // Revert Price
  await adminApi('/api/admin/products', 'PATCH', {
    id: initialProduct.data.id,
    price: originalPrice,
    description: initialProduct.data.description
  });
  console.log(`Reverted price back to ₹${originalPrice}`);

  // PERMUTATION 2: Purchase Mode State Transition (BUY_NOW <-> PREBOOK)
  console.log('\n[Permutation 2] Admin toggles Purchase Mode: PREBOOK -> BUY_NOW');
  const modeRes = await adminApi('/api/admin/products', 'PATCH', {
    id: initialProduct.data.id,
    purchaseMode: 'BUY_NOW',
    isPrebook: false
  });
  console.log('Switch to BUY_NOW status:', modeRes.status, modeRes.json);

  // Check launch table
  const launchAfterBuyNow = await sb.from('launches').select('utm_campaign').eq('product_id', initialProduct.data.id).single();
  console.log('Launch utm_campaign JSON in DB:', launchAfterBuyNow.data?.utm_campaign);

  // Revert back to PREBOOK
  await adminApi('/api/admin/products', 'PATCH', {
    id: initialProduct.data.id,
    purchaseMode: 'PREBOOK',
    isPrebook: true,
    sizePrebookLimits: { S: 25, M: 60, L: 35, XL: 25 }
  });
  console.log('Reverted back to PREBOOK with per-size limits');

  // PERMUTATION 3: Inventory Matrix Adjustment
  console.log('\n[Permutation 3] Admin adjusts Physical Stock (Size M +5 units)');
  const invBefore = await sb.from('product_sizes').select('stock_quantity').eq('product_id', initialProduct.data.id).eq('size', 'M').single();
  const currentM = invBefore.data?.stock_quantity ?? 15;
  
  const invRes = await adminApi('/api/admin/inventory', 'POST', {
    productId: initialProduct.data.id,
    size: 'M',
    mode: 'ADD',
    amount: 5,
    reason: 'Permutation test batch check'
  });
  console.log('Inventory POST /api/admin/inventory status:', invRes.status, invRes.json);

  const invAfter = await sb.from('product_sizes').select('stock_quantity').eq('product_id', initialProduct.data.id).eq('size', 'M').single();
  console.log(`Stock for Size M: was ${currentM} -> now ${invAfter.data?.stock_quantity}`);

  // Revert Stock
  await adminApi('/api/admin/inventory', 'POST', {
    productId: initialProduct.data.id,
    size: 'M',
    mode: 'SET',
    amount: currentM,
    reason: 'Reverting test stock'
  });
  console.log(`Reverted Size M stock back to ${currentM}`);

  // PERMUTATION 4: Launch State Pause & Resume
  console.log('\n[Permutation 4] Admin pauses drop launch (PAUSED -> LIVE)');
  const pauseRes = await adminApi('/api/admin/products', 'PATCH', {
    id: initialProduct.data.id,
    status: 'PAUSED'
  });
  console.log('Pause launch status:', pauseRes.status, pauseRes.json);

  const launchDb = await sb.from('launches').select('status').eq('product_id', initialProduct.data.id).single();
  console.log('Launch status in DB:', launchDb.data?.status);

  // Resume launch
  const resumeRes = await adminApi('/api/admin/products', 'PATCH', {
    id: initialProduct.data.id,
    status: 'ACTIVE'
  });
  console.log('Resume launch status:', resumeRes.status, resumeRes.json);

  console.log('\n================================================================');
  console.log('  ADMIN BACKEND PERMUTATION AUDIT COMPLETE                      ');
  console.log('================================================================');
}

runAdminAudit();
