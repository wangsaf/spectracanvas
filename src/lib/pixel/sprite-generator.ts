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
 * Generate pixel data from description — expanded creature/object library
 */
function generatePixelDataFromDescription(
  description: string,
  size: SpriteSize,
  palette: string[],
  archetype?: string
): string[][] {
  const desc = description.toLowerCase();

  // Parse adjectives to get modifiers
  const modifiers = parseAdjectives(desc);

  // Determine creature/character type (order matters — specific before general)
  let data: string[][];

  // === Existing archetypes ===
  if (archetype === 'knight' || desc.includes('knight') || desc.includes('warrior') || desc.includes('paladin')) {
    data = generateKnightSprite(size, palette);
  } else if (archetype === 'robot' || desc.includes('robot') || desc.includes('mech') || desc.includes('android')) {
    data = generateRobotSprite(size, palette);

  // === Bird types ===
  } else if (desc.includes('duck')) {
    data = generateDuckSprite(size, palette);
  } else if (desc.includes('chicken') || desc.includes('hen') || desc.includes('rooster')) {
    data = generateChickenSprite(size, palette);
  } else if (desc.includes('eagle') || desc.includes('hawk') || desc.includes('falcon')) {
    data = generateEagleSprite(size, palette);
  } else if (desc.includes('owl')) {
    data = generateOwlSprite(size, palette);
  } else if (desc.includes('penguin')) {
    data = generatePenguinSprite(size, palette);
  } else if (desc.includes('bird') || desc.includes('sparrow')) {
    data = generateBirdSprite(size, palette);

  // === Fantasy ===
  } else if (desc.includes('wizard') || desc.includes('mage') || desc.includes('sorcerer')) {
    data = generateWizardSprite(size, palette);
  } else if (desc.includes('dragon') || desc.includes('drake') || desc.includes('wyrm')) {
    data = generateDragonSprite(size, palette);
  } else if (desc.includes('slime') || desc.includes('ooze') || desc.includes('blob')) {
    data = generateSlimeSprite(size, palette);
  } else if (desc.includes('ghost') || desc.includes('phantom') || desc.includes('spirit') || desc.includes('wraith')) {
    data = generateGhostSprite(size, palette);
  } else if (desc.includes('demon') || desc.includes('devil') || desc.includes('fiend')) {
    data = generateDemonSprite(size, palette);
  } else if (desc.includes('angel') || desc.includes('seraph')) {
    data = generateAngelSprite(size, palette);

  // === Animals ===
  } else if (desc.includes('fish') || desc.includes('trout') || desc.includes('salmon')) {
    data = generateFishSprite(size, palette);
  } else if (desc.includes('snake') || desc.includes('serpent') || desc.includes('viper')) {
    data = generateSnakeSprite(size, palette);
  } else if (desc.includes('spider') || desc.includes('arachnid')) {
    data = generateSpiderSprite(size, palette);
  } else if (desc.includes('bear') || desc.includes('grizzly')) {
    data = generateBearSprite(size, palette);
  } else if (desc.includes('wolf') || desc.includes('werewolf')) {
    data = generateWolfSprite(size, palette);
  } else if (desc.includes('fox') || desc.includes('kitsune')) {
    data = generateFoxSprite(size, palette);
  } else if (desc.includes('rabbit') || desc.includes('bunny') || desc.includes('hare')) {
    data = generateRabbitSprite(size, palette);
  } else if (desc.includes('mouse') || desc.includes('rat') || desc.includes('rodent')) {
    data = generateMouseSprite(size, palette);
  } else if (desc.includes('frog') || desc.includes('toad')) {
    data = generateFrogSprite(size, palette);
  } else if (desc.includes('turtle') || desc.includes('tortoise')) {
    data = generateTurtleSprite(size, palette);
  } else if (desc.includes('cat') || desc.includes('kitten')) {
    data = generateAnimalSprite(size, palette); // existing animal sprite works for cat
  } else if (desc.includes('dog') || desc.includes('puppy') || desc.includes('hound')) {
    data = generateDogSprite(size, palette);

  // === Creatures ===
  } else if (desc.includes('alien') || desc.includes('extraterrestrial')) {
    data = generateAlienSprite(size, palette);
  } else if (desc.includes('monster') || desc.includes('beast') || desc.includes('creature')) {
    data = generateMonsterSprite(size, palette);
  } else if (desc.includes('zombie') || desc.includes('undead') || desc.includes('ghoul')) {
    data = generateZombieSprite(size, palette);
  } else if (desc.includes('skeleton') || desc.includes('skull') || desc.includes('bones')) {
    data = generateSkeletonSprite(size, palette);
  } else if (desc.includes('vampire') || desc.includes('dracula') || desc.includes('nosferatu')) {
    data = generateVampireSprite(size, palette);

  // === Objects ===
  } else if (desc.includes('chest') || desc.includes('treasure')) {
    data = generateChestSprite(size, palette);
  } else if (desc.includes('barrel') || desc.includes('cask') || desc.includes('keg')) {
    data = generateBarrelSprite(size, palette);
  } else if (desc.includes('tree') || desc.includes('oak') || desc.includes('pine')) {
    data = generateTreeSprite(size, palette);
  } else if (desc.includes('mushroom') || desc.includes('toadstool')) {
    data = generateMushroomSprite(size, palette);
  } else if (desc.includes('crystal') || desc.includes('gem') || desc.includes('jewel')) {
    data = generateCrystalSprite(size, palette);

  // === Existing generic categories ===
  } else if (archetype === 'animal' || desc.includes('animal') || desc.includes('pet') || desc.includes('beast')) {
    data = generateAnimalSprite(size, palette);
  } else if (desc.includes('human') || desc.includes('person') || desc.includes('character') || desc.includes('adventurer') || desc.includes('hero')) {
    data = generateHumanSprite(size, palette);
  } else {
    data = generateGenericSprite(size, palette);
  }

  // Apply adjective modifiers
  data = applyModifiers(data, modifiers, palette);

  return data;
}

// ========================================
// ADJECTIVE PARSING & MODIFIER SYSTEM
// ========================================

interface SpriteModifiers {
  armored: boolean;
  fire: boolean;
  ice: boolean;
  dark: boolean;
  golden: boolean;
  big: boolean;
  small: boolean;
  glowing: boolean;
}

function parseAdjectives(desc: string): SpriteModifiers {
  return {
    armored: /\b(armou?red|armou?r|plated|iron|steel)\b/.test(desc),
    fire: /\b(fire|flame|burning|inferno|blazing)\b/.test(desc),
    ice: /\b(ice|frozen|frost|cold|arctic|glacial)\b/.test(desc),
    dark: /\b(dark|shadow|darkness|night|void|cursed)\b/.test(desc),
    golden: /\b(golden|gold|gilded|auric)\b/.test(desc),
    big: /\b(big|large|giant|huge|massive|colossal)\b/.test(desc),
    small: /\b(small|tiny|mini|little|miniature)\b/.test(desc),
    glowing: /\b(glowing|glow|neon|luminous|radiant|shining)\b/.test(desc),
  };
}

/** Shift a hex colour by a scalar factor */
function shiftColor(hex: string, factor: number): string {
  const h = hex.replace('#', '');
  const r = Math.min(255, Math.max(0, Math.round(parseInt(h.substring(0, 2), 16) * factor)));
  const g = Math.min(255, Math.max(0, Math.round(parseInt(h.substring(2, 4), 16) * factor)));
  const b = Math.min(255, Math.max(0, Math.round(parseInt(h.substring(4, 6), 16) * factor)));
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

function applyModifiers(data: string[][], mods: SpriteModifiers, palette: string[]): string[][] {
  let result = data.map(row => [...row]); // deep copy

  // Dark modifier — darken all non-transparent colours
  if (mods.dark) {
    result = result.map(row => row.map(c =>
      c && c !== 'transparent' ? shiftColor(c, 0.55) : c
    ));
  }

  // Fire — tint toward red/orange
  if (mods.fire) {
    const fireOverlay = '#ff4400';
    const orangeAccent = '#ff8800';
    result = result.map((row, y) => row.map((c, x) => {
      if (!c || c === 'transparent') return c;
      if ((x + y) % 3 === 0) return shiftColor(c, 1.1);
      return c;
    }));
    // Add red accent highlights
    for (let y = 0; y < result.length; y++) {
      for (let x = 0; x < result[y].length; x++) {
        if (result[y][x] && result[y][x] !== 'transparent' && (x + y) % 5 === 0) {
          result[y][x] = (x + y) % 2 === 0 ? fireOverlay : orangeAccent;
        }
      }
    }
  }

  // Ice — tint toward blue/white
  if (mods.ice) {
    const iceBlue = '#88ccff';
    const iceWhite = '#e0f0ff';
    result = result.map((row, y) => row.map((c, x) => {
      if (!c || c === 'transparent') return c;
      // Blend toward ice blue
      const h = c.replace('#', '');
      const r = Math.min(255, Math.round(parseInt(h.substring(0, 2), 16) * 0.5 + 0x88 * 0.5));
      const g = Math.min(255, Math.round(parseInt(h.substring(2, 4), 16) * 0.5 + 0xcc * 0.5));
      const b = Math.min(255, Math.round(parseInt(h.substring(4, 6), 16) * 0.3 + 0xff * 0.7));
      return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    }));
    // White sparkle highlights
    for (let y = 0; y < result.length; y++) {
      for (let x = 0; x < result[y].length; x++) {
        if (result[y][x] && result[y][x] !== 'transparent' && (x * 3 + y * 7) % 11 === 0) {
          result[y][x] = iceWhite;
        }
      }
    }
  }

  // Golden — tint toward gold/yellow
  if (mods.golden) {
    const goldColor = '#ffd700';
    const goldLight = '#fff088';
    result = result.map((row, y) => row.map((c, x) => {
      if (!c || c === 'transparent') return c;
      const h = c.replace('#', '');
      const r = Math.min(255, Math.round(parseInt(h.substring(0, 2), 16) * 0.5 + 0xff * 0.5));
      const g = Math.min(255, Math.round(parseInt(h.substring(2, 4), 16) * 0.5 + 0xd7 * 0.5));
      const b = Math.min(255, Math.round(parseInt(h.substring(4, 6), 16) * 0.7));
      return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    }));
    // Gold highlights
    for (let y = 0; y < result.length; y++) {
      for (let x = 0; x < result[y].length; x++) {
        if (result[y][x] && result[y][x] !== 'transparent' && (x + y * 3) % 7 === 0) {
          result[y][x] = goldLight;
        }
      }
    }
  }

  // Armoured — add metallic gray overlay
  if (mods.armored) {
    const metalGray = '#8899aa';
    const metalLight = '#bcc8d4';
    const metalDark = '#556677';
    result = result.map((row, y) => row.map((c, x) => {
      if (!c || c === 'transparent') return c;
      // Replace some pixels with metallic tones
      if ((x + y) % 4 === 0) return metalGray;
      if ((x + y) % 4 === 2) return metalDark;
      return c;
    }));
    // Add metallic highlights
    for (let y = 0; y < result.length; y++) {
      for (let x = 0; x < result[y].length; x++) {
        if (result[y][x] && result[y][x] !== 'transparent' && (x * 2 + y) % 8 === 0) {
          result[y][x] = metalLight;
        }
      }
    }
  }

  // Glowing — add bright accent pixels
  if (mods.glowing) {
    const glowColor = '#00ffaa';
    const glowBright = '#aaffee';
    for (let y = 0; y < result.length; y++) {
      for (let x = 0; x < result[y].length; x++) {
        if (result[y][x] && result[y][x] !== 'transparent') {
          if ((x + y) % 6 === 0) {
            result[y][x] = glowBright;
          } else if ((x + y) % 4 === 0) {
            result[y][x] = glowColor;
          }
        }
      }
    }
  }

  return result;
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

// ========================================
// TEMPLATE-BASED SPRITE GENERATION
// ========================================

/**
 * Render an 8x8 template grid onto a data array, scaling to fill `size`.
 * Template characters: '.' = transparent, any letter = mapped via colorMap
 */
function renderTemplate(
  size: SpriteSize,
  template: string[],
  colorMap: Record<string, string>
): string[][] {
  const data = createEmptyPixelData(size, size);
  const tH = template.length;
  const tW = Math.max(...template.map(r => r.length));
  const scale = Math.max(1, Math.floor(size / Math.max(tH, tW)));
  const offX = Math.floor((size - tW * scale) / 2);
  const offY = Math.floor((size - tH * scale) / 2);

  for (let ty = 0; ty < tH; ty++) {
    for (let tx = 0; tx < template[ty].length; tx++) {
      const ch = template[ty][tx];
      if (ch === '.' || ch === ' ') continue;
      const color = colorMap[ch];
      if (!color) continue;
      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          const py = offY + ty * scale + sy;
          const px = offX + tx * scale + sx;
          if (py >= 0 && py < size && px >= 0 && px < size) {
            data[py][px] = color;
          }
        }
      }
    }
  }
  return data;
}

// ========================================
// BIRD SPRITES
// ========================================

function generateDuckSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '..YYY...',
    '.YYYYY..',
    '.YYYYY..',
    'OOYYYY..',
    '.YYYYY..',
    '.YYYYYY.',
    '..YY.YY.',
    '........',
  ], {
    Y: palette[5] || '#ffcd75',   // yellow body
    O: palette[4] || '#ef7d57',   // orange beak/feet
  });
}

function generateChickenSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '..RR....',
    '.RRRR...',
    '.RYYYY..',
    'RKYYYYY.',
    '.YYYYYY.',
    '.YYYYY..',
    '..Y..Y..',
    '........',
  ], {
    R: palette[3] || '#b13e53',   // red comb
    Y: palette[5] || '#ffcd75',   // yellow body
    K: palette[0] || '#000000',   // eyes
  });
}

function generateBirdSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '..BB....',
    '.BBBB...',
    'BKBKB...',
    '.BBBBB..',
    '..BBBB..',
    '.BB.BB..',
    '.B...B..',
    '........',
  ], {
    B: palette[10] || '#3b5dc9',  // blue body
    K: palette[0] || '#000000',   // eyes
  });
}

function generateEagleSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '...BB...',
    '..BBBB..',
    '.BKBKB..',
    '.YYYYY..',  // Y = yellow beak
    '..BBBB..',
    'BBBBBBB.',
    '.B...B..',
    '........',
  ], {
    B: palette[1] || '#1a1c2c',   // dark brown
    K: palette[0] || '#000000',   // eyes
    Y: palette[5] || '#ffcd75',   // yellow beak
  });
}

function generateOwlSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '.BBBB...',
    'BBBBBB..',
    'BYKYBK..',
    '.BYYB...',
    '.BBBBB..',
    '..BBB...',
    '..B.B...',
    '........',
  ], {
    B: palette[1] || '#1a1c2c',   // dark feathers
    Y: palette[5] || '#ffcd75',   // yellow eyes
    K: palette[0] || '#000000',   // pupils
  });
}

function generatePenguinSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '..KKK...',
    '.KKKKK..',
    'KWKWWWK.',
    'KWWWWKK.',
    '.KWWWWK.',
    '..KKK...',
    '..K.K...',
    '........',
  ], {
    K: palette[1] || '#1a1c2c',   // black body
    W: '#f4f4f4',                  // white belly
  });
}

// ========================================
// FANTASY SPRITES
// ========================================

function generateWizardSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '...P....',
    '..PPP...',
    '.PPPPP..',
    '.SSSS...',
    'SSSSSS..',
    '.SSSSS..',
    '.SS.SS..',
    '..S.S...',
  ], {
    P: palette[2] || '#5d275d',   // purple hat
    S: palette[10] || '#3b5dc9',  // blue robe
  });
}

function generateDragonSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '.GGGG...',
    'GGGGGG..',
    'GRGRGG..',
    '.GGGGG..',
    '.GGGGG..',
    'GGGGGGG.',
    '.G.G.G..',
    '........',
  ], {
    G: palette[7] || '#38b764',   // green scales
    R: palette[3] || '#b13e53',   // red eyes
  });
}

function generateSlimeSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '........',
    '..GGG...',
    '.GGGGG..',
    'GGEGEGG.',
    'GGGGGGG.',
    'GGGGGGG.',
    '........',
    '........',
  ], {
    G: palette[6] || '#a7f070',   // green slime
    E: palette[0] || '#000000',   // eyes
  });
}

function generateGhostSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '..WWW...',
    '.WWWWW..',
    'WWWWWWW.',
    'WKW.KWW.',
    'WWWWWWW.',
    'WWWWWWW.',
    'W.W.W.W.',
    '........',
  ], {
    W: '#e8e8f0',                  // ghostly white
    K: palette[0] || '#000000',   // eyes
  });
}

function generateDemonSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '.R.R....',
    '.RRRR...',
    '.RRRR...',
    'RRRRRR..',
    'RKRRRRK.',
    '.RRRR...',
    '.RRRR...',
    '.R.R.R..',
  ], {
    R: palette[3] || '#b13e53',   // red skin
    K: palette[5] || '#ffcd75',   // yellow eyes
  });
}

function generateAngelSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    'WWWWWW..',
    '.WWWWW..',
    '..WWW...',
    '.WWWWW..',
    'WWKKWWW.',
    '.WWWW...',
    '.W..W...',
    '........',
  ], {
    W: '#f4f4f4',                  // white robes
    K: palette[11] || '#41a6f6',  // blue eyes
  });
}

// ========================================
// ANIMAL SPRITES
// ========================================

function generateFishSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '........',
    '..CCCC..',
    '.CCCCCC.',
    'KCKCCCCC',
    '.CCCCCC.',
    '..CCCC..',
    '........',
    '........',
  ], {
    C: palette[11] || '#41a6f6',  // cyan fish
    K: palette[0] || '#000000',   // eye
  });
}

function generateSnakeSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '........',
    '.GGG....',
    'GG.GG...',
    '.GG.....',
    '..GG....',
    '...GGG..',
    '....GK..',
    '........',
  ], {
    G: palette[7] || '#38b764',   // green scales
    K: palette[0] || '#000000',   // eye
  });
}

function generateSpiderSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '........',
    'K.KKK.K.',
    '.KKKKK..',
    '..KKK...',
    '.KKKKK..',
    'K.KKK.K.',
    '........',
    '........',
  ], {
    K: palette[1] || '#1a1c2c',   // dark spider
  });
}

function generateBearSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '.BBBB...',
    'BBBBBB..',
    'BBKBBK..',
    '.BBBB...',
    'BBBBBB..',
    'BBBBBB..',
    'BB..BB..',
    '........',
  ], {
    B: palette[4] || '#ef7d57',   // brown fur
    K: palette[0] || '#000000',   // eyes
  });
}

function generateWolfSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '.G..G...',
    'GGGGGG..',
    'GGKGGK..',
    '.GGGGG..',
    '.GGGGG..',
    '.GGGGG..',
    '.G...G..',
    '........',
  ], {
    G: palette[15] || '#566c86',  // grey fur
    K: palette[0] || '#000000',   // eyes
  });
}

function generateFoxSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '.R..R...',
    '.RRRR...',
    'RWRKWR..',
    '.RRRR...',
    '.RRRRR..',
    '.RRRR...',
    '.R.R.R..',
    '........',
  ], {
    R: palette[4] || '#ef7d57',   // orange fur
    W: '#f4f4f4',                  // white muzzle
    K: palette[0] || '#000000',   // eyes/nose
  });
}

function generateRabbitSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '.W..W...',
    '.WWWW...',
    'WWWWWW..',
    'WKWWWK..',
    '.WWWWW..',
    '.WWWWW..',
    '.W...W..',
    '........',
  ], {
    W: '#e8e0d8',                  // light fur
    K: palette[0] || '#000000',   // eyes
  });
}

function generateMouseSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '........',
    '.PPPP...',
    'PPPPPP..',
    'PKEPKP..',
    '.PPPPPP.',
    '..PPPP..',
    '..PP.PP.',
    '........',
  ], {
    P: palette[15] || '#566c86',  // grey
    K: palette[0] || '#000000',   // eyes
    E: palette[3] || '#b13e53',   // ears
  });
}

function generateFrogSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '........',
    '.GGGG...',
    'GKGGKG..',
    'GGGGGG..',
    '.GGGGG..',
    '.GGGGG..',
    '.G.G.G..',
    '........',
  ], {
    G: palette[6] || '#a7f070',   // green
    K: palette[0] || '#000000',   // eyes
  });
}

function generateTurtleSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '........',
    '..GGG...',
    '.GGGGG..',
    'GGRGRGG.',
    'GGGGGGG.',
    '.GGGGG..',
    '.G.G.G..',
    '........',
  ], {
    G: palette[7] || '#38b764',   // green shell
    R: palette[3] || '#b13e53',   // shell pattern
  });
}

function generateDogSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '.BB..BB.',
    '.BBBB...',
    'BBKBBK..',
    '.BWWB...',   // W = muzzle
    '.BBBB...',
    '.BBBB...',
    '.B..B...',
    '........',
  ], {
    B: palette[4] || '#ef7d57',   // brown
    K: palette[0] || '#000000',   // eyes
    W: '#e8e0d8',                  // muzzle
  });
}

// ========================================
// CREATURE SPRITES
// ========================================

function generateAlienSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '..GGG...',
    '.GGGGG..',
    'GRGGRGG.',
    'GGGGGGG.',
    '.GGGGG..',
    '..GGG...',
    '..G.G...',
    '........',
  ], {
    G: palette[6] || '#a7f070',   // green skin
    R: palette[0] || '#000000',   // big eyes
  });
}

function generateMonsterSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '.PPPP...',
    '.PPPPP..',
    'PPKPPKPP',
    'PPPPPPP.',
    '.PPPPP..',
    '.PPPPP..',
    '.PP.PP..',
    '........',
  ], {
    P: palette[2] || '#5d275d',   // purple monster
    K: palette[5] || '#ffcd75',   // yellow eyes
  });
}

function generateZombieSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '.GGGG...',
    '.GGGG...',
    'GGKGGK..',
    '.GGGG...',
    'GGGGGG..',
    '.GGGGG..',
    '.G.G.G..',
    '........',
  ], {
    G: palette[7] || '#38b764',   // greenish skin
    K: palette[3] || '#b13e53',   // red eyes
  });
}

function generateSkeletonSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '.WWWW...',
    '.WWWW...',
    '.WKWKW..',
    '..WWW...',
    '..WWW...',
    '.WWWWW..',
    '.W.W.W..',
    '..W.W...',
  ], {
    W: '#e8e8e0',                  // bone white
    K: palette[0] || '#000000',   // eye sockets
  });
}

function generateVampireSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '.KKKK...',
    '.KKKK...',
    'KWKWK...',
    '.KKKK...',
    'KKRKRK..',
    '.KKKK...',
    '.K.K.K..',
    '........',
  ], {
    K: palette[1] || '#1a1c2c',   // dark cape
    W: '#e8e0d8',                  // pale face
    R: palette[3] || '#b13e53',   // red lining
  });
}

// ========================================
// OBJECT SPRITES
// ========================================

function generateChestSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '........',
    '.BBBBB..',
    'BBMMMB..',
    'BBMMMB..',
    'BBBMBB..',
    'BBBBBB..',
    'BBBBBB..',
    '........',
  ], {
    B: palette[4] || '#ef7d57',   // brown wood
    M: palette[5] || '#ffcd75',   // gold hardware
  });
}

function generateBarrelSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '..WWWW..',
    '.WWWWWW.',
    'WMMWMMW.',
    '.WWWWWW.',
    '.WWWWWW.',
    'WMMWMMW.',
    '.WWWWWW.',
    '..WWWW..',
  ], {
    W: palette[4] || '#ef7d57',   // wood
    M: palette[1] || '#1a1c2c',   // metal bands
  });
}

function generateTreeSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '..GGG...',
    '.GGGGG..',
    'GGGGGGG.',
    'GGGGGGG.',
    '.GGGGG..',
    '..BBB...',
    '..BBB...',
    '..BBB...',
  ], {
    G: palette[7] || '#38b764',   // green leaves
    B: palette[4] || '#ef7d57',   // brown trunk
  });
}

function generateMushroomSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '.RRRRR..',
    'RRRRRRR.',
    'RRWRRWR.',
    'RRRRRRR.',
    '.WWWWW..',
    '.WWWWW..',
    '.WWWWW..',
    '........',
  ], {
    R: palette[3] || '#b13e53',   // red cap
    W: '#e8e0d8',                  // stem
  });
}

function generateCrystalSprite(size: SpriteSize, palette: string[]): string[][] {
  return renderTemplate(size, [
    '..CC....',
    '.CCCC...',
    '.CCCCC..',
    'CCCCCC..',
    '.CCCCC..',
    '..CCC...',
    '...CC...',
    '........',
  ], {
    C: palette[12] || '#73eff7',  // cyan crystal
  });
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
