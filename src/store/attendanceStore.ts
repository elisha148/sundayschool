import { create } from 'zustand';
import { AttendanceRecord } from '../types';
import { StorageService } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId, getToday } from '../utils/helpers';

interface AttendanceState {
  records: AttendanceRecord[];
  isLoading: boolean;
  loadAttendance: () => Promise<void>;
  markAttendance: (studentId: string, classId: string, present: boolean, notes?: string) => Promise<void>;
  getAttendanceByDate: (date: string, classId?: string) => AttendanceRecord[];
  getStudentAttendance: (studentId: string) => AttendanceRecord[];
  getAttendanceStats: (studentId: string) => { present: number; absent: number; total: number };
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  records: [],
  isLoading: true,

  loadAttendance: async () => {
    const records = await StorageService.get<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE);
    set({ records: records || [], isLoading: false });
  },

  markAttendance: async (studentId, classId, present, notes) => {
    const { records } = get();
    const today = getToday();
    const existingIndex = records.findIndex(
      r => r.studentId === studentId && r.date === today && r.classId === classId
    );

    let updated: AttendanceRecord[];
    if (existingIndex >= 0) {
      updated = records.map((r, i) =>
        i === existingIndex ? { ...r, present, notes } : r
      );
    } else {
      const newRecord: AttendanceRecord = {
        id: generateId(),
        studentId,
        classId,
        date: today,
        present,
        notes,
      };
      updated = [...records, newRecord];
    }

    await StorageService.set(STORAGE_KEYS.ATTENDANCE, updated);
    set({ records: updated });
  },

  getAttendanceByDate: (date, classId) => {
    const { records } = get();
    return records.filter(r => r.date === date && (!classId || r.classId === classId));
  },

  getStudentAttendance: (studentId) => {
    return get().records.filter(r => r.studentId === studentId);
  },

  getAttendanceStats: (studentId) => {
    const studentRecords = get().records.filter(r => r.studentId === studentId);
    const present = studentRecords.filter(r => r.present).length;
    const absent = studentRecords.filter(r => !r.present).length;
    return { present, absent, total: studentRecords.length };
  },
}));
