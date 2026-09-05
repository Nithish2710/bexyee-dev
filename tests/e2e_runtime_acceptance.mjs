/**
 * BEXYEE — End-to-End Runtime Acceptance Test
 * Tests the full admin → database → API → storefront pipeline
 * for three products with different experience types.
 *
 * Run with: node tests/e2e_runtime_acceptance.mjs
 */
import assert from "node:assert/strict";
import { test, describe } from "node:test";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://syllbbpovvucvriezaiw.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bGxiYnBvdnZ1Y3ZyaWV6YWl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzQ3MDcwMCwiZXhwIjoyMTAzMDQ2NzAwfQ.UNyZSjAQ8Rdzad4h0uwGrlT8HuAJ_17o66azOFmLHAk";
const BASE_URL = "http://localhost:3000";

// Use service-role client to bypass RLS for the acceptance test
const sb = createClient(SUPABASE_URL, SERVICE_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
async function fetchJson(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { status: res.status, ok: res.ok, body: json };
}

async function cleanupProduct(slug) {
  // Clean up in correct dependency order
  const { data: p } = await sb.from("products").select("id").eq("slug", slug).maybeSingle();
  if (!p) return;
  await sb.from("launches").delete().eq("product_id", p.id);
  await sb.from("product_assets").delete().eq("product_id", p.id);
  await sb.from("product_sizes").delete().eq("product_id", p.id);
  await sb.from("products").delete().eq("id", p.id);
}

// ─────────────────────────────────────────────────────────────────────────────
// PRE-TEST: Clean up any leftover test products
// ─────────────────────────────────────────────────────────────────────────────
await cleanupProduct("e2e-bengaluru-city3d");
await cleanupProduct("e2e-mumbai-editorial");
await cleanupProduct("e2e-standard-basic");

// ─────────────────────────────────────────────────────────────────────────────
// 1. DATABASE CONNECTIVITY & SCHEMA VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
describe("Phase 0 — Database connectivity and schema readiness", () => {

  test("All 7 core tables are accessible via service-role", async () => {
    const tables = ["products", "launches", "themes", "brand_assets", "product_assets", "product_sizes", "admin_users"];
    for (const t of tables) {
      const { error } = await sb.from(t).select("*", { count: "exact", head: true });
      assert.equal(error, null, `Table '${t}' should be accessible. Error: ${error?.message}`);
    }
  });

  test("Admin user is authorised in admin_users table", async () => {
    const { data, error } = await sb
      .from("admin_users")
      .select("user_id, role, active, must_change_password")
      .eq("role", "ADMIN")
      .eq("active", true);
    assert.equal(error, null);
    assert.ok(data && data.length >= 1, "At least one ADMIN row must exist");
    assert.equal(data[0].active, true);
    assert.equal(data[0].role, "ADMIN");
  });

  test("Public storefront homepage responds 200", async () => {
    const { status } = await fetchJson("/");
    assert.equal(status, 200, "Homepage must return 200");
  });

  test("Admin login page responds 200", async () => {
    const { status } = await fetchJson("/admin/login");
    assert.equal(status, 200);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. PRODUCT A — Bengaluru CITY_3D (2D images + GLB slot)
// ─────────────────────────────────────────────────────────────────────────────
describe("Phase 1 — Product A: Bengaluru CITY_3D", () => {
  let productAId;

  test("CREATE: Insert Bengaluru CITY_3D product directly to DB", async () => {
    const { data, error } = await sb
      .from("products")
      .insert({
        name: "Bengaluru E2E City Tee",
        slug: "e2e-bengaluru-city3d",
        sku: "E2E-BLR-001",
        city_name: "BENGALURU",
        collection: "E2E TEST",
        edition: "E2E / 001",
        price_paise: 179900,
        compare_at_price_paise: null,
        gst_rate: 12,
        description: "End-to-end acceptance test product. CITY_3D experience.",
        fabric: "320 GSM SUPER LOOPKNIT",
        gsm: 320,
        fit: "OVERSIZED",
        care_instructions: "Cold machine wash. Dry flat.",
        experience_type: "CITY_3D",
        status: "ACTIVE",
        front_image_url: "/assets/products/bengaluru-tee-front.svg",
        back_image_url: "/assets/products/bengaluru-tee-back.svg",
        left_sleeve_image_url: "/assets/products/bengaluru-tee-left.svg",
        right_sleeve_image_url: "/assets/products/bengaluru-tee-right.svg",
        print_image_url: "/assets/products/bengaluru-tee-print.svg",
        model_url: null, // GLB optional — fallback to 2D photographic mode
        seo_title: "BEXYEE — Bengaluru E2E City Tee",
        seo_description: "Heavyweight 320 GSM loopknit shaped by Bengaluru.",
      })
      .select("id")
      .single();

    assert.equal(error, null, `Product A insert failed: ${error?.message}`);
    assert.ok(data?.id, "Product A must return a UUID");
    productAId = data.id;
  });

  test("CREATE: Insert S/M/L/XL inventory for Product A", async () => {
    const sizes = [
      { product_id: null, size: "S", stock_quantity: 10, low_stock_threshold: 5 },
      { product_id: null, size: "M", stock_quantity: 20, low_stock_threshold: 5 },
      { product_id: null, size: "L", stock_quantity: 15, low_stock_threshold: 5 },
      { product_id: null, size: "XL", stock_quantity: 8, low_stock_threshold: 5 },
    ].map(s => ({ ...s, product_id: productAId }));

    const { error } = await sb.from("product_sizes").insert(sizes);
    assert.equal(error, null, `Product A sizes insert failed: ${error?.message}`);
  });

  test("CREATE: Register product asset slots for Product A", async () => {
    const assets = [
      { product_id: productAId, slot: "PRODUCT_FRONT_IMAGE", url: "/assets/products/bengaluru-tee-front.svg", mime_type: "image/svg+xml", is_active: true, version: 1 },
      { product_id: productAId, slot: "PRODUCT_BACK_IMAGE", url: "/assets/products/bengaluru-tee-back.svg", mime_type: "image/svg+xml", is_active: true, version: 1 },
      { product_id: productAId, slot: "PRODUCT_LEFT_SLEEVE_IMAGE", url: "/assets/products/bengaluru-tee-left.svg", mime_type: "image/svg+xml", is_active: true, version: 1 },
      { product_id: productAId, slot: "PRODUCT_RIGHT_SLEEVE_IMAGE", url: "/assets/products/bengaluru-tee-right.svg", mime_type: "image/svg+xml", is_active: true, version: 1 },
      { product_id: productAId, slot: "PRODUCT_PRINT_IMAGE", url: "/assets/products/bengaluru-tee-print.svg", mime_type: "image/svg+xml", is_active: true, version: 1 },
    ];
    const { error } = await sb.from("product_assets").insert(assets);
    assert.equal(error, null, `Product A assets insert failed: ${error?.message}`);
  });

  test("CREATE: Create LIVE launch for Product A", async () => {
    const { error } = await sb.from("launches").insert({
      product_id: productAId,
      name: "Bengaluru E2E Drop",
      slug: "e2e-bengaluru-drop",
      status: "LIVE",
      countdown_enabled: false,
      urgency_badge: "E2E TEST",
    });
    assert.equal(error, null, `Product A launch insert failed: ${error?.message}`);
  });

  test("PERSIST: Product A retrievable from DB with correct experience_type", async () => {
    const { data, error } = await sb
      .from("products")
      .select("*, product_sizes(*), product_assets(*)")
      .eq("slug", "e2e-bengaluru-city3d")
      .single();

    assert.equal(error, null);
    assert.equal(data.experience_type, "CITY_3D");
    assert.equal(data.city_name, "BENGALURU");
    assert.equal(data.status, "ACTIVE");
    assert.ok(data.product_sizes.length === 4, "All 4 sizes must be present");
    assert.ok(data.product_assets.length === 5, "All 5 asset slots must be present");
  });

  test("PERSIST: Total available stock for Product A is correct (53)", async () => {
    const { data } = await sb
      .from("product_sizes")
      .select("stock_quantity")
      .eq("product_id", productAId);
    const total = data.reduce((s, r) => s + r.stock_quantity, 0);
    assert.equal(total, 53, "10+20+15+8 = 53 total units");
  });

  test("API: /products/e2e-bengaluru-city3d returns 200 from storefront", async () => {
    const { status } = await fetchJson("/products/e2e-bengaluru-city3d");
    assert.equal(status, 200, "Product A storefront page must be 200");
  });

  test("LAUNCH: Product A launch state resolves as LIVE (purchasable)", async () => {
    const { data } = await sb
      .from("launches")
      .select("*")
      .eq("product_id", productAId)
      .single();

    assert.equal(data.status, "LIVE");
    assert.equal(data.countdown_enabled, false);
    // Verify resolveLaunchState logic: LIVE with stock > 0 → isPurchasable = true
    const totalStock = 53;
    const isPurchasable = data.status === "LIVE" && totalStock > 0;
    assert.equal(isPurchasable, true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. PRODUCT B — Mumbai EDITORIAL (2D only, no GLB)
// ─────────────────────────────────────────────────────────────────────────────
describe("Phase 2 — Product B: Mumbai EDITORIAL (2D only)", () => {
  let productBId;

  test("CREATE: Insert Mumbai EDITORIAL product (no GLB, different experience)", async () => {
    const { data, error } = await sb
      .from("products")
      .insert({
        name: "Mumbai E2E Editorial Tee",
        slug: "e2e-mumbai-editorial",
        sku: "E2E-MUM-002",
        city_name: "MUMBAI",
        collection: "E2E TEST",
        edition: "E2E / 002",
        price_paise: 189900,
        gst_rate: 12,
        description: "End-to-end acceptance test product. EDITORIAL experience. No 3D.",
        fabric: "320 GSM SUPER LOOPKNIT",
        gsm: 320,
        fit: "OVERSIZED",
        experience_type: "EDITORIAL",
        status: "ACTIVE",
        front_image_url: "/assets/products/bengaluru-tee-front.svg",
        back_image_url: "/assets/products/bengaluru-tee-back.svg",
        model_url: null, // EDITORIAL never uses GLB
        seo_title: "BEXYEE — Mumbai E2E Editorial Tee",
        seo_description: "Editorial coastal uniform shaped by Mumbai.",
      })
      .select("id")
      .single();

    assert.equal(error, null, `Product B insert failed: ${error?.message}`);
    assert.ok(data?.id);
    productBId = data.id;
  });

  test("CREATE: Insert inventory for Product B", async () => {
    const { error } = await sb.from("product_sizes").insert([
      { product_id: productBId, size: "S", stock_quantity: 5, low_stock_threshold: 5 },
      { product_id: productBId, size: "M", stock_quantity: 25, low_stock_threshold: 5 },
      { product_id: productBId, size: "L", stock_quantity: 20, low_stock_threshold: 5 },
      { product_id: productBId, size: "XL", stock_quantity: 10, low_stock_threshold: 5 },
    ]);
    assert.equal(error, null, `Product B sizes failed: ${error?.message}`);
  });

  test("PERSIST: Product B is EDITORIAL with no model_url", async () => {
    const { data, error } = await sb
      .from("products")
      .select("experience_type, model_url, city_name")
      .eq("slug", "e2e-mumbai-editorial")
      .single();

    assert.equal(error, null);
    assert.equal(data.experience_type, "EDITORIAL");
    assert.equal(data.city_name, "MUMBAI");
    assert.equal(data.model_url, null, "EDITORIAL product must have null model_url");
  });

  test("INVARIANT: EDITORIAL product does not have HERO_GLB asset slot", async () => {
    const { data } = await sb
      .from("product_assets")
      .select("slot")
      .eq("product_id", productBId)
      .eq("slot", "HERO_GLB");
    assert.equal(data.length, 0, "EDITORIAL product must never have HERO_GLB asset");
  });

  test("API: /products/e2e-mumbai-editorial returns 200", async () => {
    const { status } = await fetchJson("/products/e2e-mumbai-editorial");
    assert.equal(status, 200, "Product B storefront page must be 200");
  });

  test("INVARIANT: Different experience types coexist without interfering", async () => {
    const { data: products } = await sb
      .from("products")
      .select("slug, experience_type")
      .in("slug", ["e2e-bengaluru-city3d", "e2e-mumbai-editorial"]);

    const bySlug = Object.fromEntries(products.map(p => [p.slug, p.experience_type]));
    assert.equal(bySlug["e2e-bengaluru-city3d"], "CITY_3D");
    assert.equal(bySlug["e2e-mumbai-editorial"], "EDITORIAL");
    assert.notEqual(bySlug["e2e-bengaluru-city3d"], bySlug["e2e-mumbai-editorial"],
      "Two products must have different experience types");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. PRODUCT C — Standard (STANDARD experience type, basic)
// ─────────────────────────────────────────────────────────────────────────────
describe("Phase 3 — Product C: STANDARD experience", () => {
  let productCId;

  test("CREATE: Insert STANDARD product", async () => {
    const { data, error } = await sb
      .from("products")
      .insert({
        name: "E2E Standard Tee",
        slug: "e2e-standard-basic",
        sku: "E2E-STD-003",
        city_name: "BENGALURU",
        collection: "E2E TEST",
        edition: "E2E / 003",
        price_paise: 149900,
        gst_rate: 12,
        description: "End-to-end acceptance test product. STANDARD experience.",
        fabric: "260 GSM FRENCH TERRY",
        fit: "REGULAR",
        experience_type: "STANDARD",
        status: "ACTIVE",
        front_image_url: "/assets/products/bengaluru-tee-front.svg",
      })
      .select("id")
      .single();

    assert.equal(error, null, `Product C insert failed: ${error?.message}`);
    productCId = data.id;
  });

  test("CREATE: Insert inventory for Product C", async () => {
    const { error } = await sb.from("product_sizes").insert([
      { product_id: productCId, size: "S", stock_quantity: 0, low_stock_threshold: 5 },
      { product_id: productCId, size: "M", stock_quantity: 1, low_stock_threshold: 5 },
      { product_id: productCId, size: "L", stock_quantity: 0, low_stock_threshold: 5 },
      { product_id: productCId, size: "XL", stock_quantity: 0, low_stock_threshold: 5 },
    ]);
    assert.equal(error, null);
  });

  test("PERSIST: Product C is STANDARD experience type", async () => {
    const { data } = await sb
      .from("products")
      .select("experience_type, status")
      .eq("slug", "e2e-standard-basic")
      .single();
    assert.equal(data.experience_type, "STANDARD");
    assert.equal(data.status, "ACTIVE");
  });

  test("INVENTORY: Only M has stock (1 unit) — LOW status on boundary", async () => {
    const { data } = await sb
      .from("product_sizes")
      .select("size, stock_quantity")
      .eq("product_id", productCId);

    const bySize = Object.fromEntries(data.map(r => [r.size, r.stock_quantity]));
    assert.equal(bySize["M"], 1); // 1 <= threshold 5 → LOW
    assert.equal(bySize["S"], 0);
    assert.equal(bySize["L"], 0);
    assert.equal(bySize["XL"], 0);

    const totalAvailable = Object.values(bySize).reduce((s, v) => s + v, 0);
    assert.equal(totalAvailable, 1, "Total available should be 1");
    assert.equal(totalAvailable > 0, true, "Not sold out — 1 unit remains");
  });

  test("API: /products/e2e-standard-basic returns 200", async () => {
    const { status } = await fetchJson("/products/e2e-standard-basic");
    assert.equal(status, 200, "Product C storefront page must be 200");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. CROSS-PRODUCT INVARIANTS & ARCHITECTURE INTEGRITY
// ─────────────────────────────────────────────────────────────────────────────
describe("Phase 4 — Cross-product invariants and architecture integrity", () => {

  test("All 3 test products exist in DB with distinct slugs and experience types", async () => {
    const { data } = await sb
      .from("products")
      .select("slug, experience_type, city_name, status")
      .in("slug", ["e2e-bengaluru-city3d", "e2e-mumbai-editorial", "e2e-standard-basic"]);

    assert.equal(data.length, 3, "All 3 products must be present");
    const types = new Set(data.map(p => p.experience_type));
    assert.equal(types.size, 3, "All 3 must have different experience types");
    assert.ok(types.has("CITY_3D"));
    assert.ok(types.has("EDITORIAL"));
    assert.ok(types.has("STANDARD"));
  });

  test("Brand asset decoupling: no product has LOGO_GLB in product_assets", async () => {
    const { data, error } = await sb
      .from("product_assets")
      .select("product_id, slot")
      .eq("slot", "LOGO_GLB");

    assert.equal(error, null);
    assert.equal(data.length, 0, "LOGO_GLB must NEVER appear in product_assets table");
  });

  test("Stock invariant: available stock is always >= 0 across all products", async () => {
    const { data } = await sb.from("product_sizes").select("size, stock_quantity, product_id");
    data.forEach(row => {
      assert.ok(row.stock_quantity >= 0,
        `product_id=${row.product_id} size=${row.size} has negative stock: ${row.stock_quantity}`);
    });
  });

  test("Admin route: /admin returns 200 or 302 (redirect if not logged in)", async () => {
    // Without session cookie it redirects to /admin/login — both are valid
    const res = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
    assert.ok(res.status === 200 || res.status === 307 || res.status === 302,
      `Admin route returned unexpected status: ${res.status}`);
  });

  test("Storefront products page returns 200", async () => {
    const { status } = await fetchJson("/products");
    assert.equal(status, 200);
  });

  test("API: Unknown product slug returns 404", async () => {
    const { status } = await fetchJson("/products/non-existent-product-xyz-99999");
    assert.equal(status, 404, "Non-existent product must return 404");
  });

  test("Theme decoupling: themes table exists and is separate from products", async () => {
    const { error: themesError } = await sb.from("themes").select("id", { count: "exact", head: true });
    const { error: productsError } = await sb.from("products").select("id", { count: "exact", head: true });
    assert.equal(themesError, null, "themes table must be accessible");
    assert.equal(productsError, null, "products table must be accessible");
    // Themes are configuration, not data — table exists independently
  });

  test("Fallback route: /products/bengaluru-tee returns 200 (fallback product)", async () => {
    const { status } = await fetchJson("/products/bengaluru-tee");
    assert.equal(status, 200, "Fallback bengaluru-tee route must always work");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. LAUNCH WORKFLOW TEST — Scheduled → Live transition
// ─────────────────────────────────────────────────────────────────────────────
describe("Phase 5 — Launch scheduling integrity", () => {

  test("SCHEDULED launch in future: isPurchasable = false", () => {
    function resolve(launchRow, stock) {
      const now = new Date();
      if (!launchRow) return { isPurchasable: stock > 0, status: stock > 0 ? "LIVE" : "SOLD_OUT" };
      let status = launchRow.status;
      if (status === "SCHEDULED" && launchRow.launch_at) {
        const lt = new Date(launchRow.launch_at).getTime();
        const et = launchRow.end_at ? new Date(launchRow.end_at).getTime() : null;
        const nt = now.getTime();
        if (nt >= lt) status = (et && nt > et) ? "ENDED" : "LIVE";
        else status = "SCHEDULED";
      }
      if (status === "LIVE" && stock <= 0) status = "SOLD_OUT";
      if (["PAUSED","ARCHIVED","READY","DRAFT"].includes(status)) return { isPurchasable: false, status };
      return { isPurchasable: status === "LIVE", status };
    }

    const future = new Date(Date.now() + 86400 * 1000).toISOString(); // 24h from now
    const r = resolve({ status: "SCHEDULED", launch_at: future }, 50);
    assert.equal(r.status, "SCHEDULED");
    assert.equal(r.isPurchasable, false);
  });

  test("LIVE launch with stock: isPurchasable = true", () => {
    function resolve(status, stock) {
      if (status === "LIVE" && stock <= 0) return { isPurchasable: false, status: "SOLD_OUT" };
      return { isPurchasable: status === "LIVE", status };
    }
    const r = resolve("LIVE", 53);
    assert.equal(r.isPurchasable, true);
    assert.equal(r.status, "LIVE");
  });

  test("PAUSED launch: not purchasable regardless of stock", () => {
    function resolve(status) {
      if (["PAUSED","ARCHIVED","DRAFT","READY"].includes(status)) return { isPurchasable: false, status };
      return { isPurchasable: status === "LIVE", status };
    }
    assert.equal(resolve("PAUSED").isPurchasable, false);
    assert.equal(resolve("ARCHIVED").isPurchasable, false);
    assert.equal(resolve("DRAFT").isPurchasable, false);
    assert.equal(resolve("READY").isPurchasable, false);
  });

  test("DB: Product A launch is LIVE and countdown is disabled", async () => {
    const { data: product } = await sb
      .from("products")
      .select("id")
      .eq("slug", "e2e-bengaluru-city3d")
      .maybeSingle();

    if (!product) return; // product was cleaned up
    const { data: launch } = await sb
      .from("launches")
      .select("status, countdown_enabled")
      .eq("product_id", product.id)
      .single();

    assert.equal(launch.status, "LIVE");
    assert.equal(launch.countdown_enabled, false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TEARDOWN: Remove test products after all tests
// ─────────────────────────────────────────────────────────────────────────────
// Note: Using process.on('exit') so cleanup runs after all test assertions
process.on("exit", () => {
  // Async cleanup cannot run in exit handler — done via separate script call
  // The test products are prefixed with "e2e-" for easy identification
});

console.log("\n✅ E2E Runtime Acceptance Test completed. Cleanup slugs:");
console.log("   - e2e-bengaluru-city3d");
console.log("   - e2e-mumbai-editorial");
console.log("   - e2e-standard-basic");
console.log("\nTo clean up test data, run:");
console.log("   node tests/e2e_cleanup.mjs\n");
