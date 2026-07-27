'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { LogoVariations } from '@/lib/types';
import { downloadSVG, svgToPNG } from '@/lib/brand/logo-generator';

/**
 * Sanitize SVG string — strip script tags, event handlers, and dangerous protocols
 */
function sanitizeSVG(svg: string): string {
  if (!svg) return '';
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:[^,]*base64/gi, '');
}

interface LogoPreviewProps {
  logo: LogoVariations;
  brandName: string;
}

export function LogoPreview({ logo, brandName }: LogoPreviewProps) {
  const [selectedVariation, setSelectedVariation] = useState<'textOnly' | 'iconText' | 'abstract'>('textOnly');
  const [isDownloading, setIsDownloading] = useState(false);

  const variations = [
    { key: 'textOnly' as const, label: 'TEXT ONLY', description: 'Typography-based logo' },
    { key: 'iconText' as const, label: 'ICON + TEXT', description: 'Icon with brand name' },
    { key: 'abstract' as const, label: 'ABSTRACT', description: 'Geometric mark' },
  ];

  const handleDownloadSVG = () => {
    const svg = logo[selectedVariation];
    const filename = `${brandName.toLowerCase().replace(/\s+/g, '-')}-logo-${selectedVariation}.svg`;
    downloadSVG(svg, filename);
  };

  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    try {
      const svg = logo[selectedVariation];
      const pngDataURL = await svgToPNG(svg, 800, 240);
      
      const link = document.createElement('a');
      link.href = pngDataURL;
      link.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-logo-${selectedVariation}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PNG:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>LOGO CONCEPTS</CardTitle>
        <CardDescription>
          Three variations designed for your brand
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Variation Selector */}
        <div className="flex gap-2">
          {variations.map((variation) => (
            <button
              key={variation.key}
              onClick={() => setSelectedVariation(variation.key)}
              className={`flex-1 px-4 py-3 border transition-colors ${
                selectedVariation === variation.key
                  ? 'bg-[#ffffff] text-white border-[#ffffff] rounded'
                  : 'bg-transparent text-[#a1a1aa] border rounded border-[#27272a] hover:border-[#ffffff] hover:text-[#ffffff]'
              }`}
            >
              <div className="text-xs font-bold tracking-wider">{variation.label}</div>
              <div className="text-[10px] mt-1 opacity-70">{variation.description}</div>
            </button>
          ))}
        </div>

        {/* Logo Display */}
        <div className="border rounded border-[#27272a] bg-[#000000] p-8 flex items-center justify-center min-h-[200px]">
          <div
            dangerouslySetInnerHTML={{ __html: sanitizeSVG(logo[selectedVariation]) }}
            className="w-full max-w-md"
          />
        </div>

        {/* Mockup Previews */}
        <div className="grid grid-cols-3 gap-4">
          {/* Small Size */}
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wider text-[#a1a1aa]">SMALL (200x60)</p>
            <div className="border rounded border-[#27272a] bg-white p-4 flex items-center justify-center h-20">
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeSVG(logo[selectedVariation]) }}
                className="w-full"
                style={{ transform: 'scale(0.5)' }}
              />
            </div>
          </div>

          {/* Medium Size */}
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wider text-[#a1a1aa]">MEDIUM (400x120)</p>
            <div className="border rounded border-[#27272a] bg-white p-4 flex items-center justify-center h-20">
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeSVG(logo[selectedVariation]) }}
                className="w-full"
                style={{ transform: 'scale(0.5)' }}
              />
            </div>
          </div>

          {/* Large Size */}
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wider text-[#a1a1aa]">LARGE (800x240)</p>
            <div className="border rounded border-[#27272a] bg-white p-4 flex items-center justify-center h-20">
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeSVG(logo[selectedVariation]) }}
                className="w-full"
                style={{ transform: 'scale(0.5)' }}
              />
            </div>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex gap-2 pt-4 border-t border-[#27272a]">
          <Button
            variant="outline"
            onClick={handleDownloadSVG}
            className="flex-1"
          >
            [ DOWNLOAD SVG ]
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadPNG}
            disabled={isDownloading}
            className="flex-1"
          >
            {isDownloading ? '[ GENERATING... ]' : '[ DOWNLOAD PNG ]'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}