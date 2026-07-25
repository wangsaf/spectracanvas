'use client';

import type { ContentScript } from '@/lib/types';
import { cn, PLATFORM_LABELS } from '@/lib/utils';

interface ScriptDisplayProps {
  script: ContentScript | null;
  className?: string;
}

export default function ScriptDisplay({ script, className }: ScriptDisplayProps) {
  if (!script) {
    return (
      <div className={cn(
        'flex items-center justify-center h-48 text-zinc-600 text-xs font-mono',
        className
      )}>
        [ No script generated yet ]
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4 w-full max-w-2xl', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3">
        <h2 className="text-lg font-bold text-zinc-100 tracking-wide">
          {script.title}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold tracking-widest text-cyan-500 uppercase px-2 py-0.5 border border-cyan-700 bg-cyan-950">
            {PLATFORM_LABELS[script.platform] || script.platform}
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            {script.duration}
          </span>
        </div>
      </div>

      {/* Hook */}
      <div className="bg-zinc-900 border-2 border-amber-600 p-4">
        <div className="text-[10px] font-bold tracking-widest text-amber-500 uppercase mb-2">
          === HOOK ===
        </div>
        <p className="text-sm text-zinc-100 font-mono leading-relaxed">
          {script.hook}
        </p>
      </div>

      {/* Body Sections */}
      <div className="flex flex-col gap-3">
        {script.sections.map((section, index) => (
          <div
            key={section.id}
            className="bg-zinc-900/50 border border-zinc-800 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                [{section.label}]
              </span>
              {section.timestamp && (
                <span className="text-[10px] font-mono text-zinc-600">
                  @ {section.timestamp}
                </span>
              )}
              <span className="text-[10px] font-mono text-zinc-700">
                #{index + 1}
              </span>
            </div>
            <p className="text-sm text-zinc-200 font-mono leading-relaxed whitespace-pre-wrap">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="bg-zinc-900 border-2 border-emerald-600 p-4">
        <div className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase mb-2">
          === CALLS TO ACTION ===
        </div>
        <ul className="flex flex-col gap-2">
          {script.ctas.map((cta, index) => (
            <li
              key={index}
              className="text-sm text-zinc-100 font-mono flex items-start gap-2"
            >
              <span className="text-emerald-500 font-bold shrink-0">&gt;</span>
              {cta}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
