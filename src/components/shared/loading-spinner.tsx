'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({ size = 'md', label, className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className={cn('relative', SIZE_MAP[size])}>
        {/* Pixel art spinner using CSS */}
        <div className="pixel-spinner">
          <div className="pixel-block pixel-block-1" />
          <div className="pixel-block pixel-block-2" />
          <div className="pixel-block pixel-block-3" />
          <div className="pixel-block pixel-block-4" />
        </div>
      </div>

      {label && (
        <p className="font-mono text-xs text-gray-500 tracking-wider uppercase">
          {label}
        </p>
      )}

      <style>{`
        .pixel-spinner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          width: 100%;
          height: 100%;
          gap: 2px;
          animation: pixel-rotate 1s steps(4) infinite;
        }
        .pixel-block {
          background-color: #fff;
        }
        .pixel-block-1 {
          animation: pixel-blink 1s steps(1) infinite 0s;
        }
        .pixel-block-2 {
          animation: pixel-blink 1s steps(1) infinite 0.25s;
        }
        .pixel-block-3 {
          animation: pixel-blink 1s steps(1) infinite 0.75s;
        }
        .pixel-block-4 {
          animation: pixel-blink 1s steps(1) infinite 0.5s;
        }
        @keyframes pixel-blink {
          0%, 100% { opacity: 0.2; }
          25% { opacity: 1; }
        }
        @keyframes pixel-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner;
