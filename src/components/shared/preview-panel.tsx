'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { PreviewTab } from '@/lib/types';

interface PreviewPanelProps {
  tabs: PreviewTab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  children?: ReactNode;
  className?: string;
}

export function PreviewPanel({
  tabs,
  activeTabId,
  onTabChange,
  children,
  className,
}: PreviewPanelProps) {
  const [internalTab, setInternalTab] = useState(tabs[0]?.id ?? '');
  const activeId = activeTabId ?? internalTab;

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalTab(tabId);
    }
  };

  const activeTab = tabs.find((t) => t.id === activeId);

  return (
    <div
      className={cn(
        'flex flex-col bg-[#0a0a0a] border-2 border-[#222]',
        className
      )}
    >
      {/* Tab bar */}
      <div className="flex border-b-2 border-[#222]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              'font-mono text-xs px-4 py-2 border-r-2 border-[#222] transition-colors',
              activeId === tab.id
                ? 'bg-[#111] text-white'
                : 'text-gray-500 hover:text-gray-300 hover:bg-[#0d0d0d]'
            )}
          >
            {tab.label}
          </button>
        ))}
        <div className="flex-1 bg-[#0a0a0a]" />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        {activeTab?.content ?? children ?? (
          <div className="flex items-center justify-center h-full font-mono text-sm text-gray-600">
            -- no preview available --
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviewPanel;
