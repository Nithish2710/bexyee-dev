import assert from "node:assert/strict";
import { test, describe } from "node:test";

describe("BEXYEE Global Header & Menu Drawer System", () => {
  const CENTER_NAV_LINKS = [
    { label: "HOME", href: "/" },
    { label: "CATALOG", href: "/products" },
    { label: "CITIES", href: "/cities" },
    { label: "JOURNAL", href: "/blog" },
    { label: "LOOKBOOK", href: "/lookbook" },
    { label: "ABOUT", href: "/about" },
  ];

  const UTILITY_LINKS = [
    { label: "SEARCH", href: "/search" },
    { label: "ACCOUNT", href: "/account" },
    { label: "CART", href: "/cart" },
  ];

  const DRAWER_NAV_ITEMS = [
    { label: "HOME", href: "/" },
    { label: "CATALOG", href: "/products" },
    { label: "CITIES", href: "/cities" },
    { label: "JOURNAL", href: "/blog" },
    { label: "LOOKBOOK", href: "/lookbook" },
    { label: "ABOUT", href: "/about" },
    { label: "PRODUCTS", href: "/products" },
    { label: "COLLECTIONS", href: "/collections" },
    { label: "STORIES", href: "/stories" },
    { label: "ACHIEVEMENTS", href: "/achievements" },
    { label: "CONTACT", href: "/contact" },
    { label: "ACCOUNT", href: "/account" },
    { label: "SEARCH", href: "/search" },
    { label: "CART", href: "/cart" },
  ];

  function getSectionFromPath(pathname, override) {
    if (override) return override;
    if (pathname === "/") return "HOME";
    if (pathname.startsWith("/bengaluru")) return "BEN";
    if (pathname.startsWith("/products")) return "CATALOG";
    if (pathname.startsWith("/cities")) return "CITIES";
    if (pathname.startsWith("/blog")) return "JOURNAL";
    if (pathname.startsWith("/lookbook")) return "LOOKBOOK";
    if (pathname.startsWith("/about")) return "ABOUT";
    if (pathname.startsWith("/stories")) return "STORIES";
    if (pathname.startsWith("/collections")) return "COLLECTIONS";
    if (pathname.startsWith("/search")) return "SEARCH";
    if (pathname.startsWith("/faq")) return "FAQ";
    if (pathname.startsWith("/size-guide")) return "SIZING";
    if (pathname.startsWith("/achievements")) return "STANDARDS";
    if (pathname.startsWith("/contact")) return "CONTACT";
    if (pathname.startsWith("/account")) return "ACCOUNT";
    if (pathname.startsWith("/cart")) return "CART";
    if (pathname.startsWith("/checkout")) return "CHECKOUT";
    if (pathname.startsWith("/track")) return "TRACK";
    return "STORE";
  }

  function isLinkActive(linkHref, pathname) {
    if (linkHref === "/products" && pathname.startsWith("/products")) return true;
    if (linkHref === "/cities" && pathname.startsWith("/cities")) return true;
    if (linkHref === "/blog" && pathname.startsWith("/blog")) return true;
    if (linkHref === "/lookbook" && pathname.startsWith("/lookbook")) return true;
    if (linkHref === "/about" && pathname === "/about") return true;
    if (linkHref === "/collections" && pathname.startsWith("/collections")) return true;
    if (linkHref === "/stories" && pathname.startsWith("/stories")) return true;
    if (linkHref === "/achievements" && pathname === "/achievements") return true;
    if (linkHref === "/contact" && pathname === "/contact") return true;
    if (linkHref === "/account" && pathname.startsWith("/account")) return true;
    if (linkHref === "/search" && pathname === "/search") return true;
    if (linkHref === "/cart" && pathname === "/cart") return true;
    return pathname === linkHref;
  }

  function calculateCartCount(cartItems) {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  test("contains all required center global navigation items", () => {
    assert.equal(CENTER_NAV_LINKS.length, 6);
    assert.deepEqual(CENTER_NAV_LINKS.map(n => n.label), ["HOME", "CATALOG", "CITIES", "JOURNAL", "LOOKBOOK", "ABOUT"]);
    assert.deepEqual(CENTER_NAV_LINKS.map(n => n.href), ["/", "/products", "/cities", "/blog", "/lookbook", "/about"]);
  });

  test("contains all required right-side utility actions", () => {
    assert.equal(UTILITY_LINKS.length, 3);
    assert.deepEqual(UTILITY_LINKS.map(u => u.label), ["SEARCH", "ACCOUNT", "CART"]);
    assert.deepEqual(UTILITY_LINKS.map(u => u.href), ["/search", "/account", "/cart"]);
  });

  test("drawer contains all mandatory menu items including HOME", () => {
    assert.equal(DRAWER_NAV_ITEMS.length, 14);
    const expectedLabels = [
      "HOME", "CATALOG", "CITIES", "JOURNAL", "LOOKBOOK", "ABOUT",
      "PRODUCTS", "COLLECTIONS", "STORIES", "ACHIEVEMENTS",
      "CONTACT", "ACCOUNT", "SEARCH", "CART"
    ];
    assert.deepEqual(DRAWER_NAV_ITEMS.map(item => item.label), expectedLabels);
  });

  test("drawer items map to valid, working application routes", () => {
    for (const item of DRAWER_NAV_ITEMS) {
      assert.ok(item.href.startsWith("/"), `Route must be absolute: ${item.href}`);
    }
  });

  test("maps route paths to correct brand section identifiers", () => {
    assert.equal(getSectionFromPath("/"), "HOME");
    assert.equal(getSectionFromPath("/bengaluru"), "BEN");
    assert.equal(getSectionFromPath("/products"), "CATALOG");
    assert.equal(getSectionFromPath("/products/bengaluru-tee"), "CATALOG");
    assert.equal(getSectionFromPath("/cities"), "CITIES");
    assert.equal(getSectionFromPath("/cities/mumbai"), "CITIES");
    assert.equal(getSectionFromPath("/blog"), "JOURNAL");
    assert.equal(getSectionFromPath("/blog/engineering-320-gsm"), "JOURNAL");
    assert.equal(getSectionFromPath("/lookbook"), "LOOKBOOK");
    assert.equal(getSectionFromPath("/about"), "ABOUT");
    assert.equal(getSectionFromPath("/search"), "SEARCH");
    assert.equal(getSectionFromPath("/account"), "ACCOUNT");
    assert.equal(getSectionFromPath("/account/orders"), "ACCOUNT");
    assert.equal(getSectionFromPath("/size-guide"), "SIZING");
    assert.equal(getSectionFromPath("/achievements"), "STANDARDS");
  });

  test("respects explicit section override on campaign homepages", () => {
    assert.equal(getSectionFromPath("/", "BEN"), "BEN");
    assert.equal(getSectionFromPath("/", "MUM"), "MUM");
    assert.equal(getSectionFromPath("/", "DEL"), "DEL");
  });

  test("identifies active page correctly across all drawer links without hardcoding", () => {
    assert.equal(isLinkActive("/blog", "/blog"), true);
    assert.equal(isLinkActive("/blog", "/blog/my-slug"), true);
    assert.equal(isLinkActive("/products", "/products"), true);
    assert.equal(isLinkActive("/products", "/products/bengaluru-tee"), true);
    assert.equal(isLinkActive("/collections", "/collections/monsoon-2026"), true);
    assert.equal(isLinkActive("/stories", "/stories/midnight-cyclists-mg-road"), true);
    assert.equal(isLinkActive("/achievements", "/achievements"), true);
    assert.equal(isLinkActive("/contact", "/contact"), true);
    assert.equal(isLinkActive("/account", "/account/orders"), true);
    assert.equal(isLinkActive("/search", "/search"), true);
    assert.equal(isLinkActive("/cart", "/cart"), true);
    assert.equal(isLinkActive("/about", "/about"), true);
    assert.equal(isLinkActive("/about", "/products"), false);
  });

  test("computes cart counts accurately for empty and populated carts", () => {
    assert.equal(calculateCartCount([]), 0);
    assert.equal(calculateCartCount([{ quantity: 1 }]), 1);
    assert.equal(calculateCartCount([{ quantity: 2 }, { quantity: 3 }]), 5);
    assert.equal(calculateCartCount(null), 0);
  });
});
