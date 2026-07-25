# SpectraCanvas

**Your Creative Spectrum, One Canvas**

An AI-powered all-in-one creative suite that transforms ideas into brand identity, pixel art assets, and content scripts — all synced by mood.

Built for **AI Builders Challenge with IBM Bob** by **Team Spectriad** (Three Mind One Solution).

---

## Features

### Brand Identity Generator
- Logo concepts (3 variations: text, icon+text, abstract)
- Color system with primary, secondary, accent, and neutral palettes
- Typography pairing from Google Fonts
- Business card & social media mockups
- Brand guidelines export

### Pixel Art Pipeline
- Character sprite generation (8-bit, 16-bit, modern pixel art styles)
- Multi-pose sprite sheets (idle, walk, run, attack)
- Story-to-comic strip converter
- Color palette editor
- PNG export

### Content Script Studio
- Platform-specific scripts (TikTok, Reels, Shorts, Twitter)
- Storyboard visualization with shot types
- Caption & hashtag generator
- Content calendar planner
- Copy-ready output

### Mood Sync Engine
- Audio mood analysis (BPM, energy, valence)
- 8 mood presets (Chill, Energetic, Dark, Happy, Professional, Retro, Futuristic, Organic)
- Mood-to-design parameter mapping
- Cross-module style consistency

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Animation | Framer Motion |
| AI | IBM Bob (dev), watsonx / Granite (runtime) |
| Audio | Web Audio API |
| Graphics | Canvas API |
| Export | JSZip, jsPDF |

---

## Getting Started

```bash
# Clone repository
git clone https://github.com/wangsaf/spectracanvas.git
cd spectracanvas

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your IBM watsonx credentials (optional)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> Note: The app works without watsonx API keys using built-in fallback generators. Add watsonx credentials for AI-powered generation.

---

## Project Structure

```
spectracanvas/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Landing page
│   │   ├── dashboard/          # Project dashboard
│   │   ├── create/             # Creation studio pages
│   │   │   ├── brand/          # Brand Identity Generator
│   │   │   ├── pixel/          # Pixel Art Pipeline
│   │   │   └── content/        # Content Script Studio
│   │   ├── project/[id]/       # Project view
│   │   ├── demo/               # Interactive demo
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── shared/             # Navbar, Sidebar, etc.
│   │   ├── brand/              # Brand module components
│   │   ├── pixel/              # Pixel art components
│   │   └── content/            # Content components
│   ├── lib/                    # Core logic
│   │   ├── ai/                 # AI integration (watsonx, fallback)
│   │   ├── brand/              # Brand generation engine
│   │   ├── pixel/              # Pixel art engine
│   │   ├── content/            # Content generation engine
│   │   ├── mood/               # Mood analysis engine
│   │   └── export/             # ZIP/PDF export
│   ├── store/                  # Zustand state stores
│   └── hooks/                  # Custom React hooks
├── docs/                       # Documentation
└── public/                     # Static assets
```

---

## How IBM Bob Was Used

IBM Bob was used as the **primary development tool** for this project:

- **Project architecture planning** — Bob helped design the modular architecture with separate engines for Brand, Pixel, Content, and Mood
- **Code generation** — Bob generated React components, API routes, and utility functions
- **TypeScript types** — Bob assisted in creating comprehensive type definitions across all modules
- **Canvas rendering logic** — Bob helped implement the pixel art rendering engine
- **Algorithm design** — Bob assisted with color theory algorithms, mood mapping, and sprite generation
- **Debugging** — Bob helped identify and fix rendering issues in the Canvas API integration

---

## Challenge Theme

**July Challenge: Reimagine Creative Industries with AI**

SpectraCanvas addresses the challenge by:

- **Helping creators work smarter** — All-in-one platform replaces 4+ separate tools
- **Unlocking new creative possibilities** — Mood sync, story-to-comic, automated brand identity
- **Bridging imagination and execution** — Text descriptions become visual assets in seconds
- **AI as creative partner** — Not just a generator, but a consistent creative assistant

---

## Design Philosophy

- **Pixel art aesthetic** — All icons and UI elements follow pixel art design principles
- **No emoji, no icon libraries** — Pure text and ASCII-based interface
- **Dark theme** — Easy on the eyes for long creative sessions
- **Sharp edges** — Square corners, no border-radius, monospace typography
- **Consistent** — Mood sync ensures all outputs share the same visual language

---

## Team Spectriad

**Three Mind One Solution**

---

## License

MIT
