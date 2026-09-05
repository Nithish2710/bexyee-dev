import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES } from "../page";
import { StorefrontFooter } from "../../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../../src/components/navigation/GlobalHeader";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: "BEXYEE / Article Not Found" };
  return {
    title: `BEXYEE / JOURNAL — ${article.title}`,
    description: article.excerpt,
  };
}

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="JOURNAL" />

      <article style={{ maxWidth: "780px", margin: "0 auto", padding: "clamp(50px, 8vw, 100px) 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#8d8982", marginBottom: "16px" }}>
          <span>{article.category}</span>
          <span>{article.date} • {article.readingTime}</span>
        </div>

        <h1 style={{ fontSize: "clamp(28px, 5vw, 46px)", margin: "0 0 24px 0", letterSpacing: "-.06em", lineHeight: 1.1, color: "#fff" }}>
          {article.title}
        </h1>

        <p style={{ fontSize: "14px", color: "#a5a098", lineHeight: "1.7", borderBottom: "1px solid #242422", paddingBottom: "28px", margin: "0 0 36px 0" }}>
          {article.excerpt}
        </p>

        <div style={{ fontSize: "13px", lineHeight: "1.8", color: "#ccc8c0", display: "grid", gap: "20px" }}>
          {article.content
            .split("\n\n")
            .filter((block) => block.trim())
            .map((block, idx) => {
              if (block.startsWith("### ")) {
                return (
                  <h3 key={idx} style={{ fontSize: "16px", color: "#fff", margin: "20px 0 4px 0", letterSpacing: "-.02em" }}>
                    {block.replace("### ", "")}
                  </h3>
                );
              }
              if (block.startsWith("# ")) {
                return null;
              }
              if (block.startsWith("* ")) {
                return (
                  <ul key={idx} style={{ margin: "0 0 0 20px", padding: 0 }}>
                    {block.split("\n").map((li, liIdx) => (
                      <li key={liIdx} style={{ margin: "4px 0" }}>
                        {li.replace("* ", "")}
                      </li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx} style={{ margin: 0 }}>{block}</p>;
            })}
        </div>

        <div style={{ marginTop: "60px", paddingTop: "24px", borderTop: "1px solid #242422", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/blog" style={{ color: "#e52b20", fontSize: "10px", textDecoration: "none" }}>
            ← BACK TO JOURNAL
          </Link>
          <span style={{ fontSize: "9px", color: "#666" }}>AUTHOR: {article.author}</span>
        </div>
      </article>

      <StorefrontFooter />
    </main>
  );
}
