'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PoseSet } from '@/lib/types';
import { composeSpriteSheet, generateSpriteSheetMetadata } from '@/lib/pixel/pose-generator';

interface SpriteSheetProps {
  poses: PoseSet;
  spriteSize: number;
}

export function SpriteSheet({ poses, spriteSize }: SpriteSheetProps) {
  const [sheetImage, setSheetImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [columns, setColumns] = useState(4);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Collect all frames
      const allFrames: string[] = [];
      const poseNames: string[] = [];

      Object.entries(poses).forEach(([poseName, frames]) => {
        frames.forEach((frame, index) => {
          allFrames.push(frame);
          poseNames.push(`${poseName}_${index}`);
        });
      });

      // Generate sprite sheet
      const sheet = await composeSpriteSheet(allFrames, columns, spriteSize);
      setSheetImage(sheet);
    } catch (error) {
      console.error('Error generating sprite sheet:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!sheetImage) return;

    const link = document.createElement('a');
    link.href = sheetImage;
    link.download = 'spritesheet.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadMetadata = () => {
    // Collect all frames
    const allFrames: string[] = [];
    const poseNames: string[] = [];

    Object.entries(poses).forEach(([poseName, frames]) => {
      frames.forEach((frame, index) => {
        allFrames.push(frame);
        poseNames.push(`${poseName}_${index}`);
      });
    });

    const metadata = generateSpriteSheetMetadata(
      allFrames.length,
      columns,
      spriteSize,
      poseNames
    );

    const blob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'spritesheet.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalFrames = Object.values(poses).reduce(
    (sum, frames) => sum + frames.length,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>SPRITE SHEET COMPOSER</CardTitle>
        <CardDescription>
          Combine all poses into a single sprite sheet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-[#a1a1aa]">
              COLUMNS:
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setColumns(Math.max(2, columns - 1))}
                disabled={columns <= 2}
              >
                -
              </Button>
              <span className="text-xs font-mono text-[#fafafa] w-8 text-center">
                {columns}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setColumns(Math.min(8, columns + 1))}
                disabled={columns >= 8}
              >
                +
              </Button>
            </div>
          </div>

          <div className="text-xs text-[#71717a]">
            Total frames: {totalFrames} • Grid: {columns} × {Math.ceil(totalFrames / columns)}
          </div>
        </div>

        {/* Generate Button */}
        {!sheetImage && (
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? '[ GENERATING... ]' : '[ GENERATE SPRITE SHEET ]'}
          </Button>
        )}

        {/* Preview */}
        {sheetImage && (
          <>
            <div className="rounded border border-[#27272a] bg-[#000000] p-4 overflow-auto max-h-96">
              <img
                src={sheetImage}
                alt="Sprite Sheet"
                className="image-rendering-pixelated"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            {/* Download Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleDownload}>
                [ DOWNLOAD PNG ]
              </Button>
              <Button variant="outline" onClick={handleDownloadMetadata}>
                [ DOWNLOAD JSON ]
              </Button>
            </div>

            {/* Regenerate */}
            <Button
              variant="ghost"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
            >
              [ REGENERATE ]
            </Button>
          </>
        )}

        {/* Info */}
        <div className="pt-4 border-t border-[#27272a] text-xs text-[#71717a]">
          <p className="mb-2">The sprite sheet includes:</p>
          <ul className="space-y-1 ml-4">
            {Object.entries(poses).map(([pose, frames]) => (
              <li key={pose}>
                • {pose.toUpperCase()}: {frames.length} frame{frames.length > 1 ? 's' : ''}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}