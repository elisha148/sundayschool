import { create } from 'zustand';
import { LessonPlan } from '../types';
import { LessonsAPI } from '../services/api';

interface LessonState {
  lessons: LessonPlan[];
  isLoading: boolean;
  error: string | null;
  loadLessons: () => Promise<void>;
  addLesson: (lesson: Omit<LessonPlan, 'id'>) => Promise<LessonPlan | null>;
  updateLesson: (id: string, updates: Partial<LessonPlan>) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
  getLessonsByClass: (classId: string) => LessonPlan[];
  markLessonComplete: (id: string) => Promise<void>;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  lessons: [],
  isLoading: true,
  error: null,

  loadLessons: async () => {
    try {
      set({ isLoading: true, error: null });
      const lessons = await LessonsAPI.getAll();
      const mapped = lessons.map((l: any) => ({ ...l, id: l._id || l.id, classId: l.classId?._id || l.classId }));
      set({ lessons: mapped, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addLesson: async (lessonData) => {
    try {
      const newLesson = await LessonsAPI.create(lessonData);
      const mapped = { ...newLesson, id: newLesson._id || newLesson.id };
      set({ lessons: [...get().lessons, mapped] });
      return mapped;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  updateLesson: async (id, updates) => {
    try {
      const updated = await LessonsAPI.update(id, updates);
      const mapped = { ...updated, id: updated._id || updated.id };
      set({ lessons: get().lessons.map(l => l.id === id ? mapped : l) });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteLesson: async (id) => {
    try {
      await LessonsAPI.delete(id);
      set({ lessons: get().lessons.filter(l => l.id !== id) });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  getLessonsByClass: (classId) => {
    return get().lessons.filter(l => l.classId === classId);
  },

  markLessonComplete: async (id) => {
    try {
      await LessonsAPI.markComplete(id);
      set({ lessons: get().lessons.map(l => l.id === id ? { ...l, completed: true } : l) });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
