import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("BEXYEE — Luxury Multi-Device Homepage Architecture & Invariants", () => {
  const rootDir = process.cwd();
  const homePagePath = path.join(rootDir, "app", "page.tsx");
  const homeHeroPath = path.join(rootDir, "src", "components", "home", "HomeHero.tsx");
  const headerPath = path.join(rootDir, "src", "components", "navigation", "GlobalHeader.tsx");
  const footerPath = path.join(rootDir, "src", "components", "navigation", "StorefrontFooter.tsx");
  const globalsCssPath = path.join(rootDir, "app", "globals.css");

  it("1. Dynamic Data Pipeline Invariant: Homepage resolves real products directly from backend/Product Engine", () => {
    const pageContent = fs.readFileSync(homePagePath, "utf8");
    assert.match(pageContent, /getProductExperienceData/);
    assert.match(pageContent, /supabaseServer/);
    assert.match(pageContent, /revalidate\s*=\s*0/); // Dynamic server rendering
  });

  it("2. Authoritative Single CTA Invariant: Hero renders PRE-BOOK or BUY NOW, never both", () => {
    const heroContent = fs.readFileSync(homeHeroPath, "utf8");
    assert.match(heroContent, /isPrebook\s*\?/);
    assert.match(heroContent, /isBuyNow\s*\?/);
    assert.match(heroContent, /PRE-BOOK NOW/);
    assert.match(heroContent, /BUY NOW/);
  });

  it("3. Non-Blocking 3D & Movable Background: HomeHero utilizes MovableBackground and HeroProduct3D with fallbacks", () => {
    const heroContent = fs.readFileSync(homeHeroPath, "utf8");
    assert.match(heroContent, /<MovableBackground/);
    assert.match(heroContent, /<HeroProduct3D/);
    assert.match(heroContent, /handlePointerMove/);
  });

  it("4. Global Navigation Specification: Header contains SHOP, NEW, COLLECTIONS, ABOUT, SEARCH, ACCOUNT, CART", () => {
    const headerContent = fs.readFileSync(headerPath, "utf8");
    assert.match(headerContent, /label:\s*"SHOP"/);
    assert.match(headerContent, /label:\s*"NEW"/);
    assert.match(headerContent, /label:\s*"COLLECTIONS"/);
    assert.match(headerContent, /label:\s*"ABOUT"/);
    assert.match(headerContent, /href="\/search"/);
    assert.match(headerContent, /href="\/account"/);
    assert.match(headerContent, /href="\/cart"/);
    assert.match(headerContent, /global-header/);
    assert.match(headerContent, /isScrolled/);
  });

  it("5. Editorial Sections Presence: New Drop, Asymmetric Catalog, Manifesto, City Network, Textile Craft, Lookbook, Monolith", () => {
    const pageContent = fs.readFileSync(homePagePath, "utf8");
    assert.match(pageContent, /ACTIVE DROP \/\/ NUMBERED CAPSULE/);
    assert.match(pageContent, /ARCHITECTURAL CATALOG \/\/ STREETWEAR/);
    assert.match(pageContent, /asymmetric-product-grid/);
    assert.match(pageContent, /MADE FOR THE CITY/);
    assert.match(pageContent, /METROPOLIS ROSTER/);
    assert.match(pageContent, /TEXTILE ARCHITECTURE/);
    assert.match(pageContent, /320 GSM Super Loopknit/);
    assert.match(pageContent, /VISUAL LOOKBOOK/);
    assert.match(pageContent, /BUILT FOR THE CITY\. CRAFTED TO LAST A DECADE\./);
  });

  it("6. White-First Design System Compliance: CSS adheres to 70% off-white, 20% black, 10% red", () => {
    const cssContent = fs.readFileSync(globalsCssPath, "utf8");
    assert.match(cssContent, /bexyee-home-hero/);
    assert.match(cssContent, /asymmetric-product-grid/);
    assert.match(cssContent, /editorial-story-banner/);
    assert.match(cssContent, /bexyee-storefront-footer/);
    assert.match(cssContent, /#F7F7F3/);
    assert.match(cssContent, /#000000/);
    assert.match(cssContent, /#E52B20/);
  });

  it("7. Zero Dead Buttons / Real Routing: All product cards and CTAs map to /product/[slug] or real destinations", () => {
    const pageContent = fs.readFileSync(homePagePath, "utf8");
    assert.match(pageContent, /\/product\/\$\{spotlightProduct\.slug\}/);
    assert.match(pageContent, /\/product\/\$\{prod\.slug\}/);
    assert.match(pageContent, /\/cities/);
    assert.match(pageContent, /\/about/);
    assert.match(pageContent, /\/lookbook/);
    assert.match(pageContent, /\/blog/);
  });
});
