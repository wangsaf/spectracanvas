'use client';

import { useState } from 'react';
import type { CaptionData } from '@/lib/types';
import { cn, copyToClipboard, PLATFORM_LABELS } from '@/lib/utils';

interface CaptionCardProps {
  caption: CaptionData | null;
  className?: string;
}

export default function CaptionCard({ caption, className }: CaptionCardProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeVariation, setActiveVariation] = useState<string | null>(null);

  async function handleCopy(text: string, id: string) {
    try {
      await copyToClipboard(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback: select text
    }
  }

  if (!caption) {
    return (
      <div className={cn(
        'flex items-center justify-center h-48 text-zinc-600 text-xs font-mono',
        className
      )}>
        [ No caption generated ]
      </div>
    );
  }

  const displayText = activeVariation
    ? caption.variations.find((v) => v.id === activeVariation)?.text || caption.primary
    : caption.primary;

  return (
    <div className={cn('flex flex-col gap-4 w-full max-w-lg', className)}>
      {/* Platform badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
          Caption
        </span>
        <span className="text-[10px] font-bold tracking-wider text-cyan-400 px-2 py-0.5 border border-cyan-700 bg-cyan-950 uppercase">
          {PLATFORM_LABELS[caption.platform] || caption.platform}
        </span>
      </div>

      {/* Primary Caption */}
      <div className="bg-zinc-900 border-2 border-zinc-700 p-4 relative">
        <div className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">
          {activeVariation ? 'VARIATION' : 'PRIMARY CAPTION'}
        </div>
        <p className="text-sm text-zinc-100 font-mono leading-relaxed whitespace-pre-wrap">
          {displayText}
        </p>
        <button
          onClick={() => handleCopy(displayText, 'primary')}
          className={cn(
            'absolute top-2 right-2 px-2 py-1 text-[10px] font-bold tracking-wider border transition-colors',
            copied === 'primary'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-950'
              : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
          )}
        >
          {copied === 'primary' ? 'COPIED' : 'COPY'}
        </button>
      </div>

      {/* Variations */}
      {caption.variations.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            Variations
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveVariation(null)}
              className={cn(
                'px-3 py-1.5 text-[10px] font-bold tracking-wider border transition-colors',
                activeVariation === null
                  ? 'bg-zinc-700 border-zinc-600 text-zinc-200'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
              )}
            >
              Original
            </button>
            {caption.variations.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVariation(v.id)}
                className={cn(
                  'px-3 py-1.5 text-[10px] font-bold tracking-wider border transition-colors uppercase',
                  activeVariation === v.id
                    ? 'bg-zinc-700 border-zinc-600 text-zinc-200'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                )}
              >
                {v.style}
              </button>
            ))}
          </div>

          {/* Variation previews */}
          {caption.variations.map((v) => (
            <div
              key={v.id}
              className={cn(
                'bg-zinc-900/50 border p-3 relative transition-all',
                activeVariation === v.id
                  ? 'border-zinc-600'
                  : 'border-zinc-800'
              )}
            >
              <div className="text-[9px] font-bold tracking-widest text-zinc-600 uppercase mb-1">
                {v.style} variation
              </div>
              <p className="text-xs text-zinc-300 font-mono leading-relaxed line-clamp-2">
                {v.text}
              </p>
              <button
                onClick={() => handleCopy(v.text, v.id)}
                className={cn(
                  'absolute top-1 right-1 px-1.5 py-0.5 text-[9px] font-bold border transition-colors',
                  copied === v.id
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400'
                )}
              >
                {copied === v.id ? 'OK' : 'CP'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hashtags */}
      {caption.hashtags.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Hashtags
            </span>
            <button
              onClick={() => handleCopy(caption.hashtags.join(' '), 'hashtags')}
              className={cn(
                'px-2 py-0.5 text-[9px] font-bold tracking-wider border transition-colors',
                copied === 'hashtags'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400'
              )}
            >
              {copied === 'hashtags' ? 'COPIED' : 'COPY ALL'}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {caption.hashtags.map((tag, index) => (
              <span
                key={index}
                className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 border border-cyan-900"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
