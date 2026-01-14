import { create } from 'zustand';
import { StudentProgress } from '../types';
import { StorageService } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId } from '../utils/helpers';

interface ProgressState {
  progress: StudentProgress[];
  isLoading: boolean;
  loadProgress: () => Promise<void>;
  addProgress: (progress: Omit<StudentProgress, 'id'>) => Promise<StudentProgress>;
  updateProgress: (id: string, updates: Partial<StudentProgress>) => Promise<void>;
  getStudentProgress: (studentId: string) => StudentProgress[];
  getAverageScores: (studentId: string) => { participation: number; understanding: number };
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: [],
  isLoading: true,

  loadProgress: async () => {
    const progress = await StorageService.get<StudentProgress[]>(STORAGE_KEYS.PROGRESS);
    set({ progress: progress || [], isLoading: false });
  },

  addProgress: async (progressData) => {
    const newProgress: StudentProgress = {
      ...progressData,
      id: generateId(),
    };
    const { progress } = get();
    const updated = [...progress, newProgress];
    await StorageService.set(STORAGE_KEYS.PROGRESS, updated);
    set({ progress: updated });
    return newProgress;
  },

  updateProgress: async (id, updates) => {
    const { progress } = get();
    const updated = progress.map(p => p.id === id ? { ...p, ...updates } : p);
    await StorageService.set(STORAGE_KEYS.PROGRESS, updated);
    set({ progress: updated });
  },

  getStudentProgress: (studentId) => {
    return get().progress.filter(p => p.studentId === studentId);
  },

  getAverageScores: (studentId) => {
    const studentProgress = get().progress.filter(p => p.studentId === studentId);
    if (studentProgress.length === 0) return { participation: 0, understanding: 0 };
    
    const participation = studentProgress.reduce((sum, p) => sum + p.participation, 0) / studentProgress.length;
    const understanding = studentProgress.reduce((sum, p) => sum + p.understanding, 0) / studentProgress.length;
    
    return { participation: Math.round(participation * 10) / 10, understanding: Math.round(understanding * 10) / 10 };
  },
}));
