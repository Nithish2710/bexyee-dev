"use client";

import { useState, useEffect } from "react";

export type SimpleInventoryCenterProps = {
  initialProducts?: Array<{
    id: string;
    name: string;
    sku: string;
    product_sizes?: Array<{ size: string; stock_quantity: number }>;
  }>;
};

type InventoryRow = {
  size: string;
  stock: number;
  threshold: number;
  status: "AVAILABLE" | "LOW_STOCK" | "SOLD_OUT";
};

export function SimpleInventoryCenter({ initialProducts = [] }: SimpleInventoryCenterProps) {
  const [productsList, setProductsList] = useState(initialProducts);
  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    const blr = initialProducts.find((p) => p.name.toLowerCase().includes("bengaluru") || p.sku.includes("BLR"));
    return blr?.id || initialProducts[0]?.id || "";
  });

  const [stockItems, setStockItems] = useState<InventoryRow[]>([
    { size: "S", stock: 20, threshold: 5, status: "AVAILABLE" },
    { size: "M", stock: 31, threshold: 5, status: "AVAILABLE" },
    { size: "L", stock: 4, threshold: 5, status: "LOW_STOCK" },
    { size: "XL", stock: 0, threshold: 5, status: "SOLD_OUT" },
  ]);

  // Adjust Modal State
  const [activeAdjustSize, setActiveAdjustSize] = useState<InventoryRow | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState("New production intake");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function notify(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }

  // Fetch real data
  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.products && data.products.length > 0) {
          setProductsList(data.products);
          const current = data.products.find((p: { id: string }) => p.id === selectedProductId) || data.products[0];
          if (current) {
            setSelectedProductId(current.id);
            if (current.product_sizes && current.product_sizes.length > 0) {
              setStockItems(
                current.product_sizes.map((s: { size: string; stock_quantity: number }) => {
                  const qty = s.stock_quantity || 0;
                  const status = qty === 0 ? "SOLD_OUT" : qty <= 5 ? "LOW_STOCK" : "AVAILABLE";
                  return { size: s.size, stock: qty, threshold: 5, status };
                })
              );
            }
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [selectedProductId]);

  const activeProduct = productsList.find((p) => p.id === selectedProductId) || productsList[0];
  const totalStock = stockItems.reduce((acc, s) => acc + s.stock, 0);

  async function handleSaveAdjustment(e: React.FormEvent) {
    e.preventDefault();
    if (!activeAdjustSize || adjustAmount === 0) return;

    setIsSubmitting(true);
    const newStock = Math.max(0, activeAdjustSize.stock + adjustAmount);

    try {
      await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId,
          size: activeAdjustSize.size,
          delta: adjustAmount,
          reason: adjustReason,
        }),
      });

      setStockItems((prev) =>
        prev.map((item) =>
          item.size === activeAdjustSize.size
            ? {
                ...item,
                stock: newStock,
                status: newStock === 0 ? "SOLD_OUT" : newStock <= item.threshold ? "LOW_STOCK" : "AVAILABLE",
              }
            : item
        )
      );

      notify(`✓ Size ${activeAdjustSize.size} stock updated to ${newStock} units.`);
      setActiveAdjustSize(null);
    } catch {
      notify("⚠ Failed to update inventory. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-stack" style={{ display: "grid", gap: "24px" }}>
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
            STOCK &amp; WAREHOUSE
          </span>
          <h1 style={{ fontSize: "24px", color: "#000000", margin: "4px 0 6px 0" }}>
            INVENTORY
          </h1>
          <p style={{ fontSize: "12.5px", color: "#555555", margin: 0 }}>
            Check real-time stock levels and make single or batch quantity adjustments.
          </p>
        </div>

        {productsList.length > 1 && (
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E5E5",
              color: "#000000",
              padding: "10px 16px",
              fontSize: "11px",
              fontFamily: "var(--font-space-mono)",
              cursor: "pointer",
            }}
          >
            {productsList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 2. SIMPLE STOCK OVERVIEW CARD (White Card) */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontSize: "18px", color: "#000000", margin: 0 }}>
              {activeProduct?.name || "Bengaluru Edition Heavyweight Tee"}
            </h2>
            <span style={{ fontSize: "11px", color: "#777777" }}>
              Total Available: <strong style={{ color: "#000000" }}>{totalStock} Units</strong>
            </span>
          </div>
        </div>

        {/* Clean Size Rows */}
        <div style={{ display: "grid", gap: "10px" }}>
          {stockItems.map((item) => (
            <div
              key={item.size}
              style={{
                background: "#F7F7F3",
                border: "1px solid #E5E5E5",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "#000000", width: "40px" }}>
                  {item.size}
                </span>

                <span style={{ fontSize: "20px", fontWeight: 700, color: "#000000", width: "60px" }}>
                  {item.stock}
                </span>

                <span
                  style={{
                    fontSize: "9.5px",
                    fontWeight: 700,
                    padding: "4px 8px",
                    background: item.status === "AVAILABLE" ? "#FFFFFF" : item.status === "LOW_STOCK" ? "#FFFFFF" : "#000000",
                    color: item.status === "AVAILABLE" ? "#000000" : item.status === "LOW_STOCK" ? "#E52B20" : "#FFFFFF",
                    border: `1px solid ${item.status === "LOW_STOCK" ? "#E52B20" : "#E5E5E5"}`,
                  }}
                >
                  {item.status === "AVAILABLE" ? "● AVAILABLE" : item.status === "LOW_STOCK" ? "⚠ LOW STOCK" : "■ SOLD OUT"}
                </span>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveAdjustSize(item);
                    setAdjustAmount(5);
                  }}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #000000",
                    color: "#000000",
                    padding: "8px 14px",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ADJUST STOCK ✎
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SIMPLE ADJUST MODAL */}
      {activeAdjustSize && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #000000",
            padding: "28px 32px",
            maxWidth: "480px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", color: "#000000", margin: 0 }}>
              Adjust Stock: Size {activeAdjustSize.size}
            </h3>
            <button
              type="button"
              onClick={() => setActiveAdjustSize(null)}
              style={{ background: "transparent", border: 0, color: "#777777", fontSize: "14px", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>

          <p style={{ fontSize: "12px", color: "#777777", margin: "0 0 20px 0" }}>
            Current stock: <strong style={{ color: "#000000" }}>{activeAdjustSize.stock} units</strong>.
          </p>

          <form onSubmit={handleSaveAdjustment} style={{ display: "grid", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "10px", color: "#777777", marginBottom: "8px", fontWeight: 700 }}>
                STOCK CHANGE
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setAdjustAmount((prev) => prev - 1)}
                  style={{ width: "36px", height: "36px", background: "#F7F7F3", border: "1px solid #E5E5E5", color: "#000000", fontSize: "16px", cursor: "pointer", fontWeight: 700 }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  style={{
                    width: "80px",
                    height: "36px",
                    background: "#FFFFFF",
                    border: "1px solid #E5E5E5",
                    color: "#000000",
                    textAlign: "center",
                    fontFamily: "var(--font-space-mono)",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setAdjustAmount((prev) => prev + 1)}
                  style={{ width: "36px", height: "36px", background: "#F7F7F3", border: "1px solid #E5E5E5", color: "#000000", fontSize: "16px", cursor: "pointer", fontWeight: 700 }}
                >
                  +
                </button>
                <span style={{ fontSize: "11px", color: "#777777" }}>
                  New total: <strong style={{ color: "#000000" }}>{Math.max(0, activeAdjustSize.stock + adjustAmount)}</strong>
                </span>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "10px", color: "#777777", marginBottom: "8px", fontWeight: 700 }}>
                REASON
              </label>
              <select
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#FFFFFF",
                  border: "1px solid #E5E5E5",
                  color: "#000000",
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "11px",
                }}
              >
                <option value="New production intake">New production intake / factory shipment</option>
                <option value="Inventory recount">Physical warehouse recount correction</option>
                <option value="Damaged or defective stock">Damaged or defective item removal</option>
                <option value="Studio sample withdrawal">Studio photo sample withdrawal</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button
                type="submit"
                disabled={isSubmitting || adjustAmount === 0}
                style={{
                  background: "#000000",
                  color: "#FFFFFF",
                  border: 0,
                  padding: "12px 20px",
                  fontSize: "11px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {isSubmitting ? "SAVING..." : "SAVE CHANGES"}
              </button>
              <button
                type="button"
                onClick={() => setActiveAdjustSize(null)}
                style={{
                  background: "transparent",
                  border: "1px solid #E5E5E5",
                  color: "#777777",
                  padding: "12px 16px",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. ADVANCED AUDIT DETAILS (White Card) */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "18px 24px" }}>
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          style={{
            background: "transparent",
            border: 0,
            color: "#777777",
            fontSize: "11px",
            cursor: "pointer",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>{showAdvanced ? "▼" : "▶"}</span>
          {showAdvanced ? "HIDE ADVANCED AUDIT DETAILS" : "SHOW ADVANCED AUDIT DETAILS"}
        </button>

        {showAdvanced && (
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #E5E5E5", fontSize: "11px", color: "#555555" }}>
            <p>
              Reservation Invariant: <code>Available Stock = max(0, Physical Stock − Active Cart Reservations)</code>.
            </p>
            <p>
              Stock reservations automatically release after 15 minutes of cart inactivity or upon checkout cancellation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
