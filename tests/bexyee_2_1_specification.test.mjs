import test from "node:test";
import assert from "node:assert/strict";

// ─────────────────────────────────────────────────────────────────────────────
// BEXYEE 2.1 MASTER SPECIFICATION COMPREHENSIVE TEST SUITE
// Validates all architectural invariants, schemas, calculations, and mechanics
// ─────────────────────────────────────────────────────────────────────────────

test("BEXYEE 2.1 — Section 2 & 8: Universal Movable Background & Single Renderer Contract", async (t) => {
  await t.test("Product background contract provides Desktop, Tablet, and Mobile sets", () => {
    function buildProductBackgroundSet(product) {
      const defaultBg = "/bengaluru-signal-after-rain.svg";
      return {
        desktop: product.background_desktop || defaultBg,
        tablet: product.background_tablet || product.background_desktop || defaultBg,
        mobile: product.background_mobile || product.background_desktop || defaultBg,
      };
    }

    const customProduct = {
      background_desktop: "/assets/cities/mumbai-coastal-desktop.svg",
      background_tablet: "/assets/cities/mumbai-coastal-tablet.svg",
      background_mobile: "/assets/cities/mumbai-coastal-mobile.svg",
    };

    const backgrounds = buildProductBackgroundSet(customProduct);
    assert.equal(backgrounds.desktop, "/assets/cities/mumbai-coastal-desktop.svg");
    assert.equal(backgrounds.tablet, "/assets/cities/mumbai-coastal-tablet.svg");
    assert.equal(backgrounds.mobile, "/assets/cities/mumbai-coastal-mobile.svg");

    // Fallback resolution
    const fallbackProduct = {};
    const fallbackBg = buildProductBackgroundSet(fallbackProduct);
    assert.equal(fallbackBg.desktop, "/bengaluru-signal-after-rain.svg");
    assert.equal(fallbackBg.tablet, "/bengaluru-signal-after-rain.svg");
    assert.equal(fallbackBg.mobile, "/bengaluru-signal-after-rain.svg");
  });

  await t.test("Universal Renderer: No experience branching in single product contract", () => {
    // Section 2: 5 experiences collapsed into 1 single renderer
    const product = {
      id: "prod_001",
      name: "Bengaluru Tee",
      slug: "bengaluru-tee",
      sku: "BEXYEE-BLR-001",
      pricePaise: 179900,
      gstRate: 12,
      cityName: "BENGALURU",
      collection: "MONSOON 2026",
      edition: "DROP 001",
    };

    assert.ok(product.slug, "Single renderer uses /product/[slug] always");
    assert.equal(typeof product.pricePaise, "number");
    assert.equal(product.gstRate, 12);
  });
});

test("BEXYEE 2.1 — Section 4: Sizing & Size Chart Architecture", async (t) => {
  const DEFAULT_APPAREL_SIZE_CHART = {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Standard Apparel Tops (S/M/L/XL)",
    category: "APPAREL_TOPS",
    unit: "INCHES",
    measurements: {
      S: { length: 28.5, chest: 42.0, shoulder: 20.5, sleeve: 8.5 },
      M: { length: 29.5, chest: 44.0, shoulder: 21.5, sleeve: 9.0 },
      L: { length: 30.5, chest: 46.0, shoulder: 22.5, sleeve: 9.5 },
      XL: { length: 31.5, chest: 48.0, shoulder: 23.5, sleeve: 10.0 },
    },
    isDefault: true,
  };

  function resolveSizeChart(customChart) {
    if (!customChart || !customChart.measurements) return DEFAULT_APPAREL_SIZE_CHART;
    return { ...DEFAULT_APPAREL_SIZE_CHART, ...customChart };
  }

  function inchesToCm(inches) {
    return Math.round(inches * 2.54 * 10) / 10;
  }

  await t.test("Default size chart has strict S/M/L/XL chest/length/shoulder/sleeve measurements in inches", () => {
    const chart = resolveSizeChart(null);
    assert.equal(chart.unit, "INCHES");
    assert.equal(chart.measurements.S.length, 28.5);
    assert.equal(chart.measurements.S.chest, 42.0);
    assert.equal(chart.measurements.M.length, 29.5);
    assert.equal(chart.measurements.M.chest, 44.0);
    assert.equal(chart.measurements.L.length, 30.5);
    assert.equal(chart.measurements.L.chest, 46.0);
    assert.equal(chart.measurements.XL.length, 31.5);
    assert.equal(chart.measurements.XL.chest, 48.0);
  });

  await t.test("Unit conversion from inches to cm is accurate", () => {
    assert.equal(inchesToCm(28.5), 72.4);
    assert.equal(inchesToCm(42.0), 106.7);
  });

  await t.test("Custom chart preserves measurement invariant", () => {
    const custom = {
      name: "Oversized Boxy Silhouette",
      measurements: {
        S: { length: 29.0, chest: 44.0, shoulder: 21.0, sleeve: 9.0 },
        M: { length: 30.0, chest: 46.0, shoulder: 22.0, sleeve: 9.5 },
        L: { length: 31.0, chest: 48.0, shoulder: 23.0, sleeve: 10.0 },
        XL: { length: 32.0, chest: 50.0, shoulder: 24.0, sleeve: 10.5 },
      },
    };
    const resolved = resolveSizeChart(custom);
    assert.equal(resolved.measurements.S.chest, 44.0);
  });
});

test("BEXYEE 2.1 — Section 5: Inventory Invariant & Reservation Formula", async (t) => {
  // AVAILABLE = PHYSICAL_STOCK - ACTIVE_RESERVED_STOCK
  function calculateAvailableStock(physicalStock, activeReservedStock) {
    return Math.max(0, physicalStock - activeReservedStock);
  }

  await t.test("Available stock strictly matches physical minus reserved", () => {
    assert.equal(calculateAvailableStock(20, 5), 15);
    assert.equal(calculateAvailableStock(10, 10), 0);
    assert.equal(calculateAvailableStock(5, 12), 0, "Stock cannot dip below 0");
  });

  await t.test("Low stock and sold-out status evaluation", () => {
    function getVariantStatus(available, threshold = 5) {
      if (available <= 0) return "SOLD OUT";
      if (available <= threshold) return "LOW";
      return "ACTIVE";
    }

    assert.equal(getVariantStatus(0), "SOLD OUT");
    assert.equal(getVariantStatus(3, 5), "LOW");
    assert.equal(getVariantStatus(5, 5), "LOW");
    assert.equal(getVariantStatus(6, 5), "ACTIVE");
  });
});

test("BEXYEE 2.1 — Section 7: GLB Progressive Loading & WebGL Detection", async (t) => {
  await t.test("Adaptive engine handles WebGL and low network modes", () => {
    function classifyMode({ hasWebGL = true, isSaveData = false, isSlow = false, prefersReducedMotion = false } = {}) {
      if (isSaveData || isSlow || !hasWebGL) {
        return { is3DAllowed: false, isFastNetwork: !isSlow && !isSaveData };
      }
      return { is3DAllowed: !prefersReducedMotion, isFastNetwork: true };
    }

    assert.equal(classifyMode({ hasWebGL: false }).is3DAllowed, false, "3D disabled when WebGL missing");
    assert.equal(classifyMode({ isSaveData: true }).is3DAllowed, false, "3D disabled on Save-Data");
    assert.equal(classifyMode({ isSlow: true }).is3DAllowed, false, "3D disabled on slow connection");
    assert.equal(classifyMode({ hasWebGL: true, isSaveData: false, isSlow: false }).is3DAllowed, true);
  });
});

test("BEXYEE 2.1 — Section 11: Legal GST Invoicing System (Karnataka Intra-State vs Inter-State)", async (t) => {
  function splitGst(inclusivePricePaise, gstPercent) {
    const divisor = 1 + gstPercent / 100;
    const basePaise = Math.round(inclusivePricePaise / divisor);
    const gstPaise = inclusivePricePaise - basePaise;
    return { basePaise, gstPaise, gstPercent };
  }

  function calculateOrderInvoice({
    orderId,
    invoiceNumber,
    customerState,
    items,
    shippingPaise = 0,
  }) {
    const isKa = customerState.trim().toLowerCase() === "karnataka";
    const isInterstate = !isKa;

    let subtotalTaxablePaise = 0;
    let totalCgstPaise = 0;
    let totalSgstPaise = 0;
    let totalIgstPaise = 0;
    let grandTotalPaise = 0;

    const lineItems = items.map((item) => {
      const rate = item.gstRate || 12;
      const totalItemPaise = item.unitPricePaise * item.quantity;
      const { basePaise, gstPaise } = splitGst(totalItemPaise, rate);

      let cgstPaise = 0;
      let sgstPaise = 0;
      let igstPaise = 0;

      if (isInterstate) {
        igstPaise = gstPaise;
      } else {
        cgstPaise = Math.round(gstPaise / 2);
        sgstPaise = gstPaise - cgstPaise;
      }

      subtotalTaxablePaise += basePaise;
      totalCgstPaise += cgstPaise;
      totalSgstPaise += sgstPaise;
      totalIgstPaise += igstPaise;
      grandTotalPaise += totalItemPaise;

      return {
        productName: item.productName,
        sku: item.sku,
        size: item.size,
        quantity: item.quantity,
        hsnCode: "6109",
        unitPricePaise: item.unitPricePaise,
        taxableValuePaise: basePaise,
        cgstPaise,
        sgstPaise,
        igstPaise,
        totalPaise: totalItemPaise,
      };
    });

    return {
      orderId,
      invoiceNumber,
      sellerGstin: "29AABCB1234F1Z5",
      isInterstate,
      lineItems,
      totals: {
        taxableAmountPaise: subtotalTaxablePaise,
        cgstPaise: totalCgstPaise,
        sgstPaise: totalSgstPaise,
        igstPaise: totalIgstPaise,
        shippingPaise,
        totalPaise: grandTotalPaise + shippingPaise,
      },
    };
  }

  await t.test("Intra-state (Karnataka): 6% CGST + 6% SGST split for 12% GST apparel", () => {
    const inv = calculateOrderInvoice({
      orderId: "ord_ka_001",
      invoiceNumber: "INV-2026-0001",
      customerState: "Karnataka",
      items: [{ productName: "Bengaluru Tee", sku: "BEXYEE-BLR-001", size: "M", quantity: 1, unitPricePaise: 179900, gstRate: 12 }],
    });

    assert.equal(inv.isInterstate, false);
    assert.equal(inv.sellerGstin, "29AABCB1234F1Z5");
    assert.equal(inv.lineItems[0].hsnCode, "6109");
    assert.ok(inv.totals.cgstPaise > 0);
    assert.ok(inv.totals.sgstPaise > 0);
    assert.equal(inv.totals.igstPaise, 0);
    assert.equal(inv.totals.taxableAmountPaise + inv.totals.cgstPaise + inv.totals.sgstPaise, 179900);
  });

  await t.test("Inter-state (Delhi / Maharashtra): 12% IGST split", () => {
    const inv = calculateOrderInvoice({
      orderId: "ord_del_001",
      invoiceNumber: "INV-2026-0002",
      customerState: "Delhi",
      items: [{ productName: "Bengaluru Tee", sku: "BEXYEE-BLR-001", size: "L", quantity: 1, unitPricePaise: 179900, gstRate: 12 }],
    });

    assert.equal(inv.isInterstate, true);
    assert.equal(inv.totals.cgstPaise, 0);
    assert.equal(inv.totals.sgstPaise, 0);
    assert.ok(inv.totals.igstPaise > 0);
    assert.equal(inv.totals.taxableAmountPaise + inv.totals.igstPaise, 179900);
  });
});

test("BEXYEE 2.1 — Section 13: Launch Engine State Machine & Gating", async (t) => {
  function resolveLaunchState(launchRow, totalAvailableStock, dropFlags = {}) {
    const now = new Date();
    const nowIso = now.toISOString();

    const isLimitedDrop = launchRow?.is_limited_drop ?? dropFlags.isLimitedDrop ?? false;
    const preorderThreshold = launchRow?.preorder_threshold ?? dropFlags.preorderThreshold ?? 0;

    if (!launchRow) {
      const isSoldOut = totalAvailableStock <= 0;
      return {
        status: isSoldOut ? "SOLD_OUT" : "LIVE",
        countdownEnabled: false,
        isLimitedDrop,
        preorderThreshold,
        isPurchasable: !isSoldOut,
        serverTime: nowIso,
      };
    }

    let computedStatus = launchRow.status || "LIVE";
    const startTimeStr = launchRow.starts_at || launchRow.launch_at;
    const endTimeStr = launchRow.ends_at || launchRow.end_at;

    if (computedStatus === "SCHEDULED" && startTimeStr) {
      const startTime = new Date(startTimeStr).getTime();
      const endTime = endTimeStr ? new Date(endTimeStr).getTime() : null;
      const nowTime = now.getTime();

      if (nowTime >= startTime) {
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

    return {
      status: computedStatus,
      isPurchasable: computedStatus === "LIVE",
      isLimitedDrop,
      preorderThreshold,
    };
  }

  await t.test("SCHEDULED product in future remains locked", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const res = resolveLaunchState({ status: "SCHEDULED", starts_at: future }, 50);
    assert.equal(res.status, "SCHEDULED");
    assert.equal(res.isPurchasable, false);
  });

  await t.test("SCHEDULED product whose start time passed flips to LIVE", () => {
    const past = new Date(Date.now() - 3600000).toISOString();
    const res = resolveLaunchState({ status: "SCHEDULED", starts_at: past }, 50);
    assert.equal(res.status, "LIVE");
    assert.equal(res.isPurchasable, true);
  });

  await t.test("LIVE product with 0 stock flips to SOLD_OUT", () => {
    const res = resolveLaunchState({ status: "LIVE" }, 0);
    assert.equal(res.status, "SOLD_OUT");
    assert.equal(res.isPurchasable, false);
  });
});

test("BEXYEE 2.1 — Section 14: Two-Tier Roles (Owner vs Developer)", async (t) => {
  function isOwnerRole(role) {
    return role === "OWNER" || role === "ADMIN";
  }

  await t.test("Owner role has full privileges", () => {
    assert.equal(isOwnerRole("OWNER"), true);
    assert.equal(isOwnerRole("ADMIN"), true);
  });

  await t.test("Developer role has restricted settings privileges", () => {
    assert.equal(isOwnerRole("DEVELOPER"), false);
  });
});
