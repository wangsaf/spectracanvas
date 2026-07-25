'use client';

import { useState } from 'react';
import type { ColorPalette } from '@/lib/types';
import { cn, generateId } from '@/lib/utils';
import { usePixelStore } from '@/store/pixel-store';

interface PaletteEditorProps {
  className?: string;
}

export default function PaletteEditor({ className }: PaletteEditorProps) {
  const { currentPalette, setPalette, addColor, removeColor, updateColor } = usePixelStore();
  const [newColor, setNewColor] = useState('#ffffff');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  function handleAddColor() {
    if (currentPalette.colors.length >= 256) return;
    addColor(newColor);
  }

  function handleStartEdit(index: number) {
    setEditingIndex(index);
    setEditValue(currentPalette.colors[index]);
  }

  function handleSaveEdit(index: number) {
    if (/^#[0-9a-fA-F]{6}$/.test(editValue)) {
      updateColor(index, editValue);
    }
    setEditingIndex(null);
  }

  function handleRenamePalette(name: string) {
    setPalette({ ...currentPalette, name });
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
        Palette Editor
      </div>

      {/* Palette Name */}
      <div className="flex items-center gap-2">
        <label className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
          Name
        </label>
        <input
          type="text"
          value={currentPalette.name}
          onChange={(e) => handleRenamePalette(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-8 gap-1">
        {currentPalette.colors.map((color, index) => (
          <div
            key={`${index}-${color}`}
            className="group relative"
          >
            {editingIndex === index ? (
              <div className="flex flex-col gap-0.5">
                <input
                  type="color"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full h-6 cursor-pointer bg-transparent border-none"
                />
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(index);
                    if (e.key === 'Escape') setEditingIndex(null);
                  }}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded px-1 text-[8px] font-mono text-zinc-300 focus:outline-none"
                  autoFocus
                />
                <div className="flex gap-0.5">
                  <button
                    onClick={() => handleSaveEdit(index)}
                    className="flex-1 text-[8px] font-bold bg-emerald-700 text-white py-0.5 hover:bg-emerald-600"
                  >
                    OK
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="flex-1 text-[8px] font-bold bg-zinc-700 text-zinc-300 py-0.5 hover:bg-zinc-600"
                  >
                    X
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleStartEdit(index)}
                  className="w-full aspect-square border border-zinc-700 hover:border-zinc-400 transition-colors relative"
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-[7px] font-mono opacity-0 group-hover:opacity-100 bg-black/50 text-white transition-opacity">
                    {color}
                  </span>
                </button>
                <button
                  onClick={() => removeColor(index)}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 text-white text-[7px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  x
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add Color */}
      <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="w-8 h-8 cursor-pointer bg-transparent border border-zinc-700"
        />
        <input
          type="text"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 font-mono w-24 focus:outline-none focus:border-amber-500"
        />
        <button
          onClick={handleAddColor}
          disabled={currentPalette.colors.length >= 256}
          className={cn(
            'px-3 py-1.5 text-xs font-bold tracking-wider border transition-colors',
            currentPalette.colors.length >= 256
              ? 'border-zinc-800 text-zinc-600 cursor-not-allowed'
              : 'border-zinc-700 text-zinc-300 hover:border-emerald-500 hover:text-emerald-400'
          )}
        >
          + ADD
        </button>
      </div>

      {/* Color Count */}
      <div className="text-[10px] font-mono text-zinc-600">
        {currentPalette.colors.length} / 256 colors
      </div>
    </div>
  );
}
