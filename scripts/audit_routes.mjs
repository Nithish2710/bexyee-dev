import http from 'http';

const BASE_URL = 'http://localhost:3000';

const routesToTest = [
  // Customer Routes
  { path: '/', name: 'Homepage', type: 'CUSTOMER' },
  { path: '/bengaluru', name: 'Bengaluru Monsoon Drop', type: 'CUSTOMER' },
  { path: '/products', name: 'Products Catalog', type: 'CUSTOMER' },
  { path: '/products/bengaluru-tee', name: 'Product Detail (products)', type: 'CUSTOMER' },
  { path: '/product/bengaluru-tee', name: 'Product Detail (product)', type: 'CUSTOMER' },
  { path: '/collections', name: 'Collections Index', type: 'CUSTOMER' },
  { path: '/collections/monsoon-2026', name: 'Collection Detail', type: 'CUSTOMER' },
  { path: '/search', name: 'Search Page', type: 'CUSTOMER' },
  { path: '/cart', name: 'Cart Page', type: 'CUSTOMER' },
  { path: '/checkout', name: 'Checkout Page', type: 'CUSTOMER' },
  { path: '/order/success', name: 'Order Success Page', type: 'CUSTOMER' },
  { path: '/track', name: 'Order Tracking Page', type: 'CUSTOMER' },
  { path: '/account', name: 'Customer Account Page', type: 'CUSTOMER' },
  { path: '/account/orders', name: 'Account Orders', type: 'CUSTOMER' },
  { path: '/account/addresses', name: 'Account Addresses', type: 'CUSTOMER' },
  { path: '/account/profile', name: 'Account Profile', type: 'CUSTOMER' },
  { path: '/account/wishlist', name: 'Account Wishlist', type: 'CUSTOMER' },
  { path: '/account/security', name: 'Account Security', type: 'CUSTOMER' },
  { path: '/about', name: 'About Page', type: 'CUSTOMER' },
  { path: '/lookbook', name: 'Lookbook Page', type: 'CUSTOMER' },
  { path: '/stories', name: 'Stories Index', type: 'CUSTOMER' },
  { path: '/stories/rain-and-signals', name: 'Story Detail', type: 'CUSTOMER' },
  { path: '/blog', name: 'Blog Index', type: 'CUSTOMER' },
  { path: '/blog/crafting-the-240gsm-loopknit', name: 'Blog Detail', type: 'CUSTOMER' },
  { path: '/size-guide', name: 'Size Guide Page', type: 'CUSTOMER' },
  { path: '/faq', name: 'FAQ Page', type: 'CUSTOMER' },
  { path: '/contact', name: 'Contact Page', type: 'CUSTOMER' },
  { path: '/legal/terms', name: 'Terms & Conditions', type: 'CUSTOMER' },
  { path: '/legal/privacy', name: 'Privacy Policy', type: 'CUSTOMER' },
  { path: '/legal/shipping-returns', name: 'Shipping & Returns', type: 'CUSTOMER' },
  { path: '/cities', name: 'Cities Index', type: 'CUSTOMER' },
  { path: '/cities/bengaluru', name: 'City Detail', type: 'CUSTOMER' },
  { path: '/achievements', name: 'Achievements Page', type: 'CUSTOMER' },
  { path: '/non-existent-page-404', name: '404 Handling', type: 'CUSTOMER' },

  // Admin Routes
  { path: '/admin/login', name: 'Admin Login', type: 'ADMIN' },
  { path: '/admin', name: 'Admin Dashboard (Unauthenticated Redirect)', type: 'ADMIN' },
  { path: '/admin/products/bengaluru-tee', name: 'Admin Product Control Center (Unauth)', type: 'ADMIN' },
  { path: '/admin/settings/security', name: 'Admin Security Settings (Unauth)', type: 'ADMIN' },
  { path: '/admin/change-password', name: 'Admin Change Password (Unauth)', type: 'ADMIN' },
  { path: '/admin/reset-password', name: 'Admin Reset Password', type: 'ADMIN' },
];

async function fetchRoute(route) {
  const start = Date.now();
  try {
    const res = await fetch(`${BASE_URL}${route.path}`, {
      headers: {
        'User-Agent': 'Bexyee-Auditor/1.0',
        'Accept': 'text/html,application/xhtml+xml',
      },
      redirect: 'manual', // capture redirects
    });
    const duration = Date.now() - start;
    const bodyText = await res.text();
    const location = res.headers.get('location');

    return {
      route,
      status: res.status,
      duration,
      location,
      htmlLength: bodyText.length,
      hasTitle: /<title>([^<]*)<\/title>/i.test(bodyText),
      title: (bodyText.match(/<title>([^<]*)<\/title>/i) || [])[1] || '',
      hasViewport: /<meta[^>]*name=["']viewport["']/i.test(bodyText),
      hasDescription: /<meta[^>]*name=["']description["']/i.test(bodyText),
      hasNextError: bodyText.includes('__next_error__') || bodyText.includes('Application error'),
      hasGlobalHeader: bodyText.includes('header') || bodyText.includes('BEXYEE'),
      hasFooter: bodyText.includes('footer') || bodyText.includes('COPYRIGHT') || bodyText.includes('BEXYEE'),
    };
  } catch (err) {
    return {
      route,
      status: 0,
      duration: Date.now() - start,
      error: err.message,
    };
  }
}

async function runAudit() {
  console.log('================================================================');
  console.log('       BEXYEE PLATFORM ROUTE & SSR AUDIT SUITE                 ');
  console.log('================================================================\n');

  const results = [];
  for (const r of routesToTest) {
    const res = await fetchRoute(r);
    results.push(res);
    const statusIcon = res.status >= 200 && res.status < 300 ? '✅' :
                       res.status >= 300 && res.status < 400 ? '🔀' :
                       res.status === 404 ? '⚠️' : '❌';
    console.log(
      `${statusIcon} [${res.status}] ${r.type.padEnd(8)} ${r.name.padEnd(35)} ` +
      `(${res.duration}ms, ${res.htmlLength || 0} bytes) ` +
      `${res.location ? '-> ' + res.location : ''} ` +
      `${res.hasTitle ? `Title: "${res.title.substring(0, 30)}..."` : 'NO TITLE'} ` +
      `${res.hasNextError ? '💥 SSR ERROR DETECTED!' : ''}`
    );
  }

  console.log('\n================================================================');
  console.log('Route Audit Complete. Total Routes Audited:', results.length);
}

runAudit();
