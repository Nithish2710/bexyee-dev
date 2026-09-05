"use client";

import { useState } from "react";
import type { CityCampaign } from "../../../app/page";

export function CampaignDraftEditor({
  initialCampaign,
  onDraftSaved,
}: {
  initialCampaign: CityCampaign;
  onDraftSaved?: (updated: CityCampaign) => void;
}) {
  const [form, setForm] = useState<CityCampaign>(initialCampaign);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage("");

    try {
      const response = await fetch("/api/admin/campaigns/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: form.productId || "00000000-0000-0000-0000-000000000001",
          cityName: form.cityName,
          campaignTitle: form.campaignTitle,
          edition: form.edition,
          productName: form.productName,
          price: form.price,
          compareAtPrice: form.compareAtPrice,
          fabric: form.fabric,
          gsm: form.gsm,
          fit: form.fit,
          inspiration: form.inspiration,
          accentColor: form.accentColor,
          backgroundImage: form.backgroundImage,
          mobileBackgroundImage: form.mobileBackgroundImage,
          productModel: form.productModel,
          frontImage: form.frontImage,
          backImage: form.backImage,
          leftSleeveImage: form.leftSleeveImage,
          rightSleeveImage: form.rightSleeveImage,
          printImage: form.printImage,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to save draft.");

      setStatusMessage("DRAFT SAVED • NOT VISIBLE ON LIVE STORE");
      if (onDraftSaved) onDraftSaved(form);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : "Failed to save draft.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSave}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div>
          <h2 style={{ fontSize: "12px", fontFamily: "var(--font-space-mono)", margin: 0 }}>
            DRAFT CAMPAIGN CONFIGURATION
          </h2>
          <span style={{ fontSize: "10px", color: "#77736d" }}>
            Edits here remain in staging/draft and will NOT affect the live store until explicitly published.
          </span>
        </div>
        <button type="submit" disabled={isSaving} style={{ padding: "8px 16px", background: "#e52b20", color: "#fff", border: 0, fontSize: "9px", fontFamily: "var(--font-space-mono)", cursor: "pointer" }}>
          {isSaving ? "SAVING DRAFT..." : "SAVE DRAFT ↗"}
        </button>
      </div>

      {statusMessage && (
        <p className="admin-form-message" style={{ margin: "0 0 10px 0", color: "#477044", background: "#e8f2e6", padding: "8px" }}>
          {statusMessage}
        </p>
      )}

      <fieldset style={{ border: "1px solid #d6d1c9", padding: "16px", background: "#fffdfa" }}>
        <legend style={{ fontSize: "10px", fontFamily: "var(--font-space-mono)", padding: "0 8px" }}>
          PRODUCT &amp; PRICING
        </legend>
        <div className="admin-form-grid">
          <label>
            Product Name
            <input
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              required
            />
          </label>
          <label>
            Price (INR)
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              required
            />
          </label>
          <label>
            Compare-At Price
            <input
              type="number"
              value={form.compareAtPrice || 0}
              onChange={(e) => setForm({ ...form, compareAtPrice: Number(e.target.value) })}
            />
          </label>
          <label>
            Fabric
            <input
              value={form.fabric || ""}
              onChange={(e) => setForm({ ...form, fabric: e.target.value })}
            />
          </label>
          <label>
            GSM
            <input
              type="number"
              value={form.gsm || 320}
              onChange={(e) => setForm({ ...form, gsm: Number(e.target.value) })}
            />
          </label>
          <label>
            Fit
            <input
              value={form.fit || ""}
              onChange={(e) => setForm({ ...form, fit: e.target.value })}
            />
          </label>
        </div>
      </fieldset>

      <fieldset style={{ border: "1px solid #d6d1c9", padding: "16px", background: "#fffdfa" }}>
        <legend style={{ fontSize: "10px", fontFamily: "var(--font-space-mono)", padding: "0 8px" }}>
          CAMPAIGN THEME &amp; ASSETS
        </legend>
        <div className="admin-form-grid">
          <label>
            City Name
            <input
              value={form.cityName}
              onChange={(e) => setForm({ ...form, cityName: e.target.value })}
              required
            />
          </label>
          <label>
            Campaign Title
            <input
              value={form.campaignTitle}
              onChange={(e) => setForm({ ...form, campaignTitle: e.target.value })}
              required
            />
          </label>
          <label>
            Edition
            <input
              value={form.edition}
              onChange={(e) => setForm({ ...form, edition: e.target.value })}
              required
            />
          </label>
          <label>
            Accent Color Hex
            <input
              value={form.accentColor}
              pattern="^#[0-9a-fA-F]{6}$"
              onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
              required
            />
          </label>
          <label>
            Desktop Background Artwork URL
            <input
              type="url"
              value={form.backgroundImage}
              onChange={(e) => setForm({ ...form, backgroundImage: e.target.value })}
              required
            />
          </label>
          <label>
            Mobile Background Artwork URL
            <input
              type="url"
              value={form.mobileBackgroundImage || ""}
              onChange={(e) => setForm({ ...form, mobileBackgroundImage: e.target.value })}
            />
          </label>
          <label style={{ gridColumn: "span 3" }}>
            Campaign Inspiration Copy
            <textarea
              value={form.inspiration}
              onChange={(e) => setForm({ ...form, inspiration: e.target.value })}
            />
          </label>
        </div>
      </fieldset>

      <fieldset style={{ border: "1px solid #d6d1c9", padding: "16px", background: "#fffdfa" }}>
        <legend style={{ fontSize: "10px", fontFamily: "var(--font-space-mono)", padding: "0 8px" }}>
          NAMED VISUAL SLOTS
        </legend>
        <div className="admin-form-grid">
          <label>
            Hero 3D Model URL (GLB)
            <input
              type="url"
              value={form.productModel || ""}
              onChange={(e) => setForm({ ...form, productModel: e.target.value })}
              placeholder="https://.../garment.glb"
            />
          </label>
          <label>
            Front View Photo URL
            <input
              value={form.frontImage || ""}
              onChange={(e) => setForm({ ...form, frontImage: e.target.value })}
            />
          </label>
          <label>
            Back View Photo URL
            <input
              value={form.backImage || ""}
              onChange={(e) => setForm({ ...form, backImage: e.target.value })}
            />
          </label>
          <label>
            Left Sleeve Photo URL
            <input
              value={form.leftSleeveImage || ""}
              onChange={(e) => setForm({ ...form, leftSleeveImage: e.target.value })}
            />
          </label>
          <label>
            Right Sleeve Photo URL
            <input
              value={form.rightSleeveImage || ""}
              onChange={(e) => setForm({ ...form, rightSleeveImage: e.target.value })}
            />
          </label>
          <label>
            Print Macro Photo URL
            <input
              value={form.printImage || ""}
              onChange={(e) => setForm({ ...form, printImage: e.target.value })}
            />
          </label>
        </div>
      </fieldset>
    </form>
  );
}
