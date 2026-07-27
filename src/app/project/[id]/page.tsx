'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProjectStore } from '@/lib/store/project-store';
import { Button } from '@/components/ui/button';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { brand, sprites, scripts, selectedMoods } = useProjectStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If no project data exists, redirect to dashboard
  useEffect(() => {
    if (mounted && !brand && sprites.length === 0 && scripts.length === 0) {
      router.replace('/dashboard');
    }
  }, [mounted, brand, sprites, scripts, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#ffffff] p-4 md:p-8" style={{ fontFamily: "'DM Sans', 'Space Grotesk', system-ui, sans-serif" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-[#71717a] animate-pulse">Loading project...</p>
        </div>
      </div>
    );
  }

  const projectId = params?.id as string;

  return (
    <div className="min-h-screen bg-[#000000] text-[#ffffff] p-4 md:p-8" style={{ fontFamily: "'DM Sans', 'Space Grotesk', system-ui, sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="text-xs text-[#71717a] hover:text-[#ffffff] transition-colors">
          ← BACK TO DASHBOARD
        </Link>

        <h1 className="text-2xl font-bold tracking-wider mt-4" style={{ fontFamily: "'Instrument Serif', serif" }}>PROJECT VIEW</h1>
        <p className="text-xs text-[#71717a] mt-1">ID: {projectId}</p>

        {/* Brand Info */}
        {brand && (
          <div className="mt-6 p-4 rounded border border-[#27272a] bg-[#0a0a0a]">
            <h2 className="text-sm font-bold tracking-wider mb-2">BRAND</h2>
            <p className="text-sm text-[#ffffff]">{brand.name}</p>
            <p className="text-xs text-[#71717a] mt-1">{brand.industry} · {brand.personality.tone}</p>
            <div className="flex gap-2 mt-3">
              {Object.values(brand.colors.primary).map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded border border-[#27272a]"
                  style={{ backgroundColor: color as string }}
                  title={color as string}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active Moods */}
        {selectedMoods && selectedMoods.length > 0 && (
          <div className="mt-4 p-4 rounded border border-[#27272a] bg-[#0a0a0a]">
            <h2 className="text-sm font-bold tracking-wider mb-2">MOOD</h2>
            <div className="flex gap-2 flex-wrap">
              {selectedMoods.map((mood) => (
                <span
                  key={mood}
                  className="px-2 py-1 text-xs rounded border border-[#27272a] text-[#a1a1aa] uppercase"
                >
                  {mood}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sprites */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold tracking-wider">
              SPRITES ({sprites.length})
            </h2>
            <Button variant="outline" onClick={() => router.push('/dashboard?tab=pixel')}>
              [ + NEW SPRITE ]
            </Button>
          </div>
          {sprites.length === 0 ? (
            <div className="p-6 rounded border border-[#27272a] bg-[#0a0a0a] text-center">
              <p className="text-xs text-[#71717a]">No sprites yet. Create one in Pixel Studio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sprites.map((sprite, i) => (
                <div
                  key={i}
                  className="p-4 rounded border border-[#27272a] bg-[#0a0a0a]"
                >
                  <div className="aspect-square bg-[#000000] rounded mb-2 flex items-center justify-center overflow-hidden">
                    {sprite.imageData ? (
                      <img src={sprite.imageData} alt={sprite.description} className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
                    ) : (
                      <span className="text-xs text-[#52525b]">SPRITE {i + 1}</span>
                    )}
                  </div>
                  <p className="text-xs text-[#a1a1aa] truncate">{sprite.description}</p>
                  <p className="text-[10px] text-[#52525b] mt-1">{sprite.style} · {sprite.size}x{sprite.size}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scripts */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold tracking-wider">
              SCRIPTS ({scripts.length})
            </h2>
            <Button variant="outline" onClick={() => router.push('/dashboard?tab=content')}>
              [ + NEW SCRIPT ]
            </Button>
          </div>
          {scripts.length === 0 ? (
            <div className="p-6 rounded border border-[#27272a] bg-[#0a0a0a] text-center">
              <p className="text-xs text-[#71717a]">No scripts yet. Create one in Content Studio.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scripts.map((script, i) => (
                <div
                  key={i}
                  className="p-4 rounded border border-[#27272a] bg-[#0a0a0a]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">{script.topic}</p>
                    <span className="text-xs text-[#71717a] uppercase">{script.platform}</span>
                  </div>
                  <p className="text-xs text-[#a1a1aa] mt-1">{script.tone} · {script.duration}s</p>
                  {script.hook && script.hook.length > 0 && (
                    <p className="text-xs text-[#ffffff] mt-2 truncate">&ldquo;{script.hook[0]}&rdquo;</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
