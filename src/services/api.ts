import AsyncStorage from '@react-native-async-storage/async-storage';

// Production API URL
const API_URL = 'https://sunday-school-api-eobh.onrender.com/api';

// Token storage
const TOKEN_KEY = '@sundayschool/token';

let authToken: string | null = null;

export const setToken = async (token: string) => {
  authToken = token;
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
  if (!authToken) {
    authToken = await AsyncStorage.getItem(TOKEN_KEY);
  }
  return authToken;
};

export const clearToken = async () => {
  authToken = null;
  await AsyncStorage.removeItem(TOKEN_KEY);
};

// API request helper
const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

// Auth API
export const AuthAPI = {
  register: (name: string, email: string, password: string, role: string) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  login: (email: string, password: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request('/auth/me'),

  updateProfile: (data: { name?: string; phone?: string }) =>
    request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Classes API
export const ClassesAPI = {
  getAll: () => request('/classes'),
  getById: (id: string) => request(`/classes/${id}`),
  create: (data: any) => request('/classes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request(`/classes/${id}`, { method: 'DELETE' }),
};

// Students API
export const StudentsAPI = {
  getAll: () => request('/students'),
  getByClass: (classId: string) => request(`/students/class/${classId}`),
  getById: (id: string) => request(`/students/${id}`),
  create: (data: any) => request('/students', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request(`/students/${id}`, { method: 'DELETE' }),
};

// Attendance API
export const AttendanceAPI = {
  getByDate: (date: string) => request(`/attendance/date/${date}`),
  getByClassAndDate: (classId: string, date: string) => request(`/attendance/class/${classId}/date/${date}`),
  getStudentHistory: (studentId: string) => request(`/attendance/student/${studentId}`),
  mark: (data: { studentId: string; classId: string; date: string; present: boolean; notes?: string }) =>
    request('/attendance', { method: 'POST', body: JSON.stringify(data) }),
  bulkMark: (classId: string, date: string, records: { studentId: string; present: boolean; notes?: string }[]) =>
    request('/attendance/bulk', { method: 'POST', body: JSON.stringify({ classId, date, records }) }),
};

// Lessons API
export const LessonsAPI = {
  getAll: () => request('/lessons'),
  getByClass: (classId: string) => request(`/lessons/class/${classId}`),
  getById: (id: string) => request(`/lessons/${id}`),
  create: (data: any) => request('/lessons', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request(`/lessons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  markComplete: (id: string) => request(`/lessons/${id}/complete`, { method: 'PATCH' }),
  delete: (id: string) => request(`/lessons/${id}`, { method: 'DELETE' }),
};

// Events API
export const EventsAPI = {
  getAll: () => request('/events'),
  getUpcoming: () => request('/events/upcoming'),
  getByDate: (date: string) => request(`/events/date/${date}`),
  create: (data: any) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request(`/events/${id}`, { method: 'DELETE' }),
};
