'use client';

import { useState } from 'react';
import { useBrandStore } from '@/store/brand-store';
import { cn } from '@/lib/utils';

const variationTabs = ['text', 'icon-text', 'abstract'] as const;

export function LogoPreview() {
  const { result } = useBrandStore();
  const [activeTab, setActiveTab] = useState<'text' | 'icon-text' | 'abstract'>('text');

  if (!result) {
    return (
      <div className="w-full border-2 border-[#222] bg-[#111] p-8">
        <p className="text-sm font-mono text-white/30 text-center uppercase tracking-wider">
          Generate a brand to preview logos
        </p>
      </div>
    );
  }

  const activeLogo = result.logos.find((l) => l.type === activeTab);

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-white/70">
        Logo Variations
      </h3>

      {/* Tabs */}
      <div className="flex gap-0">
        {variationTabs.map((tab) => {
          const label = result.logos.find((l) => l.type === tab)?.label || tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 text-xs font-mono uppercase tracking-wide',
                'border-2 transition-colors rounded-none -ml-px first:ml-0',
                activeTab === tab
                  ? 'bg-white text-black border-white z-10'
                  : 'bg-[#111] text-white/50 border-[#222] hover:text-white/70'
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Preview */}
      {activeLogo && (
        <div className="border-2 border-[#222] bg-[#0a0a0a] p-6 flex items-center justify-center">
          <div
            className="w-full max-w-md"
            dangerouslySetInnerHTML={{ __html: activeLogo.svg }}
          />
        </div>
      )}

      {/* All three small */}
      <div className="grid grid-cols-3 gap-2">
        {result.logos.map((logo) => (
          <button
            key={logo.type}
            type="button"
            onClick={() => setActiveTab(logo.type)}
            className={cn(
              'border-2 p-2 transition-colors rounded-none',
              activeTab === logo.type
                ? 'border-white'
                : 'border-[#222] hover:border-white/40'
            )}
          >
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: logo.svg }}
            />
            <p className="text-[10px] font-mono text-white/40 mt-1 text-center uppercase">
              {logo.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
