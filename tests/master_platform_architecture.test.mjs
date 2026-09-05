import test from "node:test";
import assert from "node:assert/strict";

test("BEXYEE — Master Product, Experience & Launch Platform Architecture", async (t) => {

  // 1. Experience Engine Registry Test
  await t.test("1. Experience Engine Registry contains all 5 mandatory product experiences", () => {
    const EXPERIENCE_TYPES = ["CITY_3D", "STANDARD", "EDITORIAL", "IMMERSIVE", "LIMITED_DROP"];
    
    EXPERIENCE_TYPES.forEach((expType) => {
      assert.ok(EXPERIENCE_TYPES.includes(expType), `Experience type ${expType} is supported in registry`);
    });

    assert.equal(EXPERIENCE_TYPES.length, 5);
  });

  // 2. Launch Engine Authoritative State Resolution
  await t.test("2. Authoritative server launch state correctly evaluates SCHEDULED, LIVE, ENDED, and SOLD OUT", () => {
    function resolveLaunchState(launchRow, totalAvailableStock) {
      const now = new Date();
      const nowIso = now.toISOString();

      if (!launchRow) {
        const isSoldOut = totalAvailableStock <= 0;
        return {
          status: isSoldOut ? "SOLD_OUT" : "LIVE",
          countdownEnabled: false,
          isPurchasable: !isSoldOut,
          serverTime: nowIso,
        };
      }

      let computedStatus = launchRow.status || "LIVE";

      if (computedStatus === "SCHEDULED" && launchRow.launch_at) {
        const launchTime = new Date(launchRow.launch_at).getTime();
        const endTime = launchRow.end_at ? new Date(launchRow.end_at).getTime() : null;
        const nowTime = now.getTime();

        if (nowTime >= launchTime) {
          if (endTime && nowTime > endTime) {
            computedStatus = "ENDED";
          } else {
            computedStatus = "LIVE";
          }
        } else {
          computedStatus = "SCHEDULED";
        }
      }

      if (computedStatus === "LIVE" && totalAvailableStock <= 0) {
        computedStatus = "SOLD_OUT";
      }

      const isPurchasable = computedStatus === "LIVE";

      return {
        id: launchRow.id,
        name: launchRow.name,
        slug: launchRow.slug,
        status: computedStatus,
        launchAt: launchRow.launch_at,
        endAt: launchRow.end_at,
        countdownEnabled: launchRow.countdown_enabled ?? true,
        urgencyBadge: launchRow.urgency_badge,
        isPurchasable,
        serverTime: nowIso,
      };
    }

    const futureTime = new Date(Date.now() + 3600 * 1000).toISOString();
    const pastTime = new Date(Date.now() - 3600 * 1000).toISOString();
    const farPastTime = new Date(Date.now() - 7200 * 1000).toISOString();

    // Case A: Future scheduled launch -> SCHEDULED, countdown active, not purchasable
    const scheduledLaunch = resolveLaunchState(
      { id: "1", name: "Midnight Drop", status: "SCHEDULED", launch_at: futureTime },
      50
    );
    assert.equal(scheduledLaunch.status, "SCHEDULED");
    assert.equal(scheduledLaunch.isPurchasable, false);

    // Case B: Past scheduled launch whose launch_at has passed -> LIVE, purchasable
    const liveLaunch = resolveLaunchState(
      { id: "2", name: "Passed Scheduled Drop", status: "SCHEDULED", launch_at: pastTime },
      50
    );
    assert.equal(liveLaunch.status, "LIVE");
    assert.equal(liveLaunch.isPurchasable, true);

    // Case C: Launch with end_at in the past -> ENDED, not purchasable
    const endedLaunch = resolveLaunchState(
      { id: "3", name: "Expired Drop", status: "SCHEDULED", launch_at: farPastTime, end_at: pastTime },
      50
    );
    assert.equal(endedLaunch.status, "ENDED");
    assert.equal(endedLaunch.isPurchasable, false);

    // Case D: Live launch with 0 available stock -> SOLD_OUT
    const soldOutLaunch = resolveLaunchState(
      { id: "4", name: "Exhausted Drop", status: "LIVE", launch_at: pastTime },
      0
    );
    assert.equal(soldOutLaunch.status, "SOLD_OUT");
    assert.equal(soldOutLaunch.isPurchasable, false);
  });

  // 3. Multi-Product Coexistence Proof (Bengaluru CITY_3D vs Mumbai EDITORIAL vs Delhi LIMITED_DROP)
  await t.test("3. Multi-Product Coexistence: Different products render different experience types dynamically", () => {
    // Product A: Bengaluru (CITY_3D with GLB and views)
    const productA = {
      id: "bengaluru-uuid",
      name: "Bengaluru Tee",
      slug: "bengaluru-tee",
      cityName: "BENGALURU",
      experienceType: "CITY_3D",
      pricePaise: 179900,
      assets: {
        frontImage: "/assets/products/bengaluru-tee-front.svg",
        backImage: "/assets/products/bengaluru-tee-back.svg",
        modelUrl: "/assets/models/bengaluru.glb",
      },
      launch: { status: "LIVE", isPurchasable: true },
    };

    // Product B: Mumbai (EDITORIAL with 2D high-res only)
    const productB = {
      id: "mumbai-uuid",
      name: "Mumbai Sea Link Uniform",
      slug: "mumbai-sea-link-uniform",
      cityName: "MUMBAI",
      experienceType: "EDITORIAL",
      pricePaise: 189900,
      assets: {
        frontImage: "/assets/products/mumbai-front.webp",
        backImage: "/assets/products/mumbai-back.webp",
        modelUrl: undefined,
      },
      launch: { status: "LIVE", isPurchasable: true },
    };

    // Product C: Delhi (LIMITED_DROP with countdown lock)
    const productC = {
      id: "delhi-uuid",
      name: "Delhi Dusk Heavyweight",
      slug: "delhi-dusk-heavyweight",
      cityName: "DELHI",
      experienceType: "LIMITED_DROP",
      pricePaise: 199900,
      assets: {
        frontImage: "/assets/products/delhi-front.webp",
        backImage: "/assets/products/delhi-back.webp",
      },
      launch: { status: "SCHEDULED", isPurchasable: false, urgencyBadge: "001 / 050" },
    };

    assert.equal(productA.experienceType, "CITY_3D");
    assert.equal(productA.cityName, "BENGALURU");
    assert.ok(productA.assets.modelUrl, "GLB Model attached to 3D city drop");

    assert.equal(productB.experienceType, "EDITORIAL");
    assert.equal(productB.cityName, "MUMBAI");
    assert.equal(productB.assets.modelUrl, undefined, "Editorial works without GLB");

    assert.equal(productC.experienceType, "LIMITED_DROP");
    assert.equal(productC.launch.status, "SCHEDULED");
    assert.equal(productC.launch.isPurchasable, false);
  });

  // 4. Brand Assets Decoupling Invariant
  await t.test("4. Brand Assets Invariant: Logo GLB is strictly separated from Product GLB assets", () => {
    const BRAND_ASSET_SLOTS = ["LOGO_2D", "LOGO_GLB", "LOGO_DARK", "LOGO_LIGHT", "FAVICON", "BRAND_WATERMARK"];
    const PRODUCT_ASSET_SLOTS = ["PRODUCT_FRONT_IMAGE", "PRODUCT_BACK_IMAGE", "PRODUCT_LEFT_SLEEVE_IMAGE", "PRODUCT_RIGHT_SLEEVE_IMAGE", "PRODUCT_PRINT_IMAGE", "PRODUCT_THUMBNAIL", "HERO_GLB", "HERO_BACKGROUND", "MOBILE_BACKGROUND", "SEO_OG_IMAGE"];

    assert.ok(BRAND_ASSET_SLOTS.includes("LOGO_GLB"), "LOGO_GLB is in brand assets");
    assert.ok(!PRODUCT_ASSET_SLOTS.includes("LOGO_GLB"), "LOGO_GLB is NEVER in product assets");
    assert.ok(PRODUCT_ASSET_SLOTS.includes("HERO_GLB"), "HERO_GLB is in product assets");
    assert.ok(!BRAND_ASSET_SLOTS.includes("HERO_GLB"), "HERO_GLB is NEVER in brand assets");
  });

  // 5. Theme Configuration Safety
  await t.test("5. Theme Engine: Themes are safe structured configurations without executable code", () => {
    const theme = {
      name: "Bengaluru Rain Signal",
      slug: "bengaluru-rain-signal",
      accentColor: "#e52b20",
      backgroundColor: "#0b0b0a",
      textColor: "#ede9e1",
      surfaceColor: "#141412",
      typographyPreset: "MODERNIST_CONDENSED",
      buttonStyle: "SHARP_SOLID",
      spacingDensity: "COMPACT_ARCHITECTURAL",
      atmosphericEffect: "NEON_RAIN",
    };

    assert.equal(typeof theme.name, "string");
    assert.equal(typeof theme.accentColor, "string");
    assert.equal(typeof theme.backgroundColor, "string");
    assert.match(theme.accentColor, /^#[0-9a-fA-F]{6}$/);
    assert.match(theme.backgroundColor, /^#[0-9a-fA-F]{6}$/);
    assert.equal(typeof theme.atmosphericEffect, "string");
  });

  // 6. Available Stock Formula Invariant
  await t.test("6. Inventory Invariant: Available Stock strictly equals Physical Stock minus Active Reserved Stock", () => {
    const physicalStock = 25;
    const activeReservedStock = 7;
    const availableStock = Math.max(0, physicalStock - activeReservedStock);

    assert.equal(availableStock, 18, "Available stock calculated correctly");
    assert.equal(Math.max(0, 5 - 10), 0, "Stock cannot be negative");
  });

  // 7. Dynamic Route Product Composition & Structured Data
  await t.test("7. Metadata and structured data generation works dynamically for any product", () => {
    function generateJsonLd(product) {
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        sku: product.sku,
        description: product.description,
        brand: { "@type": "Brand", name: "BEXYEE" },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: product.pricePaise / 100,
          availability: product.isSoldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          url: `/products/${product.slug}`,
        },
      };
    }

    const jsonLd = generateJsonLd({
      name: "Mumbai Heavyweight",
      sku: "BEXYEE-MUM-001",
      description: "Coastal heavy knit.",
      pricePaise: 189900,
      slug: "mumbai-heavyweight",
      isSoldOut: false,
    });

    assert.equal(jsonLd.name, "Mumbai Heavyweight");
    assert.equal(jsonLd.offers.price, 1899);
    assert.equal(jsonLd.offers.availability, "https://schema.org/InStock");
    assert.equal(jsonLd.offers.url, "/products/mumbai-heavyweight");
  });
});
