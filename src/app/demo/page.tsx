'use client';

import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-xs text-neutral-500 hover:text-white">← HOME</Link>
        <h1 className="text-2xl tracking-wider mt-4">DEMO</h1>
        <p className="text-sm text-neutral-400 mt-2">Try SpectraCanvas with pre-filled examples.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link href="/create/brand" className="border border-[#222] bg-[#111] p-6 hover:border-[#00ff88] transition-colors">
            <h3 className="text-sm font-bold tracking-wider mb-2">BRAND DEMO</h3>
            <p className="text-xs text-neutral-500">Generate a brand for an indie game studio</p>
            <div className="text-xs text-[#00ff88] mt-3">TRY IT →</div>
          </Link>
          <Link href="/create/pixel" className="border border-[#222] bg-[#111] p-6 hover:border-[#00ff88] transition-colors">
            <h3 className="text-sm font-bold tracking-wider mb-2">PIXEL DEMO</h3>
            <p className="text-xs text-neutral-500">Create a pixel art knight character</p>
            <div className="text-xs text-[#00ff88] mt-3">TRY IT →</div>
          </Link>
          <Link href="/create/content" className="border border-[#222] bg-[#111] p-6 hover:border-[#00ff88] transition-colors">
            <h3 className="text-sm font-bold tracking-wider mb-2">CONTENT DEMO</h3>
            <p className="text-xs text-neutral-500">Generate a TikTok script for game launch</p>
            <div className="text-xs text-[#00ff88] mt-3">TRY IT →</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
