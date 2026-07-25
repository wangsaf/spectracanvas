'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContentStudioPage() {
  const [activeTab, setActiveTab] = useState('Script');
  const [loading, setLoading] = useState(false);
  const [contentData, setContentData] = useState<any>(null);
  const [form, setForm] = useState({
    topic: '',
    platform: 'tiktok',
    audience: '',
    tone: 'casual',
    duration: 30,
  });

  const platforms = [
    { value: 'tiktok', label: 'TikTok' },
    { value: 'reels', label: 'Instagram Reels' },
    { value: 'shorts', label: 'YouTube Shorts' },
    { value: 'twitter', label: 'Twitter/X' },
  ];

  const tones = [
    { value: 'casual', label: 'Casual' },
    { value: 'professional', label: 'Professional' },
    { value: 'educational', label: 'Educational' },
    { value: 'hype', label: 'Hype' },
    { value: 'inspirational', label: 'Inspirational' },
  ];

  const handleGenerate = async () => {
    if (!form.topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/content/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) setContentData(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const tabs = ['Script', 'Caption', 'Calendar'];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-xs text-neutral-500 hover:text-white">← BACK</Link>
          <div className="text-xs text-neutral-600 mt-1">// CREATE / CONTENT</div>
          <h1 className="text-2xl tracking-wider mt-2">CONTENT STUDIO</h1>
          <p className="text-sm text-neutral-400 mt-1">Generate scripts, storyboards, captions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="border border-[#222] bg-[#111] p-6">
            <div className="text-xs text-neutral-600 mb-4">// INPUT</div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">TOPIC / IDEA</label>
                <textarea
                  value={form.topic}
                  onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-[#222] p-2 text-sm text-white h-20 resize-none"
                  placeholder="Launching a new indie pixel art game..."
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">PLATFORM</label>
                <select
                  value={form.platform}
                  onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-[#222] p-2 text-sm text-white"
                >
                  {platforms.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">AUDIENCE</label>
                <input
                  value={form.audience}
                  onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-[#222] p-2 text-sm text-white"
                  placeholder="Indie game enthusiasts..."
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">TONE</label>
                <select
                  value={form.tone}
                  onChange={e => setForm(f => ({ ...f, tone: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-[#222] p-2 text-sm text-white"
                >
                  {tones.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">DURATION</label>
                <div className="flex gap-2">
                  {[15, 30, 60].map(d => (
                    <button
                      key={d}
                      onClick={() => setForm(f => ({ ...f, duration: d }))}
                      className={"px-4 py-2 text-xs border " + (form.duration === d ? "bg-white text-black border-white" : "border-[#333] text-neutral-400 hover:border-white")}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !form.topic.trim()}
              className="mt-6 w-full py-3 bg-[#00ff88] text-black font-bold text-sm tracking-wider hover:bg-[#00cc6a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '[ GENERATING... ]' : '[ GENERATE CONTENT ]'}
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
              {!contentData ? (
                <div className="text-center py-20">
                  <div className="text-xs text-neutral-600">No content generated yet</div>
                  <div className="text-xs text-neutral-700 mt-1">Fill the form and click GENERATE</div>
                </div>
              ) : (
                <>
                  {activeTab === 'Script' && contentData.script && (
                    <div>
                      <div className="text-xs text-neutral-600 mb-4">// SCRIPT</div>
                      
                      <div className="text-xs text-neutral-500 mb-2 border-b border-[#222] pb-1">HOOKS (Choose One)</div>
                      {contentData.script.hooks?.map((hook: any, i: number) => (
                        <div key={i} className="bg-[#0a0a0a] border border-[#222] p-3 mb-2">
                          <div className="text-[10px] text-neutral-500 mb-1">[{hook.type}] {hook.duration}s</div>
                          <div className="text-sm">&quot;{hook.text}&quot;</div>
                        </div>
                      ))}

                      <div className="text-xs text-neutral-500 mb-2 mt-4 border-b border-[#222] pb-1">SCRIPT BODY</div>
                      {contentData.script.body?.map((section: any, i: number) => (
                        <div key={i} className="bg-[#0a0a0a] border border-[#222] p-3 mb-2">
                          <div className="text-[10px] text-neutral-500">[{section.timestamp}]</div>
                          <div className="text-sm mt-1">{section.text}</div>
                          {section.overlay && <div className="text-[10px] text-neutral-600 mt-1 bg-[#1a1a1a] inline-block px-2 py-0.5">Overlay: {section.overlay}</div>}
                        </div>
                      ))}

                      <div className="text-xs text-neutral-500 mb-2 mt-4 border-b border-[#222] pb-1">CALL TO ACTION</div>
                      {contentData.script.ctas?.map((cta: any, i: number) => (
                        <div key={i} className="bg-[#0a0a0a] border border-[#222] p-3 mb-2">
                          <span className="text-[10px] text-neutral-500 mr-2">[{cta.type}]</span>
                          <span className="text-sm">{cta.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'Caption' && contentData.caption && (
                    <div>
                      <div className="text-xs text-neutral-600 mb-4">// CAPTION</div>
                      <div className="bg-[#0a0a0a] border border-[#222] p-4">
                        <div className="text-sm">{contentData.caption.main}</div>
                        <div className="text-xs text-blue-400 mt-3 flex flex-wrap gap-1">
                          {(contentData.caption.hashtags || []).map((tag: string, i: number) => (
                            <span key={i}>{tag}</span>
                          ))}
                        </div>
                      </div>
                      {contentData.caption.variations?.length > 0 && (
                        <div className="mt-4">
                          <div className="text-xs text-neutral-500 mb-2">VARIATIONS</div>
                          {contentData.caption.variations.map((v: string, i: number) => (
                            <div key={i} className="bg-[#0a0a0a] border border-[#222] p-2 mb-1 text-xs">
                              <span className="text-neutral-500 mr-2">V{i + 1}:</span>{v}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'Calendar' && contentData.calendar && (
                    <div>
                      <div className="text-xs text-neutral-600 mb-4">// WEEKLY PLAN</div>
                      <div className="grid grid-cols-7 gap-1">
                        {contentData.calendar.map((day: any, i: number) => (
                          <div key={i} className="bg-[#0a0a0a] border border-[#222] p-2 text-center">
                            <div className="text-[10px] font-bold">{day.day?.substring(0, 3)}</div>
                            <div className="text-[9px] text-neutral-500 mt-1">{day.bestTime}</div>
                            <div className="text-[9px] text-neutral-600 mt-1 capitalize">{day.contentType}</div>
                          </div>
                        ))}
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
