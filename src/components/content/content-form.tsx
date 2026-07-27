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
import { PLATFORMS, CONTENT_TONES, DURATIONS } from '@/lib/constants';
import type { Platform, Tone } from '@/lib/types';

interface ContentFormProps {
  onGenerate: (data: ContentFormData) => void;
  isGenerating?: boolean;
  brandContext?: string;
}

export interface ContentFormData {
  topic: string;
  platform: Platform;
  tone: Tone;
  duration: number;
  brandContext?: string;
}

export function ContentForm({ onGenerate, isGenerating = false, brandContext }: ContentFormProps) {
  const [formData, setFormData] = useState<ContentFormData>({
    topic: '',
    platform: 'tiktok',
    tone: 'casual',
    duration: 30,
    brandContext,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    } else if (formData.topic.length < 10) {
      newErrors.topic = 'Topic must be at least 10 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onGenerate(formData);
  };

  const selectedPlatform = PLATFORMS.find((p) => p.value === formData.platform);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Topic */}
      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wider text-[#a1a1aa]">
          TOPIC / IDEA *
        </label>
        <Textarea
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          placeholder="Describe your content idea (e.g., 'New pixel art game launch with retro aesthetics', 'How to create brand identity in 5 steps')"
          rows={4}
          disabled={isGenerating}
        />
        {errors.topic && (
          <p className="text-xs text-red-500">{errors.topic}</p>
        )}
      </div>

      {/* Platform */}
      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wider text-[#a1a1aa]">
          PLATFORM *
        </label>
        <Select
          value={formData.platform}
          onValueChange={(value) => setFormData({ ...formData, platform: value as Platform })}
          disabled={isGenerating}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PLATFORMS.map((platform) => (
              <SelectItem key={platform.value} value={platform.value}>
                {platform.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedPlatform && (
          <p className="text-xs text-[#71717a]">
            Max duration: {selectedPlatform.maxDuration}s • Aspect ratio: {selectedPlatform.aspectRatio}
          </p>
        )}
      </div>

      {/* Tone */}
      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wider text-[#a1a1aa]">
          TONE *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CONTENT_TONES.map((tone) => (
            <button
              key={tone.value}
              type="button"
              onClick={() => setFormData({ ...formData, tone: tone.value as Tone })}
              disabled={isGenerating}
              className={`px-4 py-3 text-left border transition-colors rounded ${
                formData.tone === tone.value
                  ? 'bg-[#ffffff] text-[#000000] border-[#ffffff]'
                  : 'bg-transparent text-[#a1a1aa] border-[#27272a] hover:border-[#ffffff] hover:text-[#ffffff]'
              }`}
            >
              <div className="text-xs font-bold tracking-wider">{tone.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wider text-[#a1a1aa]">
          DURATION *
        </label>
        <Select
          value={formData.duration.toString()}
          onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}
          disabled={isGenerating}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DURATIONS.map((duration) => (
              <SelectItem key={duration.value} value={duration.value.toString()}>
                {duration.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand Context (if available) */}
      {brandContext && (
        <div className="p-4 border border-[#27272a] bg-[#0a0a0a] rounded">
          <p className="text-xs font-bold tracking-wider text-[#a1a1aa] mb-2">
            BRAND CONTEXT
          </p>
          <p className="text-xs text-[#71717a]">
            Using {brandContext} for consistent messaging
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isGenerating}
      >
        {isGenerating ? '[ GENERATING SCRIPT... ]' : '[ GENERATE CONTENT SCRIPT ]'}
      </Button>
    </form>
  );
}