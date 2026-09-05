import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontFooter } from "../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / ACCOUNT — Orders & Collector Portal",
  description: "Manage your BEXYEE orders, shipping addresses, and numbered edition certificates.",
};

export default function AccountPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="ACCOUNT" />

      <section style={{ padding: "clamp(40px, 6vw, 90px) clamp(20px, 4vw, 80px)", borderBottom: "1px solid #2a2927" }}>
        <p style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          CUSTOMER PORTAL
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 84px)", margin: 0, letterSpacing: "-.08em", lineHeight: .9 }}>
          MY ORDERS
        </h1>
      </section>

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(40px, 6vw, 80px) 24px" }}>
        <div style={{ border: "1px solid #242422", background: "#121210", padding: "32px", textAlign: "center" }}>
          <strong style={{ fontSize: "16px", color: "#fff", display: "block", marginBottom: "8px" }}>
            LOOKUP AN ORDER
          </strong>
          <p style={{ fontSize: "12px", color: "#a5a098", maxWidth: "480px", margin: "0 auto 24px auto", lineHeight: "1.6" }}>
            BEXYEE supports instant guest checkout. Enter your Order ID below to view live tracking, invoices, and edition certificates.
          </p>
          <Link
            href="/track"
            style={{
              padding: "12px 24px",
              background: "#e52b20",
              color: "#fff",
              textDecoration: "none",
              fontSize: "10px",
              letterSpacing: ".1em",
              display: "inline-block",
            }}
          >
            SEARCH BY ORDER ID ↗
          </Link>
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
