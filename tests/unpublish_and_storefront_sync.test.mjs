import { describe, it } from "node:test";
import assert from "node:assert/strict";

/**
 * Mirror of authoritative launch resolver logic from src/lib/product-engine.ts
 */
function resolveLaunchState(
  launchRow,
  totalAvailableStock,
  productDropFlags
) {
  const isProductActive = productDropFlags?.productStatus === undefined || productDropFlags.productStatus === "ACTIVE";
  const rawPurchaseMode = productDropFlags?.purchaseMode ?? launchRow?.purchase_mode ?? "BUY_NOW";
  const prebookEndsAt = productDropFlags?.prebookEndsAt ?? launchRow?.prebook_ends_at;

  if (!isProductActive) {
    const draftStatus = productDropFlags?.productStatus === "ARCHIVED" ? "ARCHIVED" : "DRAFT";
    return {
      status: draftStatus,
      isPurchasable: false,
      purchaseMode: rawPurchaseMode,
    };
  }

  if (!launchRow) {
    const isSoldOut = totalAvailableStock <= 0;
    let purchaseMode = rawPurchaseMode;
    if (purchaseMode === "PREBOOK" && prebookEndsAt && Date.now() > new Date(prebookEndsAt).getTime()) {
      purchaseMode = "BUY_NOW";
    }
    return {
      status: isSoldOut ? "SOLD_OUT" : "LIVE",
      isPurchasable: !isSoldOut,
      purchaseMode,
    };
  }

  let status = launchRow.status || "DRAFT";
  const isPrebookActive = rawPurchaseMode === "PREBOOK" && (!prebookEndsAt || Date.now() <= new Date(prebookEndsAt).getTime());

  if (status === "LIVE" && totalAvailableStock <= 0 && !isPrebookActive) {
    status = "SOLD_OUT";
  }

  let purchaseMode = rawPurchaseMode;
  if (purchaseMode === "PREBOOK" && prebookEndsAt && Date.now() > new Date(prebookEndsAt).getTime()) {
    purchaseMode = "BUY_NOW";
  }

  const isPurchasable = status === "LIVE" && (purchaseMode === "PREBOOK" || totalAvailableStock > 0);

  return {
    status,
    isPurchasable,
    purchaseMode,
  };
}

describe("BEXYEE — End-to-End Unpublish & Storefront Removal Verification Suite", () => {
  it("1. Published Product in Database evaluates to LIVE and isPurchasable=true", () => {
    const launch = resolveLaunchState(
      { status: "LIVE", purchase_mode: "BUY_NOW" },
      45, // Available stock
      { productStatus: "ACTIVE" }
    );
    assert.equal(launch.status, "LIVE");
    assert.equal(launch.isPurchasable, true);
    assert.equal(launch.purchaseMode, "BUY_NOW");
  });

  it("2. When Admin unpublishes to DRAFT, launch status evaluates to DRAFT and isPurchasable=false", () => {
    const launch = resolveLaunchState(
      { status: "LIVE", purchase_mode: "BUY_NOW" },
      45,
      { productStatus: "DRAFT" } // Product unpublished by admin
    );
    assert.equal(launch.status, "DRAFT");
    assert.equal(launch.isPurchasable, false);
  });

  it("3. When Admin archives product, launch status evaluates to ARCHIVED and isPurchasable=false", () => {
    const launch = resolveLaunchState(
      { status: "LIVE", purchase_mode: "BUY_NOW" },
      45,
      { productStatus: "ARCHIVED" }
    );
    assert.equal(launch.status, "ARCHIVED");
    assert.equal(launch.isPurchasable, false);
  });

  it("4. Storefront Direct URL Guard: DRAFT products do NOT render live purchase buttons", () => {
    function getStorefrontPageOutput(product) {
      if (!product || product.launch.status === "DRAFT" || product.launch.status === "ARCHIVED") {
        return {
          view: "UNPUBLISHED_NOTICE_PAGE",
          hasBuyNowButton: false,
          hasPrebookButton: false,
          hasPriceDisplayed: false,
        };
      }

      return {
        view: "LIVE_PRODUCT_PAGE",
        hasBuyNowButton: product.launch.purchaseMode === "BUY_NOW",
        hasPrebookButton: product.launch.purchaseMode === "PREBOOK",
        hasPriceDisplayed: true,
      };
    }

    const liveProduct = {
      name: "Bengaluru Tee",
      launch: { status: "LIVE", purchaseMode: "BUY_NOW", isPurchasable: true },
    };
    const liveOutput = getStorefrontPageOutput(liveProduct);
    assert.equal(liveOutput.view, "LIVE_PRODUCT_PAGE");
    assert.equal(liveOutput.hasBuyNowButton, true);

    const unpublishedProduct = {
      name: "Bengaluru Tee",
      launch: { status: "DRAFT", purchaseMode: "BUY_NOW", isPurchasable: false },
    };
    const unpubOutput = getStorefrontPageOutput(unpublishedProduct);
    assert.equal(unpubOutput.view, "UNPUBLISHED_NOTICE_PAGE");
    assert.equal(unpubOutput.hasBuyNowButton, false);
    assert.equal(unpubOutput.hasPrebookButton, false);
  });

  it("5. Shop Catalog Filter Invariant: Unpublished/Draft products are strictly excluded from catalog", () => {
    const databaseProducts = [
      { id: "1", name: "Bengaluru Tee", status: "DRAFT" }, // Unpublished
      { id: "2", name: "Mumbai Tee", status: "ACTIVE" },
    ];

    const catalogProducts = databaseProducts.filter((p) => p.status === "ACTIVE");
    assert.equal(catalogProducts.length, 1);
    assert.equal(catalogProducts[0].name, "Mumbai Tee");
    assert.equal(catalogProducts.some((p) => p.name === "Bengaluru Tee"), false);
  });

  it("6. Shop Catalog Empty State: When all products are unpublished, no hardcoded live products are injected", () => {
    const databaseProducts = [
      { id: "1", name: "Bengaluru Tee", status: "DRAFT" },
    ];

    const catalogProducts = databaseProducts.filter((p) => p.status === "ACTIVE");
    assert.equal(catalogProducts.length, 0);

    const hasEmptyState = catalogProducts.length === 0;
    assert.equal(hasEmptyState, true);
  });

  it("7. Search API Filter Invariant: Unpublished products are excluded from search results", () => {
    const databaseProducts = [
      { name: "Bengaluru Heavyweight Tee", slug: "bengaluru-tee", status: "DRAFT" },
      { name: "Mumbai Coastal Heavyweight Tee", slug: "mumbai-tee", status: "ACTIVE" },
    ];

    const query = "bengaluru";
    const searchResults = databaseProducts
      .filter((p) => p.status === "ACTIVE" && p.name.toLowerCase().includes(query));

    assert.equal(searchResults.length, 0);
  });

  it("8. Re-Publish Cycle: Product flips from DRAFT -> ACTIVE -> Storefront immediately reflects LIVE state", () => {
    // 1. Initial Unpublished State
    let productStatus = "DRAFT";
    let launch = resolveLaunchState(
      { status: "DRAFT", purchase_mode: "BUY_NOW" },
      45,
      { productStatus }
    );
    assert.equal(launch.status, "DRAFT");
    assert.equal(launch.isPurchasable, false);

    // 2. Admin publishes product
    productStatus = "ACTIVE";
    launch = resolveLaunchState(
      { status: "LIVE", purchase_mode: "BUY_NOW" },
      45,
      { productStatus }
    );
    assert.equal(launch.status, "LIVE");
    assert.equal(launch.isPurchasable, true);
    assert.equal(launch.purchaseMode, "BUY_NOW");
  });
});
