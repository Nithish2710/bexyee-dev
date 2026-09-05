import type { Metadata } from "next";
import { StorefrontFooter } from "../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../src/components/navigation/GlobalHeader";

export const metadata: Metadata = {
  title: "BEXYEE / FAQ — Frequently Asked Questions & Ordering Policies",
  description: "Answers regarding micro-batch numbered editions, loopknit sizing, shipping timelines, and payment security.",
};

const FAQS = [
  {
    q: "How many units are produced per city drop?",
    a: "Every BEXYEE city drop is strictly capped at exactly 100 individually numbered units worldwide. Once 100 units sell out, the garment is permanently archived and the screens are retired.",
  },
  {
    q: "What makes 320 GSM Super Loopknit different from standard cotton?",
    a: "Standard t-shirts use 180-220 GSM single jersey which clings and deteriorates in high humidity. Our 320 GSM Super Loopknit uses 100% long-staple combed cotton with closed circular micro-loops, providing structured architectural drape and high breathability.",
  },
  {
    q: "How does the checkout reservation system work?",
    a: "When you initiate checkout, our PostgreSQL engine acquires an atomic row lock and reserves your selected size for 15 minutes. This ensures no other customer can purchase your unit while you complete payment.",
  },
  {
    q: "What payment methods are supported?",
    a: "We process payments securely via Razorpay, supporting UPI (Google Pay, PhonePe, Paytm, CRED), all major Debit/Credit cards, NetBanking, and BNPL. Cash on Delivery is disabled to maintain micro-batch integrity.",
  },
  {
    q: "How long does shipping take across India?",
    a: "Orders are processed within 24 hours of drop confirmation. Express air delivery takes 2 to 4 business days for metro cities, and 4 to 6 business days for the rest of India with live AWB tracking.",
  },
  {
    q: "Can I return or exchange a numbered piece?",
    a: "Due to the 100-unit limited nature, size exchanges depend on remaining stock. If your garment is defective upon delivery, we provide an immediate 100% refund via Razorpay to the original payment method.",
  },
];

export default function FAQPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="FAQ" />

      <section style={{ padding: "clamp(40px, 6vw, 90px) clamp(20px, 4vw, 80px)", borderBottom: "1px solid #2a2927" }}>
        <p style={{ fontSize: "9px", color: "#8d8982", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          CUSTOMER POLICIES &amp; OPERATIONS
        </p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 84px)", margin: 0, letterSpacing: "-.08em", lineHeight: .9 }}>
          FREQUENTLY ASKED
        </h1>
      </section>

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(40px, 6vw, 80px) 24px", display: "grid", gap: "20px" }}>
        {FAQS.map((faq, idx) => (
          <div key={idx} style={{ border: "1px solid #242422", background: "#121210", padding: "28px", display: "grid", gap: "10px" }}>
            <h2 style={{ fontSize: "16px", color: "#fff", margin: 0, letterSpacing: "-.02em" }}>
              {faq.q}
            </h2>
            <p style={{ fontSize: "12px", color: "#a5a098", margin: 0, lineHeight: "1.7" }}>
              {faq.a}
            </p>
          </div>
        ))}
      </section>

      <StorefrontFooter />
    </main>
  );
}
