'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ColorSystem } from '@/lib/types';
import { getContrastColor } from '@/lib/utils';

interface ColorPaletteProps {
  colors: ColorSystem;
}

export function ColorPalette({ colors }: ColorPaletteProps) {
  const renderColorShades = (
    label: string,
    shades: { base: string; lighter: string; light: string; dark: string; darker: string }
  ) => (
    <div className="space-y-2">
      <p className="text-xs font-bold tracking-wider text-[#a1a1aa]">{label}</p>
      <div className="grid grid-cols-5 gap-1">
        {Object.entries(shades).map(([shade, color]) => (
          <div key={shade} className="space-y-1">
            <div
              className="h-16 border rounded border-[#27272a] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => {
                navigator.clipboard.writeText(color);
              }}
              title={`Click to copy ${color}`}
            >
              <span
                className="text-[10px] font-bold"
                style={{ color: getContrastColor(color) }}
              >
                {shade.toUpperCase()}
              </span>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-mono text-[#71717a]">{color}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>COLOR SYSTEM</CardTitle>
        <CardDescription>
          Click any color to copy HEX code to clipboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderColorShades('PRIMARY', colors.primary)}
        {renderColorShades('SECONDARY', colors.secondary)}
        {renderColorShades('ACCENT', colors.accent)}
        {renderColorShades('NEUTRAL', colors.neutral)}

        {/* Color Codes Export */}
        <div className="pt-4 border-t border-[#27272a]">
          <p className="text-xs font-bold tracking-wider text-[#a1a1aa] mb-2">
            QUICK REFERENCE
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-[#71717a]">Primary:</span>{' '}
              <span className="text-[#fafafa]">{colors.primary.base}</span>
            </div>
            <div>
              <span className="text-[#71717a]">Secondary:</span>{' '}
              <span className="text-[#fafafa]">{colors.secondary.base}</span>
            </div>
            <div>
              <span className="text-[#71717a]">Accent:</span>{' '}
              <span className="text-[#fafafa]">{colors.accent.base}</span>
            </div>
            <div>
              <span className="text-[#71717a]">Neutral:</span>{' '}
              <span className="text-[#fafafa]">{colors.neutral.base}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}