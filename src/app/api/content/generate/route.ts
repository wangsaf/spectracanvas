import { NextRequest, NextResponse } from 'next/server';
import type { ContentScript, GenerateContentRequest } from '@/lib/types';
import { generateContentScript, optimizeForPlatform } from '@/lib/content/script-generator';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateContentRequest = await request.json();

    // Validate input
    if (!body.topic || !body.platform || !body.tone || !body.duration) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Length validation
    if (body.topic.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Topic exceeds maximum length (200 chars)' },
        { status: 400 }
      );
    }

    // Generate script
    let script: ContentScript = generateContentScript(
      body.topic,
      body.platform,
      body.tone,
      body.duration,
      body.brandContext
    );

    // Optimize for platform
    script = optimizeForPlatform(script, body.platform);

    return NextResponse.json({
      success: true,
      data: script,
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate content script' },
      { status: 500 }
    );
  }
}
