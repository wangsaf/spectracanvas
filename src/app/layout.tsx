import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpectraCanvas - Your Creative Spectrum, One Canvas",
  description: "AI-powered creative suite that transforms ideas into brand identity, pixel art, and content scripts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white antialiased font-mono">
        <Navbar />
        {children}
      </body>
    </html>
  );
}