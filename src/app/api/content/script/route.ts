import { NextRequest, NextResponse } from 'next/server';
import { generateWithAI, extractJSON } from '@/lib/ai/watsonx';


function stripEmoji(text: string): string {
  return text
    .replace(/[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, '')
    .replace(/[\u2600-\u27BF]/g, '')
    .replace(/[\uFE00-\uFE0F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

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
      { text: `So here's the deal with ${topic} — most people overcomplicate it.`, timestamp: '0:03-0:08', bRoll: 'Close-up shot, eye contact with camera', overlay: topic },
      { text: `I used to struggle with this too, until I figured out one simple approach.`, timestamp: '0:08-0:15', bRoll: 'B-roll of the process or concept', overlay: 'The Key Insight' },
      { text: `Once you understand ${topic} at its core, everything clicks into place.`, timestamp: '0:15-0:22', bRoll: 'Examples or demonstrations', overlay: 'How It Works' },
      { text: `And the results speak for themselves — let me show you what I mean.`, timestamp: `0:22-0:${Math.min(duration - 5, 28)}`, bRoll: 'Results or outcomes', overlay: 'The Results' },
    ],
    ctas: [
      { type: 'soft', text: `Follow for more ${topic} tips and breakdowns!` },
      { type: 'hard', text: `Drop a comment if you want the full guide — link in bio!` },
    ],
    wordCount: 65,
    estimatedDuration: duration,
    aiGenerated: false,
  };
}

function generateFallbackCaption(input: any) {
  const topic = input.topic;
  const industry = input.industry || 'Tech';
  return {
    main: `Breaking down ${topic} so you can actually use it. No fluff, just the good stuff.`,
    hashtags: [`#${topic.replace(/\s+/g, '')}`, `#${industry}`, '#ContentCreator', '#TipsAndTricks', '#LearnOnSocial', '#CreatorLife', '#HowTo', '#Tutorial', '#Explainer', '#Tips'],
    variations: [
      `${topic} demystified — here's what you actually need to know.`,
      `I wish someone had explained ${topic} to me like this sooner.`,
      `The real talk about ${topic} that nobody else is giving you.`,
    ],
    emojis: ['[point_up]', '[eyes]', '[bulb]', '[memo]', '[check_mark]'],
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
      const aiData = extractJSON(aiResult) as Record<string, unknown> | null;
      if (aiData && Array.isArray(aiData.hooks) && Array.isArray(aiData.body) && Array.isArray(aiData.ctas)) {
        const hooks = (aiData.hooks as Array<Record<string, unknown>>).map((h) => ({
          type: String(h.type || ''),
          text: stripEmoji(String(h.text || '')),
          duration: Number(h.duration) || 3,
        }));
        const body = (aiData.body as Array<Record<string, unknown>>).map((b) => ({
          text: stripEmoji(String(b.text || '')),
          timestamp: String(b.timestamp || ''),
          bRoll: String(b.bRoll || ''),
          overlay: b.overlay ? stripEmoji(String(b.overlay)) : '',
        }));
        const ctas = (aiData.ctas as Array<Record<string, unknown>>).map((c) => ({
          type: String(c.type || ''),
          text: stripEmoji(String(c.text || '')),
        }));
        script = { ...script, hooks, body, ctas, aiGenerated: true };
      }
    }

    // Try AI caption generation
    let caption;
    const captionPrompt = `Write a social media caption for a ${input.platform} post about: ${input.topic}
Tone: ${input.tone || 'casual'}
Audience: ${input.audience || 'general'}
Industry: ${input.industry || 'general'}

Return ONLY JSON with these fields:
{
  "main": "the full caption text (no emoji)",
  "hashtags": ["#relevant", "#hashtags", "#about", "#the", "#topic"],
  "variations": ["shorter variation 1", "shorter variation 2", "shorter variation 3"]
}

Rules:
- Write about the TOPIC, not about AI tools or creation process
- Hashtags should be relevant to the specific topic
- Do NOT include emoji in the text
- Keep it natural and engaging
- Include 8-12 hashtags`;

    const captionAI = await generateWithAI(captionPrompt);
    if (captionAI) {
      const captionData = extractJSON(captionAI) as Record<string, unknown> | null;
      if (captionData && typeof captionData.main === 'string') {
        caption = {
          main: stripEmoji(String(captionData.main)),
          hashtags: Array.isArray(captionData.hashtags) ? captionData.hashtags.map((h: any) => stripEmoji(String(h))) : [],
          variations: Array.isArray(captionData.variations) ? captionData.variations.map((v: any) => stripEmoji(String(v))) : [],
          emojis: ['[point_up]', '[eyes]', '[bulb]', '[memo]', '[check_mark]'],
          aiGenerated: true,
        };
      } else {
        caption = generateFallbackCaption(input);
      }
    } else {
      caption = generateFallbackCaption(input);
    }

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
