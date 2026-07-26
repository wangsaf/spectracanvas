/**
 * /api/content/generate — Quick Generate (Local/Fallback Only)
 *
 * This is the "fast path" endpoint for content script generation.
 * Unlike /api/content/script which optionally calls watsonx for AI-generated
 * results, this endpoint uses ONLY the local fallback generator.
 *
 * Use this when:
 *  - You want instant results without waiting for an AI API call
 *  - The watsonx service is unavailable or you don't have credentials
 *  - You're in development and want deterministic output
 *
 * Returns the SAME response shape as /api/content/script so callers
 * can swap between the two endpoints without code changes.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { GenerateContentRequest } from '@/lib/types';

// ---------------------------------------------------------------------------
// Local-only helpers (no watsonx / external AI dependency)
// ---------------------------------------------------------------------------

interface ScriptSegment {
  type?: string;
  text: string;
  duration?: number;
  timestamp?: string;
  bRoll?: string;
  overlay?: string;
}

function generateQuickScript(input: GenerateContentRequest) {
  const { topic, tone, duration = 30 } = input;

  const toneAdj: Record<string, string> = {
    casual: 'awesome',
    professional: 'powerful',
    educational: 'incredible',
    hype: 'game-changing',
    inspirational: 'transformative',
  };
  const adj = toneAdj[tone] || 'amazing';

  return {
    hooks: [
      { type: 'pattern-interrupt', text: `Stop scrolling! ${topic} just got ${adj}!`, duration: 3 },
      { type: 'question', text: `Did you know ${topic} could be this easy?`, duration: 3 },
      { type: 'bold-statement', text: `${topic} will never be the same after this.`, duration: 3 },
    ] as ScriptSegment[],
    body: [
      { text: `Here's the thing about ${topic} that nobody talks about.`, timestamp: '0:03-0:08', bRoll: 'Close-up of product/demo', overlay: topic },
      { text: `Most people struggle because they don't have the right tools.`, timestamp: '0:08-0:15', bRoll: 'Problem visualization', overlay: 'The Problem' },
      { text: `That's where AI changes everything. One click, complete creative output.`, timestamp: '0:15-0:22', bRoll: 'Demo of SpectraCanvas', overlay: 'AI-Powered' },
      { text: `Brand identity, pixel art, content scripts — all generated in seconds.`, timestamp: `0:22-0:${Math.min(duration - 5, 28)}`, bRoll: 'Show multiple outputs', overlay: 'All-in-One' },
    ] as ScriptSegment[],
    ctas: [
      { type: 'soft', text: 'Follow for more AI creative tips!' },
      { type: 'hard', text: 'Try SpectraCanvas free — link in bio!' },
    ],
    wordCount: 65,
    estimatedDuration: duration,
    aiGenerated: false, // always false — this is the local-only endpoint
  };
}

function generateQuickCaption(input: GenerateContentRequest) {
  const { topic, platform } = input;
  return {
    main: `Transform your creative process with ${topic}! AI-powered tools that make creation faster, smarter, and more consistent than ever before.`,
    hashtags: [
      '#AI', '#CreativeAI', '#ContentCreation', '#DigitalArt', '#AIArt',
      '#Creative', '#Design', '#Innovation', '#SpectraCanvas', '#FutureOfCreative',
      '#AICreativity', `#${platform}`,
    ],
    variations: [
      `Your creative workflow just got a major upgrade. ${topic} + AI = game over.`,
      `What used to take hours now takes seconds. The future of ${topic} is here.`,
      `Why struggle when AI can do it for you? ${topic} has never been easier.`,
    ],
    emojis: ['[sparkles]', '[art]', '[rocket]', '[lightning]', '[fire]'],
    aiGenerated: false,
  };
}

function generateQuickCalendar(input: GenerateContentRequest) {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
    (day, i) => ({
      day: day.substring(0, 3),
      contentType: ['educational', 'entertaining', 'promotional', 'educational', 'engagement', 'entertaining', 'promotional'][i],
      bestTime: ['10:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 AM', '11:00 AM', '4:00 PM'][i],
      topic: input.topic,
      platform: input.platform,
    }),
  );
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const input: GenerateContentRequest = await request.json();

    if (!input.topic) {
      return NextResponse.json(
        { success: false, error: 'Topic required' },
        { status: 400 },
      );
    }

    const script = generateQuickScript(input);
    const caption = generateQuickCaption(input);
    const calendar = generateQuickCalendar(input);

    return NextResponse.json({ success: true, data: { script, caption, calendar } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
