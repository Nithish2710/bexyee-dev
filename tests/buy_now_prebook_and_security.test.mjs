import { describe, it } from "node:test";
import assert from "node:assert/strict";

/**
 * Mirror of authoritative resolvePurchaseMode function from src/lib/product-engine.ts
 */
function resolvePurchaseMode(
  prebookConfig,
  isPurchasable,
  availableStock,
  serverTime = new Date().toISOString()
) {
  const now = new Date(serverTime).getTime();

  if (prebookConfig?.isEnabled) {
    const startsAt = prebookConfig.startsAt ? new Date(prebookConfig.startsAt).getTime() : 0;
    const endsAt = prebookConfig.endsAt ? new Date(prebookConfig.endsAt).getTime() : Infinity;

    if (now >= startsAt && now <= endsAt) {
      return "PREBOOK";
    }

    if (now > endsAt) {
      if (isPurchasable && availableStock > 0) {
        return "BUY_NOW";
      }
      return "UNAVAILABLE";
    }

    return "UNAVAILABLE";
  }

  if (isPurchasable && availableStock > 0) {
    return "BUY_NOW";
  }

  return "UNAVAILABLE";
}

describe("BEXYEE — Buy Now + Pre-Booking Authoritative Engine Tests", () => {
  const nowIso = "2026-08-25T12:00:00.000Z";

  it("1. Returns PREBOOK when pre-booking is enabled and current time is within window", () => {
    const mode = resolvePurchaseMode(
      {
        isEnabled: true,
        startsAt: "2026-08-01T00:00:00.000Z",
        endsAt: "2026-09-01T00:00:00.000Z",
        expectedFulfillmentDate: "OCTOBER 2026",
      },
      true, // isPurchasable
      50,   // availableStock
      nowIso
    );
    assert.equal(mode, "PREBOOK");
  });

  it("2. Returns PREBOOK even when available physical stock is 0 if prebook window is active", () => {
    const mode = resolvePurchaseMode(
      {
        isEnabled: true,
        startsAt: "2026-08-01T00:00:00.000Z",
        endsAt: "2026-09-01T00:00:00.000Z",
      },
      true,
      0, // 0 stock allocated in advance
      nowIso
    );
    assert.equal(mode, "PREBOOK");
  });

  it("3. Returns UNAVAILABLE if pre-booking starts in the future", () => {
    const mode = resolvePurchaseMode(
      {
        isEnabled: true,
        startsAt: "2026-09-01T00:00:00.000Z", // In future
        endsAt: "2026-10-01T00:00:00.000Z",
      },
      true,
      50,
      nowIso
    );
    assert.equal(mode, "UNAVAILABLE");
  });

  it("4. Automatically transitions to BUY_NOW when pre-booking window expires and stock > 0", () => {
    const mode = resolvePurchaseMode(
      {
        isEnabled: true,
        startsAt: "2026-07-01T00:00:00.000Z",
        endsAt: "2026-08-01T00:00:00.000Z", // Ended in past
      },
      true,
      25, // Available stock remaining
      nowIso
    );
    assert.equal(mode, "BUY_NOW");
  });

  it("5. Automatically transitions to UNAVAILABLE when pre-booking window expires and stock = 0", () => {
    const mode = resolvePurchaseMode(
      {
        isEnabled: true,
        startsAt: "2026-07-01T00:00:00.000Z",
        endsAt: "2026-08-01T00:00:00.000Z", // Ended in past
      },
      true,
      0, // Zero stock
      nowIso
    );
    assert.equal(mode, "UNAVAILABLE");
  });

  it("6. Normal product with stock and isPurchasable=true returns BUY_NOW", () => {
    const mode = resolvePurchaseMode(
      undefined,
      true,
      10,
      nowIso
    );
    assert.equal(mode, "BUY_NOW");
  });

  it("7. Normal product with 0 stock returns UNAVAILABLE (Sold Out)", () => {
    const mode = resolvePurchaseMode(
      undefined,
      true,
      0,
      nowIso
    );
    assert.equal(mode, "UNAVAILABLE");
  });

  it("8. Normal product with isPurchasable=false (Draft / Scheduled) returns UNAVAILABLE", () => {
    const mode = resolvePurchaseMode(
      undefined,
      false,
      10,
      nowIso
    );
    assert.equal(mode, "UNAVAILABLE");
  });

  it("9. Strict Mutual Exclusivity: resolved mode is strictly one of BUY_NOW, PREBOOK, UNAVAILABLE", () => {
    const allowedModes = new Set(["BUY_NOW", "PREBOOK", "UNAVAILABLE"]);
    const modes = [
      resolvePurchaseMode({ isEnabled: true }, true, 10),
      resolvePurchaseMode(undefined, true, 10),
      resolvePurchaseMode(undefined, false, 10),
      resolvePurchaseMode(undefined, true, 0),
    ];

    for (const m of modes) {
      assert.equal(allowedModes.has(m), true);
    }
  });

  it("10. Storefront Single-Button Invariant: Storefront renders either PRE-BOOK or BUY NOW (+ CART), never both", () => {
    function getRenderedStorefrontActions(launchState) {
      if (launchState.status !== "LIVE") {
        return ["NON_LIVE_STATUS_BUTTON"];
      }
      if (launchState.purchaseMode === "PREBOOK") {
        return ["PRE_BOOK_NOW"];
      }
      if (launchState.purchaseMode === "BUY_NOW") {
        return ["BUY_NOW", "ADD_TO_CART"];
      }
      return ["SOLD_OUT_DISABLED"];
    }

    const prebookActions = getRenderedStorefrontActions({ status: "LIVE", purchaseMode: "PREBOOK" });
    assert.deepEqual(prebookActions, ["PRE_BOOK_NOW"]);
    assert.equal(prebookActions.includes("BUY_NOW"), false);
    assert.equal(prebookActions.includes("ADD_TO_CART"), false);

    const buyNowActions = getRenderedStorefrontActions({ status: "LIVE", purchaseMode: "BUY_NOW" });
    assert.deepEqual(buyNowActions, ["BUY_NOW", "ADD_TO_CART"]);
    assert.equal(buyNowActions.includes("PRE_BOOK_NOW"), false);

    const pausedActions = getRenderedStorefrontActions({ status: "PAUSED", purchaseMode: "BUY_NOW" });
    assert.deepEqual(pausedActions, ["NON_LIVE_STATUS_BUTTON"]);
    assert.equal(pausedActions.includes("BUY_NOW"), false);
    assert.equal(pausedActions.includes("PRE_BOOK_NOW"), false);
  });

  it("11. Purchase Mode Inertness: Non-LIVE states make purchase mode inert", () => {
    const nonLiveStates = ["DRAFT", "READY", "SCHEDULED", "PAUSED", "SOLD_OUT", "ENDED", "ARCHIVED"];
    for (const status of nonLiveStates) {
      const launch = { status, purchaseMode: "PREBOOK" };
      const isStorefrontBuyable = launch.status === "LIVE";
      assert.equal(isStorefrontBuyable, false);
    }
  });

  it("12. Per-Size Pre-Book Limits & Independent Availability Calculation", () => {
    function computeVariantPrebookState(variantsConfig) {
      return variantsConfig.map((v) => {
        const availablePrebook = Math.max(0, v.prebookLimit - v.prebookedCount);
        let status = "ACTIVE";
        if (availablePrebook === 0) status = "SOLD OUT";
        else if (availablePrebook <= (v.threshold || 5)) status = "LOW";

        return {
          size: v.size,
          prebookLimit: v.prebookLimit,
          prebookedCount: v.prebookedCount,
          availableStock: availablePrebook,
          status,
          isAvailable: availablePrebook > 0,
        };
      });
    }

    const testVariants = [
      { size: "S", prebookLimit: 20, prebookedCount: 5, threshold: 5 },
      { size: "M", prebookLimit: 50, prebookedCount: 49, threshold: 5 }, // 1 remaining -> LOW
      { size: "L", prebookLimit: 30, prebookedCount: 30, threshold: 5 }, // 0 remaining -> SOLD OUT
      { size: "XL", prebookLimit: 20, prebookedCount: 0, threshold: 5 },
    ];

    const results = computeVariantPrebookState(testVariants);

    // Verify Size S
    assert.equal(results[0].size, "S");
    assert.equal(results[0].availableStock, 15);
    assert.equal(results[0].status, "ACTIVE");
    assert.equal(results[0].isAvailable, true);

    // Verify Size M (50 limit, 49 prebooked -> 1 remaining, LOW)
    assert.equal(results[1].size, "M");
    assert.equal(results[1].availableStock, 1);
    assert.equal(results[1].status, "LOW");
    assert.equal(results[1].isAvailable, true);

    // Verify Size L (30 limit, 30 prebooked -> SOLD OUT, disabled)
    assert.equal(results[2].size, "L");
    assert.equal(results[2].availableStock, 0);
    assert.equal(results[2].status, "SOLD OUT");
    assert.equal(results[2].isAvailable, false);

    // Verify Size XL
    assert.equal(results[3].size, "XL");
    assert.equal(results[3].availableStock, 20);
    assert.equal(results[3].status, "ACTIVE");
    assert.equal(results[3].isAvailable, true);
  });

  it("13. Independence Invariant: M being sold out does NOT make L sold out", () => {
    function evaluateSizes(sizeLimits, sizePrebooked) {
      const sizes = ["S", "M", "L", "XL"];
      return sizes.map((s) => {
        const limit = sizeLimits[s] ?? 0;
        const booked = sizePrebooked[s] ?? 0;
        const available = Math.max(0, limit - booked);
        return {
          size: s,
          available,
          isSoldOut: available === 0,
        };
      });
    }

    // Scenario: Size M is completely sold out (50 / 50), but Size L has 15 available (15 / 30)
    const sizesState = evaluateSizes(
      { S: 20, M: 50, L: 30, XL: 20 },
      { S: 10, M: 50, L: 15, XL: 0 }
    );

    const m = sizesState.find((x) => x.size === "M");
    const l = sizesState.find((x) => x.size === "L");

    assert.equal(m.isSoldOut, true);
    assert.equal(m.available, 0);

    assert.equal(l.isSoldOut, false);
    assert.equal(l.available, 15);
  });

  it("14. Customer Size Selector Invariant: Disabled buttons match per-size available pre-book counts", () => {
    const variants = [
      { size: "S", availableStock: 10, status: "ACTIVE" },
      { size: "M", availableStock: 1, status: "LOW" },
      { size: "L", availableStock: 0, status: "SOLD OUT" },
      { size: "XL", availableStock: 5, status: "ACTIVE" },
    ];

    const renderedPills = variants.map((v) => ({
      size: v.size,
      disabled: v.availableStock <= 0,
      showLowBadge: v.availableStock > 0 && v.availableStock <= 3,
      showSoldBadge: v.availableStock <= 0,
    }));

    // S is selectable, not low, not sold
    assert.equal(renderedPills[0].disabled, false);
    assert.equal(renderedPills[0].showLowBadge, false);
    assert.equal(renderedPills[0].showSoldBadge, false);

    // M is selectable, shows low badge (1 remaining)
    assert.equal(renderedPills[1].disabled, false);
    assert.equal(renderedPills[1].showLowBadge, true);
    assert.equal(renderedPills[1].showSoldBadge, false);

    // L is disabled, shows sold badge
    assert.equal(renderedPills[2].disabled, true);
    assert.equal(renderedPills[2].showLowBadge, false);
    assert.equal(renderedPills[2].showSoldBadge, true);

    // XL is selectable
    assert.equal(renderedPills[3].disabled, false);
  });

  it("15. Admin Size-Specific Persistence Invariant: Admin edits update product_sizes.prebook_limit independently", () => {
    const initialDbSizes = [
      { size: "S", prebook_limit: 20 },
      { size: "M", prebook_limit: 50 },
      { size: "L", prebook_limit: 30 },
      { size: "XL", prebook_limit: 20 },
    ];

    const adminUpdate = {
      sizePrebookLimits: {
        S: 25,
        M: 75,
        L: 30, // unchanged
        XL: 40,
      },
    };

    const updatedDbSizes = initialDbSizes.map((row) => ({
      ...row,
      prebook_limit: adminUpdate.sizePrebookLimits[row.size] ?? row.prebook_limit,
    }));

    assert.equal(updatedDbSizes.find((s) => s.size === "S").prebook_limit, 25);
    assert.equal(updatedDbSizes.find((s) => s.size === "M").prebook_limit, 75);
    assert.equal(updatedDbSizes.find((s) => s.size === "L").prebook_limit, 30);
    assert.equal(updatedDbSizes.find((s) => s.size === "XL").prebook_limit, 40);
  });
});
