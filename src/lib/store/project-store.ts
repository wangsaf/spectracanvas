import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BrandIdentity, CharacterSprite, ContentScript, MoodKeyword } from '@/lib/types';

// ========================================
// PROJECT STORE
// ========================================

interface ProjectState {
  // Project metadata
  projectName: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;

  // Module data
  brand: BrandIdentity | null;
  sprites: CharacterSprite[];
  scripts: ContentScript[];
  selectedMoods: MoodKeyword[];

  // Actions
  setProjectName: (name: string) => void;
  setBrand: (brand: BrandIdentity) => void;
  addSprite: (sprite: CharacterSprite) => void;
  removeSprite: (index: number) => void;
  addScript: (script: ContentScript) => void;
  removeScript: (index: number) => void;
  setMoods: (moods: MoodKeyword[]) => void;
  clearProject: () => void;
  updateTimestamp: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      // Initial state
      projectName: 'Untitled Project',
      projectId: generateProjectId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      brand: null,
      sprites: [],
      scripts: [],
      selectedMoods: [],

      // Actions
      setProjectName: (name) =>
        set((state) => ({
          projectName: name,
          updatedAt: new Date().toISOString(),
        })),

      setBrand: (brand) =>
        set((state) => ({
          brand,
          updatedAt: new Date().toISOString(),
        })),

      addSprite: (sprite) =>
        set((state) => ({
          sprites: [...state.sprites, sprite],
          updatedAt: new Date().toISOString(),
        })),

      removeSprite: (index) =>
        set((state) => ({
          sprites: state.sprites.filter((_, i) => i !== index),
          updatedAt: new Date().toISOString(),
        })),

      addScript: (script) =>
        set((state) => ({
          scripts: [...state.scripts, script],
          updatedAt: new Date().toISOString(),
        })),

      removeScript: (index) =>
        set((state) => ({
          scripts: state.scripts.filter((_, i) => i !== index),
          updatedAt: new Date().toISOString(),
        })),

      setMoods: (moods) =>
        set((state) => ({
          selectedMoods: moods,
          updatedAt: new Date().toISOString(),
        })),

      clearProject: () =>
        set({
          projectName: 'Untitled Project',
          projectId: generateProjectId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          brand: null,
          sprites: [],
          scripts: [],
          selectedMoods: [],
        }),

      updateTimestamp: () =>
        set({
          updatedAt: new Date().toISOString(),
        }),
    }),
    {
      name: 'spectracanvas-project',
    }
  )
);

/**
 * Generate unique project ID
 */
function generateProjectId(): string {
  return `project-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Export project data as JSON
 */
export function exportProjectData(state: ProjectState): string {
  return JSON.stringify(
    {
      projectName: state.projectName,
      projectId: state.projectId,
      createdAt: state.createdAt,
      updatedAt: state.updatedAt,
      brand: state.brand,
      sprites: state.sprites,
      scripts: state.scripts,
      selectedMoods: state.selectedMoods,
    },
    null,
    2
  );
}

/**
 * Calculate project completion percentage
 */
export function calculateProjectCompletion(state: ProjectState): number {
  let completed = 0;
  const total = 3;

  if (state.brand) completed++;
  if (state.sprites.length > 0) completed++;
  if (state.scripts.length > 0) completed++;

  return Math.round((completed / total) * 100);
}
