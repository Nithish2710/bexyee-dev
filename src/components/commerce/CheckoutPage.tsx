"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const steps = ["CUSTOMER DETAILS", "ADDRESS", "ORDER REVIEW", "RAZORPAY"];

type CartItem = {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  unitPricePaise: number;
  sku: string;
  purchaseMode?: string;
  expectedFulfillmentDate?: string;
};

type FormState = { email: string; name: string; phone: string; line1: string; city: string; state: string; pincode: string };

export function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({ email: "", name: "", phone: "", line1: "", city: "Bengaluru", state: "Karnataka", pincode: "" });
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(1799);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("bexyee_cart");
      if (raw) {
        const items: CartItem[] = JSON.parse(raw);
        setCartItems(items);
        const sum = items.reduce((acc, i) => acc + (i.unitPricePaise * i.quantity) / 100, 0);
        if (sum > 0) setTotal(sum);
      }
    } catch {
      // Ignore
    }
  }, []);

  function update(field: keyof FormState, value: string) { setForm((current) => ({ ...current, [field]: value })); }
  function next(event: FormEvent) { event.preventDefault(); setError(""); setStep((current) => Math.min(2, current + 1)); }

  const hasPrebook = cartItems.some((i) => i.purchaseMode === "PREBOOK");
  const prebookFulfillment = cartItems.find((i) => i.purchaseMode === "PREBOOK")?.expectedFulfillmentDate || "OCTOBER 2026";

  async function pay() {
    setError("");
    let activeCart = typeof window !== "undefined" ? window.localStorage.getItem("bexyee_cart_id") : null;
    if (!activeCart) {
      try {
        const cartRes = await fetch("/api/cart");
        const cartData = await cartRes.json() as { cart?: { id?: string; items?: unknown[] } };
        if (cartData?.cart?.id) {
          activeCart = cartData.cart.id;
          window.localStorage.setItem("bexyee_cart_id", activeCart);
        }
      } catch {
        // ignore
      }
    }
    if (!activeCart) { setError("Your cart is not connected to checkout yet. Add the product again from the campaign."); return; }
    const response = await fetch("/api/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cartId: activeCart, guestEmail: form.email, address: { name: form.name, phone: form.phone, line1: form.line1, city: form.city, state: form.state, pincode: form.pincode }, attribution: Object.fromEntries(new URLSearchParams(window.location.search).entries().filter(([key]) => key.startsWith("utm_"))) }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error ?? "Checkout unavailable."); return; }
    setTotal((data.totals.totalPaise ?? 179900) / 100); setStep(3);
    const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => new (window as unknown as { Razorpay: new (options: Record<string, unknown>) => { open: () => void } }).Razorpay({ key: data.keyId, amount: data.razorpayOrder.amount, currency: "INR", name: "BEXYEE", description: "Bengaluru Tee", order_id: data.razorpayOrder.id, prefill: { name: form.name, email: form.email, contact: form.phone }, handler: async (payment: Record<string, string>) => { const verification = await fetch("/api/checkout/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payment, orderId: data.orderId }) }); if (verification.ok) router.push(`/order/success?order=${data.orderId}`); else setError("Payment verification failed. Contact support with your payment reference."); } }).open();
    document.body.appendChild(script);
  }

  return (
    <main className="commerce-page">
      <header className="commerce-header">
        <Link href="/" className="commerce-logo">
          BEXYEE<span>/</span>STORE
        </Link>
        <span>CHECKOUT / {steps[Math.min(step, 3)]}</span>
      </header>

      <section className="checkout-layout">
        <div className="checkout-main">
          <div className="checkout-steps">
            {steps.map((item, index) => (
              <span className={index <= step ? "current" : ""} key={item}>
                0{index + 1} / {item}
              </span>
            ))}
          </div>

          {step < 2 && (
            <form onSubmit={next} className="commerce-form">
              <p className="commerce-kicker">0{step + 1} / {steps[step]}</p>
              <h1>{step === 0 ? "Who are you?" : "Where should we send it?"}</h1>
              {step === 0 ? (
                <>
                  <label>
                    Email
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => update("email", event.target.value)}
                      placeholder="collector@example.com"
                      required
                    />
                  </label>
                  <label>
                    Full name
                    <input
                      value={form.name}
                      onChange={(event) => update("name", event.target.value)}
                      placeholder="First and last name"
                      required
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) => update("phone", event.target.value)}
                      placeholder="10-digit mobile number"
                      required
                    />
                  </label>
                </>
              ) : (
                <>
                  <label>
                    Address Line 1
                    <input
                      value={form.line1}
                      onChange={(event) => update("line1", event.target.value)}
                      placeholder="House/Flat number, Street name"
                      required
                    />
                  </label>
                  <div className="form-split">
                    <label>
                      City
                      <input
                        value={form.city}
                        onChange={(event) => update("city", event.target.value)}
                        required
                      />
                    </label>
                    <label>
                      State
                      <input
                        value={form.state}
                        onChange={(event) => update("state", event.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <label>
                    Pincode
                    <input
                      pattern="[0-9]{6}"
                      value={form.pincode}
                      onChange={(event) => update("pincode", event.target.value)}
                      placeholder="6-digit Indian PIN"
                      required
                    />
                  </label>
                </>
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    style={{
                      background: "transparent",
                      border: "1px solid #333",
                      color: "#aaa49b",
                      padding: "14px 20px",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontFamily: "var(--font-space-mono)",
                    }}
                  >
                    ← BACK
                  </button>
                )}
                <button type="submit" style={{ flex: 1 }}>
                  CONTINUE ↗
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <section className="commerce-form">
              <p className="commerce-kicker">03 / ORDER REVIEW</p>
              <h1>Check the details.</h1>
              <div className="review-block">
                <span>CUSTOMER</span>
                <strong>{form.name} / {form.email}</strong>
                <span>DELIVERY</span>
                <strong>{form.line1}, {form.city}, {form.state} / {form.pincode}</strong>
                <span>PAYMENT</span>
                <strong>RAZORPAY / SECURE CHECKOUT</strong>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: "transparent",
                    border: "1px solid #333",
                    color: "#aaa49b",
                    padding: "16px 20px",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontFamily: "var(--font-space-mono)",
                  }}
                >
                  ← EDIT ADDRESS
                </button>
                <button onClick={pay} style={{ flex: 1 }}>
                  PAY ₹{total.toLocaleString("en-IN")} ↗
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="commerce-form">
              <p className="commerce-kicker">04 / RAZORPAY</p>
              <h1>Payment open.</h1>
              <p>Complete the secure Razorpay window to verify your order.</p>
            </section>
          )}

          {error && <p className="commerce-error" role="alert">{error}</p>}
        </div>

        <aside className="checkout-aside">
          <span>ORDER SUMMARY</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "8px 0 16px" }}>
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  fontSize: "11.5px",
                  borderBottom: "1px dashed rgba(0, 0, 0, 0.1)",
                  paddingBottom: "8px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {item.productName} ({item.size}) × {item.quantity}
                  </div>
                  {item.purchaseMode === "PREBOOK" && (
                    <div style={{ fontSize: "9px", color: "#E52B20", fontWeight: 700, marginTop: "2px" }}>
                      PRE-BOOK ALLOCATION
                    </div>
                  )}
                </div>
                <strong>₹{((item.unitPricePaise * item.quantity) / 100).toLocaleString("en-IN")}</strong>
              </div>
            ))}
          </div>

          {hasPrebook && (
            <div
              style={{
                background: "#F7F7F3",
                border: "1px solid #E5E5E5",
                borderLeft: "3px solid #E52B20",
                padding: "10px 12px",
                fontSize: "10.5px",
                marginBottom: "14px",
              }}
            >
              <strong style={{ color: "#E52B20", display: "block", marginBottom: "2px" }}>
                PRE-BOOK NOTICE
              </strong>
              <span>
                Expected dispatch: <strong>{prebookFulfillment}</strong>. Serialized authenticity certificate included.
              </span>
            </div>
          )}

          <span>ORDER TOTAL (INCL. GST &amp; DISPATCH)</span>
          <strong>₹{total.toLocaleString("en-IN")}</strong>
          <small>
            Zero-plastic shipping included.<br />
            Payment is verified server-side with atomic stock hold.
          </small>
        </aside>
      </section>
    </main>
  );
}
