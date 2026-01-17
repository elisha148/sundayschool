import { create } from 'zustand';
import { AttendanceRecord } from '../types';
import { AttendanceAPI } from '../services/api';
import { getToday } from '../utils/helpers';

interface AttendanceState {
  records: AttendanceRecord[];
  isLoading: boolean;
  error: string | null;
  loadAttendance: () => Promise<void>;
  loadAttendanceByDate: (date: string) => Promise<void>;
  markAttendance: (studentId: string, classId: string, present: boolean, notes?: string) => Promise<void>;
  bulkMarkAttendance: (classId: string, records: { studentId: string; present: boolean }[]) => Promise<void>;
  getAttendanceByDate: (date: string, classId?: string) => AttendanceRecord[];
  getStudentAttendance: (studentId: string) => AttendanceRecord[];
  getAttendanceStats: (studentId: string) => { present: number; absent: number; total: number };
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  records: [],
  isLoading: true,
  error: null,

  loadAttendance: async () => {
    try {
      set({ isLoading: true, error: null });
      const today = getToday();
      const records = await AttendanceAPI.getByDate(today);
      const mapped = records.map((r: any) => ({ ...r, id: r._id || r.id, studentId: r.studentId?._id || r.studentId }));
      set({ records: mapped, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  loadAttendanceByDate: async (date: string) => {
    try {
      set({ isLoading: true, error: null });
      const records = await AttendanceAPI.getByDate(date);
      const mapped = records.map((r: any) => ({ ...r, id: r._id || r.id, studentId: r.studentId?._id || r.studentId }));
      set({ records: mapped, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  markAttendance: async (studentId, classId, present, notes) => {
    try {
      const today = getToday();
      const record = await AttendanceAPI.mark({ studentId, classId, date: today, present, notes });
      const mapped = { ...record, id: record._id || record.id };
      
      const { records } = get();
      const existingIndex = records.findIndex(r => r.studentId === studentId && r.date === today);
      
      if (existingIndex >= 0) {
        set({ records: records.map((r, i) => i === existingIndex ? mapped : r) });
      } else {
        set({ records: [...records, mapped] });
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  bulkMarkAttendance: async (classId, attendanceRecords) => {
    try {
      const today = getToday();
      await AttendanceAPI.bulkMark(classId, today, attendanceRecords);
      // Reload attendance after bulk update
      await get().loadAttendanceByDate(today);
    } catch (error: any) {
      set({ error: error.message });
    }
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
