'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjectStore, calculateProjectCompletion, exportProjectData } from '@/lib/store/project-store';
import { useToast } from '@/components/ui/toast';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Brand studio imports
import { BrandForm, type BrandFormData } from '@/components/brand/brand-form';
import { ColorPalette } from '@/components/brand/color-palette';
import { FontPreview } from '@/components/brand/font-preview';
import { LogoPreview } from '@/components/brand/logo-preview';
import { PersonalityPreview } from '@/components/brand/personality-preview';
import type { BrandIdentity } from '@/lib/types';
import { API_ROUTES } from '@/lib/constants';

// Pixel studio imports
import { PixelForm, type PixelFormData } from '@/components/pixel/pixel-form';
import { SpriteCanvas } from '@/components/pixel/sprite-canvas';
import { SpriteSheet } from '@/components/pixel/sprite-sheet';
import { AnimationPreview } from '@/components/pixel/animation-preview';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import type { CharacterSprite, PoseSet } from '@/lib/types';
import { generatePosesAsync, generatePoses } from '@/lib/pixel/pose-generator';

// Content studio imports
import { ContentForm, type ContentFormData } from '@/components/content/content-form';
import { ScriptPreview } from '@/components/content/script-preview';
import { MoodSelector } from '@/components/content/mood-selector';
import type { ContentScript, MoodKeyword } from '@/lib/types';
import { suggestContentAdjustments } from '@/lib/mood/mood-mapper';

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

// ─── Tab type ────────────────────────────────────────────────────────────────

type TabId = 'overview' | 'brand' | 'pixel' | 'content';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'brand', label: 'BRAND' },
  { id: 'pixel', label: 'PIXEL' },
  { id: 'content', label: 'CONTENT' },
];

// ─── Brand Studio Tab ────────────────────────────────────────────────────────

function BrandStudioTab() {
  const { brand: savedBrand, setBrand } = useProjectStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [brand, setBrandLocal] = useState<BrandIdentity | null>(savedBrand);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (formData: BrandFormData) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(API_ROUTES.brand.generate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          industry: formData.industry,
          values: formData.values,
          targetAudience: formData.targetAudience,
          mood: formData.mood,
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to generate brand');

      setBrandLocal(result.data);
      setBrand(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Input Form */}
      <div>
        <div className="sticky top-20">
          <BrandForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          {error && (
            <div className="mt-4 p-4 border border-red-500 bg-red-500/10 rounded">
              <p className="text-xs font-bold text-red-500">ERROR</p>
              <p className="text-sm text-red-400 mt-1">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="space-y-6">
        {!brand && !isGenerating && (
          <div className="border rounded border-[#27272a] bg-[#0a0a0a] p-12 text-center">
            <div className="w-16 h-16 border-2 rounded border-[#27272a] mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl text-[#71717a]">[ ]</span>
            </div>
            <p className="text-sm text-[#71717a]">
              Fill in your brand details and click generate to see your identity
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="border rounded border-[#27272a] bg-[#0a0a0a] p-12 text-center">
            <div className="w-16 h-16 border-2 rounded border-[#ffffff] mx-auto mb-4 flex items-center justify-center animate-pulse">
              <span className="text-2xl text-[#ffffff]">[*]</span>
            </div>
            <p className="text-sm text-[#ffffff] font-bold tracking-wider">GENERATING BRAND...</p>
            <p className="text-xs text-[#71717a] mt-2">Creating colors, typography, and logos</p>
          </div>
        )}

        {brand && (
          <>
            <ColorPalette colors={brand.colors} />
            <FontPreview typography={brand.typography} />
            <LogoPreview logo={brand.logo} brandName={brand.name} />
            {brand.personality && <PersonalityPreview personality={brand.personality} />}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Pixel Studio Tab ────────────────────────────────────────────────────────

function PixelStudioTab() {
  const { brand, sprites: savedSprites, addSprite } = useProjectStore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPoses, setIsGeneratingPoses] = useState(false);
  const [sprite, setSprite] = useState<CharacterSprite | null>(null);
  const [poses, setPoses] = useState<PoseSet | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (formData: PixelFormData) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(API_ROUTES.pixel.generate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.description,
          style: formData.style,
          size: formData.size,
          palette: formData.paletteMode === 'custom' ? formData.customPalette : undefined,
          brandColors: formData.paletteMode === 'brand' && brand
            ? Object.values(brand.colors.primary) as string[]
            : brand?.colors
              ? Object.values(brand.colors.primary) as string[]
              : undefined,
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to generate sprite');

      setSprite(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSprite = () => {
    if (sprite) {
      addSprite(sprite);
      toast({ title: 'Sprite saved to project!', variant: 'success' });
    }
  };

  useEffect(() => {
    if (!sprite) {
      setPoses(null);
      return;
    }
    setIsGeneratingPoses(true);
    generatePosesAsync(sprite)
      .then((generatedPoses) => setPoses(generatedPoses))
      .catch((err) => {
        console.error('Pose generation failed, using template poses:', err);
        setPoses(generatePoses(sprite));
      })
      .finally(() => setIsGeneratingPoses(false));
  }, [sprite]);

  return (
    <div className="space-y-4">
      {/* Saved Sprites Count */}
      {savedSprites.length > 0 && (
        <div className="p-3 rounded border border-[#27272a] bg-[#0a0a0a]">
          <p className="text-xs text-[#a1a1aa]">
            {savedSprites.length} sprite{savedSprites.length !== 1 ? 's' : ''} saved to project
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Input Form */}
        <div>
          <div className="sticky top-20">
            <PixelForm
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              brandColors={brand ? Object.values(brand.colors.primary) as string[] : undefined}
            />
            {error && (
              <div className="mt-4 p-4 rounded border border-red-500 bg-red-500/10">
                <p className="text-xs font-bold text-red-500">ERROR</p>
                <p className="text-sm text-red-400 mt-1">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          {!sprite && !isGenerating && (
            <div className="rounded border border-[#27272a] bg-[#0a0a0a] p-12 text-center">
              <div className="w-16 h-16 rounded border-2 border-[#27272a] mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-[#71717a]">[ ]</span>
              </div>
              <p className="text-sm text-[#71717a]">
                Describe your character and click generate to see your pixel art sprite
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="rounded border border-[#27272a] bg-[#0a0a0a] p-12 text-center">
              <LoadingSpinner size="lg" label="GENERATING SPRITE..." className="mb-2" />
              <p className="text-xs text-[#71717a] mt-2">Creating your pixel art character</p>
            </div>
          )}

          {sprite && (
            <>
              <SpriteCanvas sprite={sprite} />

              <div className="rounded border border-[#27272a] bg-[#0a0a0a] p-6">
                <h3 className="text-sm font-bold tracking-wider mb-2">DESCRIPTION</h3>
                <p className="text-sm text-[#a1a1aa]">{sprite.description}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSaveSprite}>
                  [ SAVE SPRITE ]
                </Button>
              </div>

              {isGeneratingPoses && (
                <div className="rounded border border-[#27272a] bg-[#0a0a0a] p-8 text-center">
                  <LoadingSpinner size="md" label="GENERATING POSES..." />
                </div>
              )}

              {poses && <AnimationPreview poses={poses} spriteSize={sprite.size} />}
              {poses && <SpriteSheet poses={poses} spriteSize={sprite.size} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Content Studio Tab ──────────────────────────────────────────────────────

function ContentStudioTab() {
  const { brand, scripts: savedScripts, addScript, setMoods } = useProjectStore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<ContentScript | null>(null);
  const [selectedMoods, setSelectedMoods] = useState<MoodKeyword[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState<any>(null);
  const [calendar, setCalendar] = useState<any>(null);

  const handleGenerate = async (formData: ContentFormData) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(API_ROUTES.content.script, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.topic,
          platform: formData.platform,
          tone: formData.tone,
          duration: formData.duration,
          brandContext: brand?.name || formData.brandContext,
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to generate script');

      const raw = result.data.script || result.data;
      const transformed = {
        topic: formData.topic,
        platform: formData.platform,
        tone: formData.tone,
        duration: formData.duration,
        hook: (raw.hooks || []).map((h: { text: string }) => typeof h === 'string' ? h : h.text),
        body: (raw.body || []).map((b: { text: string; timestamp: string; overlay?: string; bRoll?: string }) => ({
          timestamp: b.timestamp,
          content: b.text,
          textOverlay: b.overlay,
          brollSuggestion: b.bRoll,
        })),
        cta: (raw.ctas || []).map((c: { text: string } | string) => typeof c === 'string' ? c : c.text),
        wordCount: raw.wordCount || 0,
      };
      setScript(transformed);
      setCaption(result.data.caption || null);
      setCalendar(result.data.calendar || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMoodsChange = (moods: MoodKeyword[]) => {
    setSelectedMoods(moods);
    setMoods(moods);
  };

  const handleSaveScript = () => {
    if (script) {
      addScript(script);
      toast({ title: 'Script saved to project!', variant: 'success' });
    }
  };

  const moodAdjustments = selectedMoods.length > 0 && script
    ? suggestContentAdjustments(selectedMoods, script.platform)
    : null;

  return (
    <div className="space-y-4">
      {/* Saved Scripts Count */}
      {savedScripts.length > 0 && (
        <div className="p-3 border border-[#27272a] bg-[#0a0a0a] rounded">
          <p className="text-xs text-[#a1a1aa]">
            {savedScripts.length} script{savedScripts.length !== 1 ? 's' : ''} saved to project
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Input Form */}
        <div className="space-y-6">
          <div className="sticky top-20 space-y-6">
            <ContentForm
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              brandContext={brand?.name}
            />

            {error && (
              <div className="p-4 border border-red-500 bg-red-500/10 rounded">
                <p className="text-xs font-bold text-red-500">ERROR</p>
                <p className="text-sm text-red-400 mt-1">{error}</p>
              </div>
            )}

            {script && (
              <MoodSelector
                selectedMoods={selectedMoods}
                onMoodsChange={handleMoodsChange}
              />
            )}
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          {!script && !isGenerating && (
            <div className="border border-[#27272a] bg-[#0a0a0a] p-12 text-center rounded">
              <div className="w-16 h-16 border-2 border-[#27272a] mx-auto mb-4 flex items-center justify-center rounded">
                <span className="text-2xl text-[#71717a]">[ ]</span>
              </div>
              <p className="text-sm text-[#71717a]">
                Describe your content idea and click generate to create your script
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="border border-[#27272a] bg-[#0a0a0a] p-12 text-center rounded">
              <LoadingSpinner size="lg" label="GENERATING SCRIPT..." className="mb-2" />
              <p className="text-xs text-[#71717a] mt-2">
                Creating your content script with hooks, body, and CTAs
              </p>
            </div>
          )}

          {script && (
            <>
              <ScriptPreview script={script} />

              {moodAdjustments && (
                <div className="border border-[#27272a] bg-[#0a0a0a] p-6 space-y-4 rounded">
                  <h3 className="text-sm font-bold tracking-wider text-[#ffffff]">
                    MOOD-BASED RECOMMENDATIONS
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="text-[#a1a1aa] font-bold mb-1">VISUAL STYLE:</p>
                      <p className="text-neutral-300">{moodAdjustments.visualStyle}</p>
                    </div>
                    <div>
                      <p className="text-[#a1a1aa] font-bold mb-1">MUSIC:</p>
                      <p className="text-neutral-300">{moodAdjustments.musicSuggestion}</p>
                    </div>
                    <div>
                      <p className="text-[#a1a1aa] font-bold mb-1">TEXT STYLE:</p>
                      <p className="text-neutral-300">{moodAdjustments.textStyle}</p>
                    </div>
                    <div>
                      <p className="text-[#a1a1aa] font-bold mb-1">PACING:</p>
                      <p className="text-neutral-300">{moodAdjustments.pacing}</p>
                    </div>
                  </div>
                </div>
              )}

              {caption && (
                <div className="border border-[#27272a] bg-[#0a0a0a] p-6 space-y-4 rounded">
                  <h3 className="text-sm font-bold tracking-wider text-[#ffffff]">CAPTIONS</h3>
                  {caption.main && (
                    <div>
                      <p className="text-[#a1a1aa] font-bold text-xs mb-1">MAIN CAPTION:</p>
                      <p className="text-neutral-300 text-sm">{caption.main}</p>
                    </div>
                  )}
                  {caption.hashtags && caption.hashtags.length > 0 && (
                    <div>
                      <p className="text-[#a1a1aa] font-bold text-xs mb-1">HASHTAGS:</p>
                      <div className="flex flex-wrap gap-2">
                        {caption.hashtags.map((tag: string, i: number) => (
                          <span key={i} className="text-xs px-2 py-1 border border-[#27272a] text-neutral-400 rounded">
                            {tag.startsWith('#') ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {caption.variations && caption.variations.length > 0 && (
                    <div>
                      <p className="text-[#a1a1aa] font-bold text-xs mb-1">VARIATIONS:</p>
                      <div className="space-y-2">
                        {caption.variations.map((v: string, i: number) => (
                          <p key={i} className="text-neutral-300 text-xs border-l-2 border-[#27272a] pl-3">{v}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {calendar && calendar.length > 0 && (
                <div className="border border-[#27272a] bg-[#0a0a0a] p-6 space-y-4 rounded">
                  <h3 className="text-sm font-bold tracking-wider text-[#ffffff]">POSTING CALENDAR</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-[#27272a]">
                          <th className="text-left text-[#a1a1aa] font-bold py-2 pr-4">DATE</th>
                          <th className="text-left text-[#a1a1aa] font-bold py-2 pr-4">PLATFORM</th>
                          <th className="text-left text-[#a1a1aa] font-bold py-2 pr-4">TOPIC</th>
                          <th className="text-left text-[#a1a1aa] font-bold py-2">TYPE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calendar.map((entry: any, i: number) => (
                          <tr key={i} className="border-b border-[#27272a]/50">
                            <td className="py-2 pr-4 text-neutral-300">{entry.day || entry.date || '—'}</td>
                            <td className="py-2 pr-4 text-neutral-300">{entry.platform || '—'}</td>
                            <td className="py-2 pr-4 text-neutral-300">{entry.topic || '—'}</td>
                            <td className="py-2 text-neutral-300">{entry.type || entry.contentType || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <Button variant="outline" onClick={handleSaveScript}>
                [ SAVE SCRIPT ]
              </Button>

              <p className="text-[10px] text-[#71717a] text-center tracking-wider">
                STORYBOARD — coming soon
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ────────────────────────────────────────────────

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const { toast } = useToast();

  const completion = calculateProjectCompletion(useProjectStore.getState());

  // Read tab from URL on mount
  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabId | null;
    if (tabParam && TABS.some(t => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.replaceState({}, '', url.toString());
  }, []);

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
      color: completion === 100 ? '#22c55e' : '#ffffff',
      icon: completion === 100 ? IconCheck : IconFolder,
    },
    { label: 'SPRITES', value: sprites.length, suffix: '', color: '#ffffff', icon: IconSprite },
    { label: 'SCRIPTS', value: scripts.length, suffix: '', color: '#ffffff', icon: IconScript },
    { label: 'BRAND', value: brand ? 1 : 0, suffix: '', color: brand ? '#22c55e' : '#71717a', icon: IconPalette },
  ];

  const hasAnyContent = completion > 0;

  return (
    <div className="min-h-screen bg-[#000000]" style={{ fontFamily: "'DM Sans', 'Space Grotesk', system-ui, sans-serif" }}>
      {/* ─── Top Bar ──────────────────────────────────────────────────────── */}
      <div className="border-b border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#ffffff] flex items-center justify-center">
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
                  <h1 className="text-base font-bold tracking-wide text-[#fafafa]">{projectName}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[#71717a] hover:text-[#fafafa] transition-colors p-1"
                    aria-label="Edit project name"
                  >
                    <IconPencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <p className="text-[10px] text-[#71717a] tracking-wider mt-0.5">
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
                className="border border-[#27272a] bg-[#0a0a0a] rounded p-4 flex items-start justify-between group hover:border-[#4a3f35] transition-colors"
              >
                <div>
                  <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-medium mb-1.5">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-[#fafafa] tabular-nums">
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
        <div className="border border-[#27272a] bg-[#0a0a0a] rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-[#71717a] tracking-[0.15em] font-medium">
              PROJECT PROGRESS
            </p>
            <p className="text-xs text-[#fafafa] font-bold tabular-nums">
              {completion}%
            </p>
          </div>
          <div className="h-1.5 bg-[#000000] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${completion}%`,
                background: completion === 100
                  ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                  : 'linear-gradient(90deg, #ffffff, #e05545)',
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
                      : 'border border-[#27272a] bg-transparent'
                  }`}
                >
                  {step.done && <IconCheck className="w-2 h-2 text-white" />}
                </div>
                <span className={`text-[10px] tracking-wider ${step.done ? 'text-[#fafafa]' : 'text-[#71717a]'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Tab Navigation ─────────────────────────────────────────────── */}
        <div className="border-b border-[#27272a]">
          <div className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className="px-5 py-2.5 text-xs font-bold tracking-[0.15em] transition-all rounded-t"
                style={{
                  background: activeTab === tab.id ? '#ffffff' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : '#a1a1aa',
                  borderBottom: activeTab === tab.id ? '2px solid #ffffff' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = '#0a0a0a';
                    e.currentTarget.style.color = '#fafafa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#a1a1aa';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Tab Content ────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <>
            {/* ─── Module Cards Grid ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* ── Brand Identity Card ──────────────────────────────────── */}
              <div className="border border-[#27272a] bg-[#0a0a0a] rounded overflow-hidden group">
                <div className="p-4 border-b border-[#27272a]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconPalette className="w-4 h-4 text-[#ffffff]" />
                      <h3 className="text-xs font-bold tracking-[0.15em] text-[#fafafa]">BRAND IDENTITY</h3>
                    </div>
                    <span
                      className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded ${
                        brand
                          ? 'bg-[#22c554]/10 text-[#22c554]'
                          : 'bg-[#27272a] text-[#71717a]'
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
                        <p className="text-[9px] text-[#71717a] tracking-[0.15em] mb-2 font-medium">COLOR PALETTE</p>
                        <div className="flex gap-1">
                          {Object.values(brand.colors.primary).slice(0, 5).map((color, i) => (
                            <div
                              key={i}
                              className="flex-1 h-7 rounded-sm border border-[#27272a]/50 hover:scale-110 transition-transform cursor-pointer"
                              style={{ backgroundColor: color as string }}
                              title={color as string}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Secondary colors */}
                      <div>
                        <p className="text-[9px] text-[#71717a] tracking-[0.15em] mb-2 font-medium">SECONDARY</p>
                        <div className="flex gap-1">
                          {Object.values(brand.colors.secondary).slice(0, 5).map((color, i) => (
                            <div
                              key={i}
                              className="flex-1 h-5 rounded-sm border border-[#27272a]/50"
                              style={{ backgroundColor: color as string }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Typography Preview */}
                      <div>
                        <p className="text-[9px] text-[#71717a] tracking-[0.15em] mb-2 font-medium">TYPOGRAPHY</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#fafafa]">Heading</span>
                            <span className="text-[10px] text-[#71717a] font-mono">{brand.typography.heading.name}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#fafafa]">Body</span>
                            <span className="text-[10px] text-[#71717a] font-mono">{brand.typography.body.name}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTabChange('brand')}
                        className="w-full mt-2 py-2.5 border border-[#27272a] rounded text-[10px] font-bold tracking-[0.15em] text-[#fafafa] hover:bg-[#27272a]/50 hover:border-[#ffffff] transition-all flex items-center justify-center gap-2"
                      >
                        VIEW BRAND <IconExternalLink className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleTabChange('brand')}
                      className="w-full py-6 border border-dashed border-[#27272a] rounded text-[10px] font-bold tracking-[0.15em] text-[#71717a] hover:border-[#ffffff] hover:text-[#ffffff] transition-all flex items-center justify-center gap-2"
                    >
                      <IconPlus className="w-4 h-4" /> CREATE BRAND
                    </button>
                  )}
                </div>
              </div>

              {/* ── Pixel Art Card ──────────────────────────────────────── */}
              <div className="border border-[#27272a] bg-[#0a0a0a] rounded overflow-hidden group">
                <div className="p-4 border-b border-[#27272a]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconSprite className="w-4 h-4 text-[#ffffff]" />
                      <h3 className="text-xs font-bold tracking-[0.15em] text-[#fafafa]">PIXEL ART</h3>
                    </div>
                    <span className="text-[10px] text-[#71717a] tabular-nums font-bold">
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
                            className="aspect-square border border-[#27272a] rounded bg-[#000000] p-1.5 hover:border-[#ffffff] transition-colors cursor-pointer"
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
                        <p className="text-[10px] text-[#71717a] text-center">
                          +{sprites.length - 6} more
                        </p>
                      )}

                      <div className="space-y-1.5">
                        {sprites.slice(0, 2).map((sprite, i) => (
                          <div key={i} className="flex items-center gap-2 text-[10px]">
                            <div className="w-5 h-5 border border-[#27272a] rounded-sm bg-[#000000] overflow-hidden flex-shrink-0">
                              <img
                                src={sprite.imageData}
                                alt=""
                                className="w-full h-full"
                                style={{ imageRendering: 'pixelated' }}
                              />
                            </div>
                            <span className="text-[#71717a] truncate">{sprite.description}</span>
                            <span className="text-[#27272a] ml-auto flex-shrink-0">{sprite.size}px</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleTabChange('pixel')}
                        className="w-full mt-2 py-2.5 border border-[#27272a] rounded text-[10px] font-bold tracking-[0.15em] text-[#fafafa] hover:bg-[#27272a]/50 hover:border-[#ffffff] transition-all flex items-center justify-center gap-2"
                      >
                        MANAGE SPRITES <IconExternalLink className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleTabChange('pixel')}
                      className="w-full py-6 border border-dashed border-[#27272a] rounded text-[10px] font-bold tracking-[0.15em] text-[#71717a] hover:border-[#ffffff] hover:text-[#ffffff] transition-all flex items-center justify-center gap-2"
                    >
                      <IconPlus className="w-4 h-4" /> CREATE SPRITES
                    </button>
                  )}
                </div>
              </div>

              {/* ── Content Scripts Card ────────────────────────────────── */}
              <div className="border border-[#27272a] bg-[#0a0a0a] rounded overflow-hidden group">
                <div className="p-4 border-b border-[#27272a]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconScript className="w-4 h-4 text-[#ffffff]" />
                      <h3 className="text-xs font-bold tracking-[0.15em] text-[#fafafa]">CONTENT SCRIPTS</h3>
                    </div>
                    <span className="text-[10px] text-[#71717a] tabular-nums font-bold">
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
                            className="border border-[#27272a] rounded p-3 hover:border-[#ffffff]/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-[#fafafa] truncate font-medium">{script.topic}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[9px] text-[#ffffff] tracking-wider font-bold uppercase">
                                    {script.platform}
                                  </span>
                                  <span className="text-[#27272a]">·</span>
                                  <span className="text-[9px] text-[#71717a]">{script.duration}s</span>
                                  <span className="text-[#27272a]">·</span>
                                  <span className="text-[9px] text-[#71717a]">{script.tone}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleTabChange('content')}
                        className="w-full mt-2 py-2.5 border border-[#27272a] rounded text-[10px] font-bold tracking-[0.15em] text-[#fafafa] hover:bg-[#27272a]/50 hover:border-[#ffffff] transition-all flex items-center justify-center gap-2"
                      >
                        MANAGE SCRIPTS <IconExternalLink className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleTabChange('content')}
                      className="w-full py-6 border border-dashed border-[#27272a] rounded text-[10px] font-bold tracking-[0.15em] text-[#71717a] hover:border-[#ffffff] hover:text-[#ffffff] transition-all flex items-center justify-center gap-2"
                    >
                      <IconPlus className="w-4 h-4" /> CREATE SCRIPTS
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ─── Quick Actions Row ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Create Brand', icon: IconPalette, tab: 'brand' as TabId, desc: 'Colors, fonts, logos', ariaLabel: 'Create brand identity' },
                { label: 'Create Sprite', icon: IconSprite, tab: 'pixel' as TabId, desc: 'Pixel art characters', ariaLabel: 'Create pixel art sprite' },
                { label: 'Create Script', icon: IconScript, tab: 'content' as TabId, desc: 'Social media content', ariaLabel: 'Create content script' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleTabChange(action.tab)}
                  aria-label={action.ariaLabel}
                  className="border border-[#27272a] bg-[#0a0a0a] rounded p-4 text-left hover:border-[#ffffff] hover:bg-[#171717] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-[#ffffff]/10 flex items-center justify-center group-hover:bg-[#ffffff]/20 transition-colors">
                      <action.icon className="w-4 h-4 text-[#ffffff]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#fafafa] tracking-wider">{action.label.toUpperCase()}</p>
                      <p className="text-[10px] text-[#71717a] mt-0.5">{action.desc}</p>
                    </div>
                    <IconPlus className="w-4 h-4 text-[#27272a] ml-auto group-hover:text-[#ffffff] transition-colors" />
                  </div>
                </button>
              ))}
            </div>

            {/* ─── Export Section ─────────────────────────────────────────── */}
            <div className="border border-[#27272a] bg-[#0a0a0a] rounded p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <IconDownload className="w-4 h-4 text-[#ffffff]" />
                  <h3 className="text-xs font-bold tracking-[0.15em] text-[#fafafa]">EXPORT PROJECT</h3>
                </div>
                <p className="text-[10px] text-[#71717a]">
                  Download all your creative assets
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleExportJSON}
                  aria-label="Export as JSON"
                  disabled={!hasAnyContent || isExporting === 'json'}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 border border-[#27272a] rounded text-[10px] font-bold tracking-[0.15em] text-[#fafafa] hover:border-[#ffffff] hover:bg-[#000000] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#27272a] disabled:hover:bg-transparent"
                >
                  <IconJson className="w-4 h-4" />
                  {isExporting === 'json' ? 'EXPORTING...' : 'EXPORT JSON'}
                </button>
                <button
                  onClick={handleExportZIP}
                  aria-label="Export as ZIP"
                  disabled={!hasAnyContent || isExporting === 'zip'}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 border border-[#27272a] rounded text-[10px] font-bold tracking-[0.15em] text-[#fafafa] hover:border-[#ffffff] hover:bg-[#000000] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#27272a] disabled:hover:bg-transparent"
                >
                  <IconArchive className="w-4 h-4" />
                  {isExporting === 'zip' ? 'EXPORTING...' : 'EXPORT ZIP'}
                </button>
              </div>
              <p className="text-[9px] text-[#71717a] mt-3 tracking-wider">
                ZIP includes: Brand assets (colors, fonts, logos) · Sprite PNGs with metadata · Content scripts as text files
              </p>
            </div>

            {/* ─── Mood Sync Section ──────────────────────────────────────── */}
            {selectedMoods.length > 0 && (
              <div className="border border-[#27272a] bg-[#0a0a0a] rounded p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#ffffff] animate-pulse" />
                  <h3 className="text-xs font-bold tracking-[0.15em] text-[#fafafa]">MOOD SYNC ACTIVE</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMoods.map((mood) => (
                    <span
                      key={mood}
                      className="px-3 py-1.5 bg-[#ffffff]/10 border border-[#ffffff]/30 text-[#ffffff] text-[10px] font-bold tracking-[0.15em] rounded"
                    >
                      {mood.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'brand' && <BrandStudioTab />}
        {activeTab === 'pixel' && <PixelStudioTab />}
        {activeTab === 'content' && <ContentStudioTab />}

        {/* ─── Footer Info ────────────────────────────────────────────────── */}
        <div className="text-center py-4">
          <p className="text-[9px] text-[#27272a] tracking-[0.2em]">
            SPECTRACANVAS · ALL ASSETS STORED LOCALLY IN YOUR BROWSER
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Page wrapper with Suspense ──────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <p className="text-xs text-[#71717a] tracking-wider animate-pulse">LOADING...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
