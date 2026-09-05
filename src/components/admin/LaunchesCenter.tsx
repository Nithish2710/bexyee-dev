"use client";

import { useEffect, useState } from "react";

export type LaunchItem = {
  id: string;
  name: string;
  slug: string;
  status: "DRAFT" | "READY" | "SCHEDULED" | "LIVE" | "PAUSED" | "ENDED" | "ARCHIVED";
  launch_at?: string;
  end_at?: string;
  urgency_badge?: string;
  countdown_enabled: boolean;
  product_id: string;
  created_at: string;
  products?: { name: string; sku: string; city_name: string; price_paise: number };
};

export function LaunchesCenter({ products }: { products: Array<{ id: string; name: string; sku: string }> }) {
  const [launches, setLaunches] = useState<LaunchItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [status, setStatus] = useState<LaunchItem["status"]>("SCHEDULED");
  const [launchAt, setLaunchAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [urgencyBadge, setUrgencyBadge] = useState("LIMITED FIRST RUN");
  const [countdownEnabled, setCountdownEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadLaunches() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/launches");
      if (res.ok) {
        const data = await res.json();
        setLaunches(data.launches || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load launches.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/launches")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.launches) setLaunches(data.launches);
      })
      .catch((err) => {
        if (isMounted) setError(err instanceof Error ? err.message : "Failed to load launches.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleCreateLaunch(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/launches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          name,
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          status,
          launchAt: launchAt ? new Date(launchAt).toISOString() : null,
          endAt: endAt ? new Date(endAt).toISOString() : null,
          urgencyBadge,
          countdownEnabled,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create launch.");

      setShowForm(false);
      setName("");
      setSlug("");
      await loadLaunches();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating launch.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusToggle(launchId: string, currentStatus: LaunchItem["status"]) {
    const nextStatus: LaunchItem["status"] = currentStatus === "LIVE" ? "PAUSED" : "LIVE";
    try {
      const res = await fetch("/api/admin/launches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: launchId, status: nextStatus }),
      });
      if (res.ok) {
        await loadLaunches();
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="admin-stack" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <span style={{ fontSize: "9px", color: "#8d8982", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            LAUNCH ENGINE &amp; DROP SCHEDULER
          </span>
          <h2 style={{ margin: "2px 0 0 0", fontSize: "18px", color: "#fff" }}>
            Product Launches &amp; Timed Drops
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          style={{
            background: showForm ? "#222" : "#e52b20",
            color: "#fff",
            border: 0,
            fontSize: "11px",
            fontWeight: 700,
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          {showForm ? "✕ CLOSE FORM" : "+ SCHEDULE NEW LAUNCH"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "10px 14px", background: "rgba(229, 43, 32, 0.15)", border: "1px solid #e52b20", color: "#ff8580", fontSize: "11px" }}>
          ⚠ {error}
        </div>
      )}

      {/* Launch Creation Modal / Form */}
      {showForm && (
        <form onSubmit={handleCreateLaunch} style={{ background: "#11110f", border: "1px solid #333", padding: "24px", borderRadius: "4px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#fff", letterSpacing: "0.04em" }}>
            SCHEDULE PRODUCT LAUNCH
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            <label>
              Target Product *
              <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Launch Name *
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                }}
                placeholder="e.g. Bengaluru Drop 001 Midnight"
                required
              />
            </label>

            <label>
              Launch Slug *
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="bengaluru-drop-001" required />
            </label>

            <label>
              Initial Status
              <select value={status} onChange={(e) => setStatus(e.target.value as LaunchItem["status"])}>
                <option value="SCHEDULED">SCHEDULED (Countdown Active)</option>
                <option value="LIVE">LIVE (Instant Open)</option>
                <option value="DRAFT">DRAFT (Hidden)</option>
              </select>
            </label>

            <label>
              Launch Date &amp; Time (IST)
              <input type="datetime-local" value={launchAt} onChange={(e) => setLaunchAt(e.target.value)} />
            </label>

            <label>
              End Date &amp; Time (Optional)
              <input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
            </label>

            <label>
              Urgency / Scarcity Badge
              <input type="text" value={urgencyBadge} onChange={(e) => setUrgencyBadge(e.target.value)} placeholder="LIMITED FIRST RUN" />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "24px" }}>
              <input type="checkbox" checked={countdownEnabled} onChange={(e) => setCountdownEnabled(e.target.checked)} />
              <span style={{ fontSize: "11px", color: "#ddd" }}>Enable Real-Time Countdown Clock</span>
            </label>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ background: "#e52b20", color: "#fff", border: 0, padding: "10px 20px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
            >
              {isSubmitting ? "CREATING..." : "COMMIT SCHEDULE ↗"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{ background: "transparent", border: "1px solid #444", color: "#aaa", padding: "10px 16px", fontSize: "11px", cursor: "pointer" }}
            >
              CANCEL
            </button>
          </div>
        </form>
      )}

      {/* Launches List */}
      <div style={{ background: "#0e0e0d", border: "1px solid #242422", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "11px" }}>
          <thead>
            <tr style={{ background: "#141412", borderBottom: "1px solid #282826", color: "#8d8982" }}>
              <th style={{ padding: "12px 16px" }}>LAUNCH</th>
              <th style={{ padding: "12px" }}>PRODUCT</th>
              <th style={{ padding: "12px" }}>LAUNCH TIME</th>
              <th style={{ padding: "12px" }}>BADGE</th>
              <th style={{ padding: "12px" }}>STATUS</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: "24px", textAlign: "center", color: "#666" }}>
                  Loading launch schedules...
                </td>
              </tr>
            ) : launches.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "24px", textAlign: "center", color: "#666" }}>
                  No launches scheduled yet. Create your first launch drop above.
                </td>
              </tr>
            ) : (
              launches.map((l) => (
                <tr key={l.id} style={{ borderBottom: "1px solid #1a1a18" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <strong style={{ color: "#fff", display: "block" }}>{l.name}</strong>
                    <small style={{ color: "#777" }}>slug: {l.slug}</small>
                  </td>
                  <td style={{ padding: "12px", color: "#ddd" }}>
                    {l.products?.name ?? l.product_id.slice(0, 8)}
                    <small style={{ display: "block", color: "#777" }}>{l.products?.sku}</small>
                  </td>
                  <td style={{ padding: "12px", color: "#aaa" }}>
                    {l.launch_at ? new Date(l.launch_at).toLocaleString() : "IMMEDIATE"}
                  </td>
                  <td style={{ padding: "12px", color: "#e52b20", fontWeight: 700 }}>
                    {l.urgency_badge || "—"}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "2px",
                        background:
                          l.status === "LIVE"
                            ? "rgba(74, 222, 128, 0.15)"
                            : l.status === "SCHEDULED"
                            ? "rgba(245, 158, 11, 0.15)"
                            : "#222",
                        color:
                          l.status === "LIVE"
                            ? "#4ade80"
                            : l.status === "SCHEDULED"
                            ? "#f59e0b"
                            : "#aaa",
                      }}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(l.id, l.status)}
                      style={{ background: "#1a1a18", border: "1px solid #333", color: "#fff", fontSize: "9.5px", padding: "4px 10px", cursor: "pointer" }}
                    >
                      {l.status === "LIVE" ? "PAUSE DROP" : "GO LIVE ↗"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
