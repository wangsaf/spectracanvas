import type { MoodKeyword, BrandIdentity } from '@/lib/types';
import { MOOD_DESIGN_MAP } from '@/lib/constants';

// ========================================
// MOOD ANALYSIS & MAPPING
// ========================================

/**
 * Analyze audio and map to mood keywords
 * In production, this would use Meyda for actual audio analysis
 */
export function analyzeMood(audioData?: Float32Array): MoodKeyword[] {
  // Placeholder: Return default moods
  // In production, analyze tempo, energy, spectral features
  return ['energetic', 'professional'];
}

/**
 * Map mood keywords to visual parameters
 */
export function mapMoodToVisuals(moods: MoodKeyword[]): {
  colors: string[];
  filters: string[];
  transitions: string[];
  pacing: 'slow' | 'medium' | 'fast';
} {
  const moodData = moods.map((mood) => MOOD_DESIGN_MAP[mood]);
  
  // Aggregate colors from all moods
  const colors = Array.from(
    new Set(moodData.flatMap((m) => m.colors))
  );

  // Aggregate filters
  const filters = Array.from(
    new Set(moodData.flatMap((m) => m.filters))
  );

  // Aggregate transitions
  const transitions = Array.from(
    new Set(moodData.flatMap((m) => m.transitions))
  );

  // Determine pacing (use most common)
  const pacingCounts = moodData.reduce((acc, m) => {
    acc[m.pacing] = (acc[m.pacing] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pacing = Object.entries(pacingCounts).sort(
    ([, a], [, b]) => b - a
  )[0][0] as 'slow' | 'medium' | 'fast';

  return { colors, filters, transitions, pacing };
}

/**
 * Sync brand colors with mood
 */
export function syncBrandWithMood(
  brand: BrandIdentity,
  moods: MoodKeyword[]
): {
  adjustedColors: string[];
  recommendations: string[];
} {
  const moodVisuals = mapMoodToVisuals(moods);
  const adjustedColors = [...brand.colors.primary];
  const recommendations: string[] = [];

  // Check if brand colors align with mood
  const moodColorSet = new Set(moodVisuals.colors);
  const brandColorSet = new Set(brand.colors.primary);

  const overlap = [...brandColorSet].filter((c) => moodColorSet.has(c));

  if (overlap.length === 0) {
    recommendations.push(
      `Consider adding ${moodVisuals.colors[0]} to align with ${moods.join(', ')} mood`
    );
  }

  // Suggest filters
  if (moodVisuals.filters.length > 0) {
    recommendations.push(
      `Apply ${moodVisuals.filters[0]} filter for ${moods.join(', ')} aesthetic`
    );
  }

  // Suggest pacing
  recommendations.push(
    `Use ${moodVisuals.pacing} pacing for ${moods.join(', ')} energy`
  );

  return { adjustedColors, recommendations };
}

/**
 * Generate mood-based color palette
 */
export function generateMoodPalette(moods: MoodKeyword[]): string[] {
  const moodVisuals = mapMoodToVisuals(moods);
  return moodVisuals.colors.slice(0, 5);
}

/**
 * Get mood description
 */
export function getMoodDescription(mood: MoodKeyword): string {
  const descriptions: Record<MoodKeyword, string> = {
    chill: 'Relaxed, calm, and soothing atmosphere',
    energetic: 'High-energy, dynamic, and exciting vibe',
    dark: 'Mysterious, dramatic, and intense mood',
    happy: 'Upbeat, positive, and cheerful feeling',
    professional: 'Clean, polished, and business-focused',
    retro: 'Nostalgic, vintage, and classic aesthetic',
    futuristic: 'Modern, tech-forward, and innovative',
    organic: 'Natural, earthy, and authentic feel',
  };

  return descriptions[mood];
}

/**
 * Suggest content adjustments based on mood
 */
export function suggestContentAdjustments(
  moods: MoodKeyword[],
  platform: string
): {
  visualStyle: string;
  musicSuggestion: string;
  textStyle: string;
  pacing: string;
} {
  const moodVisuals = mapMoodToVisuals(moods);

  const suggestions = {
    visualStyle: '',
    musicSuggestion: '',
    textStyle: '',
    pacing: '',
  };

  // Visual style
  if (moods.includes('dark')) {
    suggestions.visualStyle = 'Use high contrast, shadows, and dramatic lighting';
  } else if (moods.includes('happy')) {
    suggestions.visualStyle = 'Use bright colors, soft lighting, and cheerful visuals';
  } else if (moods.includes('professional')) {
    suggestions.visualStyle = 'Use clean layouts, minimal design, and corporate aesthetics';
  } else {
    suggestions.visualStyle = 'Use balanced composition with mood-appropriate colors';
  }

  // Music suggestion
  if (moods.includes('energetic')) {
    suggestions.musicSuggestion = 'Upbeat tempo (120-140 BPM), electronic or pop';
  } else if (moods.includes('chill')) {
    suggestions.musicSuggestion = 'Slow tempo (60-90 BPM), ambient or lo-fi';
  } else if (moods.includes('retro')) {
    suggestions.musicSuggestion = 'Synthwave or 80s-inspired tracks';
  } else {
    suggestions.musicSuggestion = 'Moderate tempo (90-110 BPM), genre-appropriate';
  }

  // Text style
  if (moods.includes('professional')) {
    suggestions.textStyle = 'Sans-serif fonts, minimal animations, clear hierarchy';
  } else if (moods.includes('retro')) {
    suggestions.textStyle = 'Pixel or vintage fonts, glitch effects, bold colors';
  } else if (moods.includes('futuristic')) {
    suggestions.textStyle = 'Modern sans-serif, neon effects, smooth animations';
  } else {
    suggestions.textStyle = 'Readable fonts with mood-appropriate styling';
  }

  // Pacing
  suggestions.pacing = `${moodVisuals.pacing.toUpperCase()} pacing - ${
    moodVisuals.pacing === 'fast'
      ? 'Quick cuts, rapid transitions'
      : moodVisuals.pacing === 'slow'
      ? 'Smooth transitions, longer shots'
      : 'Balanced mix of cuts and holds'
  }`;

  return suggestions;
}
