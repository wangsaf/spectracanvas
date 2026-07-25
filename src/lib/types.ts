export type Industry =
  | 'technology'
  | 'healthcare'
  | 'finance'
  | 'education'
  | 'retail'
  | 'food'
  | 'fitness'
  | 'creative'
  | 'legal'
  | 'realestate'
  | 'nonprofit'
  | 'other';

export type Mood =
  | 'professional'
  | 'playful'
  | 'bold'
  | 'elegant'
  | 'minimal'
  | 'warm'
  | 'futuristic'
  | 'organic';

export interface BrandInput {
  name: string;
  industry: Industry;
  values: string[];
  audience: string;
  mood: Mood;
}

export interface ColorSwatch {
  hex: string;
  name: string;
  role: 'primary' | 'secondary' | 'accent' | 'neutral' | 'background';
}

export interface FontPairing {
  heading: string;
  body: string;
  category: string;
}

export interface LogoVariation {
  type: 'text' | 'icon-text' | 'abstract';
  svg: string;
  label: string;
}

export interface BrandResult {
  logos: LogoVariation[];
  palette: ColorSwatch[];
  fonts: FontPairing;
}

export interface BusinessCardData {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  palette: ColorSwatch[];
  fonts: FontPairing;
  brandName: string;
}

export interface SocialProfileData {
  platform: string;
  displayName: string;
  handle: string;
  bio: string;
  palette: ColorSwatch[];
  brandName: string;
}

// ===== Pixel Art Types =====

export type PixelStyle = '8bit' | '16bit' | 'modern';
export type PixelSize = 16 | 32 | 48 | 64;
export type PaletteSource = 'auto' | 'custom';

export interface PixelFormData {
  description: string;
  style: PixelStyle;
  size: PixelSize;
  paletteSource: PaletteSource;
  storyText: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

export interface SpriteFrame {
  id: string;
  pixels: string[][];
  width: number;
  height: number;
  duration: number;
}

export interface SpriteSheet {
  id: string;
  name: string;
  frames: SpriteFrame[];
  palette: ColorPalette;
  createdAt: string;
}

export interface ComicBubble {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'speech' | 'thought' | 'narration' | 'shout';
}

export interface ComicPanelData {
  id: string;
  frame: SpriteFrame;
  bubbles: ComicBubble[];
  label: string;
}

// ===== Content Types =====

export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'linkedin';
export type Tone = 'casual' | 'professional' | 'humorous' | 'dramatic' | 'educational';
export type Duration = '15s' | '30s' | '60s' | '3min' | '5min' | '10min';

export interface ContentFormData {
  topic: string;
  platform: Platform;
  audience: string;
  tone: Tone;
  duration: Duration;
}

export interface ScriptSection {
  id: string;
  label: string;
  content: string;
  timestamp?: string;
}

export interface ContentScript {
  id: string;
  title: string;
  hook: string;
  sections: ScriptSection[];
  ctas: string[];
  platform: Platform;
  duration: Duration;
}

export interface StoryboardFrame {
  id: string;
  shotType: 'wide' | 'medium' | 'close-up' | 'extreme-close' | 'over-shoulder' | 'birds-eye';
  description: string;
  dialogue?: string;
  duration: number;
  cameraMovement: string;
  notes?: string;
}

export interface CaptionVariation {
  id: string;
  text: string;
  style: 'short' | 'medium' | 'long';
}

export interface CaptionData {
  id: string;
  primary: string;
  variations: CaptionVariation[];
  hashtags: string[];
  platform: Platform;
}

export interface CalendarEntry {
  id: string;
  day: string;
  time: string;
  title: string;
  platform: Platform;
  type: 'post' | 'story' | 'reel' | 'video' | 'live';
  status: 'draft' | 'scheduled' | 'published';
}

export interface CalendarDay {
  date: string;
  dayName: string;
  entries: CalendarEntry[];
}

export type PixelSize = 16 | 32 | 48 | 64;
export type PaletteSource = "auto" | "custom";
export type CalendarDay = ContentCalendar;
