import http from 'http';

const routes = [
  '/',
  '/bengaluru',
  '/products',
  '/products/bengaluru-tee',
  '/product/bengaluru-tee',
  '/collections',
  '/collections/monsoon-2026',
  '/search',
  '/cart',
  '/checkout',
  '/order/success',
  '/track',
  '/account',
  '/account/orders',
  '/account/addresses',
  '/account/profile',
  '/account/wishlist',
  '/account/security',
  '/about',
  '/lookbook',
  '/stories',
  '/stories/rain-and-signals',
  '/blog',
  '/blog/crafting-the-240gsm-loopknit',
  '/size-guide',
  '/faq',
  '/contact',
  '/legal/terms',
  '/legal/privacy',
  '/legal/shipping-returns',
  '/cities',
  '/cities/bengaluru',
  '/achievements',
  '/admin/login',
  '/admin/reset-password',
  '/admin/change-password',
  '/admin',
  '/admin/settings/security',
  '/admin/products/bengaluru-tee',
];

async function fetchRoute(path) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.get(`http://127.0.0.1:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const titleMatch = data.match(/<title>([^<]*)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : '(No Title)';
        const isRedirect = res.statusCode >= 300 && res.statusCode < 400;
        const location = res.headers['location'] || '';
        const hasError = data.includes('Application error') || data.includes('Unhandled Runtime Error');
        resolve({
          path,
          status: res.statusCode,
          duration: Date.now() - start,
          size: data.length,
          title,
          isRedirect,
          location,
          hasError,
        });
      });
    });
    req.on('error', (err) => {
      resolve({ path, status: 0, duration: Date.now() - start, error: err.message, hasError: true });
    });
  });
}

async function run() {
  console.log('--- FAST COMPREHENSIVE ROUTE TESTER ---');
  for (const r of routes) {
    const res = await fetchRoute(r);
    const icon = (res.status === 200 || (res.path.startsWith('/admin') && res.status === 307)) && !res.hasError ? '✅' : '❌';
    console.log(
      `${icon} [${res.status}] ${r.padEnd(35)} ${String(res.duration + 'ms').padStart(8)} ` +
      `${String(res.size || 0).padStart(8)}B ` +
      `${res.location ? '-> ' + res.location : ''} ` +
      `${res.hasError ? '💥 ERROR DETECTED' : ''}`
    );
  }
}

run();
