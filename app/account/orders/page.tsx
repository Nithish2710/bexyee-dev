import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontFooter } from "../../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / ACCOUNT — Order History & Status",
  description: "Review past purchases, download GST invoices, and track live shipments.",
};

export default function AccountOrdersPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="ORDERS" />

      <section style={{ padding: "clamp(40px, 6vw, 90px) clamp(20px, 4vw, 80px)", borderBottom: "1px solid #2a2927" }}>
        <p style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          CUSTOMER PORTAL
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 84px)", margin: 0, letterSpacing: "-.08em", lineHeight: .9 }}>
          ORDER HISTORY
        </h1>
      </section>

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(40px, 6vw, 80px) 24px" }}>
        <div style={{ border: "1px solid #242422", background: "#121210", padding: "28px" }}>
          <strong style={{ fontSize: "14px", color: "#fff", display: "block", marginBottom: "8px" }}>
            LOOKUP AN ORDER BY ID
          </strong>
          <p style={{ fontSize: "11px", color: "#8d8982", margin: "0 0 20px 0" }}>
            Guest orders placed with UPI or Card are verified with server-side HMAC signatures.
          </p>
          <Link
            href="/track"
            style={{
              padding: "10px 18px",
              background: "#e52b20",
              color: "#fff",
              textDecoration: "none",
              fontSize: "9px",
              letterSpacing: ".1em",
              display: "inline-block",
            }}
          >
            ENTER TRACKING PORTAL ↗
          </Link>
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
