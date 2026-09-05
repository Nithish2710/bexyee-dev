"use client";

import { FormEvent, useState } from "react";
import type { AdminData } from "./AdminShell";

async function send(path: string, method: "POST" | "PATCH", body: unknown) {
  const response = await fetch(path, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Request failed.");
  return data;
}

export function ProductForm({ campaigns }: { campaigns: AdminData["campaigns"] }) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      await send("/api/admin/products", "POST", {
        campaignId: form.get("campaignId"),
        name: form.get("name"),
        slug: form.get("slug"),
        edition: form.get("edition"),
        sku: form.get("sku"),
        price: Number(form.get("price")),
        compareAtPrice: form.get("compareAtPrice") ? Number(form.get("compareAtPrice")) : 0,
        gstRate: Number(form.get("gstRate") || 12),
        description: form.get("description"),
        fabric: form.get("fabric"),
        gsm: Number(form.get("gsm")),
        fit: form.get("fit"),
        careInstructions: form.get("careInstructions"),
        modelUrl: form.get("modelUrl") || null,
        frontImageUrl: form.get("frontImageUrl") || null,
        backImageUrl: form.get("backImageUrl") || null,
        leftSleeveImageUrl: form.get("leftSleeveImageUrl") || null,
        rightSleeveImageUrl: form.get("rightSleeveImageUrl") || null,
        printImageUrl: form.get("printImageUrl") || null,
        seoTitle: form.get("seoTitle") || null,
        seoDescription: form.get("seoDescription") || null,
        sizes: {
          S: Number(form.get("S") || 0),
          M: Number(form.get("M") || 0),
          L: Number(form.get("L") || 0),
          XL: Number(form.get("XL") || 0),
        },
        lowStockThreshold: Number(form.get("threshold") || 5),
        status: form.get("status") || "DRAFT",
      });
      setMessage("Product created successfully.");
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create product.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form-grid">
        <label>
          Campaign
          <select name="campaignId" required>
            {campaigns.map((campaign) => (
              <option value={campaign.id} key={campaign.id}>
                {campaign.city_name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Product Name
          <input name="name" required placeholder="Bengaluru Heavyweight Tee" />
        </label>
        <label>
          Slug
          <input name="slug" placeholder="bengaluru-tee" required />
        </label>
        <label>
          Edition
          <input name="edition" placeholder="001 / 100" required />
        </label>
        <label>
          SKU
          <input name="sku" required placeholder="BEXYEE-BLR-001" />
        </label>
        <label>
          Price (INR)
          <input name="price" type="number" min="0" step="1" required placeholder="1799" />
        </label>
        <label>
          Compare-At Price (INR)
          <input name="compareAtPrice" type="number" min="0" step="1" placeholder="2499" />
        </label>
        <label>
          GST Rate (%)
          <select name="gstRate">
            <option value="5">5% (Standard Apparel)</option>
            <option value="12">12% (Premium Apparel &gt; ₹1000)</option>
            <option value="18">18% (Luxury / Accessories)</option>
          </select>
        </label>
        <label>
          Fabric
          <input name="fabric" placeholder="320 GSM SUPER LOOPKNIT" />
        </label>
        <label>
          GSM
          <input name="gsm" type="number" min="1" defaultValue="320" />
        </label>
        <label>
          Fit
          <input name="fit" placeholder="OVERSIZED / BOXY" />
        </label>
        <label>
          Status
          <select name="status">
            <option value="DRAFT">DRAFT</option>
            <option value="ACTIVE">ACTIVE</option>
          </select>
        </label>
        <label>
          Front Photo URL
          <input name="frontImageUrl" type="url" placeholder="/assets/products/bengaluru-tee-front.svg" />
        </label>
        <label>
          Back Photo URL
          <input name="backImageUrl" type="url" placeholder="/assets/products/bengaluru-tee-back.svg" />
        </label>
        <label>
          Left Sleeve URL
          <input name="leftSleeveImageUrl" type="url" />
        </label>
        <label>
          Right Sleeve URL
          <input name="rightSleeveImageUrl" type="url" />
        </label>
        <label>
          Print Macro URL
          <input name="printImageUrl" type="url" />
        </label>
        <label>
          GLB Garment URL
          <input name="modelUrl" type="url" placeholder="https://.../garment.glb" />
        </label>
        <label>
          SEO Title
          <input name="seoTitle" placeholder="BEXYEE — Bengaluru Heavyweight Tee" />
        </label>
        <label>
          SEO Description
          <input name="seoDescription" placeholder="Limited edition city uniform..." />
        </label>
        <label>
          Low-Stock Threshold
          <input name="threshold" type="number" min="1" defaultValue="5" />
        </label>
        <label style={{ gridColumn: "span 3" }}>
          Description &amp; Story
          <textarea name="description" placeholder="A city uniform shaped by wet roads..." />
        </label>
        <label style={{ gridColumn: "span 3" }}>
          Care Instructions
          <textarea name="careInstructions" placeholder="Machine wash cold inside-out. Do not iron directly on graphics." />
        </label>
      </div>

      <fieldset style={{ border: "1px solid #d6d1c9", padding: "14px", background: "#fffdfa" }}>
        <legend style={{ fontSize: "10px", fontFamily: "var(--font-space-mono)", padding: "0 8px" }}>
          INITIAL STOCK ALLOCATION
        </legend>
        <div className="stock-inputs" style={{ display: "flex", gap: "16px" }}>
          {["S", "M", "L", "XL"].map((size) => (
            <label key={size} style={{ display: "grid", gap: "4px" }}>
              {size}
              <input name={size} type="number" min="0" defaultValue="10" style={{ width: "80px" }} />
            </label>
          ))}
        </div>
      </fieldset>

      <button type="submit" disabled={isSubmitting} style={{ width: "max-content" }}>
        {isSubmitting ? "CREATING..." : "CREATE PRODUCT ↗"}
      </button>
      {message && <p className="admin-form-message">{message}</p>}
    </form>
  );
}

export function InventoryForm({ products }: { products: AdminData["products"] }) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await send("/api/admin/inventory", "POST", {
        productId: form.get("productId"),
        size: form.get("size"),
        delta: Number(form.get("delta")),
        reason: form.get("reason"),
        lowStockThreshold: Number(form.get("threshold")),
      });
      setMessage("Inventory adjusted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to adjust inventory.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="admin-form compact-form" onSubmit={submit}>
      <label>
        Product
        <select name="productId" required>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} / {product.sku}
            </option>
          ))}
        </select>
      </label>
      <label>
        Size
        <select name="size">
          <option>S</option>
          <option>M</option>
          <option>L</option>
          <option>XL</option>
        </select>
      </label>
      <label>
        Adjustment
        <input name="delta" type="number" min="-999" required placeholder="+10 or -1" />
      </label>
      <label>
        Low-stock threshold
        <input name="threshold" type="number" min="0" defaultValue="5" />
      </label>
      <label>
        Reason
        <input name="reason" required placeholder="Received new warehouse batch" />
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "ADJUSTING..." : "ADJUST STOCK ↗"}
      </button>
      {message && <p className="admin-form-message">{message}</p>}
    </form>
  );
}

export function OrderStatusForm({ orders }: { orders: AdminData["orders"] }) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await send("/api/admin/orders", "PATCH", {
        orderId: form.get("orderId"),
        status: form.get("status"),
        trackingNumber: form.get("trackingNumber"),
      });
      setMessage("Order updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="admin-form compact-form" onSubmit={submit}>
      <label>
        Order
        <select name="orderId" required>
          {orders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.id.slice(0, 8)} / {order.status}
            </option>
          ))}
        </select>
      </label>
      <label>
        Status
        <select name="status">
          <option>PROCESSING</option>
          <option>SHIPPED</option>
          <option>DELIVERED</option>
          <option>CANCELLED</option>
          <option>REFUNDED</option>
        </select>
      </label>
      <label>
        Tracking number
        <input name="trackingNumber" placeholder="SR123456789IN" />
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "UPDATING..." : "UPDATE ORDER ↗"}
      </button>
      {message && <p className="admin-form-message">{message}</p>}
    </form>
  );
}

export function CampaignForm() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await send("/api/admin/campaigns", "POST", {
        cityName: form.get("cityName"),
        slug: form.get("slug"),
        edition: form.get("edition"),
        campaignTitle: form.get("campaignTitle"),
        inspiration: form.get("inspiration"),
        backgroundImage: form.get("backgroundImage"),
        mobileBackgroundImage: form.get("mobileBackgroundImage") || null,
        accentColor: form.get("accentColor"),
        active: false,
      });
      setMessage("Campaign created in DRAFT state.");
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create campaign.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form-grid">
        <label>
          City
          <input name="cityName" required placeholder="Chennai" />
        </label>
        <label>
          Slug
          <input name="slug" required placeholder="chennai-edition" />
        </label>
        <label>
          Edition
          <input name="edition" required placeholder="001 / 100" />
        </label>
        <label>
          Campaign title
          <input name="campaignTitle" required placeholder="MARINA SIGNAL" />
        </label>
        <label>
          Desktop Background URL
          <input name="backgroundImage" type="url" required />
        </label>
        <label>
          Mobile Background URL
          <input name="mobileBackgroundImage" type="url" />
        </label>
        <label>
          Accent color
          <input name="accentColor" defaultValue="#e52b20" pattern="^#[0-9a-fA-F]{6}$" required />
        </label>
        <label style={{ gridColumn: "span 3" }}>
          Campaign copy
          <textarea name="inspiration" />
        </label>
      </div>
      <button type="submit" disabled={isSubmitting} style={{ width: "max-content" }}>
        {isSubmitting ? "CREATING..." : "CREATE CAMPAIGN DRAFT ↗"}
      </button>
      {message && <p className="admin-form-message">{message}</p>}
    </form>
  );
}
