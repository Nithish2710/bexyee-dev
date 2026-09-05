import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:3000';
const ARTIFACT_DIR = 'C:\\Users\\rad\\.gemini\\antigravity-ide\\brain\\1e661a50-01fe-4490-af6b-710e2a3fdb1d\\screenshots';

async function testAdminFlow() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('requestfailed', req => console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText));

  console.log('1. Navigating to /admin/login');
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle0' });

  // Direct login execution inside page context to verify Supabase SSR client
  console.log('2. Executing signInWithPassword in browser context...');
  const loginResult = await page.evaluate(async () => {
    try {
      const emailInput = document.querySelector('input[type="email"]');
      const passInput = document.querySelector('input[type="password"]');
      
      // Set input values
      emailInput.value = 'prakashgyr007@gmail.com';
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      passInput.value = 'Yogaradj@007';
      passInput.dispatchEvent(new Event('input', { bubbles: true }));

      // Find form and submit
      const form = document.querySelector('form');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      return { success: true };
    } catch (e) {
      return { error: e.message };
    }
  });
  console.log('Login trigger result:', loginResult);

  // Wait 4 seconds for Supabase Auth API call & Cookie establishment
  await new Promise(r => setTimeout(r, 4000));

  console.log('3. Current URL:', page.url());
  const cookies = await page.cookies();
  console.log('4. Cookies issued:', cookies.map(c => `${c.name} (${c.value.length}b)`));

  // Check state endpoint
  const stateCheck = await page.evaluate(async () => {
    const res = await fetch('/api/admin/auth/state');
    return { status: res.status, json: await res.json().catch(() => null) };
  });
  console.log('5. State check from browser context:', stateCheck);

  // Navigate to /admin
  console.log('6. Navigating to /admin');
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
  console.log('URL after /admin:', page.url());

  const destPath = path.join(ARTIFACT_DIR, 'ADMIN-REAL-AUTHENTICATED.png');
  await page.screenshot({ path: destPath });
  console.log('✅ Captured ADMIN-REAL-AUTHENTICATED.png');

  // Navigate to Product Control Center
  console.log('7. Navigating to /admin/products/bengaluru-tee');
  await page.goto(`${BASE_URL}/admin/products/bengaluru-tee`, { waitUntil: 'networkidle0' });
  console.log('URL after Product Control Center:', page.url());

  const pccPath = path.join(ARTIFACT_DIR, 'ADMIN-PRODUCT-CONTROL-CENTER-LIVE.png');
  await page.screenshot({ path: pccPath });
  console.log('✅ Captured ADMIN-PRODUCT-CONTROL-CENTER-LIVE.png');

  await browser.close();
}

testAdminFlow();
