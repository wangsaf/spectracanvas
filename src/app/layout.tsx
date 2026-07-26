import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpectraCanvas - Your Creative Spectrum, One Canvas",
  description: "Creative suite that transforms ideas into brand identity, pixel art, and content scripts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ background: '#1c1915', color: '#f0e8dc', fontFamily: "'DM Sans', 'Space Grotesk', system-ui, sans-serif" }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
