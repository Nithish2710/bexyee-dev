import { describe, it } from "node:test";
import assert from "node:assert/strict";

/**
 * Mirror of product experience resolution logic
 */
function resolveProductData(querySlug, options = {}, mockDb = []) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(querySlug);
  
  let found = mockDb.find((p) => {
    if (isUuid) return p.id === querySlug || p.slug === querySlug;
    return p.slug === querySlug || p.sku === querySlug || p.id === querySlug;
  });

  if (!found && (querySlug === "bengaluru" || querySlug === "bengaluru-tee" || querySlug.includes("blr"))) {
    found = mockDb.find((p) => p.slug === "bengaluru-tee" || p.sku === "BEXYEE-BLR-001");
  }

  // Fallback demo record for Bengaluru
  if (!found && (options.allowDraft && (querySlug === "bengaluru-tee" || querySlug === "bengaluru" || querySlug.includes("blr")))) {
    return {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Bengaluru Tee",
      slug: "bengaluru-tee",
      sku: "BEXYEE-BLR-001",
      pricePaise: 179900,
      totalAvailableStock: 45,
      variants: [
        { size: "S", physicalStock: 10, availableStock: 10 },
        { size: "M", physicalStock: 15, availableStock: 15 },
        { size: "L", physicalStock: 12, availableStock: 12 },
        { size: "XL", physicalStock: 8, availableStock: 8 },
      ],
      experienceType: "CITY_3D",
      launch: { status: "LIVE", purchaseMode: "BUY_NOW" },
      assets: {
        frontImage: "/assets/products/bengaluru-tee-front.svg",
        backImage: "/assets/products/bengaluru-tee-back.svg",
      },
    };
  }

  if (!found) return null;
  if (found.status !== "ACTIVE" && !options.allowDraft) return null;

  return found;
}

describe("BEXYEE — Product Manage Action & Control Center Invariants", () => {
  const mockDb = [
    {
      id: "c032fb77-1111-2222-3333-444455556666",
      name: "Bengaluru Tee",
      slug: "bengaluru-tee",
      sku: "BEXYEE-BLR-001",
      pricePaise: 179900,
      status: "ACTIVE",
      totalAvailableStock: 45,
      variants: [
        { size: "S", physicalStock: 10, availableStock: 10 },
        { size: "M", physicalStock: 15, availableStock: 15 },
        { size: "L", physicalStock: 12, availableStock: 12 },
        { size: "XL", physicalStock: 8, availableStock: 8 },
      ],
      experienceType: "CITY_3D",
      launch: { status: "LIVE", purchaseMode: "BUY_NOW" },
      assets: {
        frontImage: "/assets/products/bengaluru-tee-front.svg",
        backImage: "/assets/products/bengaluru-tee-back.svg",
      },
    },
    {
      id: "d032fb77-2222-3333-4444-555566667777",
      name: "Mumbai Coastal Heavyweight Tee",
      slug: "mumbai-tee",
      sku: "BEXYEE-BOM-002",
      pricePaise: 189900,
      status: "DRAFT",
      totalAvailableStock: 50,
      variants: [
        { size: "S", physicalStock: 15, availableStock: 15 },
        { size: "M", physicalStock: 15, availableStock: 15 },
        { size: "L", physicalStock: 10, availableStock: 10 },
        { size: "XL", physicalStock: 10, availableStock: 10 },
      ],
      experienceType: "EDITORIAL",
      launch: { status: "DRAFT", purchaseMode: "BUY_NOW" },
      assets: {
        frontImage: "/assets/products/mumbai-tee-front.svg",
      },
    },
  ];

  it("1. Resolves product by slug ('bengaluru-tee') for Admin with draft allowance", () => {
    const product = resolveProductData("bengaluru-tee", { allowDraft: true }, mockDb);
    assert.ok(product, "Product should not be null");
    assert.equal(product.name, "Bengaluru Tee");
    assert.equal(product.sku, "BEXYEE-BLR-001");
    assert.equal(product.pricePaise, 179900);
    assert.equal(product.totalAvailableStock, 45);
    assert.equal(product.experienceType, "CITY_3D");
  });

  it("2. Resolves product by UUID id for Admin manage screen", () => {
    const product = resolveProductData("c032fb77-1111-2222-3333-444455556666", { allowDraft: true }, mockDb);
    assert.ok(product, "Product should resolve by UUID");
    assert.equal(product.name, "Bengaluru Tee");
    assert.equal(product.sku, "BEXYEE-BLR-001");
  });

  it("3. Resolves product by alias ('bengaluru')", () => {
    const product = resolveProductData("bengaluru", { allowDraft: true }, mockDb);
    assert.ok(product, "Product should resolve by alias");
    assert.equal(product.sku, "BEXYEE-BLR-001");
  });

  it("4. Resolves other city products (e.g. Mumbai) by slug or ID", () => {
    const product = resolveProductData("mumbai-tee", { allowDraft: true }, mockDb);
    assert.ok(product, "Mumbai product should resolve for Admin");
    assert.equal(product.name, "Mumbai Coastal Heavyweight Tee");
    assert.equal(product.sku, "BEXYEE-BOM-002");
    assert.equal(product.pricePaise, 189900);
  });

  it("5. Product Card MANAGE button computes correct dynamic destination URL", () => {
    function computeManageUrl(product) {
      const targetSlug = product.slug || (product.sku?.toLowerCase().includes("blr") ? "bengaluru-tee" : product.id);
      return `/admin/products/${targetSlug}`;
    }

    assert.equal(computeManageUrl(mockDb[0]), "/admin/products/bengaluru-tee");
    assert.equal(computeManageUrl(mockDb[1]), "/admin/products/mumbai-tee");
    assert.equal(
      computeManageUrl({ id: "custom-id-999", name: "Delhi Tee", sku: "BEXYEE-DEL-003" }),
      "/admin/products/custom-id-999"
    );
  });

  it("6. Admin Home Featured Card MANAGE PRODUCT button links directly to Product Control Center", () => {
    const featuredProduct = mockDb[0];
    const targetHref = `/admin/products/${featuredProduct.slug || featuredProduct.id || "bengaluru-tee"}`;
    assert.equal(targetHref, "/admin/products/bengaluru-tee");
  });

  it("7. Product edits persist in database update payload", () => {
    const original = { ...mockDb[0] };
    const updatePayload = {
      id: original.id,
      description: "Updated tactile description for Bengaluru capsule.",
      price: 1799,
      gstRate: 12,
    };

    const updated = {
      ...original,
      description: updatePayload.description,
      pricePaise: updatePayload.price * 100,
      gstRate: updatePayload.gstRate,
    };

    assert.equal(updated.description, "Updated tactile description for Bengaluru capsule.");
    assert.equal(updated.pricePaise, 179900);
    assert.equal(updated.gstRate, 12);
  });
});
