'use client';

import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#fafafa] p-4 md:p-8" style={{ fontFamily: "'DM Sans', 'Space Grotesk', system-ui, sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-xs text-[#71717a] hover:text-[#fafafa]">← HOME</Link>
        <h1 className="text-2xl tracking-wider mt-4">DEMO</h1>
        <p className="text-sm text-[#a1a1aa] mt-2">Try SpectraCanvas with pre-filled examples.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link href="/create/brand" className="border border-[#27272a] rounded bg-[#0a0a0a] p-6 hover:border-[#ffffff] transition-colors">
            <h3 className="text-sm font-bold tracking-wider mb-2">BRAND DEMO</h3>
            <p className="text-xs text-[#71717a]">Generate a brand for an indie game studio</p>
            <div className="text-xs text-[#ffffff] mt-3">TRY IT →</div>
          </Link>
          <Link href="/create/pixel" className="border border-[#27272a] rounded bg-[#0a0a0a] p-6 hover:border-[#ffffff] transition-colors">
            <h3 className="text-sm font-bold tracking-wider mb-2">PIXEL DEMO</h3>
            <p className="text-xs text-[#71717a]">Create a pixel art knight character</p>
            <div className="text-xs text-[#ffffff] mt-3">TRY IT →</div>
          </Link>
          <Link href="/create/content" className="border border-[#27272a] rounded bg-[#0a0a0a] p-6 hover:border-[#ffffff] transition-colors">
            <h3 className="text-sm font-bold tracking-wider mb-2">CONTENT DEMO</h3>
            <p className="text-xs text-[#71717a]">Generate a TikTok script for game launch</p>
            <div className="text-xs text-[#ffffff] mt-3">TRY IT →</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
