'use client';

import { useState, useCallback } from 'react';
import { useBrandStore } from '@/store/brand-store';
import { cn, copyToClipboard } from '@/lib/utils';

export function ColorPalette() {
  const { result } = useBrandStore();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = useCallback((hex: string) => {
    copyToClipboard(hex).then(() => {
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1500);
    }).catch(() => {
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1500);
    });
  }, []);

  if (!result) {
    return (
      <div className="w-full border-2 border-[#222] bg-[#111] p-8">
        <p className="text-sm font-mono text-white/30 text-center uppercase tracking-wider">
          Generate a brand to preview palette
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-white/70">
        Color Palette
      </h3>

      <div className="flex flex-col gap-0">
        {result.palette.map((swatch) => (
          <div
            key={swatch.role}
            className="flex items-stretch border-2 border-[#222] -mt-px first:mt-0"
          >
            {/* Color swatch */}
            <div
              className="w-20 min-h-[60px] flex-shrink-0"
              style={{ backgroundColor: swatch.hex }}
            />

            {/* Info */}
            <div className="flex-1 flex items-center justify-between px-4 bg-[#111]">
              <div className="flex flex-col">
                <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                  {swatch.name}
                </span>
                <span className="text-sm font-mono font-bold text-white">
                  {swatch.hex}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(swatch.hex)}
                className={cn(
                  'px-3 py-1.5 text-xs font-mono uppercase tracking-wide',
                  'border-2 transition-colors rounded-none',
                  copiedHex === swatch.hex
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/60 border-[#222] hover:border-white/40 hover:text-white'
                )}
              >
                {copiedHex === swatch.hex ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full strip preview */}
      <div className="flex h-8 w-full">
        {result.palette.map((swatch) => (
          <div
            key={swatch.role}
            className="flex-1"
            style={{ backgroundColor: swatch.hex }}
          />
        ))}
      </div>
    </div>
  );
}
