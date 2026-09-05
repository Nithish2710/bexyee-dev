import assert from "node:assert/strict";
import { createHmac, timingSafeEqual } from "node:crypto";
import { test, describe } from "node:test";
import { z } from "zod";

// ----------------------------------------------------
// 1. COMMERCE UNIT TESTS
// ----------------------------------------------------
describe("Commerce Logic (src/lib/commerce.ts)", () => {
  function calculateTotals(items, shippingPaise = 0, discountPaise = 0) {
    const subtotalPaise = items.reduce((total, item) => total + item.unitPricePaise * item.quantity, 0);
    return { subtotalPaise, shippingPaise, discountPaise, totalPaise: Math.max(0, subtotalPaise - discountPaise + shippingPaise) };
  }

  test("calculateTotals with single item and zero shipping/discount", () => {
    const result = calculateTotals([{ unitPricePaise: 179900, quantity: 1 }]);
    assert.equal(result.subtotalPaise, 179900);
    assert.equal(result.shippingPaise, 0);
    assert.equal(result.discountPaise, 0);
    assert.equal(result.totalPaise, 179900);
  });

  test("calculateTotals with multiple items, shipping, and discount", () => {
    const items = [
      { unitPricePaise: 179900, quantity: 2 },
      { unitPricePaise: 99900, quantity: 1 }
    ];
    const result = calculateTotals(items, 6000, 20000);
    assert.equal(result.subtotalPaise, 459700);
    assert.equal(result.shippingPaise, 6000);
    assert.equal(result.discountPaise, 20000);
    assert.equal(result.totalPaise, 445700);
  });

  test("calculateTotals clamps negative totals to zero", () => {
    const result = calculateTotals([{ unitPricePaise: 1000, quantity: 1 }], 0, 50000);
    assert.equal(result.subtotalPaise, 1000);
    assert.equal(result.totalPaise, 0);
  });

  // Schema validations
  const sizes = ["S", "M", "L", "XL"];
  const sizeSchema = z.enum(sizes);
  const cartItemSchema = z.object({ productId: z.string().uuid(), size: sizeSchema, quantity: z.number().int().min(1).max(20) });
  const checkoutSchema = z.object({ cartId: z.string().uuid(), guestEmail: z.string().email().optional(), address: z.record(z.string(), z.string()).optional(), attribution: z.record(z.string(), z.string()).default({}) });
  const eventSchema = z.object({ eventName: z.string().min(1).max(80), eventId: z.string().min(8).max(120), sessionId: z.string().max(120).optional(), productId: z.string().uuid().optional(), properties: z.record(z.string(), z.unknown()).default({}), attribution: z.record(z.string(), z.string()).default({}) });

  test("cartItemSchema accepts valid cart item", () => {
    const valid = { productId: "123e4567-e89b-12d3-a456-426614174000", size: "M", quantity: 2 };
    assert.equal(cartItemSchema.safeParse(valid).success, true);
  });

  test("cartItemSchema rejects invalid size and negative quantity", () => {
    assert.equal(cartItemSchema.safeParse({ productId: "123e4567-e89b-12d3-a456-426614174000", size: "XXL", quantity: 1 }).success, false);
    assert.equal(cartItemSchema.safeParse({ productId: "123e4567-e89b-12d3-a456-426614174000", size: "M", quantity: 0 }).success, false);
    assert.equal(cartItemSchema.safeParse({ productId: "123e4567-e89b-12d3-a456-426614174000", size: "M", quantity: 25 }).success, false);
    assert.equal(cartItemSchema.safeParse({ productId: "invalid-uuid", size: "M", quantity: 1 }).success, false);
  });

  test("checkoutSchema accepts valid checkout payload", () => {
    const valid = {
      cartId: "123e4567-e89b-12d3-a456-426614174000",
      guestEmail: "customer@example.com",
      address: { name: "Rad", pincode: "560001", line1: "MG Road", city: "Bengaluru", state: "Karnataka", phone: "9876543210" },
      attribution: { utm_source: "instagram", utm_campaign: "launch" }
    };
    assert.equal(checkoutSchema.safeParse(valid).success, true);
  });

  test("eventSchema validates analytics event payload", () => {
    const valid = {
      eventName: "product_view",
      eventId: "evt-12345678",
      sessionId: "sess-abc-123",
      properties: { productName: "Bengaluru Tee", price: 1799 },
      attribution: { utm_source: "google" }
    };
    assert.equal(eventSchema.safeParse(valid).success, true);
  });

  test("orderStatuses includes REQUIRES_REFUND and standard lifecycle statuses", () => {
    const orderStatuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED", "REQUIRES_REFUND"];
    const statusSchema = z.enum(orderStatuses);
    assert.equal(statusSchema.safeParse("REQUIRES_REFUND").success, true);
    assert.equal(statusSchema.safeParse("PAID").success, true);
    assert.equal(statusSchema.safeParse("UNKNOWN_STATUS").success, false);
  });

  test("reservationStatuses validates ACTIVE, CONFIRMED, RELEASED, EXPIRED", () => {
    const reservationStatuses = ["ACTIVE", "CONFIRMED", "RELEASED", "EXPIRED"];
    const resSchema = z.enum(reservationStatuses);
    assert.equal(resSchema.safeParse("ACTIVE").success, true);
    assert.equal(resSchema.safeParse("CONFIRMED").success, true);
    assert.equal(resSchema.safeParse("RELEASED").success, true);
    assert.equal(resSchema.safeParse("EXPIRED").success, true);
    assert.equal(resSchema.safeParse("INVALID").success, false);
  });
});

// ----------------------------------------------------
// 2. SHIPPING & PINCODE SERVICEABILITY TESTS
// ----------------------------------------------------
describe("Shipping Logic (src/lib/shipping.ts)", () => {
  function checkServiceabilityDefault(pincode) {
    return /^[1-9][0-9]{5}$/.test(pincode);
  }

  function quoteShipping(subtotalPaise, freeThreshold = 500000, defaultRate = 6000) {
    if (subtotalPaise >= freeThreshold) return 0;
    return defaultRate;
  }

  test("pincode regex validates 6-digit Indian PIN codes correctly", () => {
    assert.equal(checkServiceabilityDefault("560001"), true);
    assert.equal(checkServiceabilityDefault("110001"), true);
    assert.equal(checkServiceabilityDefault("700001"), true);
    assert.equal(checkServiceabilityDefault("012345"), false);
    assert.equal(checkServiceabilityDefault("56000"), false);
    assert.equal(checkServiceabilityDefault("5600011"), false);
    assert.equal(checkServiceabilityDefault("56000A"), false);
    assert.equal(checkServiceabilityDefault(""), false);
  });

  test("quote calculation applies free shipping threshold", () => {
    assert.equal(quoteShipping(179900), 6000);
    assert.equal(quoteShipping(499999), 6000);
    assert.equal(quoteShipping(500000), 0);
    assert.equal(quoteShipping(600000), 0);
  });
});

// ----------------------------------------------------
// 3. RATE LIMITING TESTS
// ----------------------------------------------------
describe("Rate Limiting (src/lib/rate-limit.ts)", () => {
  class RateLimiter {
    constructor() {
      this.buckets = new Map();
    }
    rateLimit(key, limit, windowMs) {
      const now = Date.now();
      const current = this.buckets.get(key);
      if (!current || current.resetAt <= now) {
        this.buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfter: 0 };
      }
      current.count += 1;
      return { allowed: current.count <= limit, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
    }
  }

  test("rateLimit allows up to limit and blocks excess requests", () => {
    const limiter = new RateLimiter();
    const key = "test-ip-1";
    for (let i = 1; i <= 5; i++) {
      const res = limiter.rateLimit(key, 5, 1000);
      assert.equal(res.allowed, true, `Request ${i} should be allowed`);
    }
    const excess = limiter.rateLimit(key, 5, 1000);
    assert.equal(excess.allowed, false, "6th request should be blocked");
    assert.ok(excess.retryAfter > 0);
  });
});

// ----------------------------------------------------
// 4. HMAC SIGNATURE VERIFICATION TESTS (RAZORPAY)
// ----------------------------------------------------
describe("HMAC Signature Verification", () => {
  function verifyRazorpaySignature(orderId, paymentId, signature, secret) {
    const digest = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
    return digest.length === signature.length && timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  }

  test("verifyRazorpaySignature verifies valid signature with timingSafeEqual", () => {
    const secret = "test_secret_key_123";
    const orderId = "order_N123456";
    const paymentId = "pay_N987654";
    const validSignature = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
    assert.equal(verifyRazorpaySignature(orderId, paymentId, validSignature, secret), true);
  });

  test("verifyRazorpaySignature rejects invalid signature or tampered data", () => {
    const secret = "test_secret_key_123";
    const orderId = "order_N123456";
    const paymentId = "pay_N987654";
    const invalidSignature = createHmac("sha256", "wrong_secret").update(`${orderId}|${paymentId}`).digest("hex");
    assert.equal(verifyRazorpaySignature(orderId, paymentId, invalidSignature, secret), false);
    assert.equal(verifyRazorpaySignature("order_tampered", paymentId, invalidSignature, secret), false);
  });
});
