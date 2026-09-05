"use client";

import { useEffect, useState } from "react";
import type { ProductBackgroundSet, ProductBackgroundType } from "../../lib/product-engine";
import { getAdaptiveMode, type AdaptiveMode } from "../../lib/adaptive-network";

export function MovableBackground({
  backgrounds,
  backgroundType = "DEFAULT_STUDIO",
  signal,
}: {
  backgrounds: ProductBackgroundSet;
  backgroundType?: ProductBackgroundType;
  signal: { x: number; y: number };
}) {
  const [adaptive, setAdaptive] = useState<AdaptiveMode>(() => getAdaptiveMode());
  const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    setAdaptive(getAdaptiveMode());

    const updateDevice = () => {
      const w = window.innerWidth;
      if (w <= 640) {
        setDeviceType("mobile");
      } else if (w <= 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  // Determine active background image based on viewport and mode
  const isNone = backgroundType === "NONE" || (!backgrounds?.desktop && !backgrounds?.tablet && !backgrounds?.mobile && backgroundType !== "DEFAULT_STUDIO");
  const neutralStudioFallback = "/assets/environments/bexyee-studio-neutral.svg";
  
  let activeBg = "";
  if (!isNone) {
    activeBg = backgrounds?.desktop || (backgroundType === "DEFAULT_STUDIO" ? neutralStudioFallback : "");
    if (deviceType === "mobile" && backgrounds?.mobile) {
      activeBg = backgrounds.mobile;
    } else if (deviceType === "tablet" && backgrounds?.tablet) {
      activeBg = backgrounds.tablet;
    }
  }

  // Parallax translation (subtle ambient depth, restrained motion)
  const isAnimated = adaptive.isHeavyAnimationAllowed;
  const offsetX = isAnimated ? (signal.x - 50) * 0.14 : 0;
  const offsetY = isAnimated ? (signal.y - 50) * 0.14 : 0;

  return (
    <div
      className="bexyee-movable-background-container"
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        background: "#080807",
      }}
    >
      {/* 1. Cinematic Backdrop with Parallax */}
      {activeBg ? (
        <div
          className="bexyee-movable-background"
          style={{
            position: "absolute",
            top: "-6%",
            left: "-6%",
            width: "112%",
            height: "112%",
            backgroundImage: `url(${activeBg})`,
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            opacity: 0.35,
            filter: "contrast(115%) brightness(85%)",
            transform: isAnimated
              ? `translate3d(${offsetX}px, ${offsetY}px, 0) scale(1.03)`
              : "none",
            transition: isAnimated ? "transform 0.4s cubic-bezier(0.2, 0.8, 0.4, 1)" : "none",
            willChange: "transform",
          }}
        />
      ) : null}

      {/* 2. Vector Contour Spatial Curves (Reference Art Direction) */}
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.4,
          transform: isAnimated
            ? `translate3d(${offsetX * 0.5}px, ${offsetY * 0.5}px, 0)`
            : "none",
          transition: isAnimated ? "transform 0.5s ease-out" : "none",
        }}
      >
        <path
          d="M-100 250 C 350 120, 700 480, 1100 180 S 1600 350, 1700 220"
          stroke="#E52B20"
          strokeWidth="1.2"
          strokeOpacity="0.45"
          fill="none"
        />
        <path
          d="M-50 650 C 400 450, 750 780, 1200 520 S 1650 700, 1800 600"
          stroke="#E52B20"
          strokeWidth="0.8"
          strokeOpacity="0.3"
          fill="none"
        />
        <path
          d="M100 -50 C 450 300, 300 650, 950 850 S 1400 600, 1550 950"
          stroke="#FFFFFF"
          strokeWidth="0.6"
          strokeOpacity="0.15"
          strokeDasharray="4 8"
          fill="none"
        />
      </svg>

      {/* 3. Deep Cinematic Ambient Vignette & Spatial Radial Lighting */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 65% 45%, rgba(229, 43, 32, 0.12) 0%, rgba(10, 10, 9, 0.6) 50%, #080807 88%)",
        }}
      />
    </div>
  );
}
