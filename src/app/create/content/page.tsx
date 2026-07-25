'use client';

import { useState } from 'react';
import ContentForm from '@/components/content/content-form';
import ScriptDisplay from '@/components/content/script-display';
import StoryboardView from '@/components/content/storyboard-view';
import CaptionCard from '@/components/content/caption-card';
import CalendarView from '@/components/content/calendar-view';
import { useContentStore } from '@/store/content-store';

const tabs = ['Script', 'Storyboard', 'Captions', 'Calendar'] as const;
type Tab = (typeof tabs)[number];

export default function ContentStudioPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Script');
  const [loading, setLoading] = useState(false);
  const { contentData, setContentData } = useContentStore();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/content/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData),
      });
      const data = await response.json();
      setContentData(data);
    } catch (error) {
      console.error('Content generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="font-mono text-xs text-[#555] mb-2">// CREATE / CONTENT</div>
          <h1 className="font-mono text-2xl tracking-wider">CONTENT STUDIO</h1>
          <p className="font-mono text-sm text-[#888] mt-1">
            Generate scripts, storyboards, captions, and content calendars.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Content Form */}
          <div className="border border-[#222] bg-[#111] p-6">
            <div className="font-mono text-xs text-[#555] mb-4">// INPUT</div>
            <ContentForm />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-6 w-full font-mono text-sm px-4 py-3 bg-[#00ff88] text-[#0a0a0a] hover:bg-[#00cc6a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '[ GENERATING... ]' : '[ GENERATE CONTENT ]'}
            </button>
          </div>

          {/* Right: Preview Panel */}
          <div className="border border-[#222] bg-[#111]">
            {/* Tabs */}
            <div className="flex border-b border-[#222] overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-mono text-xs px-4 py-3 tracking-wider transition-colors whitespace-nowrap ${
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
              {activeTab === 'Script' && (
                <div>
                  <div className="font-mono text-xs text-[#555] mb-4">// SCRIPT</div>
                  {contentData?.script ? (
                    <ScriptDisplay script={contentData.script} />
                  ) : (
                    <div className="font-mono text-xs text-[#333]">
                      No script generated yet. Fill the form and click GENERATE.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Storyboard' && (
                <div>
                  <div className="font-mono text-xs text-[#555] mb-4">// STORYBOARD</div>
                  {contentData?.storyboard ? (
                    <StoryboardView frames={contentData.storyboard} />
                  ) : (
                    <div className="font-mono text-xs text-[#333]">
                      No storyboard available.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Captions' && (
                <div>
                  <div className="font-mono text-xs text-[#555] mb-4">// CAPTIONS</div>
                  {contentData?.captions ? (
                    <CaptionCard caption={contentData.captions} />
                  ) : (
                    <div className="font-mono text-xs text-[#333]">
                      No captions generated yet.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Calendar' && (
                <div>
                  <div className="font-mono text-xs text-[#555] mb-4">// CONTENT CALENDAR</div>
                  {contentData?.calendar ? (
                    <CalendarView days={contentData.calendar} />
                  ) : (
                    <div className="font-mono text-xs text-[#333]">
                      No calendar data available.
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
