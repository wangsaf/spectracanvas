import type { PoseSet, CharacterSprite } from '@/lib/types';
import { createEmptyPixelData } from './canvas-engine';

// ========================================
// POSE GENERATION
// ========================================

/**
 * Generate multiple poses from a base sprite
 */
export function generatePoses(baseSprite: CharacterSprite): PoseSet {
  // For now, generate simple variations
  // In production, this would use AI to generate actual pose variations
  
  return {
    idle: [baseSprite.imageData],
    walk: generateWalkCycle(baseSprite),
    run: generateRunCycle(baseSprite),
    attack: generateAttackCycle(baseSprite),
    jump: generateJumpCycle(baseSprite),
  };
}

/**
 * Generate walk cycle animation (4 frames)
 */
function generateWalkCycle(sprite: CharacterSprite): string[] {
  // Simple walk cycle by shifting pixels
  const frames: string[] = [];
  
  // Frame 1: Base pose
  frames.push(sprite.imageData);
  
  // Frame 2-4: Slight variations (placeholder)
  // In production, these would be actual animated frames
  for (let i = 0; i < 3; i++) {
    frames.push(sprite.imageData);
  }
  
  return frames;
}

/**
 * Generate run cycle animation (4 frames)
 */
function generateRunCycle(sprite: CharacterSprite): string[] {
  const frames: string[] = [];
  
  for (let i = 0; i < 4; i++) {
    frames.push(sprite.imageData);
  }
  
  return frames;
}

/**
 * Generate attack animation (4 frames)
 */
function generateAttackCycle(sprite: CharacterSprite): string[] {
  const frames: string[] = [];
  
  for (let i = 0; i < 4; i++) {
    frames.push(sprite.imageData);
  }
  
  return frames;
}

/**
 * Generate jump animation (2 frames)
 */
function generateJumpCycle(sprite: CharacterSprite): string[] {
  return [sprite.imageData, sprite.imageData];
}

// ========================================
// SPRITE SHEET COMPOSITION
// ========================================

/**
 * Compose multiple sprites into a sprite sheet
 */
export async function composeSpriteSheet(
  sprites: string[],
  columns: number,
  spriteSize: number
): Promise<string> {
  const rows = Math.ceil(sprites.length / columns);
  const sheetWidth = columns * spriteSize;
  const sheetHeight = rows * spriteSize;
  
  const canvas = document.createElement('canvas');
  canvas.width = sheetWidth;
  canvas.height = sheetHeight;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Disable smoothing for pixel art
  ctx.imageSmoothingEnabled = false;
  
  // Draw each sprite
  for (let i = 0; i < sprites.length; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = col * spriteSize;
    const y = row * spriteSize;
    
    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, x, y, spriteSize, spriteSize);
        resolve();
      };
      img.onerror = reject;
      img.src = sprites[i];
    });
  }
  
  return canvas.toDataURL('image/png');
}

/**
 * Generate sprite sheet metadata
 */
export function generateSpriteSheetMetadata(
  spriteCount: number,
  columns: number,
  spriteSize: number,
  poseNames: string[]
) {
  const rows = Math.ceil(spriteCount / columns);
  const frames = [];
  
  for (let i = 0; i < spriteCount; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    
    frames.push({
      name: poseNames[i] || `frame_${i}`,
      x: col * spriteSize,
      y: row * spriteSize,
      width: spriteSize,
      height: spriteSize,
    });
  }
  
  return {
    frames,
    meta: {
      image: 'spritesheet.png',
      size: {
        w: columns * spriteSize,
        h: rows * spriteSize,
      },
      scale: 1,
    },
  };
}
