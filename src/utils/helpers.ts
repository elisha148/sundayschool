import { format, parseISO } from 'date-fns';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy');
};

export const formatTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'h:mm a');
};

export const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`;
};

export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = parseISO(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const getAttendancePercentage = (present: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
};
