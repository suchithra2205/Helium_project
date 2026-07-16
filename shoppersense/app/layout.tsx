import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopperSense — AI Ecommerce Personalization Engine",
  description:
    "Classify shopper intent in real time using AI. Get confidence scores, behavioral evidence, and actionable personalization recommendations.",
  keywords: ["ecommerce", "personalization", "AI", "shopper intent", "CRO"],
  openGraph: {
    title: "ShopperSense",
    description: "AI-powered shopper intent classification engine",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
