"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductWizard } from "./ProductWizard";

export type SimpleProductsCenterProps = {
  initialProducts?: Array<{
    id: string;
    name: string;
    slug?: string;
    sku: string;
    status: string;
    price_paise: number;
    city_name?: string;
    edition?: string;
    experience_type?: string;
    is_prebook?: boolean;
    product_sizes?: Array<{ size: string; stock_quantity: number }>;
    front_image_url?: string;
  }>;
  onManageProduct?: (productId: string) => void;
  onPreviewProduct?: (productId: string) => void;
};

function formatPrice(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export function SimpleProductsCenter({
  initialProducts = [],
  onManageProduct,
  onPreviewProduct,
}: SimpleProductsCenterProps) {
  const [showWizard, setShowWizard] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "LIVE" | "DRAFT" | "SOLD_OUT">("ALL");
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function notify(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }

  async function loadProducts() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch {
      notify("⚠ Failed to refresh products from API.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const [confirmUnpublishProduct, setConfirmUnpublishProduct] = useState<typeof products[0] | null>(null);
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<typeof products[0] | null>(null);

  async function handleExecuteDelete(product: typeof products[0]) {
    try {
      const res = await fetch(`/api/admin/products?id=${product.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        notify(`✓ ${product.name || "Product"} permanently removed from active catalog`);
      } else {
        const errData = await res.json().catch(() => ({}));
        notify(`⚠ Failed to delete: ${errData.error || "Please try again."}`);
      }
    } catch {
      notify("⚠ Network error while deleting product.");
    } finally {
      setConfirmDeleteProduct(null);
    }
  }

  async function handleExecuteUnpublish(product: typeof products[0]) {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, status: "DRAFT" }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, status: "DRAFT" } : p))
        );
        notify(`✓ ${product.name || "Product"} unpublished`);
      } else {
        notify("⚠ Failed to unpublish product. Please try again.");
      }
    } catch {
      notify("⚠ Network error while unpublishing. Please try again.");
    } finally {
      setConfirmUnpublishProduct(null);
    }
  }

  async function handleTogglePublish(product: typeof products[0]) {
    if (product.status === "ACTIVE") {
      setConfirmUnpublishProduct(product);
      return;
    }

    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, status: "ACTIVE" }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, status: "ACTIVE" } : p))
        );
        notify(`✓ ${product.name || "Product"} published live`);
      } else {
        notify("⚠ Failed to publish product.");
      }
    } catch {
      notify("⚠ Network error while publishing.");
    }
  }

  const filteredProducts = products.filter((p) => {
    const totalStock = (p.product_sizes || []).reduce((acc, s) => acc + (s.stock_quantity || 0), 0);
    const matchesSearch =
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.city_name || "").toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "LIVE") return p.status === "ACTIVE";
    if (filter === "DRAFT") return p.status === "DRAFT";
    if (filter === "SOLD_OUT") return totalStock === 0;
    return true;
  });

  return (
    <div className="admin-stack" style={{ display: "grid", gap: "24px" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            padding: "12px 18px",
            background: "#F7F7F3",
            border: "1px solid #000000",
            color: "#000000",
            fontSize: "11.5px",
            fontWeight: 700,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Unpublish Confirmation Modal */}
      {confirmUnpublishProduct && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              border: "2px solid #000000",
              maxWidth: "480px",
              width: "100%",
              padding: "32px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ fontSize: "10px", color: "#DC2626", letterSpacing: "0.14em", fontWeight: 800 }}>
              CONFIRM LIFECYCLE CHANGE
            </span>
            <h3 style={{ fontSize: "20px", color: "#000000", margin: "8px 0 12px 0" }}>
              Unpublish {confirmUnpublishProduct.name || "Product"}?
            </h3>
            <p style={{ fontSize: "12px", color: "#666666", lineHeight: 1.6, margin: "0 0 24px 0" }}>
              Customers will no longer be able to access the live product on the storefront or via direct URLs.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setConfirmUnpublishProduct(null)}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E5E5",
                  color: "#000000",
                  padding: "10px 18px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => handleExecuteUnpublish(confirmUnpublishProduct)}
                style={{
                  background: "#DC2626",
                  border: "1px solid #DC2626",
                  color: "#FFFFFF",
                  padding: "10px 20px",
                  fontSize: "11px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                UNPUBLISH
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteProduct && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              border: "2px solid #E52B20",
              maxWidth: "500px",
              width: "100%",
              padding: "32px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            }}
          >
            <span style={{ fontSize: "10px", color: "#E52B20", letterSpacing: "0.14em", fontWeight: 800 }}>
              DANGER // PERMANENT ACTION
            </span>
            <h3 style={{ fontSize: "20px", color: "#000000", margin: "8px 0 12px 0" }}>
              Delete {confirmDeleteProduct.name || "Product"}?
            </h3>
            <p style={{ fontSize: "12.5px", color: "#444444", lineHeight: 1.6, margin: "0 0 16px 0" }}>
              This product will be permanently removed from the active catalog and instantly hidden from all customer storefront pages.
            </p>
            <p style={{ fontSize: "11px", color: "#777777", background: "#F7F7F3", padding: "10px 14px", border: "1px solid #E5E5E5", margin: "0 0 24px 0" }}>
              ℹ If historical customer orders exist for this product, it will be safely archived to preserve invoices and financial audits with <strong>zero storefront visibility</strong>.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                type="button"
                id="cancel-delete-modal-btn"
                onClick={() => setConfirmDeleteProduct(null)}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E5E5",
                  color: "#000000",
                  padding: "10px 18px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                CANCEL
              </button>
              <button
                type="button"
                id="confirm-delete-modal-btn"
                onClick={() => handleExecuteDelete(confirmDeleteProduct)}
                style={{
                  background: "#E52B20",
                  border: "1px solid #E52B20",
                  color: "#FFFFFF",
                  padding: "10px 22px",
                  fontSize: "11px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                PERMANENTLY DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. HEADER (White Surface) */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E5E5E5",
          padding: "28px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <span style={{ fontSize: "10px", color: "#777777", letterSpacing: ".16em", fontWeight: 700 }}>
            CATALOG &amp; DROPS
          </span>
          <h1 style={{ fontSize: "24px", color: "#000000", margin: "4px 0 6px 0" }}>
            PRODUCTS
          </h1>
          <p style={{ fontSize: "12.5px", color: "#555555", margin: 0 }}>
            Manage your city drops, pricing, inventory, and storefront experience.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            disabled={isLoading}
            onClick={loadProducts}
            style={{
              background: "#F7F7F3",
              color: "#000000",
              border: "1px solid #E5E5E5",
              padding: "12px 18px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: isLoading ? "wait" : "pointer",
            }}
          >
            {isLoading ? "↻ SYNCING..." : "↻ SYNC API"}
          </button>

          <button
            type="button"
            onClick={() => setShowWizard(true)}
            style={{
              background: "#000000",
              color: "#FFFFFF",
              border: 0,
              padding: "12px 24px",
              fontSize: "11.5px",
              fontWeight: 800,
              cursor: "pointer",
              letterSpacing: ".08em",
            }}
          >
            + CREATE PRODUCT
          </button>
        </div>
      </div>

      {/* 2. PRODUCT WIZARD (WHEN OPEN) */}
      {showWizard && (
        <ProductWizard
          onCreated={() => {
            setShowWizard(false);
            notify("✓ New product drop created successfully.");
            loadProducts();
          }}
          onCancel={() => setShowWizard(false)}
        />
      )}

      {/* 3. FILTER BAR */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E5E5E5",
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {(
            [
              { id: "ALL", label: "All Products" },
              { id: "LIVE", label: "● Live" },
              { id: "DRAFT", label: "◌ Draft" },
              { id: "SOLD_OUT", label: "■ Sold Out" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              style={{
                background: filter === t.id ? "#000000" : "#F7F7F3",
                border: "1px solid #E5E5E5",
                color: filter === t.id ? "#FFFFFF" : "#000000",
                padding: "8px 14px",
                fontSize: "10.5px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product, city, or SKU..."
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E5E5",
            color: "#000000",
            padding: "8px 14px",
            fontSize: "11px",
            minWidth: "240px",
            fontFamily: "var(--font-space-mono)",
          }}
        />
      </div>

      {/* 4. PRODUCT CARDS GRID */}
      {filteredProducts.length === 0 ? (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px dashed #CCCCCC",
            padding: "48px 24px",
            textAlign: "center",
            color: "#777777",
          }}
        >
          <p style={{ fontSize: "14px", color: "#000000", margin: "0 0 8px 0" }}>No products match this filter.</p>
          <button
            type="button"
            onClick={() => {
              setFilter("ALL");
              setSearch("");
            }}
            style={{ background: "#F7F7F3", border: "1px solid #E5E5E5", color: "#000000", padding: "8px 16px", fontSize: "10px", cursor: "pointer", fontWeight: 700 }}
          >
            RESET FILTERS
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {filteredProducts.map((p) => {
            const totalStock = (p.product_sizes || []).reduce((acc, s) => acc + (s.stock_quantity || 0), 0);
            const isLive = p.status === "ACTIVE";
            const exp = p.experience_type || "CITY_3D";

            return (
              <div
                key={p.id}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E5E5",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "border-color 0.2s ease",
                }}
              >
                {/* Visual Thumbnail Area */}
                <div
                  style={{
                    height: "180px",
                    background: "#F7F7F3",
                    borderBottom: "1px solid #E5E5E5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        padding: "3px 8px",
                        background: isLive ? "#000000" : "#FFFFFF",
                        color: isLive ? "#FFFFFF" : "#000000",
                        border: "1px solid #E5E5E5",
                      }}
                    >
                      {isLive ? "● LIVE" : "◌ DRAFT"}
                    </span>

                    {(p as { is_prebook?: boolean }).is_prebook && (
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          padding: "3px 8px",
                          background: "#FFFFFF",
                          color: "#E52B20",
                          border: "1px solid #E52B20",
                        }}
                      >
                        PRE-BOOK ACTIVE
                      </span>
                    )}
                  </div>

                  <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                    <span style={{ fontSize: "9px", color: "#777777", background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "3px 6px" }}>
                      {exp}
                    </span>
                  </div>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.front_image_url || "/assets/products/bengaluru-tee-front.svg"}
                    alt={p.name}
                    style={{ maxHeight: "140px", maxWidth: "80%", objectFit: "contain" }}
                  />
                </div>

                {/* Info Area */}
                <div style={{ padding: "20px" }}>
                  <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".12em", fontWeight: 700 }}>
                    {p.city_name || "BENGALURU"} • {p.edition || "DROP 001"}
                  </span>
                  <h3 style={{ fontSize: "17px", color: "#000000", margin: "4px 0 10px 0", lineHeight: 1.2 }}>
                    {p.name}
                  </h3>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#777777", borderTop: "1px solid #F0F0EE", paddingTop: "12px" }}>
                    <span>Price: <strong style={{ color: "#000000" }}>{formatPrice(p.price_paise)}</strong></span>
                    <span>Stock: <strong style={{ color: "#000000" }}>{totalStock} units</strong></span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div
                  style={{
                    padding: "14px 20px",
                    background: "#F7F7F3",
                    borderTop: "1px solid #E5E5E5",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Link
                    href={`/admin/products/${p.slug || p.id || (p.sku?.toLowerCase().includes("blr") ? "bengaluru-tee" : "bengaluru")}`}
                    onClick={(e) => {
                      if (onManageProduct) {
                        e.preventDefault();
                        onManageProduct(p.slug || p.id || "bengaluru-tee");
                      }
                    }}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E5E5E5",
                      color: "#000000",
                      padding: "8px 14px",
                      fontSize: "10px",
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                  >
                    MANAGE ✎
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleTogglePublish(p)}
                    style={{
                      background: "transparent",
                      border: "1px solid #E5E5E5",
                      color: isLive ? "#DC2626" : "#000000",
                      padding: "8px 12px",
                      fontSize: "10px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {isLive ? "UNPUBLISH" : "PUBLISH"}
                  </button>

                  <Link
                    href={`/product/${p.slug || (p.sku?.toLowerCase().includes("blr") ? "bengaluru-tee" : p.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: isLive ? "#000000" : "#F7F7F3",
                      color: isLive ? "#FFFFFF" : "#000000",
                      border: "1px solid #E5E5E5",
                      padding: "8px 12px",
                      fontSize: "10px",
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    {isLive ? "VIEW STOREFRONT ↗" : "VIEW PREVIEW ↗"}
                  </Link>

                  <button
                    type="button"
                    id={`delete-btn-${p.id}`}
                    data-testid={`delete-btn-${p.id}`}
                    onClick={() => setConfirmDeleteProduct(p)}
                    style={{
                      background: "#FFF1F0",
                      border: "1px solid #FFA39E",
                      color: "#E52B20",
                      padding: "8px 12px",
                      fontSize: "10px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                    title="Permanently remove or safely archive product"
                  >
                    DELETE ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
