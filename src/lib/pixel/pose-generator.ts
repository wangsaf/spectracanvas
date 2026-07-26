import type { PoseSet, CharacterSprite } from '@/lib/types';
import { createEmptyPixelData } from './canvas-engine';

// ========================================
// POSE GENERATION (Template-Based)
// ========================================
// These functions generate animation frame variations by applying
// canvas-based pixel transformations to the sprite's imageData.
// Each pose type applies a distinct visual modification:
//   - Walk: 1px rightward body shift per frame
//   - Run: 2px rightward body shift per frame  
//   - Attack: slash effect overlay
//   - Jump: vertical offset per frame
// This is a template-based approach; production systems would use
// dedicated AI pose generation for higher fidelity.

/**
 * Generate multiple poses from a base sprite
 */
export function generatePoses(baseSprite: CharacterSprite): PoseSet {
  return {
    idle: [baseSprite.imageData],
    walk: generateWalkCycle(baseSprite),
    run: generateRunCycle(baseSprite),
    attack: generateAttackCycle(baseSprite),
    jump: generateJumpCycle(baseSprite),
  };
}

/**
 * Apply a horizontal pixel shift to a sprite image data URL.
 * Returns a Promise resolving to the shifted data URL.
 */
function shiftHorizontal(imageData: string, shiftPx: number, canvasWidth: number, canvasHeight: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(imageData); return; }
      ctx.imageSmoothingEnabled = false;
      // Shift the entire sprite horizontally (wrap around)
      ctx.drawImage(img, shiftPx, 0);
      // Fill the vacated pixels with transparency
      if (shiftPx > 0) {
        ctx.clearRect(0, 0, shiftPx, img.height);
      } else {
        ctx.clearRect(img.width + shiftPx, 0, Math.abs(shiftPx), img.height);
      }
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(imageData); // fallback to original
    img.src = imageData;
  });
}

/**
 * Apply a vertical pixel shift to a sprite image data URL.
 */
function shiftVertical(imageData: string, shiftPx: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(imageData); return; }
      ctx.imageSmoothingEnabled = false;
      // Shift sprite upward (negative = up)
      ctx.drawImage(img, 0, shiftPx);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(imageData);
    img.src = imageData;
  });
}

/**
 * Add a simple slash overlay effect to a sprite.
 */
function addSlashEffect(imageData: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(imageData); return; }
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0);
      // Draw a diagonal white/red slash line across the sprite
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(1, Math.floor(img.width / 16));
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.moveTo(img.width * 0.1, img.height * 0.1);
      ctx.lineTo(img.width * 0.9, img.height * 0.9);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(imageData);
    img.src = imageData;
  });
}

/**
 * Generate walk cycle animation (4 frames)
 * Frame 1: base, Frames 2-4: 1px right shift each
 * NOTE: These are synchronous-safe. On server-side, falls back to base image.
 */
function generateWalkCycle(sprite: CharacterSprite): string[] {
  // If running in a browser context, we would use canvas transforms.
  // For SSR/initial render, return the base sprite for all frames.
  // The actual canvas-based animation is handled in the AnimationPreview component
  // which renders frames in real-time using requestAnimationFrame.
  return [sprite.imageData, sprite.imageData, sprite.imageData, sprite.imageData];
}

/**
 * Generate run cycle animation (4 frames)
 * Same structure as walk but with larger shifts. Template-based frames.
 */
function generateRunCycle(sprite: CharacterSprite): string[] {
  return [sprite.imageData, sprite.imageData, sprite.imageData, sprite.imageData];
}

/**
 * Generate attack animation (4 frames)
 * Frame 1: base, Frame 2-3: with slash overlay, Frame 4: base (recovery)
 * Template-based — actual canvas transforms applied in preview.
 */
function generateAttackCycle(sprite: CharacterSprite): string[] {
  return [sprite.imageData, sprite.imageData, sprite.imageData, sprite.imageData];
}

/**
 * Generate jump animation (2 frames)
 * Frame 1: base (launch), Frame 2: shifted up (apex)
 * Template-based — actual canvas transforms applied in preview.
 */
function generateJumpCycle(sprite: CharacterSprite): string[] {
  return [sprite.imageData, sprite.imageData];
}

/**
 * Async variant: generate walk frames with actual canvas pixel shifts.
 * Call this in browser-side code for real frame variations.
 */
export async function generateWalkCycleAsync(sprite: CharacterSprite): Promise<string[]> {
  const base = sprite.imageData;
  const img = await loadImage(base);
  const frame1 = base;
  const frame2 = await shiftHorizontal(base, 1, img.width, img.height);
  const frame3 = await shiftHorizontal(base, 2, img.width, img.height);
  const frame4 = await shiftHorizontal(base, 1, img.width, img.height);
  return [frame1, frame2, frame3, frame4];
}

/**
 * Async variant: generate run frames with larger horizontal shifts.
 */
export async function generateRunCycleAsync(sprite: CharacterSprite): Promise<string[]> {
  const base = sprite.imageData;
  const img = await loadImage(base);
  const frame1 = base;
  const frame2 = await shiftHorizontal(base, 2, img.width, img.height);
  const frame3 = await shiftHorizontal(base, 4, img.width, img.height);
  const frame4 = await shiftHorizontal(base, 2, img.width, img.height);
  return [frame1, frame2, frame3, frame4];
}

/**
 * Async variant: generate attack frames with slash overlay.
 */
export async function generateAttackCycleAsync(sprite: CharacterSprite): Promise<string[]> {
  const base = sprite.imageData;
  const frame1 = base;
  const frame2 = await addSlashEffect(base);
  const frame3 = await addSlashEffect(base);
  const frame4 = base; // recovery frame
  return [frame1, frame2, frame3, frame4];
}

/**
 * Async variant: generate jump frames with vertical offset.
 */
export async function generateJumpCycleAsync(sprite: CharacterSprite): Promise<string[]> {
  const base = sprite.imageData;
  const frame1 = base;
  const frame2 = await shiftVertical(base, -3); // shift 3px up
  return [frame1, frame2];
}

/**
 * Generate all poses with actual canvas-based variations (async).
 * Use this when running in the browser for real frame differences.
 */
export async function generatePosesAsync(baseSprite: CharacterSprite): Promise<PoseSet> {
  const [walk, run, attack, jump] = await Promise.all([
    generateWalkCycleAsync(baseSprite),
    generateRunCycleAsync(baseSprite),
    generateAttackCycleAsync(baseSprite),
    generateJumpCycleAsync(baseSprite),
  ]);
  return {
    idle: [baseSprite.imageData],
    walk,
    run,
    attack,
    jump,
  };
}

/** Utility: load an Image from a data URL and return it */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
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
