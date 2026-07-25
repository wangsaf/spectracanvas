// ========================================
// APP CONSTANTS
// ========================================

export const APP_NAME = 'SpectraCanvas';
export const APP_TAGLINE = 'Your Creative Spectrum, One Canvas';
export const TEAM_NAME = 'Team Spectriad';
export const TEAM_TAGLINE = 'Three Mind One Solution';

// ========================================
// BRAND MODULE CONSTANTS
// ========================================

export const INDUSTRIES = [
  { value: 'tech', label: 'Technology & Software' },
  { value: 'gaming', label: 'Gaming & Entertainment' },
  { value: 'music', label: 'Music & Audio' },
  { value: 'fashion', label: 'Fashion & Apparel' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'fitness', label: 'Fitness & Wellness' },
  { value: 'education', label: 'Education & Learning' },
  { value: 'finance', label: 'Finance & Business' },
  { value: 'creative', label: 'Creative & Design' },
  { value: 'other', label: 'Other' },
] as const;

export const BRAND_VALUES = [
  'Creative',
  'Modern',
  'Playful',
  'Professional',
  'Innovative',
  'Trustworthy',
  'Bold',
  'Minimalist',
  'Elegant',
  'Energetic',
  'Sustainable',
  'Authentic',
] as const;

export const LOGO_STYLES = [
  { value: 'text', label: 'Text Only' },
  { value: 'icon-text', label: 'Icon + Text' },
  { value: 'abstract', label: 'Abstract Mark' },
] as const;

// ========================================
// PIXEL ART CONSTANTS
// ========================================

export const PIXEL_STYLES = [
  { value: '8-bit', label: '8-bit (NES style, 4 colors)' },
  { value: '16-bit', label: '16-bit (SNES style, 16 colors)' },
  { value: 'modern', label: 'Modern Pixel (32+ colors)' },
] as const;

export const SPRITE_SIZES = [
  { value: 16, label: '16x16' },
  { value: 32, label: '32x32' },
  { value: 48, label: '48x48' },
  { value: 64, label: '64x64' },
] as const;

export const POSE_TYPES = [
  { value: 'idle', label: 'Idle', frames: 1 },
  { value: 'walk', label: 'Walk', frames: 4 },
  { value: 'run', label: 'Run', frames: 4 },
  { value: 'attack', label: 'Attack', frames: 4 },
  { value: 'jump', label: 'Jump', frames: 2 },
] as const;

export const EXPRESSION_TYPES = [
  { value: 'happy', label: 'Happy / Smiling' },
  { value: 'sad', label: 'Sad / Crying' },
  { value: 'angry', label: 'Angry / Frustrated' },
  { value: 'surprised', label: 'Surprised / Shocked' },
  { value: 'neutral', label: 'Neutral / Default' },
] as const;

export const COMIC_LAYOUTS = [
  { value: '2x2', label: '2x2 Grid (4 panels)' },
  { value: '3x3', label: '3x3 Grid (9 panels)' },
  { value: 'strip', label: 'Horizontal Strip (4 panels)' },
] as const;

// ========================================
// CONTENT MODULE CONSTANTS
// ========================================

export const PLATFORMS = [
  { value: 'tiktok', label: 'TikTok', maxDuration: 60, aspectRatio: '9:16' },
  { value: 'instagram', label: 'Instagram Reels', maxDuration: 90, aspectRatio: '9:16' },
  { value: 'youtube-shorts', label: 'YouTube Shorts', maxDuration: 60, aspectRatio: '9:16' },
  { value: 'twitter', label: 'Twitter/X', maxDuration: 140, aspectRatio: '16:9' },
] as const;

export const CONTENT_TONES = [
  { value: 'casual', label: 'Casual / Fun' },
  { value: 'professional', label: 'Professional' },
  { value: 'educational', label: 'Educational' },
  { value: 'energetic', label: 'Hype / Energetic' },
  { value: 'inspirational', label: 'Inspirational' },
] as const;

export const DURATIONS = [
  { value: 15, label: '15 seconds' },
  { value: 30, label: '30 seconds' },
  { value: 60, label: '60 seconds' },
  { value: 90, label: '90 seconds' },
] as const;

export const SHOT_TYPES = [
  { value: 'close-up', label: 'Close-up', icon: 'C' },
  { value: 'medium', label: 'Medium', icon: 'M' },
  { value: 'wide', label: 'Wide', icon: 'W' },
  { value: 'pov', label: 'POV', icon: 'P' },
] as const;

export const CAMERA_MOVEMENTS = [
  { value: 'static', label: 'Static' },
  { value: 'pan', label: 'Pan' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'tilt', label: 'Tilt' },
] as const;

// ========================================
// MOOD MODULE CONSTANTS
// ========================================

export const MOOD_KEYWORDS = [
  { value: 'chill', label: 'Chill / Relaxing' },
  { value: 'energetic', label: 'Energetic / Hype' },
  { value: 'dark', label: 'Dark / Moody' },
  { value: 'happy', label: 'Happy / Bright' },
  { value: 'professional', label: 'Professional / Clean' },
  { value: 'retro', label: 'Retro / Nostalgic' },
  { value: 'futuristic', label: 'Futuristic / Sci-fi' },
  { value: 'organic', label: 'Organic / Natural' },
] as const;

// Mood to Design Parameter Mapping
export const MOOD_DESIGN_MAP = {
  chill: {
    colorShift: { hueShift: 20, saturationMultiplier: 0.8, brightnessMultiplier: 1.1 },
    typographyStyle: { weight: 'normal', style: 'rounded' },
    animationSpeed: { multiplier: 0.7, easing: 'ease-out' },
    saturation: 70,
    brightness: 85,
  },
  energetic: {
    colorShift: { hueShift: 0, saturationMultiplier: 1.3, brightnessMultiplier: 1.2 },
    typographyStyle: { weight: 'bold', style: 'sharp' },
    animationSpeed: { multiplier: 1.5, easing: 'bounce' },
    saturation: 95,
    brightness: 90,
  },
  dark: {
    colorShift: { hueShift: -10, saturationMultiplier: 0.6, brightnessMultiplier: 0.5 },
    typographyStyle: { weight: 'normal', style: 'sharp' },
    animationSpeed: { multiplier: 0.8, easing: 'ease-in' },
    saturation: 50,
    brightness: 40,
  },
  happy: {
    colorShift: { hueShift: 30, saturationMultiplier: 1.2, brightnessMultiplier: 1.3 },
    typographyStyle: { weight: 'normal', style: 'rounded' },
    animationSpeed: { multiplier: 1.2, easing: 'bounce' },
    saturation: 90,
    brightness: 95,
  },
  professional: {
    colorShift: { hueShift: 0, saturationMultiplier: 0.7, brightnessMultiplier: 0.9 },
    typographyStyle: { weight: 'normal', style: 'geometric' },
    animationSpeed: { multiplier: 1.0, easing: 'ease' },
    saturation: 60,
    brightness: 70,
  },
  retro: {
    colorShift: { hueShift: -20, saturationMultiplier: 0.9, brightnessMultiplier: 0.8 },
    typographyStyle: { weight: 'bold', style: 'geometric' },
    animationSpeed: { multiplier: 0.6, easing: 'linear' },
    saturation: 75,
    brightness: 65,
  },
  futuristic: {
    colorShift: { hueShift: 180, saturationMultiplier: 1.1, brightnessMultiplier: 1.0 },
    typographyStyle: { weight: 'light', style: 'geometric' },
    animationSpeed: { multiplier: 1.3, easing: 'ease-in' },
    saturation: 85,
    brightness: 80,
  },
  organic: {
    colorShift: { hueShift: 60, saturationMultiplier: 0.8, brightnessMultiplier: 0.9 },
    typographyStyle: { weight: 'normal', style: 'rounded' },
    animationSpeed: { multiplier: 0.9, easing: 'ease-out' },
    saturation: 65,
    brightness: 75,
  },
} as const;

// ========================================
// COLOR CONSTANTS
// ========================================

export const DEFAULT_PALETTE = {
  primary: '#00ff88',
  secondary: '#0088ff',
  accent: '#ff0088',
  neutral: '#888888',
  background: '#0a0a0a',
  foreground: '#ffffff',
} as const;

export const PIXEL_ART_PALETTES = {
  '8-bit': ['#000000', '#ffffff', '#ff0000', '#00ff00'],
  '16-bit': [
    '#000000', '#1a1c2c', '#5d275d', '#b13e53',
    '#ef7d57', '#ffcd75', '#a7f070', '#38b764',
    '#257179', '#29366f', '#3b5dc9', '#41a6f6',
    '#73eff7', '#f4f4f4', '#94b0c2', '#566c86',
  ],
  modern: [], // Will be generated from brand colors
} as const;

// ========================================
// EXPORT FORMATS
// ========================================

export const EXPORT_FORMATS = [
  { value: 'png', label: 'PNG Image' },
  { value: 'svg', label: 'SVG Vector' },
  { value: 'pdf', label: 'PDF Document' },
  { value: 'zip', label: 'ZIP Archive' },
  { value: 'json', label: 'JSON Data' },
] as const;

// ========================================
// CANVAS SETTINGS
// ========================================

export const CANVAS_DEFAULTS = {
  width: 800,
  height: 600,
  scale: 1,
  backgroundColor: '#0a0a0a',
  gridSize: 16,
} as const;

// ========================================
// API ENDPOINTS
// ========================================

export const API_ROUTES = {
  brand: {
    generate: '/api/brand/generate',
    logo: '/api/brand/logo',
    export: '/api/brand/export',
  },
  pixel: {
    generate: '/api/pixel/generate',
    poses: '/api/pixel/poses',
    comic: '/api/pixel/comic',
    export: '/api/pixel/export',
  },
  content: {
    script: '/api/content/script',
    storyboard: '/api/content/storyboard',
    caption: '/api/content/caption',
  },
  mood: {
    analyze: '/api/mood/analyze',
    apply: '/api/mood/apply',
  },
} as const;

// ========================================
// VALIDATION RULES
// ========================================

export const VALIDATION = {
  brandName: {
    minLength: 2,
    maxLength: 50,
  },
  description: {
    minLength: 10,
    maxLength: 500,
  },
  audioFile: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  },
} as const;

// ========================================
// UI CONSTANTS
// ========================================

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;