'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CanvasEngine } from '@/lib/pixel/canvas-engine';
import type { CharacterSprite } from '@/lib/types';

interface SpriteCanvasProps {
  sprite: CharacterSprite;
  onDownload?: () => void;
}

export function SpriteCanvas({ sprite, onDownload }: SpriteCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<CanvasEngine | null>(null);
  const [zoom, setZoom] = useState(8);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasEngine = new CanvasEngine(canvasRef.current, {
      width: sprite.size * zoom,
      height: sprite.size * zoom,
      scale: zoom,
      backgroundColor: '#0a0a0a',
      gridEnabled: showGrid,
      gridColor: '#222222',
    });

    setEngine(canvasEngine);

    // Load and draw sprite
    const img = new Image();
    img.onload = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, sprite.size * zoom, sprite.size * zoom);
        ctx.drawImage(img, 0, 0, sprite.size * zoom, sprite.size * zoom);
        
        if (showGrid) {
          canvasEngine.drawGrid();
        }
      }
    };
    img.src = sprite.imageData;

    return () => {
      // Cleanup
    };
  }, [sprite, zoom, showGrid]);

  const handleZoomIn = () => {
    if (zoom < 16) setZoom(zoom + 2);
  };

  const handleZoomOut = () => {
    if (zoom > 4) setZoom(zoom - 2);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default download
      const link = document.createElement('a');
      link.href = sprite.imageData;
      link.download = `sprite-${sprite.size}x${sprite.size}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SPRITE PREVIEW</CardTitle>
        <CardDescription>
          {sprite.size}x{sprite.size} • {sprite.style} • {sprite.metadata.colorCount} colors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Canvas Display */}
        <div className="border border-[#222] bg-[#0a0a0a] p-4 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="image-rendering-pixelated"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-neutral-400">ZOOM:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 4}
            >
              -
            </Button>
            <span className="text-xs font-mono text-white w-12 text-center">{zoom}x</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 16}
            >
              +
            </Button>
          </div>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-1 text-xs font-bold tracking-wider border transition-colors ${
              showGrid
                ? 'bg-[#00ff88] text-black border-[#00ff88]'
                : 'bg-transparent text-neutral-400 border-[#222] hover:border-[#00ff88]'
            }`}
          >
            GRID
          </button>
        </div>

        {/* Sprite Info */}
        <div className="pt-4 border-t border-[#222] space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-500">Size:</span>
            <span className="text-white font-mono">{sprite.size}x{sprite.size}px</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Style:</span>
            <span className="text-white">{sprite.style}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Colors:</span>
            <span className="text-white">{sprite.metadata.colorCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Transparent:</span>
            <span className="text-white">{sprite.metadata.transparent ? 'Yes' : 'No'}</span>
          </div>
        </div>

        {/* Color Palette */}
        <div className="pt-4 border-t border-[#222]">
          <p className="text-xs font-bold tracking-wider text-neutral-400 mb-2">
            COLOR PALETTE
          </p>
          <div className="flex flex-wrap gap-1">
            {sprite.palette.map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 border border-[#222] cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
                onClick={() => {
                  navigator.clipboard.writeText(color);
                }}
              />
            ))}
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          className="w-full"
        >
          [ DOWNLOAD PNG ]
        </Button>
      </CardContent>
    </Card>
  );
}