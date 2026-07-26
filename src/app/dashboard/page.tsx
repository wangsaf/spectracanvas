'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjectStore, calculateProjectCompletion, exportProjectData } from '@/lib/store/project-store';
import { useToast } from '@/components/ui/toast';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function IconPalette({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="2" />
      <circle cx="17.5" cy="10.5" r="2" />
      <circle cx="8.5" cy="7.5" r="2" />
      <circle cx="6.5" cy="12.5" r="2" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function IconSprite({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function IconScript({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}

function IconPlus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconDownload({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconPencil({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function IconFolder({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconTrash({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function IconExternalLink({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconJson({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h2a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 0-2 2v1a2 2 0 0 1-2 2H4" />
      <path d="M20 6h-2a2 2 0 0 0-2 2v1a2 2 0 0 1-2 2 2 2 0 0 1 2 2v1a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function IconArchive({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8v13H3V8" />
      <path d="M1 3h22v5H1z" />
      <path d="M10 12h4" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Animated Number Component ───────────────────────────────────────────────

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setDisplay(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <>{display}{suffix}</>;
}

// ─── Main Dashboard Component ────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const {
    projectName,
    projectId,
    brand,
    sprites,
    scripts,
    selectedMoods,
    setProjectName,
    clearProject,
  } = useProjectStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(projectName);
  const [isExporting, setIsExporting] = useState<'json' | 'zip' | null>(null);
  const { toast } = useToast();

  const completion = calculateProjectCompletion(useProjectStore.getState());

  useEffect(() => {
    setEditedName(projectName);
  }, [projectName]);

  const handleSaveName = () => {
    setProjectName(editedName);
    setIsEditing(false);
  };

  const handleExportJSON = async () => {
    setIsExporting('json');
    try {
      const data = exportProjectData(useProjectStore.getState());
      const blob = new Blob([data], { type: 'application/json' });
      saveAs(blob, `${projectName.replace(/\s+/g, '-')}.json`);
      toast({ title: 'JSON exported successfully', variant: 'success' });
    } catch {
      toast({ title: 'Export failed', variant: 'error' });
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportZIP = async () => {
    setIsExporting('zip');
    try {
      const zip = new JSZip();

      zip.file('project.json', exportProjectData(useProjectStore.getState()));

      if (brand) {
        const brandFolder = zip.folder('brand');
        if (brandFolder) {
          brandFolder.file('colors.json', JSON.stringify(brand.colors, null, 2));
          brandFolder.file('typography.json', JSON.stringify(brand.typography, null, 2));

          if (brand.logo) {
            const logosFolder = brandFolder.folder('logos');
            if (logosFolder) {
              Object.entries(brand.logo).forEach(([key, svgContent]) => {
                if (typeof svgContent === 'string' && svgContent) {
                  logosFolder.file(`${key}.svg`, svgContent);
                }
              });
            }
          }
        }
      }

      if (sprites.length > 0) {
        const spritesFolder = zip.folder('sprites');
        if (spritesFolder) {
          sprites.forEach((sprite, index) => {
            const base64Data = sprite.imageData.split(',')[1];
            spritesFolder.file(`sprite-${index + 1}.png`, base64Data, { base64: true });
            spritesFolder.file(`sprite-${index + 1}.json`, JSON.stringify({
              description: sprite.description,
              style: sprite.style,
              size: sprite.size,
              palette: sprite.palette,
            }, null, 2));
          });
        }
      }

      if (scripts.length > 0) {
        const scriptsFolder = zip.folder('scripts');
        if (scriptsFolder) {
          scripts.forEach((script, index) => {
            const scriptText = `
CONTENT SCRIPT ${index + 1}
====================

Topic: ${script.topic}
Platform: ${script.platform}
Tone: ${script.tone}
Duration: ${script.duration}s

HOOKS:
${script.hook.map((h, i) => `${i + 1}. ${h}`).join('\n')}

BODY:
${script.body.map((s) => `${s.timestamp}: ${s.content}`).join('\n\n')}

CTAs:
${script.cta.map((c, i) => `${i + 1}. ${c}`).join('\n')}
            `.trim();

            scriptsFolder.file(`script-${index + 1}.txt`, scriptText);
          });
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${projectName.replace(/\s+/g, '-')}.zip`);
      toast({ title: 'ZIP exported successfully', variant: 'success' });
    } catch {
      toast({ title: 'Export failed', variant: 'error' });
    } finally {
      setIsExporting(null);
    }
  };

  const handleNewProject = () => {
    if (confirm('Start a new project? Current progress will be saved in browser storage.')) {
      clearProject();
      router.push('/');
    }
  };

  // Stats for the KPI row
  const stats = [
    {
      label: 'COMPLETION',
      value: completion,
      suffix: '%',
      color: completion === 100 ? '#22c55e' : '#d9453b',
      icon: completion === 100 ? IconCheck : IconFolder,
    },
    {
      label: 'SPRITES',
      value: sprites.length,
      suffix: '',
      color: '#d9453b',
      icon: IconSprite,
    },
    {
      label: 'SCRIPTS',
      value: scripts.length,
      suffix: '',
      color: '#d9453b',
      icon: IconScript,
    },
    {
      label: 'BRAND',
      value: brand ? 1 : 0,
      suffix: '',
      color: brand ? '#22c55e' : '#6b5f52',
      icon: IconPalette,
    },
  ];

  const hasAnyContent = completion > 0;

  return (
    <div className="min-h-screen bg-[#1c1915]" style={{ fontFamily: "'DM Sans', 'Space Grotesk', system-ui, sans-serif" }}>
      {/* ─── Top Bar ──────────────────────────────────────────────────────── */}
      <div className="border-b border-[#3a322a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#d9453b] flex items-center justify-center">
              <IconFolder className="w-4 h-4 text-white" />
            </div>
            <div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-sm font-bold h-8 w-64"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') setIsEditing(false);
                    }}
                  />
                  <Button onClick={handleSaveName} size="sm" className="h-8">
                    SAVE
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm" className="h-8">
                    CANCEL
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold tracking-wide text-[#f0e8dc]">{projectName}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[#6b5f52] hover:text-[#f0e8dc] transition-colors p-1"
                    aria-label="Edit project name"
                  >
                    <IconPencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <p className="text-[10px] text-[#6b5f52] tracking-wider mt-0.5">
                {projectId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleNewProject} variant="outline" size="sm">
              NEW PROJECT
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ─── KPI Stats Row ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="border border-[#3a322a] bg-[#241f1a] rounded p-4 flex items-start justify-between group hover:border-[#4a3f35] transition-colors"
              >
                <div>
                  <p className="text-[10px] text-[#6b5f52] tracking-[0.15em] font-medium mb-1.5">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-[#f0e8dc] tabular-nums">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Progress Bar ───────────────────────────────────────────────── */}
        <div className="border border-[#3a322a] bg-[#241f1a] rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-[#6b5f52] tracking-[0.15em] font-medium">
              PROJECT PROGRESS
            </p>
            <p className="text-xs text-[#f0e8dc] font-bold tabular-nums">
              {completion}%
            </p>
          </div>
          <div className="h-1.5 bg-[#1c1915] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${completion}%`,
                background: completion === 100
                  ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                  : 'linear-gradient(90deg, #d9453b, #e05545)',
              }}
            />
          </div>
          <div className="flex items-center gap-4 mt-3">
            {[
              { label: 'Brand', done: !!brand },
              { label: 'Sprites', done: sprites.length > 0 },
              { label: 'Scripts', done: scripts.length > 0 },
            ].map((step) => (
              <div key={step.label} className="flex items-center gap-1.5">
                <div
                  className={`w-3 h-3 rounded-sm flex items-center justify-center ${
                    step.done
                      ? 'bg-[#22c554]'
                      : 'border border-[#3a322a] bg-transparent'
                  }`}
                >
                  {step.done && <IconCheck className="w-2 h-2 text-white" />}
                </div>
                <span className={`text-[10px] tracking-wider ${step.done ? 'text-[#f0e8dc]' : 'text-[#6b5f52]'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Module Cards Grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ── Brand Identity Card ──────────────────────────────────────── */}
          <div className="border border-[#3a322a] bg-[#241f1a] rounded overflow-hidden group">
            <div className="p-4 border-b border-[#3a322a]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconPalette className="w-4 h-4 text-[#d9453b]" />
                  <h3 className="text-xs font-bold tracking-[0.15em] text-[#f0e8dc]">BRAND IDENTITY</h3>
                </div>
                <span
                  className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded ${
                    brand
                      ? 'bg-[#22c554]/10 text-[#22c554]'
                      : 'bg-[#3a322a] text-[#6b5f52]'
                  }`}
                >
                  {brand ? 'COMPLETE' : 'PENDING'}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {brand ? (
                <>
                  {/* Color Palette Preview */}
                  <div>
                    <p className="text-[9px] text-[#6b5f52] tracking-[0.15em] mb-2 font-medium">COLOR PALETTE</p>
                    <div className="flex gap-1">
                      {Object.values(brand.colors.primary).slice(0, 5).map((color, i) => (
                        <div
                          key={i}
                          className="flex-1 h-7 rounded-sm border border-[#3a322a]/50 hover:scale-110 transition-transform cursor-pointer"
                          style={{ backgroundColor: color as string }}
                          title={color as string}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Secondary colors */}
                  <div>
                    <p className="text-[9px] text-[#6b5f52] tracking-[0.15em] mb-2 font-medium">SECONDARY</p>
                    <div className="flex gap-1">
                      {Object.values(brand.colors.secondary).slice(0, 5).map((color, i) => (
                        <div
                          key={i}
                          className="flex-1 h-5 rounded-sm border border-[#3a322a]/50"
                          style={{ backgroundColor: color as string }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Typography Preview */}
                  <div>
                    <p className="text-[9px] text-[#6b5f52] tracking-[0.15em] mb-2 font-medium">TYPOGRAPHY</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#f0e8dc]">Heading</span>
                        <span className="text-[10px] text-[#6b5f52] font-mono">{brand.typography.heading.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#f0e8dc]">Body</span>
                        <span className="text-[10px] text-[#6b5f52] font-mono">{brand.typography.body.name}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/create/brand')}
                    className="w-full mt-2 py-2.5 border border-[#3a322a] rounded text-[10px] font-bold tracking-[0.15em] text-[#f0e8dc] hover:bg-[#3a322a]/50 hover:border-[#d9453b] transition-all flex items-center justify-center gap-2"
                  >
                    VIEW BRAND <IconExternalLink className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/create/brand')}
                  className="w-full py-6 border border-dashed border-[#3a322a] rounded text-[10px] font-bold tracking-[0.15em] text-[#6b5f52] hover:border-[#d9453b] hover:text-[#d9453b] transition-all flex items-center justify-center gap-2"
                >
                  <IconPlus className="w-4 h-4" /> CREATE BRAND
                </button>
              )}
            </div>
          </div>

          {/* ── Pixel Art Card ───────────────────────────────────────────── */}
          <div className="border border-[#3a322a] bg-[#241f1a] rounded overflow-hidden group">
            <div className="p-4 border-b border-[#3a322a]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconSprite className="w-4 h-4 text-[#d9453b]" />
                  <h3 className="text-xs font-bold tracking-[0.15em] text-[#f0e8dc]">PIXEL ART</h3>
                </div>
                <span className="text-[10px] text-[#6b5f52] tabular-nums font-bold">
                  {sprites.length} sprite{sprites.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {sprites.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {sprites.slice(0, 6).map((sprite, i) => (
                      <div
                        key={i}
                        className="aspect-square border border-[#3a322a] rounded bg-[#1c1915] p-1.5 hover:border-[#d9453b] transition-colors cursor-pointer"
                      >
                        <img
                          src={sprite.imageData}
                          alt={`Sprite ${i + 1}`}
                          className="w-full h-full"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      </div>
                    ))}
                  </div>

                  {sprites.length > 6 && (
                    <p className="text-[10px] text-[#6b5f52] text-center">
                      +{sprites.length - 6} more
                    </p>
                  )}

                  {/* Sprite details */}
                  <div className="space-y-1.5">
                    {sprites.slice(0, 2).map((sprite, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px]">
                        <div className="w-5 h-5 border border-[#3a322a] rounded-sm bg-[#1c1915] overflow-hidden flex-shrink-0">
                          <img
                            src={sprite.imageData}
                            alt=""
                            className="w-full h-full"
                            style={{ imageRendering: 'pixelated' }}
                          />
                        </div>
                        <span className="text-[#6b5f52] truncate">{sprite.description}</span>
                        <span className="text-[#3a322a] ml-auto flex-shrink-0">{sprite.size}px</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => router.push('/create/pixel')}
                    className="w-full mt-2 py-2.5 border border-[#3a322a] rounded text-[10px] font-bold tracking-[0.15em] text-[#f0e8dc] hover:bg-[#3a322a]/50 hover:border-[#d9453b] transition-all flex items-center justify-center gap-2"
                  >
                    MANAGE SPRITES <IconExternalLink className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/create/pixel')}
                  className="w-full py-6 border border-dashed border-[#3a322a] rounded text-[10px] font-bold tracking-[0.15em] text-[#6b5f52] hover:border-[#d9453b] hover:text-[#d9453b] transition-all flex items-center justify-center gap-2"
                >
                  <IconPlus className="w-4 h-4" /> CREATE SPRITES
                </button>
              )}
            </div>
          </div>

          {/* ── Content Scripts Card ─────────────────────────────────────── */}
          <div className="border border-[#3a322a] bg-[#241f1a] rounded overflow-hidden group">
            <div className="p-4 border-b border-[#3a322a]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconScript className="w-4 h-4 text-[#d9453b]" />
                  <h3 className="text-xs font-bold tracking-[0.15em] text-[#f0e8dc]">CONTENT SCRIPTS</h3>
                </div>
                <span className="text-[10px] text-[#6b5f52] tabular-nums font-bold">
                  {scripts.length} script{scripts.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {scripts.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {scripts.slice(0, 4).map((script, i) => (
                      <div
                        key={i}
                        className="border border-[#3a322a] rounded p-3 hover:border-[#d9453b]/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-[#f0e8dc] truncate font-medium">{script.topic}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] text-[#d9453b] tracking-wider font-bold uppercase">
                                {script.platform}
                              </span>
                              <span className="text-[#3a322a]">·</span>
                              <span className="text-[9px] text-[#6b5f52]">{script.duration}s</span>
                              <span className="text-[#3a322a]">·</span>
                              <span className="text-[9px] text-[#6b5f52]">{script.tone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => router.push('/create/content')}
                    className="w-full mt-2 py-2.5 border border-[#3a322a] rounded text-[10px] font-bold tracking-[0.15em] text-[#f0e8dc] hover:bg-[#3a322a]/50 hover:border-[#d9453b] transition-all flex items-center justify-center gap-2"
                  >
                    MANAGE SCRIPTS <IconExternalLink className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/create/content')}
                  className="w-full py-6 border border-dashed border-[#3a322a] rounded text-[10px] font-bold tracking-[0.15em] text-[#6b5f52] hover:border-[#d9453b] hover:text-[#d9453b] transition-all flex items-center justify-center gap-2"
                >
                  <IconPlus className="w-4 h-4" /> CREATE SCRIPTS
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Quick Actions Row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Create Brand', icon: IconPalette, path: '/create/brand', desc: 'Colors, fonts, logos', ariaLabel: 'Create brand identity' },
            { label: 'Create Sprite', icon: IconSprite, path: '/create/pixel', desc: 'Pixel art characters', ariaLabel: 'Create pixel art sprite' },
            { label: 'Create Script', icon: IconScript, path: '/create/content', desc: 'Social media content', ariaLabel: 'Create content script' },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => router.push(action.path)}
              aria-label={action.ariaLabel}
              className="border border-[#3a322a] bg-[#241f1a] rounded p-4 text-left hover:border-[#d9453b] hover:bg-[#2e2720] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#d9453b]/10 flex items-center justify-center group-hover:bg-[#d9453b]/20 transition-colors">
                  <action.icon className="w-4 h-4 text-[#d9453b]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#f0e8dc] tracking-wider">{action.label.toUpperCase()}</p>
                  <p className="text-[10px] text-[#6b5f52] mt-0.5">{action.desc}</p>
                </div>
                <IconPlus className="w-4 h-4 text-[#3a322a] ml-auto group-hover:text-[#d9453b] transition-colors" />
              </div>
            </button>
          ))}
        </div>

        {/* ─── Export Section ─────────────────────────────────────────────── */}
        <div className="border border-[#3a322a] bg-[#241f1a] rounded p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <IconDownload className="w-4 h-4 text-[#d9453b]" />
              <h3 className="text-xs font-bold tracking-[0.15em] text-[#f0e8dc]">EXPORT PROJECT</h3>
            </div>
            <p className="text-[10px] text-[#6b5f52]">
              Download all your creative assets
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleExportJSON}
              aria-label="Export as JSON"
              disabled={!hasAnyContent || isExporting === 'json'}
              className="flex items-center justify-center gap-2.5 py-3 px-4 border border-[#3a322a] rounded text-[10px] font-bold tracking-[0.15em] text-[#f0e8dc] hover:border-[#d9453b] hover:bg-[#1c1915] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#3a322a] disabled:hover:bg-transparent"
            >
              <IconJson className="w-4 h-4" />
              {isExporting === 'json' ? 'EXPORTING...' : 'EXPORT JSON'}
            </button>
            <button
              onClick={handleExportZIP}
              aria-label="Export as ZIP"
              disabled={!hasAnyContent || isExporting === 'zip'}
              className="flex items-center justify-center gap-2.5 py-3 px-4 border border-[#3a322a] rounded text-[10px] font-bold tracking-[0.15em] text-[#f0e8dc] hover:border-[#d9453b] hover:bg-[#1c1915] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#3a322a] disabled:hover:bg-transparent"
            >
              <IconArchive className="w-4 h-4" />
              {isExporting === 'zip' ? 'EXPORTING...' : 'EXPORT ZIP'}
            </button>
          </div>
          <p className="text-[9px] text-[#6b5f52] mt-3 tracking-wider">
            ZIP includes: Brand assets (colors, fonts, logos) · Sprite PNGs with metadata · Content scripts as text files
          </p>
        </div>

        {/* ─── Mood Sync Section ──────────────────────────────────────────── */}
        {selectedMoods.length > 0 && (
          <div className="border border-[#3a322a] bg-[#241f1a] rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#d9453b] animate-pulse" />
              <h3 className="text-xs font-bold tracking-[0.15em] text-[#f0e8dc]">MOOD SYNC ACTIVE</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedMoods.map((mood) => (
                <span
                  key={mood}
                  className="px-3 py-1.5 bg-[#d9453b]/10 border border-[#d9453b]/30 text-[#d9453b] text-[10px] font-bold tracking-[0.15em] rounded"
                >
                  {mood.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ─── Footer Info ────────────────────────────────────────────────── */}
        <div className="text-center py-4">
          <p className="text-[9px] text-[#3a322a] tracking-[0.2em]">
            SPECTRACANVAS · ALL ASSETS STORED LOCALLY IN YOUR BROWSER
          </p>
        </div>
      </div>
    </div>
  );
}
