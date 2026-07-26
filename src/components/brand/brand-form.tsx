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
import { INDUSTRIES, BRAND_VALUES, MOOD_KEYWORDS } from '@/lib/constants';
import type { MoodKeyword } from '@/lib/types';

interface BrandFormProps {
  onGenerate: (data: BrandFormData) => void;
  isGenerating?: boolean;
}

export interface BrandFormData {
  name: string;
  industry: string;
  values: string[];
  targetAudience: string;
  mood?: MoodKeyword[];
}

export function BrandForm({ onGenerate, isGenerating = false }: BrandFormProps) {
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    industry: '',
    values: [],
    targetAudience: '',
    mood: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Brand name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Brand name must be at least 2 characters';
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    if (formData.values.length < 3) {
      newErrors.values = 'Please select at least 3 brand values';
    } else if (formData.values.length > 5) {
      newErrors.values = 'Please select no more than 5 brand values';
    }

    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = 'Target audience is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onGenerate(formData);
  };

  const toggleValue = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      values: prev.values.includes(value)
        ? prev.values.filter((v) => v !== value)
        : [...prev.values, value],
    }));
  };

  const toggleMood = (mood: MoodKeyword) => {
    setFormData((prev) => ({
      ...prev,
      mood: prev.mood?.includes(mood)
        ? prev.mood.filter((m) => m !== mood)
        : [...(prev.mood || []), mood],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Brand Name */}
      <div className="space-y-2">
        <label htmlFor="brand-name" className="text-xs font-bold tracking-wider text-[#a09484]">
          BRAND NAME *
        </label>
        <Input
          id="brand-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter your brand name"
          disabled={isGenerating}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <label htmlFor="industry" className="text-xs font-bold tracking-wider text-[#a09484]">
          INDUSTRY *
        </label>
        <Select
          value={formData.industry}
          onValueChange={(value) => setFormData({ ...formData, industry: value })}
          disabled={isGenerating}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry.value} value={industry.value}>
                {industry.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.industry && (
          <p className="text-xs text-red-500">{errors.industry}</p>
        )}
      </div>

      {/* Brand Values */}
      <div className="space-y-2">
        <label className="text-xs font-bold tracking-wider text-[#a09484]">
          BRAND VALUES * (Select 3-5)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {BRAND_VALUES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleValue(value)}
              disabled={isGenerating || (!formData.values.includes(value) && formData.values.length >= 5)}
              className={`px-3 py-2 text-xs font-bold tracking-wider border transition-colors ${
                formData.values.includes(value)
                  ? 'bg-[#d9453b] text-white border-[#d9453b] rounded'
                  : 'bg-transparent text-[#a09484] border rounded border-[#3a322a] hover:border-[#d9453b] hover:text-[#f0e8dc]'
              } ${!formData.values.includes(value) && formData.values.length >= 5 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {value}
            </button>
          ))}
        </div>
        {errors.values && (
          <p className="text-xs text-red-500">{errors.values}</p>
        )}
        <p className="text-xs text-[#6b5f52]">
          Selected: {formData.values.length} / 5 {formData.values.length < 3 && '(minimum 3)'}
        </p>
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <label htmlFor="target-audience" className="text-xs font-bold tracking-wider text-[#a09484]">
          TARGET AUDIENCE *
        </label>
        <Textarea
          id="target-audience"
          value={formData.targetAudience}
          onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
          placeholder="Describe your target audience (e.g., Young professionals aged 25-35 who value sustainability)"
          rows={3}
          disabled={isGenerating}
        />
        {errors.targetAudience && (
          <p className="text-xs text-red-500">{errors.targetAudience}</p>
        )}
      </div>

      {/* Mood Selection */}
      <Card>
        <CardHeader>
          <CardTitle>MOOD SYNC (OPTIONAL)</CardTitle>
          <CardDescription>
            Select mood keywords to influence the brand style
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {MOOD_KEYWORDS.map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() => toggleMood(mood.value as MoodKeyword)}
                disabled={isGenerating}
                className={`px-3 py-2 text-xs font-bold tracking-wider border transition-colors ${
                  formData.mood?.includes(mood.value as MoodKeyword)
                    ? 'bg-[#d9453b] text-white border-[#d9453b] rounded'
                    : 'bg-transparent text-[#a09484] border rounded border-[#3a322a] hover:border-[#d9453b] hover:text-[#f0e8dc]'
                }`}
              >
                {mood.label.split(' / ')[0]}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isGenerating}
      >
        {isGenerating ? '[ GENERATING... ]' : '[ GENERATE BRAND IDENTITY ]'}
      </Button>
    </form>
  );
}