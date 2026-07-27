'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const DEMOS = [
  {
    id: 'brand',
    title: 'BRAND DEMO',
    desc: 'Generate a brand for an indie game studio',
    icon: 'B',
    endpoint: '/api/brand/generate',
    payload: {
      name: 'Pixel Forge Studios',
      industry: 'gaming',
      values: ['Creative', 'Innovative', 'Bold'],
      targetAudience: 'Indie game enthusiasts aged 18-35 who love retro aesthetics and unique gameplay',
    },
  },
  {
    id: 'pixel',
    title: 'PIXEL DEMO',
    desc: 'Create a pixel art knight character',
    icon: 'P',
    endpoint: '/api/pixel/generate',
    payload: {
      description: 'A brave knight with silver armor and a red cape, holding a sword',
      style: '16-bit',
      size: 32,
    },
  },
  {
    id: 'content',
    title: 'CONTENT DEMO',
    desc: 'Generate a TikTok script for game launch',
    icon: 'C',
    endpoint: '/api/content/generate',
    payload: {
      topic: 'retro pixel art game launch',
      platform: 'TikTok',
      tone: 'casual',
      duration: 30,
    },
  },
];

export default function DemoPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDemo = async (demo: typeof DEMOS[0]) => {
    setLoading(demo.id);
    setErrors(prev => ({ ...prev, [demo.id]: '' }));

    try {
      const res = await fetch(demo.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demo.payload),
      });
      const data = await res.json();

      if (data.success) {
        setResults(prev => ({ ...prev, [demo.id]: data.data }));
      } else {
        setErrors(prev => ({ ...prev, [demo.id]: data.error || 'Generation failed' }));
      }
    } catch {
      setErrors(prev => ({ ...prev, [demo.id]: 'Network error' }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#ffffff] p-4 md:p-8" style={{ fontFamily: "'DM Sans', 'Space Grotesk', system-ui, sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-xs text-[#71717a] hover:text-[#ffffff] transition-colors">
          ← HOME
        </Link>
        <h1 className="text-2xl font-bold tracking-wider mt-4" style={{ fontFamily: "'Instrument Serif', serif" }}>DEMO</h1>
        <p className="text-sm text-[#a1a1aa] mt-2">Try SpectraCanvas with pre-filled examples. Click to generate instantly.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {DEMOS.map((demo) => (
            <div
              key={demo.id}
              className="border border-[#27272a] rounded bg-[#0a0a0a] p-6 transition-all hover:border-[#ffffff]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center border border-[#ffffff] rounded">
                  <span className="font-bold text-lg" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{demo.icon}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wider">{demo.title}</h3>
                  <p className="text-xs text-[#71717a]">{demo.desc}</p>
                </div>
              </div>

              <Button
                onClick={() => handleDemo(demo)}
                disabled={loading === demo.id}
                className="w-full"
              >
                {loading === demo.id ? '[ GENERATING... ]' : '[ TRY IT ]'}
              </Button>

              {errors[demo.id] && (
                <p className="text-xs text-red-500 mt-2">{errors[demo.id]}</p>
              )}

              {results[demo.id] && (
                <div className="mt-4 p-3 border border-[#27272a] rounded bg-[#000000]">
                  <p className="text-xs font-bold text-[#71717a] mb-2">RESULT</p>
                  <DemoResult id={demo.id} data={results[demo.id]} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[#71717a] mb-4">Want the full experience?</p>
          <Link href="/dashboard">
            <Button>OPEN DASHBOARD</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function DemoResult({ id, data }: { id: string; data: unknown }) {
  const d = data as Record<string, unknown>;

  if (id === 'brand') {
    const colors = d.colors as Record<string, Record<string, string>> | undefined;
    const personality = d.personality as Record<string, unknown> | undefined;
    return (
      <div className="space-y-2">
        <p className="text-xs"><span className="text-[#71717a]">Name:</span> {String(d.name)}</p>
        <p className="text-xs"><span className="text-[#71717a]">Tone:</span> {String(personality?.tone || 'N/A')}</p>
        <p className="text-xs"><span className="text-[#71717a]">Style:</span> {String(personality?.style || 'N/A')}</p>
        {colors?.primary && (
          <div className="flex gap-1 mt-2">
            {Object.entries(colors.primary).slice(0, 3).map(([shade, hex]) => (
              <div
                key={shade}
                className="w-6 h-6 rounded border border-[#27272a]"
                style={{ backgroundColor: hex }}
                title={`${shade}: ${hex}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (id === 'pixel') {
    return (
      <div className="space-y-2">
        <p className="text-xs"><span className="text-[#71717a]">Size:</span> {String(d.size)}x{String(d.size)}</p>
        <p className="text-xs"><span className="text-[#71717a]">Style:</span> {String(d.style)}</p>
        <p className="text-xs"><span className="text-[#71717a]">Colors:</span> {Array.isArray(d.palette) ? d.palette.length : 0}</p>
      </div>
    );
  }

  if (id === 'content') {
    const script = d.script as Record<string, unknown> | undefined;
    const hooks = script?.hooks as Array<Record<string, unknown>> | undefined;
    return (
      <div className="space-y-2">
        {hooks?.slice(0, 2).map((h, i) => (
          <p key={i} className="text-xs text-[#a1a1aa]">&ldquo;{String(h.text)}&rdquo;</p>
        ))}
      </div>
    );
  }

  return <p className="text-xs text-[#71717a]">Generated successfully</p>;
}
