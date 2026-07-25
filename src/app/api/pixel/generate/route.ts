import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    
    if (!input.description) {
      return NextResponse.json({ success: false, error: 'Description required' }, { status: 400 });
    }
    
    const size = input.size || 32;
    const style = input.style || '16bit';
    
    const pixels: number[][] = Array.from({ length: size }, () => Array(size).fill(-1));
    const headSize = Math.floor(size / 4);
    const centerX = Math.floor(size / 2);
    
    for (let y = 0; y < headSize; y++) {
      for (let x = centerX - headSize + 1; x < centerX + headSize; x++) {
        if (x >= 0 && x < size) pixels[y][x] = 1;
      }
    }
    
    if (size >= 16) {
      const eyeY = Math.floor(headSize / 2);
      if (centerX - 2 >= 0) pixels[eyeY][centerX - 2] = 0;
      if (centerX + 1 < size) pixels[eyeY][centerX + 1] = 0;
    }
    
    const bodyStart = headSize + 1;
    const bodyEnd = size - headSize;
    for (let y = bodyStart; y < bodyEnd; y++) {
      for (let x = centerX - Math.floor(size / 4); x < centerX + Math.floor(size / 4); x++) {
        if (x >= 0 && x < size) pixels[y][x] = 2;
      }
    }
    
    for (let y = bodyEnd; y < size; y++) {
      const legW = Math.floor(size / 6);
      for (let x = centerX - legW - 1; x < centerX - 1; x++) {
        if (x >= 0 && x < size) pixels[y][x] = 3;
      }
      for (let x = centerX + 1; x < centerX + legW + 1; x++) {
        if (x >= 0 && x < size) pixels[y][x] = 3;
      }
    }
    
    const palette = style === '8bit' 
      ? ['#000000', '#fcfcfc', '#f83800', '#4488fc']
      : ['#000000', '#fcfcfc', '#f83800', '#4488fc', '#7c3aed', '#10b981', '#f59e0b', '#6366f1'];
    
    const poses = ['idle', 'walk-1', 'walk-2', 'attack-1', 'attack-2'];
    const sprites = poses.map(name => ({
      name,
      pixels: pixels.map(row => [...row]),
      width: size,
      height: size,
      dataUrl: '',
    }));
    
    return NextResponse.json({
      success: true,
      data: { description: input.description, style, size, palette, sprites },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
