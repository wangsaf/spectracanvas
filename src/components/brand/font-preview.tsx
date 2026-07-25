'use client';

import { useBrandStore } from '@/store/brand-store';
import { GOOGLE_FONTS_URL } from '@/lib/constants';

const sampleText = {
  heading: 'The Quick Brown Fox',
  subheading: 'Jumps Over The Lazy Dog',
  body: 'SpectraCanvas generates cohesive brand identities tailored to your vision. Every element is crafted to work together harmoniously, from typography to color to logo design.',
  caption: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789',
};

function FontLoadLink({ font }: { font: string }) {
  const formatted = font.replace(/ /g, '+');
  return (
    <link
      href={`${GOOGLE_FONTS_URL}?family=${formatted}:wght@400;600;700&display=swap`}
      rel="stylesheet"
    />
  );
}

export function FontPreview() {
  const { result, input } = useBrandStore();

  if (!result) {
    return (
      <div className="w-full border-2 border-[#222] bg-[#111] p-8">
        <p className="text-sm font-mono text-white/30 text-center uppercase tracking-wider">
          Generate a brand to preview fonts
        </p>
      </div>
    );
  }

  const { heading, body, category } = result.fonts;
  const brandName = input.name || 'Brand';
  const primaryColor = result.palette[0]?.hex || '#ffffff';

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Load Google Fonts */}
      <FontLoadLink font={heading} />
      <FontLoadLink font={body} />

      <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-white/70">
        Font Pairing
      </h3>

      {/* Font info */}
      <div className="flex gap-4">
        <div className="flex-1 border-2 border-[#222] bg-[#111] p-4">
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
            Heading Font
          </p>
          <p
            className="text-lg font-semibold text-white"
            style={{ fontFamily: `'${heading}', sans-serif` }}
          >
            {heading}
          </p>
          <p className="text-[10px] font-mono text-white/30 mt-1 uppercase">
            Style: {category}
          </p>
        </div>
        <div className="flex-1 border-2 border-[#222] bg-[#111] p-4">
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
            Body Font
          </p>
          <p
            className="text-lg text-white"
            style={{ fontFamily: `'${body}', sans-serif` }}
          >
            {body}
          </p>
          <p className="text-[10px] font-mono text-white/30 mt-1 uppercase">
            Style: {category}
          </p>
        </div>
      </div>

      {/* Sample rendering */}
      <div className="border-2 border-[#222] bg-[#0a0a0a] p-6 flex flex-col gap-4">
        <p
          className="text-3xl font-bold"
          style={{
            fontFamily: `'${heading}', sans-serif`,
            color: primaryColor,
          }}
        >
          {sampleText.heading}
        </p>
        <p
          className="text-xl font-semibold text-white/80"
          style={{ fontFamily: `'${heading}', sans-serif` }}
        >
          {sampleText.subheading}
        </p>
        <p
          className="text-base leading-relaxed text-white/60"
          style={{ fontFamily: `'${body}', sans-serif` }}
        >
          {sampleText.body}
        </p>
        <p
          className="text-xs tracking-[0.2em] text-white/30"
          style={{ fontFamily: `'${body}', sans-serif` }}
        >
          {sampleText.caption}
        </p>
      </div>

      {/* Brand name in heading font */}
      <div className="border-2 border-[#222] bg-[#111] p-6 text-center">
        <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-3">
          Your Brand in Heading Font
        </p>
        <p
          className="text-5xl font-bold"
          style={{
            fontFamily: `'${heading}', sans-serif`,
            color: primaryColor,
          }}
        >
          {brandName}
        </p>
      </div>
    </div>
  );
}
