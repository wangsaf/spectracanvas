import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    
    if (!input.topic) {
      return NextResponse.json({ success: false, error: 'Topic required' }, { status: 400 });
    }
    
    const script = {
      hooks: [
        { type: 'pattern-interrupt', text: `Stop scrolling! This ${input.topic} changes everything.`, duration: 3 },
        { type: 'question', text: `What if ${input.topic} could be this easy?`, duration: 3 },
        { type: 'bold-statement', text: `${input.topic} will never be the same.`, duration: 3 },
      ],
      body: [
        { text: `Let me show you what ${input.topic} looks like with AI.`, timestamp: '0:03-0:10', overlay: 'AI-Powered' },
        { text: `With just a few clicks, transform your vision into reality.`, timestamp: '0:10-0:20', overlay: 'Simple & Fast' },
        { text: `Everything stays consistent with your brand identity.`, timestamp: '0:20-0:25', overlay: 'Brand Consistent' },
      ],
      ctas: [
        { type: 'soft', text: 'Follow for more creative AI tips!' },
        { type: 'hard', text: 'Try SpectraCanvas free - link in bio!' },
      ],
      wordCount: 80,
      estimatedDuration: input.duration || 30,
    };
    
    const caption = {
      main: `Transform your creative process with ${input.topic}! AI-powered tools that make creation faster and smarter.`,
      hashtags: ['#AI', '#CreativeAI', '#ContentCreation', '#DigitalArt', '#AIArt', '#Creative', '#Design', '#Innovation', '#SpectraCanvas'],
      variations: [
        `Your creative workflow just got an upgrade. ${input.topic} meets AI.`,
        `From idea to execution in minutes. The future is here.`,
      ],
      emojis: ['[sparkles]', '[art]', '[rocket]'],
    };
    
    const calendar = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
      day,
      contentType: ['educational', 'entertaining', 'promotional', 'educational', 'engagement', 'entertaining', 'promotional'][i],
      bestTime: ['10:00', '12:00', '15:00', '18:00', '09:00', '11:00', '16:00'][i],
    }));
    
    return NextResponse.json({
      success: true,
      data: { script, caption, calendar },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
