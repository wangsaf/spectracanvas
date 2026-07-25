'use client';

import { useState } from 'react';
import BrandForm from '@/components/brand/brand-form';
import { useBrandStore } from '@/store/brand-store';

const tabs = ['Colors', 'Fonts', 'Logos', 'Mockups'] as const;
type Tab = (typeof tabs)[number];

export default function BrandStudioPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Colors');
  const [loading, setLoading] = useState(false);
  const { brandData, setBrandData } = useBrandStore();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/brand/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandData),
      });
      const data = await response.json();
      setBrandData(data);
    } catch (error) {
      console.error('Brand generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="font-mono text-xs text-[#555] mb-2">// CREATE / BRAND</div>
          <h1 className="font-mono text-2xl tracking-wider">BRAND STUDIO</h1>
          <p className="font-mono text-sm text-[#888] mt-1">
            Generate a complete brand identity: colors, typography, logos, and mockups.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Brand Form */}
          <div className="border border-[#222] bg-[#111] p-6">
            <div className="font-mono text-xs text-[#555] mb-4">// INPUT</div>
            <BrandForm />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-6 w-full font-mono text-sm px-4 py-3 bg-[#00ff88] text-[#0a0a0a] hover:bg-[#00cc6a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '[ GENERATING... ]' : '[ GENERATE BRAND ]'}
            </button>
          </div>

          {/* Right: Preview Panel */}
          <div className="border border-[#222] bg-[#111]">
            {/* Tabs */}
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

            {/* Tab Content */}
            <div className="p-6 min-h-[400px]">
              {activeTab === 'Colors' && (
                <div>
                  <div className="font-mono text-xs text-[#555] mb-4">// COLOR PALETTE</div>
                  {brandData?.colors ? (
                    <div className="grid grid-cols-5 gap-2">
                      {brandData.colors.map((color: string, i: number) => (
                        <div key={i} className="text-center">
                          <div
                            className="w-full h-16 mb-2"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-mono text-[10px] text-[#888]">
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="font-mono text-xs text-[#333]">
                      No colors generated yet. Fill the form and click GENERATE.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Fonts' && (
                <div>
                  <div className="font-mono text-xs text-[#555] mb-4">// TYPOGRAPHY</div>
                  {brandData?.fonts ? (
                    <div className="space-y-4">
                      {brandData.fonts.map((font: string, i: number) => (
                        <div key={i} className="border border-[#222] p-4">
                          <div className="font-mono text-xs text-[#555] mb-1">{font}</div>
                          <div style={{ fontFamily: font }} className="text-xl text-white">
                            SpectraCanvas Preview
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="font-mono text-xs text-[#333]">
                      No fonts generated yet.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Logos' && (
                <div>
                  <div className="font-mono text-xs text-[#555] mb-4">// LOGO VARIANTS</div>
                  {brandData?.logos ? (
                    <div className="grid grid-cols-2 gap-4">
                      {brandData.logos.map((logo: string, i: number) => (
                        <div key={i} className="border border-[#222] p-4 flex items-center justify-center bg-[#0a0a0a]">
                          <pre className="font-mono text-xs text-[#00ff88]">{logo}</pre>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="font-mono text-xs text-[#333]">
                      No logos generated yet.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Mockups' && (
                <div>
                  <div className="font-mono text-xs text-[#555] mb-4">// MOCKUPS</div>
                  {brandData?.mockups ? (
                    <div className="grid grid-cols-2 gap-4">
                      {brandData.mockups.map((mockup: string, i: number) => (
                        <div key={i} className="border border-[#222] p-4 bg-[#0a0a0a]">
                          <pre className="font-mono text-xs text-white">{mockup}</pre>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="font-mono text-xs text-[#333]">
                      No mockups generated yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
