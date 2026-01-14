import { create } from 'zustand';
import { LessonPlan } from '../types';
import { StorageService } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId } from '../utils/helpers';

interface LessonState {
  lessons: LessonPlan[];
  isLoading: boolean;
  loadLessons: () => Promise<void>;
  addLesson: (lesson: Omit<LessonPlan, 'id'>) => Promise<LessonPlan>;
  updateLesson: (id: string, updates: Partial<LessonPlan>) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
  getLessonsByClass: (classId: string) => LessonPlan[];
  markLessonComplete: (id: string) => Promise<void>;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  lessons: [],
  isLoading: true,

  loadLessons: async () => {
    const lessons = await StorageService.get<LessonPlan[]>(STORAGE_KEYS.LESSONS);
    set({ lessons: lessons || [], isLoading: false });
  },

  addLesson: async (lessonData) => {
    const newLesson: LessonPlan = {
      ...lessonData,
      id: generateId(),
    };
    const { lessons } = get();
    const updated = [...lessons, newLesson];
    await StorageService.set(STORAGE_KEYS.LESSONS, updated);
    set({ lessons: updated });
    return newLesson;
  },

  updateLesson: async (id, updates) => {
    const { lessons } = get();
    const updated = lessons.map(l => l.id === id ? { ...l, ...updates } : l);
    await StorageService.set(STORAGE_KEYS.LESSONS, updated);
    set({ lessons: updated });
  },

  deleteLesson: async (id) => {
    const { lessons } = get();
    const updated = lessons.filter(l => l.id !== id);
    await StorageService.set(STORAGE_KEYS.LESSONS, updated);
    set({ lessons: updated });
  },

  getLessonsByClass: (classId) => {
    return get().lessons.filter(l => l.classId === classId);
  },

  markLessonComplete: async (id) => {
    const { lessons } = get();
    const updated = lessons.map(l => l.id === id ? { ...l, completed: true } : l);
    await StorageService.set(STORAGE_KEYS.LESSONS, updated);
    set({ lessons: updated });
  },
}));
