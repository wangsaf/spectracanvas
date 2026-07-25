# SpectraCanvas 🎨

**AI-Powered Creative Suite for Brand Identity, Pixel Art, and Content Creation**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![IBM watsonx](https://img.shields.io/badge/IBM-watsonx-blue)](https://www.ibm.com/watsonx)

> **IBM AI Builders Challenge Submission** - July 2026

SpectraCanvas is a comprehensive creative suite that combines AI-powered brand identity generation, pixel art creation, and content script writing into one unified platform. Built for creators, marketers, and indie game developers who need professional assets fast.

## 🌟 Features

### 🎨 Brand Identity Generator
- **AI-Powered Color Palettes**: Industry-specific color schemes with WCAG accessibility validation
- **Smart Typography Pairing**: 18 Google Fonts with intelligent pairing algorithms
- **Logo Variations**: Generate 3 logo styles (Text Only, Icon+Text, Abstract) in SVG format
- **Mood-Based Adjustments**: 8 mood keywords influence color and design choices
- **Export Ready**: Download colors, fonts, and logos for immediate use

### 👾 Pixel Art Pipeline
- **Character Sprite Generation**: Create pixel art characters from text descriptions
- **Multiple Styles**: 8-bit, 16-bit, and modern pixel art aesthetics
- **Flexible Sizing**: 16x16 to 64x64 pixel sprites
- **Brand Color Integration**: Use your brand palette in sprite generation
- **Animation Support**: Generate poses (idle, walk, run, attack, jump)
- **Sprite Sheet Export**: Combine animations into game-ready sprite sheets with JSON metadata

### 📝 Content Script Studio
- **Platform-Optimized Scripts**: TikTok, Instagram Reels, YouTube Shorts, Twitter
- **Hook Variations**: 3 different opening hooks per script (pattern interrupt, question, bold statement)
- **Timestamped Sections**: Body content with B-roll suggestions and text overlays
- **CTA Options**: Multiple call-to-action variations
- **Tone Control**: Casual, professional, educational, energetic, inspirational
- **Word Count Tracking**: Automatic script length calculation

### 🎵 Mood Sync Engine
- **8 Mood Keywords**: Chill, energetic, dark, happy, professional, retro, futuristic, organic
- **Visual Mapping**: Colors, filters, transitions, and pacing suggestions
- **Cross-Module Sync**: Moods influence brand colors, sprite palettes, and content recommendations
- **Content Optimization**: Get music, visual style, and text recommendations based on mood

### 🔗 Unified Project Management
- **Centralized Dashboard**: View all assets in one place
- **Progress Tracking**: Visual completion percentage
- **Cross-Module Integration**: Brand colors flow into pixel art and content
- **Auto-Save**: Project state persists in browser storage
- **Export System**: Download everything as ZIP (brand assets, sprites, scripts)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/spectracanvas.git
cd spectracanvas

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your IBM watsonx credentials

# Start development server
npm run dev
```

Visit `http://localhost:3000` to start creating!

### Environment Variables

Create a `.env.local` file:

```env
# IBM watsonx API Configuration
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

## 📖 Usage Guide

### 1. Create Brand Identity

1. Navigate to **Brand Studio** (`/create/brand`)
2. Enter your brand name and description
3. Select industry and mood
4. Click **Generate Brand**
5. Review colors, typography, and logos
6. Click **Save & Continue**

### 2. Generate Pixel Art

1. Go to **Pixel Studio** (`/create/pixel`)
2. Describe your character (e.g., "brave knight with sword")
3. Choose pixel art style (8-bit, 16-bit, modern)
4. Select sprite size (32x32 recommended)
5. Use brand colors or style defaults
6. Click **Generate Character**
7. Adjust zoom and download PNG
8. Click **Save Sprite**

### 3. Create Content Scripts

1. Visit **Content Studio** (`/create/content`)
2. Enter your content topic/idea
3. Select platform (TikTok, Instagram, etc.)
4. Choose tone and duration
5. Click **Generate Content Script**
6. Select 1-3 mood keywords
7. Review hooks, body sections, and CTAs
8. Get mood-based recommendations
9. Copy or download script

### 4. Manage Your Project

1. Open **Dashboard** (`/dashboard`)
2. View all saved assets
3. Edit project name
4. Export as JSON or ZIP
5. Navigate between studios

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand with persistence
- **Animation**: Framer Motion
- **Canvas**: HTML5 Canvas API
- **Export**: JSZip, jsPDF, FileSaver.js
- **Audio Analysis**: Meyda (for future mood detection)

### Project Structure

```
spectracanvas/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── api/               # API routes
│   │   │   ├── brand/         # Brand generation
│   │   │   ├── pixel/         # Sprite generation
│   │   │   └── content/       # Script generation
│   │   ├── create/            # Studio pages
│   │   │   ├── brand/         # Brand Studio
│   │   │   ├── pixel/         # Pixel Studio
│   │   │   └── content/       # Content Studio
│   │   ├── dashboard/         # Project dashboard
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── brand/             # Brand components
│   │   ├── pixel/             # Pixel art components
│   │   ├── content/           # Content components
│   │   ├── shared/            # Shared components
│   │   └── ui/                # UI primitives
│   ├── lib/                   # Core logic
│   │   ├── brand/             # Brand generation
│   │   ├── pixel/             # Pixel art engine
│   │   ├── content/           # Script generation
│   │   ├── mood/              # Mood mapping
│   │   ├── store/             # State management
│   │   ├── types.ts           # TypeScript types
│   │   ├── constants.ts       # App constants
│   │   └── utils.ts           # Utilities
│   └── styles/                # Global styles
└── public/                    # Static assets
```

## 🎯 Key Algorithms

### Color Generation
- Industry-specific base palettes
- Mood-based HSL adjustments
- WCAG contrast validation
- Complementary color calculation

### Font Pairing
- Weight compatibility scoring
- Style harmony analysis
- Readability optimization
- Google Fonts integration

### Sprite Generation
- Template-based character creation
- 5 character archetypes (knight, robot, animal, human, generic)
- Palette constraint application
- Pixel-perfect rendering

### Script Generation
- Hook pattern templates (3 types)
- Platform-specific optimization
- Timestamp calculation
- Word count tracking

### Mood Mapping
- 8 mood keywords with visual parameters
- Color palette generation
- Filter and transition suggestions
- Pacing recommendations

## 🔮 Future Enhancements

- [ ] IBM watsonx.ai integration for advanced AI generation
- [ ] Real-time audio analysis for mood detection
- [ ] Collaborative project sharing
- [ ] Animation timeline editor
- [ ] Storyboard visualizer
- [ ] Caption and hashtag generator
- [ ] Multi-language support
- [ ] Cloud project storage
- [ ] Template marketplace
- [ ] Video export with mood sync

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **IBM watsonx**: AI platform powering intelligent generation
- **Next.js Team**: Amazing React framework
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Beautiful component library
- **Google Fonts**: Typography resources

## 📧 Contact

**Project Link**: [https://github.com/yourusername/spectracanvas](https://github.com/yourusername/spectracanvas)

**Demo Video**: [Coming Soon]

---

Built with ❤️ for the IBM AI Builders Challenge 2026