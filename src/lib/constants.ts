import type { Industry, Mood } from './types';

export const BRAND_VALUES: readonly string[] = [
  'Innovation',
  'Trust',
  'Sustainability',
  'Luxury',
  'Accessibility',
  'Simplicity',
  'Creativity',
  'Reliability',
  'Community',
  'Transparency',
  'Tradition',
  'Disruption',
  'Empathy',
  'Excellence',
  'Authenticity',
  'Passion',
] as const;

export const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'fitness', label: 'Fitness & Wellness' },
  { value: 'creative', label: 'Creative & Design' },
  { value: 'legal', label: 'Legal' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'nonprofit', label: 'Non-Profit' },
  { value: 'other', label: 'Other' },
];

export const MOODS: { value: Mood; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Clean and corporate' },
  { value: 'playful', label: 'Playful', description: 'Fun and approachable' },
  { value: 'bold', label: 'Bold', description: 'Strong and confident' },
  { value: 'elegant', label: 'Elegant', description: 'Refined and sophisticated' },
  { value: 'minimal', label: 'Minimal', description: 'Simple and focused' },
  { value: 'warm', label: 'Warm', description: 'Friendly and inviting' },
  { value: 'futuristic', label: 'Futuristic', description: 'Modern and cutting-edge' },
  { value: 'organic', label: 'Organic', description: 'Natural and earthy' },
];

export const SAMPLE_FONTS: Record<string, string[]> = {
  professional: ['Inter', 'Roboto', 'Open Sans', 'Lato'],
  playful: ['Poppins', 'Nunito', 'Quicksand', 'Comfortaa'],
  bold: ['Montserrat', 'Oswald', 'Bebas Neue', 'Anton'],
  elegant: ['Playfair Display', 'Cormorant Garamond', 'Libre Baskerville', 'DM Serif Display'],
  minimal: ['Helvetica Neue', 'IBM Plex Sans', 'Source Sans 3', 'DM Sans'],
  warm: ['Merriweather', 'Nunito Serif', 'Lora', 'Crimson Text'],
  futuristic: ['Orbitron', 'Rajdhani', 'Exo 2', 'Audiowide'],
  organic: ['Josefin Sans', 'Cabin', 'Karla', 'Rubik'],
};

export const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2';
