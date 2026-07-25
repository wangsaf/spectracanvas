'use client';

import { useState } from 'react';
import { useBrandStore } from '@/store/brand-store';
import { cn } from '@/lib/utils';
import { GOOGLE_FONTS_URL } from '@/lib/constants';

const platforms = ['twitter', 'instagram', 'linkedin'] as const;

type Platform = (typeof platforms)[number];

const platformConfig: Record<Platform, { label: string; width: number; height: number }> = {
  twitter: { label: 'Twitter / X', width: 400, height: 200 },
  instagram: { label: 'Instagram', width: 320, height: 320 },
  linkedin: { label: 'LinkedIn', width: 400, height: 200 },
};

export function MockupSocial() {
  const { result, input } = useBrandStore();
  const [activePlatform, setActivePlatform] = useState<Platform>('twitter');

  if (!result) {
    return (
      <div className="w-full border-2 border-[#222] bg-[#111] p-8">
        <p className="text-sm font-mono text-white/30 text-center uppercase tracking-wider">
          Generate a brand to preview social mockups
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
  const initial = brandName.charAt(0).toUpperCase();

  const generateTwitterHtml = () => `
    <link href="${GOOGLE_FONTS_URL}?family=${formattedHeading}:wght@400;600;700&family=${formattedBody}:wght@400;500&display=swap" rel="stylesheet">
    <div style="
      width: 400px;
      background-color: ${bgColor};
      border: 2px solid ${neutral};
      font-family: '${bodyFont}', sans-serif;
      box-sizing: border-box;
    ">
      <div style="
        width: 100%;
        height: 120px;
        background: linear-gradient(135deg, ${primary} 0%, ${accent} 100%);
        position: relative;
      "></div>
      <div style="padding: 0 16px 16px; position: relative;">
        <div style="
          width: 64px;
          height: 64px;
          background-color: ${primary};
          border: 3px solid ${bgColor};
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: -32px;
          left: 16px;
        ">
          <span style="
            font-family: '${headingFont}', sans-serif;
            font-size: 28px;
            font-weight: 700;
            color: ${bgColor};
          ">${initial}</span>
        </div>
        <div style="padding-top: 40px;">
          <p style="
            font-family: '${headingFont}', sans-serif;
            font-size: 16px;
            font-weight: 700;
            color: ${primary};
            margin: 0;
          ">${brandName}</p>
          <p style="
            font-size: 12px;
            color: ${secondary};
            margin: 2px 0 0 0;
          ">@${brandName.toLowerCase().replace(/ /g, '')}</p>
          <p style="
            font-size: 12px;
            color: ${secondary};
            margin: 8px 0 0 0;
            line-height: 1.5;
          ">Building the future of creative tools. ${input.values.length > 0 ? input.values.join(' | ') : 'Innovation | Design'}</p>
          <div style="display: flex; gap: 16px; margin-top: 10px;">
            <span style="font-size: 11px; color: ${secondary};">
              <span style="font-weight: 600; color: ${primary};">1,234</span> Following
            </span>
            <span style="font-size: 11px; color: ${secondary};">
              <span style="font-weight: 600; color: ${primary};">5.6K</span> Followers
            </span>
          </div>
        </div>
      </div>
    </div>
  `;

  const generateInstagramHtml = () => `
    <link href="${GOOGLE_FONTS_URL}?family=${formattedHeading}:wght@400;600;700&family=${formattedBody}:wght@400;500&display=swap" rel="stylesheet">
    <div style="
      width: 320px;
      background-color: ${bgColor};
      border: 2px solid ${neutral};
      font-family: '${bodyFont}', sans-serif;
      box-sizing: border-box;
      padding: 20px;
    ">
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
        <div style="
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, ${primary}, ${accent});
          padding: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        ">
          <div style="
            width: 100%;
            height: 100%;
            background-color: ${bgColor};
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              font-family: '${headingFont}', sans-serif;
              font-size: 30px;
              font-weight: 700;
              color: ${primary};
            ">${initial}</span>
          </div>
        </div>
        <div style="display: flex; gap: 12px;">
          <div style="text-align: center;">
            <p style="font-size: 14px; font-weight: 700; color: ${primary}; margin: 0;">128</p>
            <p style="font-size: 10px; color: ${secondary}; margin: 0;">Posts</p>
          </div>
          <div style="text-align: center;">
            <p style="font-size: 14px; font-weight: 700; color: ${primary}; margin: 0;">12.4K</p>
            <p style="font-size: 10px; color: ${secondary}; margin: 0;">Followers</p>
          </div>
          <div style="text-align: center;">
            <p style="font-size: 14px; font-weight: 700; color: ${primary}; margin: 0;">892</p>
            <p style="font-size: 10px; color: ${secondary}; margin: 0;">Following</p>
          </div>
        </div>
      </div>
      <p style="
        font-family: '${headingFont}', sans-serif;
        font-size: 14px;
        font-weight: 600;
        color: ${primary};
        margin: 0 0 2px 0;
      ">${brandName}</p>
      <p style="
        font-size: 10px;
        color: ${accent};
        margin: 0 0 4px 0;
        text-transform: uppercase;
        letter-spacing: 1px;
      ">${input.industry || 'Creative'}</p>
      <p style="
        font-size: 11px;
        color: ${secondary};
        margin: 0;
        line-height: 1.5;
      ">Crafting visual identities that resonate.${input.audience ? ' For ' + input.audience + '.' : ''}</p>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 16px;">
        ${[primary, accent, secondary, neutral, primary, accent, secondary, primary, accent].map((color, i) => `
          <div style="
            aspect-ratio: 1;
            background-color: ${color};
            opacity: ${0.5 + (i % 3) * 0.2};
          "></div>
        `).join('')}
      </div>
    </div>
  `;

  const generateLinkedinHtml = () => `
    <link href="${GOOGLE_FONTS_URL}?family=${formattedHeading}:wght@400;600;700&family=${formattedBody}:wght@400;500&display=swap" rel="stylesheet">
    <div style="
      width: 400px;
      background-color: ${bgColor};
      border: 2px solid ${neutral};
      font-family: '${bodyFont}', sans-serif;
      box-sizing: border-box;
    ">
      <div style="
        width: 100%;
        height: 100px;
        background: linear-gradient(90deg, ${primary} 0%, ${neutral} 50%, ${accent} 100%);
      "></div>
      <div style="padding: 0 20px 20px; position: relative;">
        <div style="
          width: 80px;
          height: 80px;
          background-color: ${primary};
          border: 3px solid ${bgColor};
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: -40px;
          left: 20px;
        ">
          <span style="
            font-family: '${headingFont}', sans-serif;
            font-size: 36px;
            font-weight: 700;
            color: ${bgColor};
          ">${initial}</span>
        </div>
        <div style="padding-top: 48px;">
          <p style="
            font-family: '${headingFont}', sans-serif;
            font-size: 18px;
            font-weight: 700;
            color: ${primary};
            margin: 0;
          ">${brandName}</p>
          <p style="
            font-size: 12px;
            color: ${secondary};
            margin: 2px 0 0 0;
          ">Professional Brand Identity Solutions</p>
          <p style="
            font-size: 11px;
            color: ${secondary};
            margin: 2px 0 0 0;
          ">San Francisco, CA</p>
          <p style="
            font-size: 11px;
            color: ${accent};
            margin: 6px 0 0 0;
          ">500+ connections</p>
          <div style="
            display: inline-block;
            margin-top: 10px;
            padding: 6px 16px;
            background-color: ${primary};
            color: ${bgColor};
            font-size: 11px;
            font-weight: 600;
            font-family: '${headingFont}', sans-serif;
          ">+ Follow</div>
        </div>
      </div>
    </div>
  `;

  const htmlGenerators: Record<Platform, () => string> = {
    twitter: generateTwitterHtml,
    instagram: generateInstagramHtml,
    linkedin: generateLinkedinHtml,
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-white/70">
        Social Media Mockups
      </h3>

      {/* Platform tabs */}
      <div className="flex gap-0">
        {platforms.map((p) => {
          const cfg = platformConfig[p];
          return (
            <button
              key={p}
              type="button"
              onClick={() => setActivePlatform(p)}
              className={cn(
                'px-4 py-2 text-xs font-mono uppercase tracking-wide',
                'border-2 transition-colors rounded-none -ml-px first:ml-0',
                activePlatform === p
                  ? 'bg-white text-black border-white z-10'
                  : 'bg-[#111] text-white/50 border-[#222] hover:text-white/70'
              )}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Preview */}
      <div className="border-2 border-[#222] bg-[#111] p-6 flex items-center justify-center overflow-x-auto">
        <div dangerouslySetInnerHTML={{ __html: htmlGenerators[activePlatform]() }} />
      </div>
    </div>
  );
}
