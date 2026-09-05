import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StorefrontFooter } from "../../../src/components/navigation/StorefrontFooter";
import { GlobalHeader } from "../../../src/components/navigation/GlobalHeader";

type StoryDetail = {
  slug: string;
  title: string;
  city: string;
  date: string;
  author: string;
  paragraphs: string[];
};

const STORIES: Record<string, StoryDetail> = {
  "midnight-cyclists-mg-road": {
    slug: "midnight-cyclists-mg-road",
    title: "The Midnight Cyclists of MG Road",
    city: "BENGALURU",
    date: "AUGUST 2026",
    author: "BEXYEE FIELD DESK",
    paragraphs: [
      "When the metro services close at 11:30 PM and the arterial flyovers empty out, Bengaluru undergoes a structural shift. The heat radiating off the day's asphalt begins to dissipate, replaced by the cool dampness of pre-monsoon air.",
      "A collective of fixed-gear couriers and night riders gather near Trinity Junction. Riding in close formation beneath amber streetlights, their movement is fluid, navigating the rain gutters and expansion joints of the elevated corridor.",
      "The BEXYEE Drop 001 heavy loopknit tee was field-tested alongside this crew—evaluating seam resistance under backpack friction, collar comfort during head checks, and thermal breathability in rapid weather transitions.",
    ],
  },
  "under-bandra-worli-sea-link": {
    slug: "under-bandra-worli-sea-link",
    title: "Under the Bandra-Worli Sea Link",
    city: "MUMBAI",
    date: "JULY 2026",
    author: "BEXYEE FIELD DESK",
    paragraphs: [
      "Beneath the massive concrete pillars anchoring the Sea Link to the Bandra coastline, the sonic profile is defined by rhythmic wave crashes and the hum of high-speed overhead traffic.",
      "Local skaters utilize the smooth concrete plazas for late-night flatground sessions. The ambient salt air tests the durability of cotton weaves—standard jersey breaks down and loses shape rapidly under coastal humidity.",
      "Our 320 GSM Super Loopknit was engineered specifically with high-twist combed cotton yarn to repel salt mist absorption and maintain structural rigidity.",
    ],
  },
  "neon-alleyways-chandni-chowk": {
    slug: "neon-alleyways-chandni-chowk",
    title: "Neon Alleyways of Chandni Chowk",
    city: "DELHI",
    date: "JUNE 2026",
    author: "BEXYEE FIELD DESK",
    paragraphs: [
      "At 3 AM, Old Delhi transforms. The chaotic daytime wholesale trade recedes, exposing centuries-old red sandstone facades framed by intricate overhead power lines and vibrant neon signboard reflections.",
      "Photographers and creators navigate the labyrinthine gallis, capturing high-contrast light leaks against Mughal archways. The visual tension between ancient stonework and modern urban decay forms the core inspiration for the upcoming Delhi winter drop.",
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = STORIES[slug];
  if (!story) return { title: "BEXYEE / Story Not Found" };
  return {
    title: `BEXYEE / STORIES — ${story.title}`,
    description: story.paragraphs[0],
  };
}

export function generateStaticParams() {
  return Object.keys(STORIES).map((slug) => ({ slug }));
}

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = STORIES[slug];

  if (!story) {
    notFound();
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0a", color: "#ede9e1", fontFamily: "var(--font-space-mono), monospace" }}>
      <GlobalHeader section="STORIES" />

      <article style={{ maxWidth: "780px", margin: "0 auto", padding: "clamp(50px, 8vw, 100px) 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#8d8982", marginBottom: "16px" }}>
          <span>{story.city}</span>
          <span>{story.date}</span>
        </div>

        <h1 style={{ fontSize: "clamp(28px, 5vw, 46px)", margin: "0 0 24px 0", letterSpacing: "-.06em", lineHeight: 1.1, color: "#fff" }}>
          {story.title}
        </h1>

        <div style={{ fontSize: "13px", lineHeight: "1.8", color: "#ccc8c0", display: "grid", gap: "20px" }}>
          {story.paragraphs.map((p, idx) => (
            <p key={idx} style={{ margin: 0 }}>
              {p}
            </p>
          ))}
        </div>

        <div style={{ marginTop: "60px", paddingTop: "24px", borderTop: "1px solid #242422", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/stories" style={{ color: "#e52b20", fontSize: "10px", textDecoration: "none" }}>
            ← BACK TO STORIES
          </Link>
          <span style={{ fontSize: "9px", color: "#666" }}>AUTHOR: {story.author}</span>
        </div>
      </article>

      <StorefrontFooter />
    </main>
  );
}
