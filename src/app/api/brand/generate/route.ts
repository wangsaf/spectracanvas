import { NextRequest, NextResponse } from 'next/server';
import type { BrandIdentity, GenerateBrandRequest } from '@/lib/types';
import { generateIndustryPalette } from '@/lib/brand/color-generator';
import { generateTypographySystem } from '@/lib/brand/font-pairing';
import { generateLogoVariations } from '@/lib/brand/logo-generator';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateBrandRequest = await request.json();

    // Validate input
    if (!body.name || !body.industry || !body.values || !body.targetAudience) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Length validation
    if (body.name.length > 100 || body.targetAudience.length > 1000 || body.values.length > 10) {
      return NextResponse.json(
        { success: false, error: 'Input exceeds maximum length' },
        { status: 400 }
      );
    }

    // Sanitize brand name (strip HTML)
    const sanitizedName = body.name.replace(/<[^>]*>/g, '').trim();
    if (!sanitizedName) {
      return NextResponse.json(
        { success: false, error: 'Invalid brand name' },
        { status: 400 }
      );
    }

    // Generate brand personality
    const personality = generateBrandPersonality(body.values, body.targetAudience);

    // Generate color system
    const colors = generateIndustryPalette(
      body.industry,
      body.values,
      body.mood?.[0] // Use first mood if provided
    );

    // Generate typography
    const typography = generateTypographySystem(
      body.industry,
      body.values,
      body.mood?.[0]
    );

    // Generate logo variations
    const logo = generateLogoVariations(body.name, colors);

    // Create brand identity
    const brandIdentity: BrandIdentity = {
      name: sanitizedName,
      industry: body.industry,
      values: body.values,
      targetAudience: body.targetAudience,
      personality,
      logo,
      colors,
      typography,
      mockups: [], // Will be generated client-side
    };

    return NextResponse.json({
      success: true,
      data: brandIdentity,
    });
  } catch (error) {
    console.error('Brand generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate brand identity' },
      { status: 500 }
    );
  }
}

/**
 * Generate brand personality from values and audience
 */
function generateBrandPersonality(
  values: string[],
  targetAudience: string
): { tone: string; style: string; keywords: string[] } {
  // Determine tone based on values
  let tone = 'professional';
  if (values.includes('Playful')) tone = 'friendly';
  if (values.includes('Bold')) tone = 'confident';
  if (values.includes('Elegant')) tone = 'sophisticated';
  if (values.includes('Innovative')) tone = 'forward-thinking';

  // Determine style based on values
  let style = 'modern';
  if (values.includes('Minimalist')) style = 'clean';
  if (values.includes('Creative')) style = 'artistic';
  if (values.includes('Professional')) style = 'corporate';
  if (values.includes('Playful')) style = 'vibrant';

  // Generate keywords
  const keywords = [
    ...values.slice(0, 3),
    tone,
    style,
  ];

  return {
    tone,
    style,
    keywords,
  };
}