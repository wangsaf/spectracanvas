import type { TypographySystem, FontDefinition, MoodKeyword } from '@/lib/types';
import { MOOD_DESIGN_MAP } from '@/lib/constants';

// ========================================
// GOOGLE FONTS DATABASE
// ========================================

interface FontData {
  name: string;
  family: string;
  category: 'serif' | 'sans-serif' | 'display' | 'monospace';
  weights: number[];
  style: 'modern' | 'classic' | 'playful' | 'elegant' | 'bold' | 'minimal';
  url: string;
}

const GOOGLE_FONTS: FontData[] = [
  // Sans-Serif Fonts
  {
    name: 'Inter',
    family: 'Inter, sans-serif',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700, 800],
    style: 'modern',
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  },
  {
    name: 'Roboto',
    family: 'Roboto, sans-serif',
    category: 'sans-serif',
    weights: [300, 400, 500, 700, 900],
    style: 'modern',
    url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap',
  },
  {
    name: 'Poppins',
    family: 'Poppins, sans-serif',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700, 800],
    style: 'playful',
    url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
  },
  {
    name: 'Montserrat',
    family: 'Montserrat, sans-serif',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700, 800, 900],
    style: 'bold',
    url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap',
  },
  {
    name: 'Open Sans',
    family: 'Open Sans, sans-serif',
    category: 'sans-serif',
    weights: [300, 400, 600, 700, 800],
    style: 'minimal',
    url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap',
  },
  {
    name: 'Raleway',
    family: 'Raleway, sans-serif',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700, 800],
    style: 'elegant',
    url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&display=swap',
  },
  {
    name: 'Lato',
    family: 'Lato, sans-serif',
    category: 'sans-serif',
    weights: [300, 400, 700, 900],
    style: 'modern',
    url: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap',
  },
  {
    name: 'Nunito',
    family: 'Nunito, sans-serif',
    category: 'sans-serif',
    weights: [300, 400, 600, 700, 800],
    style: 'playful',
    url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap',
  },

  // Serif Fonts
  {
    name: 'Playfair Display',
    family: 'Playfair Display, serif',
    category: 'serif',
    weights: [400, 500, 600, 700, 800, 900],
    style: 'elegant',
    url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap',
  },
  {
    name: 'Merriweather',
    family: 'Merriweather, serif',
    category: 'serif',
    weights: [300, 400, 700, 900],
    style: 'classic',
    url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap',
  },
  {
    name: 'Lora',
    family: 'Lora, serif',
    category: 'serif',
    weights: [400, 500, 600, 700],
    style: 'elegant',
    url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap',
  },
  {
    name: 'Crimson Text',
    family: 'Crimson Text, serif',
    category: 'serif',
    weights: [400, 600, 700],
    style: 'classic',
    url: 'https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap',
  },

  // Display Fonts
  {
    name: 'Bebas Neue',
    family: 'Bebas Neue, display',
    category: 'display',
    weights: [400],
    style: 'bold',
    url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
  },
  {
    name: 'Righteous',
    family: 'Righteous, display',
    category: 'display',
    weights: [400],
    style: 'playful',
    url: 'https://fonts.googleapis.com/css2?family=Righteous&display=swap',
  },
  {
    name: 'Oswald',
    family: 'Oswald, display',
    category: 'display',
    weights: [300, 400, 500, 600, 700],
    style: 'bold',
    url: 'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap',
  },

  // Monospace Fonts
  {
    name: 'JetBrains Mono',
    family: 'JetBrains Mono, monospace',
    category: 'monospace',
    weights: [400, 500, 600, 700],
    style: 'modern',
    url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  },
  {
    name: 'Space Mono',
    family: 'Space Mono, monospace',
    category: 'monospace',
    weights: [400, 700],
    style: 'modern',
    url: 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap',
  },
];

// ========================================
// FONT PAIRING RULES
// ========================================

const PAIRING_RULES: Record<string, string[]> = {
  // Sans-serif headings pair well with
  'Inter': ['Lora', 'Merriweather', 'Crimson Text', 'Roboto'],
  'Roboto': ['Playfair Display', 'Lora', 'Merriweather', 'Open Sans'],
  'Poppins': ['Lora', 'Merriweather', 'Open Sans', 'Nunito'],
  'Montserrat': ['Merriweather', 'Lora', 'Open Sans', 'Roboto'],
  'Open Sans': ['Playfair Display', 'Lora', 'Merriweather', 'Roboto'],
  'Raleway': ['Lora', 'Merriweather', 'Crimson Text', 'Open Sans'],
  'Lato': ['Merriweather', 'Lora', 'Playfair Display', 'Roboto'],
  'Nunito': ['Lora', 'Merriweather', 'Poppins', 'Open Sans'],

  // Serif headings pair well with
  'Playfair Display': ['Roboto', 'Open Sans', 'Lato', 'Inter'],
  'Merriweather': ['Open Sans', 'Roboto', 'Lato', 'Inter'],
  'Lora': ['Roboto', 'Open Sans', 'Lato', 'Poppins'],
  'Crimson Text': ['Roboto', 'Open Sans', 'Lato', 'Inter'],

  // Display headings pair well with
  'Bebas Neue': ['Roboto', 'Open Sans', 'Lato', 'Inter'],
  'Righteous': ['Roboto', 'Open Sans', 'Poppins', 'Nunito'],
  'Oswald': ['Roboto', 'Open Sans', 'Lato', 'Inter'],

  // Monospace headings pair well with
  'JetBrains Mono': ['Inter', 'Roboto', 'Open Sans', 'Lato'],
  'Space Mono': ['Inter', 'Roboto', 'Open Sans', 'Lato'],
};

// ========================================
// TYPOGRAPHY GENERATION
// ========================================

/**
 * Generate typography system based on brand personality
 */
export function generateTypographySystem(
  industry: string,
  values: string[],
  mood?: MoodKeyword
): TypographySystem {
  // Determine font style based on values
  const fontStyle = determineFontStyle(values, mood);

  // Select heading font
  const headingFont = selectHeadingFont(fontStyle, industry);

  // Select body font (paired with heading)
  const bodyFont = selectBodyFont(headingFont.name);

  // Generate type scale
  const scale = generateTypeScale();

  return {
    heading: headingFont,
    body: bodyFont,
    scale,
  };
}

/**
 * Determine font style from brand values and mood
 */
function determineFontStyle(values: string[], mood?: MoodKeyword): string {
  // Mood takes priority
  if (mood && MOOD_DESIGN_MAP[mood]) {
    const moodStyle = MOOD_DESIGN_MAP[mood].typographyStyle.style;
    if (moodStyle === 'rounded') return 'playful';
    if (moodStyle === 'sharp') return 'bold';
    if (moodStyle === 'geometric') return 'modern';
  }

  // Check values
  if (values.includes('Playful')) return 'playful';
  if (values.includes('Bold')) return 'bold';
  if (values.includes('Elegant')) return 'elegant';
  if (values.includes('Minimalist')) return 'minimal';
  if (values.includes('Professional')) return 'modern';

  return 'modern'; // default
}

/**
 * Select heading font based on style
 */
function selectHeadingFont(style: string, industry: string): FontDefinition {
  // Filter fonts by style
  const matchingFonts = GOOGLE_FONTS.filter((font) => font.style === style);

  // If no match, use modern fonts
  const fonts = matchingFonts.length > 0 ? matchingFonts : GOOGLE_FONTS.filter((f) => f.style === 'modern');

  // Industry-specific preferences
  let selectedFont: FontData;

  if (industry === 'tech' || industry === 'gaming') {
    selectedFont = fonts.find((f) => f.category === 'sans-serif') || fonts[0];
  } else if (industry === 'fashion' || industry === 'creative') {
    selectedFont = fonts.find((f) => f.category === 'serif' || f.category === 'display') || fonts[0];
  } else if (industry === 'finance' || industry === 'education') {
    selectedFont = fonts.find((f) => f.category === 'serif') || fonts[0];
  } else {
    selectedFont = fonts[0];
  }

  return {
    name: selectedFont.name,
    family: selectedFont.family,
    weights: selectedFont.weights,
    url: selectedFont.url,
  };
}

/**
 * Select body font that pairs well with heading font
 */
function selectBodyFont(headingFontName: string): FontDefinition {
  // Get pairing suggestions
  const pairings = PAIRING_RULES[headingFontName] || ['Roboto'];

  // Find the first available pairing
  const bodyFontName = pairings[0];
  const bodyFontData = GOOGLE_FONTS.find((f) => f.name === bodyFontName) || GOOGLE_FONTS[1];

  return {
    name: bodyFontData.name,
    family: bodyFontData.family,
    weights: bodyFontData.weights,
    url: bodyFontData.url,
  };
}

/**
 * Generate type scale
 */
function generateTypeScale() {
  return {
    h1: '3rem',      // 48px
    h2: '2.25rem',   // 36px
    h3: '1.875rem',  // 30px
    h4: '1.5rem',    // 24px
    h5: '1.25rem',   // 20px
    h6: '1rem',      // 16px
    body: '1rem',    // 16px
    small: '0.875rem', // 14px
  };
}

// ========================================
// FONT UTILITIES
// ========================================

/**
 * Get all available fonts
 */
export function getAllFonts(): FontData[] {
  return GOOGLE_FONTS;
}

/**
 * Get fonts by category
 */
export function getFontsByCategory(category: FontData['category']): FontData[] {
  return GOOGLE_FONTS.filter((font) => font.category === category);
}

/**
 * Get fonts by style
 */
export function getFontsByStyle(style: FontData['style']): FontData[] {
  return GOOGLE_FONTS.filter((font) => font.style === style);
}

/**
 * Get font by name
 */
export function getFontByName(name: string): FontData | undefined {
  return GOOGLE_FONTS.find((font) => font.name === name);
}

/**
 * Get font pairings for a given font
 */
export function getFontPairings(fontName: string): string[] {
  return PAIRING_RULES[fontName] || [];
}

/**
 * Generate Google Fonts URL for multiple fonts
 */
export function generateGoogleFontsURL(fonts: FontDefinition[]): string {
  const families = fonts.map((font) => {
    const weights = font.weights.join(';');
    return `family=${font.name.replace(/\s+/g, '+')}:wght@${weights}`;
  });

  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

/**
 * Convert typography system to CSS
 */
export function typographySystemToCSS(typography: TypographySystem): string {
  return `
/* Typography System */
:root {
  /* Font Families */
  --font-heading: ${typography.heading.family};
  --font-body: ${typography.body.family};

  /* Type Scale */
  --text-h1: ${typography.scale.h1};
  --text-h2: ${typography.scale.h2};
  --text-h3: ${typography.scale.h3};
  --text-h4: ${typography.scale.h4};
  --text-h5: ${typography.scale.h5};
  --text-h6: ${typography.scale.h6};
  --text-body: ${typography.scale.body};
  --text-small: ${typography.scale.small};
}

/* Heading Styles */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.2;
}

h1 { font-size: var(--text-h1); }
h2 { font-size: var(--text-h2); }
h3 { font-size: var(--text-h3); }
h4 { font-size: var(--text-h4); }
h5 { font-size: var(--text-h5); }
h6 { font-size: var(--text-h6); }

/* Body Styles */
body, p {
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: 1.6;
}

small {
  font-size: var(--text-small);
}
`.trim();
}
