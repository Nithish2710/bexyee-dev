export type NetworkProfile = "FAST" | "SLOW" | "SAVE_DATA" | "OFFLINE";
export type DeviceTier = "HIGH" | "MEDIUM" | "LOW" | "CONSTRAINED";

export type AdaptiveMode = {
  isFastNetwork: boolean;
  is3DAllowed: boolean;
  isHighDprAllowed: boolean;
  isPrefetchAllowed: boolean;
  isHeavyAnimationAllowed: boolean;
  hasWebGL: boolean;
  networkProfile: NetworkProfile;
  deviceTier: DeviceTier;
};

/**
 * Feature-detects WebGL support on client.
 * Section 7: Progressive load fall back to image-first if no WebGL support.
 */
export function detectWebGLSupport(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function getAdaptiveMode(): AdaptiveMode {
  if (typeof window === "undefined") {
    return {
      isFastNetwork: true,
      is3DAllowed: true,
      isHighDprAllowed: false,
      isPrefetchAllowed: true,
      isHeavyAnimationAllowed: true,
      hasWebGL: true,
      networkProfile: "FAST",
      deviceTier: "MEDIUM",
    };
  }

  const hasWebGL = detectWebGLSupport();

  // 1. Check Offline State
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return {
      isFastNetwork: false,
      is3DAllowed: false,
      isHighDprAllowed: false,
      isPrefetchAllowed: false,
      isHeavyAnimationAllowed: false,
      hasWebGL,
      networkProfile: "OFFLINE",
      deviceTier: "CONSTRAINED",
    };
  }

  // 2. User & Hardware Constraints
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const nav = navigator as unknown as {
    connection?: {
      saveData?: boolean;
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
    };
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };

  const isSaveData = nav.connection?.saveData === true;
  const effectiveType = nav.connection?.effectiveType ?? "4g";
  const rtt = nav.connection?.rtt ?? 50;
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory || 4;

  const isSlowNetwork =
    isSaveData ||
    effectiveType === "slow-2g" ||
    effectiveType === "2g" ||
    effectiveType === "3g" ||
    rtt > 300;

  let deviceTier: DeviceTier = "MEDIUM";
  if (cores >= 8 && memory >= 6) {
    deviceTier = "HIGH";
  } else if (cores < 4 || memory < 3) {
    deviceTier = "LOW";
  }

  if (isSaveData) {
    return {
      isFastNetwork: false,
      is3DAllowed: false,
      isHighDprAllowed: false,
      isPrefetchAllowed: false,
      isHeavyAnimationAllowed: false,
      hasWebGL,
      networkProfile: "SAVE_DATA",
      deviceTier: "CONSTRAINED",
    };
  }

  if (isSlowNetwork) {
    return {
      isFastNetwork: false,
      is3DAllowed: false,
      isHighDprAllowed: false,
      isPrefetchAllowed: false,
      isHeavyAnimationAllowed: !prefersReducedMotion,
      hasWebGL,
      networkProfile: "SLOW",
      deviceTier: deviceTier === "HIGH" ? "MEDIUM" : "LOW",
    };
  }

  // Fast network + capable device + WebGL supported
  const is3DAllowed = hasWebGL && deviceTier !== "LOW" && !prefersReducedMotion;

  return {
    isFastNetwork: true,
    is3DAllowed,
    isHighDprAllowed: deviceTier === "HIGH",
    isPrefetchAllowed: true,
    isHeavyAnimationAllowed: !prefersReducedMotion,
    hasWebGL,
    networkProfile: "FAST",
    deviceTier,
  };
}
