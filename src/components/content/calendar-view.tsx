'use client';

import type { CalendarDay, CalendarEntry, Platform } from '@/lib/types';
import { cn, PLATFORM_LABELS } from '@/lib/utils';

interface CalendarViewProps {
  days: CalendarDay[];
  className?: string;
}

const TYPE_STYLES: Record<string, string> = {
  post: 'border-zinc-500 bg-zinc-900',
  story: 'border-purple-500 bg-purple-950',
  reel: 'border-pink-500 bg-pink-950',
  video: 'border-red-500 bg-red-950',
  live: 'border-orange-500 bg-orange-950',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'DRAFT',
  scheduled: 'SCHED',
  published: 'LIVE',
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'text-zinc-500',
  scheduled: 'text-amber-400',
  published: 'text-emerald-400',
};

const PLATFORM_BADGES: Record<Platform, string> = {
  tiktok: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  instagram: 'bg-pink-950 text-pink-300 border-pink-800',
  youtube: 'bg-red-950 text-red-300 border-red-800',
  twitter: 'bg-blue-950 text-blue-300 border-blue-800',
  linkedin: 'bg-sky-950 text-sky-300 border-sky-800',
};

export default function CalendarView({ days, className }: CalendarViewProps) {
  if (days.length === 0) {
    return (
      <div className={cn(
        'flex items-center justify-center h-48 text-zinc-600 text-xs font-mono',
        className
      )}>
        [ No calendar data ]
      </div>
    );
  }

  const weekDays = days.slice(0, 7);

  return (
    <div className={cn('flex flex-col gap-4 w-full max-w-5xl', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
          Weekly Content Calendar
        </span>
        <span className="text-[10px] font-mono text-zinc-600">
          {weekDays[0]?.date} -- {weekDays[weekDays.length - 1]?.date}
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {weekDays.map((day) => (
          <div
            key={`header-${day.date}`}
            className="text-center py-2 border-b-2 border-zinc-800"
          >
            <div className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              {day.dayName.slice(0, 3)}
            </div>
            <div className="text-[10px] font-mono text-zinc-600">
              {day.date}
            </div>
          </div>
        ))}

        {/* Day cells */}
        {weekDays.map((day) => (
          <div
            key={day.date}
            className="min-h-[160px] bg-zinc-950 border border-zinc-800 p-1.5 flex flex-col gap-1"
          >
            {day.entries.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-[9px] font-mono text-zinc-700">
                -
              </div>
            ) : (
              day.entries.map((entry) => (
                <CalendarCell key={entry.id} entry={entry} />
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface CalendarCellProps {
  entry: CalendarEntry;
}

function CalendarCell({ entry }: CalendarCellProps) {
  return (
    <div
      className={cn(
        'p-1.5 border-l-2 text-left',
        TYPE_STYLES[entry.type] || TYPE_STYLES.post
      )}
    >
      {/* Time */}
      <div className="text-[8px] font-mono text-zinc-500 mb-0.5">
        {entry.time}
      </div>

      {/* Title */}
      <div className="text-[9px] font-bold text-zinc-200 leading-tight mb-1 line-clamp-2">
        {entry.title}
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className={cn(
          'text-[7px] font-bold tracking-wider px-1 border',
          PLATFORM_BADGES[entry.platform]
        )}>
          {PLATFORM_LABELS[entry.platform]?.slice(0, 4) || entry.platform}
        </span>
        <span className={cn(
          'text-[7px] font-bold tracking-wider',
          STATUS_COLORS[entry.status]
        )}>
          {STATUS_LABELS[entry.status]}
        </span>
      </div>
    </div>
  );
}
