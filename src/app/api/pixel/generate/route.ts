import { NextRequest, NextResponse } from 'next/server';
import type { CharacterSprite, GeneratePixelRequest } from '@/lib/types';
import { generateBasicSprite } from '@/lib/pixel/sprite-generator';

export async function POST(request: NextRequest) {
  try {
    const body: GeneratePixelRequest = await request.json();

    // Validate input
    if (!body.description || !body.style || !body.size) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine palette
    let palette = body.palette;
    if (!palette && body.brandColors && body.brandColors.length > 0) {
      // Use brand colors if available
      palette = body.brandColors;
    }

    // Generate sprite
    const sprite: CharacterSprite = generateBasicSprite(
      body.description,
      body.style,
      body.size,
      palette
    );

    return NextResponse.json({
      success: true,
      data: sprite,
    });
  } catch (error) {
    console.error('Sprite generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate sprite' },
      { status: 500 }
    );
  }
}