import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Navbar from '@/components/shared/navbar';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'SpectraCanvas',
  description: 'Your Creative Spectrum, One Canvas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#0a0a0a] text-white font-sans min-h-screen">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
