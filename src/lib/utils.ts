import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { BrandInput, ColorSwatch, FontPairing, LogoVariation } from './types';
import { SAMPLE_FONTS } from './constants';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hueToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function generatePalette(input: BrandInput): ColorSwatch[] {
  const seed = hashString(input.name + input.industry + input.mood);
  const rand = seededRandom(seed);
  const baseHue = rand() * 360;

  const moodModifiers: Record<string, { satRange: [number, number]; lightRange: [number, number] }> = {
    professional: { satRange: [30, 50], lightRange: [40, 55] },
    playful: { satRange: [65, 90], lightRange: [50, 65] },
    bold: { satRange: [70, 95], lightRange: [35, 50] },
    elegant: { satRange: [20, 45], lightRange: [30, 50] },
    minimal: { satRange: [10, 30], lightRange: [45, 60] },
    warm: { satRange: [50, 75], lightRange: [45, 60] },
    futuristic: { satRange: [60, 90], lightRange: [45, 60] },
    organic: { satRange: [30, 55], lightRange: [35, 55] },
  };

  const mod = moodModifiers[input.mood] || moodModifiers.professional;
  const randS = () => mod.satRange[0] + rand() * (mod.satRange[1] - mod.satRange[0]);
  const randL = () => mod.lightRange[0] + rand() * (mod.lightRange[1] - mod.lightRange[0]);

  return [
    { hex: hueToHex(baseHue, randS(), randL()).toUpperCase(), name: 'Primary', role: 'primary' },
    { hex: hueToHex((baseHue + 30 + rand() * 30) % 360, randS(), randL()).toUpperCase(), name: 'Secondary', role: 'secondary' },
    { hex: hueToHex((baseHue + 150 + rand() * 60) % 360, randS() + 10, randL()).toUpperCase(), name: 'Accent', role: 'accent' },
    { hex: hueToHex(baseHue, 5 + rand() * 10, 20 + rand() * 15).toUpperCase(), name: 'Neutral', role: 'neutral' },
    { hex: hueToHex(baseHue, 5 + rand() * 5, 95 + rand() * 4).toUpperCase(), name: 'Background', role: 'background' },
  ];
}

export function generateFonts(input: BrandInput): FontPairing {
  const fonts = SAMPLE_FONTS[input.mood] || SAMPLE_FONTS.professional;
  const seed = hashString(input.name + 'fonts');
  const rand = seededRandom(seed);
  const headingIdx = Math.floor(rand() * fonts.length);
  let bodyIdx = Math.floor(rand() * fonts.length);
  if (bodyIdx === headingIdx) bodyIdx = (bodyIdx + 1) % fonts.length;
  return {
    heading: fonts[headingIdx],
    body: fonts[bodyIdx],
    category: input.mood,
  };
}

export function generateLogos(input: BrandInput, palette: ColorSwatch[]): LogoVariation[] {
  const primary = palette[0]?.hex || '#ffffff';
  const secondary = palette[1]?.hex || '#888888';
  const accent = palette[2]?.hex || '#cccccc';
  const bg = palette[4]?.hex || '#0a0a0a';
  const initial = input.name.charAt(0).toUpperCase();

  const textLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="80" viewBox="0 0 320 80">
    <rect width="320" height="80" fill="${bg}"/>
    <text x="160" y="52" text-anchor="middle" font-family="'${generateFonts(input).heading}', sans-serif" font-size="36" font-weight="700" fill="${primary}">${input.name}</text>
  </svg>`;

  const iconTextLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="80" viewBox="0 0 320 80">
    <rect width="320" height="80" fill="${bg}"/>
    <rect x="16" y="16" width="48" height="48" fill="${primary}"/>
    <text x="28" y="50" text-anchor="middle" font-family="monospace" font-size="28" font-weight="700" fill="${bg}">${initial}</text>
    <text x="80" y="52" font-family="'${generateFonts(input).heading}', sans-serif" font-size="28" font-weight="700" fill="${primary}">${input.name}</text>
  </svg>`;

  const seed = hashString(input.name + 'abstract');
  const rand = seededRandom(seed);
  const shapes = Array.from({ length: 5 }, () => {
    const cx = 20 + rand() * 60;
    const cy = 10 + rand() * 60;
    const size = 10 + rand() * 30;
    const colors = [primary, secondary, accent];
    const fill = colors[Math.floor(rand() * colors.length)];
    return `<rect x="${cx}" y="${cy}" width="${size}" height="${size}" fill="${fill}" opacity="${0.6 + rand() * 0.4}"/>`;
  }).join('');

  const abstractLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="80" viewBox="0 0 320 80">
    <rect width="320" height="80" fill="${bg}"/>
    ${shapes}
    <text x="160" y="52" text-anchor="middle" font-family="'${generateFonts(input).heading}', sans-serif" font-size="20" font-weight="400" fill="${primary}">${input.name}</text>
  </svg>`;

  return [
    { type: 'text', svg: textLogo, label: 'Text Logo' },
    { type: 'icon-text', svg: iconTextLogo, label: 'Icon + Text' },
    { type: 'abstract', svg: abstractLogo, label: 'Abstract Mark' },
  ];
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.reject(new Error('Clipboard API not available'));
}

// ===== Pixel / Content Utility Functions =====

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function createEmptyPixelGrid(width: number, height: number): string[][] {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => '#00000000')
  );
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export const DEFAULT_PALETTE: string[] = [
  '#000000', '#1D2B53', '#7E2553', '#008751',
  '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8',
  '#FF004D', '#FFA300', '#FFEC27', '#00E436',
  '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA',
];

export const PLATFORM_LABELS: Record<string, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  youtube: 'YouTube',
  twitter: 'X / Twitter',
  linkedin: 'LinkedIn',
};

export const SHOT_TYPE_LABELS: Record<string, string> = {
  wide: 'Wide Shot',
  medium: 'Medium Shot',
  'close-up': 'Close-Up',
  'extreme-close': 'Extreme Close-Up',
  'over-shoulder': 'Over-the-Shoulder',
  'birds-eye': "Bird's Eye View",
};

export const SHOT_TYPE_ICONS: Record<string, string> = {
  wide: '[WIDE]',
  medium: '[MED]',
  'close-up': '[CU]',
  'extreme-close': '[ECU]',
  'over-shoulder': '[OTS]',
  'birds-eye': '[BEV]',
};
