import {
  hexToHsl,
  hslToHex,
  lightenColor,
  darkenColor,
  adjustSaturation,
  shiftHue,
  isLightColor,
} from '@/lib/utils';
import type { ColorSystem, ColorShades, MoodKeyword } from '@/lib/types';
import { MOOD_DESIGN_MAP } from '@/lib/constants';

// ========================================
// COLOR PALETTE GENERATION
// ========================================

/**
 * Generate a complete color system from a base color
 */
export function generateColorSystem(
  baseColor: string,
  mood?: MoodKeyword
): ColorSystem {
  // Apply mood adjustments if provided
  let adjustedBase = baseColor;
  if (mood && MOOD_DESIGN_MAP[mood]) {
    const moodParams = MOOD_DESIGN_MAP[mood];
    adjustedBase = applyMoodToColor(baseColor, moodParams.colorShift);
  }

  // Generate primary color shades
  const primary = generateShades(adjustedBase);

  // Generate secondary color (complementary)
  const secondaryBase = shiftHue(adjustedBase, 180);
  const secondary = generateShades(secondaryBase);

  // Generate accent color (triadic)
  const accentBase = shiftHue(adjustedBase, 120);
  const accent = generateShades(accentBase);

  // Generate neutral colors
  const neutral = generateNeutralShades();

  return {
    primary,
    secondary,
    accent,
    neutral,
  };
}

/**
 * Generate color shades from a base color
 */
export function generateShades(baseColor: string): ColorShades {
  return {
    base: baseColor,
    lighter: lightenColor(baseColor, 20),
    light: lightenColor(baseColor, 10),
    dark: darkenColor(baseColor, 10),
    darker: darkenColor(baseColor, 20),
  };
}

/**
 * Generate neutral gray shades
 */
export function generateNeutralShades(): ColorShades {
  return {
    base: '#888888',
    lighter: '#cccccc',
    light: '#aaaaaa',
    dark: '#666666',
    darker: '#444444',
  };
}

/**
 * Apply mood parameters to a color
 */
export function applyMoodToColor(
  color: string,
  moodShift: { hueShift: number; saturationMultiplier: number; brightnessMultiplier: number }
): string {
  let result = color;

  // Apply hue shift
  if (moodShift.hueShift !== 0) {
    result = shiftHue(result, moodShift.hueShift);
  }

  // Apply saturation adjustment
  if (moodShift.saturationMultiplier !== 1) {
    result = adjustSaturation(result, moodShift.saturationMultiplier);
  }

  // Apply brightness adjustment
  const hsl = hexToHsl(result);
  if (hsl && moodShift.brightnessMultiplier !== 1) {
    const newL = Math.min(100, Math.max(0, hsl.l * moodShift.brightnessMultiplier));
    result = hslToHex(hsl.h, hsl.s, newL);
  }

  return result;
}

// ========================================
// INDUSTRY-BASED COLOR GENERATION
// ========================================

const INDUSTRY_COLOR_MAP: Record<string, string> = {
  tech: '#0088ff',
  gaming: '#ff0088',
  music: '#8800ff',
  fashion: '#ff0066',
  food: '#ff6600',
  fitness: '#00ff66',
  education: '#0066ff',
  finance: '#006666',
  creative: '#ff00ff',
  other: '#00ff88',
};

/**
 * Get base color for an industry
 */
export function getIndustryColor(industry: string): string {
  return INDUSTRY_COLOR_MAP[industry] || INDUSTRY_COLOR_MAP.other;
}

/**
 * Generate color palette based on industry and values
 */
export function generateIndustryPalette(
  industry: string,
  values: string[],
  mood?: MoodKeyword
): ColorSystem {
  // Start with industry base color
  let baseColor = getIndustryColor(industry);

  // Adjust based on brand values
  baseColor = adjustColorForValues(baseColor, values);

  // Generate full color system
  return generateColorSystem(baseColor, mood);
}

/**
 * Adjust color based on brand values
 */
function adjustColorForValues(baseColor: string, values: string[]): string {
  let result = baseColor;

  // Value-based adjustments
  if (values.includes('Playful')) {
    result = adjustSaturation(result, 1.2);
  }
  if (values.includes('Professional')) {
    result = adjustSaturation(result, 0.8);
  }
  if (values.includes('Bold')) {
    const hsl = hexToHsl(result);
    if (hsl) {
      result = hslToHex(hsl.h, Math.min(100, hsl.s + 10), hsl.l);
    }
  }
  if (values.includes('Minimalist')) {
    result = adjustSaturation(result, 0.7);
  }
  if (values.includes('Elegant')) {
    const hsl = hexToHsl(result);
    if (hsl) {
      result = hslToHex(hsl.h, hsl.s, Math.max(20, hsl.l - 10));
    }
  }
  if (values.includes('Energetic')) {
    const hsl = hexToHsl(result);
    if (hsl) {
      result = hslToHex(hsl.h, Math.min(100, hsl.s + 15), Math.min(100, hsl.l + 10));
    }
  }

  return result;
}

// ========================================
// COLOR HARMONY GENERATION
// ========================================

/**
 * Generate analogous color scheme
 */
export function generateAnalogousColors(baseColor: string): string[] {
  return [
    shiftHue(baseColor, -30),
    baseColor,
    shiftHue(baseColor, 30),
  ];
}

/**
 * Generate triadic color scheme
 */
export function generateTriadicColors(baseColor: string): string[] {
  return [
    baseColor,
    shiftHue(baseColor, 120),
    shiftHue(baseColor, 240),
  ];
}

/**
 * Generate complementary color scheme
 */
export function generateComplementaryColors(baseColor: string): string[] {
  return [
    baseColor,
    shiftHue(baseColor, 180),
  ];
}

/**
 * Generate split-complementary color scheme
 */
export function generateSplitComplementaryColors(baseColor: string): string[] {
  return [
    baseColor,
    shiftHue(baseColor, 150),
    shiftHue(baseColor, 210),
  ];
}

// ========================================
// COLOR VALIDATION
// ========================================

/**
 * Check WCAG contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance of a color
 */
function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const sRGB = val / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Check if color combination meets WCAG AA standard
 */
export function meetsWCAGAA(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 4.5;
}

/**
 * Check if color combination meets WCAG AAA standard
 */
export function meetsWCAGAAA(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 7;
}

/**
 * Find accessible text color for background
 */
export function getAccessibleTextColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio('#ffffff', backgroundColor);
  const blackContrast = getContrastRatio('#000000', backgroundColor);

  return whiteContrast > blackContrast ? '#ffffff' : '#000000';
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// ========================================
// EXPORT UTILITIES
// ========================================

/**
 * Convert color system to CSS variables
 */
export function colorSystemToCSSVars(colors: ColorSystem): string {
  return `
:root {
  /* Primary Colors */
  --color-primary: ${colors.primary.base};
  --color-primary-lighter: ${colors.primary.lighter};
  --color-primary-light: ${colors.primary.light};
  --color-primary-dark: ${colors.primary.dark};
  --color-primary-darker: ${colors.primary.darker};

  /* Secondary Colors */
  --color-secondary: ${colors.secondary.base};
  --color-secondary-lighter: ${colors.secondary.lighter};
  --color-secondary-light: ${colors.secondary.light};
  --color-secondary-dark: ${colors.secondary.dark};
  --color-secondary-darker: ${colors.secondary.darker};

  /* Accent Colors */
  --color-accent: ${colors.accent.base};
  --color-accent-lighter: ${colors.accent.lighter};
  --color-accent-light: ${colors.accent.light};
  --color-accent-dark: ${colors.accent.dark};
  --color-accent-darker: ${colors.accent.darker};

  /* Neutral Colors */
  --color-neutral: ${colors.neutral.base};
  --color-neutral-lighter: ${colors.neutral.lighter};
  --color-neutral-light: ${colors.neutral.light};
  --color-neutral-dark: ${colors.neutral.dark};
  --color-neutral-darker: ${colors.neutral.darker};
}
`.trim();
}

/**
 * Convert color system to Tailwind config
 */
export function colorSystemToTailwind(colors: ColorSystem): Record<string, any> {
  return {
    primary: {
      DEFAULT: colors.primary.base,
      lighter: colors.primary.lighter,
      light: colors.primary.light,
      dark: colors.primary.dark,
      darker: colors.primary.darker,
    },
    secondary: {
      DEFAULT: colors.secondary.base,
      lighter: colors.secondary.lighter,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      darker: colors.secondary.darker,
    },
    accent: {
      DEFAULT: colors.accent.base,
      lighter: colors.accent.lighter,
      light: colors.accent.light,
      dark: colors.accent.dark,
      darker: colors.accent.darker,
    },
    neutral: {
      DEFAULT: colors.neutral.base,
      lighter: colors.neutral.lighter,
      light: colors.neutral.light,
      dark: colors.neutral.dark,
      darker: colors.neutral.darker,
    },
  };
}
