'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { SpriteFrame } from '@/lib/types';
import { cn } from '@/lib/utils';
import { usePixelStore } from '@/store/pixel-store';

interface AnimationPreviewProps {
  frames: SpriteFrame[];
  className?: string;
}

export default function AnimationPreview({ frames, className }: AnimationPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    isPlaying,
    setIsPlaying,
    animationSpeed,
    setAnimationSpeed,
    currentFrameIndex,
    setCurrentFrameIndex,
  } = usePixelStore();

  const renderFrame = useCallback(
    (frame: SpriteFrame) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const scale = 6;
      const w = frame.width * scale;
      const h = frame.height * scale;

      canvas.width = w;
      canvas.height = h;

      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, w, h);

      for (let y = 0; y < frame.pixels.length; y++) {
        for (let x = 0; x < frame.pixels[y].length; x++) {
          const color = frame.pixels[y][x];
          if (!color || color === '#00000000' || color === 'transparent') continue;
          ctx.fillStyle = color;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    },
    []
  );

  // Animation loop
  useEffect(() => {
    if (!isPlaying || frames.length === 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const currentFrame = frames[currentFrameIndex];
    if (currentFrame) {
      renderFrame(currentFrame);
    }

    timerRef.current = setTimeout(() => {
      const nextIndex = (currentFrameIndex + 1) % frames.length;
      setCurrentFrameIndex(nextIndex);
    }, currentFrame?.duration || animationSpeed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentFrameIndex, frames, animationSpeed, renderFrame, setCurrentFrameIndex]);

  // Render current frame when paused
  useEffect(() => {
    if (!isPlaying && frames[currentFrameIndex]) {
      renderFrame(frames[currentFrameIndex]);
    }
  }, [currentFrameIndex, frames, isPlaying, renderFrame]);

  function handlePlayPause() {
    if (frames.length === 0) return;
    setIsPlaying(!isPlaying);
  }

  function handlePrevFrame() {
    if (frames.length === 0) return;
    setIsPlaying(false);
    const prev = (currentFrameIndex - 1 + frames.length) % frames.length;
    setCurrentFrameIndex(prev);
  }

  function handleNextFrame() {
    if (frames.length === 0) return;
    setIsPlaying(false);
    const next = (currentFrameIndex + 1) % frames.length;
    setCurrentFrameIndex(next);
  }

  function handleSpeedChange(delta: number) {
    setAnimationSpeed(Math.max(50, Math.min(2000, animationSpeed + delta)));
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
        Animation Preview
      </div>

      {/* Canvas */}
      <div className="border-2 border-zinc-800 bg-zinc-950 inline-block">
        {frames.length > 0 ? (
          <canvas
            ref={canvasRef}
            className="block"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div className="flex items-center justify-center w-48 h-48 text-zinc-600 text-xs font-mono">
            [ No frames ]
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevFrame}
          disabled={frames.length === 0}
          className="px-3 py-2 text-xs font-bold border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-30"
        >
          &lt;&lt;
        </button>
        <button
          onClick={handlePlayPause}
          disabled={frames.length === 0}
          className={cn(
            'px-5 py-2 text-xs font-bold tracking-wider border-2 transition-all',
            isPlaying
              ? 'bg-red-600 border-red-500 text-white hover:bg-red-500'
              : 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500',
            frames.length === 0 && 'opacity-30 cursor-not-allowed'
          )}
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
        <button
          onClick={handleNextFrame}
          disabled={frames.length === 0}
          className="px-3 py-2 text-xs font-bold border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-30"
        >
          &gt;&gt;
        </button>
      </div>

      {/* Speed Controls */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
          Speed
        </span>
        <button
          onClick={() => handleSpeedChange(-50)}
          className="px-2 py-1 text-xs font-bold border border-zinc-700 text-zinc-400 hover:border-zinc-500 transition-colors"
        >
          F
        </button>
        <span className="text-xs font-mono text-zinc-300 w-16 text-center">
          {animationSpeed}ms
        </span>
        <button
          onClick={() => handleSpeedChange(50)}
          className="px-2 py-1 text-xs font-bold border border-zinc-700 text-zinc-400 hover:border-zinc-500 transition-colors"
        >
          S
        </button>
      </div>

      {/* Frame indicator */}
      {frames.length > 0 && (
        <div className="text-[10px] font-mono text-zinc-600">
          Frame {currentFrameIndex + 1} / {frames.length}
        </div>
      )}
    </div>
  );
}
