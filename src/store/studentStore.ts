import { create } from 'zustand';
import { Student } from '../types';
import { StorageService } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId } from '../utils/helpers';

interface StudentState {
  students: Student[];
  isLoading: boolean;
  loadStudents: () => Promise<void>;
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>) => Promise<Student>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  getStudentsByClass: (classId: string) => Student[];
  getStudentsByParent: (parentId: string) => Student[];
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  isLoading: true,

  loadStudents: async () => {
    const students = await StorageService.get<Student[]>(STORAGE_KEYS.STUDENTS);
    set({ students: students || [], isLoading: false });
  },

  addStudent: async (studentData) => {
    const newStudent: Student = {
      ...studentData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const { students } = get();
    const updated = [...students, newStudent];
    await StorageService.set(STORAGE_KEYS.STUDENTS, updated);
    set({ students: updated });
    return newStudent;
  },

  updateStudent: async (id, updates) => {
    const { students } = get();
    const updated = students.map(s => s.id === id ? { ...s, ...updates } : s);
    await StorageService.set(STORAGE_KEYS.STUDENTS, updated);
    set({ students: updated });
  },

  deleteStudent: async (id) => {
    const { students } = get();
    const updated = students.filter(s => s.id !== id);
    await StorageService.set(STORAGE_KEYS.STUDENTS, updated);
    set({ students: updated });
  },

  getStudentsByClass: (classId) => {
    return get().students.filter(s => s.classId === classId);
  },

  getStudentsByParent: (parentId) => {
    return get().students.filter(s => s.parentIds.includes(parentId));
  },
}));
