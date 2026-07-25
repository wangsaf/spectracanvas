'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { SpriteFrame } from '@/lib/types';
import { cn } from '@/lib/utils';
import { usePixelStore } from '@/store/pixel-store';

interface SpriteCanvasProps {
  frame: SpriteFrame | null;
  className?: string;
}

export default function SpriteCanvas({ frame, className }: SpriteCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { zoom, setZoom } = usePixelStore();

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !frame) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixelSize = zoom;
    const canvasWidth = frame.width * pixelSize;
    const canvasHeight = frame.height * pixelSize;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear with dark background
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw checkerboard for transparency indication
    for (let y = 0; y < frame.height; y++) {
      for (let x = 0; x < frame.width; x++) {
        const isEven = (x + y) % 2 === 0;
        if (isEven) {
          ctx.fillStyle = '#1f1f23';
        } else {
          ctx.fillStyle = '#18181b';
        }
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    // Draw pixels
    for (let y = 0; y < frame.pixels.length; y++) {
      for (let x = 0; x < frame.pixels[y].length; x++) {
        const color = frame.pixels[y][x];
        // Skip transparent pixels
        if (!color || color === '#00000000' || color === 'transparent') continue;

        ctx.fillStyle = color;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= frame.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * pixelSize, 0);
      ctx.lineTo(x * pixelSize, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= frame.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * pixelSize);
      ctx.lineTo(canvasWidth, y * pixelSize);
      ctx.stroke();
    }
  }, [frame, zoom]);

  useEffect(() => {
    renderFrame();
  }, [renderFrame]);

  function handleZoomIn() {
    setZoom(Math.min(zoom + 2, 24));
  }

  function handleZoomOut() {
    setZoom(Math.max(zoom - 2, 2));
  }

  function handleZoomReset() {
    setZoom(4);
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
          Zoom
        </span>
        <button
          onClick={handleZoomOut}
          className="px-2 py-1 text-xs font-bold border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
        >
          -
        </button>
        <span className="text-xs font-mono text-zinc-300 w-12 text-center">
          {zoom}x
        </span>
        <button
          onClick={handleZoomIn}
          className="px-2 py-1 text-xs font-bold border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
        >
          +
        </button>
        <button
          onClick={handleZoomReset}
          className="px-2 py-1 text-[10px] font-bold tracking-wider border border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300 transition-colors"
        >
          1:1
        </button>
      </div>

      {/* Canvas */}
      <div className="relative border-2 border-zinc-800 bg-zinc-950 overflow-auto max-h-[600px] max-w-full">
        {frame ? (
          <canvas
            ref={canvasRef}
            className="block"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div className="flex items-center justify-center w-64 h-64 text-zinc-600 text-xs font-mono tracking-wider">
            [ No sprite data ]
          </div>
        )}
      </div>

      {/* Frame Info */}
      {frame && (
        <div className="flex gap-4 text-[10px] font-mono text-zinc-600">
          <span>Size: {frame.width}x{frame.height}</span>
          <span>Frame ID: {frame.id.slice(0, 8)}</span>
          <span>Duration: {frame.duration}ms</span>
        </div>
      )}
    </div>
  );
}
