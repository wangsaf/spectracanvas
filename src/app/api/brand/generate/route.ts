import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    
    if (!input.name) {
      return NextResponse.json({ success: false, error: 'Name required' }, { status: 400 });
    }
    
    const hueMap: Record<string, number> = {
      technology: 220, gaming: 270, music: 330, fashion: 350,
      'food & beverage': 30, education: 200, 'health & wellness': 150,
      'art & design': 280, other: 220,
    };
    
    const baseHue = hueMap[input.industry?.toLowerCase()] || 220;
    const palette = [
      `hsl(${baseHue}, 70%, 50%)`,
      `hsl(${(baseHue + 120) % 360}, 60%, 55%)`,
      `hsl(${(baseHue + 45) % 360}, 80%, 60%)`,
      '#888888',
      '#0a0a0a',
    ];
    
    const fonts = ['Inter', 'Roboto', 'Open Sans', 'Poppins'];
    const logos = [
      `  ${input.name.toUpperCase()}  `,
      `[${input.name.charAt(0).toUpperCase()}] ${input.name}`,
      `  *  ${input.name}  *  `,
    ];
    
    return NextResponse.json({
      success: true,
      data: {
        name: input.name,
        palette,
        fonts,
        logos,
        personality: `${input.name} is a ${(input.values || []).join(', ').toLowerCase()} brand.`,
        industry: input.industry,
        mood: input.mood,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
