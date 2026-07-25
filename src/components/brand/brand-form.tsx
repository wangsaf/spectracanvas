'use client';

import { useState } from 'react';
import { useBrandStore } from '@/store/brand-store';
import { BRAND_VALUES, INDUSTRIES, MOODS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Industry, Mood } from '@/lib/types';

export function BrandForm() {
  const {
    input,
    setName,
    setIndustry,
    toggleValue,
    setAudience,
    setMood,
    generateBrand,
    isGenerating,
  } = useBrandStore();

  const [valueSearch, setValueSearch] = useState('');

  const filteredValues = BRAND_VALUES.filter((v) =>
    v.toLowerCase().includes(valueSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateBrand();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full max-w-xl"
    >
      {/* Brand Name */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="brand-name"
          className="text-sm font-mono font-semibold tracking-wider uppercase text-white/70"
        >
          Brand Name
        </label>
        <input
          id="brand-name"
          type="text"
          value={input.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter brand name..."
          className={cn(
            'w-full px-4 py-3 bg-[#111] border-2 border-[#222] text-white',
            'font-mono text-base placeholder:text-white/30',
            'focus:outline-none focus:border-white/40 transition-colors',
            'rounded-none'
          )}
        />
      </div>

      {/* Industry */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="industry"
          className="text-sm font-mono font-semibold tracking-wider uppercase text-white/70"
        >
          Industry
        </label>
        <select
          id="industry"
          value={input.industry}
          onChange={(e) => setIndustry(e.target.value as Industry)}
          className={cn(
            'w-full px-4 py-3 bg-[#111] border-2 border-[#222] text-white',
            'font-mono text-base appearance-none cursor-pointer',
            'focus:outline-none focus:border-white/40 transition-colors',
            'rounded-none'
          )}
        >
          {INDUSTRIES.map((ind) => (
            <option key={ind.value} value={ind.value}>
              {ind.label}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Values */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-mono font-semibold tracking-wider uppercase text-white/70">
          Brand Values
        </label>
        <input
          type="text"
          value={valueSearch}
          onChange={(e) => setValueSearch(e.target.value)}
          placeholder="Search values..."
          className={cn(
            'w-full px-4 py-2 bg-[#111] border-2 border-[#222] text-white',
            'font-mono text-sm placeholder:text-white/30',
            'focus:outline-none focus:border-white/40 transition-colors',
            'rounded-none'
          )}
        />
        <div className="flex flex-wrap gap-2 mt-1">
          {filteredValues.map((value) => {
            const selected = input.values.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleValue(value)}
                className={cn(
                  'px-3 py-1.5 text-xs font-mono uppercase tracking-wide',
                  'border-2 transition-colors rounded-none',
                  selected
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/60 border-[#222] hover:border-white/40 hover:text-white/80'
                )}
              >
                {value}
              </button>
            );
          })}
        </div>
        {input.values.length > 0 && (
          <p className="text-xs font-mono text-white/40 mt-1">
            {input.values.length} selected: {input.values.join(', ')}
          </p>
        )}
      </div>

      {/* Target Audience */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="audience"
          className="text-sm font-mono font-semibold tracking-wider uppercase text-white/70"
        >
          Target Audience
        </label>
        <input
          id="audience"
          type="text"
          value={input.audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g. Young professionals, small business owners..."
          className={cn(
            'w-full px-4 py-3 bg-[#111] border-2 border-[#222] text-white',
            'font-mono text-base placeholder:text-white/30',
            'focus:outline-none focus:border-white/40 transition-colors',
            'rounded-none'
          )}
        />
      </div>

      {/* Mood Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-mono font-semibold tracking-wider uppercase text-white/70">
          Brand Mood
        </label>
        <div className="grid grid-cols-2 gap-2">
          {MOODS.map((mood) => {
            const selected = input.mood === mood.value;
            return (
              <button
                key={mood.value}
                type="button"
                onClick={() => setMood(mood.value as Mood)}
                className={cn(
                  'px-4 py-3 text-left border-2 transition-colors rounded-none',
                  selected
                    ? 'bg-white/10 border-white text-white'
                    : 'bg-[#111] border-[#222] text-white/60 hover:border-white/40 hover:text-white/80'
                )}
              >
                <span className="block text-sm font-mono font-semibold uppercase tracking-wide">
                  {mood.label}
                </span>
                <span className="block text-xs font-mono text-white/40 mt-0.5">
                  {mood.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="submit"
        disabled={!input.name.trim() || isGenerating}
        className={cn(
          'w-full py-4 px-6 font-mono text-sm uppercase tracking-widest',
          'border-2 transition-colors rounded-none',
          input.name.trim() && !isGenerating
            ? 'bg-white text-black border-white hover:bg-white/90 cursor-pointer'
            : 'bg-[#222] text-white/30 border-[#222] cursor-not-allowed'
        )}
      >
        {isGenerating ? 'Generating...' : 'Generate Brand Identity'}
      </button>
    </form>
  );
}

export default BrandForm;
