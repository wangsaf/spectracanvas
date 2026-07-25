'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MoodKeyword } from '@/lib/types';
import { MOOD_DESIGN_MAP } from '@/lib/constants';
import { getMoodDescription, mapMoodToVisuals } from '@/lib/mood/mood-mapper';

interface MoodSelectorProps {
  selectedMoods: MoodKeyword[];
  onMoodsChange: (moods: MoodKeyword[]) => void;
  maxSelection?: number;
}

export function MoodSelector({ selectedMoods, onMoodsChange, maxSelection = 3 }: MoodSelectorProps) {
  const moods: MoodKeyword[] = [
    'chill',
    'energetic',
    'dark',
    'happy',
    'professional',
    'retro',
    'futuristic',
    'organic',
  ];

  const toggleMood = (mood: MoodKeyword) => {
    if (selectedMoods.includes(mood)) {
      onMoodsChange(selectedMoods.filter((m) => m !== mood));
    } else if (selectedMoods.length < maxSelection) {
      onMoodsChange([...selectedMoods, mood]);
    }
  };

  const moodVisuals = selectedMoods.length > 0 ? mapMoodToVisuals(selectedMoods) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>MOOD SELECTOR</CardTitle>
        <CardDescription>
          Select up to {maxSelection} moods to define your content's vibe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Grid */}
        <div className="grid grid-cols-2 gap-3">
          {moods.map((mood) => {
            const isSelected = selectedMoods.includes(mood);
    const moodData = MOOD_DESIGN_MAP[mood];
            
            return (
              <button
                key={mood}
                onClick={() => toggleMood(mood)}
                disabled={!isSelected && selectedMoods.length >= maxSelection}
                className={`p-4 border transition-all ${
                  isSelected
                    ? 'bg-[#00ff88] text-black border-[#00ff88]'
                    : 'bg-transparent text-neutral-400 border-[#222] hover:border-[#00ff88] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <div className="text-xs font-bold tracking-wider mb-2">
                  {mood.toUpperCase()}
                </div>
                <div className="flex gap-1 mb-2">
                  {moodData.colors.slice(0, 3).map((color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 border border-current"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="text-[10px] opacity-70">
                  {getMoodDescription(mood).split(',')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Moods Info */}
        {selectedMoods.length > 0 && (
          <div className="pt-4 border-t border-[#222] space-y-4">
            <div>
              <p className="text-xs font-bold tracking-wider text-neutral-400 mb-2">
                SELECTED MOODS ({selectedMoods.length}/{maxSelection})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedMoods.map((mood) => (
                  <span
                    key={mood}
                    className="px-3 py-1 bg-[#00ff88] text-black text-xs font-bold tracking-wider"
                  >
                    {mood.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {moodVisuals && (
              <>
                {/* Color Palette */}
                <div>
                  <p className="text-xs font-bold tracking-wider text-neutral-400 mb-2">
                    MOOD COLORS
                  </p>
                  <div className="flex gap-1">
                    {moodVisuals.colors.slice(0, 8).map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 border border-[#222]"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Visual Effects */}
                <div>
                  <p className="text-xs font-bold tracking-wider text-neutral-400 mb-2">
                    SUGGESTED FILTERS
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {moodVisuals.filters.map((filter, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 border border-[#222] text-xs text-neutral-400"
                      >
                        {filter}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Transitions */}
                <div>
                  <p className="text-xs font-bold tracking-wider text-neutral-400 mb-2">
                    TRANSITIONS
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {moodVisuals.transitions.map((transition, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 border border-[#222] text-xs text-neutral-400"
                      >
                        {transition}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pacing */}
                <div>
                  <p className="text-xs font-bold tracking-wider text-neutral-400 mb-2">
                    PACING
                  </p>
                  <span className="px-3 py-2 bg-[#111] border border-[#222] text-sm text-white inline-block">
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
