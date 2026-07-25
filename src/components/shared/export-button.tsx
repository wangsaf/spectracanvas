'use client';

import { useState, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ExportButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onExport?: () => void | Promise<void>;
  format?: string;
  label?: string;
}

export function ExportButton({
  onExport,
  format = 'PNG',
  label,
  className,
  disabled,
  ...props
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleClick = async () => {
    if (!onExport || isExporting) return;
    setIsExporting(true);
    try {
      await onExport();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isExporting}
      className={cn(
        'font-mono text-sm px-4 py-2 border-2 border-white text-white',
        'hover:bg-white hover:text-[#0a0a0a] transition-colors',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white',
        isExporting && 'animate-pulse',
        className
      )}
      {...props}
    >
      {isExporting ? (
        <span>EXPORTING...</span>
      ) : (
        <span>{label ?? `[ EXPORT ${format.toUpperCase()} ]`}</span>
      )}
    </button>
  );
}

export default ExportButton;
