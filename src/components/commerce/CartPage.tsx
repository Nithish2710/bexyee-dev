"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GlobalHeader } from "../navigation/GlobalHeader";
import { StorefrontFooter } from "../navigation/StorefrontFooter";

type CartItem = {
  id?: string;
  product_id?: string;
  productId?: string;
  size: string;
  quantity: number;
  products?: {
    name?: string;
    sku?: string;
    price_paise?: number;
    front_image_url?: string;
  };
};

export function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("Loading cart...");

  useEffect(() => {
    fetch("/api/cart")
      .then(async (response) => {
        const data = await response.json();
        if (data.cart?.items && data.cart.items.length > 0) {
          setItems(data.cart.items);
          setMessage("");
          return;
        }
        const local = JSON.parse(window.localStorage.getItem("bexyee_cart") ?? "[]") as CartItem[];
        setItems(local);
        setMessage(local.length ? "" : "Your cart is empty.");
      })
      .catch(() => {
        const local = JSON.parse(window.localStorage.getItem("bexyee_cart") ?? "[]") as CartItem[];
        setItems(local);
        setMessage(local.length ? "" : "Your cart is empty.");
      });
  }, []);

  async function updateQuantity(item: CartItem, index: number, delta: number) {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      await remove(item, index);
      return;
    }
    if (newQty > 10) return;
    const next = [...items];
    next[index] = { ...item, quantity: newQty };
    setItems(next);
    window.localStorage.setItem("bexyee_cart", JSON.stringify(next));
    window.dispatchEvent(new Event("bexyee_cart_updated"));

    const pId = item.product_id || item.productId || "00000000-0000-0000-0000-000000000001";
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: pId, size: item.size, quantity: newQty }),
    }).catch(() => {});
  }

  async function remove(item: CartItem, index: number) {
    if (item.id) await fetch(`/api/cart?itemId=${item.id}`, { method: "DELETE" }).catch(() => {});
    const next = items.filter((_, itemIndex) => itemIndex !== index);
    setItems(next);
    window.localStorage.setItem("bexyee_cart", JSON.stringify(next));
    window.dispatchEvent(new Event("bexyee_cart_updated"));
    if (!next.length) setMessage("Your cart is empty.");
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.products?.price_paise ?? 179900) * item.quantity, 0);
  const gstPaise = Math.round(total * 0.12);

  return (
    <main style={{ minHeight: "100vh", background: "#F7F7F3", color: "#000000", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="CART" cartCountOverride={totalQuantity} />

      {/* Direct Breadcrumb Navigation */}
      <nav
        aria-label="Cart navigation"
        style={{
          borderBottom: "1px solid #E5E5E5",
          padding: "14px clamp(20px, 4vw, 80px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "10px",
          letterSpacing: ".14em",
          background: "#FFFFFF",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#000000",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            fontWeight: 700,
          }}
        >
          ← HOME
        </Link>

        <div style={{ display: "flex", gap: "20px" }}>
          <Link
            href="/products"
            style={{
              color: "#777777",
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
          >
            CONTINUE SHOPPING ↗
          </Link>
          {items.length > 0 && (
            <Link
              href="/checkout"
              style={{
                color: "#000000",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              PROCEED TO CHECKOUT ↗
            </Link>
          )}
        </div>
      </nav>

      {/* Cart Content Section */}
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "clamp(40px, 6vw, 80px) 24px" }}>
        <p style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".2em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          COLLECTOR RESERVATION
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #E5E5E5", paddingBottom: "20px", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", margin: 0, letterSpacing: "-.06em", lineHeight: 0.95, color: "#000000" }}>
            SHOPPING CART
          </h1>
          <span style={{ fontSize: "12px", color: "#000000", fontWeight: 800 }}>
            {totalQuantity} {totalQuantity === 1 ? "ITEM" : "ITEMS"}
          </span>
        </div>

        {items.length === 0 ? (
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "48px 24px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "#777777", margin: "0 0 24px 0" }}>
              {message || "Your cart is currently empty."}
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/"
                style={{
                  padding: "14px 24px",
                  background: "#FFFFFF",
                  border: "1px solid #000000",
                  color: "#000000",
                  fontSize: "11px",
                  letterSpacing: ".14em",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                ← RETURN TO HOME
              </Link>
              <Link
                href="/products"
                style={{
                  padding: "14px 24px",
                  background: "#000000",
                  color: "#FFFFFF",
                  fontSize: "11px",
                  letterSpacing: ".14em",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                EXPLORE CATALOG ↗
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "24px" }}>
            {/* Item Lines (White Cards) */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px" }}>
              {items.map((item, index) => {
                const itemPricePaise = item.products?.price_paise ?? 179900;
                const itemImg = item.products?.front_image_url || "/assets/products/bengaluru-tee-front.svg";
                const itemName = item.products?.name ?? "Bengaluru Edition Heavyweight Tee";
                const itemKey = `${item.product_id || item.productId || "item"}-${item.size}-${index}`;

                return (
                  <article
                    key={itemKey}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto auto",
                      gap: "24px",
                      alignItems: "center",
                      padding: "20px 0",
                      borderBottom: index < items.length - 1 ? "1px solid #E5E5E5" : 0,
                    }}
                  >
                    {/* Visual Thumbnail */}
                    <div
                      style={{
                        width: "72px",
                        height: "88px",
                        background: "#F7F7F3",
                        border: "1px solid #E5E5E5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        padding: "6px",
                      }}
                    >
                      <img
                        src={itemImg}
                        alt={itemName}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>

                    <div>
                      <h2 style={{ fontSize: "16px", color: "#000000", margin: "0 0 6px 0", letterSpacing: "-.02em" }}>
                        {itemName}
                      </h2>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "11px", color: "#777777" }}>
                          SIZE: <strong style={{ color: "#000000" }}>{item.size}</strong>
                        </span>
                        <span style={{ color: "#E5E5E5" }}>•</span>
                        <span style={{ fontSize: "11px", color: "#777777" }}>
                          UNIT: <strong style={{ color: "#000000" }}>₹{(itemPricePaise / 100).toLocaleString("en-IN")}</strong>
                        </span>
                        <span style={{ color: "#E5E5E5" }}>•</span>
                        <span style={{ fontSize: "11px", color: "#777777" }}>QTY:</span>
                        <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #E5E5E5", background: "#FFFFFF" }}>
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item, index, -1)}
                            style={{
                              background: "transparent",
                              border: 0,
                              color: "#000000",
                              width: "24px",
                              height: "24px",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "13px",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            −
                          </button>
                          <span style={{ fontSize: "12px", color: "#000000", minWidth: "22px", textAlign: "center", fontWeight: 700 }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item, index, 1)}
                            style={{
                              background: "transparent",
                              border: 0,
                              color: "#000000",
                              width: "24px",
                              height: "24px",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "13px",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <strong style={{ fontSize: "16px", color: "#000000", whiteSpace: "nowrap" }}>
                      ₹{((itemPricePaise * item.quantity) / 100).toLocaleString("en-IN")}
                    </strong>

                    <button
                      type="button"
                      onClick={() => remove(item, index)}
                      style={{
                        background: "transparent",
                        border: "1px solid #E5E5E5",
                        color: "#777777",
                        fontSize: "9px",
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontFamily: "var(--font-space-mono)",
                        letterSpacing: ".1em",
                      }}
                    >
                      REMOVE
                    </button>
                  </article>
                );
              })}
            </div>

            {/* Summary & Actions (White Card) */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px", display: "grid", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#777777" }}>
                <span>SUBTOTAL</span>
                <strong style={{ color: "#000000" }}>₹{(total / 100).toLocaleString("en-IN")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#777777" }}>
                <span>ZERO-PLASTIC DELIVERY</span>
                <span style={{ color: "#000000", fontWeight: 700 }}>FREE (PREPAID)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#777777" }}>
                <span>ESTIMATED TAXES (INCLUDED)</span>
                <span style={{ color: "#777777" }}>12% GST (₹{(gstPaise / 100).toLocaleString("en-IN")} included)</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", color: "#000000", paddingTop: "16px", borderTop: "1px solid #E5E5E5" }}>
                <strong>TOTAL</strong>
                <strong>₹{(total / 100).toLocaleString("en-IN")}</strong>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
                <Link
                  href="/checkout"
                  style={{
                    padding: "18px 24px",
                    background: "#000000",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    letterSpacing: ".14em",
                    textDecoration: "none",
                    fontWeight: 800,
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  PROCEED TO SECURE CHECKOUT ↗
                </Link>

                <div style={{ display: "flex", gap: "12px", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <Link
                    href="/products"
                    style={{
                      padding: "14px 20px",
                      background: "#FFFFFF",
                      border: "1px solid #000000",
                      color: "#000000",
                      fontSize: "10px",
                      letterSpacing: ".12em",
                      textDecoration: "none",
                      textAlign: "center",
                      flex: 1,
                      fontWeight: 700,
                    }}
                  >
                    CONTINUE SHOPPING ↗
                  </Link>

                  <Link
                    href="/"
                    style={{
                      padding: "14px 20px",
                      background: "transparent",
                      border: "1px solid #E5E5E5",
                      color: "#777777",
                      fontSize: "10px",
                      letterSpacing: ".12em",
                      textDecoration: "none",
                      textAlign: "center",
                      flex: 1,
                    }}
                  >
                    HOME ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <StorefrontFooter />
    </main>
  );
}
