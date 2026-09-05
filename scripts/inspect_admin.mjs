import puppeteer from 'puppeteer-core';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:3000';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const sbAnon = createClient(supabaseUrl, supabaseAnonKey);

async function inspectAdmin() {
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
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  for (const [name, value] of cookieEntries) {
    await page.setCookie({ name, value, domain: '127.0.0.1', path: '/' });
  }

  await page.goto(`${BASE_URL}/admin/products/00000000-0000-0000-0000-000000000001`, { waitUntil: 'networkidle2' });
  console.log('Current URL:', page.url());

  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim());
  });
  console.log('Buttons on page:', buttons);

  await browser.close();
}

inspectAdmin();
