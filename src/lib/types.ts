// ========================================
// CORE TYPES
// ========================================

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  brand?: BrandIdentity;
  pixel?: PixelArtAssets;
  content?: ContentAssets;
  mood?: MoodProfile;
}

// ========================================
// BRAND MODULE TYPES
// ========================================

export interface BrandIdentity {
  name: string;
  industry: string;
  values: string[];
  targetAudience: string;
  personality: BrandPersonality;
  logo: LogoVariations;
  colors: ColorSystem;
  typography: TypographySystem;
  mockups: Mockup[];
  guidelines?: string; // PDF URL
}

export interface BrandPersonality {
  tone: string;
  style: string;
  keywords: string[];
}

export interface LogoVariations {
  textOnly: string; // SVG string
  iconText: string; // SVG string
  abstract: string; // SVG string
}

export interface ColorSystem {
  primary: ColorShades;
  secondary: ColorShades;
  accent: ColorShades;
  neutral: ColorShades;
  darkMode?: ColorSystem;
}

export interface ColorShades {
  base: string; // HEX
  light: string;
  lighter: string;
  dark: string;
  darker: string;
}

export interface TypographySystem {
  heading: FontDefinition;
  body: FontDefinition;
  accent?: FontDefinition;
  scale: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
    body: string;
    small: string;
  };
}

export interface FontDefinition {
  name: string;
  family: string;
  weights: number[];
  url?: string; // Google Fonts URL
}

export interface Mockup {
  type: 'business-card' | 'social-profile' | 'website-hero' | 'merchandise';
  imageUrl: string; // PNG data URL
}

// ========================================
// PIXEL ART MODULE TYPES
// ========================================

export interface PixelArtAssets {
  character?: CharacterSprite;
  poses?: PoseSet;
  expressions?: ExpressionSet;
  spriteSheet?: SpriteSheet;
  comic?: ComicStrip;
  assetKit?: AssetKit;
  background?: BackgroundLayers;
}

export interface CharacterSprite {
  description: string;
  style: PixelStyle;
  size: SpriteSize;
  palette: string[]; // HEX colors
  imageData: string; // PNG data URL
  metadata: SpriteMetadata;
}

export type PixelStyle = '8-bit' | '16-bit' | 'modern';
export type SpriteSize = 16 | 32 | 48 | 64;

export interface SpriteMetadata {
  width: number;
  height: number;
  colorCount: number;
  transparent: boolean;
}

export interface PoseSet {
  idle: string[]; // PNG data URLs
  walk: string[];
  run: string[];
  attack: string[];
  jump: string[];
}

export interface ExpressionSet {
  happy: string;
  sad: string;
  angry: string;
  surprised: string;
  neutral: string;
  custom?: Record<string, string>;
}

export interface SpriteSheet {
  imageUrl: string; // Combined PNG
  layout: SpriteSheetLayout;
  metadata: string; // JSON metadata
}

export interface SpriteSheetLayout {
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  frames: FramePosition[];
}

export interface FramePosition {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ComicStrip {
  story: string;
  panels: ComicPanel[];
  layout: ComicLayout;
}

export interface ComicPanel {
  imageUrl: string;
  dialogue?: string;
  emotion?: string;
  shotType?: 'close-up' | 'medium' | 'wide';
}

export type ComicLayout = '2x2' | '3x3' | 'strip';

export interface AssetKit {
  ui: string[]; // UI element PNGs
  tileset: string[]; // Tile PNGs
  items: string[]; // Item PNGs
  icons: string[]; // Icon PNGs
}

export interface BackgroundLayers {
  sky: string;
  midground: string;
  foreground: string;
}

// ========================================
// CONTENT MODULE TYPES
// ========================================

export interface ContentAssets {
  scripts: ContentScript[];
  storyboards: Storyboard[];
  captions: Caption[];
  calendar?: ContentCalendar;
}

export interface ContentScript {
  topic: string;
  platform: Platform;
  tone: Tone;
  duration: number; // seconds
  hook: string[];
  body: ScriptSection[];
  cta: string[];
  wordCount: number;
}

export type Platform = 'tiktok' | 'instagram' | 'youtube-shorts' | 'twitter';
export type Tone = 'casual' | 'professional' | 'educational' | 'energetic' | 'inspirational';

export interface ScriptSection {
  timestamp: string; // "0:00-0:03"
  content: string;
  brollSuggestion?: string;
  textOverlay?: string;
}

export interface Storyboard {
  scriptId: string;
  frames: StoryboardFrame[];
}

export interface StoryboardFrame {
  frameNumber: number;
  timestamp: string;
  shotType: 'close-up' | 'medium' | 'wide' | 'pov';
  cameraMovement: 'static' | 'pan' | 'zoom' | 'tilt';
  textOverlay?: string;
  duration: number;
}

export interface Caption {
  scriptId: string;
  platform: Platform;
  mainText: string;
  hashtags: string[];
  emojis: string[];
  variations: string[];
}

export interface ContentCalendar {
  weekPlan: DayPlan[];
}

export interface DayPlan {
  day: string;
  contentType: 'educational' | 'entertaining' | 'promotional';
  theme: string;
  bestTime: string;
}

// ========================================
// MOOD MODULE TYPES
// ========================================

export interface MoodProfile {
  source: 'audio' | 'keywords';
  audioAnalysis?: AudioAnalysis;
  keywords?: MoodKeyword[];
  designParams: DesignParameters;
}

export interface AudioAnalysis {
  bpm: number;
  energy: number; // 0-100
  valence: number; // 0-100 (sad to happy)
  dominantFrequency: number;
  genre?: string;
  mood: MoodClassification;
}

export type MoodKeyword = 
  | 'chill'
  | 'energetic'
  | 'dark'
  | 'happy'
  | 'professional'
  | 'retro'
  | 'futuristic'
  | 'organic';

export type MoodClassification = MoodKeyword;

export interface DesignParameters {
  colorShift: ColorShift;
  typographyStyle: TypographyStyle;
  animationSpeed: AnimationSpeed;
  saturation: number; // 0-100
  brightness: number; // 0-100
}

export interface ColorShift {
  hueShift: number; // -180 to 180
  saturationMultiplier: number; // 0.5 to 1.5
  brightnessMultiplier: number; // 0.5 to 1.5
}

export interface TypographyStyle {
  weight: 'light' | 'normal' | 'bold';
  style: 'rounded' | 'sharp' | 'geometric';
}

export interface AnimationSpeed {
  multiplier: number; // 0.5 to 2.0
  easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'bounce';
}

// ========================================
// API TYPES
// ========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GenerateBrandRequest {
  name: string;
  industry: string;
  values: string[];
  targetAudience: string;
  mood?: MoodKeyword[];
}

export interface GeneratePixelRequest {
  description: string;
  style: PixelStyle;
  size: SpriteSize;
  palette?: string[];
  brandColors?: string[];
}

export interface GenerateContentRequest {
  topic: string;
  platform: Platform;
  tone: Tone;
  duration: number;
  brandContext?: string;
}

export interface AnalyzeMoodRequest {
  audioFile?: File;
  keywords?: MoodKeyword[];
}

// ========================================
// UI COMPONENT TYPES
// ========================================

export interface SelectOption {
  value: string;
  label: string;
}

export interface ChipOption {
  id: string;
  label: string;
  selected: boolean;
}

export interface CanvasConfig {
  width: number;
  height: number;
  scale: number;
  backgroundColor: string;
}

export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'zip' | 'json';
  quality?: number;
  includeMetadata?: boolean;
}