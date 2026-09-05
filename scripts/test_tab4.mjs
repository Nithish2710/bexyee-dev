import puppeteer from 'puppeteer-core';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:3000';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const sbAnon = createClient(supabaseUrl, supabaseAnonKey);

async function testTab() {
  const { data: authData } = await sbAnon.auth.signInWithPassword({
    email: 'prakashgyr007@gmail.com',
    password: 'Yogaradj@007',
  });
  const session = authData?.session;

  const cookiesObj = {};
  const ssrClient = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return Object.entries(cookiesObj).map(([name, value]) => ({ name, value })); },
      setAll(c) { c.forEach(({ name, value }) => { cookiesObj[name] = value; }); },
    },
  });
  if (session) {
    await ssrClient.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });
  }
  const cookieEntries = Object.entries(cookiesObj);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  for (const [name, value] of cookieEntries) {
    await page.setCookie({ name, value, domain: '127.0.0.1', path: '/' });
  }

  await page.goto(`${BASE_URL}/admin/products/bengaluru-tee`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  const clickResult = await page.evaluate(() => {
    const el = document.getElementById('tab-btn-background');
    if (!el) return { found: false };
    el.click();
    return { found: true, id: el.id, text: el.innerText };
  });
  console.log('Click Result:', clickResult);

  await new Promise(r => setTimeout(r, 1500));

  const text = await page.evaluate(() => document.body.innerText);
  const foundModes = {
    hasDefaultStudio: text.includes('DEFAULT BEXYEE STUDIO') || text.includes('A. DEFAULT'),
    hasCollection: text.includes('COLLECTION ENVIRONMENT') || text.includes('B. COLLECTION'),
    hasProductSpecific: text.includes('PRODUCT-SPECIFIC') || text.includes('C. PRODUCT'),
    hasClean: text.includes('NO BACKGROUND') || text.includes('D. NO BACKGROUND'),
  };
  console.log('Found Modes:', foundModes);

  await browser.close();
}

testTab();
