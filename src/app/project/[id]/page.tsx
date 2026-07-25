'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useProjectStore } from '@/store/project-store';

const tabs = ['Brand', 'Pixel', 'Content'] as const;
type Tab = (typeof tabs)[number];

export default function ProjectViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<Tab>('Brand');
  const [downloading, setDownloading] = useState(false);
  const { projects } = useProjectStore();

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <pre className="font-mono text-[#333] text-xs mb-4">
{`    ____
   /    \\
  | 404  |
  |      |
   \\____/`}
          </pre>
          <h1 className="font-mono text-xl mb-4">PROJECT NOT FOUND</h1>
          <p className="font-mono text-xs text-[#555] mb-6">
            The project you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/dashboard"
            className="font-mono text-sm px-6 py-3 bg-[#00ff88] text-[#0a0a0a] hover:bg-[#00cc6a] transition-colors inline-block"
          >
            [ BACK TO DASHBOARD ]
          </Link>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`/api/project/${id}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <div className="font-mono text-xs text-[#555] mb-2">
              // PROJECT / {id}
            </div>
            <h1 className="font-mono text-2xl tracking-wider">
              {project.name}
            </h1>
            <div className="font-mono text-xs text-[#555] mt-1">
              TYPE: {project.type.toUpperCase()} // CREATED: {project.createdAt}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="font-mono text-xs px-4 py-2 bg-[#00ff88] text-[#0a0a0a] hover:bg-[#00cc6a] transition-colors disabled:opacity-50"
            >
              {downloading ? '[ PACKING... ]' : '[ DOWNLOAD ZIP ]'}
            </button>
            <Link
              href="/dashboard"
              className="font-mono text-xs px-4 py-2 border border-[#222] text-[#888] hover:text-white hover:border-[#00ff88] transition-colors"
            >
              [ BACK ]
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#222] mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-mono text-xs px-6 py-3 tracking-wider transition-colors ${
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
        <div className="border border-[#222] bg-[#111] p-6">
          {activeTab === 'Brand' && (
            <div>
              <div className="font-mono text-xs text-[#555] mb-4">// BRAND OUTPUT</div>
              {project.brandData ? (
                <div className="space-y-6">
                  {project.brandData.colors && (
                    <div>
                      <h3 className="font-mono text-xs text-[#888] mb-3">COLORS</h3>
                      <div className="flex gap-2">
                        {project.brandData.colors.map((color: string, i: number) => (
                          <div key={i} className="text-center">
                            <div
                              className="w-12 h-12 mb-1"
                              style={{ backgroundColor: color }}
                            />
                            <span className="font-mono text-[10px] text-[#888]">
                              {color}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.brandData.fonts && (
                    <div>
                      <h3 className="font-mono text-xs text-[#888] mb-3">FONTS</h3>
                      <div className="space-y-2">
                        {project.brandData.fonts.map((font: string, i: number) => (
                          <div key={i} className="font-mono text-sm text-white border border-[#222] p-3">
                            {font}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="font-mono text-xs text-[#333]">
                  No brand data for this project.
                </div>
              )}
            </div>
          )}

          {activeTab === 'Pixel' && (
            <div>
              <div className="font-mono text-xs text-[#555] mb-4">// PIXEL OUTPUT</div>
              {project.pixelData ? (
                <div>
                  {project.pixelData.sprite && (
                    <pre className="font-mono text-xs text-[#00ff88] bg-[#0a0a0a] p-4">
                      {JSON.stringify(project.pixelData.sprite, null, 2)}
                    </pre>
                  )}
                </div>
              ) : (
                <div className="font-mono text-xs text-[#333]">
                  No pixel art data for this project.
                </div>
              )}
            </div>
          )}

          {activeTab === 'Content' && (
            <div>
              <div className="font-mono text-xs text-[#555] mb-4">// CONTENT OUTPUT</div>
              {project.contentData ? (
                <div>
                  {project.contentData.script && (
                    <pre className="font-mono text-xs text-white bg-[#0a0a0a] p-4 whitespace-pre-wrap">
                      {project.contentData.script}
                    </pre>
                  )}
                </div>
              ) : (
                <div className="font-mono text-xs text-[#333]">
                  No content data for this project.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
