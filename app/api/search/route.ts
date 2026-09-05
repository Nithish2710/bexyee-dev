import { NextResponse } from "next/server";
import { supabaseServer } from "../../../src/lib/supabase-server";

type SearchResult = {
  type: "PRODUCT" | "CITY" | "ARTICLE" | "COLLECTION";
  title: string;
  subtitle: string;
  url: string;
};

const STATIC_SEARCH_DATA: SearchResult[] = [
  { type: "CITY", title: "Bengaluru (Signal After Rain)", subtitle: "12.9716° N, 77.5946° E • Metropolis", url: "/cities/bengaluru" },
  { type: "CITY", title: "Mumbai (Coastal Concrete & Dusk)", subtitle: "18.9220° N, 72.8347° E • Nov 2026", url: "/cities/mumbai" },
  { type: "CITY", title: "Delhi (Monumental Fog & Neon)", subtitle: "28.6139° N, 77.2090° E • Dec 2026", url: "/cities/delhi" },
  { type: "ARTICLE", title: "Engineering 320 GSM Super Loopknit", subtitle: "Textile physics & long-staple combed cotton", url: "/blog/engineering-320-gsm-super-loopknit" },
  { type: "ARTICLE", title: "Signal After Rain: The Visual System", subtitle: "Translating Bengaluru's monsoon into a garment", url: "/blog/signal-after-rain-visual-system" },
  { type: "COLLECTION", title: "Monsoon 2026 / City Transit", subtitle: "100 Units worldwide", url: "/collections/monsoon-2026" },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const results: SearchResult[] = [];

  if (supabaseServer) {
    const { data: dbProducts } = await supabaseServer
      .from("products")
      .select("name, slug, edition, price_paise, fabric, status, launches(id, status, created_at)")
      .eq("status", "ACTIVE")
      .or(`name.ilike.%${q}%,slug.ilike.%${q}%,sku.ilike.%${q}%`)
      .limit(10);

    if (dbProducts) {
      dbProducts.forEach((p: any) => {
        const launches = (p.launches || []).sort(
          (a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
        const latestLaunch = launches[0];

        // Skip draft or archived launches
        if (latestLaunch && (latestLaunch.status === "DRAFT" || latestLaunch.status === "ARCHIVED")) {
          return;
        }

        results.push({
          type: "PRODUCT",
          title: p.name,
          subtitle: `${p.edition || "DROP 001"} • ₹${(p.price_paise / 100).toLocaleString("en-IN")}`,
          url: `/product/${p.slug}`,
        });
      });
    }
  }

  // Complement with static index
  const matchedStatic = STATIC_SEARCH_DATA.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
  );

  matchedStatic.forEach((item) => {
    if (!results.some((r) => r.url === item.url)) {
      results.push(item);
    }
  });

  return NextResponse.json({ results: results.slice(0, 10) });
}
