"use client";

export type BehaviorEvent = {
  type: "CLICK" | "SCROLL_DEPTH" | "RAGE_CLICK" | "DEAD_CLICK" | "VIEWPORT_RESIZE";
  x?: number;
  y?: number;
  target?: string;
  depthPercentage?: number;
  clickCount?: number;
  timestamp: number;
  viewportWidth: number;
  viewportHeight: number;
  path: string;
};

export interface BehaviorAnalyticsAdapter {
  init: (config: { apiKey?: string; projectId?: string }) => void;
  trackClick: (event: { x: number; y: number; target: string; isRage?: boolean; isDead?: boolean }) => void;
  trackScrollDepth: (depthPercent: number) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
}

class DefaultBehaviorAdapter implements BehaviorAnalyticsAdapter {
  private isInitialized = false;
  private maxScrollDepth = 0;
  private clickBuffer: { x: number; y: number; time: number; target: string }[] = [];

  init(config: { apiKey?: string; projectId?: string }) {
    if (typeof window === "undefined" || this.isInitialized) return;
    this.isInitialized = true;

    // Microsoft Clarity Integration if Key present
    const clarityId = config.projectId || process.env.NEXT_PUBLIC_CLARITY_ID;
    if (clarityId) {
      try {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = `https://www.clarity.ms/tag/${clarityId}`;
        document.head.appendChild(script);
      } catch {
        // Silently ignore if blocked
      }
    }

    // Attach passive scroll depth observer
    window.addEventListener(
      "scroll",
      () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) return;
        const currentDepth = Math.round((window.scrollY / totalHeight) * 100);
        if (currentDepth > this.maxScrollDepth) {
          this.maxScrollDepth = currentDepth;
          this.trackScrollDepth(currentDepth);
        }
      },
      { passive: true }
    );

    // Attach passive click & rage click detector
    window.addEventListener(
      "click",
      (e) => {
        const now = Date.now();
        const target = (e.target as HTMLElement)?.tagName?.toLowerCase() || "unknown";
        const clickData = { x: e.clientX, y: e.clientY, time: now, target };

        this.clickBuffer.push(clickData);
        // Keep only last 10 clicks
        if (this.clickBuffer.length > 10) this.clickBuffer.shift();

        // Rage click detection: > 3 clicks in the same 40px area within 800ms
        const recentClicks = this.clickBuffer.filter(
          (c) => now - c.time < 800 && Math.hypot(c.x - e.clientX, c.y - e.clientY) < 40
        );

        const isRage = recentClicks.length >= 3;
        const isDead = !["button", "a", "input", "select"].includes(target) && !e.defaultPrevented;

        this.trackClick({
          x: e.clientX,
          y: e.clientY,
          target,
          isRage,
          isDead,
        });
      },
      { passive: true }
    );
  }

  trackClick(event: { x: number; y: number; target: string; isRage?: boolean; isDead?: boolean }) {
    void event;
  }

  trackScrollDepth(depthPercent: number) {
    void depthPercent;
  }

  identify(userId: string) {
    if (typeof window !== "undefined" && (window as unknown as { clarity?: (fn: string, id: string) => void }).clarity) {
      (window as unknown as { clarity: (fn: string, id: string) => void }).clarity("identify", userId);
    }
  }
}

export const behaviorAnalytics: BehaviorAnalyticsAdapter = new DefaultBehaviorAdapter();
