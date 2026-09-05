"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import * as THREE from "three";
import { getAdaptiveMode } from "../../lib/adaptive-network";

export function BexyeeCoin3D({ size = 320, className }: { size?: number; className?: string }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const fallbackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mountRef.current) return;

    const adaptive = getAdaptiveMode();
    if (!adaptive.is3DAllowed) return;

    // Check WebGL availability
    let hasGl = false;
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      hasGl = !!gl;
    } catch {
      hasGl = false;
    }
    if (!hasGl) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let coinGeometry: THREE.CylinderGeometry | null = null;
    let edgeMaterial: THREE.MeshStandardMaterial | null = null;
    let frontMaterial: THREE.MeshStandardMaterial | null = null;
    let backMaterial: THREE.MeshStandardMaterial | null = null;
    let frontTex: THREE.CanvasTexture | null = null;
    let backTex: THREE.CanvasTexture | null = null;

    let isDisposed = false;

    // Defer 3D setup until browser main thread is idle (never blocks LCP or initial paint)
    const scheduleInit =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback
        : (cb: () => void) => setTimeout(cb, 100);

    const cancelSchedule =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback
        : (id: number) => clearTimeout(id);

    const idleHandle = scheduleInit(() => {
      if (isDisposed || !mountRef.current) return;

      const container = mountRef.current;
      const width = container.clientWidth || size;
      const height = container.clientHeight || size;

      // 1. Three.js Scene, Camera, Renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
      camera.position.set(0, 0, 5.2);

      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        return;
      }

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      renderer.domElement.style.opacity = "0";
      renderer.domElement.style.transition = "opacity 0.4s ease-in";
      container.appendChild(renderer.domElement);

      // 2. Procedural Texture Generator for Front & Back Coin Faces
      function createCoinTexture(isBack = false): THREE.CanvasTexture {
        const c = document.createElement("canvas");
        c.width = 1024;
        c.height = 1024;
        const ctx = c.getContext("2d")!;

        // Dark metallic brushed background
        const grad = ctx.createRadialGradient(512, 512, 50, 512, 512, 510);
        grad.addColorStop(0, "#282725");
        grad.addColorStop(0.5, "#181716");
        grad.addColorStop(0.85, "#0e0e0d");
        grad.addColorStop(1, "#070706");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);

        // Outer Metallic Rim
        ctx.lineWidth = 14;
        ctx.strokeStyle = "#4a4742";
        ctx.beginPath();
        ctx.arc(512, 512, 490, 0, Math.PI * 2);
        ctx.stroke();

        // Milled Teeth Ring
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#383633";
        ctx.setLineDash([8, 10]);
        ctx.beginPath();
        ctx.arc(512, 512, 468, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Inner Step Ring
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#242321";
        ctx.beginPath();
        ctx.arc(512, 512, 440, 0, Math.PI * 2);
        ctx.stroke();

        if (!isBack) {
          // Front Face Typography
          ctx.fillStyle = "#ede9e1";
          ctx.font = "bold 92px 'Space Mono', monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.letterSpacing = "-4px";
          ctx.fillText("BEXYEE", 512, 496);

          // Accent Red Dot
          ctx.fillStyle = "#e52b20";
          ctx.beginPath();
          ctx.arc(710, 480, 12, 0, Math.PI * 2);
          ctx.fill();

          // Subtitle Stamp
          ctx.fillStyle = "#e52b20";
          ctx.font = "bold 26px 'Space Mono', monospace";
          ctx.letterSpacing = "6px";
          ctx.fillText("UNIFORM ARCHITECTURE", 512, 590);

          ctx.fillStyle = "#77736d";
          ctx.font = "20px 'Space Mono', monospace";
          ctx.letterSpacing = "4px";
          ctx.fillText("DROP 001 // 320 GSM", 512, 636);
        } else {
          // Back Face Coordinates & Matrix
          ctx.fillStyle = "#ede9e1";
          ctx.font = "bold 44px 'Space Mono', monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.letterSpacing = "2px";
          ctx.fillText("12.9716° N", 512, 460);
          ctx.fillText("77.5946° E", 512, 520);

          ctx.fillStyle = "#e52b20";
          ctx.font = "bold 24px 'Space Mono', monospace";
          ctx.letterSpacing = "8px";
          ctx.fillText("BENGALURU STUDIO", 512, 590);

          ctx.fillStyle = "#666";
          ctx.font = "18px 'Space Mono', monospace";
          ctx.letterSpacing = "4px";
          ctx.fillText("ARCHIVE EMBLEM", 512, 636);
        }

        // Crosshairs
        ctx.strokeStyle = "#e52b20";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(512, 180);
        ctx.lineTo(512, 210);
        ctx.moveTo(512, 814);
        ctx.lineTo(512, 844);
        ctx.moveTo(180, 512);
        ctx.lineTo(210, 512);
        ctx.moveTo(814, 512);
        ctx.lineTo(844, 512);
        ctx.stroke();

        const texture = new THREE.CanvasTexture(c);
        if (renderer) {
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        }
        return texture;
      }

      frontTex = createCoinTexture(false);
      backTex = createCoinTexture(true);

      // 3. Coin Materials
      edgeMaterial = new THREE.MeshStandardMaterial({
        color: 0x22211f,
        metalness: 0.88,
        roughness: 0.28,
      });

      frontMaterial = new THREE.MeshStandardMaterial({
        map: frontTex,
        metalness: 0.85,
        roughness: 0.22,
      });

      backMaterial = new THREE.MeshStandardMaterial({
        map: backTex,
        metalness: 0.85,
        roughness: 0.22,
      });

      // 4. Coin Geometry
      coinGeometry = new THREE.CylinderGeometry(1.6, 1.6, 0.14, 64);
      const coinMesh = new THREE.Mesh(coinGeometry, [edgeMaterial, frontMaterial, backMaterial]);
      coinMesh.rotation.x = Math.PI / 2;
      scene.add(coinMesh);

      // 5. Studio Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
      keyLight.position.set(3, 4, 4);
      scene.add(keyLight);

      const redRimLight = new THREE.DirectionalLight(0xe52b20, 1.8);
      redRimLight.position.set(-4, -2, -2);
      scene.add(redRimLight);

      const fillLight = new THREE.DirectionalLight(0x88aacc, 0.8);
      fillLight.position.set(0, -3, 3);
      scene.add(fillLight);

      // 6. Interactive Pointer Tracking
      let targetTiltX = 0;
      let targetTiltY = 0;

      function handlePointerMove(e: PointerEvent) {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetTiltX = y * 0.35;
        targetTiltY = x * 0.35;
      }

      window.addEventListener("pointermove", handlePointerMove, { passive: true });

      // 7. Animation Loop
      let lastTime = performance.now();
      let hasCrossfaded = false;

      function animate(now: number) {
        if (isDisposed) return;
        animationFrameId = requestAnimationFrame(animate);
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        // Smooth continuous axial spin
        coinMesh.rotation.z += 0.8 * delta;

        // Subtle parallax tilt
        coinMesh.rotation.x = THREE.MathUtils.lerp(coinMesh.rotation.x, Math.PI / 2 + targetTiltX, 0.06);
        coinMesh.rotation.y = THREE.MathUtils.lerp(coinMesh.rotation.y, targetTiltY, 0.06);

        if (renderer) {
          renderer.render(scene, camera);
        }

        if (!hasCrossfaded && renderer) {
          hasCrossfaded = true;
          renderer.domElement.style.opacity = "1";
          if (fallbackRef.current) {
            fallbackRef.current.style.opacity = "0";
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);

      function handleResize() {
        if (!container || !renderer) return;
        const w = container.clientWidth || size;
        const h = container.clientHeight || size;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }

      window.addEventListener("resize", handleResize);
    });

    return () => {
      isDisposed = true;
      cancelSchedule(idleHandle as number);
      cancelAnimationFrame(animationFrameId);
      if (renderer && renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      if (coinGeometry) coinGeometry.dispose();
      if (edgeMaterial) edgeMaterial.dispose();
      if (frontMaterial) frontMaterial.dispose();
      if (backMaterial) backMaterial.dispose();
      if (frontTex) frontTex.dispose();
      if (backTex) backTex.dispose();
      if (renderer) renderer.dispose();
    };
  }, [size]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: className ? undefined : size,
        maxWidth: "100%",
        aspectRatio: "1/1",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Instant Static Fallback Image */}
      <div
        ref={fallbackRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1,
          transition: "opacity 0.4s ease-out",
        }}
      >
        <Image
          src="/assets/brand/bexyee-coin-emblem.svg"
          alt="BEXYEE Metallic Brand Emblem"
          fill
          priority
          sizes="(max-width: 768px) 210px, (max-width: 1200px) 270px, 340px"
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        style={{
          position: "absolute",
          inset: 0,
          cursor: "grab",
        }}
      />
    </div>
  );
}
