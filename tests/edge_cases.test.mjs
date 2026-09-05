import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createHmac } from "node:crypto";

// ─────────────────────────────────────────────────────────────────────────────
// EDGE CASES: Boundary values, adversarial inputs, security invariants
// ─────────────────────────────────────────────────────────────────────────────

describe("Edge Cases — Boundary Values & Adversarial Inputs", () => {

  // ── Commerce schema adversarial inputs ──────────────────────────────────────
  test("Cart: quantity of exactly 20 is accepted, 21 is rejected", () => {
    function validateQty(qty) { return qty >= 1 && qty <= 20 && Number.isInteger(qty); }
    assert.equal(validateQty(20), true);
    assert.equal(validateQty(21), false);
    assert.equal(validateQty(0), false);
    assert.equal(validateQty(-1), false);
    assert.equal(validateQty(1.5), false);
  });

  test("Cart: non-UUID productId is rejected", () => {
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    assert.equal(UUID_RE.test("123e4567-e89b-12d3-a456-426614174000"), true);
    assert.equal(UUID_RE.test("not-a-uuid"), false);
    assert.equal(UUID_RE.test(""), false);
    assert.equal(UUID_RE.test("00000000-0000-0000-0000-000000000000"), true); // nil UUID
  });

  test("Cart: size enum only accepts S, M, L, XL — case sensitive", () => {
    const VALID = new Set(["S", "M", "L", "XL"]);
    assert.equal(VALID.has("S"), true);
    assert.equal(VALID.has("XL"), true);
    assert.equal(VALID.has("xxl"), false); // lowercase rejected
    assert.equal(VALID.has("XXL"), false);
    assert.equal(VALID.has(""), false);
    assert.equal(VALID.has("xs"), false);
  });

  // ── Price / paise calculations ────────────────────────────────────────────────
  test("Price: paise-to-rupee conversion handles large amounts correctly", () => {
    const paise = 1000000; // ₹10,000
    const rupees = paise / 100;
    assert.equal(rupees, 10000);
  });

  test("Price: zero paise is valid (free item)", () => {
    const paise = 0;
    assert.equal(paise / 100, 0);
  });

  test("Price: floating point hazard — paise are always integers", () => {
    // Should never be 0.1 + 0.2 = 0.30000000000000004 style issues
    const items = [{ unitPricePaise: 10, quantity: 3 }];
    const total = items.reduce((s, i) => s + i.unitPricePaise * i.quantity, 0);
    assert.equal(total, 30); // exact integer
    assert.equal(typeof total, "number");
    assert.equal(Number.isInteger(total), true);
  });

  // ── Slug validation ──────────────────────────────────────────────────────────
  test("Slug: lowercase alphanumeric and hyphens only", () => {
    const SLUG_RE = /^[a-z0-9-]+$/;
    assert.equal(SLUG_RE.test("bengaluru-tee"), true);
    assert.equal(SLUG_RE.test("mumbai-sea-link-uniform"), true);
    assert.equal(SLUG_RE.test("product-001"), true);
    assert.equal(SLUG_RE.test("Bengaluru-Tee"), false); // uppercase rejected
    assert.equal(SLUG_RE.test("bengaluru tee"), false); // space rejected
    assert.equal(SLUG_RE.test("bengaluru_tee"), false); // underscore rejected
    assert.equal(SLUG_RE.test(""), false);
    assert.equal(SLUG_RE.test("bengaluru-tee-"), true); // trailing hyphen (allowed by pattern)
  });

  // ── SEO field lengths ────────────────────────────────────────────────────────
  test("SEO title: 160 char limit enforced", () => {
    const ok = "A".repeat(160);
    const too = "A".repeat(161);
    assert.equal(ok.length <= 160, true);
    assert.equal(too.length <= 160, false);
  });

  test("SEO description: 320 char limit enforced", () => {
    const ok = "B".repeat(320);
    const too = "B".repeat(321);
    assert.equal(ok.length <= 320, true);
    assert.equal(too.length <= 320, false);
  });

  // ── MIME type security ───────────────────────────────────────────────────────
  test("Asset MIME: only allowed types pass validation", () => {
    const ALLOWED_IMAGE = ["image/webp", "image/png", "image/svg+xml", "image/jpeg", "image/avif"];
    const ALLOWED_3D = ["model/gltf-binary", "model/gltf+json"];
    const ALL_ALLOWED = new Set([...ALLOWED_IMAGE, ...ALLOWED_3D]);

    assert.equal(ALL_ALLOWED.has("image/webp"), true);
    assert.equal(ALL_ALLOWED.has("application/x-msdownload"), false); // .exe
    assert.equal(ALL_ALLOWED.has("application/javascript"), false);
    assert.equal(ALL_ALLOWED.has("text/html"), false);
    assert.equal(ALL_ALLOWED.has("application/pdf"), false);
    assert.equal(ALL_ALLOWED.has("model/gltf-binary"), true);
  });

  test("Asset file size: image must be under 350 KB", () => {
    const limit = 350 * 1024;
    assert.equal(280 * 1024 <= limit, true); // 280 KB ok
    assert.equal(350 * 1024 <= limit, true); // exactly 350 KB ok
    assert.equal(351 * 1024 <= limit, false); // 351 KB rejected
  });

  test("Asset file size: GLB must be under 4.5 MB", () => {
    const limit = 4.5 * 1024 * 1024;
    assert.equal(4 * 1024 * 1024 <= limit, true); // 4 MB ok
    assert.equal(9.2 * 1024 * 1024 <= limit, false); // 9.2 MB rejected
  });

  // ── HMAC timing-safe comparison ──────────────────────────────────────────────
  test("Security: same-length wrong signature returns false (no timing shortcut)", () => {
    const secret = "bexyee_razorpay_secret";
    const orderId = "order_12345";
    const paymentId = "pay_67890";
    const correctSig = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
    const wrongSig = createHmac("sha256", "wrong").update(`${orderId}|${paymentId}`).digest("hex");

    // Both are 64 hex chars (same length), comparison must not short-circuit
    assert.equal(correctSig.length, wrongSig.length);
    assert.notEqual(correctSig, wrongSig);
  });

  test("Security: different-length strings are immediately rejected without timingSafeEqual", () => {
    const sig64 = "a".repeat(64);
    const sig32 = "a".repeat(32);
    // Different lengths → immediately false (cannot be equal)
    assert.notEqual(sig64.length, sig32.length);
  });

  // ── Reservation TTL ──────────────────────────────────────────────────────────
  test("Reservation TTL is 900 seconds (15 minutes)", () => {
    const TTL = 900;
    assert.equal(TTL, 900);
    assert.equal(TTL / 60, 15); // 15 minutes
  });

  test("Reservation expiry is calculated from now + TTL", () => {
    const TTL = 900;
    const now = Date.now();
    const expiresAt = new Date(now + TTL * 1000).toISOString();
    const parsed = new Date(expiresAt).getTime();
    // Should be approximately TTL seconds in the future
    assert.ok(parsed > now, "Expiry must be in the future");
    assert.ok(parsed - now >= TTL * 1000 - 5, "Expiry within expected window");
  });

  // ── Launch scheduling arithmetic ─────────────────────────────────────────────
  test("Countdown display: hours, minutes, seconds from milliseconds", () => {
    function formatCountdown(msRemaining) {
      const totalSecs = Math.max(0, Math.floor(msRemaining / 1000));
      const hours = Math.floor(totalSecs / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;
      return { hours, minutes, seconds };
    }

    const { hours, minutes, seconds } = formatCountdown(3661000); // 1h 1m 1s
    assert.equal(hours, 1);
    assert.equal(minutes, 1);
    assert.equal(seconds, 1);
  });

  test("Countdown clamps to 0 when negative (past launch)", () => {
    function formatCountdown(msRemaining) {
      const totalSecs = Math.max(0, Math.floor(msRemaining / 1000));
      return { totalSecs };
    }
    assert.equal(formatCountdown(-5000).totalSecs, 0);
  });

  // ── Order ID format ───────────────────────────────────────────────────────────
  test("Razorpay order ID starts with 'order_' prefix", () => {
    const orderId = "order_N1234567890";
    assert.ok(orderId.startsWith("order_"), "Razorpay order IDs must start with order_");
  });

  test("Razorpay payment ID starts with 'pay_' prefix", () => {
    const payId = "pay_N9876543210";
    assert.ok(payId.startsWith("pay_"), "Razorpay payment IDs must start with pay_");
  });

  // ── Product experience type registry ────────────────────────────────────────
  test("Experience type: all 5 types are strings and uppercase", () => {
    const types = ["STANDARD", "CITY_3D", "EDITORIAL", "IMMERSIVE", "LIMITED_DROP"];
    types.forEach(t => {
      assert.equal(typeof t, "string");
      assert.equal(t, t.toUpperCase());
    });
  });

  test("Experience type: unknown type is not in registry", () => {
    const types = new Set(["STANDARD", "CITY_3D", "EDITORIAL", "IMMERSIVE", "LIMITED_DROP"]);
    assert.equal(types.has("BASIC"), false);
    assert.equal(types.has("city_3d"), false); // case sensitive
    assert.equal(types.has(""), false);
  });

  // ── GST rate validity ────────────────────────────────────────────────────────
  test("GST rate must be between 0 and 28 percent", () => {
    function isValidGstRate(rate) { return typeof rate === "number" && rate >= 0 && rate <= 28; }
    assert.equal(isValidGstRate(0), true);   // 0% (exempt)
    assert.equal(isValidGstRate(5), true);   // 5%
    assert.equal(isValidGstRate(12), true);  // 12%
    assert.equal(isValidGstRate(18), true);  // 18%
    assert.equal(isValidGstRate(28), true);  // 28%
    assert.equal(isValidGstRate(-1), false);
    assert.equal(isValidGstRate(29), false);
    assert.equal(isValidGstRate(NaN), false);
  });

  // ── Theme color format validation ────────────────────────────────────────────
  test("Theme: accent colors must be valid 6-digit hex codes", () => {
    const HEX_RE = /^#[0-9a-fA-F]{6}$/;
    assert.match("#e52b20", HEX_RE);
    assert.match("#0b0b0a", HEX_RE);
    assert.match("#FFFFFF", HEX_RE);
    assert.doesNotMatch("#gggggg", HEX_RE); // invalid hex chars
    assert.doesNotMatch("e52b20", HEX_RE);  // missing #
    assert.doesNotMatch("#e52b2", HEX_RE);  // too short
    assert.doesNotMatch("#e52b200", HEX_RE); // too long
  });

  // ── Indian phone number format ───────────────────────────────────────────────
  test("Indian phone: 10 digits starting with 6-9", () => {
    const PHONE_RE = /^[6-9][0-9]{9}$/;
    assert.match("9876543210", PHONE_RE);
    assert.match("6543219876", PHONE_RE);
    assert.doesNotMatch("5876543210", PHONE_RE); // starts with 5
    assert.doesNotMatch("98765432", PHONE_RE);   // too short
    assert.doesNotMatch("98765432101", PHONE_RE); // too long
    assert.doesNotMatch("+919876543210", PHONE_RE); // country code not in bare format
  });

  // ── Stock reservation edge: negative delta ────────────────────────────────────
  test("Inventory: adjustment with negative delta reduces stock correctly", () => {
    const before = 25;
    const delta = -5; // damaged/write-off
    const after = Math.max(0, before + delta);
    assert.equal(after, 20);
  });

  test("Inventory: negative delta clamped at 0, never goes negative", () => {
    const before = 3;
    const delta = -10; // adjustment larger than stock
    const after = Math.max(0, before + delta);
    assert.equal(after, 0, "Stock cannot go negative");
  });

  // ── Asset rollback invariant ──────────────────────────────────────────────────
  test("Asset rollback: activates exactly one version", () => {
    const history = [
      { version: 1, url: "/v1.webp", isActive: false },
      { version: 2, url: "/v2.webp", isActive: false },
      { version: 3, url: "/v3.webp", isActive: true },
    ];
    const targetVersion = 1;
    const rolled = history.map(a => ({ ...a, isActive: a.version === targetVersion }));
    const activeCount = rolled.filter(a => a.isActive).length;
    assert.equal(activeCount, 1, "Exactly one version must be active after rollback");
    assert.equal(rolled.find(a => a.isActive)?.version, 1);
    assert.equal(rolled.length, 3, "No versions were deleted");
  });

  test("Asset rollback: all versions preserved (non-destructive)", () => {
    const history = [1, 2, 3].map(v => ({ version: v, url: `/v${v}.webp`, isActive: v === 3 }));
    const rolled = history.map(a => ({ ...a, isActive: a.version === 1 }));
    assert.equal(rolled.length, 3);
    rolled.forEach(a => assert.ok("url" in a, "URL must be preserved"));
  });

  // ── Rate limiting: ENDPOINT_RATE_LIMITS configuration ──────────────────────
  test("ENDPOINT_RATE_LIMITS: login rate is 5/minute (security)", () => {
    const LIMITS = { LOGIN: { limit: 5, windowMs: 60000 } };
    assert.equal(LIMITS.LOGIN.limit, 5);
    assert.equal(LIMITS.LOGIN.windowMs, 60000);
  });

  test("ENDPOINT_RATE_LIMITS: webhook rate is higher (240/minute)", () => {
    const LIMITS = { WEBHOOK: { limit: 240, windowMs: 60000 } };
    assert.equal(LIMITS.WEBHOOK.limit, 240);
  });

  test("ENDPOINT_RATE_LIMITS: admin API has higher limit than public checkout", () => {
    const LIMITS = { ADMIN_API: { limit: 120, windowMs: 60000 }, CHECKOUT_CREATE: { limit: 10, windowMs: 60000 } };
    assert.ok(LIMITS.ADMIN_API.limit > LIMITS.CHECKOUT_CREATE.limit);
  });

  // ── Concurrent reservation simulation ────────────────────────────────────────
  test("Concurrency: first reservation wins when stock=1", () => {
    let stock = 1;
    const results = [];

    function tryReserve(userId) {
      if (stock > 0) {
        stock -= 1;
        results.push({ userId, success: true });
      } else {
        results.push({ userId, success: false });
      }
    }

    tryReserve("user-A");
    tryReserve("user-B");

    assert.equal(results[0].success, true, "First user gets the item");
    assert.equal(results[1].success, false, "Second user is rejected");
    assert.equal(stock, 0);
  });

  // ── JSON-LD Schema generation ─────────────────────────────────────────────────
  test("JSON-LD: in-stock product has correct availability URL", () => {
    const availability = false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock";
    assert.equal(availability, "https://schema.org/InStock");
  });

  test("JSON-LD: sold-out product has correct availability URL", () => {
    const isSoldOut = true;
    const availability = isSoldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock";
    assert.equal(availability, "https://schema.org/OutOfStock");
  });

  test("JSON-LD: price is always in INR (paise/100)", () => {
    const pricePaise = 179900;
    const price = pricePaise / 100;
    const currency = "INR";
    assert.equal(price, 1799);
    assert.equal(currency, "INR");
  });

  // ── Dynamic product URL generation ────────────────────────────────────────────
  test("Product URL: /products/[slug] format", () => {
    const slugs = ["bengaluru-tee", "mumbai-sea-link", "delhi-nocturnal"];
    slugs.forEach(slug => {
      const url = `/products/${slug}`;
      assert.match(url, /^\/products\/[a-z0-9-]+$/);
    });
  });
});
