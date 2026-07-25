'use client';

import { useBrandStore } from '@/store/brand-store';
import { GOOGLE_FONTS_URL } from '@/lib/constants';

export function MockupCard() {
  const { result, input } = useBrandStore();

  if (!result) {
    return (
      <div className="w-full border-2 border-[#222] bg-[#111] p-8">
        <p className="text-sm font-mono text-white/30 text-center uppercase tracking-wider">
          Generate a brand to preview business card
        </p>
      </div>
    );
  }

  const { palette, fonts } = result;
  const primary = palette[0]?.hex || '#ffffff';
  const secondary = palette[1]?.hex || '#888888';
  const accent = palette[2]?.hex || '#cccccc';
  const neutral = palette[3]?.hex || '#333333';
  const bgColor = palette[4]?.hex || '#0a0a0a';
  const brandName = input.name || 'Brand';

  const headingFont = fonts.heading;
  const bodyFont = fonts.body;
  const formattedHeading = headingFont.replace(/ /g, '+');
  const formattedBody = bodyFont.replace(/ /g, '+');

  // Card aspect ratio: standard business card 3.5 x 2 inches
  const cardHtml = `
    <link href="${GOOGLE_FONTS_URL}?family=${formattedHeading}:wght@400;600;700&family=${formattedBody}:wght@400;500&display=swap" rel="stylesheet">
    <div style="
      width: 420px;
      height: 240px;
      background-color: ${bgColor};
      border: 2px solid ${neutral};
      font-family: '${bodyFont}', sans-serif;
      color: ${primary};
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 24px;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
    ">
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 6px;
        height: 100%;
        background-color: ${accent};
      "></div>
      <div>
        <p style="
          font-family: '${headingFont}', sans-serif;
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 2px 0;
          color: ${primary};
          letter-spacing: 1px;
        ">${brandName}</p>
        <p style="
          font-size: 10px;
          color: ${secondary};
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 2px;
        ">Creative Studio</p>
      </div>
      <div>
        <p style="
          font-family: '${headingFont}', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: ${primary};
          margin: 0 0 6px 0;
        ">Alex Designer</p>
        <p style="
          font-size: 10px;
          color: ${secondary};
          margin: 0 0 2px 0;
        ">Lead Creative Director</p>
        <p style="
          font-size: 10px;
          color: ${secondary};
          margin: 0 0 2px 0;
        ">alex@${brandName.toLowerCase().replace(/ /g, '')}.com</p>
        <p style="
          font-size: 10px;
          color: ${secondary};
          margin: 0;
        ">+1 (555) 000-0000</p>
      </div>
    </div>
  `;

  const cardBackHtml = `
    <link href="${GOOGLE_FONTS_URL}?family=${formattedHeading}:wght@400;600;700&family=${formattedBody}:wght@400;500&display=swap" rel="stylesheet">
    <div style="
      width: 420px;
      height: 240px;
      background-color: ${primary};
      border: 2px solid ${neutral};
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      position: relative;
    ">
      <div style="text-align: center;">
        <p style="
          font-family: '${headingFont}', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: ${bgColor};
          margin: 0 0 4px 0;
          letter-spacing: 2px;
        ">${brandName}</p>
        <p style="
          font-family: '${bodyFont}', sans-serif;
          font-size: 9px;
          color: ${bgColor};
          margin: 0;
          opacity: 0.6;
          text-transform: uppercase;
          letter-spacing: 3px;
        ">${brandName.toLowerCase().replace(/ /g, '')}.com</p>
      </div>
    </div>
  `;

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-white/70">
        Business Card Mockup
      </h3>

      {/* Front */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-mono text-white/40 uppercase tracking-wider">
          Front
        </p>
        <div className="border-2 border-[#222] bg-[#111] p-6 flex items-center justify-center overflow-x-auto">
          <div dangerouslySetInnerHTML={{ __html: cardHtml }} />
        </div>
      </div>

      {/* Back */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-mono text-white/40 uppercase tracking-wider">
          Back
        </p>
        <div className="border-2 border-[#222] bg-[#111] p-6 flex items-center justify-center overflow-x-auto">
          <div dangerouslySetInnerHTML={{ __html: cardBackHtml }} />
        </div>
      </div>
    </div>
  );
}
