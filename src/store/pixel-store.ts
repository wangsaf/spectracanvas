import { create } from 'zustand';
import type { PixelInput, PixelOutput, SpriteFrame } from '@/lib/types';

const defaultInput: PixelInput = { description: '', style: '16bit', size: 32 };

interface PixelStore {
  input: PixelInput;
  formData: PixelInput;
  pixelData: PixelOutput | null;
  output: PixelOutput | null;
  currentSprite: SpriteFrame | null;
  isGenerating: boolean;
  error: string | null;
  currentFrameIndex: number;
  isPlaying: boolean;
  animationSpeed: number;
  zoom: number;
  setInput: (input: Partial<PixelInput>) => void;
  setFormField: (field: string, value: any) => void;
  setPixelData: (data: PixelOutput | null) => void;
  setOutput: (output: PixelOutput) => void;
  setCurrentSprite: (sprite: SpriteFrame | null) => void;
  setGenerating: (isGenerating: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentFrameIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setAnimationSpeed: (speed: number) => void;
  setZoom: (zoom: number) => void;
  reset: () => void;
  resetForm: () => void;
}

export const usePixelStore = create<PixelStore>((set) => ({
  input: defaultInput,
  formData: defaultInput,
  pixelData: null,
  output: null,
  currentSprite: null,
  isGenerating: false,
  error: null,
  currentFrameIndex: 0,
  isPlaying: true,
  animationSpeed: 8,
  zoom: 8,
  setInput: (partial) => set((s) => ({ input: { ...s.input, ...partial }, formData: { ...s.formData, ...partial } })),
  setFormField: (field, value) => set((s) => ({ input: { ...s.input, [field]: value }, formData: { ...s.formData, [field]: value } })),
  setPixelData: (pixelData) => set({ pixelData, output: pixelData }),
  setOutput: (output) => set({ output, pixelData: output }),
  setCurrentSprite: (currentSprite) => set({ currentSprite }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  setCurrentFrameIndex: (currentFrameIndex) => set({ currentFrameIndex }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setAnimationSpeed: (animationSpeed) => set({ animationSpeed }),
  setZoom: (zoom) => set({ zoom }),
  reset: () => set({ input: defaultInput, formData: defaultInput, pixelData: null, output: null, currentSprite: null, isGenerating: false, error: null, currentFrameIndex: 0 }),
  resetForm: () => set({ input: defaultInput, formData: defaultInput }),
}));
