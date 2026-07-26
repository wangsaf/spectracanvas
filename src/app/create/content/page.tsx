'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentForm, type ContentFormData } from '@/components/content/content-form';
import { ScriptPreview } from '@/components/content/script-preview';
import { MoodSelector } from '@/components/content/mood-selector';
import type { ContentScript, MoodKeyword } from '@/lib/types';
import { API_ROUTES } from '@/lib/constants';
import { suggestContentAdjustments } from '@/lib/mood/mood-mapper';
import { useProjectStore } from '@/lib/store/project-store';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { useToast } from '@/components/ui/toast';

export default function ContentStudioPage() {
  const router = useRouter();
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: formData.topic,
          platform: formData.platform,
          tone: formData.tone,
          duration: formData.duration,
          brandContext: brand?.name || formData.brandContext,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate script');
      }

      // Transform API response to match ContentScript type
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

  const handleSaveAndContinue = () => {
    if (script) {
      addScript(script);
      router.push('/dashboard');
    }
  };

  const moodAdjustments = selectedMoods.length > 0 && script
    ? suggestContentAdjustments(selectedMoods, script.platform)
    : null;

  return (
    <div className="min-h-screen bg-[#1c1915]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-wider mb-2">CONTENT STUDIO</h1>
            <p className="text-[#6b5f52] text-sm">
              Generate video scripts with AI-powered mood sync
            </p>
          </div>
          {script && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveScript}>
                [ SAVE SCRIPT ]
              </Button>
              <Button onClick={handleSaveAndContinue}>
                [ SAVE & CONTINUE ]
              </Button>
            </div>
          )}
        </div>

        {/* Saved Scripts Count */}
        {savedScripts.length > 0 && (
          <div className="mb-4 p-3 border border-[#3a322a] bg-[#241f1a] rounded">
            <p className="text-xs text-[#a09484]">
              {savedScripts.length} script{savedScripts.length !== 1 ? 's' : ''} saved to project
            </p>
          </div>
        )}

        {/* Main Content */}
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

              {/* Mood Selector */}
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
              <div className="border border-[#3a322a] bg-[#241f1a] p-12 text-center rounded">
                <div className="w-16 h-16 border-2 border-[#3a322a] mx-auto mb-4 flex items-center justify-center rounded">
                  <span className="text-2xl text-[#6b5f52]">[ ]</span>
                </div>
                <p className="text-sm text-[#6b5f52]">
                  Describe your content idea and click generate to create your script
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="border border-[#3a322a] bg-[#241f1a] p-12 text-center rounded">
                <LoadingSpinner size="lg" label="GENERATING SCRIPT..." className="mb-2" />
                <p className="text-xs text-[#6b5f52] mt-2">
                  Creating your content script with hooks, body, and CTAs
                </p>
              </div>
            )}

            {script && (
              <>
                {/* Script Preview */}
                <ScriptPreview script={script} />

                {/* Mood Adjustments */}
                {moodAdjustments && (
                  <div className="border border-[#3a322a] bg-[#241f1a] p-6 space-y-4 rounded">
                    <h3 className="text-sm font-bold tracking-wider text-[#d9453b]">
                      MOOD-BASED RECOMMENDATIONS
                    </h3>
                    
                    <div className="space-y-3 text-xs">
                      <div>
                        <p className="text-[#a09484] font-bold mb-1">VISUAL STYLE:</p>
                        <p className="text-neutral-300">{moodAdjustments.visualStyle}</p>
                      </div>
                      
                      <div>
                        <p className="text-[#a09484] font-bold mb-1">MUSIC:</p>
                        <p className="text-neutral-300">{moodAdjustments.musicSuggestion}</p>
                      </div>
                      
                      <div>
                        <p className="text-[#a09484] font-bold mb-1">TEXT STYLE:</p>
                        <p className="text-neutral-300">{moodAdjustments.textStyle}</p>
                      </div>
                      
                      <div>
                        <p className="text-[#a09484] font-bold mb-1">PACING:</p>
                        <p className="text-neutral-300">{moodAdjustments.pacing}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Captions */}
                {caption && (
                  <div className="border border-[#3a322a] bg-[#241f1a] p-6 space-y-4 rounded">
                    <h3 className="text-sm font-bold tracking-wider text-[#d9453b]">
                      CAPTIONS
                    </h3>

                    {caption.main && (
                      <div>
                        <p className="text-[#a09484] font-bold text-xs mb-1">MAIN CAPTION:</p>
                        <p className="text-neutral-300 text-sm">{caption.main}</p>
                      </div>
                    )}

                    {caption.hashtags && caption.hashtags.length > 0 && (
                      <div>
                        <p className="text-[#a09484] font-bold text-xs mb-1">HASHTAGS:</p>
                        <div className="flex flex-wrap gap-2">
                          {caption.hashtags.map((tag: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-1 border border-[#3a322a] text-neutral-400 rounded">
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {caption.variations && caption.variations.length > 0 && (
                      <div>
                        <p className="text-[#a09484] font-bold text-xs mb-1">VARIATIONS:</p>
                        <div className="space-y-2">
                          {caption.variations.map((v: string, i: number) => (
                            <p key={i} className="text-neutral-300 text-xs border-l-2 border-[#3a322a] pl-3">{v}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Posting Calendar */}
                {calendar && calendar.length > 0 && (
                  <div className="border border-[#3a322a] bg-[#241f1a] p-6 space-y-4 rounded">
                    <h3 className="text-sm font-bold tracking-wider text-[#d9453b]">
                      POSTING CALENDAR
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-[#3a322a]">
                            <th className="text-left text-[#a09484] font-bold py-2 pr-4">DATE</th>
                            <th className="text-left text-[#a09484] font-bold py-2 pr-4">PLATFORM</th>
                            <th className="text-left text-[#a09484] font-bold py-2 pr-4">TOPIC</th>
                            <th className="text-left text-[#a09484] font-bold py-2">TYPE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {calendar.map((entry: any, i: number) => (
                            <tr key={i} className="border-b border-[#3a322a]/50">
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

                {/* Storyboard Coming Soon */}
                <p className="text-[10px] text-[#6b5f52] text-center tracking-wider">
                  STORYBOARD — coming soon
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
