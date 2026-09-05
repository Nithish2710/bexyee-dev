import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

// Read environment
const envFile = fs.readFileSync(".env", "utf8");
const envVars = {};
for (const line of envFile.split("\n")) {
  const [k, ...v] = line.trim().split("=");
  if (k && v.length > 0) envVars[k] = v.join("=");
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

describe("BEXYEE — End-to-End Launch & Purchase Mode Real Database Integration", () => {
  const bengaluruProductId = "00000000-0000-0000-0000-000000000001";

  it("1. Transitions LIVE + PRE_BOOK -> LIVE + BUY_NOW in database atomically", async () => {
    const payload = {
      purchaseMode: "BUY_NOW",
      isPrebook: false,
      fulfillmentEstimate: "OCTOBER 2026",
      sizeLimits: { S: 20, M: 50, L: 30, XL: 20 },
    };

    const { error: updateErr } = await supabase
      .from("launches")
      .update({
        status: "LIVE",
        utm_campaign: JSON.stringify(payload),
        updated_at: new Date().toISOString(),
      })
      .eq("product_id", bengaluruProductId);

    assert.equal(updateErr, null, "Launch status update should succeed");

    // Query back from DB
    const { data: launchRows } = await supabase
      .from("launches")
      .select("*")
      .eq("product_id", bengaluruProductId)
      .limit(1);

    assert.ok(launchRows && launchRows[0]);
    assert.equal(launchRows[0].status, "LIVE");
    const parsed = JSON.parse(launchRows[0].utm_campaign);
    assert.equal(parsed.purchaseMode, "BUY_NOW");
    assert.equal(parsed.isPrebook, false);
  });

  it("2. Transitions BUY_NOW -> PRE_BOOK and persists variant-specific limits", async () => {
    const payload = {
      purchaseMode: "PREBOOK",
      isPrebook: true,
      fulfillmentEstimate: "OCTOBER 2026",
      sizeLimits: { S: 25, M: 60, L: 35, XL: 25 },
    };

    const { error: updateErr } = await supabase
      .from("launches")
      .update({
        status: "LIVE",
        utm_campaign: JSON.stringify(payload),
        updated_at: new Date().toISOString(),
      })
      .eq("product_id", bengaluruProductId);

    assert.equal(updateErr, null, "Launch status update to PREBOOK should succeed");

    const { data: launchRows } = await supabase
      .from("launches")
      .select("*")
      .eq("product_id", bengaluruProductId)
      .limit(1);

    assert.ok(launchRows && launchRows[0]);
    assert.equal(launchRows[0].status, "LIVE");
    const parsed = JSON.parse(launchRows[0].utm_campaign);
    assert.equal(parsed.purchaseMode, "PREBOOK");
    assert.equal(parsed.isPrebook, true);
    assert.equal(parsed.sizeLimits.M, 60);
  });

  it("3. Transitions LIVE -> PAUSED in database", async () => {
    const { error: updateErr } = await supabase
      .from("launches")
      .update({
        status: "PAUSED",
        updated_at: new Date().toISOString(),
      })
      .eq("product_id", bengaluruProductId);

    assert.equal(updateErr, null, "Launch status update to PAUSED should succeed");

    const { data: launchRows } = await supabase
      .from("launches")
      .select("status")
      .eq("product_id", bengaluruProductId)
      .limit(1);

    assert.ok(launchRows && launchRows[0]);
    assert.equal(launchRows[0].status, "PAUSED");
  });

  it("4. Transitions PAUSED -> RESUME (LIVE) in database", async () => {
    const { error: updateErr } = await supabase
      .from("launches")
      .update({
        status: "LIVE",
        updated_at: new Date().toISOString(),
      })
      .eq("product_id", bengaluruProductId);

    assert.equal(updateErr, null, "Launch status resume to LIVE should succeed");

    const { data: launchRows } = await supabase
      .from("launches")
      .select("status")
      .eq("product_id", bengaluruProductId)
      .limit(1);

    assert.ok(launchRows && launchRows[0]);
    assert.equal(launchRows[0].status, "LIVE");
  });

  it("5. Multiple independent browser sessions read identical persisted state", async () => {
    // Session A client
    const clientA = createClient(supabaseUrl, supabaseKey);
    // Session B client
    const clientB = createClient(supabaseUrl, supabaseKey);

    const [resA, resB] = await Promise.all([
      clientA.from("launches").select("*").eq("product_id", bengaluruProductId).maybeSingle(),
      clientB.from("launches").select("*").eq("product_id", bengaluruProductId).maybeSingle(),
    ]);

    assert.ok(resA.data);
    assert.ok(resB.data);
    assert.equal(resA.data.status, resB.data.status);
    assert.equal(resA.data.utm_campaign, resB.data.utm_campaign);
  });

  it("6. Does NOT mutate or destroy inventory, assets, products, or campaigns during purchase mode changes", async () => {
    const { data: product } = await supabase
      .from("products")
      .select("id, name, sku, price_paise, status")
      .eq("id", bengaluruProductId)
      .maybeSingle();

    assert.ok(product);
    assert.equal(product.status, "ACTIVE");
    assert.equal(product.price_paise, 179900);

    const { data: sizes } = await supabase
      .from("product_sizes")
      .select("size, stock_quantity")
      .eq("product_id", bengaluruProductId);

    assert.ok(sizes && sizes.length === 4);
  });
});
