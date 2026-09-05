import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:3000';
const SCREENSHOTS_DIR = path.resolve('C:/Users/rad/.gemini/antigravity-ide/brain/1e661a50-01fe-4490-af6b-710e2a3fdb1d/screenshots');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const sbAnon = createClient(supabaseUrl, supabaseAnonKey);
const sbService = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function run() {
  console.log('================================================================');
  console.log('  BEXYEE PRODUCT BACKGROUND ISOLATION & ENVIRONMENT TEST SUITE  ');
  console.log('================================================================');

  const results = {
    timestamp: new Date().toISOString(),
    tests: [],
  };

  // 1. Authenticate Admin Session
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

  // 2. Prepare or Seed Products in Supabase
  console.log('\n[SETUP] Preparing database products for isolation tests...');

  // Ensure Studio Campaign exists
  let studioCampaignId = '00000000-0000-0000-0000-000000000002';
  const { data: existingCamp } = await sbService.from('campaigns').select('id').eq('slug', 'studio-campaign').maybeSingle();
  if (!existingCamp) {
    await sbService.from('campaigns').insert({
      id: studioCampaignId,
      slug: 'studio-campaign',
      city_name: '',
      campaign_title: 'STUDIO\nARCHIVE',
      background_image: '/assets/environments/bexyee-studio-neutral.svg',
      accent_color: '#E52B20',
      active: true,
    });
  } else {
    studioCampaignId = existingCamp.id;
  }

  // Ensure Studio Tee (Product B) exists
  const { data: existingStudio } = await sbService.from('products').select('id').eq('slug', 'studio-tee').maybeSingle();
  let studioId = existingStudio?.id;

  if (!existingStudio) {
    const { data: newProd } = await sbService
      .from('products')
      .insert({
        campaign_id: studioCampaignId,
        name: 'Studio Heavyweight Uniform',
        slug: 'studio-tee',
        sku: 'BEXYEE-STU-001',
        edition: 'ARCHIVE 001',
        collection: 'ARCHIVE CAPSULE',
        city_name: '',
        price_paise: 189900,
        description: 'Architectural 320 GSM loopknit cotton uniform in neutral obsidian studio environment.',
        fabric: '320 GSM SUPER LOOPKNIT',
        gsm: 320,
        fit: 'OVERSIZED',
        status: 'ACTIVE',
      })
      .select('id')
      .single();

    if (newProd) {
      studioId = newProd.id;
      await sbService.from('product_sizes').insert([
        { product_id: newProd.id, size: 'S', stock_quantity: 10 },
        { product_id: newProd.id, size: 'M', stock_quantity: 15 },
        { product_id: newProd.id, size: 'L', stock_quantity: 12 },
        { product_id: newProd.id, size: 'XL', stock_quantity: 8 },
      ]);
      await sbService.from('launches').insert({
        product_id: newProd.id,
        name: 'Studio Launch',
        slug: 'studio-launch',
        status: 'LIVE',
        utm_campaign: JSON.stringify({ purchaseMode: 'BUY_NOW', backgroundType: 'DEFAULT_STUDIO' }),
      });
      await sbService.from('product_assets').insert([
        { product_id: newProd.id, slot: 'BACKGROUND_DESKTOP', url: '/assets/environments/bexyee-studio-neutral.svg', is_active: true, version: 1 },
      ]);
      console.log('✓ Created Studio Tee Product:', studioId);
    }
  } else {
    await sbService
      .from('products')
      .update({
        campaign_id: studioCampaignId,
        city_name: '',
        collection: 'ARCHIVE CAPSULE',
        status: 'ACTIVE',
      })
      .eq('id', existingStudio.id);

    const { data: launch } = await sbService.from('launches').select('id').eq('product_id', existingStudio.id).maybeSingle();
    if (launch) {
      await sbService.from('launches').update({
        status: 'LIVE',
        utm_campaign: JSON.stringify({ purchaseMode: 'BUY_NOW', backgroundType: 'DEFAULT_STUDIO' }),
      }).eq('id', launch.id);
    } else {
      await sbService.from('launches').insert({
        product_id: existingStudio.id,
        name: 'Studio Launch',
        slug: 'studio-launch',
        status: 'LIVE',
        utm_campaign: JSON.stringify({ purchaseMode: 'BUY_NOW', backgroundType: 'DEFAULT_STUDIO' }),
      });
    }
    console.log('✓ Updated Studio Tee Product to LIVE Active Studio mode');
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(120000);
  page.setDefaultTimeout(120000);

  for (const [name, value] of cookieEntries) {
    await page.setCookie({ name, value, domain: '127.0.0.1', path: '/' });
    await page.setCookie({ name, value, domain: 'localhost', path: '/' });
  }

  try {
    // ------------------------------------------------------------------------
    // SCENARIO 1: Product A — Bengaluru Edition (/products/bengaluru-tee)
    // ------------------------------------------------------------------------
    console.log('\n[SCENARIO 1] Testing Product A: Bengaluru Edition (/products/bengaluru-tee)');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/products/bengaluru-tee`, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1200));

    const blrData = await page.evaluate(() => {
      const watermark = document.querySelector('.product-hero-watermark')?.textContent?.trim() || '';
      const eyebrow = document.querySelector('.hero-eyebrow')?.textContent?.trim() || '';
      const titleCity = document.querySelector('.title-city')?.textContent?.trim() || '';
      const titleSub = document.querySelector('.title-sub')?.textContent?.trim() || '';
      const bgElement = document.querySelector('.bexyee-movable-background');
      const bgStyle = bgElement ? window.getComputedStyle(bgElement).backgroundImage : '';
      return { watermark, eyebrow, titleCity, titleSub, bgStyle };
    });

    console.log('Product A (Bengaluru Edition) Rendered Details:', blrData);
    const test1Passed =
      blrData.watermark.includes('BENGALURU') &&
      blrData.eyebrow.includes('BENGALURU') &&
      blrData.bgStyle.includes('bengaluru-signal-after-rain.svg');

    const shot1Desktop = path.join(SCREENSHOTS_DIR, 'BG-01-bengaluru-edition-desktop.png');
    await page.screenshot({ path: shot1Desktop, fullPage: false });

    await page.setViewport({ width: 375, height: 812 });
    await new Promise((r) => setTimeout(r, 500));
    const shot1Mobile = path.join(SCREENSHOTS_DIR, 'BG-01-bengaluru-edition-mobile.png');
    await page.screenshot({ path: shot1Mobile, fullPage: false });

    results.tests.push({
      scenario: 'SCENARIO_1_BENGALURU_EDITION',
      passed: test1Passed,
      data: blrData,
      screenshots: [shot1Desktop, shot1Mobile],
    });
    console.log(`[SCENARIO 1] Result: ${test1Passed ? 'PASSED ✓' : 'FAILED ✗'}`);

    // ------------------------------------------------------------------------
    // SCENARIO 2: Product B — Default BEXYEE Studio (/products/studio-tee)
    // ------------------------------------------------------------------------
    console.log('\n[SCENARIO 2] Testing Product B: Non-Bengaluru Studio Product (/products/studio-tee)');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/products/studio-tee`, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1200));

    const studioData = await page.evaluate(() => {
      const watermark = document.querySelector('.product-hero-watermark')?.textContent?.trim() || '';
      const eyebrow = document.querySelector('.hero-eyebrow')?.textContent?.trim() || '';
      const titleCity = document.querySelector('.title-city')?.textContent?.trim() || '';
      const bgElement = document.querySelector('.bexyee-movable-background');
      const bgStyle = bgElement ? window.getComputedStyle(bgElement).backgroundImage : '';
      return { watermark, eyebrow, titleCity, bgStyle };
    });

    console.log('Product B (Studio Heavyweight) Rendered Details:', studioData);
    const test2Passed =
      !studioData.watermark.toUpperCase().includes('BENGALURU') &&
      !studioData.eyebrow.toUpperCase().includes('BENGALURU') &&
      !studioData.bgStyle.includes('bengaluru-signal-after-rain.svg') &&
      studioData.bgStyle.includes('bexyee-studio-neutral.svg');

    const shot2Desktop = path.join(SCREENSHOTS_DIR, 'BG-02-default-studio-desktop.png');
    await page.screenshot({ path: shot2Desktop, fullPage: false });

    await page.setViewport({ width: 375, height: 812 });
    await new Promise((r) => setTimeout(r, 500));
    const shot2Mobile = path.join(SCREENSHOTS_DIR, 'BG-02-default-studio-mobile.png');
    await page.screenshot({ path: shot2Mobile, fullPage: false });

    results.tests.push({
      scenario: 'SCENARIO_2_DEFAULT_STUDIO_ISOLATION',
      passed: test2Passed,
      data: studioData,
      screenshots: [shot2Desktop, shot2Mobile],
    });
    console.log(`[SCENARIO 2] Result: ${test2Passed ? 'PASSED ✓' : 'FAILED ✗'}`);

    // ------------------------------------------------------------------------
    // SCENARIO 3: Admin Product Control Center — Background Tab 4 Modes UI
    // ------------------------------------------------------------------------
    console.log('\n[SCENARIO 3] Testing Admin Product Control Center — Background Tab 4 Modes UI');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/admin/products/bengaluru-tee?tab=BACKGROUND`, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1500));

    // Also click #tab-btn-background if present
    await page.evaluate(() => {
      const btn = document.getElementById('tab-btn-background') || Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Movable Background'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    const tabData = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasDefaultStudio = text.includes('DEFAULT BEXYEE STUDIO') || text.includes('A. DEFAULT');
      const hasCollection = text.includes('COLLECTION ENVIRONMENT') || text.includes('B. COLLECTION');
      const hasProductSpecific = text.includes('PRODUCT-SPECIFIC') || text.includes('C. PRODUCT');
      const hasClean = text.includes('NO BACKGROUND') || text.includes('D. NO BACKGROUND');
      return { hasDefaultStudio, hasCollection, hasProductSpecific, hasClean };
    });

    console.log('Admin Background Tab Modes Detected:', tabData);
    const test3Passed =
      tabData.hasDefaultStudio &&
      tabData.hasCollection &&
      tabData.hasProductSpecific &&
      tabData.hasClean;

    const shot3 = path.join(SCREENSHOTS_DIR, 'BG-03-admin-background-tab.png');
    await page.screenshot({ path: shot3, fullPage: false });

    results.tests.push({
      scenario: 'SCENARIO_3_ADMIN_BACKGROUND_TAB_MODES',
      passed: test3Passed,
      data: tabData,
      screenshots: [shot3],
    });
    console.log(`[SCENARIO 3] Result: ${test3Passed ? 'PASSED ✓' : 'FAILED ✗'}`);

    // ------------------------------------------------------------------------
    // SCENARIO 4: Admin Mutation ➔ Product D (No Background / Clean Studio Mode)
    // ------------------------------------------------------------------------
    console.log('\n[SCENARIO 4] Testing Mode D: Mutating to NO BACKGROUND / Clean Studio...');
    if (studioId) {
      await sbService
        .from('launches')
        .update({
          utm_campaign: JSON.stringify({ purchaseMode: 'BUY_NOW', backgroundType: 'NONE' }),
        })
        .eq('product_id', studioId);

      await sbService
        .from('product_assets')
        .update({ url: 'NONE', is_active: true })
        .eq('product_id', studioId)
        .eq('slot', 'BACKGROUND_TYPE');

      await sbService
        .from('product_assets')
        .update({ url: '', is_active: false })
        .eq('product_id', studioId)
        .eq('slot', 'BACKGROUND_DESKTOP');

      // Re-fetch storefront
      await page.goto(`${BASE_URL}/products/studio-tee`, { waitUntil: 'domcontentloaded' });
      await new Promise((r) => setTimeout(r, 1500));

      const cleanData = await page.evaluate(() => {
        const bgElement = document.querySelector('.bexyee-movable-background');
        const bgStyle = bgElement ? window.getComputedStyle(bgElement).backgroundImage : 'none';
        return { hasBgElement: !!bgElement, bgStyle };
      });

      console.log('Clean Mode Rendered Data:', cleanData);
      const test4Passed = cleanData.bgStyle === 'none' || cleanData.bgStyle === '' || !cleanData.hasBgElement;

      const shot4 = path.join(SCREENSHOTS_DIR, 'BG-04-clean-studio-mode.png');
      await page.screenshot({ path: shot4, fullPage: false });

      results.tests.push({
        scenario: 'SCENARIO_4_CLEAN_STUDIO_MODE',
        passed: test4Passed,
        data: cleanData,
        screenshots: [shot4],
      });
      console.log(`[SCENARIO 4] Result: ${test4Passed ? 'PASSED ✓' : 'FAILED ✗'}`);
    }

    // Save summary matrix
    const matrixPath = path.resolve('C:/Users/rad/.gemini/antigravity-ide/brain/1e661a50-01fe-4490-af6b-710e2a3fdb1d/background_system_verification_results.json');
    fs.writeFileSync(matrixPath, JSON.stringify(results, null, 2), 'utf8');
    console.log('\n================================================================');
    console.log(`Verification Matrix saved to: ${matrixPath}`);
    console.log('================================================================\n');

  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await browser.close();
  }
}

run();
