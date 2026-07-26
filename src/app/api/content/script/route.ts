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
  const duration = input.duration || 30;
  
  return {
    hooks: [
      { type: 'pattern-interrupt', text: `Okay, ${topic} — let's actually talk about this.`, duration: 3 },
      { type: 'question', text: `So what's the real deal with ${topic}? Let me break it down.`, duration: 3 },
      { type: 'bold-statement', text: `${topic} — here's what most people get wrong.`, duration: 3 },
    ],
    body: [
      { 
        text: `First thing you need to know about ${topic}: it's not as complicated as people make it seem. I've been doing this for a while now and the biggest mistake I see is people overthinking it from the start.`, 
        timestamp: '0:03-0:12', 
        bRoll: 'You talking to camera, maybe pointing at something', 
        overlay: 'The Basics' 
      },
      { 
        text: `Here's what actually works: start small, test it out, see what happens. Don't try to do everything at once — that's how you burn out and give up. Pick one thing from ${topic} and just focus on that.`, 
        timestamp: '0:12-0:22', 
        bRoll: 'Screen recording or demo of the concept', 
        overlay: 'Start Here' 
      },
      { 
        text: `And honestly? The results come faster than you think. Once you get the hang of it, you'll wonder why you didn't start sooner. Trust me on this one.`, 
        timestamp: '0:22-0:30', 
        bRoll: 'Results, before/after, or outcome', 
        overlay: 'The Payoff' 
      },
    ],
    ctas: [
      { type: 'soft', text: `Follow for more ${topic} content like this!` },
      { type: 'hard', text: `Comment "guide" if you want the full breakdown — I'll send it to you.` },
    ],
    wordCount: 120,
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
    const aiPrompt = `You are a real ${input.platform} creator making a video about: "${input.topic}"

Write a ${input.duration || 30}-second script that sounds like YOU'RE ACTUALLY TALKING to the camera.

TONE: ${input.tone || 'casual'} — like you're chatting with a friend, not presenting a TED talk.

CRITICAL RULES:
1. Write EXACTLY how you'd speak — use "like", "honestly", "okay so", "listen", contractions ("it's", "don't", "you're")
2. Each body section = 3-4 sentences minimum. REAL sentences with substance, not vague hype.
3. Include SPECIFIC details: name the game/app/product, mention features, give your honest reaction
4. Hooks must grab attention in 2 seconds — be direct, not generic
5. CTAs should feel natural: "comment below", "save this for later", "follow if you want more"
6. NO corporate speak, NO "dive into", NO "game-changer", NO "transform your"
7. B-roll suggestions should be VERY specific: "show the main menu screen", "zoom into the pixel art character", "scroll through the app store listing"

EXAMPLE of GOOD body text:
"Okay so I've been playing this for like 3 hours straight and I'm obsessed. The pixel art style is 16-bit SNES era and honestly? It looks better than most AAA games. The combat system is turn-based but with this cool timing mechanic where you can dodge attacks if you press the button at the right moment."

Return ONLY JSON:
{
  "hooks": [{"type":"pattern-interrupt","text":"...","duration":3},{"type":"question","text":"...","duration":3},{"type":"bold-statement","text":"...","duration":3}],
  "body": [{"text":"3-4 sentences of REAL content with specific details","timestamp":"0:03-0:12","bRoll":"very specific visual suggestion","overlay":"short punchy text"}],
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
