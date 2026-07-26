'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PixelForm, type PixelFormData } from '@/components/pixel/pixel-form';
import { SpriteCanvas } from '@/components/pixel/sprite-canvas';
import { SpriteSheet } from '@/components/pixel/sprite-sheet';
import { AnimationPreview } from '@/components/pixel/animation-preview';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import type { CharacterSprite } from '@/lib/types';
import type { PoseSet } from '@/lib/types';
import { API_ROUTES } from '@/lib/constants';
import { useProjectStore } from '@/lib/store/project-store';
import { Button } from '@/components/ui/button';
import { generatePosesAsync, generatePoses } from '@/lib/pixel/pose-generator';
import { useToast } from '@/components/ui/toast';

export default function PixelStudioPage() {
  const router = useRouter();
  const { brand, sprites: savedSprites, addSprite } = useProjectStore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPoses, setIsGeneratingPoses] = useState(false);
  const [sprite, setSprite] = useState<CharacterSprite | null>(null);
  const [poses, setPoses] = useState<PoseSet | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (formData: PixelFormData) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(API_ROUTES.pixel.generate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.description,
          style: formData.style,
          size: formData.size,
          palette: formData.paletteMode === 'custom' ? formData.customPalette : undefined,
          brandColors: formData.paletteMode === 'brand' && brand
            ? Object.values(brand.colors.primary) as string[]
            : brand?.colors
              ? Object.values(brand.colors.primary) as string[]
              : undefined,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate sprite');
      }

      setSprite(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSprite = () => {
    if (sprite) {
      addSprite(sprite);
      toast({ title: 'Sprite saved to project!', variant: 'success' });
    }
  };

  const handleSaveAndContinue = () => {
    if (sprite) {
      addSprite(sprite);
      router.push('/dashboard');
    }
  };

  // Generate poses with real canvas-based pixel variations when a sprite is created
  useEffect(() => {
    if (!sprite) {
      setPoses(null);
      return;
    }
    setIsGeneratingPoses(true);
    generatePosesAsync(sprite)
      .then((generatedPoses) => {
        setPoses(generatedPoses);
      })
      .catch((err) => {
        console.error('Pose generation failed, using template poses:', err);
        // Fallback to synchronous template poses
        setPoses(generatePoses(sprite));
      })
      .finally(() => {
        setIsGeneratingPoses(false);
      });
  }, [sprite]);

  return (
    <div className="min-h-screen bg-[#1c1915]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-wider mb-2">PIXEL STUDIO</h1>
            <p className="text-[#6b5f52] text-sm">
              Generate pixel art characters and sprites with AI
            </p>
          </div>
          {sprite && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveSprite}>
                [ SAVE SPRITE ]
              </Button>
              <Button onClick={handleSaveAndContinue}>
                [ SAVE & CONTINUE ]
              </Button>
            </div>
          )}
        </div>

        {/* Saved Sprites Count */}
        {savedSprites.length > 0 && (
          <div className="mb-4 p-3 rounded border border-[#3a322a] bg-[#241f1a]">
            <p className="text-xs text-[#a09484]">
              {savedSprites.length} sprite{savedSprites.length !== 1 ? 's' : ''} saved to project
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Form */}
          <div>
            <div className="sticky top-20">
              <PixelForm 
                onGenerate={handleGenerate} 
                isGenerating={isGenerating}
                brandColors={brand ? Object.values(brand.colors.primary) as string[] : undefined}
              />
              
              {error && (
                <div className="mt-4 p-4 rounded border border-red-500 bg-red-500/10">
                  <p className="text-xs font-bold text-red-500">ERROR</p>
                  <p className="text-sm text-red-400 mt-1">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {!sprite && !isGenerating && (
              <div className="rounded border border-[#3a322a] bg-[#241f1a] p-12 text-center">
                <div className="w-16 h-16 rounded border-2 border-[#3a322a] mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-[#6b5f52]">[ ]</span>
                </div>
                <p className="text-sm text-[#6b5f52]">
                  Describe your character and click generate to see your pixel art sprite
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="rounded border border-[#3a322a] bg-[#241f1a] p-12 text-center">
                <LoadingSpinner size="lg" label="GENERATING SPRITE..." className="mb-2" />
                <p className="text-xs text-[#6b5f52] mt-2">
                  Creating your pixel art character
                </p>
              </div>
            )}

            {sprite && (
              <>
                {/* Sprite Canvas */}
                <SpriteCanvas sprite={sprite} />

                {/* Description */}
                <div className="rounded border border-[#3a322a] bg-[#241f1a] p-6">
                  <h3 className="text-sm font-bold tracking-wider mb-2">DESCRIPTION</h3>
                  <p className="text-sm text-[#a09484]">{sprite.description}</p>
                </div>

                {/* Pose Generation Loading */}
                {isGeneratingPoses && (
                  <div className="rounded border border-[#3a322a] bg-[#241f1a] p-8 text-center">
                    <LoadingSpinner size="md" label="GENERATING POSES..." />
                  </div>
                )}

                {/* Animation Preview */}
                {poses && (
                  <AnimationPreview poses={poses} spriteSize={sprite.size} />
                )}

                {/* Sprite Sheet Composer */}
                {poses && (
                  <SpriteSheet poses={poses} spriteSize={sprite.size} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
