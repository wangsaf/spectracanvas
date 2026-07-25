import { create } from 'zustand';
import { Project } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  createProject: (name: string) => Project;
  setCurrentProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  currentProject: null,
  createProject: (name: string) => {
    const project: Project = {
      id: generateId(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ projects: [...state.projects, project], currentProject: project }));
    return project;
  },
  setCurrentProject: (project) => set({ currentProject: project }),
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p),
    currentProject: state.currentProject?.id === id ? { ...state.currentProject, ...updates, updatedAt: new Date().toISOString() } : state.currentProject,
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject,
  })),
}));
