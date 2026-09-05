"use client";

import { useEffect, useState } from "react";
import type { ThemeConfig } from "../../lib/product-engine";

export function ThemeCenter() {
  const [themes, setThemes] = useState<ThemeConfig[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [accentColor, setAccentColor] = useState("#e52b20");
  const [backgroundColor, setBackgroundColor] = useState("#0b0b0a");
  const [typographyPreset, setTypographyPreset] = useState("MODERNIST_CONDENSED");
  const [atmosphericEffect, setAtmosphericEffect] = useState("NEON_RAIN");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadThemes() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/themes");
      if (res.ok) {
        const data = await res.json();
        setThemes(data.themes || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load themes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/themes")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.themes) setThemes(data.themes);
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof Error ? err.message : "Failed to load themes.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleCreateTheme(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          accentColor,
          backgroundColor,
          typographyPreset,
          atmosphericEffect,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create theme.");

      setShowForm(false);
      setName("");
      setSlug("");
      await loadThemes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating theme.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-stack" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <span style={{ fontSize: "9px", color: "#8d8982", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            THEME ENGINE &amp; DESIGN SYSTEM CONFIGURATION
          </span>
          <h2 style={{ margin: "2px 0 0 0", fontSize: "18px", color: "#fff" }}>
            Product Themes &amp; Atmospheric Presets
          </h2>
          <p style={{ fontSize: "11px", color: "#888", margin: "4px 0 0 0" }}>
            Themes are pure safe configuration (colors, presets). They control how experience components render without arbitrary code risk.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          style={{ background: showForm ? "#222" : "#e52b20", color: "#fff", border: 0, fontSize: "11px", fontWeight: 700, padding: "10px 18px", cursor: "pointer" }}
        >
          {showForm ? "✕ CLOSE FORM" : "+ CONFIGURE NEW THEME"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "10px 14px", background: "rgba(229, 43, 32, 0.15)", border: "1px solid #e52b20", color: "#ff8580", fontSize: "11px" }}>
          ⚠ {error}
        </div>
      )}

      {/* Creation Modal */}
      {showForm && (
        <form onSubmit={handleCreateTheme} style={{ background: "#11110f", border: "1px solid #333", padding: "24px", borderRadius: "4px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#fff" }}>ADD DESIGN THEME</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            <label>
              Theme Name *
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                }}
                placeholder="e.g. Cyber Dusk Chennai"
                required
              />
            </label>

            <label>
              Slug *
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="chennai-cyber-dusk" required />
            </label>

            <label>
              Accent Color *
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ width: "40px", height: "36px", padding: 0, border: 0, cursor: "pointer" }} />
                <input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ flex: 1 }} />
              </div>
            </label>

            <label>
              Background Color *
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} style={{ width: "40px", height: "36px", padding: 0, border: 0, cursor: "pointer" }} />
                <input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} style={{ flex: 1 }} />
              </div>
            </label>

            <label>
              Typography Preset
              <select value={typographyPreset} onChange={(e) => setTypographyPreset(e.target.value)}>
                <option value="MODERNIST_CONDENSED">Modernist Condensed (Default)</option>
                <option value="EDITORIAL_SERIF">Editorial High-Fashion Serif</option>
                <option value="MONOSPACE_INDUSTRIAL">Monospace Industrial Grid</option>
                <option value="MINIMAL_GEO">Minimal Geometric Sans</option>
              </select>
            </label>

            <label>
              Atmospheric Effect
              <select value={atmosphericEffect} onChange={(e) => setAtmosphericEffect(e.target.value)}>
                <option value="NEON_RAIN">Neon Rain (Bengaluru Standard)</option>
                <option value="NOCTURNAL_HAZE">Nocturnal Haze (Coastal / Sea Link)</option>
                <option value="MONOCHROME_GRID">Monochrome Industrial Grid</option>
                <option value="DUSK_GRADIENT">Dusk Gradient (Sunset Alleyways)</option>
              </select>
            </label>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" disabled={isSubmitting} style={{ background: "#e52b20", color: "#fff", border: 0, padding: "10px 20px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
              {isSubmitting ? "SAVING..." : "SAVE THEME CONFIGURATION ↗"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{ background: "transparent", border: "1px solid #444", color: "#aaa", padding: "10px 16px", fontSize: "11px", cursor: "pointer" }}>
              CANCEL
            </button>
          </div>
        </form>
      )}

      {/* Themes Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {loading ? (
          <p style={{ fontSize: "11px", color: "#666" }}>Loading themes...</p>
        ) : (
          themes.map((t) => (
            <div key={t.slug} style={{ background: t.backgroundColor || "#111", border: "1px solid #282826", padding: "20px", borderRadius: "2px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "9px", color: t.accentColor || "#e52b20", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>
                  {t.slug}
                </span>
                <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: t.accentColor || "#e52b20", display: "inline-block", border: "1px solid #fff" }} />
              </div>

              <h3 style={{ margin: 0, fontSize: "16px", color: "#fff" }}>{t.name}</h3>

              <div style={{ fontSize: "10px", color: "#aaa", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div>Typography: <strong style={{ color: "#fff" }}>{t.typographyPreset}</strong></div>
                <div>Atmosphere: <strong style={{ color: "#fff" }}>{t.atmosphericEffect}</strong></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
