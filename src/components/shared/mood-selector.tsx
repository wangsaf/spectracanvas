'use client';

import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  available: string[];
  selected: string[];
  onChange: (moods: string[]) => void;
  maxSelections?: number;
  className?: string;
}

export function MoodSelector({
  available,
  selected,
  onChange,
  maxSelections = 5,
  className,
}: MoodSelectorProps) {
  const toggleMood = (mood: string) => {
    if (selected.includes(mood)) {
      onChange(selected.filter((m) => m !== mood));
    } else if (selected.length < maxSelections) {
      onChange([...selected, mood]);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label className="font-mono text-xs text-gray-400 tracking-wider uppercase">
          mood keywords
        </label>
        <span className="font-mono text-xs text-gray-600">
          {selected.length}/{maxSelections}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {available.map((mood) => {
          const isSelected = selected.includes(mood);
          return (
            <button
              key={mood}
              onClick={() => toggleMood(mood)}
              disabled={!isSelected && selected.length >= maxSelections}
              className={cn(
                'font-mono text-xs px-3 py-1.5 border-2 transition-colors',
                isSelected
                  ? 'bg-white text-[#0a0a0a] border-white'
                  : 'bg-transparent text-gray-400 border-[#333] hover:border-gray-500 hover:text-gray-300',
                !isSelected && selected.length >= maxSelections && 'opacity-30 cursor-not-allowed'
              )}
            >
              {mood}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="pt-2 border-t border-[#222]">
          <p className="font-mono text-xs text-gray-500">
            selected: {selected.map((m) => `"${m}"`).join(' + ')}
          </p>
        </div>
      )}
    </div>
  );
}

export default MoodSelector;
