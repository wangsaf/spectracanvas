import { NextRequest, NextResponse } from 'next/server';

// Get watsonx IAM token
async function getWatsonxToken(): Promise<string | null> {
  const apiKey = process.env.WATSONX_API_KEY;
  if (!apiKey) return null;
  
  try {
    const resp = await fetch('https://iam.cloud.ibm.com/identity/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`,
    });
    const data = await resp.json();
    return data.access_token || null;
  } catch {
    return null;
  }
}

// Generate with watsonx
async function generateWithAI(prompt: string): Promise<string | null> {
  const token = await getWatsonxToken();
  const projectId = process.env.WATSONX_PROJECT_ID;
  if (!token || !projectId) return null;
  
  try {
    const resp = await fetch('https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2024-05-01', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        input: prompt,
        model_id: 'ibm/granite-3-8b-instruct',
        parameters: { max_new_tokens: 500, decoding_method: 'greedy' },
        project_id: projectId,
      }),
    });
    const data = await resp.json();
    return data.results?.[0]?.generated_text || null;
  } catch {
    return null;
  }
}

// Fallback brand generation
function generateFallback(input: any) {
  const hueMap: Record<string, number> = {
    technology: 220, gaming: 270, music: 330, fashion: 350,
    'food & beverage': 30, 'food': 30, education: 200, 'health & wellness': 150,
    'health': 150, 'art & design': 280, 'art': 280, retail: 10, other: 220,
  };
  
  const baseHue = hueMap[input.industry?.toLowerCase()] || hueMap[input.industry] || 220;
  const saturation = input.values?.includes('Bold') ? 80 : input.values?.includes('Minimalist') ? 40 : 65;
  const brightness = input.values?.includes('Dark') ? 35 : 55;
  
  const hsl = (h: number, s: number, l: number) => {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };
  
  const palette = [
    hsl(baseHue, saturation, brightness),
    hsl((baseHue + 120) % 360, saturation - 10, brightness + 10),
    hsl((baseHue + 45) % 360, saturation + 10, brightness + 15),
    '#888888',
    '#111111',
  ];
  
  const fontMap: Record<string, string[]> = {
    creative: ['Poppins', 'Inter', 'DM Sans'],
    modern: ['Inter', 'Space Grotesk', 'DM Sans'],
    bold: ['Montserrat', 'Oswald', 'Bebas Neue'],
    playful: ['Poppins', 'Nunito', 'Quicksand'],
    professional: ['Playfair Display', 'Source Sans Pro', 'Lato'],
    minimalist: ['Inter', 'Space Grotesk', 'IBM Plex Sans'],
    futuristic: ['Orbitron', 'Exo 2', 'Rajdhani'],
    innovative: ['Sora', 'Inter', 'Space Grotesk'],
  };
  
  const primaryValue = input.values?.[0]?.toLowerCase() || 'modern';
  const fonts = fontMap[primaryValue] || fontMap.modern;
  
  const name = input.name || 'Brand';
  const logos = [
    `  ${name.toUpperCase()}  `,
    `[${name.charAt(0).toUpperCase()}] ${name}`,
    `  * ${name} *  `,
  ];
  
  return {
    name,
    palette,
    fonts,
    logos,
    personality: `${name} is a ${(input.values || []).join(', ').toLowerCase()} brand in the ${input.industry || 'technology'} space, designed for ${input.audience || 'everyone'}. The brand emphasizes ${primaryValue} sensibility with a focus on quality and innovation.`,
    industry: input.industry,
    mood: input.mood,
    aiGenerated: false,
  };
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    
    if (!input.name) {
      return NextResponse.json({ success: false, error: 'Name required' }, { status: 400 });
    }
    
    // Try AI generation first
    const aiPrompt = `You are a brand identity expert. Generate a brand profile for:
Name: ${input.name}
Industry: ${input.industry}
Values: ${(input.values || []).join(', ')}
Audience: ${input.audience}
Mood: ${input.mood}

Return ONLY a JSON object with these fields:
- personality: 2-sentence brand personality
- primaryColor: hex color for primary
- secondaryColor: hex color for secondary
- accentColor: hex color for accent
- headingFont: Google Font name
- bodyFont: Google Font name
- logoStyle: brief logo description`;

    const aiResult = await generateWithAI(aiPrompt);
    
    if (aiResult) {
      try {
        // Try to parse JSON from AI response
        const jsonMatch = aiResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const aiData = JSON.parse(jsonMatch[0]);
          const fallback = generateFallback(input);
          
          return NextResponse.json({
            success: true,
            data: {
              ...fallback,
              palette: [
                aiData.primaryColor || fallback.palette[0],
                aiData.secondaryColor || fallback.palette[1],
                aiData.accentColor || fallback.palette[2],
                '#888888',
                '#111111',
              ],
              fonts: [aiData.headingFont || fallback.fonts[0], aiData.bodyFont || fallback.fonts[1], fallback.fonts[2]],
              personality: aiData.personality || fallback.personality,
              logoStyle: aiData.logoStyle || '',
              aiGenerated: true,
            },
          });
        }
      } catch {}
    }
    
    // Fallback to procedural generation
    const result = generateFallback(input);
    return NextResponse.json({ success: true, data: result });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed' }, { status: 500 });
  }
}
