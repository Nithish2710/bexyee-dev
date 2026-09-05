import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const envFile = fs.readFileSync(".env", "utf8");
const envVars = {};
for (const line of envFile.split("\n")) {
  const [k, ...v] = line.trim().split("=");
  if (k && v.length > 0) envVars[k] = v.join("=");
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log("Inspecting Supabase connection & schema...");
  
  // 1. Check products
  const { data: products, error: pErr } = await supabase.from("products").select("*").limit(2);
  console.log("Products query:", { count: products?.length, error: pErr?.message });
  if (products && products[0]) {
    console.log("Products[0] columns:", Object.keys(products[0]));
    console.log("Products[0] status:", products[0].status);
  }

  // 2. Check launches
  const { data: launches, error: lErr } = await supabase.from("launches").select("*").limit(2);
  console.log("Launches query:", { count: launches?.length, error: lErr?.message });
  if (launches && launches[0]) {
    console.log("Launches[0] columns:", Object.keys(launches[0]));
    console.log("Launches[0] status:", launches[0].status);
  }

  // 5. Test saving purchaseMode and launch status in launches table
  const testPayload = {
    purchaseMode: "PREBOOK",
    isPrebook: true,
    fulfillmentEstimate: "OCTOBER 2026",
    sizeLimits: { S: 25, M: 60, L: 35, XL: 25 },
  };

  const { data: updatedLaunch, error: launchUpdateErr } = await supabase
    .from("launches")
    .update({
      status: "LIVE",
      utm_campaign: JSON.stringify(testPayload),
      updated_at: new Date().toISOString(),
    })
    .eq("product_id", "00000000-0000-0000-0000-000000000001")
    .select();

  console.log("Launch update with JSON settings result:", {
    ok: !launchUpdateErr,
    error: launchUpdateErr?.message,
    status: updatedLaunch?.[0]?.status,
    utm_campaign: updatedLaunch?.[0]?.utm_campaign,
  });
}

inspect();
