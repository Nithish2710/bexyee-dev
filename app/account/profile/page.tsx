import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontFooter } from "../../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / ACCOUNT — Customer Profile & Preferences",
  description: "Manage collector details, preferred sizing, and notification settings.",
};

export default function AccountProfilePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="PROFILE" />

      <section style={{ padding: "clamp(40px, 6vw, 90px) clamp(20px, 4vw, 80px)", borderBottom: "1px solid #2a2927" }}>
        <p style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          COLLECTOR PROFILE
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 84px)", margin: 0, letterSpacing: "-.08em", lineHeight: .9 }}>
          PREFERENCES
        </h1>
      </section>

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(40px, 6vw, 80px) 24px", display: "grid", gap: "24px" }}>
        <div style={{ border: "1px solid #242422", background: "#121210", padding: "28px" }}>
          <strong style={{ fontSize: "14px", color: "#fff", display: "block", marginBottom: "8px" }}>
            DROP ALERTS &amp; SIZING PROFILE
          </strong>
          <p style={{ fontSize: "12px", color: "#a5a098", lineHeight: "1.6", margin: "0 0 16px 0" }}>
            BEXYEE operates on micro-batch drops. Your sizing preference (S, M, L, XL) will be pre-selected on drop day to streamline 1-click checkout.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              href="/account/addresses"
              style={{
                padding: "8px 16px",
                border: "1px solid #444",
                color: "#fff",
                textDecoration: "none",
                fontSize: "9px",
              }}
            >
              SAVED ADDRESSES ↗
            </Link>
            <Link
              href="/account/security"
              style={{
                padding: "8px 16px",
                border: "1px solid #444",
                color: "#fff",
                textDecoration: "none",
                fontSize: "9px",
              }}
            >
              SECURITY &amp; MFA ↗
            </Link>
          </div>
        </div>
      </section>

      <StorefrontFooter />
    </main>
  );
}
