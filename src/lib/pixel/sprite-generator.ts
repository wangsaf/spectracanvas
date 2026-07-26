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
  palette?: string[],
  archetype?: string
): CharacterSprite {
  // Use style-specific palette if not provided
  const colors = palette || getStylePalette(style);
  
  // Generate pixel data based on description keywords
  const pixelData = generatePixelDataFromDescription(description, size, colors, archetype);
  
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
      return [...PIXEL_ART_PALETTES['8-bit']];
    case '16-bit':
      return [...PIXEL_ART_PALETTES['16-bit']];
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
      return [...PIXEL_ART_PALETTES['16-bit']];
  }
}

/**
 * Generate pixel data from description
 */
function generatePixelDataFromDescription(
  description: string,
  size: SpriteSize,
  palette: string[],
  archetype?: string
): string[][] {
  const data = createEmptyPixelData(size, size);
  const desc = description.toLowerCase();
  
  // Determine character type
  const isHuman = desc.includes('human') || desc.includes('person') || desc.includes('character');
  const isKnight = archetype === 'knight' || desc.includes('knight') || desc.includes('warrior');
  const isRobot = archetype === 'robot' || desc.includes('robot') || desc.includes('mech');
  const isAnimal = archetype === 'animal' || desc.includes('animal') || desc.includes('cat') || desc.includes('dog');
  
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
 * Convert pixel data to data URL using pure JS (no canvas needed — works server-side)
 */
function pixelDataToDataURL(data: string[][], size: SpriteSize): string {
  // Build raw RGBA pixel buffer
  const rawPixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      const color = data[y][x];
      const idx = (y * size + x) * 4;
      if (color && color !== 'transparent') {
        const rgb = hexToRgbLocal(color);
        rawPixels[idx] = rgb.r;
        rawPixels[idx + 1] = rgb.g;
        rawPixels[idx + 2] = rgb.b;
        rawPixels[idx + 3] = 255;
      }
      // else leave as 0,0,0,0 (transparent)
    }
  }
  // Encode as minimal PNG
  const pngBuffer = encodePNG(size, size, rawPixels);
  const base64 = Buffer.from(pngBuffer).toString('base64');
  return `data:image/png;base64,${base64}`;
}

function hexToRgbLocal(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

/**
 * Minimal PNG encoder (uncompressed, no external deps)
 */
function encodePNG(width: number, height: number, rgba: Uint8Array): Uint8Array {
  function crc32(buf: Uint8Array): number {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function adler32(buf: Uint8Array): number {
    let a = 1, b = 0;
    for (let i = 0; i < buf.length; i++) {
      a = (a + buf[i]) % 65521;
      b = (b + a) % 65521;
    }
    return ((b << 16) | a) >>> 0;
  }

  // Build raw scanlines with filter byte 0 (None)
  const raw = new Uint8Array(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0; // filter None
    raw.set(rgba.subarray(y * width * 4, (y + 1) * width * 4), y * (1 + width * 4) + 1);
  }

  // zlib deflate (store mode — no compression)
  const blocks: Uint8Array[] = [];
  const BLOCK = 65535;
  for (let i = 0; i < raw.length; i += BLOCK) {
    const end = Math.min(i + BLOCK, raw.length);
    const chunk = raw.subarray(i, end);
    const isLast = end === raw.length;
    const len = end - i;
    const block = new Uint8Array(5 + len);
    block[0] = isLast ? 1 : 0;
    block[1] = len & 0xff;
    block[2] = (len >> 8) & 0xff;
    block[3] = ~len & 0xff;
    block[4] = (~len >> 8) & 0xff;
    block.set(chunk, 5);
    blocks.push(block);
  }
  const deflatedLen = blocks.reduce((s, b) => s + b.length, 0);
  const zlib = new Uint8Array(2 + deflatedLen + 4);
  zlib[0] = 0x78; zlib[1] = 0x01;
  let off = 2;
  for (const b of blocks) { zlib.set(b, off); off += b.length; }
  const adler = adler32(raw);
  zlib[off] = (adler >> 24) & 0xff;
  zlib[off + 1] = (adler >> 16) & 0xff;
  zlib[off + 2] = (adler >> 8) & 0xff;
  zlib[off + 3] = adler & 0xff;

  // Build PNG
  function chunk(type: string, data: Uint8Array): Uint8Array {
    const t = new Uint8Array([type.charCodeAt(0), type.charCodeAt(1), type.charCodeAt(2), type.charCodeAt(3)]);
    const len = new Uint8Array([(data.length >> 24) & 0xff, (data.length >> 16) & 0xff, (data.length >> 8) & 0xff, data.length & 0xff]);
    const combined = new Uint8Array(t.length + len.length + data.length);
    combined.set(len, 0); combined.set(t, 4); combined.set(data, 8);
    const c = crc32(combined.subarray(4));
    const crcB = new Uint8Array([(c >> 24) & 0xff, (c >> 16) & 0xff, (c >> 8) & 0xff, c & 0xff]);
    const result = new Uint8Array(combined.length + 4);
    result.set(combined, 0); result.set(crcB, combined.length);
    return result;
  }

  const sig = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = new Uint8Array(13);
  ihdr[0] = (width >> 24) & 0xff; ihdr[1] = (width >> 16) & 0xff; ihdr[2] = (width >> 8) & 0xff; ihdr[3] = width & 0xff;
  ihdr[4] = (height >> 24) & 0xff; ihdr[5] = (height >> 16) & 0xff; ihdr[6] = (height >> 8) & 0xff; ihdr[7] = height & 0xff;
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const IHDR = chunk('IHDR', ihdr);
  const IDAT = chunk('IDAT', zlib);
  const IEND = chunk('IEND', new Uint8Array(0));

  const png = new Uint8Array(sig.length + IHDR.length + IDAT.length + IEND.length);
  png.set(sig, 0);
  png.set(IHDR, sig.length);
  png.set(IDAT, sig.length + IHDR.length);
  png.set(IEND, sig.length + IHDR.length + IDAT.length);
  return png;
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
