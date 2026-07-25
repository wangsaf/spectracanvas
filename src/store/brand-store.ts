import { create } from 'zustand';
import type { BrandInput, BrandOutput } from '@/lib/types';

interface BrandStore {
  input: BrandInput;
  brandData: BrandOutput | null;
  output: BrandOutput | null;
  result: BrandOutput | null;
  isGenerating: boolean;
  error: string | null;
  setInput: (input: Partial<BrandInput>) => void;
  setBrandData: (data: BrandOutput | null) => void;
  setOutput: (output: BrandOutput) => void;
  setGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  setName: (name: string) => void;
  setIndustry: (industry: string) => void;
  toggleValue: (value: string) => void;
  setAudience: (audience: string) => void;
  setMood: (mood: string) => void;
  generateBrand: () => void;
  reset: () => void;
}

const defaultInput: BrandInput = { name: '', industry: '', values: [], audience: '', mood: '' };

export const useBrandStore = create<BrandStore>((set) => ({
  input: defaultInput,
  brandData: null,
  output: null,
  result: null,
  isGenerating: false,
  error: null,
  setInput: (partial) => set((s) => ({ input: { ...s.input, ...partial } })),
  setBrandData: (brandData) => set({ brandData, output: brandData, result: brandData }),
  setOutput: (output) => set({ output, result: output, brandData: output }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  setName: (name) => set((s) => ({ input: { ...s.input, name } })),
  setIndustry: (industry) => set((s) => ({ input: { ...s.input, industry } })),
  toggleValue: (value) => set((s) => ({
    input: { ...s.input, values: s.input.values.includes(value) ? s.input.values.filter(v => v !== value) : [...s.input.values, value] }
  })),
  setAudience: (audience) => set((s) => ({ input: { ...s.input, audience } })),
  setMood: (mood) => set((s) => ({ input: { ...s.input, mood } })),
  generateBrand: () => {},
  reset: () => set({ input: defaultInput, brandData: null, output: null, result: null, isGenerating: false, error: null }),
}));
