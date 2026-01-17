import { create } from 'zustand';
import { Student } from '../types';
import { StudentsAPI } from '../services/api';

interface StudentState {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  loadStudents: () => Promise<void>;
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>) => Promise<Student | null>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  getStudentsByClass: (classId: string) => Student[];
  getStudentsByParent: (parentId: string) => Student[];
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  isLoading: true,
  error: null,

  loadStudents: async () => {
    try {
      set({ isLoading: true, error: null });
      const students = await StudentsAPI.getAll();
      const mapped = students.map((s: any) => ({ ...s, id: s._id || s.id, classId: s.classId?._id || s.classId }));
      set({ students: mapped, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addStudent: async (studentData) => {
    try {
      const newStudent = await StudentsAPI.create(studentData);
      const mapped = { ...newStudent, id: newStudent._id || newStudent.id };
      set({ students: [...get().students, mapped] });
      return mapped;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  updateStudent: async (id, updates) => {
    try {
      const updated = await StudentsAPI.update(id, updates);
      const mapped = { ...updated, id: updated._id || updated.id };
      set({ students: get().students.map(s => s.id === id ? mapped : s) });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteStudent: async (id) => {
    try {
      await StudentsAPI.delete(id);
      set({ students: get().students.filter(s => s.id !== id) });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  getStudentsByClass: (classId) => {
    return get().students.filter(s => s.classId === classId);
  },

  getStudentsByParent: (parentId) => {
    return get().students.filter(s => s.parentIds?.includes(parentId));
  },
}));
