'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { SpriteFrame } from '@/lib/types';
import { cn } from '@/lib/utils';
import { usePixelStore } from '@/store/pixel-store';

interface SpriteSheetProps {
  frames: SpriteFrame[];
  columns?: number;
  className?: string;
}

export default function SpriteSheet({ frames, columns = 4, className }: SpriteSheetProps) {
  const { setCurrentFrame, currentFrameIndex } = usePixelStore();

  const rows = Math.ceil(frames.length / columns);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
          Sprite Sheet
        </span>
        <span className="text-[10px] font-mono text-zinc-600">
          {frames.length} frames / {columns}x{rows} grid
        </span>
      </div>

      <div
        className="grid gap-1 bg-zinc-950 border-2 border-zinc-800 p-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {frames.map((frame, index) => (
          <SpriteSheetCell
            key={frame.id}
            frame={frame}
            index={index}
            isSelected={index === currentFrameIndex}
            onClick={() => {
              setCurrentFrame(frame);
              usePixelStore.getState().setCurrentFrameIndex(index);
            }}
          />
        ))}

        {/* Empty grid cells */}
        {Array.from({ length: columns * rows - frames.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="aspect-square border border-dashed border-zinc-800 bg-zinc-900/50"
          />
        ))}
      </div>
    </div>
  );
}

interface SpriteSheetCellProps {
  frame: SpriteFrame;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

function SpriteSheetCell({ frame, index, isSelected, onClick }: SpriteSheetCellProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderMiniature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 80;
    const scale = Math.floor(cellSize / Math.max(frame.width, frame.height));

    canvas.width = frame.width * scale;
    canvas.height = frame.height * scale;

    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < frame.pixels.length; y++) {
      for (let x = 0; x < frame.pixels[y].length; x++) {
        const color = frame.pixels[y][x];
        if (!color || color === '#00000000' || color === 'transparent') continue;
        ctx.fillStyle = color;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }, [frame]);

  useEffect(() => {
    renderMiniature();
  }, [renderMiniature]);

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 p-1 border-2 transition-all',
        isSelected
          ? 'border-amber-500 bg-zinc-900'
          : 'border-transparent hover:border-zinc-700 bg-zinc-950'
      )}
    >
      <canvas
        ref={canvasRef}
        className="block w-full aspect-square"
        style={{ imageRendering: 'pixelated' }}
      />
      <span className="text-[9px] font-mono text-zinc-500">
        F{index + 1}
      </span>
    </button>
  );
}
