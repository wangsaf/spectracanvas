import type { LogoVariations, ColorSystem } from '@/lib/types';

// ========================================
// LOGO GENERATION
// ========================================

/**
 * Generate logo variations based on brand name and colors
 */
export function generateLogoVariations(
  brandName: string,
  colors: ColorSystem
): LogoVariations {
  return {
    textOnly: generateTextOnlyLogo(brandName, colors),
    iconText: generateIconTextLogo(brandName, colors),
    abstract: generateAbstractLogo(brandName, colors),
  };
}

/**
 * Generate text-only logo (typography-based)
 */
function generateTextOnlyLogo(brandName: string, colors: ColorSystem): string {
  const primaryColor = colors.primary.base;
  const accentColor = colors.accent.base;
  
  // Create initials for accent
  const initials = brandName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return `
<svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${accentColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Main text -->
  <text x="200" y="70" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
        text-anchor="middle" fill="url(#textGrad)">
    ${brandName.toUpperCase()}
  </text>
  
  <!-- Underline accent -->
  <rect x="100" y="85" width="200" height="4" fill="${accentColor}" />
</svg>
  `.trim();
}

/**
 * Generate icon + text logo
 */
function generateIconTextLogo(brandName: string, colors: ColorSystem): string {
  const primaryColor = colors.primary.base;
  const secondaryColor = colors.secondary.base;
  const accentColor = colors.accent.base;
  
  // Get first letter for icon
  const initial = brandName[0].toUpperCase();

  return `
<svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Icon box -->
  <rect x="50" y="20" width="80" height="80" fill="url(#iconGrad)" />
  
  <!-- Icon letter -->
  <text x="90" y="75" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
        text-anchor="middle" fill="white">
    ${initial}
  </text>
  
  <!-- Brand name -->
  <text x="150" y="70" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
        fill="${primaryColor}">
    ${brandName.toUpperCase()}
  </text>
  
  <!-- Accent line -->
  <line x1="150" y1="85" x2="350" y2="85" stroke="${accentColor}" stroke-width="3" />
</svg>
  `.trim();
}

/**
 * Generate abstract mark logo
 */
function generateAbstractLogo(brandName: string, colors: ColorSystem): string {
  const primaryColor = colors.primary.base;
  const secondaryColor = colors.secondary.base;
  const accentColor = colors.accent.base;
  
  // Generate geometric pattern based on brand name
  const seed = brandName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pattern = seed % 3; // 0: circles, 1: triangles, 2: squares

  let shape = '';
  
  if (pattern === 0) {
    // Overlapping circles
    shape = `
      <circle cx="180" cy="60" r="35" fill="${primaryColor}" opacity="0.8" />
      <circle cx="210" cy="60" r="35" fill="${secondaryColor}" opacity="0.8" />
      <circle cx="195" cy="85" r="35" fill="${accentColor}" opacity="0.8" />
    `;
  } else if (pattern === 1) {
    // Triangles
    shape = `
      <polygon points="195,30 165,90 225,90" fill="${primaryColor}" />
      <polygon points="195,50 175,85 215,85" fill="${secondaryColor}" opacity="0.8" />
      <polygon points="195,40 180,75 210,75" fill="${accentColor}" opacity="0.6" />
    `;
  } else {
    // Squares
    shape = `
      <rect x="160" y="40" width="40" height="40" fill="${primaryColor}" transform="rotate(15 180 60)" />
      <rect x="180" y="50" width="40" height="40" fill="${secondaryColor}" opacity="0.8" transform="rotate(30 200 70)" />
      <rect x="170" y="60" width="40" height="40" fill="${accentColor}" opacity="0.6" transform="rotate(45 190 80)" />
    `;
  }

  return `
<svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
  <!-- Abstract shape -->
  ${shape}
  
  <!-- Brand name -->
  <text x="250" y="70" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
        fill="${primaryColor}">
    ${brandName.toUpperCase()}
  </text>
</svg>
  `.trim();
}

// ========================================
// LOGO UTILITIES
// ========================================

/**
 * Convert SVG string to data URL
 */
export function svgToDataURL(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Download SVG as file
 */
export function downloadSVG(svg: string, filename: string): void {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert SVG to PNG (requires canvas)
 */
export async function svgToPNG(
  svg: string,
  width: number = 400,
  height: number = 120
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = svgToDataURL(svg);
  });
}

/**
 * Generate logo in multiple sizes
 */
export async function generateLogoSizes(
  svg: string
): Promise<Record<string, string>> {
  const sizes = {
    small: { width: 200, height: 60 },
    medium: { width: 400, height: 120 },
    large: { width: 800, height: 240 },
  };

  const results: Record<string, string> = {};

  for (const [size, dimensions] of Object.entries(sizes)) {
    results[size] = await svgToPNG(svg, dimensions.width, dimensions.height);
  }

  return results;
}
