import { hexToRgb } from '@/lib/utils';

// ========================================
// CANVAS RENDERING ENGINE
// ========================================

export interface CanvasConfig {
  width: number;
  height: number;
  scale: number;
  backgroundColor: string;
  gridEnabled?: boolean;
  gridColor?: string;
}

export class CanvasEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: CanvasConfig;

  constructor(canvas: HTMLCanvasElement, config: CanvasConfig) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;
    this.config = config;

    // Set canvas size
    this.canvas.width = config.width;
    this.canvas.height = config.height;

    // Disable image smoothing for pixel art
    this.ctx.imageSmoothingEnabled = false;
  }

  /**
   * Clear the canvas
   */
  clear(): void {
    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw a pixel at specific coordinates
   */
  drawPixel(x: number, y: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      x * this.config.scale,
      y * this.config.scale,
      this.config.scale,
      this.config.scale
    );
  }

  /**
   * Draw a grid overlay
   */
  drawGrid(): void {
    if (!this.config.gridEnabled) return;

    const gridColor = this.config.gridColor || '#333333';
    this.ctx.strokeStyle = gridColor;
    this.ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= this.canvas.width; x += this.config.scale) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= this.canvas.height; y += this.config.scale) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  /**
   * Draw pixel data from 2D array
   */
  drawPixelData(data: string[][]): void {
    this.clear();
    
    for (let y = 0; y < data.length; y++) {
      for (let x = 0; x < data[y].length; x++) {
        const color = data[y][x];
        if (color && color !== 'transparent') {
          this.drawPixel(x, y, color);
        }
      }
    }

    if (this.config.gridEnabled) {
      this.drawGrid();
    }
  }

  /**
   * Export canvas to data URL
   */
  toDataURL(type: string = 'image/png'): string {
    return this.canvas.toDataURL(type);
  }

  /**
   * Export canvas to blob
   */
  async toBlob(type: string = 'image/png'): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Could not convert canvas to blob'));
      }, type);
    });
  }

  /**
   * Get pixel color at coordinates
   */
  getPixelColor(x: number, y: number): string {
    const imageData = this.ctx.getImageData(
      x * this.config.scale,
      y * this.config.scale,
      1,
      1
    );
    const [r, g, b, a] = imageData.data;
    
    if (a === 0) return 'transparent';
    
    return `#${[r, g, b]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')}`;
  }

  /**
   * Update canvas configuration
   */
  updateConfig(config: Partial<CanvasConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (config.width || config.height) {
      this.canvas.width = this.config.width;
      this.canvas.height = this.config.height;
    }
  }
}

// ========================================
// PIXEL ART UTILITIES
// ========================================

/**
 * Create empty pixel data array
 */
export function createEmptyPixelData(width: number, height: number): string[][] {
  return Array(height)
    .fill(null)
    .map(() => Array(width).fill('transparent'));
}

/**
 * Apply color palette constraint to pixel data
 */
export function constrainToPalette(
  data: string[][],
  palette: string[]
): string[][] {
  return data.map((row) =>
    row.map((color) => {
      if (color === 'transparent') return color;
      return findClosestColor(color, palette);
    })
  );
}

/**
 * Find closest color in palette
 */
function findClosestColor(color: string, palette: string[]): string {
  const rgb = hexToRgb(color);
  if (!rgb) return palette[0];

  let closestColor = palette[0];
  let minDistance = Infinity;

  for (const paletteColor of palette) {
    const paletteRgb = hexToRgb(paletteColor);
    if (!paletteRgb) continue;

    const distance = Math.sqrt(
      Math.pow(rgb.r - paletteRgb.r, 2) +
      Math.pow(rgb.g - paletteRgb.g, 2) +
      Math.pow(rgb.b - paletteRgb.b, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = paletteColor;
    }
  }

  return closestColor;
}

/**
 * Convert HEX to RGB
 */


/**
 * Scale pixel data
 */
export function scalePixelData(
  data: string[][],
  scaleFactor: number
): string[][] {
  const height = data.length;
  const width = data[0]?.length || 0;
  const newHeight = height * scaleFactor;
  const newWidth = width * scaleFactor;

  const scaled = createEmptyPixelData(newWidth, newHeight);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = data[y][x];
      for (let sy = 0; sy < scaleFactor; sy++) {
        for (let sx = 0; sx < scaleFactor; sx++) {
          scaled[y * scaleFactor + sy][x * scaleFactor + sx] = color;
        }
      }
    }
  }

  return scaled;
}

/**
 * Flip pixel data horizontally
 */
export function flipHorizontal(data: string[][]): string[][] {
  return data.map((row) => [...row].reverse());
}

/**
 * Flip pixel data vertically
 */
export function flipVertical(data: string[][]): string[][] {
  return [...data].reverse();
}

/**
 * Rotate pixel data 90 degrees clockwise
 */
export function rotate90(data: string[][]): string[][] {
  const height = data.length;
  const width = data[0]?.length || 0;
  const rotated = createEmptyPixelData(height, width);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      rotated[x][height - 1 - y] = data[y][x];
    }
  }

  return rotated;
}
