import { create } from 'zustand';
import type { ContentInput, ContentOutput } from '@/lib/types';

interface ContentStore {
  input: ContentInput;
  formData: ContentInput;
  contentData: ContentOutput | null;
  output: ContentOutput | null;
  isGenerating: boolean;
  error: string | null;
  selectedFrameIndex: number;
  setInput: (input: Partial<ContentInput>) => void;
  setFormField: (field: keyof ContentInput, value: any) => void;
  setContentData: (data: ContentOutput | null) => void;
  setOutput: (output: ContentOutput) => void;
  setGenerating: (isGenerating: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedFrameIndex: (index: number) => void;
  reset: () => void;
  resetForm: () => void;
}

const defaultInput: ContentInput = { topic: '', platform: 'tiktok', audience: '', tone: 'casual', duration: 30 };

export const useContentStore = create<ContentStore>((set) => ({
  input: defaultInput,
  formData: defaultInput,
  contentData: null,
  output: null,
  isGenerating: false,
  error: null,
  selectedFrameIndex: 0,
  setInput: (partial) => set((s) => ({ input: { ...s.input, ...partial }, formData: { ...s.formData, ...partial } })),
  setFormField: (field, value) => set((s) => ({ input: { ...s.input, [field]: value }, formData: { ...s.formData, [field]: value } })),
  setContentData: (contentData) => set({ contentData, output: contentData }),
  setOutput: (output) => set({ output, contentData: output }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  setSelectedFrameIndex: (selectedFrameIndex) => set({ selectedFrameIndex }),
  reset: () => set({ input: defaultInput, formData: defaultInput, contentData: null, output: null, isGenerating: false, error: null, selectedFrameIndex: 0 }),
  resetForm: () => set({ input: defaultInput, formData: defaultInput }),
}));
