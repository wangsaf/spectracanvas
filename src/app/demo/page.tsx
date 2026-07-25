'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const demos = [
  {
    id: 'brand',
    title: 'BRAND STUDIO DEMO',
    description: 'See how Brand Studio generates a complete identity for a tech startup.',
    preview: {
      name: 'NovaTech',
      industry: 'SaaS / AI',
      style: 'Modern, Minimal, Tech-forward',
      colors: ['#00ff88', '#0a0a0a', '#1a1a2e', '#e0e0e0', '#16213e'],
    },
    href: '/create/brand',
    prefilledData: {
      brandName: 'NovaTech',
      industry: 'SaaS / AI Platform',
      style: 'Modern, Minimal, Tech-forward',
      targetAudience: 'Developers and Tech Teams',
      values: 'Innovation, Simplicity, Speed',
    },
  },
  {
    id: 'pixel',
    title: 'PIXEL STUDIO DEMO',
    description: 'Generate a retro game character sprite with animation frames.',
    preview: {
      character: 'Space Explorer',
      size: '32x32',
      frames: '4 walk cycle',
      palette: 'Limited (8 colors)',
    },
    href: '/create/pixel',
    prefilledData: {
      character: 'Space Explorer',
      size: '32',
      style: 'Retro 8-bit',
      animation: 'Walk cycle',
      palette: 'Limited',
    },
  },
  {
    id: 'content',
    title: 'CONTENT STUDIO DEMO',
    description: 'Generate a social media script, storyboard, and content calendar.',
    preview: {
      type: 'Product Launch',
      platform: 'Instagram + Twitter',
      duration: '30s video script',
      posts: '7-day calendar',
    },
    href: '/create/content',
    prefilledData: {
      topic: 'AI Product Launch',
      platform: 'Instagram',
      tone: 'Professional yet approachable',
      duration: '30 seconds',
      goal: 'Drive signups for beta launch',
    },
  },
];

export default function DemoPage() {
  const router = useRouter();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const handleTryIt = (demo: typeof demos[0]) => {
    // Store prefilled data in sessionStorage for the target page
    sessionStorage.setItem(
      `spectracanvas-prefill-${demo.id}`,
      JSON.stringify(demo.prefilledData)
    );
    router.push(demo.href);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-xs text-[#555] mb-2">// DEMO</div>
          <h1 className="font-mono text-2xl md:text-3xl tracking-wider">
            SEE IT IN ACTION
          </h1>
          <p className="font-mono text-sm text-[#888] mt-2">
            Pre-filled examples for each module. Click [TRY IT] to open a module
            with sample data pre-loaded.
          </p>
        </div>

        {/* Demo Cards */}
        <div className="space-y-6">
          {demos.map((demo) => (
            <div
              key={demo.id}
              className="border border-[#222] bg-[#111] transition-colors hover:border-[#333]"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="font-mono text-sm tracking-wider mb-2 text-[#00ff88]">
                      {demo.title}
                    </h2>
                    <p className="font-mono text-xs text-[#888] mb-4">
                      {demo.description}
                    </p>

                    {/* Preview Data */}
                    <div className="border border-[#222] bg-[#0a0a0a] p-4">
                      <div className="font-mono text-[10px] text-[#555] mb-3">
                        // PREVIEW DATA
                      </div>
                      <div className="space-y-1">
                        {Object.entries(demo.preview).map(([key, value]) => (
                          <div key={key} className="flex gap-4">
                            <span className="font-mono text-[11px] text-[#555] w-24 shrink-0">
                              {key.toUpperCase()}:
                            </span>
                            <span className="font-mono text-[11px] text-white">
                              {Array.isArray(value) ? value.join(' | ') : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prefilled Form Data */}
                    {activeDemo === demo.id && (
                      <div className="mt-4 border border-[#00ff88] bg-[#0a0a0a] p-4">
                        <div className="font-mono text-[10px] text-[#00ff88] mb-3">
                          // PREFILLED INPUT
                        </div>
                        <div className="space-y-1">
                          {Object.entries(demo.prefilledData).map(
                            ([key, value]) => (
                              <div key={key} className="flex gap-4">
                                <span className="font-mono text-[11px] text-[#555] w-32 shrink-0">
                                  {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
                                </span>
                                <span className="font-mono text-[11px] text-white">
                                  {value}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col gap-3 shrink-0">
                    <button
                      onClick={() => handleTryIt(demo)}
                      className="font-mono text-xs px-4 py-2 bg-[#00ff88] text-[#0a0a0a] hover:bg-[#00cc6a] transition-colors"
                    >
                      [ TRY IT ]
                    </button>
                    <button
                      onClick={() =>
                        setActiveDemo(
                          activeDemo === demo.id ? null : demo.id
                        )
                      }
                      className="font-mono text-xs px-4 py-2 border border-[#222] text-[#888] hover:text-white hover:border-[#00ff88] transition-colors"
                    >
                      {activeDemo === demo.id
                        ? '[ HIDE ]'
                        : '[ INSPECT ]'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Nav */}
        <div className="mt-12 flex gap-4">
          <a
            href="/dashboard"
            className="font-mono text-xs text-[#555] hover:text-[#00ff88] transition-colors"
          >
            [ DASHBOARD ]
          </a>
          <a
            href="/"
            className="font-mono text-xs text-[#555] hover:text-[#00ff88] transition-colors"
          >
            [ HOME ]
          </a>
        </div>
      </div>
    </div>
  );
}
