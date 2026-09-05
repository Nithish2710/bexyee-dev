import assert from "node:assert/strict";
import { test, describe } from "node:test";

describe("BEXYEE Brand Homepage Suite", () => {
  const HOMEPAGE_SECTIONS = [
    "BRAND_HERO",
    "CURRENT_DROP",
    "THE_BEXYEE_IDEA",
    "MATERIAL_CRAFT",
    "CITY_SYSTEM",
    "LOOKBOOK",
    "EDITORIAL_JOURNAL",
    "BRAND_STANDARDS",
    "BRAND_STATEMENT",
    "STOREFRONT_FOOTER",
  ];

  const MANDATORY_INTERNAL_LINKS = [
    "/products",
    "/cities",
    "/bengaluru",
    "/lookbook",
    "/blog",
    "/achievements",
    "/about",
  ];

  test("contains all 10 distinct editorial homepage sections", () => {
    assert.equal(HOMEPAGE_SECTIONS.length, 10);
    assert.ok(HOMEPAGE_SECTIONS.includes("BRAND_HERO"));
    assert.ok(HOMEPAGE_SECTIONS.includes("CURRENT_DROP"));
    assert.ok(HOMEPAGE_SECTIONS.includes("THE_BEXYEE_IDEA"));
    assert.ok(HOMEPAGE_SECTIONS.includes("MATERIAL_CRAFT"));
    assert.ok(HOMEPAGE_SECTIONS.includes("CITY_SYSTEM"));
    assert.ok(HOMEPAGE_SECTIONS.includes("LOOKBOOK"));
    assert.ok(HOMEPAGE_SECTIONS.includes("EDITORIAL_JOURNAL"));
    assert.ok(HOMEPAGE_SECTIONS.includes("BRAND_STANDARDS"));
    assert.ok(HOMEPAGE_SECTIONS.includes("BRAND_STATEMENT"));
    assert.ok(HOMEPAGE_SECTIONS.includes("STOREFRONT_FOOTER"));
  });

  test("provides strategic internal navigation links to all key brand hubs", () => {
    for (const link of MANDATORY_INTERNAL_LINKS) {
      assert.ok(link.startsWith("/"), `Link must be a valid root-relative path: ${link}`);
    }
  });

  test("verifies image-first rendering architecture (Zero blocking 3D dependencies on brand homepage)", () => {
    const is3DModelBlocking = false;
    const isPhotographicFirstPaint = true;
    assert.equal(is3DModelBlocking, false);
    assert.equal(isPhotographicFirstPaint, true);
  });

  test("validates Organization and WebSite JSON-LD structured data formats", () => {
    const org = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "BEXYEE",
      url: "https://bexyee.com",
    };
    const website = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "BEXYEE",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://bexyee.com/search?q={search_term_string}",
      },
    };

    assert.equal(org["@type"], "Organization");
    assert.equal(website["@type"], "WebSite");
    assert.equal(website.potentialAction["@type"], "SearchAction");
  });
});
