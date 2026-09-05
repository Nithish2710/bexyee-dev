import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontFooter } from "../../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / ACCOUNT — Shipping Addresses & Pincode Validation",
  description: "Manage default shipping destinations for fast checkout during high-concurrency city drops.",
};

export default function AccountAddressesPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="ADDRESSES" />

      <section style={{ padding: "clamp(40px, 6vw, 90px) clamp(20px, 4vw, 80px)", borderBottom: "1px solid #2a2927" }}>
        <p style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          DISPATCH DESTINATIONS
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 84px)", margin: 0, letterSpacing: "-.08em", lineHeight: .9 }}>
          ADDRESSES
        </h1>
      </section>

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(40px, 6vw, 80px) 24px" }}>
        <div style={{ border: "1px solid #242422", background: "#121210", padding: "28px" }}>
          <strong style={{ fontSize: "14px", color: "#fff", display: "block", marginBottom: "8px" }}>
            FAST CHECKOUT DISPATCH
          </strong>
          <p style={{ fontSize: "12px", color: "#a5a098", lineHeight: "1.6", margin: "0 0 16px 0" }}>
            BEXYEE supports guest and saved address checkout. During city drops, enter your 6-digit Indian PIN code at checkout to calculate real-time carrier quotes.
          </p>
          <Link
            href="/cart"
            style={{
              padding: "8px 16px",
              background: "#e52b20",
              color: "#fff",
              textDecoration: "none",
              fontSize: "9px",
              display: "inline-block",
            }}
          >
            VIEW CURRENT CART ↗
          </Link>
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
