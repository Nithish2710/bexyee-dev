import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontFooter } from "../../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / ACCOUNT — Saved Editions & Wishlist",
  description: "Review saved city drops and receive automated stock availability alerts.",
};

export default function AccountWishlistPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="WISHLIST" />

      <section style={{ padding: "clamp(40px, 6vw, 90px) clamp(20px, 4vw, 80px)", borderBottom: "1px solid #2a2927" }}>
        <p style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          SAVED PIECES
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 84px)", margin: 0, letterSpacing: "-.08em", lineHeight: .9 }}>
          WISHLIST
        </h1>
      </section>

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(40px, 6vw, 80px) 24px" }}>
        <div style={{ border: "1px solid #242422", background: "#121210", padding: "32px", textAlign: "center" }}>
          <strong style={{ fontSize: "14px", color: "#fff", display: "block", marginBottom: "8px" }}>
            EXPLORE CURRENT &amp; UPCOMING CITY DROPS
          </strong>
          <p style={{ fontSize: "12px", color: "#a5a098", maxWidth: "480px", margin: "0 auto 24px auto", lineHeight: "1.6" }}>
            Save upcoming editions to your watchlist to receive instant drop notifications before units sell out.
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <Link
              href="/products"
              style={{
                padding: "10px 20px",
                background: "#e52b20",
                color: "#fff",
                textDecoration: "none",
                fontSize: "9px",
                letterSpacing: ".1em",
              }}
            >
              EXPLORE CATALOG ↗
            </Link>
            <Link
              href="/cities"
              style={{
                padding: "10px 20px",
                background: "transparent",
                border: "1px solid #444",
                color: "#fff",
                textDecoration: "none",
                fontSize: "9px",
                letterSpacing: ".1em",
              }}
            >
              CITY ROSTER ↗
            </Link>
          </div>
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
