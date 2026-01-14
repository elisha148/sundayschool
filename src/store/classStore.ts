import { create } from 'zustand';
import { Class } from '../types';
import { StorageService } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId } from '../utils/helpers';

interface ClassState {
  classes: Class[];
  isLoading: boolean;
  loadClasses: () => Promise<void>;
  addClass: (classData: Omit<Class, 'id'>) => Promise<Class>;
  updateClass: (id: string, updates: Partial<Class>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  getClassesByTeacher: (teacherId: string) => Class[];
}

export const useClassStore = create<ClassState>((set, get) => ({
  classes: [],
  isLoading: true,

  loadClasses: async () => {
    const classes = await StorageService.get<Class[]>(STORAGE_KEYS.CLASSES);
    set({ classes: classes || [], isLoading: false });
  },

  addClass: async (classData) => {
    const newClass: Class = {
      ...classData,
      id: generateId(),
    };
    const { classes } = get();
    const updated = [...classes, newClass];
    await StorageService.set(STORAGE_KEYS.CLASSES, updated);
    set({ classes: updated });
    return newClass;
  },

  updateClass: async (id, updates) => {
    const { classes } = get();
    const updated = classes.map(c => c.id === id ? { ...c, ...updates } : c);
    await StorageService.set(STORAGE_KEYS.CLASSES, updated);
    set({ classes: updated });
  },

  deleteClass: async (id) => {
    const { classes } = get();
    const updated = classes.filter(c => c.id !== id);
    await StorageService.set(STORAGE_KEYS.CLASSES, updated);
    set({ classes: updated });
  },

  getClassesByTeacher: (teacherId) => {
    return get().classes.filter(c => c.teacherIds.includes(teacherId));
  },
}));
