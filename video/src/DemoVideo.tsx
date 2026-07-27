import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";

// Screenshots and their timing (in seconds)
const scenes = [
  {
    image: "01-homepage.png",
    startSec: 0,
    endSec: 15,
    title: "SPECTRACANVAS",
    subtitle: "Your Creative Spectrum, One Canvas",
  },
  {
    image: "03-brand-studio.png",
    startSec: 15,
    endSec: 50,
    title: "BRAND STUDIO",
    subtitle: "Generate brand identity with AI",
  },
  {
    image: "04-pixel-studio.png",
    startSec: 50,
    endSec: 90,
    title: "PIXEL STUDIO",
    subtitle: "Create pixel art from text descriptions",
  },
  {
    image: "05-content-studio.png",
    startSec: 90,
    endSec: 135,
    title: "CONTENT STUDIO",
    subtitle: "AI-powered scripts, captions, calendars",
  },
  {
    image: "06-demo.png",
    startSec: 135,
    endSec: 155,
    title: "INSTANT DEMO",
    subtitle: "One-click generation",
  },
  {
    image: "02-dashboard-overview.png",
    startSec: 155,
    endSec: 180,
    title: "ALL IN ONE",
    subtitle: "Brand. Pixel. Content. Synced.",
  },
];

function SceneOverlay({ title, subtitle }: { title: string; subtitle: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(frame, [0, 15], [30, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 80px 80px",
        background:
          "linear-gradient(transparent 50%, rgba(0,0,0,0.8) 100%)",
      }}
    >
      <div
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 72,
          fontWeight: "bold",
          color: "#ffffff",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 28,
          color: "#a1a1aa",
          opacity: subtitleOpacity,
          marginTop: 12,
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
}

function IntroScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  const badgeOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity: badgeOpacity,
          padding: "8px 24px",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 999,
          fontFamily: "'Space Grotesk', monospace",
          fontSize: 16,
          color: "#ffffff",
          letterSpacing: "0.15em",
          marginBottom: 32,
        }}
      >
        AI-POWERED CREATIVE SUITE
      </div>
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: "'Instrument Serif', serif",
          fontSize: 120,
          fontWeight: "bold",
          color: "#ffffff",
          letterSpacing: "-0.02em",
        }}
      >
        SPECTRACANVAS
      </div>
      <div
        style={{
          opacity: subtitleOpacity,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 32,
          color: "#a1a1aa",
          marginTop: 16,
        }}
      >
        Your Creative Spectrum, One Canvas
      </div>
    </AbsoluteFill>
  );
}

function OutroScene() {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const ctaOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: "'Instrument Serif', serif",
          fontSize: 80,
          fontWeight: "bold",
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        Brand. Pixel. Content.
        <br />
        <span style={{ color: "#a1a1aa" }}>All in One Canvas.</span>
      </div>
      <div
        style={{
          opacity: ctaOpacity,
          marginTop: 48,
          padding: "16px 48px",
          background: "#ffffff",
          borderRadius: 8,
          fontFamily: "'Space Grotesk', monospace",
          fontSize: 24,
          fontWeight: "bold",
          color: "#000000",
          letterSpacing: "0.1em",
        }}
      >
        spectracanvas-psi.vercel.app
      </div>
      <div
        style={{
          opacity: ctaOpacity,
          marginTop: 24,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 20,
          color: "#71717a",
        }}
      >
        Team Spectriad — Three Mind One Solution
      </div>
    </AbsoluteFill>
  );
}

export const DemoVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Audio track
  const audioSrc = staticFile("voiceover.mp3");

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      {/* Voiceover audio */}
      <Audio src={audioSrc} />

      {/* Intro scene (0-3 seconds) */}
      <Sequence from={0} durationInFrames={90}>
        <IntroScene />
      </Sequence>

      {/* Scene sequences */}
      {scenes.map((scene, index) => {
        const fromFrame = scene.startSec * fps;
        const durationFrames = (scene.endSec - scene.startSec) * fps;

        return (
          <Sequence key={index} from={fromFrame} durationInFrames={durationFrames}>
            <AbsoluteFill>
              <Img
                src={staticFile(scene.image)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <SceneOverlay title={scene.title} subtitle={scene.subtitle} />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* Outro scene (last 10 seconds) */}
      <Sequence from={(180 - 10) * fps} durationInFrames={10 * fps}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
