'use client';

import { useState } from 'react';
import type { PixelStyle, PixelSize, PaletteSource } from '@/lib/types';
import { cn } from '@/lib/utils';
import { usePixelStore } from '@/store/pixel-store';

const STYLES: { value: PixelStyle; label: string }[] = [
  { value: '8bit', label: '8-BIT' },
  { value: '16bit', label: '16-BIT' },
  { value: 'modern', label: 'MODERN' },
];

const SIZES: PixelSize[] = [16, 32, 48, 64];

export default function PixelForm() {
  const { formData, setFormField, resetForm, setIsGenerating, isGenerating } = usePixelStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!formData.description.trim()) e.description = 'Description is required';
    if (formData.description.length > 500) e.description = 'Max 500 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsGenerating(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-lg">
      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          Sprite Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormField('description', e.target.value)}
          placeholder="A brave knight holding a glowing sword..."
          rows={3}
          className={cn(
            'w-full bg-zinc-900 border-2 border-zinc-700 rounded px-3 py-2',
            'text-sm text-zinc-100 placeholder-zinc-600 font-mono',
            'focus:outline-none focus:border-amber-500 transition-colors resize-none',
            errors.description && 'border-red-500'
          )}
        />
        {errors.description && (
          <span className="text-xs text-red-400">{errors.description}</span>
        )}
      </div>

      {/* Style Radio Buttons */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          Pixel Style
        </label>
        <div className="flex gap-2">
          {STYLES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setFormField('style', s.value)}
              className={cn(
                'px-4 py-2 text-xs font-bold tracking-wider border-2 transition-all',
                formData.style === s.value
                  ? 'bg-amber-500 border-amber-400 text-black'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size Dropdown */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          Canvas Size
        </label>
        <select
          value={formData.size}
          onChange={(e) => setFormField('size', Number(e.target.value) as PixelSize)}
          className={cn(
            'bg-zinc-900 border-2 border-zinc-700 rounded px-3 py-2',
            'text-sm text-zinc-100 font-mono',
            'focus:outline-none focus:border-amber-500'
          )}
        >
          {SIZES.map((s) => (
            <option key={s} value={s}>
              {s} x {s} pixels
            </option>
          ))}
        </select>
      </div>

      {/* Palette Source Toggle */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          Palette Source
        </label>
        <div className="flex gap-2">
          {(['auto', 'custom'] as PaletteSource[]).map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setFormField('paletteSource', src)}
              className={cn(
                'flex-1 px-4 py-2 text-xs font-bold tracking-wider border-2 transition-all uppercase',
                formData.paletteSource === src
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'
              )}
            >
              {src}
            </button>
          ))}
        </div>
      </div>

      {/* Story Text */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          Story Text <span className="text-zinc-600">(optional)</span>
        </label>
        <textarea
          value={formData.storyText}
          onChange={(e) => setFormField('storyText', e.target.value)}
          placeholder="Background lore or narrative context for the sprite..."
          rows={2}
          className={cn(
            'w-full bg-zinc-900 border-2 border-zinc-700 rounded px-3 py-2',
            'text-sm text-zinc-100 placeholder-zinc-600 font-mono',
            'focus:outline-none focus:border-amber-500 transition-colors resize-none'
          )}
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 mt-2">
        <button
          type="submit"
          disabled={isGenerating}
          className={cn(
            'flex-1 px-6 py-3 text-sm font-bold tracking-widest uppercase',
            'border-2 transition-all',
            isGenerating
              ? 'bg-zinc-800 border-zinc-700 text-zinc-500 cursor-not-allowed'
              : 'bg-amber-500 border-amber-400 text-black hover:bg-amber-400 active:bg-amber-600'
          )}
        >
          {isGenerating ? '[ Generating... ]' : '[ Generate Sprite ]'}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-3 text-xs font-bold tracking-wider border-2 border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
