'use client';

import { useState } from 'react';
import type { Platform, Tone, Duration } from '@/lib/types';
import { cn, PLATFORM_LABELS } from '@/lib/utils';
import { useContentStore } from '@/store/content-store';

const PLATFORMS: Platform[] = ['tiktok', 'instagram', 'youtube', 'twitter', 'linkedin'];
const TONES: { value: Tone; label: string }[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'professional', label: 'Professional' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'dramatic', label: 'Dramatic' },
  { value: 'educational', label: 'Educational' },
];
const DURATIONS: { value: Duration; label: string }[] = [
  { value: '15s', label: '15 sec' },
  { value: '30s', label: '30 sec' },
  { value: '60s', label: '60 sec' },
  { value: '3min', label: '3 min' },
  { value: '5min', label: '5 min' },
  { value: '10min', label: '10 min' },
];

export default function ContentForm() {
  const { formData, setFormField, resetForm, setIsGenerating, isGenerating } = useContentStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!formData.topic.trim()) e.topic = 'Topic is required';
    if (!formData.audience.trim()) e.audience = 'Audience is required';
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
      {/* Topic */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          Topic
        </label>
        <textarea
          value={formData.topic}
          onChange={(e) => setFormField('topic', e.target.value)}
          placeholder="How to build a personal brand on social media..."
          rows={3}
          className={cn(
            'w-full bg-zinc-900 border-2 border-zinc-700 rounded px-3 py-2',
            'text-sm text-zinc-100 placeholder-zinc-600 font-mono',
            'focus:outline-none focus:border-cyan-500 transition-colors resize-none',
            errors.topic && 'border-red-500'
          )}
        />
        {errors.topic && (
          <span className="text-xs text-red-400">{errors.topic}</span>
        )}
      </div>

      {/* Platform Dropdown */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          Platform
        </label>
        <select
          value={formData.platform}
          onChange={(e) => setFormField('platform', e.target.value as Platform)}
          className={cn(
            'bg-zinc-900 border-2 border-zinc-700 rounded px-3 py-2',
            'text-sm text-zinc-100 font-mono',
            'focus:outline-none focus:border-cyan-500'
          )}
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {PLATFORM_LABELS[p]}
            </option>
          ))}
        </select>
      </div>

      {/* Audience */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          Target Audience
        </label>
        <input
          type="text"
          value={formData.audience}
          onChange={(e) => setFormField('audience', e.target.value)}
          placeholder="Young professionals aged 25-35..."
          className={cn(
            'w-full bg-zinc-900 border-2 border-zinc-700 rounded px-3 py-2',
            'text-sm text-zinc-100 placeholder-zinc-600 font-mono',
            'focus:outline-none focus:border-cyan-500 transition-colors',
            errors.audience && 'border-red-500'
          )}
        />
        {errors.audience && (
          <span className="text-xs text-red-400">{errors.audience}</span>
        )}
      </div>

      {/* Tone Dropdown */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          Tone
        </label>
        <select
          value={formData.tone}
          onChange={(e) => setFormField('tone', e.target.value as Tone)}
          className={cn(
            'bg-zinc-900 border-2 border-zinc-700 rounded px-3 py-2',
            'text-sm text-zinc-100 font-mono',
            'focus:outline-none focus:border-cyan-500'
          )}
        >
          {TONES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Duration Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          Duration
        </label>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setFormField('duration', d.value)}
              className={cn(
                'px-3 py-1.5 text-xs font-bold tracking-wider border-2 transition-all',
                formData.duration === d.value
                  ? 'bg-cyan-600 border-cyan-500 text-white'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
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
              : 'bg-cyan-600 border-cyan-500 text-white hover:bg-cyan-500 active:bg-cyan-700'
          )}
        >
          {isGenerating ? '[ Generating... ]' : '[ Generate Content ]'}
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
