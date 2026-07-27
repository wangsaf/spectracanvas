'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { TypographySystem } from '@/lib/types';

interface FontPreviewProps {
  typography: TypographySystem;
}

export function FontPreview({ typography }: FontPreviewProps) {
  useEffect(() => {
    // Load Google Fonts dynamically
    const link = document.createElement('link');
    link.href = typography.heading.url || '';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const link2 = document.createElement('link');
    link2.href = typography.body.url || '';
    link2.rel = 'stylesheet';
    document.head.appendChild(link2);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(link2);
    };
  }, [typography]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>TYPOGRAPHY SYSTEM</CardTitle>
        <CardDescription>
          Font pairing optimized for your brand personality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Heading Font */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold tracking-wider text-[#a1a1aa]">
              HEADING FONT
            </p>
            <p className="text-xs text-[#71717a] font-mono">
              {typography.heading.name}
            </p>
          </div>
          <div
            className="p-4 border rounded border-[#27272a] bg-[#000000]"
            style={{ fontFamily: typography.heading.family }}
          >
            <h1 className="text-4xl font-bold mb-2">The Quick Brown Fox</h1>
            <h2 className="text-3xl font-bold mb-2">Jumps Over The Lazy Dog</h2>
            <h3 className="text-2xl font-bold">ABCDEFGHIJKLMNOPQRSTUVWXYZ</h3>
          </div>
          <div className="flex gap-2 text-xs text-[#71717a]">
            <span>Weights:</span>
            {typography.heading.weights.map((weight) => (
              <span
                key={weight}
                className="px-2 py-1 bg-[#0a0a0a] border rounded border-[#27272a]"
                style={{ fontFamily: typography.heading.family, fontWeight: weight }}
              >
                {weight}
              </span>
            ))}
          </div>
        </div>

        {/* Body Font */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold tracking-wider text-[#a1a1aa]">
              BODY FONT
            </p>
            <p className="text-xs text-[#71717a] font-mono">
              {typography.body.name}
            </p>
          </div>
          <div
            className="p-4 border rounded border-[#27272a] bg-[#000000]"
            style={{ fontFamily: typography.body.family }}
          >
            <p className="text-base mb-2">
              The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.
            </p>
            <p className="text-sm mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p className="text-xs">
              abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
            </p>
          </div>
          <div className="flex gap-2 text-xs text-[#71717a]">
            <span>Weights:</span>
            {typography.body.weights.map((weight) => (
              <span
                key={weight}
                className="px-2 py-1 bg-[#0a0a0a] border rounded border-[#27272a]"
                style={{ fontFamily: typography.body.family, fontWeight: weight }}
              >
                {weight}
              </span>
            ))}
          </div>
        </div>

        {/* Type Scale */}
        <div className="space-y-3 pt-4 border-t border-[#27272a]">
          <p className="text-xs font-bold tracking-wider text-[#a1a1aa]">
            TYPE SCALE
          </p>
          <div className="space-y-2">
            {Object.entries(typography.scale).map(([level, size]) => (
              <div
                key={level}
                className="flex items-center justify-between text-[#71717a]"
              >
                <span className="text-xs font-mono">{level.toUpperCase()}</span>
                <span className="text-xs font-mono">{size}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Combined Preview */}
        <div className="space-y-3 pt-4 border-t border-[#27272a]">
          <p className="text-xs font-bold tracking-wider text-[#a1a1aa]">
            COMBINED PREVIEW
          </p>
          <div className="p-4 border rounded border-[#27272a] bg-[#000000]">
            <h2
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: typography.heading.family }}
            >
              Your Brand Headline
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ fontFamily: typography.body.family }}
            >
              This is how your body text will look. It's designed to be highly readable
              and pair perfectly with your heading font. The combination creates a
              professional and cohesive visual identity.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}