'use client';

import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#1c1915] text-[#f0e8dc] p-4 md:p-8" style={{ fontFamily: "'DM Sans', 'Space Grotesk', system-ui, sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-xs text-[#6b5f52] hover:text-[#f0e8dc]">← HOME</Link>
        <h1 className="text-2xl tracking-wider mt-4">DEMO</h1>
        <p className="text-sm text-[#a09484] mt-2">Try SpectraCanvas with pre-filled examples.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link href="/create/brand" className="border border-[#3a322a] rounded bg-[#241f1a] p-6 hover:border-[#d9453b] transition-colors">
            <h3 className="text-sm font-bold tracking-wider mb-2">BRAND DEMO</h3>
            <p className="text-xs text-[#6b5f52]">Generate a brand for an indie game studio</p>
            <div className="text-xs text-[#d9453b] mt-3">TRY IT →</div>
          </Link>
          <Link href="/create/pixel" className="border border-[#3a322a] rounded bg-[#241f1a] p-6 hover:border-[#d9453b] transition-colors">
            <h3 className="text-sm font-bold tracking-wider mb-2">PIXEL DEMO</h3>
            <p className="text-xs text-[#6b5f52]">Create a pixel art knight character</p>
            <div className="text-xs text-[#d9453b] mt-3">TRY IT →</div>
          </Link>
          <Link href="/create/content" className="border border-[#3a322a] rounded bg-[#241f1a] p-6 hover:border-[#d9453b] transition-colors">
            <h3 className="text-sm font-bold tracking-wider mb-2">CONTENT DEMO</h3>
            <p className="text-xs text-[#6b5f52]">Generate a TikTok script for game launch</p>
            <div className="text-xs text-[#d9453b] mt-3">TRY IT →</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
