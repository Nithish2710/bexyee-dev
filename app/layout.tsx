import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import { MarketingScripts } from "../src/components/MarketingScripts";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "BEXYEE / Bengaluru Edition",
  description: "A limited uniform for Bengaluru.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}<MarketingScripts /></body>
    </html>
  );
}
