import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";

// The dolinesystems.com pairing: Bricolage Grotesque for headings, Figtree for everything else.
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const body = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Doline Store — point of sale, inventory and credit for your shop", template: "%s · Doline Store" },
  description:
    "Doline Store rings up sales, tracks every batch on the shelf, keeps your credit book straight and shows what the week earned. Free to download and use.",
  applicationName: "Doline Store",
};

export const viewport: Viewport = { themeColor: "#013984", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
