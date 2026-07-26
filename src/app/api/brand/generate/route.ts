import { NextRequest, NextResponse } from 'next/server';
import type { BrandIdentity, GenerateBrandRequest } from '@/lib/types';
import { generateIndustryPalette } from '@/lib/brand/color-generator';
import { generateTypographySystem } from '@/lib/brand/font-pairing';
import { generateLogoVariations } from '@/lib/brand/logo-generator';
import { generateWithAI, extractJSON } from '@/lib/ai/watsonx';

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

    // Try AI-powered brand personality
    const aiPersonality = await generateAIPersonality(body);

    // Generate brand personality (AI-enhanced or fallback)
    const personality = aiPersonality || generateBrandPersonality(body.values, body.targetAudience);

    // Generate color system
    const colors = generateIndustryPalette(
      body.industry,
      body.values,
      body.mood?.[0]
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
      mockups: [],
    };

    return NextResponse.json({
      success: true,
      data: brandIdentity,
      aiGenerated: !!aiPersonality,
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
 * Use watsonx to generate brand personality insights
 */
async function generateAIPersonality(
  body: GenerateBrandRequest
): Promise<{ tone: string; style: string; keywords: string[]; positioning?: string; tagline?: string } | null> {
  const mood = body.mood?.[0] || 'professional';
  const prompt = `You are a brand strategist. Analyze this brand and return ONLY JSON.

Brand name: ${body.name}
Industry: ${body.industry}
Core values: ${body.values.join(', ')}
Target audience: ${body.targetAudience}
Mood: ${mood}

Return ONLY this JSON (no markdown, no explanation):
{
  "tone": "<brand tone: one word like professional, friendly, bold, elegant, playful, innovative>",
  "style": "<visual style: one word like modern, clean, artistic, corporate, vibrant, minimal>",
  "keywords": ["<5 brand keywords>"],
  "positioning": "<one sentence brand positioning statement>",
  "tagline": "<short catchy tagline, max 8 words>"
}`;

  const result = await generateWithAI(prompt, 400);
  if (!result) return null;

  const parsed = extractJSON(result);
  if (!parsed || !parsed.tone || !parsed.style || !parsed.keywords) return null;

  return {
    tone: String(parsed.tone),
    style: String(parsed.style),
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords.map(String).slice(0, 5) : [String(parsed.keywords)],
    positioning: parsed.positioning ? String(parsed.positioning) : undefined,
    tagline: parsed.tagline ? String(parsed.tagline) : undefined,
  };
}

/**
 * Fallback brand personality generation
 */
function generateBrandPersonality(
  values: string[],
  targetAudience: string
): { tone: string; style: string; keywords: string[] } {
  let tone = 'professional';
  if (values.includes('Playful')) tone = 'friendly';
  if (values.includes('Bold')) tone = 'confident';
  if (values.includes('Elegant')) tone = 'sophisticated';
  if (values.includes('Innovative')) tone = 'forward-thinking';

  let style = 'modern';
  if (values.includes('Minimalist')) style = 'clean';
  if (values.includes('Creative')) style = 'artistic';
  if (values.includes('Professional')) style = 'corporate';
  if (values.includes('Playful')) style = 'vibrant';

  const keywords = [
    ...values.slice(0, 3),
    tone,
    style,
  ];

  return { tone, style, keywords };
}
