'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function PixelStudioPage() {
  const [activeTab, setActiveTab] = useState('Sprite');
  const [loading, setLoading] = useState(false);
  const [pixelData, setPixelData] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [form, setForm] = useState({
    description: '',
    style: '16bit',
    size: 32,
  });

  const styles = [
    { value: '8bit', label: '8-BIT', colors: 4 },
    { value: '16bit', label: '16-BIT', colors: 16 },
    { value: 'modern', label: 'MODERN', colors: 32 },
  ];

  const handleGenerate = async () => {
    if (!form.description.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/pixel/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) setPixelData(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Render sprite to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pixelData?.sprites?.[0]?.pixels) return;

    const pixels = pixelData.sprites[0].pixels;
    const palette = pixelData.palette || ['#000', '#fff', '#f00', '#00f'];
    const scale = 10;
    const size = pixels.length;

    canvas.width = size * scale;
    canvas.height = size * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const ci = pixels[y]?.[x];
        if (ci !== undefined && ci >= 0 && ci < palette.length) {
          ctx.fillStyle = palette[ci];
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= size; i++) {
      ctx.beginPath();
      ctx.moveTo(i * scale, 0);
      ctx.lineTo(i * scale, size * scale);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * scale);
      ctx.lineTo(size * scale, i * scale);
      ctx.stroke();
    }
  }, [pixelData]);

  const tabs = ['Sprite', 'Animation', 'Sheet'];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-xs text-neutral-500 hover:text-white">← BACK</Link>
          <div className="text-xs text-neutral-600 mt-1">// CREATE / PIXEL</div>
          <h1 className="text-2xl tracking-wider mt-2">PIXEL STUDIO</h1>
          <p className="text-sm text-neutral-400 mt-1">Generate pixel art sprites, animations, sheets.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="border border-[#222] bg-[#111] p-6">
            <div className="text-xs text-neutral-600 mb-4">// INPUT</div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">CHARACTER DESCRIPTION</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-[#222] p-2 text-sm text-white h-24 resize-none"
                  placeholder="A brave pixel knight with silver armor and a sword..."
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">ART STYLE</label>
                <div className="space-y-2">
                  {styles.map(s => (
                    <label key={s.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="style"
                        checked={form.style === s.value}
                        onChange={() => setForm(f => ({ ...f, style: s.value }))}
                        className="accent-white"
                      />
                      <span className="text-sm">{s.label}</span>
                      <span className="text-xs text-neutral-500">({s.colors} colors)</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">SPRITE SIZE</label>
                <select
                  value={form.size}
                  onChange={e => setForm(f => ({ ...f, size: Number(e.target.value) }))}
                  className="w-full bg-[#0a0a0a] border border-[#222] p-2 text-sm text-white"
                >
                  {[16, 32, 48, 64].map(s => (
                    <option key={s} value={s}>{s}x{s} pixels</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !form.description.trim()}
              className="mt-6 w-full py-3 bg-[#00ff88] text-black font-bold text-sm tracking-wider hover:bg-[#00cc6a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '[ GENERATING... ]' : '[ GENERATE SPRITE ]'}
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

            <div className="p-6 min-h-[400px] flex items-center justify-center">
              {!pixelData ? (
                <div className="text-center">
                  <pre className="text-[#00ff88] text-xs mb-4">{`
  +------+
  |      |
  |  ??  |
  |      |
  +------+`}</pre>
                  <div className="text-xs text-neutral-600">No sprite generated yet</div>
                </div>
              ) : (
                <>
                  {activeTab === 'Sprite' && (
                    <div className="text-center">
                      <div className="text-xs text-neutral-600 mb-4">// SPRITE PREVIEW</div>
                      <canvas
                        ref={canvasRef}
                        className="border border-[#222] mx-auto"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      <div className="text-xs text-neutral-500 mt-2">
                        {pixelData.size}x{pixelData.size} | {pixelData.style} | {pixelData.palette?.length || 0} colors
                      </div>
                    </div>
                  )}

                  {activeTab === 'Animation' && (
                    <div className="text-center">
                      <div className="text-xs text-neutral-600 mb-4">// ANIMATION PREVIEW</div>
                      <div className="text-xs text-neutral-500">
                        {pixelData.sprites?.length || 0} frames generated
                      </div>
                      <div className="flex gap-2 justify-center mt-4 flex-wrap">
                        {(pixelData.sprites || []).map((s: any, i: number) => (
                          <div key={i} className="border border-[#333] p-1">
                            <div className="text-[9px] text-neutral-600 text-center">{s.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'Sheet' && (
                    <div className="text-center">
                      <div className="text-xs text-neutral-600 mb-4">// SPRITE SHEET</div>
                      <div className="border border-[#222] p-4 inline-block bg-[#0a0a0a]">
                        <div className="grid grid-cols-4 gap-1">
                          {(pixelData.sprites || []).map((s: any, i: number) => (
                            <div key={i} className="w-10 h-10 border border-[#333] flex items-center justify-center">
                              <span className="text-[8px] text-neutral-600">{s.name?.substring(0, 3)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-neutral-500 mt-2">
                        {(pixelData.sprites || []).length} frames
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
