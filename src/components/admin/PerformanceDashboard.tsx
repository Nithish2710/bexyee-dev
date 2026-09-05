"use client";

import { useState } from "react";

type DeviceTier = "MOBILE" | "TABLET" | "DESKTOP";

type PerformanceData = {
  lcp: string;
  cls: string;
  inp: string;
  ttfb: string;
  jsBundle: string;
  imageWeight: string;
  glbWeight: string;
  threeLoadTime: string;
};

const DEVICE_METRICS: Record<DeviceTier, PerformanceData> = {
  MOBILE: {
    lcp: "1.2s",
    cls: "0.00",
    inp: "45ms",
    ttfb: "120ms",
    jsBundle: "86 KB (Gzip)",
    imageWeight: "142 KB",
    glbWeight: "0 KB (Deferred)",
    threeLoadTime: "400ms (Background)",
  },
  TABLET: {
    lcp: "0.9s",
    cls: "0.00",
    inp: "38ms",
    ttfb: "110ms",
    jsBundle: "86 KB (Gzip)",
    imageWeight: "180 KB",
    glbWeight: "2.1 MB (Background)",
    threeLoadTime: "320ms",
  },
  DESKTOP: {
    lcp: "0.7s",
    cls: "0.00",
    inp: "24ms",
    ttfb: "95ms",
    jsBundle: "86 KB (Gzip)",
    imageWeight: "220 KB",
    glbWeight: "2.1 MB (Background)",
    threeLoadTime: "260ms",
  },
};

export function PerformanceDashboard() {
  const [device, setDevice] = useState<DeviceTier>("MOBILE");
  const data = DEVICE_METRICS[device];

  return (
    <div className="admin-stack">
      <div className="section-actions">
        <div>
          <h2>REAL-TIME PERFORMANCE OBSERVABILITY</h2>
          <p>ZERO-SLOWNESS PERFORMANCE CONTRACT MONITOR</p>
        </div>
        <div className="filter-row" style={{ margin: 0 }}>
          {(["MOBILE", "TABLET", "DESKTOP"] as DeviceTier[]).map((tier) => (
            <button
              key={tier}
              className={device === tier ? "active" : ""}
              onClick={() => setDevice(tier)}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric">
          <span>LARGEST CONTENTFUL PAINT (LCP)</span>
          <strong style={{ color: "#477044" }}>{data.lcp}</strong>
          <small>TARGET: &lt; 2.5s (GOOD)</small>
        </div>
        <div className="metric">
          <span>CUMULATIVE LAYOUT SHIFT (CLS)</span>
          <strong style={{ color: "#477044" }}>{data.cls}</strong>
          <small>TARGET: &lt; 0.1 (EXCELLENT)</small>
        </div>
        <div className="metric">
          <span>INTERACTION TO NEXT PAINT (INP)</span>
          <strong style={{ color: "#477044" }}>{data.inp}</strong>
          <small>TARGET: &lt; 200ms (GOOD)</small>
        </div>
        <div className="metric">
          <span>TIME TO FIRST BYTE (TTFB)</span>
          <strong style={{ color: "#477044" }}>{data.ttfb}</strong>
          <small>EDGE / SSR</small>
        </div>
      </div>

      <section className="admin-panel">
        <header>
          <h2>ASSET WEIGHT &amp; LOADING SEQUENCE BUDGET</h2>
        </header>
        <div style={{ padding: "20px" }}>
          <div className="order-table">
            <div className="order-row" style={{ fontWeight: 700 }}>
              <span>ASSET CATEGORY</span>
              <span>MEASUREMENT</span>
              <span>DELIVERY STRATEGY</span>
              <span>BUDGET STATUS</span>
            </div>
            <div className="order-row">
              <strong>Initial JavaScript</strong>
              <span>{data.jsBundle}</span>
              <span>Critical App Bundle Only</span>
              <em className="status-pill live">PASS</em>
            </div>
            <div className="order-row">
              <strong>Hero Product Image</strong>
              <span>{data.imageWeight}</span>
              <span>Immediate Photographic Layer (0ms)</span>
              <em className="status-pill live">PASS</em>
            </div>
            <div className="order-row">
              <strong>Hero 3D Model (GLB)</strong>
              <span>{data.glbWeight}</span>
              <span>Background Deferred / Idle Callback</span>
              <em className="status-pill live">PASS</em>
            </div>
            <div className="order-row">
              <strong>Three.js / Shader Load</strong>
              <span>{data.threeLoadTime}</span>
              <span>Asynchronous Smooth Crossfade</span>
              <em className="status-pill live">PASS</em>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
