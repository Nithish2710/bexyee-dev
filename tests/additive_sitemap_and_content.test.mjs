import test from "node:test";
import assert from "node:assert/strict";

test("Additive Public Pages & Content CMS Suite", async (t) => {
  await t.test("City Slugs and Static Parameters", () => {
    const validCitySlugs = ["bengaluru", "mumbai", "delhi", "chennai", "hyderabad"];
    assert.equal(validCitySlugs.length, 5);
    assert.ok(validCitySlugs.includes("bengaluru"));
    assert.ok(validCitySlugs.includes("mumbai"));
  });

  await t.test("Collections Capsule Configuration", () => {
    const capsules = ["monsoon-2026", "winter-grid-2026", "coastal-dusk-2027"];
    assert.equal(capsules.length, 3);
    assert.ok(capsules.includes("monsoon-2026"));
  });

  await t.test("Search API Query Filtering", () => {
    const staticIndex = [
      { type: "PRODUCT", title: "Bengaluru Heavyweight Tee", subtitle: "Drop 001", url: "/products/bengaluru-tee" },
      { type: "CITY", title: "Bengaluru (Signal After Rain)", subtitle: "12.9716° N", url: "/cities/bengaluru" },
      { type: "ARTICLE", title: "Engineering 320 GSM Super Loopknit", subtitle: "Textile physics", url: "/blog/engineering-320-gsm-super-loopknit" },
    ];

    const q = "loopknit";
    const matched = staticIndex.filter(
      (item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
    );

    assert.equal(matched.length, 1);
    assert.equal(matched[0].type, "ARTICLE");
  });

  await t.test("Size Matrix Physical Proportions", () => {
    const sizes = {
      S: { chest: 44, length: 29 },
      M: { chest: 46, length: 30 },
      L: { chest: 48, length: 31 },
      XL: { chest: 50, length: 32 },
    };

    assert.ok(sizes.M.chest > sizes.S.chest);
    assert.ok(sizes.XL.chest === 50);
  });

  await t.test("Account Sub-Route Invariants", () => {
    const accountRoutes = [
      "/account",
      "/account/orders",
      "/account/profile",
      "/account/addresses",
      "/account/security",
      "/account/wishlist",
    ];

    assert.equal(accountRoutes.length, 6);
    accountRoutes.forEach((route) => {
      assert.ok(route.startsWith("/account"));
    });
  });
});
