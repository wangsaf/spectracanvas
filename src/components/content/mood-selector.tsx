'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MoodKeyword } from '@/lib/types';
import { MOOD_KEYWORDS } from '@/lib/constants';
import { getMoodDescription, mapMoodToVisuals, generateMoodPalette } from '@/lib/mood/mood-mapper';

interface MoodSelectorProps {
  selectedMoods: MoodKeyword[];
  onMoodsChange: (moods: MoodKeyword[]) => void;
  maxSelection?: number;
}

export function MoodSelector({ selectedMoods, onMoodsChange, maxSelection = 3 }: MoodSelectorProps) {
  const toggleMood = (mood: MoodKeyword) => {
    if (selectedMoods.includes(mood)) {
      onMoodsChange(selectedMoods.filter((m) => m !== mood));
    } else if (selectedMoods.length < maxSelection) {
      onMoodsChange([...selectedMoods, mood]);
    }
  };

  const moodVisuals = selectedMoods.length > 0 ? mapMoodToVisuals(selectedMoods) : null;
  const moodColors = selectedMoods.length > 0 ? generateMoodPalette(selectedMoods) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>MOOD SELECTOR</CardTitle>
        <CardDescription>
          Select up to {maxSelection} moods to define your content&apos;s vibe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Grid */}
        <div className="grid grid-cols-2 gap-3">
          {MOOD_KEYWORDS.map((mood) => {
            const isSelected = selectedMoods.includes(mood.value as MoodKeyword);

            return (
              <button
                key={mood.value}
                onClick={() => toggleMood(mood.value as MoodKeyword)}
                disabled={!isSelected && selectedMoods.length >= maxSelection}
                className={`p-4 border transition-all rounded ${
                  isSelected
                    ? 'bg-[#d9453b] text-white border-[#d9453b]'
                    : 'bg-transparent text-[#a09484] border-[#3a322a] hover:border-[#d9453b] hover:text-[#f0e8dc] disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <div className="text-xs font-bold tracking-wider mb-2">
                  {mood.value.toUpperCase()}
                </div>
                <div className="text-[10px] opacity-70">
                  {getMoodDescription(mood.value as MoodKeyword).split(',')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Moods Info */}
        {selectedMoods.length > 0 && (
          <div className="pt-4 border-t border-[#3a322a] space-y-4">
            <div>
              <p className="text-xs font-bold tracking-wider text-[#a09484] mb-2">
                SELECTED MOODS ({selectedMoods.length}/{maxSelection})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedMoods.map((mood) => (
                  <span
                    key={mood}
                    className="px-3 py-1 bg-[#d9453b] text-white text-xs font-bold tracking-wider rounded"
                  >
                    {mood.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {moodVisuals && (
              <>
                {/* Mood Colors */}
                <div>
                  <p className="text-xs font-bold tracking-wider text-[#a09484] mb-2">
                    MOOD COLORS
                  </p>
                  <div className="flex gap-1">
                    {moodColors.slice(0, 5).map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 border border-[#3a322a] rounded"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Typography Style */}
                <div>
                  <p className="text-xs font-bold tracking-wider text-[#a09484] mb-2">
                    TYPOGRAPHY STYLE
                  </p>
                  <span className="px-2 py-1 border border-[#3a322a] text-xs text-[#a09484] rounded">
                    {moodVisuals.typographyStyle.weight} / {moodVisuals.typographyStyle.style}
                  </span>
                </div>

                {/* Pacing */}
                <div>
                  <p className="text-xs font-bold tracking-wider text-[#a09484] mb-2">
                    PACING
                  </p>
                  <span className="px-3 py-2 bg-[#241f1a] border border-[#3a322a] text-sm text-[#f0e8dc] inline-block rounded">
                    {moodVisuals.pacing.toUpperCase()}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Clear Button */}
        {selectedMoods.length > 0 && (
          <Button
            variant="outline"
            onClick={() => onMoodsChange([])}
            className="w-full"
          >
            [ CLEAR SELECTION ]
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
