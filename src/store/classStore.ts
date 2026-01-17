import { create } from 'zustand';
import { Class } from '../types';
import { ClassesAPI } from '../services/api';

interface ClassState {
  classes: Class[];
  isLoading: boolean;
  error: string | null;
  loadClasses: () => Promise<void>;
  addClass: (classData: Omit<Class, 'id'>) => Promise<Class | null>;
  updateClass: (id: string, updates: Partial<Class>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  getClassesByTeacher: (teacherId: string) => Class[];
}

export const useClassStore = create<ClassState>((set, get) => ({
  classes: [],
  isLoading: true,
  error: null,

  loadClasses: async () => {
    try {
      set({ isLoading: true, error: null });
      const classes = await ClassesAPI.getAll();
      const mapped = classes.map((c: any) => ({ ...c, id: c._id || c.id }));
      set({ classes: mapped, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addClass: async (classData) => {
    try {
      const newClass = await ClassesAPI.create(classData);
      const mapped = { ...newClass, id: newClass._id || newClass.id };
      set({ classes: [...get().classes, mapped] });
      return mapped;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  updateClass: async (id, updates) => {
    try {
      const updated = await ClassesAPI.update(id, updates);
      const mapped = { ...updated, id: updated._id || updated.id };
      set({ classes: get().classes.map(c => c.id === id ? mapped : c) });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteClass: async (id) => {
    try {
      await ClassesAPI.delete(id);
      set({ classes: get().classes.filter(c => c.id !== id) });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  getClassesByTeacher: (teacherId) => {
    return get().classes.filter(c => c.teacherIds?.includes(teacherId));
  },
}));
