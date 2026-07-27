# SpectraCanvas

**Your Creative Spectrum, One Canvas**

An AI-powered all-in-one creative suite that transforms ideas into brand identity, pixel art assets, and content scripts — all synced by mood.

Built for **AI Builders Challenge with IBM Bob** by **Team Spectriad** (Three Mind One Solution).

Live: https://spectracanvas-psi.vercel.app

---

## Features

### Brand Identity Generator
- Logo concepts (3 variations: text-only, icon+text, abstract)
- Color system with primary/secondary/accent/neutral palettes
- Typography pairing (heading + body fonts from Google Fonts)
- Brand personality (tone, style, keywords, tagline, positioning)
- JSON + ZIP export

### Pixel Art Pipeline
- Character sprite generation (8-bit, 16-bit, modern pixel)
- AI archetype detection (knight, wizard, robot, animal, etc.)
- Multi-pose suggestions (idle, walk, attack, defend)
- Sprite sheet composer with animation preview
- PNG export with transparent background

### Content Script Studio
- Platform-specific scripts (TikTok, Instagram Reels, YouTube Shorts, Twitter/X)
- 3 hook variations (pattern-interrupt, question, bold statement)
- Body with timestamp markers + B-roll suggestions
- CTA variations (soft + hard)
- Caption generator with hashtags
- Content calendar (7-day posting schedule)

### Mood Sync Engine
- 8 mood keywords (Chill, Energetic, Dark, Happy, Professional, Retro, Futuristic, Organic)
- Cross-module style consistency

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Animation | Framer Motion |
| AI | IBM watsonx.ai (Granite 3-8B Instruct) |
| Export | JSZip, file-saver |
| Deployment | Vercel |

---

## Getting Started

```bash
# Clone
git clone https://github.com/wangsaf/spectracanvas.git
cd spectracanvas

# Install
npm install

# Environment
cp .env.example .env.local
# Add your IBM watsonx credentials:
# WATSONX_API_KEY=your_api_key
# WATSONX_PROJECT_ID=your_project_id
# WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Run
npm run dev
```

Open http://localhost:3000

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/brand/generate` | Generate brand identity |
| POST | `/api/pixel/generate` | Generate pixel art sprite |
| POST | `/api/content/script` | Generate content script (AI) |
| POST | `/api/content/generate` | Generate content (local fallback) |

All endpoints return `{ success: boolean, data: {...}, aiGenerated: boolean }`.

When watsonx is unavailable, fallback generators produce deterministic output — the app works without AI credentials.

---

## Project Structure

```
spectracanvas/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── dashboard/page.tsx    # Main dashboard (4 tabs)
│   │   ├── demo/page.tsx         # Interactive demo
│   │   ├── project/[id]/page.tsx # Project view
│   │   └── api/                  # API routes
│   ├── components/
│   │   ├── brand/                # Brand module components
│   │   ├── pixel/                # Pixel module components
│   │   ├── content/              # Content module components
│   │   ├── shared/               # Navbar, loading spinner
│   │   └── ui/                   # Button, Input, Card, etc.
│   └── lib/
│       ├── ai/watsonx.ts         # IBM watsonx integration
│       ├── brand/                # Color, font, logo generators
│       ├── pixel/                # Sprite, pose generators
│       ├── content/              # Script generators
│       └── store/                # Zustand state management
├── public/
└── package.json
```

---

## How IBM watsonx Was Used

IBM watsonx.ai (Granite 3-8B Instruct) is the core AI engine for all generation tasks:

1. **Brand Generation** — AI analyzes brand name, industry, values, and audience to generate personality insights (tone, style, tagline, positioning)

2. **Pixel Art** — AI interprets character descriptions to detect archetype, personality, color palette, and suggested poses

3. **Content Scripts** — AI generates platform-specific video scripts with hooks, body sections, CTAs, captions, and hashtags

The AI integration uses IBM's text generation API with IAM token authentication. All prompts are carefully engineered to return structured JSON for reliable parsing.

---

## Challenge Theme

**July 2026**: Reimagine Creative Industries with AI

SpectraCanvas addresses this by:
- Unifying brand, visual, and content creation in one platform
- Using AI to maintain cross-module consistency
- Enabling creators to go from idea to complete creative package in minutes
- Providing both AI-powered and local fallback generation

---

## Team Spectriad

Three Mind One Solution

---

## License

MIT
