'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { ComicPanelData, ComicBubble } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ComicPanelProps {
  panels: ComicPanelData[];
  className?: string;
}

export default function ComicPanel({ panels, className }: ComicPanelProps) {
  if (panels.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-48 text-zinc-600 text-xs font-mono', className)}>
        [ No comic panels generated ]
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
        Comic Strip
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {panels.map((panel, idx) => (
          <SinglePanel key={panel.id} panel={panel} index={idx} />
        ))}
      </div>
    </div>
  );
}

interface SinglePanelProps {
  panel: ComicPanelData;
  index: number;
}

function SinglePanel({ panel, index }: SinglePanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderPanel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = 4;
    const w = panel.frame.width * scale;
    const h = panel.frame.height * scale;

    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, w, h);

    // Draw pixels
    for (let y = 0; y < panel.frame.pixels.length; y++) {
      for (let x = 0; x < panel.frame.pixels[y].length; x++) {
        const color = panel.frame.pixels[y][x];
        if (!color || color === '#00000000' || color === 'transparent') continue;
        ctx.fillStyle = color;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }, [panel]);

  useEffect(() => {
    renderPanel();
  }, [renderPanel]);

  return (
    <div className="border-2 border-zinc-700 bg-zinc-900 flex flex-col">
      {/* Panel number */}
      <div className="px-2 py-1 border-b border-zinc-800 text-[10px] font-bold tracking-widest text-zinc-500">
        PANEL {index + 1}
      </div>

      {/* Canvas area */}
      <div className="relative bg-zinc-950">
        <canvas
          ref={canvasRef}
          className="block w-full"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Speech Bubbles overlay */}
        {panel.bubbles.map((bubble) => (
          <BubbleOverlay key={bubble.id} bubble={bubble} />
        ))}
      </div>

      {/* Label */}
      {panel.label && (
        <div className="px-2 py-1 border-t border-zinc-800 text-[10px] font-mono text-zinc-500">
          {panel.label}
        </div>
      )}
    </div>
  );
}

interface BubbleOverlayProps {
  bubble: ComicBubble;
}

function BubbleOverlay({ bubble }: BubbleOverlayProps) {
  const borderStyle = (() => {
    switch (bubble.type) {
      case 'speech':
        return 'border-zinc-300 rounded-xl';
      case 'thought':
        return 'border-zinc-400 rounded-full';
      case 'narration':
        return 'border-amber-500 rounded-none';
      case 'shout':
        return 'border-red-400 rounded-lg';
      default:
        return 'border-zinc-300 rounded-lg';
    }
  })();

  return (
    <div
      className={cn(
        'absolute bg-zinc-900/90 border-2 px-2 py-1 pointer-events-none',
        borderStyle
      )}
      style={{
        left: `${bubble.x}%`,
        top: `${bubble.y}%`,
        maxWidth: `${bubble.width}%`,
        maxHeight: `${bubble.height}%`,
      }}
    >
      <p className="text-[10px] font-bold text-zinc-100 leading-tight">
        {bubble.text}
      </p>
      {/* Tail indicator for speech/thought */}
      {bubble.type === 'speech' && (
        <div className="absolute -bottom-2 left-3 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-zinc-900/90" />
      )}
      {bubble.type === 'shout' && (
        <div className="absolute -bottom-2 left-3 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-zinc-900/90" />
      )}
    </div>
  );
}
