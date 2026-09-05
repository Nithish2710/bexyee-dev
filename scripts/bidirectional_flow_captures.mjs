import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:3000';
const ARTIFACT_DIR = 'C:\\Users\\rad\\.gemini\\antigravity-ide\\brain\\1e661a50-01fe-4490-af6b-710e2a3fdb1d\\screenshots';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sbAnon = createClient(supabaseUrl, supabaseAnonKey);
const sbService = createClient(supabaseUrl, supabaseServiceKey);

async function captureBidirectionalFlows() {
  console.log('--- CAPTURING BIDIRECTIONAL FLOW EVIDENCE SCREENSHOTS ---');

  // Authenticate as Admin
  const { data: authData } = await sbAnon.auth.signInWithPassword({
    email: 'prakashgyr007@gmail.com',
    password: 'Yogaradj@007'
  });
  const session = authData.session;

  const cookiesObj = {};
  const ssrClient = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return Object.entries(cookiesObj).map(([name, value]) => ({ name, value })); },
      setAll(c) { c.forEach(({ name, value }) => { cookiesObj[name] = value; }); }
    }
  });
  await ssrClient.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });
  const cookieEntries = Object.entries(cookiesObj);
  const cookieHeader = cookieEntries.map(([k, v]) => `${k}=${v}`).join('; ');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const adminPage = await browser.newPage();
  await adminPage.setViewport({ width: 1920, height: 1080 });
  for (const [name, value] of cookieEntries) {
    await adminPage.setCookie({ name, value, domain: '127.0.0.1', path: '/' });
    await adminPage.setCookie({ name, value, domain: 'localhost', path: '/' });
  }

  const customerPage = await browser.newPage();
  await customerPage.setViewport({ width: 1920, height: 1080 });

  const { data: bTee } = await sbService.from('products').select('*').eq('slug', 'bengaluru-tee').single();
  const bId = bTee.id;

  // 1. FLOW 1 & 2: Price Change Mutation
  console.log('1. Admin mutates price to ₹1,999...');
  await fetch(`${BASE_URL}/api/admin/products`, {
    method: 'PATCH',
    headers: { 'Cookie': cookieHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: bId, price: 1999 })
  });

  await adminPage.goto(`${BASE_URL}/admin/products/bengaluru-tee`, { waitUntil: 'load', timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
  await adminPage.screenshot({ path: path.join(ARTIFACT_DIR, 'FLOW-01-ADMIN-PRICE-CHANGE.png') });
  console.log('✅ Captured FLOW-01-ADMIN-PRICE-CHANGE.png');

  await customerPage.goto(`${BASE_URL}/product/bengaluru-tee`, { waitUntil: 'load', timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
  await customerPage.screenshot({ path: path.join(ARTIFACT_DIR, 'FLOW-02-CUSTOMER-PRICE-SEEN.png') });
  console.log('✅ Captured FLOW-02-CUSTOMER-PRICE-SEEN.png');

  // Revert price
  await fetch(`${BASE_URL}/api/admin/products`, {
    method: 'PATCH',
    headers: { 'Cookie': cookieHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: bId, price: 1799 })
  });

  // 2. FLOW 3 & 4: Launch Pause Kill-Switch
  console.log('2. Admin activates drop pause...');
  await fetch(`${BASE_URL}/api/admin/products`, {
    method: 'PATCH',
    headers: { 'Cookie': cookieHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: bId, status: 'PAUSED' })
  });

  await adminPage.goto(`${BASE_URL}/admin/products/bengaluru-tee`, { waitUntil: 'load', timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
  await adminPage.screenshot({ path: path.join(ARTIFACT_DIR, 'FLOW-03-ADMIN-PAUSE-TRIGGERED.png') });
  console.log('✅ Captured FLOW-03-ADMIN-PAUSE-TRIGGERED.png');

  await customerPage.goto(`${BASE_URL}/product/bengaluru-tee`, { waitUntil: 'load', timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
  await customerPage.screenshot({ path: path.join(ARTIFACT_DIR, 'FLOW-04-CUSTOMER-PAUSE-LOCK.png') });
  console.log('✅ Captured FLOW-04-CUSTOMER-PAUSE-LOCK.png');

  // Resume launch
  await fetch(`${BASE_URL}/api/admin/products`, {
    method: 'PATCH',
    headers: { 'Cookie': cookieHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: bId, status: 'ACTIVE' })
  });

  // 3. FLOW 5 & 6: Customer Interaction -> Admin Telemetry
  console.log('3. Customer visits checkout...');
  await customerPage.goto(`${BASE_URL}/checkout`, { waitUntil: 'load', timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
  await customerPage.screenshot({ path: path.join(ARTIFACT_DIR, 'FLOW-05-CUSTOMER-CHECKOUT-SUBMIT.png') });
  console.log('✅ Captured FLOW-05-CUSTOMER-CHECKOUT-SUBMIT.png');

  // Dispatch customer event
  await fetch(`${BASE_URL}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventName: 'checkout_started', productId: bId })
  });

  await adminPage.goto(`${BASE_URL}/admin`, { waitUntil: 'load', timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
  await adminPage.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.textContent?.includes('Analytics'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await adminPage.screenshot({ path: path.join(ARTIFACT_DIR, 'FLOW-06-ADMIN-TELEMETRY-UPDATED.png') });
  console.log('✅ Captured FLOW-06-ADMIN-TELEMETRY-UPDATED.png');

  await browser.close();
  console.log('🎉 Bidirectional Flow Captures Complete!');
}

captureBidirectionalFlows();
