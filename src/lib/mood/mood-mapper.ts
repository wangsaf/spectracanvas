import type { MoodKeyword, BrandIdentity } from '@/lib/types';
import { MOOD_DESIGN_MAP } from '@/lib/constants';

// ========================================
// MOOD ANALYSIS & MAPPING
// ========================================

/**
 * Analyze audio and map to mood keywords
 * Placeholder: returns default moods
 */
export function analyzeMood(_audioData?: Float32Array): MoodKeyword[] {
  return ['energetic', 'professional'];
}

/**
 * Map mood keywords to visual parameters
 * Returns aggregated design parameters from selected moods
 */
export function mapMoodToVisuals(moods: MoodKeyword[]): {
  colorShift: { hueShift: number; saturationMultiplier: number; brightnessMultiplier: number };
  typographyStyle: { weight: string; style: string };
  animationSpeed: { multiplier: number; easing: string };
  saturation: number;
  brightness: number;
  pacing: 'slow' | 'medium' | 'fast';
} {
  const moodData = moods.map((mood) => MOOD_DESIGN_MAP[mood]).filter(Boolean);

  if (moodData.length === 0) {
    return {
      colorShift: { hueShift: 0, saturationMultiplier: 1, brightnessMultiplier: 1 },
      typographyStyle: { weight: 'normal', style: 'geometric' },
      animationSpeed: { multiplier: 1, easing: 'ease' },
      saturation: 70,
      brightness: 70,
      pacing: 'medium',
    };
  }

  // Aggregate color shifts (average)
  const avgHueShift = moodData.reduce((s, m) => s + m.colorShift.hueShift, 0) / moodData.length;
  const avgSatMul = moodData.reduce((s, m) => s + m.colorShift.saturationMultiplier, 0) / moodData.length;
  const avgBriMul = moodData.reduce((s, m) => s + m.colorShift.brightnessMultiplier, 0) / moodData.length;

  // Use most common typography style
  const typeStyles = moodData.map((m) => `${m.typographyStyle.weight}-${m.typographyStyle.style}`);
  const mostCommonType = typeStyles.sort((a, b) =>
    typeStyles.filter((v) => v === b).length - typeStyles.filter((v) => v === a).length
  )[0];
  const [tWeight, tStyle] = mostCommonType.split('-');

  // Use average animation speed
  const avgAnimMul = moodData.reduce((s, m) => s + m.animationSpeed.multiplier, 0) / moodData.length;

  // Average saturation and brightness
  const avgSat = moodData.reduce((s, m) => s + m.saturation, 0) / moodData.length;
  const avgBri = moodData.reduce((s, m) => s + m.brightness, 0) / moodData.length;

  // Determine pacing from animation speed
  const pacing: 'slow' | 'medium' | 'fast' = avgAnimMul < 0.8 ? 'slow' : avgAnimMul > 1.2 ? 'fast' : 'medium';

  return {
    colorShift: { hueShift: Math.round(avgHueShift), saturationMultiplier: avgSatMul, brightnessMultiplier: avgBriMul },
    typographyStyle: { weight: tWeight, style: tStyle },
    animationSpeed: { multiplier: avgAnimMul, easing: moodData[0].animationSpeed.easing },
    saturation: Math.round(avgSat),
    brightness: Math.round(avgBri),
    pacing,
  };
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
  const visuals = mapMoodToVisuals(moods);
  const brandColorValues = Object.values(brand.colors.primary) as string[];
  const adjustedColors = [...brandColorValues];
  const recommendations: string[] = [];

  recommendations.push(
    `Shift hue by ${visuals.colorShift.hueShift} degrees for ${moods.join(', ')} mood`
  );
  recommendations.push(
    `Use ${visuals.pacing} pacing for ${moods.join(', ')} energy`
  );

  return { adjustedColors, recommendations };
}

/**
 * Generate mood-based color palette (hex strings)
 */
export function generateMoodPalette(moods: MoodKeyword[]): string[] {
  const visuals = mapMoodToVisuals(moods);
  // Generate some representative colors based on mood params
  const baseHues = moods.map((m) => {
    const hueMap: Record<MoodKeyword, number> = {
      chill: 200, energetic: 0, dark: 260, happy: 50,
      professional: 210, retro: 30, futuristic: 180, organic: 120,
    };
    return hueMap[m] ?? 0;
  });
  return baseHues.map((h) => `hsl(${h}, ${visuals.saturation}%, ${visuals.brightness}%)`);
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
  _platform: string
): {
  visualStyle: string;
  musicSuggestion: string;
  textStyle: string;
  pacing: string;
} {
  const visuals = mapMoodToVisuals(moods);

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
  suggestions.pacing = `${visuals.pacing.toUpperCase()} pacing - ${
    visuals.pacing === 'fast'
      ? 'Quick cuts, rapid transitions'
      : visuals.pacing === 'slow'
      ? 'Smooth transitions, longer shots'
      : 'Balanced mix of cuts and holds'
  }`;

  return suggestions;
}
