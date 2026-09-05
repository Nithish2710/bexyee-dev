import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:3000';
const ARTIFACT_DIR = 'C:\\Users\\rad\\.gemini\\antigravity-ide\\brain\\1e661a50-01fe-4490-af6b-710e2a3fdb1d\\screenshots';
const LOCAL_DIR = path.resolve('screenshots');

if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true });

const VIEWPORTS = {
  'desktop-1920': { width: 1920, height: 1080, isMobile: false },
  'desktop-1440': { width: 1440, height: 900, isMobile: false },
  'tablet-1024': { width: 1024, height: 1366, isMobile: true },
  'tablet-768': { width: 768, height: 1024, isMobile: true },
  'mobile-414': { width: 414, height: 896, isMobile: true },
  'mobile-375': { width: 375, height: 812, isMobile: true },
};

const PAGES = [
  { name: '01-home', path: '/' },
  { name: '02-bengaluru-drop', path: '/bengaluru' },
  { name: '03-catalog', path: '/products' },
  { name: '04-product-detail', path: '/product/bengaluru-tee' },
  { name: '05-cart', path: '/cart' },
  { name: '06-checkout', path: '/checkout' },
  { name: '07-order-track', path: '/track' },
  { name: '08-lookbook', path: '/lookbook' },
  { name: '09-stories', path: '/stories' },
  { name: '10-size-guide', path: '/size-guide' },
  { name: '11-admin-login', path: '/admin/login' },
];

async function capture() {
  console.log('Starting Master Browser Visual Audit Suite...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const manifest = [];

  for (const p of PAGES) {
    for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
      // Capture Desktop 1920, 1440 and Mobile 375, 414 and Tablet 768
      const filename = `${p.name}-${vpName}.png`;
      const localPath = path.join(LOCAL_DIR, filename);
      const artifactPath = path.join(ARTIFACT_DIR, filename);

      try {
        await page.setViewport(vp);
        await page.goto(`${BASE_URL}${p.path}`, { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(r => setTimeout(r, 600)); // Allow animations/fonts to settle

        await page.screenshot({ path: localPath, fullPage: false });
        fs.copyFileSync(localPath, artifactPath);

        manifest.push({
          page: p.name,
          route: p.path,
          viewport: vpName,
          filename,
          artifactPath,
          sizeBytes: fs.statSync(localPath).size
        });
        console.log(`✅ Captured: ${filename} (${vp.width}x${vp.height})`);
      } catch (err) {
        console.error(`❌ Failed: ${filename} - ${err.message}`);
      }
    }
  }

  // Specific Visual Issue Captures
  console.log('\nCapturing Specific Visual Defect Evidence...');
  
  // Issue 1: Cart Mobile Compression
  try {
    await page.setViewport(VIEWPORTS['mobile-375']);
    // Seed cart in localStorage
    await page.evaluate(() => {
      window.localStorage.setItem('bexyee_cart', JSON.stringify([
        {
          productId: '00000000-0000-0000-0000-000000000001',
          size: 'M',
          quantity: 2,
          products: {
            name: 'Bengaluru Edition Heavyweight Tee',
            price_paise: 179900,
            front_image_url: '/assets/products/bengaluru-tee-front.svg'
          }
        }
      ]));
    });
    await page.goto(`${BASE_URL}/cart`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    const cartIssuePath = path.join(LOCAL_DIR, 'ISSUE-001-cart-mobile-compression.png');
    await page.screenshot({ path: cartIssuePath });
    fs.copyFileSync(cartIssuePath, path.join(ARTIFACT_DIR, 'ISSUE-001-cart-mobile-compression.png'));
    console.log('✅ Captured ISSUE-001-cart-mobile-compression.png');
  } catch (err) {
    console.error('Error capturing Issue 1:', err);
  }

  // Issue 2: Order Tracking Error on lookup
  try {
    await page.setViewport(VIEWPORTS['desktop-1440']);
    await page.goto(`${BASE_URL}/track`, { waitUntil: 'networkidle0' });
    await page.type('input[placeholder*="ID" i], input[type="text"]', 'ORD-BEX-2026-TEST');
    await page.type('input[placeholder*="Email" i], input[type="email"]', 'customer@bexyee.com');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1000));
    const trackIssuePath = path.join(LOCAL_DIR, 'ISSUE-002-order-tracking-lookup.png');
    await page.screenshot({ path: trackIssuePath });
    fs.copyFileSync(trackIssuePath, path.join(ARTIFACT_DIR, 'ISSUE-002-order-tracking-lookup.png'));
    console.log('✅ Captured ISSUE-002-order-tracking-lookup.png');
  } catch (err) {
    console.error('Error capturing Issue 2:', err);
  }

  await browser.close();

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`\n🎉 Visual Suite Complete! Total screenshots captured: ${manifest.length + 2}`);
}

capture();
