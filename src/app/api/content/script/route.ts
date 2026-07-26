import { NextRequest, NextResponse } from 'next/server';
import { generateWithAI, extractJSON } from '@/lib/ai/watsonx';


function generateFallbackScript(input: any) {
  const topic = input.topic;
  const platform = input.platform;
  const tone = input.tone;
  const duration = input.duration || 30;
  
  const toneAdj: Record<string, string> = {
    casual: 'awesome', professional: 'powerful', educational: 'incredible',
    hype: 'game-changing', inspirational: 'transformative',
  };
  const adj = toneAdj[tone] || 'amazing';
  
  return {
    hooks: [
      { type: 'pattern-interrupt', text: `Stop scrolling! ${topic} just got ${adj}!`, duration: 3 },
      { type: 'question', text: `Did you know ${topic} could be this easy?`, duration: 3 },
      { type: 'bold-statement', text: `${topic} will never be the same after this.`, duration: 3 },
    ],
    body: [
      { text: `Here's the thing about ${topic} that nobody talks about.`, timestamp: '0:03-0:08', bRoll: 'Close-up of product/demo', overlay: topic },
      { text: `Most people struggle because they don't have the right tools.`, timestamp: '0:08-0:15', bRoll: 'Problem visualization', overlay: 'The Problem' },
      { text: `That's where AI changes everything. One click, complete creative output.`, timestamp: '0:15-0:22', bRoll: 'Demo of SpectraCanvas', overlay: 'AI-Powered' },
      { text: `Brand identity, pixel art, content scripts — all generated in seconds.`, timestamp: `0:22-0:${Math.min(duration - 5, 28)}`, bRoll: 'Show multiple outputs', overlay: 'All-in-One' },
    ],
    ctas: [
      { type: 'soft', text: 'Follow for more AI creative tips!' },
      { type: 'hard', text: 'Try SpectraCanvas free — link in bio!' },
    ],
    wordCount: 65,
    estimatedDuration: duration,
    aiGenerated: false,
  };
}

function generateFallbackCaption(input: any) {
  const topic = input.topic;
  return {
    main: `Transform your creative process with ${topic}! AI-powered tools that make creation faster, smarter, and more consistent than ever before.`,
    hashtags: ['#AI', '#CreativeAI', '#ContentCreation', '#DigitalArt', '#AIArt', '#Creative', '#Design', '#Innovation', '#SpectraCanvas', '#FutureOfCreative', '#AICreativity', `#${input.industry || 'Tech'}`],
    variations: [
      `Your creative workflow just got a major upgrade. ${topic} + AI = game over.`,
      `What used to take hours now takes seconds. The future of ${topic} is here.`,
      `Why struggle when AI can do it for you? ${topic} has never been easier.`,
    ],
    emojis: ['[sparkles]', '[art]', '[rocket]', '[lightning]', '[fire]'],
    aiGenerated: false,
  };
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    if (!input.topic) {
      return NextResponse.json({ success: false, error: 'Topic required' }, { status: 400 });
    }

    // Try AI generation
    const aiPrompt = `Write a ${input.platform} video script about: ${input.topic}
Tone: ${input.tone}
Duration: ${input.duration || 30} seconds
Audience: ${input.audience || 'general'}

Return ONLY JSON:
{
  "hooks": [{"type":"pattern-interrupt","text":"...","duration":3},{"type":"question","text":"...","duration":3},{"type":"bold-statement","text":"...","duration":3}],
  "body": [{"text":"...","timestamp":"0:03-0:10","overlay":"..."}],
  "ctas": [{"type":"soft","text":"..."},{"type":"hard","text":"..."}]
}`;

    const aiResult = await generateWithAI(aiPrompt);
    
    let script = generateFallbackScript(input);
    if (aiResult) {
      const aiData = extractJSON(aiResult);
      if (aiData && aiData.hooks && aiData.body && aiData.ctas) {
        script = { ...script, ...aiData, aiGenerated: true };
      }
    }

    const caption = generateFallbackCaption(input);

    const calendar = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => ({
      day: day.substring(0, 3),
      contentType: ['educational', 'entertaining', 'promotional', 'educational', 'engagement', 'entertaining', 'promotional'][i],
      bestTime: ['10:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 AM', '11:00 AM', '4:00 PM'][i],
      topic: input.topic,
      platform: input.platform,
    }));

    return NextResponse.json({ success: true, data: { script, caption, calendar } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed' }, { status: 500 });
  }
}
