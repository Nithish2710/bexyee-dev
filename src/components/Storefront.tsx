"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CityCampaign } from "../../app/page";
import { HeroProduct3D } from "./hero/HeroProduct3D";
import { GlobalHeader } from "./navigation/GlobalHeader";

const views = ["FRONT", "BACK", "LEFT SLEEVE", "RIGHT SLEEVE", "PRINT"];

export function Storefront({ campaign }: { campaign: CityCampaign }) {
  const [view, setView] = useState("FRONT");
  const [size, setSize] = useState("M");
  const [signal, setSignal] = useState({ x: 58, y: 42 });
  const [message, setMessage] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [cartId, setCartId] = useState<string | null>(null);
  const router = useRouter();

  const track = useCallback((eventName: string, properties: Record<string, unknown> = {}) => {
    const sessionId = window.localStorage.getItem("bexyee_session") ?? crypto.randomUUID();
    window.localStorage.setItem("bexyee_session", sessionId);
    const attribution = Object.fromEntries(new URLSearchParams(window.location.search).entries().filter(([key]) => key.startsWith("utm_")));
    void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventName, eventId: crypto.randomUUID(), sessionId, productId: campaign.productId, properties, attribution }) });
  }, [campaign.productId]);

  useEffect(() => { track("page_view"); track("product_view", { productName: campaign.productName }); }, [campaign.productName, track]);

  function handleSignal(event: React.PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setSignal({ x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100 });
  }

  async function addToCart(buyNow = false) {
    const stored = JSON.parse(window.localStorage.getItem("bexyee_cart") ?? "[]") as Array<{
      productId: string;
      size: string;
      quantity: number;
      products?: { name: string; sku: string; price_paise: number; front_image_url: string };
    }>;
    const existing = stored.find((item) => item.productId === campaign.productId && item.size === size);
    if (existing) {
      existing.quantity += 1;
    } else {
      stored.push({
        productId: campaign.productId,
        size,
        quantity: 1,
        products: {
          name: campaign.productName,
          sku: campaign.sku,
          price_paise: campaign.price * 100,
          front_image_url: campaign.frontImage || "/assets/products/bengaluru-tee-front.svg",
        },
      });
    }
    window.localStorage.setItem("bexyee_cart", JSON.stringify(stored));
    setCartCount(stored.reduce((total, item) => total + item.quantity, 0));
    window.dispatchEvent(new Event("bexyee_cart_updated"));

    try {
      const cartResponse = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: campaign.productId, size, quantity: existing?.quantity ?? 1 }),
      });
      const cartData = (await cartResponse.json().catch(() => null)) as { id?: string } | null;
      if (cartData?.id) {
        setCartId(cartData.id);
        window.localStorage.setItem("bexyee_cart_id", cartData.id);
      }
    } catch {
      // localStorage remains fallback
    }

    track("add_to_cart", { size, quantity: 1 });
    if (buyNow) track("checkout_started", { size });
    setMessage(`${size} / ${campaign.edition} added`);

    router.push("/cart");
  }

  const viewPhotos: Record<string, string> = {
    FRONT: campaign.frontImage || "/assets/products/bengaluru-tee-front.svg",
    BACK: campaign.backImage || "/assets/products/bengaluru-tee-back.svg",
    "LEFT SLEEVE": campaign.leftSleeveImage || "/assets/products/bengaluru-tee-left.svg",
    "RIGHT SLEEVE": campaign.rightSleeveImage || "/assets/products/bengaluru-tee-right.svg",
    PRINT: campaign.printImage || "/assets/products/bengaluru-tee-print.svg",
  };

  return (
    <main
      className="campaign"
      style={{
        "--accent": campaign.accentColor,
        "--signal-x": `${signal.x}%`,
        "--signal-y": `${signal.y}%`,
        "--artwork": `url(${campaign.backgroundImage})`,
      } as React.CSSProperties}
    >
      <GlobalHeader section={campaign.cityName.slice(0, 3).toUpperCase()} cartCountOverride={cartCount} />
      <section id="top" className="hero" onPointerMove={handleSignal} onPointerDown={handleSignal} aria-label={`${campaign.cityName} campaign hero`}>
        <div className="artwork" aria-hidden="true" />
        <div className="campaign-word" aria-hidden="true">{campaign.cityName}<span>.</span></div>
        <header className="hero-copy">
          <p className="kicker">BEXYEE / {campaign.cityName} EDITION</p>
          <p className="hero-note">{campaign.inspiration}</p>
        </header>

        <div id="product" className="product-wrap">
          <HeroProduct3D modelUrl={campaign.productModel} view={view} signal={signal} viewPhotos={viewPhotos} />
        </div>

        <aside className="inspiration">
          <span>INSPIRATION</span>
          <p>{campaign.campaignTitle.replace("\n", " ")} / A CITY UNIFORM FOR BENGALURU AFTER DARK.</p>
        </aside>

        <div className="hero-meta">
          <span>{campaign.edition}</span>
          <span>₹{campaign.price.toLocaleString("en-IN")}</span>
        </div>

        <div className="product-controls">
          {/* Prominent Price Tag */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "90px" }}>
            <span style={{ fontSize: "8.5px", color: "#8d8982", letterSpacing: ".14em", textTransform: "uppercase" }}>
              PRICE
            </span>
            <strong style={{ fontSize: "19px", color: "#ffffff", fontFamily: "var(--font-space-mono)", lineHeight: 1 }}>
              ₹{campaign.price.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="view-controls" role="group" aria-label="Product view">
            {views.map((item: string) => (
              <button className={view === item ? "active" : ""} key={item} onClick={() => { setView(item); track("product_view_change", { view: item }); }}>
                {item}
              </button>
            ))}
          </div>

          <fieldset className="size-controls">
            <legend>SELECT SIZE</legend>
            {campaign.sizes.map((item: string) => (
              <button type="button" aria-pressed={size === item} className={size === item ? "selected" : ""} key={item} onClick={() => { setSize(item); track("size_selected", { size: item }); }}>
                {item}
              </button>
            ))}
          </fieldset>

          <div className="actions">
            <button className="button-outline" onClick={() => addToCart(false)}>ADD TO CART <span>+</span></button>
            <button className="button-solid" onClick={() => addToCart(true)}>BUY NOW <span>↗</span></button>
          </div>
          {message && <p className="cart-message" role="status">{message}</p>}
        </div>
      </section>
      <section id="details" className="campaign-details">
        <div>
          <p className="kicker">01 / MATERIAL LANGUAGE</p>
          <h2>THE CITY<br /><em>WORN LOUD.</em></h2>
        </div>
        <div className="detail-copy">
          <p>{campaign.inspiration}</p>
          <span>SCROLL TO DISCOVER / ↓</span>
        </div>
      </section>
      <section className="info-strip">
        <span>{campaign.gsm} GSM / {campaign.fabric}</span>
        <span>{campaign.fit} / {campaign.productName}</span>
        <span>{campaign.cityName} / {campaign.edition}</span>
      </section>
      <footer id="checkout" className="campaign-footer">
        <span>{campaign.sku}</span>
        <span>{campaign.cityName} / INDIA</span>
        <button onClick={() => addToCart(true)}>SECURE THE EDITION ↗</button>
      </footer>
    </main>
  );
}