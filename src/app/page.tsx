'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#1c1915', color: '#f0e8dc', fontFamily: "'DM Sans', 'Space Grotesk', system-ui, sans-serif" }}>
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
        {/* Pixel art decorative line */}
        <div className="flex justify-center gap-1 mb-8">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-2 h-2" style={{ background: i % 3 === 0 ? '#d9453b' : '#3a322a', borderRadius: '2px' }} />
          ))}
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-3" style={{ fontFamily: "'Instrument Serif', serif", color: '#f0e8dc', letterSpacing: '-1px' }}>
          SpectraCanvas
        </h1>
        <p className="text-base md:text-lg mb-2" style={{ color: '#a09484', fontFamily: "'DM Sans', sans-serif" }}>
          Your Creative Spectrum, One Canvas
        </p>
        <p className="text-sm mb-12 max-w-md mx-auto" style={{ color: '#6b5f52' }}>
          Brand identity, pixel art, and content scripts.
          Built for creators who ship fast.
        </p>

        <Link
          href="/dashboard"
          className="inline-block px-8 py-3 text-sm font-bold tracking-wider transition-all"
          style={{
            background: '#d9453b',
            color: '#fff',
            borderRadius: '4px',
            fontFamily: "'Space Grotesk', monospace",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#b8382f'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#d9453b'; }}
        >
          START CREATING
        </Link>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { letter: 'B', title: 'BRAND', desc: 'Colors, fonts, logos', href: '/create/brand' },
            { letter: 'P', title: 'PIXEL', desc: 'Sprites, sheets, poses', href: '/create/pixel' },
            { letter: 'C', title: 'CONTENT', desc: 'Scripts for TikTok, IG, YT', href: '/create/content' },
          ].map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="block p-6 transition-all group"
              style={{
                border: '2px solid #3a322a',
                borderRadius: '4px',
                background: '#241f1a',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d9453b'; e.currentTarget.style.background = '#2e2720'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#3a322a'; e.currentTarget.style.background = '#241f1a'; }}
            >
              <div className="w-10 h-10 flex items-center justify-center mb-4" style={{ border: '2px solid #d9453b', borderRadius: '4px' }}>
                <span className="font-bold text-lg" style={{ color: '#d9453b', fontFamily: "'JetBrains Mono', monospace" }}>{f.letter}</span>
              </div>
              <h3 className="text-sm font-bold tracking-wider mb-1" style={{ fontFamily: "'Space Grotesk', monospace", color: '#f0e8dc' }}>{f.title}</h3>
              <p className="text-xs" style={{ color: '#6b5f52' }}>{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-center text-sm font-bold tracking-wider mb-8" style={{ color: '#a09484', fontFamily: "'Space Grotesk', monospace" }}>HOW IT WORKS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Define your brand', desc: 'Enter a name and vibe. Get colors, fonts, and a logo in seconds.' },
            { step: '02', title: 'Create pixel art', desc: 'Describe a character. Choose a style. Download game-ready sprites.' },
            { step: '03', title: 'Write content', desc: 'Pick a platform and tone. Get scripts with hooks, timestamps, and CTAs.' },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="text-2xl font-bold mb-2" style={{ color: '#d9453b', fontFamily: "'JetBrains Mono', monospace" }}>{s.step}</div>
              <h3 className="text-sm font-bold mb-1" style={{ color: '#f0e8dc' }}>{s.title}</h3>
              <p className="text-xs" style={{ color: '#6b5f52' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="p-8" style={{ border: '2px solid #3a322a', borderRadius: '4px', background: '#241f1a' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '3', label: 'STUDIOS' },
              { value: '8', label: 'MOODS' },
              { value: '4', label: 'PLATFORMS' },
              { value: 'FREE', label: 'ALWAYS' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold mb-1" style={{ color: '#d9453b', fontFamily: "'Instrument Serif', serif" }}>{s.value}</div>
                <div className="text-xs tracking-wider" style={{ color: '#6b5f52', fontFamily: "'Space Grotesk', monospace" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 pb-16 text-center">
        <p className="text-sm mb-4" style={{ color: '#a09484' }}>Ready to create?</p>
        <Link
          href="/create/brand"
          className="inline-block px-6 py-2.5 text-xs font-bold tracking-wider transition-all"
          style={{
            border: '2px solid #d9453b',
            color: '#d9453b',
            borderRadius: '4px',
            fontFamily: "'Space Grotesk', monospace",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#d9453b'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d9453b'; }}
        >
          START WITH BRAND
        </Link>
      </div>

      {/* Footer */}
      <div className="py-8 text-center" style={{ borderTop: '2px solid #3a322a' }}>
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-2 h-2" style={{ background: i % 3 === 0 ? '#d9453b' : '#3a322a', borderRadius: '2px' }} />
          ))}
        </div>
        <p className="text-xs" style={{ color: '#6b5f52', fontFamily: "'Space Grotesk', monospace" }}>
          Team Spectriad - Three Mind One Solution - IBM AI Builders Challenge 2026
        </p>
      </div>
    </div>
  );
}
