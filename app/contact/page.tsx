import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontFooter } from "../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / CONTACT — Concierge & Studio Coordinates",
  description: "Contact the BEXYEE studio concierge desk for orders, press inquiries, and sizing assistance.",
};

export default function ContactPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="CONTACT" />

      <section style={{ padding: "clamp(40px, 6vw, 90px) clamp(20px, 4vw, 80px)", borderBottom: "1px solid #2a2927" }}>
        <p style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          CONCIERGE &amp; DISPATCH DESK
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 84px)", margin: 0, letterSpacing: "-.08em", lineHeight: .9 }}>
          CONTACT
        </h1>
      </section>

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(40px, 6vw, 80px) 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          <div style={{ border: "1px solid #242422", background: "#121210", padding: "28px" }}>
            <span style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".1em" }}>CUSTOMER CONCIERGE</span>
            <h2 style={{ fontSize: "18px", color: "#fff", margin: "8px 0 12px 0" }}>Orders &amp; Sizing Desk</h2>
            <p style={{ fontSize: "11px", color: "#a5a098", lineHeight: "1.6", margin: "0 0 16px 0" }}>
              For order status, shipping inquiries, and sizing recommendations on heavyweight loopknit cuts.
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#e52b20" }}>support@bexyee.com</p>
            <small style={{ color: "#666", fontSize: "10px", display: "block", marginTop: "4px" }}>Response time &lt; 4 hours</small>
          </div>

          <div style={{ border: "1px solid #242422", background: "#121210", padding: "28px" }}>
            <span style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".1em" }}>STUDIO HEADQUARTERS</span>
            <h2 style={{ fontSize: "18px", color: "#fff", margin: "8px 0 12px 0" }}>Bengaluru Studio</h2>
            <p style={{ fontSize: "11px", color: "#a5a098", lineHeight: "1.6", margin: "0 0 16px 0" }}>
              100ft Road, Indiranagar, Bengaluru, Karnataka 560038, India.
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#e52b20" }}>12.9716° N, 77.5946° E</p>
          </div>
        </div>

        <div style={{ marginTop: "40px", padding: "28px", border: "1px solid #242422", background: "#121210" }}>
          <h3 style={{ fontSize: "16px", color: "#fff", margin: "0 0 12px 0", letterSpacing: "-.04em" }}>
            TRACK AN EXISTING SHIPMENT
          </h3>
          <p style={{ fontSize: "12px", color: "#a5a098", margin: "0 0 20px 0" }}>
            Real-time multi-carrier shipment milestones (Shiprocket / Delhivery / Bluedart) with AWB tracking.
          </p>
          <Link
            href="/track"
            style={{
              padding: "10px 20px",
              background: "#e52b20",
              color: "#fff",
              textDecoration: "none",
              fontSize: "9px",
              letterSpacing: ".1em",
              display: "inline-block",
            }}
          >
            OPEN ORDER TRACKER ↗
          </Link>
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
