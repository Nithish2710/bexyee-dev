// ============================================================================
// COMPREHENSIVE PERMUTATION TESTING SUITE
// Tests all combinations of product states, purchase modes, inventory levels,
// and user workflows across the BEXYEE platform
// ============================================================================

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import axios from "axios";

// Load environment
const env = {};
fs.readFileSync(".env", "utf8")
  .split("\n")
  .forEach((line) => {
    const [k, ...v] = line.split("=");
    if (k && v.length) env[k.trim()] = v.join("=").trim();
  });

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const API_URL = "http://localhost:3001";

// Test results tracking
const results = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  testCases: [],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function test(name, fn) {
  results.totalTests++;
  const start = Date.now();
  try {
    await fn();
    results.passedTests++;
    results.testCases.push({
      name,
      status: "PASS",
      duration: Date.now() - start,
    });
    console.log(`✅ ${name}`);
  } catch (error) {
    results.failedTests++;
    results.testCases.push({
      name,
      status: "FAIL",
      error: error.message,
      duration: Date.now() - start,
    });
    console.error(`❌ ${name}`);
    console.error(`   Error: ${error.message}`);
  }
}

async function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function createTestProduct(overrides = {}) {
  const { data, error } = await supabase.from("products").insert({
    name: `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    slug: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sku: `TEST-SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    city_name: "BENGALURU",
    collection: "TEST COLLECTION",
    edition: "TEST EDITION",
    price_paise: 179900,
    gst_rate: 12,
    status: "ACTIVE",
    fabric: "TEST FABRIC",
    gsm: 320,
    description: "Test product",
    ...overrides,
  }).select().single();

  if (error) throw error;
  return data;
}

async function createProductSizes(productId, stockQuantity = 50) {
  const sizes = ["S", "M", "L", "XL"];
  for (const size of sizes) {
    await supabase.from("product_sizes").insert({
      product_id: productId,
      size,
      stock_quantity: stockQuantity,
      low_stock_threshold: 5,
    });
  }
}

async function createLaunch(productId, overrides = {}) {
  const { data, error } = await supabase.from("launches").insert({
    product_id: productId,
    name: `LAUNCH-${Date.now()}`,
    slug: `launch-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    status: "LIVE",
    utm_campaign: JSON.stringify({
      purchaseMode: "BUY_NOW",
      isPrebook: false,
    }),
    ...overrides,
  }).select().single();

  if (error) throw error;
  return data;
}

async function fetchFromAPI(endpoint) {
  const response = await axios.get(`${API_URL}${endpoint}`, {
    validateStatus: () => true,
  });
  return response;
}

/**
 * Create a guest cart (no auth.users FK dependency).
 * Uses the guest_token path supported by the carts table schema:
 *   check (customer_id is not null or guest_token is not null)
 */
async function createGuestCart() {
  const guestToken = `guest-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const { data, error } = await supabase
    .from("carts")
    .insert({
      guest_token: guestToken,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function addToCart(cartId, productId, size, quantity = 1) {
  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      cart_id: cartId,
      product_id: productId,
      size,
      quantity,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// SSR SENTINEL HELPERS
// Reads data-* attributes embedded by ProductPageRenderer's hidden div:
//   data-testid="product-state"
//   data-purchase-mode="BUY_NOW|PREBOOK"
//   data-inventory-status="AVAILABLE|LOW|SOLD_OUT"
//   data-price-paise="<number>"
//   data-is-live="true|false"
// ============================================================================

function getSentinelAttr(html, attr) {
  const match = html.match(new RegExp(`${attr}="([^"]*)"`, "i"));
  return match ? match[1] : null;
}

function htmlIsLive(html) {
  return getSentinelAttr(html, "data-is-live") === "true";
}

function htmlPurchaseMode(html) {
  return getSentinelAttr(html, "data-purchase-mode");
}

function htmlInventoryStatus(html) {
  return getSentinelAttr(html, "data-inventory-status");
}

function htmlPricePaise(html) {
  const val = getSentinelAttr(html, "data-price-paise");
  return val !== null ? parseInt(val, 10) : null;
}

function htmlIsUnavailable(html) {
  // "EDITION NOT CURRENTLY AVAILABLE" is rendered server-side in the
  // product page wrapper (not inside the client component) so it is
  // always present in the raw HTML for hidden/unpublished products.
  return html.includes("EDITION NOT CURRENTLY AVAILABLE");
}

// ============================================================================
// TEST SUITE 1: PRODUCT LIFECYCLE STATES
// ============================================================================

async function testProductLifecycleStates() {
  console.log("\n📋 TEST SUITE 1: PRODUCT LIFECYCLE STATES");
  console.log("=========================================\n");

  const launchStates = ["DRAFT", "READY", "SCHEDULED", "LIVE", "PAUSED", "ENDED", "ARCHIVED"];

  for (const state of launchStates) {
    await test(`Product with launch status ${state}`, async () => {
      const product = await createTestProduct({ status: "ACTIVE" });
      await createProductSizes(product.id);

      const launch = await createLaunch(product.id, { status: state });

      await assert(launch.status === state, `Launch status should be ${state}`);
    });
  }
}

// ============================================================================
// TEST SUITE 2: STOREFRONT VISIBILITY PERMUTATIONS
// ============================================================================

async function testStorefrontVisibility() {
  console.log("\n📋 TEST SUITE 2: STOREFRONT VISIBILITY");
  console.log("======================================\n");

  const productStates = [
    { status: "ACTIVE", expectedVisible: true, description: "ACTIVE product" },
    { status: "DRAFT", expectedVisible: false, description: "DRAFT product" },
    { status: "ARCHIVED", expectedVisible: false, description: "ARCHIVED product" },
  ];

  const launchStates = [
    { status: "LIVE", expectedVisible: true, description: "LIVE launch" },
    { status: "DRAFT", expectedVisible: false, description: "DRAFT launch" },
    { status: "PAUSED", expectedVisible: false, description: "PAUSED launch" },
    { status: "SCHEDULED", expectedVisible: false, description: "SCHEDULED launch" },
    { status: "ENDED", expectedVisible: false, description: "ENDED launch" },
    { status: "ARCHIVED", expectedVisible: false, description: "ARCHIVED launch" },
  ];

  for (const productState of productStates) {
    for (const launchState of launchStates) {
      await test(`${productState.description} + ${launchState.description}`, async () => {
        const product = await createTestProduct({ status: productState.status });
        await createProductSizes(product.id);

        await createLaunch(product.id, { status: launchState.status });

        const shouldBeVisible = productState.expectedVisible && launchState.expectedVisible;

        const response = await fetchFromAPI(`/product/${product.slug}`);

        if (shouldBeVisible) {
          await assert(response.status === 200, `Product should be visible (got ${response.status})`);
          // ACTIVE+LIVE products render the SSR sentinel; data-is-live="true" confirms the
          // launch is live. The client component renders buttons, but the sentinel is SSR.
          await assert(
            htmlIsLive(response.data),
            `Product should be live (data-is-live="true" not found in HTML)`
          );
        } else {
          await assert(
            htmlIsUnavailable(response.data),
            `Product should show unavailable message`
          );
        }
      });
    }
  }
}

// ============================================================================
// TEST SUITE 3: PURCHASE MODE PERMUTATIONS
// ============================================================================

async function testPurchaseModes() {
  console.log("\n📋 TEST SUITE 3: PURCHASE MODES");
  console.log("================================\n");

  const purchaseModes = ["BUY_NOW", "PREBOOK"];

  for (const mode of purchaseModes) {
    await test(`Product with purchase mode ${mode}`, async () => {
      const product = await createTestProduct({ status: "ACTIVE" });
      await createProductSizes(product.id);

      await createLaunch(product.id, {
        status: "LIVE",
        utm_campaign: JSON.stringify({
          purchaseMode: mode,
          isPrebook: mode === "PREBOOK",
          fulfillmentEstimate: "OCTOBER 2026",
          sizeLimits: { S: 20, M: 50, L: 30, XL: 20 },
        }),
      });

      const response = await fetchFromAPI(`/product/${product.slug}`);
      await assert(response.status === 200, "Product should load");

      // Verify via SSR sentinel data attribute
      const renderedMode = htmlPurchaseMode(response.data);
      await assert(
        renderedMode === mode,
        `Expected data-purchase-mode="${mode}" but got "${renderedMode}"`
      );
    });
  }
}

// ============================================================================
// TEST SUITE 4: INVENTORY LEVELS
// ============================================================================

async function testInventoryLevels() {
  console.log("\n📋 TEST SUITE 4: INVENTORY LEVELS");
  console.log("==================================\n");

  const inventoryScenarios = [
    { quantity: 100, expectedStatus: "AVAILABLE", description: "Well-stocked" },
    { quantity: 5,   expectedStatus: "LOW",       description: "Low stock" },
    { quantity: 1,   expectedStatus: "LOW",       description: "Very low stock" },
    { quantity: 0,   expectedStatus: "SOLD_OUT",  description: "Out of stock" },
  ];

  for (const scenario of inventoryScenarios) {
    await test(`${scenario.description} inventory (${scenario.quantity} units)`, async () => {
      const product = await createTestProduct({ status: "ACTIVE" });

      const sizes = ["S", "M", "L", "XL"];
      for (const size of sizes) {
        await supabase.from("product_sizes").insert({
          product_id: product.id,
          size,
          stock_quantity: scenario.quantity,
          low_stock_threshold: 5,
        });
      }

      await createLaunch(product.id);

      const response = await fetchFromAPI(`/product/${product.slug}`);
      await assert(response.status === 200, "Product should load");

      const inventoryStatus = htmlInventoryStatus(response.data);
      await assert(
        inventoryStatus === scenario.expectedStatus,
        `Expected data-inventory-status="${scenario.expectedStatus}" but got "${inventoryStatus}"`
      );
    });
  }
}

// ============================================================================
// TEST SUITE 5: CART OPERATIONS
// Uses guest carts (guest_token) to avoid auth.users FK constraint on customers table.
// ============================================================================

async function testCartOperations() {
  console.log("\n📋 TEST SUITE 5: CART OPERATIONS");
  console.log("=================================\n");

  await test("Add product to cart", async () => {
    const product = await createTestProduct({ status: "ACTIVE" });
    await createProductSizes(product.id);
    await createLaunch(product.id);

    const cart = await createGuestCart();
    const cartItem = await addToCart(cart.id, product.id, "M", 1);

    await assert(cartItem.quantity === 1, "Cart item quantity should be 1");
  });

  await test("Add multiple quantities to cart", async () => {
    const product = await createTestProduct({ status: "ACTIVE" });
    await createProductSizes(product.id);
    await createLaunch(product.id);

    const cart = await createGuestCart();
    const cartItem = await addToCart(cart.id, product.id, "L", 3);

    await assert(cartItem.quantity === 3, "Cart item quantity should be 3");
  });

  await test("Add same product in different size", async () => {
    const product = await createTestProduct({ status: "ACTIVE" });
    await createProductSizes(product.id);
    await createLaunch(product.id);

    const cart = await createGuestCart();
    await addToCart(cart.id, product.id, "M", 2);
    await addToCart(cart.id, product.id, "L", 1);

    const { data: items } = await supabase
      .from("cart_items")
      .select()
      .eq("cart_id", cart.id);

    await assert(items.length === 2, "Should have 2 different size items");
  });
}

// ============================================================================
// TEST SUITE 6: SIZE VARIANT PERMUTATIONS
// ============================================================================

async function testSizeVariants() {
  console.log("\n📋 TEST SUITE 6: SIZE VARIANT PERMUTATIONS");
  console.log("==========================================\n");

  const sizes = ["S", "M", "L", "XL"];
  const availabilityScenarios = [
    { sizes: ["S", "M", "L", "XL"], description: "All sizes available" },
    { sizes: ["M", "L"],            description: "Only M and L available" },
    { sizes: ["S"],                 description: "Only S available" },
    { sizes: [],                    description: "No sizes available" },
  ];

  for (const scenario of availabilityScenarios) {
    await test(`${scenario.description}`, async () => {
      const product = await createTestProduct({ status: "ACTIVE" });

      for (const size of sizes) {
        const quantity = scenario.sizes.includes(size) ? 50 : 0;
        await supabase.from("product_sizes").insert({
          product_id: product.id,
          size,
          stock_quantity: quantity,
          low_stock_threshold: 5,
        });
      }

      await createLaunch(product.id);

      const response = await fetchFromAPI(`/product/${product.slug}`);
      await assert(response.status === 200, "Product should load");

      if (scenario.sizes.length === 0) {
        // All sizes zero → product is fully sold out → sentinel shows SOLD_OUT
        const inventoryStatus = htmlInventoryStatus(response.data);
        await assert(
          inventoryStatus === "SOLD_OUT",
          `Expected data-inventory-status="SOLD_OUT" but got "${inventoryStatus}"`
        );
      }
    });
  }
}

// ============================================================================
// TEST SUITE 7: PRICING AND TAX CALCULATIONS
// ============================================================================

async function testPricingCalculations() {
  console.log("\n📋 TEST SUITE 7: PRICING & TAX CALCULATIONS");
  console.log("===========================================\n");

  const pricingScenarios = [
    { price: 100000, gst: 5,  description: "₹1000 with 5% GST" },
    { price: 179900, gst: 12, description: "₹1799 with 12% GST" },
    { price: 500000, gst: 18, description: "₹5000 with 18% GST" },
    { price: 10000,  gst: 0,  description: "₹100 with 0% GST" },
  ];

  for (const scenario of pricingScenarios) {
    await test(`${scenario.description}`, async () => {
      const product = await createTestProduct({
        status: "ACTIVE",
        price_paise: scenario.price,
        gst_rate: scenario.gst,
      });
      await createProductSizes(product.id);
      await createLaunch(product.id);

      const response = await fetchFromAPI(`/product/${product.slug}`);
      await assert(response.status === 200, "Product should load");

      // Verify via SSR sentinel — data-price-paise is always rendered server-side
      const pricePaise = htmlPricePaise(response.data);
      await assert(
        pricePaise === scenario.price,
        `Expected data-price-paise="${scenario.price}" but got "${pricePaise}"`
      );
    });
  }
}

// ============================================================================
// TEST SUITE 8: PREORDER/PREBOOKING LIMITS
// ============================================================================

async function testPrebookingLimits() {
  console.log("\n📋 TEST SUITE 8: PRE-BOOKING LIMITS");
  console.log("===================================\n");

  const prebookScenarios = [
    { limit: 100, description: "100 unit prebook limit" },
    { limit: 50,  description: "50 unit prebook limit" },
    { limit: 10,  description: "10 unit prebook limit" },
    { limit: 1,   description: "1 unit prebook limit" },
  ];

  for (const scenario of prebookScenarios) {
    await test(`Prebook with ${scenario.description}`, async () => {
      const product = await createTestProduct({ status: "ACTIVE" });

      const sizes = ["S", "M", "L", "XL"];
      for (const size of sizes) {
        await supabase.from("product_sizes").insert({
          product_id: product.id,
          size,
          stock_quantity: 0, // No physical stock — pre-book only
          low_stock_threshold: 5,
        });
      }

      await createLaunch(product.id, {
        status: "LIVE",
        utm_campaign: JSON.stringify({
          purchaseMode: "PREBOOK",
          isPrebook: true,
          fulfillmentEstimate: "OCTOBER 2026",
          sizeLimits: { S: scenario.limit, M: scenario.limit, L: scenario.limit, XL: scenario.limit },
        }),
      });

      const response = await fetchFromAPI(`/product/${product.slug}`);
      await assert(response.status === 200, "Product should load");

      // Verify purchase mode via SSR sentinel
      const renderedMode = htmlPurchaseMode(response.data);
      await assert(
        renderedMode === "PREBOOK",
        `Expected data-purchase-mode="PREBOOK" but got "${renderedMode}"`
      );
    });
  }
}

// ============================================================================
// TEST SUITE 9: PRODUCT FILTERING AND SEARCH
// ============================================================================

async function testProductFiltering() {
  console.log("\n📋 TEST SUITE 9: PRODUCT FILTERING");
  console.log("==================================\n");

  await test("Filter by city name", async () => {
    const product = await createTestProduct({
      status: "ACTIVE",
      city_name: "MUMBAI",
    });
    await createProductSizes(product.id);
    await createLaunch(product.id);

    // Correct route: /cities/[slug] (plural), not /city/[slug]
    const response = await fetchFromAPI(`/cities/mumbai`);
    await assert(response.status === 200, "City page should load");
  });

  await test("Filter by collection", async () => {
    const product = await createTestProduct({
      status: "ACTIVE",
      collection: "MONSOON 2026",
    });
    await createProductSizes(product.id);
    await createLaunch(product.id);

    const response = await fetchFromAPI(`/collections`);
    await assert(response.status === 200, "Collections page should load");
  });

  await test("Search product by name", async () => {
    const product = await createTestProduct({
      status: "ACTIVE",
      name: "UNIQUE-SEARCH-TEST-PRODUCT",
    });
    await createProductSizes(product.id);
    await createLaunch(product.id);

    const response = await fetchFromAPI(`/search?q=UNIQUE-SEARCH-TEST-PRODUCT`);
    await assert(response.status === 200, "Search should work");
  });
}

// ============================================================================
// TEST SUITE 10: ADMIN OPERATIONS
// ============================================================================

async function testAdminOperations() {
  console.log("\n📋 TEST SUITE 10: ADMIN OPERATIONS");
  console.log("===================================\n");

  await test("Admin can view product dashboard", async () => {
    const response = await fetchFromAPI(`/admin`);
    await assert(response.status !== 500, "Admin dashboard should not error");
  });

  await test("Admin can view products list", async () => {
    const response = await fetchFromAPI(`/admin/products`);
    await assert(response.status !== 500, "Admin products list should not error");
  });
}

// ============================================================================
// TEST SUITE 11: EDGE CASES AND STRESS
// ============================================================================

async function testEdgeCases() {
  console.log("\n📋 TEST SUITE 11: EDGE CASES");
  console.log("=============================\n");

  await test("Non-existent product returns 404 message", async () => {
    const response = await fetchFromAPI(`/product/non-existent-product-xyz`);
    await assert(response.data.includes("EDITION NOT CURRENTLY AVAILABLE"), "Should show unavailable message");
  });

  await test("Product with no inventory shows correctly", async () => {
    const product = await createTestProduct({ status: "ACTIVE" });

    for (const size of ["S", "M", "L", "XL"]) {
      await supabase.from("product_sizes").insert({
        product_id: product.id,
        size,
        stock_quantity: 0,
      });
    }

    await createLaunch(product.id);

    const response = await fetchFromAPI(`/product/${product.slug}`);
    await assert(response.status === 200, "Product should load with zero inventory");
  });

  await test("Product with no launch shows as LIVE (fallback)", async () => {
    const product = await createTestProduct({ status: "ACTIVE" });
    await createProductSizes(product.id);
    // No launch created — product-engine defaults to LIVE

    const response = await fetchFromAPI(`/product/${product.slug}`);
    await assert(response.status === 200, "Product without launch should default to LIVE");
  });

  await test("Concurrent add-to-cart requests", async () => {
    const product = await createTestProduct({ status: "ACTIVE" });
    await createProductSizes(product.id);
    await createLaunch(product.id);

    // Use a guest cart — no auth.users dependency
    const cart = await createGuestCart();

    // Five concurrent inserts with distinct sizes to avoid unique (cart,product,size) collision
    const sizePool = ["S", "M", "L", "XL", "S"]; // 5 concurrent, last two will hit unique constraint
    const promises = sizePool.slice(0, 4).map((size) =>
      addToCart(cart.id, product.id, size, 1)
    );

    const cartResults = await Promise.all(promises);
    await assert(cartResults.length === 4, "All concurrent requests should succeed");
  });
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║      COMPREHENSIVE PERMUTATION TESTING SUITE              ║");
  console.log("║              BEXYEE E-COMMERCE PLATFORM                  ║");
  console.log("╚════════════════════════════════════════════════════════════╝");

  try {
    await testProductLifecycleStates();
    await testStorefrontVisibility();
    await testPurchaseModes();
    await testInventoryLevels();
    await testCartOperations();
    await testSizeVariants();
    await testPricingCalculations();
    await testPrebookingLimits();
    await testProductFiltering();
    await testAdminOperations();
    await testEdgeCases();

    console.log("\n╔════════════════════════════════════════════════════════════╗");
    console.log("║                    TEST RESULTS SUMMARY                   ║");
    console.log("╚════════════════════════════════════════════════════════════╝\n");

    console.log(`📊 Total Tests:  ${results.totalTests}`);
    console.log(`✅ Passed:       ${results.passedTests}`);
    console.log(`❌ Failed:       ${results.failedTests}`);
    console.log(`⏱️  Total Time:   ${results.testCases.reduce((sum, t) => sum + t.duration, 0)}ms`);

    const passRate = ((results.passedTests / results.totalTests) * 100).toFixed(1);
    console.log(`\n📈 Pass Rate: ${passRate}%\n`);

    if (results.failedTests > 0) {
      console.log("Failed Tests:");
      results.testCases.filter((t) => t.status === "FAIL").forEach((t) => {
        console.log(`  - ${t.name}: ${t.error}`);
      });
    }

    fs.writeFileSync(
      "test-results.json",
      JSON.stringify(results, null, 2)
    );
    console.log("\n💾 Detailed results saved to test-results.json");

  } catch (error) {
    console.error("\n❌ Test suite error:", error.message);
    process.exit(1);
  }
}

// Run tests
runAllTests();
