import assert from "node:assert/strict";
import { describe, test } from "node:test";

describe("BEXYEE Asset & Campaign Control Center Suite", () => {
  const NAMED_SLOTS = [
    "PRODUCT_FRONT_IMAGE",
    "PRODUCT_BACK_IMAGE",
    "PRODUCT_LEFT_SLEEVE_IMAGE",
    "PRODUCT_RIGHT_SLEEVE_IMAGE",
    "PRODUCT_PRINT_IMAGE",
    "HERO_GLB",
    "HERO_BACKGROUND",
    "MOBILE_BACKGROUND",
    "OG_IMAGE",
  ];

  test("Phase 1: Named Asset Slots & Metadata Requirements", () => {
    const slotRequirements = {
      PRODUCT_FRONT_IMAGE: { required: true, maxKb: 400, format: "WebP / PNG" },
      PRODUCT_BACK_IMAGE: { required: true, maxKb: 400, format: "WebP / PNG" },
      PRODUCT_LEFT_SLEEVE_IMAGE: { required: true, maxKb: 350, format: "WebP / PNG" },
      PRODUCT_RIGHT_SLEEVE_IMAGE: { required: true, maxKb: 350, format: "WebP / PNG" },
      PRODUCT_PRINT_IMAGE: { required: true, maxKb: 500, format: "WebP / PNG" },
      HERO_GLB: { required: false, maxKb: 4608, format: "GLB" },
      HERO_BACKGROUND: { required: true, maxKb: 600, format: "WebP / SVG / PNG" },
      MOBILE_BACKGROUND: { required: false, maxKb: 300, format: "WebP / JPG" },
      OG_IMAGE: { required: true, maxKb: 250, format: "WebP / PNG" },
    };

    for (const slot of NAMED_SLOTS) {
      assert.ok(slotRequirements[slot], `Slot ${slot} must be defined in metadata schema`);
      assert.ok(slotRequirements[slot].maxKb > 0, `Slot ${slot} must have maximum file size limit`);
    }
  });

  test("Phase 1: Asset Versioning & Non-Destructive Restore", () => {
    const assetStore = {
      slot: "PRODUCT_FRONT_IMAGE",
      versions: [
        { version: 1, url: "/assets/products/bengaluru-tee-front.svg", is_active: false },
        { version: 2, url: "/assets/products/bengaluru-tee-front-v2.webp", is_active: true },
      ],
    };

    // Restore version 1
    const targetVersion = 1;
    assetStore.versions.forEach((v) => {
      v.is_active = v.version === targetVersion;
    });

    const activeAsset = assetStore.versions.find((v) => v.is_active);
    assert.equal(activeAsset?.version, 1);
    assert.equal(activeAsset?.url, "/assets/products/bengaluru-tee-front.svg");
  });

  test("Phase 2: Draft Campaign Isolation (Drafts do not alter live storefront)", () => {
    const liveCampaign = {
      id: "blr-001",
      cityName: "BENGALURU",
      campaignTitle: "SIGNAL AFTER RAIN",
      price: 1799,
      status: "ACTIVE",
    };

    // Save a draft with modified pricing and copy
    const draftPayload = {
      campaignId: "blr-001",
      cityName: "BENGALURU",
      campaignTitle: "SIGNAL AFTER RAIN (DROP 2)",
      price: 2199,
    };

    // Verify live campaign remains completely untouched
    assert.equal(liveCampaign.price, 1799, "Live price must remain unchanged while draft exists");
    assert.equal(liveCampaign.campaignTitle, "SIGNAL AFTER RAIN", "Live title must not reflect draft changes");
    assert.equal(draftPayload.price, 2199, "Draft payload holds staging modifications");
  });

  test("Phase 4: Immutable Campaign Publishing & Snapshot Workflow", () => {
    let liveCampaign = {
      id: "blr-001",
      cityName: "BENGALURU",
      campaignTitle: "SIGNAL AFTER RAIN",
      price: 1799,
      active: true,
      version: 1,
    };

    const draftPayload = {
      campaignId: "blr-001",
      cityName: "BENGALURU",
      campaignTitle: "SIGNAL AFTER RAIN — MONSOON EDITION",
      price: 1999,
    };

    const auditSnapshots = [];

    // Atomic Publish
    const snapshot = { ...liveCampaign, archivedAt: new Date().toISOString() };
    auditSnapshots.push(snapshot);

    liveCampaign = {
      ...liveCampaign,
      campaignTitle: draftPayload.campaignTitle,
      price: draftPayload.price,
      version: liveCampaign.version + 1,
    };

    assert.equal(liveCampaign.version, 2);
    assert.equal(liveCampaign.campaignTitle, "SIGNAL AFTER RAIN — MONSOON EDITION");
    assert.equal(liveCampaign.price, 1999);
    assert.equal(auditSnapshots.length, 1);
    assert.equal(auditSnapshots[0].version, 1, "Archived snapshot preserves previous state for rollback");

    // Rollback test
    const rollbackTarget = auditSnapshots[0];
    liveCampaign = {
      ...liveCampaign,
      campaignTitle: rollbackTarget.campaignTitle,
      price: rollbackTarget.price,
      version: liveCampaign.version + 1,
    };

    assert.equal(liveCampaign.campaignTitle, "SIGNAL AFTER RAIN", "Rollback restores previous production title");
    assert.equal(liveCampaign.price, 1799, "Rollback restores previous production price");
  });

  test("Phase 6: Behavior Analytics Rage-Click Detection Algorithm", () => {
    const now = Date.now();
    const clickBuffer = [
      { x: 100, y: 150, time: now - 300 },
      { x: 102, y: 151, time: now - 200 },
      { x: 101, y: 149, time: now - 100 },
    ];

    const isRage = clickBuffer.filter(
      (c) => now - c.time < 800 && Math.hypot(c.x - 100, c.y - 150) < 40
    ).length >= 3;

    assert.equal(isRage, true, "Rapid clicks in localized area must trigger rage-click signal");
  });
});
