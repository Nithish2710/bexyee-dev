import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:3000';
const ARTIFACT_DIR = 'C:\\Users\\rad\\.gemini\\antigravity-ide\\brain\\1e661a50-01fe-4490-af6b-710e2a3fdb1d\\screenshots';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const sb = createClient(supabaseUrl, supabaseKey);

async function testRealLogin() {
  console.log('1. Signing in via Supabase Auth directly to acquire session tokens...');
  const { data: authData, error: authError } = await sb.auth.signInWithPassword({
    email: 'prakashgyr007@gmail.com',
    password: 'Yogaradj@007'
  });

  if (authError || !authData.session) {
    console.error('Supabase Auth failed:', authError?.message);
    return;
  }

  console.log('✅ Auth Succeeded! User:', authData.user.email);
  const session = authData.session;

  // Launch browser with authenticated cookies
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Set the Supabase Auth cookies into the browser context
  // @supabase/ssr uses project ID in cookie name: sb-[project-ref]-auth-token
  const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
  const cookieValue = JSON.stringify({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    user: authData.user
  });

  // Supabase chunked cookies support
  const cookieName = `sb-${projectRef}-auth-token`;
  console.log(`2. Injecting Supabase Auth cookie: ${cookieName}`);

  await page.setCookie({
    name: cookieName,
    value: encodeURIComponent(cookieValue),
    domain: '127.0.0.1',
    path: '/',
    httpOnly: false,
    secure: false,
  });

  // Also set for localhost
  await page.setCookie({
    name: cookieName,
    value: encodeURIComponent(cookieValue),
    domain: 'localhost',
    path: '/',
    httpOnly: false,
    secure: false,
  });

  console.log('3. Navigating to /admin');
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
  console.log('URL after /admin:', page.url());

  const dashPath = path.join(ARTIFACT_DIR, 'ADMIN-REAL-DASHBOARD.png');
  await page.screenshot({ path: dashPath });
  console.log('✅ Captured ADMIN-REAL-DASHBOARD.png');

  console.log('4. Navigating to /admin/products/bengaluru-tee');
  await page.goto(`${BASE_URL}/admin/products/bengaluru-tee`, { waitUntil: 'networkidle0' });
  console.log('URL after Product Control Center:', page.url());

  const pccPath = path.join(ARTIFACT_DIR, 'ADMIN-REAL-CONTROL-CENTER.png');
  await page.screenshot({ path: pccPath });
  console.log('✅ Captured ADMIN-REAL-CONTROL-CENTER.png');

  // Test all 8 tabs
  const TABS = ['PRODUCT', 'INVENTORY', 'ASSETS', 'BACKGROUND', 'LAUNCH', 'PREVIEW', 'PERFORMANCE'];
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
        const filename = `ADMIN-TAB-${tab.toLowerCase()}-1920.png`;
        await page.screenshot({ path: path.join(ARTIFACT_DIR, filename) });
        console.log(`✅ Captured: ${filename}`);
      }
    } catch (e) {
      console.error(`Tab error ${tab}:`, e.message);
    }
  }

  await browser.close();
}

testRealLogin();
