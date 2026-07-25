'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121010] text-white" style={{fontFamily: "'Space Grotesk', system-ui, sans-serif"}}>
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <pre className="text-[#00ff88] text-xs md:text-sm leading-tight mb-8 opacity-80">
{`
  ____  ____  ____  ____  ____  ____  ____  ____  ____  ____
 / ___\\/ ___\\/ ___\\/ ___\\/ ___\\/ ___\\/ ___\\/ ___\\/ ___\\/ ___\\
 \\   \\\\   \\\\   \\\\   \\\\   \\\\   \\\\   \\\\   \\\\   \\\\   \\\\   \\\\
  \\___\\\\___\\\\___\\\\___\\\\___\\\\___\\\\___\\\\___\\\\___\\\\___\\\\___\\
`}
        </pre>
        <h1 className="text-4xl md:text-6xl font-bold tracking-wider mb-4">
          SPECTRACANVAS
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 mb-2">
          Your Creative Spectrum, One Canvas
        </p>
        <p className="text-sm text-neutral-500 mb-10 max-w-xl mx-auto">
          AI-powered creative suite that transforms ideas into brand identity, 
          pixel art, and content scripts.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-8 py-4 bg-[#00ff88] text-black font-bold text-sm tracking-wider hover:bg-[#00cc6a] transition-colors"
        >
          [ START CREATING ]
        </Link>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: 'B', title: 'BRAND', desc: 'Logo, colors, fonts, mockups', href: '/create/brand' },
            { icon: 'P', title: 'PIXEL', desc: 'Sprites, animations, sheets', href: '/create/pixel' },
            { icon: 'C', title: 'CONTENT', desc: 'Scripts, storyboards, captions', href: '/create/content' },
            { icon: 'M', title: 'MOOD', desc: 'Audio analysis, style sync', href: '/create/brand' },
          ].map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="border border-[#222] bg-[#111] p-6 hover:border-[#00ff88] transition-colors group"
            >
              <div className="w-12 h-12 border-2 border-[#00ff88] flex items-center justify-center mb-4 group-hover:bg-[#00ff88] group-hover:text-black">
                <span className="text-[#00ff88] text-xl font-bold">{f.icon}</span>
              </div>
              <h3 className="text-sm font-bold tracking-wider mb-1">{f.title}</h3>
              <p className="text-xs text-neutral-500">{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="border border-[#222] bg-[#111] p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-[#00ff88]">4</div>
              <div className="text-xs text-neutral-500">MODULES</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#00ff88]">AI</div>
              <div className="text-xs text-neutral-500">POWERED</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#00ff88]">1</div>
              <div className="text-xs text-neutral-500">PLATFORM</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#00ff88]">0$</div>
              <div className="text-xs text-neutral-500">COST</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#222] py-8 text-center">
        <p className="text-xs text-neutral-500">
          Team Spectriad &mdash; Three Mind One Solution &mdash; IBM AI Builders Challenge 2026
        </p>
      </div>
    </div>
  );
}
