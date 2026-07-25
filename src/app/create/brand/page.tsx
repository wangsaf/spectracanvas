'use client';

import { useState } from 'react';
import { BrandForm, type BrandFormData } from '@/components/brand/brand-form';
import { ColorPalette } from '@/components/brand/color-palette';
import { FontPreview } from '@/components/brand/font-preview';
import { LogoPreview } from '@/components/brand/logo-preview';
import type { BrandIdentity } from '@/lib/types';
import { API_ROUTES } from '@/lib/constants';
import { useProjectStore } from '@/lib/store/project-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function BrandStudioPage() {
  const router = useRouter();
  const { brand: savedBrand, setBrand } = useProjectStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [brand, setBrandLocal] = useState<BrandIdentity | null>(savedBrand);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (formData: BrandFormData) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(API_ROUTES.brand.generate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          industry: formData.industry,
          values: formData.values,
          targetAudience: formData.targetAudience,
          mood: formData.mood,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate brand');
      }

      setBrandLocal(result.data);
      setBrand(result.data); // Save to store
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndContinue = () => {
    if (brand) {
      setBrand(brand);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#121010]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-wider mb-2">BRAND STUDIO</h1>
            <p className="text-neutral-500 text-sm">
              Generate your complete brand identity with AI
            </p>
          </div>
          {brand && (
            <Button onClick={handleSaveAndContinue}>
              [ SAVE & CONTINUE ]
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Form */}
          <div>
            <div className="sticky top-20">
              <BrandForm onGenerate={handleGenerate} isGenerating={isGenerating} />
              
              {error && (
                <div className="mt-4 p-4 border border-red-500 bg-red-500/10">
                  <p className="text-xs font-bold text-red-500">ERROR</p>
                  <p className="text-sm text-red-400 mt-1">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {!brand && !isGenerating && (
              <div className="border border-[#222] bg-[#111] p-12 text-center">
                <div className="w-16 h-16 border-2 border-[#222] mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-neutral-500">[ ]</span>
                </div>
                <p className="text-sm text-neutral-500">
                  Fill in your brand details and click generate to see your identity
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="border border-[#222] bg-[#111] p-12 text-center">
                <div className="w-16 h-16 border-2 border-[#00ff88] mx-auto mb-4 flex items-center justify-center animate-pulse">
                  <span className="text-2xl text-[#00ff88]">[*]</span>
                </div>
                <p className="text-sm text-[#00ff88] font-bold tracking-wider">
                  GENERATING BRAND...
                </p>
                <p className="text-xs text-neutral-500 mt-2">
                  Creating colors, typography, and logos
                </p>
              </div>
            )}

            {brand && (
              <>
                <ColorPalette colors={brand.colors} />
                <FontPreview typography={brand.typography} />
                <LogoPreview logo={brand.logo} brandName={brand.name} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
