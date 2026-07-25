'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BrandStudioPage() {
  const [activeTab, setActiveTab] = useState('Colors');
  const [loading, setLoading] = useState(false);
  const [brandData, setBrandData] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    industry: 'technology',
    values: [] as string[],
    audience: '',
    mood: 'professional',
  });

  const allValues = ['Creative', 'Modern', 'Bold', 'Minimalist', 'Playful', 'Professional', 'Innovative', 'Futuristic'];
  const allIndustries = ['Technology', 'Gaming', 'Music', 'Fashion', 'Food & Beverage', 'Education', 'Health & Wellness', 'Art & Design'];
  const allMoods = ['Professional', 'Playful', 'Chill', 'Energetic', 'Dark', 'Futuristic', 'Organic', 'Retro'];

  const toggleValue = (v: string) => {
    setForm(f => ({
      ...f,
      values: f.values.includes(v) ? f.values.filter(x => x !== v) : [...f.values, v],
    }));
  };

  const handleGenerate = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/brand/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) setBrandData(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const tabs = ['Colors', 'Fonts', 'Logos', 'Mockups'];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-xs text-neutral-500 hover:text-white">← BACK</Link>
          <div className="text-xs text-neutral-600 mt-1">// CREATE / BRAND</div>
          <h1 className="text-2xl tracking-wider mt-2">BRAND STUDIO</h1>
          <p className="text-sm text-neutral-400 mt-1">Generate brand identity: colors, fonts, logos.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="border border-[#222] bg-[#111] p-6">
            <div className="text-xs text-neutral-600 mb-4">// INPUT</div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">BRAND NAME</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-[#222] p-2 text-sm text-white"
                  placeholder="My Brand"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">INDUSTRY</label>
                <select
                  value={form.industry}
                  onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-[#222] p-2 text-sm text-white"
                >
                  {allIndustries.map(i => <option key={i} value={i.toLowerCase()}>{i}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">VALUES (pick 2-4)</label>
                <div className="flex flex-wrap gap-2">
                  {allValues.map(v => (
                    <button
                      key={v}
                      onClick={() => toggleValue(v)}
                      className={"px-3 py-1 text-xs border " + (form.values.includes(v) ? "bg-white text-black border-white" : "border-[#333] text-neutral-400 hover:border-white")}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">TARGET AUDIENCE</label>
                <input
                  value={form.audience}
                  onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-[#222] p-2 text-sm text-white"
                  placeholder="Indie game developers, creators..."
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">MOOD</label>
                <div className="flex flex-wrap gap-2">
                  {allMoods.map(m => (
                    <button
                      key={m}
                      onClick={() => setForm(f => ({ ...f, mood: m.toLowerCase() }))}
                      className={"px-3 py-1 text-xs border " + (form.mood === m.toLowerCase() ? "bg-white text-black border-white" : "border-[#333] text-neutral-400 hover:border-white")}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !form.name.trim()}
              className="mt-6 w-full py-3 bg-[#00ff88] text-black font-bold text-sm tracking-wider hover:bg-[#00cc6a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '[ GENERATING... ]' : '[ GENERATE BRAND ]'}
            </button>
          </div>

          {/* Preview */}
          <div className="border border-[#222] bg-[#111]">
            <div className="flex border-b border-[#222]">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={"px-4 py-3 text-xs tracking-wider " + (activeTab === tab ? "text-[#00ff88] border-b-2 border-[#00ff88]" : "text-neutral-500 hover:text-white")}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="p-6 min-h-[400px]">
              {!brandData ? (
                <div className="text-center py-20">
                  <div className="text-xs text-neutral-600">No brand generated yet</div>
                  <div className="text-xs text-neutral-700 mt-1">Fill the form and click GENERATE</div>
                </div>
              ) : (
                <>
                  {activeTab === 'Colors' && (
                    <div>
                      <div className="text-xs text-neutral-600 mb-4">// COLOR PALETTE</div>
                      <div className="grid grid-cols-5 gap-2">
                        {(brandData.palette || []).map((color: string, i: number) => (
                          <div key={i} className="text-center">
                            <div className="w-full h-16 border border-[#222]" style={{ backgroundColor: color }} />
                            <div className="text-[10px] text-neutral-500 mt-1">{color}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'Fonts' && (
                    <div>
                      <div className="text-xs text-neutral-600 mb-4">// TYPOGRAPHY</div>
                      {(brandData.fonts || []).map((font: string, i: number) => (
                        <div key={i} className="border border-[#222] p-4 mb-2">
                          <div className="text-xs text-neutral-500 mb-1">{font}</div>
                          <div style={{ fontFamily: font }} className="text-xl text-white">
                            SpectraCanvas Preview
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'Logos' && (
                    <div>
                      <div className="text-xs text-neutral-600 mb-4">// LOGO VARIANTS</div>
                      {(brandData.logos || []).map((logo: string, i: number) => (
                        <div key={i} className="border border-[#222] p-4 mb-2 bg-[#0a0a0a]">
                          <pre className="text-[#00ff88] text-xs">{logo}</pre>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'Mockups' && (
                    <div>
                      <div className="text-xs text-neutral-600 mb-4">// MOCKUPS</div>
                      <div className="border border-[#222] p-6 bg-[#0a0a0a]">
                        <div className="text-lg font-bold" style={{ fontFamily: (brandData.fonts || ['sans-serif'])[0] }}>
                          {brandData.name || 'Brand'}
                        </div>
                        <div className="text-xs text-neutral-400 mt-2">Business Card Preview</div>
                        <div className="mt-4 flex gap-4">
                          <div className="w-8 h-8" style={{ backgroundColor: (brandData.palette || ['#888'])[0] }} />
                          <div className="w-8 h-8" style={{ backgroundColor: (brandData.palette || ['#888'])[1] || '#666' }} />
                          <div className="w-8 h-8" style={{ backgroundColor: (brandData.palette || ['#888'])[2] || '#444' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
