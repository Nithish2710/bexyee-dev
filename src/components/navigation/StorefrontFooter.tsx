"use client";

import Link from "next/link";

export function StorefrontFooter() {
  return (
    <footer className="bexyee-storefront-footer" role="contentinfo">
      <div className="footer-top-grid">
        {/* Brand Column */}
        <div className="footer-brand-col">
          <Link href="/" className="footer-brand-logo">
            BEXYEE<span className="brand-slash">/</span>STUDIO
          </Link>
          <p className="footer-brand-tagline">
            Limited-edition architectural streetwear engineered for the metropolis. Handcrafted in India.
          </p>
          <div className="footer-geo-tag">
            <span>COORDINATES:</span> 12.9716° N, 77.5946° E
          </div>
        </div>

        {/* Navigation Links Columns */}
        <div className="footer-links-col">
          <span className="footer-col-header">CATALOG</span>
          <ul className="footer-col-list">
            <li><Link href="/products">Shop All Releases</Link></li>
            <li><Link href="/product/bengaluru-tee">New: Bengaluru Drop</Link></li>
            <li><Link href="/collections">Capsules</Link></li>
            <li><Link href="/cities">Metropolis Network</Link></li>
            <li><Link href="/lookbook">Lookbook</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <span className="footer-col-header">SUPPORT</span>
          <ul className="footer-col-list">
            <li><Link href="/account/orders">Orders</Link></li>
            <li><Link href="/track">Track Order</Link></li>
            <li><Link href="/legal/refunds">Returns &amp; Exchanges</Link></li>
            <li><Link href="/size-guide">Size Guide</Link></li>
            <li><Link href="/contact">Contact &amp; Concierge</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <span className="footer-col-header">CONNECT &amp; ABOUT</span>
          <ul className="footer-col-list">
            <li><Link href="/about">Design Philosophy</Link></li>
            <li><Link href="/blog">320 GSM Loopknit Journal</Link></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram ↗</a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube ↗</a></li>
            <li><Link href="/stories">City Stories</Link></li>
          </ul>
        </div>

        {/* Newsletter / Bulletin */}
        <div className="footer-newsletter-col">
          <span className="footer-col-header">ARCHIVE DISPATCH</span>
          <p className="footer-newsletter-copy">
            Receive private access signals 15 minutes before public drop windows.
          </p>
          <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="ENTER EMAIL"
              aria-label="Email address for drop notifications"
              required
            />
            <button type="submit" aria-label="Subscribe to signals">
              JOIN ↗
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-left">
          <span>© 2026 BEXYEE STUDIO. ALL RIGHTS RESERVED.</span>
          <span className="bullet-sep">•</span>
          <span>320 GSM COMBED COTTON // BENGALURU, INDIA</span>
        </div>
        <div className="footer-bottom-links">
          <Link href="/legal/privacy">Privacy Policy</Link>
          <Link href="/legal/terms">Terms of Service</Link>
          <Link href="/legal/shipping">Shipping Policy</Link>
          <Link href="/legal/refunds">Refund Policy</Link>
          <Link href="/admin/login" className="footer-admin-link">Ops ↗</Link>
        </div>
      </div>
    </footer>
  );
}
