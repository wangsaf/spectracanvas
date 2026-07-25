'use client';

import Link from 'next/link';

export default function DashboardPage() {
  const quickStarts = [
    { title: 'BRAND STUDIO', desc: 'Generate brand identity', href: '/create/brand', icon: 'B' },
    { title: 'PIXEL STUDIO', desc: 'Create pixel art sprites', href: '/create/pixel', icon: 'P' },
    { title: 'CONTENT STUDIO', desc: 'Generate scripts & captions', href: '/create/content', icon: 'C' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="text-xs text-neutral-600">// DASHBOARD</div>
          <h1 className="text-2xl tracking-wider mt-2">SPECTRACANVAS</h1>
          <p className="text-sm text-neutral-400 mt-1">Choose a studio to start creating.</p>
        </div>

        {/* Quick Start */}
        <div className="mb-8">
          <div className="text-xs text-neutral-600 mb-4">// QUICK START</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickStarts.map(qs => (
              <Link
                key={qs.title}
                href={qs.href}
                className="border border-[#222] bg-[#111] p-6 hover:border-[#00ff88] transition-colors group"
              >
                <div className="w-10 h-10 border-2 border-[#00ff88] flex items-center justify-center mb-3">
                  <span className="text-[#00ff88] font-bold">{qs.icon}</span>
                </div>
                <h3 className="text-sm font-bold tracking-wider">{qs.title}</h3>
                <p className="text-xs text-neutral-500 mt-1">{qs.desc}</p>
                <div className="text-xs text-[#00ff88] mt-3 group-hover:underline">START →</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div>
          <div className="text-xs text-neutral-600 mb-4">// RECENT PROJECTS</div>
          <div className="border border-[#222] bg-[#111] p-8 text-center">
            <div className="text-xs text-neutral-600">No projects yet</div>
            <div className="text-xs text-neutral-700 mt-1">Create your first project above</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-xs text-neutral-500 hover:text-white">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
