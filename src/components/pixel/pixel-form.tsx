'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PIXEL_STYLES, SPRITE_SIZES } from '@/lib/constants';
import type { PixelStyle, SpriteSize } from '@/lib/types';

interface PixelFormProps {
  onGenerate: (data: PixelFormData) => void;
  isGenerating?: boolean;
  brandColors?: string[];
}

export interface PixelFormData {
  description: string;
  style: PixelStyle;
  size: SpriteSize;
  paletteMode: 'brand' | 'custom';
  customPalette?: string[];
}

export function PixelForm({ onGenerate, isGenerating = false, brandColors }: PixelFormProps) {
  const [formData, setFormData] = useState<PixelFormData>({
    description: '',
    style: '16-bit',
    size: 32,
    paletteMode: brandColors ? 'brand' : 'custom',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Character description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Character Description */}
      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wider text-neutral-400">
          CHARACTER DESCRIPTION *
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your character (e.g., 'A brave knight with a sword and shield', 'Cute robot with glowing eyes')"
          rows={4}
          disabled={isGenerating}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description}</p>
        )}
        <p className="text-xs text-neutral-600">
          Be specific about appearance, clothing, and accessories
        </p>
      </div>

      {/* Pixel Art Style */}
      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wider text-neutral-400">
          PIXEL ART STYLE *
        </label>
        <div className="grid grid-cols-1 gap-2">
          {PIXEL_STYLES.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => setFormData({ ...formData, style: style.value as PixelStyle })}
              disabled={isGenerating}
              className={`px-4 py-3 text-left border transition-colors ${
                formData.style === style.value
                  ? 'bg-[#00ff88] text-black border-[#00ff88]'
                  : 'bg-transparent text-neutral-400 border-[#222] hover:border-[#00ff88] hover:text-white'
              }`}
            >
              <div className="text-xs font-bold tracking-wider">{style.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sprite Size */}
      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wider text-neutral-400">
          SPRITE SIZE *
        </label>
        <Select
          value={formData.size.toString()}
          onValueChange={(value) => setFormData({ ...formData, size: parseInt(value) as SpriteSize })}
          disabled={isGenerating}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SPRITE_SIZES.map((size) => (
              <SelectItem key={size.value} value={size.value.toString()}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color Palette Mode */}
      <Card>
        <CardHeader>
          <CardTitle>COLOR PALETTE</CardTitle>
          <CardDescription>
            Choose palette source for your sprite
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {brandColors && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paletteMode: 'brand' })}
                disabled={isGenerating}
                className={`w-full px-4 py-3 text-left border transition-colors ${
                  formData.paletteMode === 'brand'
                    ? 'bg-[#00ff88] text-black border-[#00ff88]'
                    : 'bg-transparent text-neutral-400 border-[#222] hover:border-[#00ff88] hover:text-white'
                }`}
              >
                <div className="text-xs font-bold tracking-wider mb-2">FROM BRAND COLORS</div>
                <div className="flex gap-1">
                  {brandColors.slice(0, 8).map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 border border-[#222]"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            )}
            
            <button
              type="button"
              onClick={() => setFormData({ ...formData, paletteMode: 'custom' })}
              disabled={isGenerating}
              className={`w-full px-4 py-3 text-left border transition-colors ${
                formData.paletteMode === 'custom'
                  ? 'bg-[#00ff88] text-black border-[#00ff88]'
                  : 'bg-transparent text-neutral-400 border-[#222] hover:border-[#00ff88] hover:text-white'
              }`}
            >
              <div className="text-xs font-bold tracking-wider">STYLE DEFAULT PALETTE</div>
              <div className="text-[10px] mt-1 opacity-70">
                Use {formData.style} style colors
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isGenerating}
      >
        {isGenerating ? '[ GENERATING SPRITE... ]' : '[ GENERATE CHARACTER ]'}
      </Button>
    </form>
  );
}