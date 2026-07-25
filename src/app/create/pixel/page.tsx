'use client';

import { useState } from 'react';
import PixelForm from '@/components/pixel/pixel-form';
import SpriteCanvas from '@/components/pixel/sprite-canvas';
import AnimationPreview from '@/components/pixel/animation-preview';
import SpriteSheet from '@/components/pixel/sprite-sheet';
import { usePixelStore } from '@/store/pixel-store';

const tabs = ['Sprite', 'Animation', 'Sheet'] as const;
type Tab = (typeof tabs)[number];

export default function PixelStudioPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Sprite');
  const [loading, setLoading] = useState(false);
  const { input, pixelData, setPixelData } = usePixelStore();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pixel/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const result = await response.json();
      if (result.success) {
        setPixelData(result.data);
      }
    } catch (error) {
      console.error('Pixel generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="font-mono text-xs text-[#555] mb-2">// CREATE / PIXEL</div>
          <h1 className="font-mono text-2xl tracking-wider">PIXEL STUDIO</h1>
          <p className="font-mono text-sm text-[#888] mt-1">
            Generate pixel art sprites, animations, and sprite sheets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-[#222] bg-[#111] p-6">
            <div className="font-mono text-xs text-[#555] mb-4">// INPUT</div>
            <PixelForm />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-6 w-full font-mono text-sm px-4 py-3 bg-[#00ff88] text-[#0a0a0a] hover:bg-[#00cc6a] transition-colors disabled:opacity-50"
            >
              {loading ? '[ GENERATING... ]' : '[ GENERATE SPRITE ]'}
            </button>
          </div>

          <div className="border border-[#222] bg-[#111]">
            <div className="flex border-b border-[#222]">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-mono text-xs px-4 py-3 tracking-wider transition-colors ${
                    activeTab === tab
                      ? 'text-[#00ff88] border-b-2 border-[#00ff88]'
                      : 'text-[#555] hover:text-white'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="p-6 min-h-[400px]">
              {activeTab === 'Sprite' && (
                <div>
                  <div className="font-mono text-xs text-[#555] mb-4">// SPRITE PREVIEW</div>
                  <SpriteCanvas frame={pixelData?.sprites?.[0] || null} />
                </div>
              )}

              {activeTab === 'Animation' && (
                <div>
                  <div className="font-mono text-xs text-[#555] mb-4">// ANIMATION PREVIEW</div>
                  <AnimationPreview frames={pixelData?.sprites || []} />
                </div>
              )}

              {activeTab === 'Sheet' && (
                <div>
                  <div className="font-mono text-xs text-[#555] mb-4">// SPRITE SHEET</div>
                  <SpriteSheet frames={pixelData?.sprites || []} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
