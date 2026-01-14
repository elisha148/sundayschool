// User roles
export type UserRole = 'admin' | 'teacher' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
}

// Student
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  classId: string;
  parentIds: string[];
  photoUrl?: string;
  notes?: string;
  createdAt: string;
}

// Class
export interface Class {
  id: string;
  name: string;
  ageGroup: string;
  teacherIds: string[];
  schedule: string;
  room?: string;
}

// Attendance
export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  present: boolean;
  notes?: string;
}

// Lesson Plan
export interface LessonPlan {
  id: string;
  classId: string;
  title: string;
  date: string;
  bibleVerse: string;
  objectives: string[];
  materials: string[];
  activities: string[];
  notes?: string;
  completed: boolean;
}

// Event
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  classIds?: string[]; // empty = all classes
}

// Bible Verse
export interface BibleVerse {
  id: string;
  reference: string;
  text: string;
  date: string;
}

// Progress
export interface StudentProgress {
  id: string;
  studentId: string;
  lessonId: string;
  date: string;
  participation: 1 | 2 | 3 | 4 | 5;
  understanding: 1 | 2 | 3 | 4 | 5;
  memoryVerse: boolean;
  notes?: string;
}

// Notification
export interface Notification {
  id: string;
  title: string;
  message: string;
  targetUserIds?: string[]; // empty = all
  targetRoles?: UserRole[];
  sentAt: string;
  read: boolean;
}
