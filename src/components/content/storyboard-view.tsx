'use client';

import type { StoryboardFrame } from '@/lib/types';
import { cn, SHOT_TYPE_LABELS, SHOT_TYPE_ICONS } from '@/lib/utils';
import { useContentStore } from '@/store/content-store';

interface StoryboardViewProps {
  frames: StoryboardFrame[];
  className?: string;
}

export default function StoryboardView({ frames, className }: StoryboardViewProps) {
  const { selectedFrameIndex, setSelectedFrameIndex } = useContentStore();

  if (frames.length === 0) {
    return (
      <div className={cn(
        'flex items-center justify-center h-48 text-zinc-600 text-xs font-mono',
        className
      )}>
        [ No storyboard frames ]
      </div>
    );
  }

  const selectedFrame = frames[selectedFrameIndex];

  return (
    <div className={cn('flex flex-col gap-4 w-full max-w-3xl', className)}>
      {/* Frame thumbnails strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {frames.map((frame, index) => (
          <button
            key={frame.id}
            onClick={() => setSelectedFrameIndex(index)}
            className={cn(
              'flex-shrink-0 w-24 flex flex-col items-center gap-1 p-2 border-2 transition-all',
              index === selectedFrameIndex
                ? 'border-cyan-500 bg-zinc-900'
                : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
            )}
          >
            {/* Shot type icon (text-based) */}
            <div className={cn(
              'w-full aspect-[4/3] flex items-center justify-center text-[9px] font-bold tracking-wider',
              index === selectedFrameIndex
                ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
            )}>
              {SHOT_TYPE_ICONS[frame.shotType] || '[?]'}
            </div>
            <span className="text-[9px] font-mono text-zinc-500">
              {index + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Selected frame detail */}
      {selectedFrame && (
        <div className="bg-zinc-900 border-2 border-zinc-800 p-5 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-zinc-100">
                Frame {selectedFrameIndex + 1} of {frames.length}
              </span>
              <span className="text-xs font-bold tracking-wider text-cyan-400 px-2 py-0.5 border border-cyan-700 bg-cyan-950">
                {SHOT_TYPE_ICONS[selectedFrame.shotType]}
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              {selectedFrame.duration}s
            </span>
          </div>

          {/* Shot Type */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Shot Type
            </span>
            <span className="text-sm text-zinc-200 font-mono">
              {SHOT_TYPE_LABELS[selectedFrame.shotType] || selectedFrame.shotType}
            </span>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Description
            </span>
            <p className="text-sm text-zinc-200 font-mono leading-relaxed">
              {selectedFrame.description}
            </p>
          </div>

          {/* Dialogue */}
          {selectedFrame.dialogue && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                Dialogue
              </span>
              <p className="text-sm text-zinc-100 font-mono italic leading-relaxed pl-3 border-l-2 border-zinc-700">
                &quot;{selectedFrame.dialogue}&quot;
              </p>
            </div>
          )}

          {/* Camera Movement */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Camera Movement
            </span>
            <span className="text-sm text-zinc-300 font-mono">
              {selectedFrame.cameraMovement}
            </span>
          </div>

          {/* Notes */}
          {selectedFrame.notes && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                Notes
              </span>
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                {selectedFrame.notes}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-2 pt-2 border-t border-zinc-800">
            <button
              onClick={() => setSelectedFrameIndex(Math.max(0, selectedFrameIndex - 1))}
              disabled={selectedFrameIndex === 0}
              className="px-3 py-1.5 text-xs font-bold border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-30"
            >
              &lt; Prev
            </button>
            <button
              onClick={() => setSelectedFrameIndex(Math.min(frames.length - 1, selectedFrameIndex + 1))}
              disabled={selectedFrameIndex === frames.length - 1}
              className="px-3 py-1.5 text-xs font-bold border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-30"
            >
              Next &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
