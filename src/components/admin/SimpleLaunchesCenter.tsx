"use client";

import { useState } from "react";
import Link from "next/link";

export type SimpleLaunchesCenterProps = {
  initialStatus?: "DRAFT" | "READY" | "SCHEDULED" | "LIVE" | "PAUSED" | "ENDED";
};

export function SimpleLaunchesCenter({ initialStatus = "LIVE" }: SimpleLaunchesCenterProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isPaused, setIsPaused] = useState(initialStatus === "PAUSED");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("2026-09-01T18:00");
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function notify(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }

  const steps = [
    { id: "DRAFT", label: "DRAFT", desc: "Private preview" },
    { id: "READY", label: "READY", desc: "Configuration complete" },
    { id: "SCHEDULED", label: "SCHEDULED", desc: "Public countdown active" },
    { id: "LIVE", label: "● LIVE", desc: "Purchasable by customers" },
    { id: "ENDED", label: "ENDED", desc: "Drop closed / archived" },
  ];

  async function handleTogglePause() {
    if (!isPaused) {
      setShowPauseConfirm(true);
    } else {
      setIsPaused(false);
      setStatus("LIVE");
      notify("✓ Launch RESUMED. Storefront purchase is now active.");
    }
  }

  function confirmPause() {
    setIsPaused(true);
    setStatus("PAUSED");
    setShowPauseConfirm(false);
    notify("Launch PAUSED. Customers cannot purchase until resumed.");
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
            DROP TIMING &amp; LOCKS
          </span>
          <h1 style={{ fontSize: "24px", color: "#000000", margin: "4px 0 6px 0" }}>
            LAUNCHES
          </h1>
          <p style={{ fontSize: "12.5px", color: "#555555", margin: 0 }}>
            Control when products go live, set countdown timers, and manage drop access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowScheduleModal(true)}
          style={{
            background: "#000000",
            color: "#FFFFFF",
            border: 0,
            padding: "12px 22px",
            fontSize: "11.5px",
            fontWeight: 800,
            cursor: "pointer",
            letterSpacing: ".08em",
          }}
        >
          SCHEDULE LAUNCH 📅
        </button>
      </div>

      {/* 2. CURRENT ACTIVE DROP CONTROL CARD (White Card) */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div>
            <span style={{ fontSize: "9.5px", color: "#777777", letterSpacing: ".12em", fontWeight: 700 }}>
              FEATURED CAMPAIGN
            </span>
            <h2 style={{ fontSize: "20px", color: "#000000", margin: "4px 0 0 0" }}>
              Bengaluru Edition: Signal After Rain
            </h2>
            <span style={{ fontSize: "11px", color: "#777777" }}>
              Edition: DROP 001 • Target Quantity: 100 Units
            </span>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleTogglePause}
              style={{
                background: isPaused ? "#000000" : "#FFFFFF",
                border: "1px solid #000000",
                color: isPaused ? "#FFFFFF" : "#000000",
                padding: "10px 18px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {isPaused ? "▶ RESUME LAUNCH" : "⏸ PAUSE LAUNCH"}
            </button>

            <Link
              href="/product/bengaluru-tee"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#000000",
                color: "#FFFFFF",
                border: 0,
                padding: "10px 18px",
                fontSize: "11px",
                fontWeight: 800,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              VIEW LIVE STOREFRONT ↗
            </Link>
          </div>
        </div>

        {/* 5-Step Launch Lifecycle Stepper */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
          {steps.map((s, idx) => {
            const isCurrent = status === s.id;
            return (
              <div
                key={s.id}
                style={{
                  background: isCurrent ? "#F7F7F3" : "#FFFFFF",
                  border: `1px solid ${isCurrent ? "#000000" : "#E5E5E5"}`,
                  padding: "16px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "9px", color: "#777777" }}>0{idx + 1}</span>
                  {isCurrent && <span style={{ fontSize: "8.5px", background: "#000000", color: "#FFFFFF", padding: "2px 6px", fontWeight: 700 }}>ACTIVE</span>}
                </div>
                <strong style={{ fontSize: "12px", color: isCurrent ? "#000000" : "#777777" }}>
                  {s.label}
                </strong>
                <small style={{ fontSize: "10.5px", color: "#777777", lineHeight: 1.4 }}>
                  {s.desc}
                </small>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SCHEDULE MODAL */}
      {showScheduleModal && (
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
              Schedule Drop Countdown
            </h3>
            <button
              type="button"
              onClick={() => setShowScheduleModal(false)}
              style={{ background: "transparent", border: 0, color: "#777777", fontSize: "14px", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>

          <p style={{ fontSize: "12px", color: "#777777", margin: "0 0 20px 0" }}>
            Setting a launch time enables the public countdown timer on the storefront.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStatus("SCHEDULED");
              setShowScheduleModal(false);
              notify(`✓ Drop scheduled for ${new Date(scheduleDate).toLocaleString("en-IN")}.`);
            }}
            style={{ display: "grid", gap: "16px" }}
          >
            <div>
              <label style={{ display: "block", fontSize: "10px", color: "#777777", marginBottom: "8px", fontWeight: 700 }}>
                LAUNCH DATE &amp; TIME (IST)
              </label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#FFFFFF",
                  border: "1px solid #E5E5E5",
                  color: "#000000",
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "12px",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button
                type="submit"
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
                ACTIVATE SCHEDULE
              </button>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
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

      {/* 4. PAUSE CONFIRMATION MODAL */}
      {showPauseConfirm && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #000000",
            padding: "24px 28px",
            maxWidth: "440px",
          }}
        >
          <h3 style={{ fontSize: "15px", color: "#000000", margin: "0 0 8px 0" }}>
            Pause Storefront Purchases?
          </h3>
          <p style={{ fontSize: "12px", color: "#777777", margin: "0 0 18px 0", lineHeight: 1.5 }}>
            Customers will see an &ldquo;EDITION PAUSED&rdquo; notice and will not be able to add to cart or checkout until resumed.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={confirmPause}
              style={{ background: "#000000", color: "#FFFFFF", border: 0, padding: "10px 16px", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}
            >
              CONFIRM PAUSE
            </button>
            <button
              type="button"
              onClick={() => setShowPauseConfirm(false)}
              style={{ background: "transparent", border: "1px solid #E5E5E5", color: "#777777", padding: "10px 14px", fontSize: "11px", cursor: "pointer" }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
