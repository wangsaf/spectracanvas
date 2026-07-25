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

export default function ContentStudioPage() {
  const router = useRouter();
  const { brand, scripts: savedScripts, addScript, setMoods } = useProjectStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<ContentScript | null>(null);
  const [selectedMoods, setSelectedMoods] = useState<MoodKeyword[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (formData: ContentFormData) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(API_ROUTES.content.generate, {
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

      setScript(result.data);
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
      alert('Script saved to project!');
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
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-wider mb-2">CONTENT STUDIO</h1>
            <p className="text-neutral-500 text-sm">
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
          <div className="mb-4 p-3 border border-[#222] bg-[#111]">
            <p className="text-xs text-neutral-400">
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
                <div className="p-4 border border-red-500 bg-red-500/10">
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
              <div className="border border-[#222] bg-[#111] p-12 text-center">
                <div className="w-16 h-16 border-2 border-[#222] mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-neutral-600">📝</span>
                </div>
                <p className="text-sm text-neutral-500">
                  Describe your content idea and click generate to create your script
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="border border-[#222] bg-[#111] p-12 text-center">
                <div className="w-16 h-16 border-2 border-[#00ff88] mx-auto mb-4 flex items-center justify-center animate-pulse">
                  <span className="text-2xl text-[#00ff88]">⚡</span>
                </div>
                <p className="text-sm text-[#00ff88] font-bold tracking-wider">
                  GENERATING SCRIPT...
                </p>
                <p className="text-xs text-neutral-500 mt-2">
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
                  <div className="border border-[#222] bg-[#111] p-6 space-y-4">
                    <h3 className="text-sm font-bold tracking-wider text-[#00ff88]">
                      MOOD-BASED RECOMMENDATIONS
                    </h3>
                    
                    <div className="space-y-3 text-xs">
                      <div>
                        <p className="text-neutral-400 font-bold mb-1">VISUAL STYLE:</p>
                        <p className="text-neutral-300">{moodAdjustments.visualStyle}</p>
                      </div>
                      
                      <div>
                        <p className="text-neutral-400 font-bold mb-1">MUSIC:</p>
                        <p className="text-neutral-300">{moodAdjustments.musicSuggestion}</p>
                      </div>
                      
                      <div>
                        <p className="text-neutral-400 font-bold mb-1">TEXT STYLE:</p>
                        <p className="text-neutral-300">{moodAdjustments.textStyle}</p>
                      </div>
                      
                      <div>
                        <p className="text-neutral-400 font-bold mb-1">PACING:</p>
                        <p className="text-neutral-300">{moodAdjustments.pacing}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Tools */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className="px-4 py-3 border border-[#222] bg-transparent text-neutral-400 hover:border-[#00ff88] hover:text-white transition-colors text-xs font-bold tracking-wider"
                    onClick={() => {
                      alert('Storyboard generator coming soon!');
                    }}
                  >
                    [ STORYBOARD ]
                  </button>
                  <button
                    className="px-4 py-3 border border-[#222] bg-transparent text-neutral-400 hover:border-[#00ff88] hover:text-white transition-colors text-xs font-bold tracking-wider"
                    onClick={() => {
                      alert('Caption generator coming soon!');
                    }}
                  >
                    [ CAPTIONS ]
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
