"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { getAdaptiveMode, type AdaptiveMode } from "../../lib/adaptive-network";

const viewAngles: Record<string, number> = {
  FRONT: 0,
  BACK: Math.PI,
  "LEFT SLEEVE": Math.PI / 2,
  "RIGHT SLEEVE": -Math.PI / 2,
  PRINT: -0.55,
};

function ProductModel({
  url,
  view,
  signal,
  onLoaded,
}: {
  url: string;
  view: string;
  signal: { x: number; y: number };
  onLoaded: () => void;
}) {
  const { scene } = useGLTF(url);
  const group = useRef<THREE.Group>(null);
  const target = useRef(viewAngles[view] ?? 0);

  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  // Set initial angle immediately to avoid pop
  useEffect(() => {
    if (group.current) {
      const desired = viewAngles[view] ?? 0;
      const current = group.current.rotation.y;
      target.current = current + THREE.MathUtils.euclideanModulo(desired - current + Math.PI, Math.PI * 2) - Math.PI;
    }
  }, [view]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target.current, 4.2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, (signal.y - 50) * 0.0015, 3, delta);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, (signal.x - 50) * -0.0015, 3, delta);
  });

  return <primitive object={scene} ref={group} scale={2.35} position={[0, -1.55, 0]} />;
}

export function HeroProduct3D({
  modelUrl,
  view,
  signal,
  viewPhotos,
}: {
  modelUrl: string;
  view: string;
  signal: { x: number; y: number };
  viewPhotos: Record<string, string>;
}) {
  const [is3DReady, setIs3DReady] = useState(false);
  const [shouldLoad3D, setShouldLoad3D] = useState(false);
  const [is3DFailed, setIs3DFailed] = useState(false);
  const [adaptive] = useState<AdaptiveMode>(() => getAdaptiveMode());

  // 1. Adaptive Preloader:
  // Step 1: Active view renders immediately (0ms, 100% bandwidth dedicated to active photo for fastest LCP).
  // Step 2: On fast network only, remaining view photos are preloaded during post-render idle.
  useEffect(() => {
    if (typeof window === "undefined" || !adaptive.isPrefetchAllowed) return;

    const otherPhotos = Object.entries(viewPhotos)
      .filter(([key]) => key !== view)
      .map(([, url]) => url)
      .filter(Boolean);

    const runPreload = () => {
      otherPhotos.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    };

    if ("requestIdleCallback" in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(runPreload, { timeout: 1200 });
      return () => {
        (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback?.(handle);
      };
    } else {
      const timer = setTimeout(runPreload, 150);
      return () => clearTimeout(timer);
    }
  }, [view, viewPhotos, adaptive.isPrefetchAllowed]);

  // 2. Adaptive Deferred background 3D initialization
  useEffect(() => {
    if (!adaptive.is3DAllowed || !modelUrl) {
      return;
    }

    // Defer 3D until after first paint + user reaction window
    const timer = setTimeout(() => {
      setShouldLoad3D(true);
    }, 450);

    return () => clearTimeout(timer);
  }, [modelUrl, adaptive.is3DAllowed]);

  const activePhoto = viewPhotos[view] || viewPhotos.FRONT || "/assets/products/bengaluru-tee-front.svg";
  const dpr: [number, number] | number = adaptive.isHighDprAllowed ? [1, 1.75] : [1, 1.25];

  return (
    <div className="product-stage">
      {/* LAYER 1: Immediate Photographic Presentation Layer (Zero layout shift, 0ms render) */}
      <div
        className="product-photo-layer"
        style={{
          opacity: is3DReady && !is3DFailed ? 0 : 1,
          pointerEvents: is3DReady && !is3DFailed ? "none" : "auto",
          transition: adaptive.isHeavyAnimationAllowed ? "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
          transform: adaptive.isHeavyAnimationAllowed
            ? `translate3d(${(signal.x - 50) * 0.05}px, ${(signal.y - 50) * 0.05}px, 0)`
            : undefined,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={view}
          src={activePhoto}
          alt={`BEXYEE Product view - ${view}`}
          className="product-hero-image"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* LAYER 2: Progressive 3D Enhancement Layer (Fades in smoothly when GLB is fully ready) */}
      {shouldLoad3D && modelUrl && adaptive.is3DAllowed && !is3DFailed && (
        <div
          className="product-canvas-layer"
          style={{
            opacity: is3DReady ? 1 : 0,
            transition: adaptive.isHeavyAnimationAllowed ? "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 6], fov: 34 }}
            dpr={dpr}
            shadows={adaptive.deviceTier === "HIGH"}
            frameloop="always"
            onError={() => {
              setIs3DFailed(true);
              setIs3DReady(false);
            }}
          >
            <ambientLight intensity={adaptive.deviceTier === "LOW" ? 1.2 : 0.85} />
            <directionalLight
              position={[3, 5, 4]}
              intensity={3.2}
              castShadow={adaptive.deviceTier === "HIGH"}
            />
            {adaptive.deviceTier !== "LOW" && (
              <directionalLight position={[-4, 2, -2]} intensity={0.65} color="#e52b20" />
            )}
            <Suspense fallback={null}>
              <ProductModel
                url={modelUrl}
                view={view}
                signal={signal}
                onLoaded={() => setIs3DReady(true)}
              />
            </Suspense>
          </Canvas>
        </div>
      )}

      <span className="model-label">
        {is3DReady && !is3DFailed ? `BEXYEE / 3D OBJECT (${view})` : `BEXYEE / STUDIO PHOTO (${view})`}
      </span>
    </div>
  );
}