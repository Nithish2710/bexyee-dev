import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bexyee.com";

  const staticRoutes = [
    { url: `${base}/`, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${base}/products`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${base}/products/bengaluru-tee`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/cities`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/cities/bengaluru`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/cities/mumbai`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/cities/delhi`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/collections`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/collections/monsoon-2026`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/collections/winter-grid-2026`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/collections/coastal-dusk-2027`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/blog`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/blog/engineering-320-gsm-super-loopknit`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/blog/signal-after-rain-visual-system`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/blog/zero-plastic-delivery-standards`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/lookbook`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/stories`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/stories/midnight-cyclists-mg-road`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/stories/under-bandra-worli-sea-link`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/stories/neon-alleyways-chandni-chowk`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/about`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/achievements`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/search`, changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${base}/faq`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/size-guide`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/track`, changeFrequency: "always" as const, priority: 0.5 },
    { url: `${base}/account`, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${base}/account/orders`, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${base}/account/profile`, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${base}/account/addresses`, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${base}/account/security`, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${base}/account/wishlist`, changeFrequency: "monthly" as const, priority: 0.4 },
  ];

  const legalRoutes = ["privacy", "terms", "shipping", "refunds", "contact"].map((slug) => ({
    url: `${base}/legal/${slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [...staticRoutes, ...legalRoutes];
}