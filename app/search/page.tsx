"use client";

import { useState } from "react";
import Link from "next/link";
import { StorefrontFooter } from "../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../src/components/navigation/GlobalHeader";

type SearchResult = {
  type: "PRODUCT" | "CITY" | "ARTICLE" | "COLLECTION";
  title: string;
  subtitle: string;
  url: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(q: string) {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as { results?: SearchResult[] };
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="SEARCH" />

      <section style={{ padding: "clamp(40px, 6vw, 90px) clamp(20px, 4vw, 80px)", borderBottom: "1px solid #2a2927" }}>
        <p style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          DISCOVERY &amp; ARCHIVE
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 84px)", margin: 0, letterSpacing: "-.08em", lineHeight: .9 }}>
          SEARCH ARCHIVE
        </h1>
        <div style={{ marginTop: "32px", maxWidth: "680px" }}>
          <input
            type="text"
            placeholder="Search by city, garment, GSM, or drop code..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "16px 20px",
              background: "#121210",
              border: "1px solid #333",
              color: "#fff",
              fontSize: "14px",
              fontFamily: "var(--font-space-mono)",
              outline: "none",
            }}
          />
        </div>
      </section>

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(30px, 4vw, 60px) 24px", minHeight: "350px" }}>
        {loading && <p style={{ fontSize: "11px", color: "#8d8982" }}>SCANNING ARCHIVES...</p>}

        {!loading && query && results.length === 0 && (
          <p style={{ fontSize: "12px", color: "#8d8982" }}>
            No entries found matching &ldquo;{query}&rdquo;.
          </p>
        )}

        <div style={{ display: "grid", gap: "12px" }}>
          {results.map((r, idx) => (
            <Link
              key={idx}
              href={r.url}
              style={{
                textDecoration: "none",
                color: "inherit",
                border: "1px solid #242422",
                background: "#121210",
                padding: "18px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: "9px", color: "#e52b20", letterSpacing: ".1em", display: "block" }}>
                  {r.type}
                </span>
                <strong style={{ fontSize: "14px", color: "#fff", display: "block", marginTop: "2px" }}>
                  {r.title}
                </strong>
                <small style={{ color: "#8d8982", fontSize: "10px" }}>{r.subtitle}</small>
              </div>
              <span style={{ fontSize: "10px", color: "#e52b20" }}>OPEN ↗</span>
            </Link>
          ))}
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
