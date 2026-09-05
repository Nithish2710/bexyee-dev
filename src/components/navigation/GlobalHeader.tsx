"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type GlobalHeaderProps = {
  section?: string;
  cartCountOverride?: number;
};

type NavItem = {
  label: string;
  href: string;
};

const CENTER_NAV_LINKS: NavItem[] = [
  { label: "SHOP", href: "/products" },
  { label: "NEW", href: "/product/bengaluru-tee" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "ABOUT", href: "/about" },
];

export const DRAWER_NAV_ITEMS: NavItem[] = [
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

export function GlobalHeader({ section, cartCountOverride }: GlobalHeaderProps) {
  const pathname = usePathname() || "/";
  const [localCartCount, setLocalCartCount] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try {
      const stored = JSON.parse(window.localStorage.getItem("bexyee_cart") ?? "[]") as Array<{ quantity: number }>;
      return stored.reduce((sum, item) => sum + (item.quantity || 1), 0);
    } catch {
      return 0;
    }
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const drawerPanelRef = useRef<HTMLDivElement | null>(null);
  const scrollYRef = useRef<number>(0);

  const cartCount = typeof cartCountOverride === "number" ? cartCountOverride : localCartCount;

  // Track window scroll for subtle glass/border transition
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync cart count from storage events
  useEffect(() => {
    function handleStorageSync() {
      try {
        const stored = JSON.parse(window.localStorage.getItem("bexyee_cart") ?? "[]") as Array<{ quantity: number }>;
        setLocalCartCount(stored.reduce((sum, item) => sum + (item.quantity || 1), 0));
      } catch {
        setLocalCartCount(0);
      }
    }
    window.addEventListener("storage", handleStorageSync);
    window.addEventListener("bexyee_cart_updated", handleStorageSync);
    return () => {
      window.removeEventListener("storage", handleStorageSync);
      window.removeEventListener("bexyee_cart_updated", handleStorageSync);
    };
  }, []);

  // Handle Scroll Lock, Scroll Restoration, Focus Trap, and Escape Key
  useEffect(() => {
    if (isMenuOpen) {
      // 1. Lock background scrolling while preserving exact scroll offset
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll"; // avoid layout jump

      // 2. Focus first interactive element in drawer
      const timer = setTimeout(() => {
        if (drawerPanelRef.current) {
          const focusable = drawerPanelRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length > 0) {
            focusable[0].focus();
          }
        }
      }, 50);

      // 3. Escape key & Focus Trap handler
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
          setIsMenuOpen(false);
          return;
        }

        if (e.key === "Tab" && drawerPanelRef.current) {
          const focusable = Array.from(
            drawerPanelRef.current.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          );
          if (focusable.length === 0) return;

          const firstElement = focusable[0];
          const lastElement = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      }

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", handleKeyDown);
        // Restore background scroll position
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflowY = "";
        window.scrollTo(0, scrollYRef.current);
      };
    } else {
      // When closed, restore focus to trigger button if previously opened
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    }
  }, [isMenuOpen]);

  // Determine section label automatically if not explicitly provided
  let displaySection = section;
  if (!displaySection) {
    if (pathname === "/") displaySection = "HOME";
    else if (pathname.startsWith("/bengaluru")) displaySection = "BEN";
    else if (pathname.startsWith("/products")) displaySection = "CATALOG";
    else if (pathname.startsWith("/cities")) displaySection = "CITIES";
    else if (pathname.startsWith("/blog")) displaySection = "JOURNAL";
    else if (pathname.startsWith("/lookbook")) displaySection = "LOOKBOOK";
    else if (pathname.startsWith("/about")) displaySection = "ABOUT";
    else if (pathname.startsWith("/stories")) displaySection = "STORIES";
    else if (pathname.startsWith("/collections")) displaySection = "COLLECTIONS";
    else if (pathname.startsWith("/search")) displaySection = "SEARCH";
    else if (pathname.startsWith("/faq")) displaySection = "FAQ";
    else if (pathname.startsWith("/size-guide")) displaySection = "SIZING";
    else if (pathname.startsWith("/achievements")) displaySection = "STANDARDS";
    else if (pathname.startsWith("/contact")) displaySection = "CONTACT";
    else if (pathname.startsWith("/account")) displaySection = "ACCOUNT";
    else if (pathname.startsWith("/cart")) displaySection = "CART";
    else if (pathname.startsWith("/checkout")) displaySection = "CHECKOUT";
    else if (pathname.startsWith("/track")) displaySection = "TRACK";
    else displaySection = "STORE";
  }

  function isActive(href: string): boolean {
    if (href === "/" && pathname === "/") return true;
    if (href === "/products" && pathname.startsWith("/products")) return true;
    if (href === "/cities" && pathname.startsWith("/cities")) return true;
    if (href === "/blog" && pathname.startsWith("/blog")) return true;
    if (href === "/lookbook" && pathname.startsWith("/lookbook")) return true;
    if (href === "/about" && pathname === "/about") return true;
    if (href === "/collections" && pathname.startsWith("/collections")) return true;
    if (href === "/stories" && pathname.startsWith("/stories")) return true;
    if (href === "/achievements" && pathname === "/achievements") return true;
    if (href === "/contact" && pathname === "/contact") return true;
    if (href === "/account" && pathname.startsWith("/account")) return true;
    if (href === "/search" && pathname === "/search") return true;
    if (href === "/cart" && pathname === "/cart") return true;
    return pathname === href;
  }

  return (
    <header className={`global-header ${isScrolled ? "scrolled" : ""}`} role="banner">
      <nav className="global-nav" aria-label="Main Navigation">
        {/* LEFT: Brand Wordmark + Section Identifier */}
        <div className="global-nav-left">
          <Link href="/" className="global-wordmark" aria-label="BEXYEE Homepage">
            BEXYEE<span className="brand-slash">/</span>
            <span className="brand-section">{displaySection}</span>
          </Link>
        </div>

        {/* CENTER: Global Desktop Navigation */}
        <ul className="global-nav-center" role="list">
          {CENTER_NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href} role="listitem">
                <Link
                  href={link.href}
                  className={`global-nav-link ${active ? "active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                  {active && <span className="active-dot" aria-hidden="true" />}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* RIGHT: Global Utilities (Search, Account, Cart, Menu) */}
        <div className="global-nav-right">
          <Link
            href="/search"
            className={`global-util-link ${pathname === "/search" ? "active" : ""}`}
            aria-label="Search archive"
          >
            SEARCH
          </Link>

          <Link
            href="/account"
            className={`global-util-link ${pathname.startsWith("/account") ? "active" : ""}`}
            aria-label="Collector account"
          >
            ACCOUNT
          </Link>

          <Link
            href="/cart"
            className={`global-util-link global-cart-link ${pathname === "/cart" ? "active" : ""}`}
            aria-label={`Shopping cart containing ${cartCount} items`}
          >
            CART <span className="cart-badge">({cartCount})</span>
          </Link>

          {/* Menu Trigger Button */}
          <button
            ref={triggerRef}
            type="button"
            className="global-menu-btn"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="global-nav-drawer"
          >
            MENU <span className="menu-plus">+</span>
          </button>
        </div>
      </nav>

      {/* FULL-SCREEN NAVIGATION DRAWER OVERLAY */}
      {isMenuOpen && (
        <div
          id="global-nav-drawer"
          className="global-mobile-drawer drawer-open"
          role="dialog"
          aria-modal="true"
          aria-label="Global Navigation Menu"
        >
          {/* Backdrop: Clicking outside closes the drawer */}
          <div
            className="drawer-backdrop"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sliding Panel */}
          <div className="drawer-panel" ref={drawerPanelRef}>
            <div className="drawer-header">
              <div className="global-wordmark">
                BEXYEE<span className="brand-slash">/</span>
                <span className="brand-section">{displaySection}</span>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="drawer-nav">
              <ul className="drawer-links" role="list">
                {DRAWER_NAV_ITEMS.map((item, index) => {
                  const active = isActive(item.href);
                  const isCartItem = item.label === "CART";
                  return (
                    <li key={`${item.label}-${item.href}-${index}`} role="listitem">
                      <Link
                        href={item.href}
                        className={`drawer-link ${active ? "active" : ""}`}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>
                          {item.label}
                          {isCartItem && <span className="drawer-cart-count"> ({cartCount})</span>}
                        </span>
                        {active && <span className="drawer-active-indicator" aria-hidden="true">●</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="drawer-footer">
              <span>© 2026 BEXYEE STUDIO</span>
              <span>12.9716° N, 77.5946° E</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
