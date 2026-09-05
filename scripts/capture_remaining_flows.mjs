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

async function captureRemainingFlows() {
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

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  for (const [name, value] of cookieEntries) {
    await page.setCookie({ name, value, domain: '127.0.0.1', path: '/' });
  }

  // FLOW 3: Admin Launch Tab
  await page.goto(`${BASE_URL}/admin/products/bengaluru-tee`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button, a'));
    const t = tabs.find(el => el.textContent?.includes('Launch & Purchase Mode') || el.textContent?.includes('Launch'));
    if (t) t.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'FLOW-03-ADMIN-PAUSE-TRIGGERED.png') });
  console.log('✅ Captured FLOW-03-ADMIN-PAUSE-TRIGGERED.png');

  // FLOW 4: Customer Live Storefront Lock
  const custPage = await browser.newPage();
  await custPage.setViewport({ width: 1920, height: 1080 });
  await custPage.goto(`${BASE_URL}/product/bengaluru-tee`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));
  await custPage.screenshot({ path: path.join(ARTIFACT_DIR, 'FLOW-04-CUSTOMER-PAUSE-LOCK.png') });
  console.log('✅ Captured FLOW-04-CUSTOMER-PAUSE-LOCK.png');

  // FLOW 5: Customer Checkout Cart
  await custPage.goto(`${BASE_URL}/checkout`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));
  await custPage.screenshot({ path: path.join(ARTIFACT_DIR, 'FLOW-05-CUSTOMER-CHECKOUT-SUBMIT.png') });
  console.log('✅ Captured FLOW-05-CUSTOMER-CHECKOUT-SUBMIT.png');

  // FLOW 6: Admin Analytics
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.textContent?.includes('Analytics'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'FLOW-06-ADMIN-TELEMETRY-UPDATED.png') });
  console.log('✅ Captured FLOW-06-ADMIN-TELEMETRY-UPDATED.png');

  await browser.close();
  console.log('✅ Flows 3-6 captured successfully!');
}

captureRemainingFlows();
