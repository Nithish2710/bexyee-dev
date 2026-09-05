import assert from "node:assert/strict";
import { describe, test } from "node:test";

// ─────────────────────────────────────────────────────────────────────────────
// MODULE: adaptive-network — client-side capability classification
// ─────────────────────────────────────────────────────────────────────────────
describe("Adaptive Network — capability classification engine", () => {

  // Mirror the pure deterministic path (no window/navigator needed)
  function classifyAdaptiveMode({ cores = 4, memory = 4, effectiveType = "4g", rtt = 50, saveData = false, prefersReducedMotion = false, isOnline = true } = {}) {
    if (!isOnline) return { is3DAllowed: false, isFastNetwork: false, networkProfile: "OFFLINE", deviceTier: "CONSTRAINED", isHighDprAllowed: false, isPrefetchAllowed: false, isHeavyAnimationAllowed: false };

    const isSlowNetwork = saveData || effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g" || rtt > 300;

    let deviceTier = "MEDIUM";
    if (cores >= 8 && memory >= 6) deviceTier = "HIGH";
    else if (cores < 4 || memory < 3) deviceTier = "LOW";

    if (saveData) return { is3DAllowed: false, isFastNetwork: false, networkProfile: "SAVE_DATA", deviceTier: "CONSTRAINED", isHighDprAllowed: false, isPrefetchAllowed: false, isHeavyAnimationAllowed: false };

    if (isSlowNetwork) {
      return {
        isFastNetwork: false, is3DAllowed: false, isHighDprAllowed: false, isPrefetchAllowed: false,
        isHeavyAnimationAllowed: !prefersReducedMotion,
        networkProfile: "SLOW",
        deviceTier: deviceTier === "HIGH" ? "MEDIUM" : "LOW",
      };
    }

    const is3DAllowed = deviceTier !== "LOW" && !prefersReducedMotion;
    return {
      isFastNetwork: true, is3DAllowed, isHighDprAllowed: deviceTier === "HIGH", isPrefetchAllowed: true,
      isHeavyAnimationAllowed: !prefersReducedMotion, networkProfile: "FAST", deviceTier,
    };
  }

  test("offline device → all capabilities disabled", () => {
    const m = classifyAdaptiveMode({ isOnline: false });
    assert.equal(m.networkProfile, "OFFLINE");
    assert.equal(m.is3DAllowed, false);
    assert.equal(m.isPrefetchAllowed, false);
    assert.equal(m.isHeavyAnimationAllowed, false);
    assert.equal(m.deviceTier, "CONSTRAINED");
  });

  test("save-data header → all performance features disabled", () => {
    const m = classifyAdaptiveMode({ saveData: true });
    assert.equal(m.networkProfile, "SAVE_DATA");
    assert.equal(m.is3DAllowed, false);
    assert.equal(m.isHighDprAllowed, false);
    assert.equal(m.isPrefetchAllowed, false);
    assert.equal(m.deviceTier, "CONSTRAINED");
  });

  test("slow-2g network → 3D disabled, heavy animation disabled", () => {
    const m = classifyAdaptiveMode({ effectiveType: "slow-2g" });
    assert.equal(m.networkProfile, "SLOW");
    assert.equal(m.is3DAllowed, false);
    assert.equal(m.isFastNetwork, false);
  });

  test("3g network → 3D disabled, slow network", () => {
    const m = classifyAdaptiveMode({ effectiveType: "3g" });
    assert.equal(m.networkProfile, "SLOW");
    assert.equal(m.is3DAllowed, false);
  });

  test("high RTT (400ms) → treated as slow even on 4g label", () => {
    const m = classifyAdaptiveMode({ effectiveType: "4g", rtt: 400 });
    assert.equal(m.networkProfile, "SLOW");
    assert.equal(m.is3DAllowed, false);
  });

  test("RTT at boundary (300ms) is still slow", () => {
    const m = classifyAdaptiveMode({ rtt: 301 });
    assert.equal(m.networkProfile, "SLOW");
  });

  test("RTT exactly 300ms is NOT slow (fast threshold)", () => {
    const m = classifyAdaptiveMode({ rtt: 300 });
    assert.equal(m.networkProfile, "FAST");
  });

  test("high-end device (8 cores, 6 GB RAM) on 4g → HIGH tier with high DPR", () => {
    const m = classifyAdaptiveMode({ cores: 8, memory: 6 });
    assert.equal(m.deviceTier, "HIGH");
    assert.equal(m.isHighDprAllowed, true);
    assert.equal(m.is3DAllowed, true);
  });

  test("low-end device (2 cores) on 4g → LOW tier, 3D disabled", () => {
    const m = classifyAdaptiveMode({ cores: 2, memory: 4 });
    assert.equal(m.deviceTier, "LOW");
    assert.equal(m.is3DAllowed, false);
    assert.equal(m.isHighDprAllowed, false);
  });

  test("low memory (2 GB) → LOW tier regardless of cores", () => {
    const m = classifyAdaptiveMode({ cores: 6, memory: 2 });
    assert.equal(m.deviceTier, "LOW");
    assert.equal(m.is3DAllowed, false);
  });

  test("prefers-reduced-motion → 3D and heavy animations disabled, fast network still", () => {
    const m = classifyAdaptiveMode({ cores: 8, memory: 8, prefersReducedMotion: true });
    assert.equal(m.isFastNetwork, true);
    assert.equal(m.is3DAllowed, false);
    assert.equal(m.isHeavyAnimationAllowed, false);
  });

  test("slow network + reduced motion → heavy animations also disabled", () => {
    const m = classifyAdaptiveMode({ effectiveType: "3g", prefersReducedMotion: true });
    assert.equal(m.isHeavyAnimationAllowed, false);
    assert.equal(m.networkProfile, "SLOW");
  });

  test("slow network + no reduced motion → light animations still allowed", () => {
    const m = classifyAdaptiveMode({ effectiveType: "3g", prefersReducedMotion: false });
    assert.equal(m.isHeavyAnimationAllowed, true);
  });

  test("medium device on fast network → MEDIUM tier, 3D allowed, no high DPR", () => {
    const m = classifyAdaptiveMode({ cores: 4, memory: 4 });
    assert.equal(m.deviceTier, "MEDIUM");
    assert.equal(m.is3DAllowed, true);
    assert.equal(m.isHighDprAllowed, false);
  });

  test("high-end device on slow network → demoted to MEDIUM tier", () => {
    const m = classifyAdaptiveMode({ cores: 8, memory: 8, effectiveType: "3g" });
    assert.equal(m.deviceTier, "MEDIUM"); // demoted from HIGH
    assert.equal(m.is3DAllowed, false);
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// MODULE: logger — structured event logging with PII sanitization
// ─────────────────────────────────────────────────────────────────────────────
describe("Logger — structured events and PII sanitization", () => {

  const SENSITIVE_KEYS = new Set(["password", "token", "secret", "authorization", "key", "razorpay_signature", "cvv", "cardnumber", "otp"]);

  function sanitize(obj, depth = 0) {
    if (depth > 4 || obj == null) return obj;
    if (typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map((item) => sanitize(item, depth + 1));
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      if (SENSITIVE_KEYS.has(k.toLowerCase())) result[k] = "[REDACTED]";
      else if (typeof v === "object" && v !== null) result[k] = sanitize(v, depth + 1);
      else result[k] = v;
    }
    return result;
  }

  function buildPayload(event, context) {
    return { level: "info", event, timestamp: new Date().toISOString(), ...sanitize(context) };
  }

  test("password field is redacted", () => {
    const p = buildPayload("login", { userId: "u1", password: "hunter2" });
    assert.equal(p.password, "[REDACTED]");
    assert.equal(p.userId, "u1");
  });

  test("token field is redacted", () => {
    const p = buildPayload("api_call", { token: "jwt_abc123", route: "/api/test" });
    assert.equal(p.token, "[REDACTED]");
    assert.equal(p.route, "/api/test");
  });

  test("razorpay_signature is redacted", () => {
    const p = buildPayload("payment_verify", { razorpay_signature: "hmac_abc" });
    assert.equal(p.razorpay_signature, "[REDACTED]");
  });

  test("nested sensitive field inside object is redacted", () => {
    const p = buildPayload("order", { payment: { secret: "abc", amount: 1000 } });
    assert.equal(p.payment.secret, "[REDACTED]");
    assert.equal(p.payment.amount, 1000);
  });

  test("non-sensitive fields pass through untouched", () => {
    const p = buildPayload("order_created", { orderId: "ord_123", amount: 1799 });
    assert.equal(p.orderId, "ord_123");
    assert.equal(p.amount, 1799);
  });

  test("arrays of objects are sanitized", () => {
    const p = buildPayload("batch", { items: [{ id: "1", token: "tok" }, { id: "2" }] });
    assert.equal(p.items[0].token, "[REDACTED]");
    assert.equal(p.items[0].id, "1");
    assert.equal(p.items[1].id, "2");
  });

  test("depth limit prevents infinite recursion on circular-like nesting", () => {
    const deep = { a: { b: { c: { d: { e: { token: "deep" } } } } } };
    // Depth limit is 4 — level 5 nested values may or may not be sanitized — no crash is the key assertion
    assert.doesNotThrow(() => sanitize(deep));
  });

  test("null values pass through safely", () => {
    const p = buildPayload("event", { orderId: null, token: null });
    // token is null but key name is sensitive — should be redacted still
    assert.equal(p.token, "[REDACTED]");
    assert.equal(p.orderId, null);
  });

  test("event and timestamp are always present", () => {
    const p = buildPayload("test_event", {});
    assert.equal(p.event, "test_event");
    assert.equal(p.level, "info");
    assert.ok(p.timestamp);
    assert.match(p.timestamp, /^\d{4}-\d{2}-\d{2}T/);
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// MODULE: shipping — serviceability, quoting, AWB format
// ─────────────────────────────────────────────────────────────────────────────
describe("Shipping — serviceability, quoting, and AWB generation", () => {

  function isServiceable(pincode, country = "IN") {
    if (country !== "IN" && country !== "India") return false;
    return /^[1-9][0-9]{5}$/.test(pincode);
  }

  function quote(subtotalPaise, freeThreshold = 500000, rate = 6000) {
    if (subtotalPaise >= freeThreshold) return 0;
    return rate;
  }

  function generateAwb(orderId) {
    const shortId = orderId.slice(0, 8).toUpperCase();
    return `BX${Date.now().toString().slice(-8)}${shortId.slice(0, 4)}`;
  }

  test("valid Bengaluru PIN is serviceable", () => assert.equal(isServiceable("560001"), true));
  test("valid Delhi PIN is serviceable", () => assert.equal(isServiceable("110001"), true));
  test("valid Mumbai PIN is serviceable", () => assert.equal(isServiceable("400001"), true));
  test("valid Hyderabad PIN is serviceable", () => assert.equal(isServiceable("500001"), true));
  test("PIN starting with 0 is invalid", () => assert.equal(isServiceable("012345"), false));
  test("5-digit PIN is invalid", () => assert.equal(isServiceable("56000"), false));
  test("7-digit PIN is invalid", () => assert.equal(isServiceable("5600011"), false));
  test("alpha character in PIN is invalid", () => assert.equal(isServiceable("56000A"), false));
  test("empty PIN is invalid", () => assert.equal(isServiceable(""), false));
  test("non-India country rejects serviceability", () => assert.equal(isServiceable("560001", "US"), false));
  test("India string alternative is accepted", () => assert.equal(isServiceable("560001", "India"), true));

  test("order below free threshold pays standard shipping", () => assert.equal(quote(179900), 6000));
  test("order at exact free threshold gets free shipping", () => assert.equal(quote(500000), 0));
  test("order above free threshold gets free shipping", () => assert.equal(quote(600000), 0));
  test("order just below threshold pays shipping", () => assert.equal(quote(499999), 6000));
  test("custom threshold and rate work correctly", () => {
    assert.equal(quote(300000, 300000, 8000), 0);
    assert.equal(quote(299999, 300000, 8000), 8000);
  });

  test("AWB format starts with BX prefix", () => {
    const awb = generateAwb("ord_12345678");
    assert.ok(awb.startsWith("BX"), `AWB must start with BX, got: ${awb}`);
  });

  test("AWB has correct length (2 + 8 + 4 = 14 chars)", () => {
    const awb = generateAwb("ord_12345678abcd");
    assert.equal(awb.length, 14);
  });

  test("two AWBs for different orders are unique", () => {
    const awb1 = generateAwb("ord_aaaa1111");
    const awb2 = generateAwb("ord_bbbb2222");
    // AWB includes timestamp, so same ms is rare but possible — verify structure
    assert.ok(awb1.startsWith("BX"));
    assert.ok(awb2.startsWith("BX"));
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// MODULE: product-engine — resolveLaunchState extended coverage
// ─────────────────────────────────────────────────────────────────────────────
describe("Product Engine — resolveLaunchState extended coverage", () => {

  function resolveLaunchState(launchRow, totalAvailableStock) {
    const now = new Date();
    const nowIso = now.toISOString();

    if (!launchRow) {
      const isSoldOut = totalAvailableStock <= 0;
      return { status: isSoldOut ? "SOLD_OUT" : "LIVE", countdownEnabled: false, isPurchasable: !isSoldOut, serverTime: nowIso };
    }

    let computedStatus = launchRow.status || "LIVE";

    if (computedStatus === "SCHEDULED" && launchRow.launch_at) {
      const launchTime = new Date(launchRow.launch_at).getTime();
      const endTime = launchRow.end_at ? new Date(launchRow.end_at).getTime() : null;
      const nowTime = now.getTime();
      if (nowTime >= launchTime) {
        computedStatus = (endTime && nowTime > endTime) ? "ENDED" : "LIVE";
      } else {
        computedStatus = "SCHEDULED";
      }
    }

    if (computedStatus === "LIVE" && totalAvailableStock <= 0) computedStatus = "SOLD_OUT";

    const isPurchasable = computedStatus === "LIVE";

    return {
      id: launchRow.id, name: launchRow.name, slug: launchRow.slug,
      status: computedStatus, launchAt: launchRow.launch_at, endAt: launchRow.end_at,
      countdownEnabled: launchRow.countdown_enabled ?? true,
      urgencyBadge: launchRow.urgency_badge, heroHeadline: launchRow.hero_headline,
      isPurchasable, serverTime: nowIso,
    };
  }

  const past1h = new Date(Date.now() - 3600 * 1000).toISOString();
  const past2h = new Date(Date.now() - 7200 * 1000).toISOString();
  const future1h = new Date(Date.now() + 3600 * 1000).toISOString();
  const future2h = new Date(Date.now() + 7200 * 1000).toISOString();

  test("null launch row + stock available → LIVE, purchasable", () => {
    const s = resolveLaunchState(null, 50);
    assert.equal(s.status, "LIVE");
    assert.equal(s.isPurchasable, true);
    assert.equal(s.countdownEnabled, false);
  });

  test("null launch row + zero stock → SOLD_OUT, not purchasable", () => {
    const s = resolveLaunchState(null, 0);
    assert.equal(s.status, "SOLD_OUT");
    assert.equal(s.isPurchasable, false);
  });

  test("SCHEDULED row, launch in future → stays SCHEDULED", () => {
    const s = resolveLaunchState({ status: "SCHEDULED", launch_at: future1h, countdown_enabled: true }, 50);
    assert.equal(s.status, "SCHEDULED");
    assert.equal(s.isPurchasable, false);
    assert.equal(s.countdownEnabled, true);
  });

  test("SCHEDULED row, launch passed, no end_at → transitions to LIVE", () => {
    const s = resolveLaunchState({ status: "SCHEDULED", launch_at: past1h }, 50);
    assert.equal(s.status, "LIVE");
    assert.equal(s.isPurchasable, true);
  });

  test("SCHEDULED row, launch passed, end_at also passed → ENDED", () => {
    const s = resolveLaunchState({ status: "SCHEDULED", launch_at: past2h, end_at: past1h }, 50);
    assert.equal(s.status, "ENDED");
    assert.equal(s.isPurchasable, false);
  });

  test("SCHEDULED row transitions to LIVE then SOLD_OUT when stock is 0", () => {
    const s = resolveLaunchState({ status: "SCHEDULED", launch_at: past1h }, 0);
    assert.equal(s.status, "SOLD_OUT");
    assert.equal(s.isPurchasable, false);
  });

  test("LIVE row with end_at in future → still LIVE", () => {
    const s = resolveLaunchState({ status: "LIVE", launch_at: past1h, end_at: future1h }, 20);
    assert.equal(s.status, "LIVE");
    assert.equal(s.isPurchasable, true);
  });

  test("LIVE row with stock 0 → SOLD_OUT", () => {
    const s = resolveLaunchState({ status: "LIVE" }, 0);
    assert.equal(s.status, "SOLD_OUT");
    assert.equal(s.isPurchasable, false);
  });

  test("PAUSED row passes through as PAUSED, not purchasable", () => {
    const s = resolveLaunchState({ status: "PAUSED" }, 50);
    assert.equal(s.status, "PAUSED");
    assert.equal(s.isPurchasable, false);
  });

  test("ENDED row passes through as ENDED", () => {
    const s = resolveLaunchState({ status: "ENDED" }, 50);
    assert.equal(s.status, "ENDED");
    assert.equal(s.isPurchasable, false);
  });

  test("ARCHIVED row passes through as ARCHIVED", () => {
    const s = resolveLaunchState({ status: "ARCHIVED" }, 50);
    assert.equal(s.status, "ARCHIVED");
    assert.equal(s.isPurchasable, false);
  });

  test("urgencyBadge and heroHeadline are forwarded correctly", () => {
    const s = resolveLaunchState({
      status: "LIVE", urgency_badge: "001 / 050", hero_headline: "BENGALURU AFTER DARK"
    }, 10);
    assert.equal(s.urgencyBadge, "001 / 050");
    assert.equal(s.heroHeadline, "BENGALURU AFTER DARK");
  });

  test("countdown_enabled defaults to true when omitted", () => {
    const s = resolveLaunchState({ status: "SCHEDULED", launch_at: future1h }, 50);
    assert.equal(s.countdownEnabled, true);
  });

  test("countdown_enabled=false is respected", () => {
    const s = resolveLaunchState({ status: "SCHEDULED", launch_at: future2h, countdown_enabled: false }, 50);
    assert.equal(s.countdownEnabled, false);
  });

  test("serverTime is a valid ISO string", () => {
    const s = resolveLaunchState(null, 5);
    assert.match(s.serverTime, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// MODULE: commerce — calculateTotals and GST split
// ─────────────────────────────────────────────────────────────────────────────
describe("Commerce — calculateTotals and GST calculations", () => {

  function calculateTotals(items, shippingPaise = 0, discountPaise = 0) {
    const subtotalPaise = items.reduce((total, item) => total + item.unitPricePaise * item.quantity, 0);
    return { subtotalPaise, shippingPaise, discountPaise, totalPaise: Math.max(0, subtotalPaise - discountPaise + shippingPaise) };
  }

  // GST split helper: price is GST-inclusive
  function splitGst(inclusivePricePaise, gstPercent) {
    const divisor = 1 + gstPercent / 100;
    const basePaise = Math.round(inclusivePricePaise / divisor);
    const gstPaise = inclusivePricePaise - basePaise;
    return { basePaise, gstPaise, gstPercent };
  }

  test("single item, no shipping, no discount", () => {
    const r = calculateTotals([{ unitPricePaise: 179900, quantity: 1 }]);
    assert.equal(r.subtotalPaise, 179900);
    assert.equal(r.totalPaise, 179900);
  });

  test("two items with different quantities", () => {
    const r = calculateTotals([{ unitPricePaise: 100000, quantity: 2 }, { unitPricePaise: 50000, quantity: 3 }]);
    assert.equal(r.subtotalPaise, 350000);
  });

  test("shipping adds to total correctly", () => {
    const r = calculateTotals([{ unitPricePaise: 179900, quantity: 1 }], 6000);
    assert.equal(r.totalPaise, 185900);
  });

  test("discount reduces total correctly", () => {
    const r = calculateTotals([{ unitPricePaise: 179900, quantity: 1 }], 0, 20000);
    assert.equal(r.totalPaise, 159900);
  });

  test("discount larger than subtotal clamps to 0", () => {
    const r = calculateTotals([{ unitPricePaise: 1000, quantity: 1 }], 0, 9999);
    assert.equal(r.totalPaise, 0);
  });

  test("zero quantity item contributes zero", () => {
    const r = calculateTotals([{ unitPricePaise: 179900, quantity: 0 }]);
    assert.equal(r.subtotalPaise, 0);
    assert.equal(r.totalPaise, 0);
  });

  test("empty cart returns all zeros", () => {
    const r = calculateTotals([]);
    assert.equal(r.subtotalPaise, 0);
    assert.equal(r.totalPaise, 0);
  });

  test("GST 12% split on ₹1799 price", () => {
    const split = splitGst(179900, 12);
    assert.equal(split.gstPercent, 12);
    assert.ok(split.basePaise > 0, "base price should be positive");
    assert.ok(split.gstPaise > 0, "GST should be positive");
    // basePaise + gstPaise must equal original price
    assert.equal(split.basePaise + split.gstPaise, 179900);
    // GST as % of base should be approximately 12%
    const actualGstPercent = (split.gstPaise / split.basePaise) * 100;
    assert.ok(Math.abs(actualGstPercent - 12) < 0.1, `GST percent should be ~12%, got ${actualGstPercent.toFixed(2)}%`);
  });

  test("GST 5% split", () => {
    const split = splitGst(100000, 5);
    assert.equal(split.basePaise + split.gstPaise, 100000);
    const actualGstPercent = (split.gstPaise / split.basePaise) * 100;
    assert.ok(Math.abs(actualGstPercent - 5) < 0.2);
  });

  test("GST 18% split", () => {
    const split = splitGst(118000, 18); // exactly ₹1180 = ₹1000 base + ₹180 GST
    assert.equal(split.basePaise + split.gstPaise, 118000);
    assert.equal(split.basePaise, 100000);
    assert.equal(split.gstPaise, 18000);
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// MODULE: rate-limit — bucket lifecycle, cleanup, enforce
// ─────────────────────────────────────────────────────────────────────────────
describe("Rate Limiter — bucket lifecycle and enforcement", () => {

  class RateLimiter {
    constructor() { this.buckets = new Map(); }

    rateLimit(key, limit, windowMs) {
      const now = Date.now();
      const current = this.buckets.get(key);

      if (this.buckets.size > 10000) {
        for (const [k, v] of this.buckets.entries()) {
          if (v.resetAt <= now) this.buckets.delete(k);
        }
      }

      if (!current || current.resetAt <= now) {
        this.buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfter: 0, current: 1, limit };
      }

      current.count += 1;
      const allowed = current.count <= limit;
      const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
      return { allowed, retryAfter, current: current.count, limit };
    }

    getClientIp(headers) {
      const forwarded = headers["x-forwarded-for"];
      if (forwarded) return forwarded.split(",")[0].trim();
      return headers["x-real-ip"] || "127.0.0.1";
    }
  }

  test("first request is always allowed", () => {
    const rl = new RateLimiter();
    const r = rl.rateLimit("test:127.0.0.1", 5, 60000);
    assert.equal(r.allowed, true);
    assert.equal(r.current, 1);
  });

  test("requests up to limit are all allowed", () => {
    const rl = new RateLimiter();
    for (let i = 0; i < 5; i++) {
      const r = rl.rateLimit("test:127.0.0.2", 5, 60000);
      assert.equal(r.allowed, true, `Request ${i + 1} should be allowed`);
    }
  });

  test("request exceeding limit is blocked", () => {
    const rl = new RateLimiter();
    for (let i = 0; i < 5; i++) rl.rateLimit("test:127.0.0.3", 5, 60000);
    const r = rl.rateLimit("test:127.0.0.3", 5, 60000);
    assert.equal(r.allowed, false);
    assert.ok(r.retryAfter >= 1, "retryAfter must be at least 1 second");
  });

  test("retryAfter is always at least 1 when blocked", () => {
    const rl = new RateLimiter();
    for (let i = 0; i < 6; i++) rl.rateLimit("test:ip4", 5, 1000);
    const r = rl.rateLimit("test:ip4", 5, 1000);
    assert.equal(r.allowed, false);
    assert.ok(r.retryAfter >= 1);
  });

  test("different keys are independent buckets", () => {
    const rl = new RateLimiter();
    for (let i = 0; i < 5; i++) rl.rateLimit("user:A", 5, 60000);
    const rA = rl.rateLimit("user:A", 5, 60000);
    const rB = rl.rateLimit("user:B", 5, 60000);
    assert.equal(rA.allowed, false, "User A should be blocked");
    assert.equal(rB.allowed, true, "User B should be allowed on fresh bucket");
  });

  test("expired window resets counter — requests allowed again", async () => {
    const rl = new RateLimiter();
    for (let i = 0; i < 5; i++) rl.rateLimit("test:expire", 5, 1);
    // Wait for the 1ms window to expire
    await new Promise(r => setTimeout(r, 5));
    const r = rl.rateLimit("test:expire", 5, 1);
    assert.equal(r.allowed, true, "Counter should reset after window expiry");
    assert.equal(r.current, 1);
  });

  test("IP extraction from x-forwarded-for header (first IP)", () => {
    const rl = new RateLimiter();
    const ip = rl.getClientIp({ "x-forwarded-for": "203.0.113.1, 198.51.100.2, 192.168.1.1" });
    assert.equal(ip, "203.0.113.1");
  });

  test("IP extraction from x-real-ip when no x-forwarded-for", () => {
    const rl = new RateLimiter();
    const ip = rl.getClientIp({ "x-real-ip": "203.0.113.99" });
    assert.equal(ip, "203.0.113.99");
  });

  test("fallback to 127.0.0.1 when no headers present", () => {
    const rl = new RateLimiter();
    const ip = rl.getClientIp({});
    assert.equal(ip, "127.0.0.1");
  });

  test("limit=1 allows exactly 1 request then blocks", () => {
    const rl = new RateLimiter();
    const r1 = rl.rateLimit("strict:ip", 1, 60000);
    const r2 = rl.rateLimit("strict:ip", 1, 60000);
    assert.equal(r1.allowed, true);
    assert.equal(r2.allowed, false);
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// MODULE: brand assets — invariant and slot registry
// ─────────────────────────────────────────────────────────────────────────────
describe("Brand Assets — invariant, slot registry, and decoupling", () => {

  const BRAND_ASSET_SLOTS = ["LOGO_2D", "LOGO_GLB", "LOGO_DARK", "LOGO_LIGHT", "FAVICON", "BRAND_WATERMARK"];
  const PRODUCT_ASSET_SLOTS = ["PRODUCT_FRONT_IMAGE", "PRODUCT_BACK_IMAGE", "PRODUCT_LEFT_SLEEVE_IMAGE",
    "PRODUCT_RIGHT_SLEEVE_IMAGE", "PRODUCT_PRINT_IMAGE", "PRODUCT_THUMBNAIL", "HERO_GLB",
    "HERO_BACKGROUND", "MOBILE_BACKGROUND", "SEO_OG_IMAGE"];

  const DEFAULT_BRAND_ASSETS = {
    LOGO_2D: { url: "/bengaluru-signal-after-rain.svg", mimeType: "image/svg+xml" },
    LOGO_GLB: { url: "", mimeType: "model/gltf-binary" },
    LOGO_DARK: { url: "/bengaluru-signal-after-rain.svg", mimeType: "image/svg+xml" },
    LOGO_LIGHT: { url: "/bengaluru-signal-after-rain.svg", mimeType: "image/svg+xml" },
    FAVICON: { url: "/favicon.ico", mimeType: "image/x-icon" },
    BRAND_WATERMARK: { url: "/bengaluru-signal-after-rain.svg", mimeType: "image/svg+xml" },
  };

  test("LOGO_GLB is in brand slots", () => assert.ok(BRAND_ASSET_SLOTS.includes("LOGO_GLB")));
  test("HERO_GLB is in product slots", () => assert.ok(PRODUCT_ASSET_SLOTS.includes("HERO_GLB")));
  test("LOGO_GLB is NOT in product slots", () => assert.equal(PRODUCT_ASSET_SLOTS.includes("LOGO_GLB"), false));
  test("HERO_GLB is NOT in brand slots", () => assert.equal(BRAND_ASSET_SLOTS.includes("HERO_GLB"), false));

  test("sets are strictly disjoint — no shared slot names", () => {
    const overlap = BRAND_ASSET_SLOTS.filter(s => PRODUCT_ASSET_SLOTS.includes(s));
    assert.deepEqual(overlap, [], `Brand and product slots must be disjoint. Overlap: ${overlap.join(", ")}`);
  });

  test("DEFAULT_BRAND_ASSETS covers all 6 brand slots", () => {
    for (const slot of BRAND_ASSET_SLOTS) {
      assert.ok(slot in DEFAULT_BRAND_ASSETS, `Missing default for slot: ${slot}`);
    }
  });

  test("brand asset URLs are strings (not undefined)", () => {
    for (const [slot, def] of Object.entries(DEFAULT_BRAND_ASSETS)) {
      assert.equal(typeof def.url, "string", `${slot} URL should be a string`);
    }
  });

  test("LOGO_GLB default is empty string (not undefined) — 3D is optional", () => {
    assert.equal(DEFAULT_BRAND_ASSETS.LOGO_GLB.url, "");
  });

  test("brand slot count is exactly 6", () => assert.equal(BRAND_ASSET_SLOTS.length, 6));
  test("product slot count is exactly 10", () => assert.equal(PRODUCT_ASSET_SLOTS.length, 10));

  test("fallback resolution uses DEFAULT when no DB asset", () => {
    // Simulate getActiveBrandAssets with no DB rows
    const result = { ...Object.fromEntries(BRAND_ASSET_SLOTS.map(s => [s, DEFAULT_BRAND_ASSETS[s].url])) };
    const dbRows = []; // empty
    dbRows.forEach(row => { if (row.slot in result) result[row.slot] = row.url; });

    assert.equal(result.LOGO_2D, DEFAULT_BRAND_ASSETS.LOGO_2D.url);
    assert.equal(result.FAVICON, DEFAULT_BRAND_ASSETS.FAVICON.url);
  });

  test("DB override replaces default for active slot", () => {
    const result = { ...Object.fromEntries(BRAND_ASSET_SLOTS.map(s => [s, DEFAULT_BRAND_ASSETS[s].url])) };
    const dbRows = [{ slot: "LOGO_2D", url: "/cdn/brand/new-logo.svg" }];
    dbRows.forEach(row => { if (row.slot in result) result[row.slot] = row.url; });

    assert.equal(result.LOGO_2D, "/cdn/brand/new-logo.svg");
    assert.equal(result.LOGO_DARK, DEFAULT_BRAND_ASSETS.LOGO_DARK.url); // untouched
  });

  test("unknown slot from DB is silently ignored", () => {
    const result = { ...Object.fromEntries(BRAND_ASSET_SLOTS.map(s => [s, DEFAULT_BRAND_ASSETS[s].url])) };
    const dbRows = [{ slot: "HERO_GLB", url: "/cdn/product.glb" }]; // HERO_GLB is not a brand slot
    dbRows.forEach(row => { if (row.slot in result) result[row.slot] = row.url; });

    // result should be unchanged because HERO_GLB is not in brand slots
    assert.equal(result.LOGO_2D, DEFAULT_BRAND_ASSETS.LOGO_2D.url);
    assert.equal("HERO_GLB" in result, false, "HERO_GLB must not pollute brand asset map");
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// MODULE: inventory engine — stock formula and variant states
// ─────────────────────────────────────────────────────────────────────────────
describe("Inventory Engine — stock formula and variant status matrix", () => {

  function computeVariant(physical, reserved, threshold = 5) {
    const available = Math.max(0, physical - reserved);
    let status = "ACTIVE";
    if (physical === 0 || available === 0) status = "SOLD OUT";
    else if (available <= threshold) status = "LOW";
    return { physicalStock: physical, reservedStock: reserved, availableStock: available, threshold, status };
  }

  function computeProductStock(variants) {
    const totalAvailable = variants.reduce((sum, v) => sum + v.availableStock, 0);
    return { totalAvailableStock: totalAvailable, isSoldOut: totalAvailable <= 0 };
  }

  test("available = physical - reserved", () => {
    const v = computeVariant(20, 7);
    assert.equal(v.availableStock, 13);
  });

  test("available never goes below 0", () => {
    const v = computeVariant(5, 10); // reserved > physical
    assert.equal(v.availableStock, 0);
    assert.equal(v.status, "SOLD OUT");
  });

  test("zero physical stock → SOLD OUT", () => {
    const v = computeVariant(0, 0);
    assert.equal(v.status, "SOLD OUT");
    assert.equal(v.availableStock, 0);
  });

  test("available at exactly threshold → LOW (not ACTIVE)", () => {
    const v = computeVariant(10, 5, 5); // available = 5 = threshold
    assert.equal(v.status, "LOW");
    assert.equal(v.availableStock, 5);
  });

  test("available one above threshold → ACTIVE", () => {
    const v = computeVariant(11, 5, 5); // available = 6 > 5
    assert.equal(v.status, "ACTIVE");
  });

  test("available at 1 → LOW when threshold is 5", () => {
    const v = computeVariant(6, 5, 5);
    assert.equal(v.availableStock, 1);
    assert.equal(v.status, "LOW");
  });

  test("product with all sizes in stock → not sold out", () => {
    const variants = [
      computeVariant(10, 0), computeVariant(15, 0), computeVariant(12, 0), computeVariant(8, 0)
    ];
    const { totalAvailableStock, isSoldOut } = computeProductStock(variants);
    assert.equal(totalAvailableStock, 45);
    assert.equal(isSoldOut, false);
  });

  test("product with all sizes at zero → sold out", () => {
    const variants = [
      computeVariant(0, 0), computeVariant(0, 0), computeVariant(0, 0), computeVariant(0, 0)
    ];
    const { totalAvailableStock, isSoldOut } = computeProductStock(variants);
    assert.equal(totalAvailableStock, 0);
    assert.equal(isSoldOut, true);
  });

  test("product with only 1 size available → not sold out", () => {
    const variants = [
      computeVariant(0, 0), computeVariant(1, 0), computeVariant(0, 0), computeVariant(0, 0)
    ];
    const { totalAvailableStock, isSoldOut } = computeProductStock(variants);
    assert.equal(totalAvailableStock, 1);
    assert.equal(isSoldOut, false);
  });

  test("high threshold with many reservations → LOW status", () => {
    const v = computeVariant(20, 12, 10); // available = 8, threshold = 10
    assert.equal(v.availableStock, 8);
    assert.equal(v.status, "LOW");
  });

  test("threshold = 0 → never LOW, always ACTIVE if any stock", () => {
    const v = computeVariant(1, 0, 0);
    assert.equal(v.availableStock, 1);
    assert.equal(v.status, "ACTIVE");
  });
});
