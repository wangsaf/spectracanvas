import type { CharacterSprite, PixelStyle, SpriteSize } from '@/lib/types';
import { createEmptyPixelData, constrainToPalette } from './canvas-engine';
import { PIXEL_ART_PALETTES } from '@/lib/constants';

// ========================================
// SPRITE GENERATION
// ========================================

/**
 * Generate a basic character sprite from description
 * This is a fallback generator that creates simple geometric sprites
 */
export function generateBasicSprite(
  description: string,
  style: PixelStyle,
  size: SpriteSize,
  palette?: string[]
): CharacterSprite {
  // Use style-specific palette if not provided
  const colors = palette || getStylePalette(style);
  
  // Generate pixel data based on description keywords
  const pixelData = generatePixelDataFromDescription(description, size, colors);
  
  // Convert to data URL
  const imageData = pixelDataToDataURL(pixelData, size);
  
  return {
    description,
    style,
    size,
    palette: colors,
    imageData,
    metadata: {
      width: size,
      height: size,
      colorCount: colors.length,
      transparent: true,
    },
  };
}

/**
 * Get palette for pixel art style
 */
function getStylePalette(style: PixelStyle): string[] {
  switch (style) {
    case '8-bit':
      return PIXEL_ART_PALETTES['8-bit'];
    case '16-bit':
      return PIXEL_ART_PALETTES['16-bit'];
    case 'modern':
      // Modern style uses more colors
      return [
        '#000000', '#1a1c2c', '#5d275d', '#b13e53',
        '#ef7d57', '#ffcd75', '#a7f070', '#38b764',
        '#257179', '#29366f', '#3b5dc9', '#41a6f6',
        '#73eff7', '#f4f4f4', '#94b0c2', '#566c86',
        '#333c57', '#8b9bb4', '#c0cbdc', '#ffffff',
      ];
    default:
      return PIXEL_ART_PALETTES['16-bit'];
  }
}

/**
 * Generate pixel data from description
 */
function generatePixelDataFromDescription(
  description: string,
  size: SpriteSize,
  palette: string[]
): string[][] {
  const data = createEmptyPixelData(size, size);
  const desc = description.toLowerCase();
  
  // Determine character type
  const isHuman = desc.includes('human') || desc.includes('person') || desc.includes('character');
  const isKnight = desc.includes('knight') || desc.includes('warrior');
  const isRobot = desc.includes('robot') || desc.includes('mech');
  const isAnimal = desc.includes('animal') || desc.includes('cat') || desc.includes('dog');
  
  if (isKnight) {
    return generateKnightSprite(size, palette);
  } else if (isRobot) {
    return generateRobotSprite(size, palette);
  } else if (isAnimal) {
    return generateAnimalSprite(size, palette);
  } else if (isHuman) {
    return generateHumanSprite(size, palette);
  } else {
    // Generic character
    return generateGenericSprite(size, palette);
  }
}

/**
 * Generate knight sprite
 */
function generateKnightSprite(size: SpriteSize, palette: string[]): string[][] {
  const data = createEmptyPixelData(size, size);
  const center = Math.floor(size / 2);
  
  // Colors
  const skin = palette[3] || '#b13e53';
  const armor = palette[8] || '#257179';
  const helmet = palette[1] || '#1a1c2c';
  const sword = palette[11] || '#41a6f6';
  
  // Helmet (top)
  for (let x = center - 2; x <= center + 2; x++) {
    data[2][x] = helmet;
    data[3][x] = helmet;
  }
  
  // Face
  data[4][center - 1] = skin;
  data[4][center] = skin;
  data[4][center + 1] = skin;
  
  // Eyes
  data[4][center - 1] = palette[0] || '#000000';
  data[4][center + 1] = palette[0] || '#000000';
  
  // Body (armor)
  for (let y = 5; y <= 8; y++) {
    for (let x = center - 2; x <= center + 2; x++) {
      data[y][x] = armor;
    }
  }
  
  // Arms
  data[6][center - 3] = armor;
  data[7][center - 3] = armor;
  data[6][center + 3] = armor;
  data[7][center + 3] = armor;
  
  // Sword (right hand)
  data[5][center + 4] = sword;
  data[6][center + 4] = sword;
  data[7][center + 4] = sword;
  
  // Legs
  data[9][center - 1] = armor;
  data[10][center - 1] = armor;
  data[11][center - 1] = armor;
  data[9][center + 1] = armor;
  data[10][center + 1] = armor;
  data[11][center + 1] = armor;
  
  return data;
}

/**
 * Generate robot sprite
 */
function generateRobotSprite(size: SpriteSize, palette: string[]): string[][] {
  const data = createEmptyPixelData(size, size);
  const center = Math.floor(size / 2);
  
  // Colors
  const metal = palette[11] || '#41a6f6';
  const dark = palette[1] || '#1a1c2c';
  const light = palette[12] || '#73eff7';
  
  // Head
  for (let x = center - 2; x <= center + 2; x++) {
    data[2][x] = metal;
    data[3][x] = metal;
    data[4][x] = metal;
  }
  
  // Eyes (glowing)
  data[3][center - 1] = light;
  data[3][center + 1] = light;
  
  // Antenna
  data[1][center] = dark;
  data[0][center] = light;
  
  // Body
  for (let y = 5; y <= 9; y++) {
    for (let x = center - 2; x <= center + 2; x++) {
      data[y][x] = metal;
    }
  }
  
  // Chest panel
  data[6][center] = light;
  data[7][center] = light;
  
  // Arms
  for (let y = 6; y <= 8; y++) {
    data[y][center - 3] = metal;
    data[y][center + 3] = metal;
  }
  
  // Legs
  data[10][center - 1] = metal;
  data[11][center - 1] = metal;
  data[10][center + 1] = metal;
  data[11][center + 1] = metal;
  
  return data;
}

/**
 * Generate animal sprite
 */
function generateAnimalSprite(size: SpriteSize, palette: string[]): string[][] {
  const data = createEmptyPixelData(size, size);
  const center = Math.floor(size / 2);
  
  // Colors
  const fur = palette[4] || '#ef7d57';
  const dark = palette[0] || '#000000';
  
  // Ears
  data[2][center - 2] = fur;
  data[2][center + 2] = fur;
  data[3][center - 2] = fur;
  data[3][center + 2] = fur;
  
  // Head
  for (let x = center - 2; x <= center + 2; x++) {
    data[4][x] = fur;
    data[5][x] = fur;
  }
  
  // Eyes
  data[4][center - 1] = dark;
  data[4][center + 1] = dark;
  
  // Nose
  data[5][center] = dark;
  
  // Body
  for (let y = 6; y <= 9; y++) {
    for (let x = center - 2; x <= center + 2; x++) {
      data[y][x] = fur;
    }
  }
  
  // Legs
  data[10][center - 2] = fur;
  data[11][center - 2] = fur;
  data[10][center + 2] = fur;
  data[11][center + 2] = fur;
  
  // Tail
  data[8][center + 3] = fur;
  data[7][center + 4] = fur;
  
  return data;
}

/**
 * Generate human sprite
 */
function generateHumanSprite(size: SpriteSize, palette: string[]): string[][] {
  const data = createEmptyPixelData(size, size);
  const center = Math.floor(size / 2);
  
  // Colors
  const skin = palette[3] || '#b13e53';
  const hair = palette[1] || '#1a1c2c';
  const shirt = palette[10] || '#3b5dc9';
  const pants = palette[9] || '#29366f';
  
  // Hair
  for (let x = center - 2; x <= center + 2; x++) {
    data[2][x] = hair;
  }
  
  // Head
  for (let x = center - 1; x <= center + 1; x++) {
    data[3][x] = skin;
    data[4][x] = skin;
  }
  
  // Eyes
  data[3][center - 1] = palette[0] || '#000000';
  data[3][center + 1] = palette[0] || '#000000';
  
  // Body
  for (let y = 5; y <= 7; y++) {
    for (let x = center - 2; x <= center + 2; x++) {
      data[y][x] = shirt;
    }
  }
  
  // Arms
  data[6][center - 3] = skin;
  data[7][center - 3] = skin;
  data[6][center + 3] = skin;
  data[7][center + 3] = skin;
  
  // Legs
  for (let y = 8; y <= 11; y++) {
    data[y][center - 1] = pants;
    data[y][center + 1] = pants;
  }
  
  return data;
}

/**
 * Generate generic sprite
 */
function generateGenericSprite(size: SpriteSize, palette: string[]): string[][] {
  const data = createEmptyPixelData(size, size);
  const center = Math.floor(size / 2);
  
  // Simple blob character
  const color1 = palette[6] || '#a7f070';
  const color2 = palette[7] || '#38b764';
  
  // Body (circle-ish)
  for (let y = 3; y <= 9; y++) {
    for (let x = center - 3; x <= center + 3; x++) {
      const dist = Math.abs(x - center) + Math.abs(y - 6);
      if (dist <= 4) {
        data[y][x] = dist < 3 ? color1 : color2;
      }
    }
  }
  
  // Eyes
  data[5][center - 1] = palette[0] || '#000000';
  data[5][center + 1] = palette[0] || '#000000';
  
  // Mouth
  data[7][center] = palette[0] || '#000000';
  
  return data;
}

/**
 * Convert pixel data to data URL
 */
function pixelDataToDataURL(data: string[][], size: SpriteSize): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // Draw pixels
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      const color = data[y][x];
      if (color && color !== 'transparent') {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  
  return canvas.toDataURL('image/png');
}

/**
 * Apply dithering effect
 */
export function applyDithering(data: string[][], palette: string[]): string[][] {
  // Simple ordered dithering
  const dithered = data.map((row, y) =>
    row.map((color, x) => {
      if (color === 'transparent') return color;
      
      // Dither pattern
      const pattern = (x + y) % 2;
      const colorIndex = palette.indexOf(color);
      
      if (colorIndex > 0 && pattern === 1) {
        return palette[Math.max(0, colorIndex - 1)];
      }
      
      return color;
    })
  );
  
  return dithered;
}

/**
 * Add outline to sprite
 */
export function addOutline(data: string[][], outlineColor: string): string[][] {
  const outlined = data.map(row => [...row]);
  
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      if (data[y][x] !== 'transparent') {
        // Check neighbors
        const neighbors = [
          [y - 1, x], [y + 1, x], [y, x - 1], [y, x + 1],
        ];
        
        for (const [ny, nx] of neighbors) {
          if (
            ny >= 0 && ny < data.length &&
            nx >= 0 && nx < data[0].length &&
            data[ny][nx] === 'transparent'
          ) {
            outlined[ny][nx] = outlineColor;
          }
        }
      }
    }
  }
  
  return outlined;
}
