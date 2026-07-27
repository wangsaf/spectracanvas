import { NextRequest, NextResponse } from 'next/server';
import type { CharacterSprite, GeneratePixelRequest } from '@/lib/types';
import { generateBasicSprite } from '@/lib/pixel/sprite-generator';
import { generateWithAI, extractJSON } from '@/lib/ai/watsonx';

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

    // Length validation
    if (body.description.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Description exceeds maximum length (500 chars)' },
        { status: 400 }
      );
    }

    // Try AI-enhanced character analysis
    const aiAnalysis = await analyzeCharacterDescription(body.description, body.style);

    // Determine palette - AI suggested or brand colors or default
    let palette = body.palette;
    if (!palette && aiAnalysis?.colors && aiAnalysis.colors.length > 0) {
      palette = aiAnalysis.colors;
    }
    if (!palette && body.brandColors && body.brandColors.length > 0) {
      palette = body.brandColors;
    }

    // Generate sprite with AI-enhanced archetype detection
    const archetype = aiAnalysis?.archetype || undefined;
    const sprite: CharacterSprite = generateBasicSprite(
      body.description,
      body.style,
      body.size,
      palette,
      archetype
    );

    return NextResponse.json({
      success: true,
      data: {
        ...sprite,
        aiAnalysis: aiAnalysis ? {
          archetype: aiAnalysis.archetype,
          personality: aiAnalysis.personality,
          suggestedPoses: aiAnalysis.suggestedPoses,
        } : null,
      },
      aiGenerated: !!aiAnalysis,
    });
  } catch (error) {
    console.error('Sprite generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate sprite' },
      { status: 500 }
    );
  }
}

/**
 * Use watsonx to analyze character description and suggest archetype, colors, poses
 */
async function analyzeCharacterDescription(
  description: string,
  style: string
): Promise<{
  archetype: string;
  personality: string;
  colors: string[];
  suggestedPoses: string[];
} | null> {
  const prompt = `You are a pixel art game designer. Analyze this character description and return ONLY JSON.

Character: ${description}
Art style: ${style}-bit pixel art

Return ONLY this JSON (no markdown, no explanation):
{
  "archetype": "<knight|robot|animal|human|wizard|monster|creature>",
  "personality": "<one sentence character personality>",
  "colors": ["<4 hex colors that fit this character>"],
  "suggestedPoses": ["<4 pose names like idle, attack, walk, jump>"]
}`;

  const result = await generateWithAI(prompt, 200);
  if (!result) return null;

  const parsed = extractJSON(result);
  if (!parsed || !parsed.archetype) return null;

  // Validate colors are hex
  const colors = Array.isArray(parsed.colors)
    ? parsed.colors.filter((c: unknown) => /^#[0-9a-fA-F]{6}$/.test(String(c))).map(String).slice(0, 4)
    : [];

  return {
    archetype: String(parsed.archetype),
    personality: String(parsed.personality || ''),
    colors,
    suggestedPoses: Array.isArray(parsed.suggestedPoses)
      ? parsed.suggestedPoses.map(String).slice(0, 4)
      : ['idle', 'walk', 'run', 'attack'],
  };
}
