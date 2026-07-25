import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    
    if (!input.description) {
      return NextResponse.json({ success: false, error: 'Description required' }, { status: 400 });
    }
    
    const size = input.size || 32;
    const style = input.style || '16bit';
    const desc = input.description.toLowerCase();
    
    // Determine character type from description
    const isKnight = desc.includes('knight') || desc.includes('warrior') || desc.includes('sword');
    const isMage = desc.includes('mage') || desc.includes('wizard') || desc.includes('magic');
    const isArcher = desc.includes('archer') || desc.includes('bow') || desc.includes('ranger');
    const isRobot = desc.includes('robot') || desc.includes('mech') || desc.includes('android');
    
    // Generate character pixels based on type
    const pixels: number[][] = Array.from({ length: size }, () => Array(size).fill(-1));
    const cx = Math.floor(size / 2);
    const headS = Math.floor(size / 4);
    
    // Head (skin color = 1)
    for (let y = 1; y <= headS; y++) {
      for (let x = cx - headS + 1; x < cx + headS; x++) {
        if (x >= 0 && x < size) pixels[y][x] = 1;
      }
    }
    
    // Eyes (black = 0)
    if (size >= 16) {
      const ey = Math.floor(headS * 0.6) + 1;
      if (cx - 2 >= 0) pixels[ey][cx - 2] = 0;
      if (cx + 1 < size) pixels[ey][cx + 1] = 0;
    }
    
    // Hair/helmet (color 4)
    for (let x = cx - headS + 1; x < cx + headS; x++) {
      if (x >= 0 && x < size) pixels[1][x] = 4;
      if (x >= 0 && x < size && size >= 24) pixels[2][x] = 4;
    }
    
    // Body (color 2)
    const bodyTop = headS + 2;
    const bodyBot = Math.floor(size * 0.7);
    const bodyW = Math.floor(size / 4);
    for (let y = bodyTop; y < bodyBot; y++) {
      for (let x = cx - bodyW; x < cx + bodyW; x++) {
        if (x >= 0 && x < size) pixels[y][x] = 2;
      }
    }
    
    // Arms (color 2, extending from body)
    const armLen = Math.floor(size / 5);
    for (let y = bodyTop + 1; y < bodyTop + armLen; y++) {
      const lx = cx - bodyW - 1;
      const rx = cx + bodyW;
      if (lx >= 0 && lx < size) pixels[y][lx] = 2;
      if (rx >= 0 && rx < size) pixels[y][rx] = 2;
    }
    
    // Weapon based on type
    if (isKnight) {
      // Sword on right side (color 5)
      for (let y = bodyTop; y > 0; y--) {
        const sx = cx + bodyW + 1;
        if (sx < size && y < size) pixels[y][sx] = 5;
      }
      // Shield on left (color 6)
      for (let y = bodyTop + 1; y < bodyTop + 3; y++) {
        const sx = cx - bodyW - 2;
        if (sx >= 0 && y < size) pixels[y][sx] = 6;
      }
    } else if (isMage) {
      // Staff (color 5)
      for (let y = bodyTop; y > 0; y--) {
        const sx = cx + bodyW + 1;
        if (sx < size && y < size) pixels[y][sx] = 5;
        if (sx + 1 < size && y < size) pixels[y][sx + 1] = 5;
      }
      // Glow at top (color 6)
      if (cx + bodyW + 1 < size) pixels[0][cx + bodyW + 1] = 6;
    } else if (isArcher) {
      // Bow (color 5)
      for (let y = bodyTop; y < bodyTop + armLen + 2; y++) {
        const bx = cx + bodyW + 2;
        if (bx < size && y < size) pixels[y][bx] = 5;
      }
    } else if (isRobot) {
      // Antenna (color 5)
      if (cx < size) pixels[0][cx] = 5;
      // Visor (color 6)
      for (let x = cx - 2; x <= cx + 1; x++) {
        if (x >= 0 && x < size) pixels[Math.floor(headS * 0.5) + 1][x] = 6;
      }
    }
    
    // Legs (color 3)
    const legW = Math.floor(size / 7);
    for (let y = bodyBot; y < size - 1; y++) {
      for (let x = cx - legW - 1; x < cx - 1; x++) {
        if (x >= 0 && x < size) pixels[y][x] = 3;
      }
      for (let x = cx + 1; x < cx + legW + 1; x++) {
        if (x >= 0 && x < size) pixels[y][x] = 3;
      }
    }
    
    // Boots (color 4)
    for (let x = cx - legW - 2; x < cx; x++) {
      if (x >= 0 && x < size) pixels[size - 1][x] = 4;
    }
    for (let x = cx + 1; x < cx + legW + 2; x++) {
      if (x >= 0 && x < size) pixels[size - 1][x] = 4;
    }
    
    // Choose palette based on style
    const palettes: Record<string, string[]> = {
      '8bit': ['#000000', '#f4cfa0', '#3a6bc5', '#8b4513', '#c0392b', '#888888', '#27ae60'],
      '16bit': ['#000000', '#f4cfa0', '#3498db', '#8b4513', '#e74c3c', '#95a5a6', '#2ecc71', '#f39c12'],
      'modern': ['#000000', '#fdebd0', '#2980b9', '#6e3b12', '#c0392b', '#bdc3c7', '#27ae60', '#f1c40f', '#8e44ad', '#1abc9c'],
    };
    const palette = palettes[style] || palettes['16bit'];
    
    // Generate multiple pose variations
    const idlePixels = pixels.map(r => [...r]);
    
    // Walk frame 1: shift right leg
    const walk1 = pixels.map(r => [...r]);
    for (let y = bodyBot; y < size - 1; y++) {
      const legShift = 1;
      for (let x = cx + 1; x < cx + legW + 1; x++) {
        if (x + legShift < size) {
          walk1[y][x] = -1;
          walk1[y][x + legShift] = 3;
        }
      }
    }
    
    // Walk frame 2: shift left leg
    const walk2 = pixels.map(r => [...r]);
    for (let y = bodyBot; y < size - 1; y++) {
      for (let x = cx - legW - 1; x < cx - 1; x++) {
        if (x - 1 >= 0) {
          walk2[y][x] = -1;
          walk2[y][x - 1] = 3;
        }
      }
    }
    
    // Attack frame: extend weapon arm
    const attack = pixels.map(r => [...r]);
    for (let y = bodyTop + 1; y < bodyTop + 3; y++) {
      const ax = cx + bodyW + 1;
      if (ax < size) attack[y][ax] = 2;
      if (ax + 1 < size) attack[y][ax + 1] = 5;
    }
    
    const poses = [
      { name: 'idle', pixels: idlePixels },
      { name: 'walk-1', pixels: walk1 },
      { name: 'walk-2', pixels: walk2 },
      { name: 'attack', pixels: attack },
    ];
    
    const sprites = poses.map(p => ({
      name: p.name,
      pixels: p.pixels,
      width: size,
      height: size,
      dataUrl: '',
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        description: input.description,
        style,
        size,
        palette,
        sprites,
        characterType: isKnight ? 'knight' : isMage ? 'mage' : isArcher ? 'archer' : isRobot ? 'robot' : 'character',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed' }, { status: 500 });
  }
}
