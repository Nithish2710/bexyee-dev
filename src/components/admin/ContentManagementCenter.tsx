"use client";

import { useState } from "react";

type ContentType = "ARTICLES" | "STORIES" | "LOOKBOOK" | "FAQS" | "MILESTONES" | "ABOUT";

type ContentItem = {
  id: string;
  type: ContentType;
  title: string;
  categoryOrCity?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  lastEdited: string;
  excerpt?: string;
};

const INITIAL_CONTENT: ContentItem[] = [
  {
    id: "c1",
    type: "ARTICLES",
    title: "Engineering 320 GSM Super Loopknit: The Anatomy of Indian Heavyweight Cotton",
    categoryOrCity: "TEXTILE CRAFT",
    status: "PUBLISHED",
    lastEdited: "2026-08-23",
    excerpt: "Why standard single jersey fails Indian monsoons and humidity...",
  },
  {
    id: "c2",
    type: "ARTICLES",
    title: "Signal After Rain: Translating Bengaluru's Late-Night Monsoon into a Garment",
    categoryOrCity: "VISUAL IDENTITY",
    status: "PUBLISHED",
    lastEdited: "2026-08-23",
    excerpt: "The typography, coordinate patches, and reflective red accents that define Drop 001.",
  },
  {
    id: "c3",
    type: "STORIES",
    title: "The Midnight Cyclists of MG Road",
    categoryOrCity: "BENGALURU",
    status: "PUBLISHED",
    lastEdited: "2026-08-23",
    excerpt: "Documenting the fixed-gear and courier crew navigating Bangalore's arterial flyovers.",
  },
  {
    id: "c4",
    type: "STORIES",
    title: "Under the Bandra-Worli Sea Link",
    categoryOrCity: "MUMBAI",
    status: "PUBLISHED",
    lastEdited: "2026-08-23",
    excerpt: "Skate sessions against the salt air and monsoon mist beneath the concrete pillars.",
  },
  {
    id: "c5",
    type: "FAQS",
    title: "How many units are produced per city drop?",
    status: "PUBLISHED",
    lastEdited: "2026-08-23",
    excerpt: "Every BEXYEE city drop is strictly capped at exactly 100 individually numbered units.",
  },
  {
    id: "c6",
    type: "MILESTONES",
    title: "Zero-Slowness Progressive 3D Contract",
    categoryOrCity: "FRONTEND ENGINEERING",
    status: "PUBLISHED",
    lastEdited: "2026-08-23",
    excerpt: "Immediate 0ms photographic layer rendering with non-blocking WebGL background hydration.",
  },
];

export function ContentManagementCenter() {
  const [activeType, setActiveType] = useState<ContentType>("ARTICLES");
  const [items, setItems] = useState<ContentItem[]>(INITIAL_CONTENT);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [feedback, setFeedback] = useState("");

  const filteredItems = items.filter((i) => i.type === activeType);

  function handleStatusChange(id: string, newStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus, lastEdited: "2026-08-23" } : item))
    );
    setFeedback(`Item ${id} status updated to ${newStatus}.`);
  }

  function handleCreateNew() {
    const newItem: ContentItem = {
      id: `c_${Date.now().toString(36)}`,
      type: activeType,
      title: `New ${activeType.slice(0, -1)} Draft`,
      status: "DRAFT",
      lastEdited: new Date().toISOString().split("T")[0],
      excerpt: "Enter content overview...",
    };
    setItems((prev) => [newItem, ...prev]);
    setEditingItem(newItem);
    setFeedback(`New draft created in ${activeType}.`);
  }

  return (
    <div className="admin-stack">
      <div className="section-actions">
        <div>
          <h2>CONTENT &amp; EDITORIAL CMS</h2>
          <p>MANAGE ARTICLES, CITY STORIES, LOOKBOOK, FAQS, AND CRAFT MILESTONES</p>
        </div>
        <button
          onClick={handleCreateNew}
          style={{
            padding: "8px 16px",
            background: "#e52b20",
            color: "#fff",
            border: 0,
            fontSize: "9px",
            fontFamily: "var(--font-space-mono)",
            cursor: "pointer",
          }}
        >
          CREATE NEW ENTRY +
        </button>
      </div>

      {/* Sub tabs */}
      <div className="filter-row">
        {(["ARTICLES", "STORIES", "LOOKBOOK", "FAQS", "MILESTONES", "ABOUT"] as ContentType[]).map((tab) => (
          <button
            key={tab}
            className={activeType === tab ? "active" : ""}
            onClick={() => {
              setActiveType(tab);
              setEditingItem(null);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {feedback && <p className="admin-form-message" style={{ margin: "0 0 12px 0" }}>{feedback}</p>}

      {/* Content table */}
      <div className="order-table">
        <div className="order-row" style={{ fontWeight: 700, gridTemplateColumns: "2fr 1fr 100px 100px 120px" }}>
          <span>TITLE / TOPIC</span>
          <span>CATEGORY / CITY</span>
          <span>LAST EDITED</span>
          <span>STATUS</span>
          <span>ACTIONS</span>
        </div>

        {filteredItems.map((item) => (
          <div key={item.id} className="order-row" style={{ gridTemplateColumns: "2fr 1fr 100px 100px 120px" }}>
            <div>
              <strong style={{ display: "block", fontSize: "12px", color: "#131313" }}>{item.title}</strong>
              <small style={{ color: "#77736d", fontSize: "10px" }}>{item.excerpt}</small>
            </div>
            <span>{item.categoryOrCity || "GENERAL"}</span>
            <span style={{ fontSize: "10px" }}>{item.lastEdited}</span>
            <span className={`status-pill ${item.status === "PUBLISHED" ? "live" : ""}`}>
              {item.status}
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              {item.status === "DRAFT" ? (
                <button
                  onClick={() => handleStatusChange(item.id, "PUBLISHED")}
                  style={{ border: 0, background: "transparent", color: "#e52b20", fontSize: "9px", fontFamily: "var(--font-space-mono)", cursor: "pointer" }}
                >
                  PUBLISH ↗
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange(item.id, "DRAFT")}
                  style={{ border: 0, background: "transparent", color: "#77736d", fontSize: "9px", fontFamily: "var(--font-space-mono)", cursor: "pointer" }}
                >
                  UNPUBLISH
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Edit Drawer */}
      {editingItem && (
        <div className="security-card" style={{ marginTop: "20px", background: "#f8f6f1", border: "1px solid #d6d1c9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ margin: 0, fontSize: "13px", fontFamily: "var(--font-space-mono)" }}>
              EDITING: {editingItem.title}
            </h3>
            <button onClick={() => setEditingItem(null)} style={{ border: 0, background: "transparent", cursor: "pointer" }}>
              ✕
            </button>
          </div>
          <div style={{ display: "grid", gap: "10px" }}>
            <input
              type="text"
              value={editingItem.title}
              onChange={(e) => {
                const val = e.target.value;
                setEditingItem((prev) => (prev ? { ...prev, title: val } : null));
              }}
              placeholder="Title..."
              style={{ padding: "8px", fontSize: "12px" }}
            />
            <textarea
              value={editingItem.excerpt || ""}
              onChange={(e) => {
                const val = e.target.value;
                setEditingItem((prev) => (prev ? { ...prev, excerpt: val } : null));
              }}
              rows={4}
              placeholder="Content markdown..."
              style={{ padding: "8px", fontSize: "12px" }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => {
                  setItems((prev) => prev.map((i) => (i.id === editingItem.id ? { ...editingItem } : i)));
                  setEditingItem(null);
                  setFeedback("Changes saved to draft.");
                }}
                style={{ padding: "8px 14px", background: "#e52b20", color: "#fff", border: 0, fontSize: "9px", fontFamily: "var(--font-space-mono)", cursor: "pointer" }}
              >
                SAVE DRAFT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
