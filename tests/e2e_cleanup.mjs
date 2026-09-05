/**
 * Cleans up all E2E test products created by e2e_runtime_acceptance.mjs
 */
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://syllbbpovvucvriezaiw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bGxiYnBvdnZ1Y3ZyaWV6YWl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzQ3MDcwMCwiZXhwIjoyMTAzMDQ2NzAwfQ.UNyZSjAQ8Rdzad4h0uwGrlT8HuAJ_17o66azOFmLHAk"
);

const E2E_SLUGS = ["e2e-bengaluru-city3d", "e2e-mumbai-editorial", "e2e-standard-basic"];

for (const slug of E2E_SLUGS) {
  const { data: p } = await sb.from("products").select("id").eq("slug", slug).maybeSingle();
  if (!p) { console.log(`  SKIP: ${slug} (not found)`); continue; }
  await sb.from("launches").delete().eq("product_id", p.id);
  await sb.from("product_assets").delete().eq("product_id", p.id);
  await sb.from("product_sizes").delete().eq("product_id", p.id);
  await sb.from("products").delete().eq("id", p.id);
  console.log(`  DELETED: ${slug}`);
}
console.log("Cleanup complete.");
